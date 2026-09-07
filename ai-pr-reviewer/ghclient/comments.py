"""
Converts parsed issues into a GitHub PR review with inline comments.

GitHub's review API requires every `line` value to correspond to a line
that actually appears in the diff.  A single bad line number causes the
entire batch to be rejected with 422 "Line could not be resolved".

Strategy (most → least inline fidelity):
  1. Try to post everything as one batch review (fast path).
  2. If the batch is rejected, post the summary-only review first so
     the APPROVE / REQUEST_CHANGES event is never lost, then retry each
     inline comment individually.  Comments whose line numbers are still
     rejected by GitHub are collected and appended to a follow-up issue
     comment so no finding is silently dropped.
"""

from github.PullRequest import PullRequest

SEVERITY_EMOJI = {
    "Critical": "🔴",
    "High": "🟠",
    "Medium": "🟡",
    "Low": "🔵",
}


def _format_body(issue: dict) -> str:
    emoji = SEVERITY_EMOJI.get(issue["severity"], "⚪")
    return (
        f"{emoji} **{issue['severity']} — {issue['title']}**\n\n"
        f"{issue['description']}\n\n"
        f"**Suggestion:** {issue.get('suggestion', 'N/A')}"
    )


def _post_individual_comments(
    pr: PullRequest,
    commit,
    comments: list[dict],
) -> list[str]:
    """
    Retry each comment individually after a batch failure.

    Returns a list of fallback strings for comments that still couldn't
    be posted inline (so the caller can surface them in a summary note).
    """
    orphans: list[str] = []
    for c in comments:
        try:
            pr.create_review_comment(
                body=c["body"],
                commit=commit,
                path=c["path"],
                line=c["line"],
            )
        except Exception:
            # Line still not resolvable — surface in the summary instead.
            orphans.append(f"- **{c['path']}:{c['line']}** — {c['body']}")
    return orphans


def post_review(pr: PullRequest, review: dict) -> None:
    issues = review.get("issues", [])
    summary = review.get("summary", "")

    if not issues:
        pr.create_issue_comment(
            f"## 🤖 AI Review\n\n{summary or 'No issues found. Looks good!'}"
        )
        return

    # ── Build comment payloads ──────────────────────────────────────────
    comments: list[dict] = []
    pre_fallback: list[str] = []   # issues missing required fields (rare)

    for issue in issues:
        try:
            comments.append({
                "path": issue["file"],
                "line": issue["line"],
                "body": _format_body(issue),
            })
        except KeyError:
            # Build the fallback string safely — do NOT call _format_body()
            # here because it uses dict subscript access and would raise
            # the same KeyError we just caught.
            emoji = SEVERITY_EMOJI.get(issue.get("severity", ""), "⚪")
            pre_fallback.append(
                f"- {issue.get('file', '?')}:{issue.get('line', '?')} — "
                f"{emoji} **{issue.get('severity', '?')} — {issue.get('title', '?')}** "
                f"{issue.get('description', '')} "
                f"Suggestion: {issue.get('suggestion', 'N/A')}"
            )

    severities_present = {i["severity"] for i in issues}
    event = (
        "REQUEST_CHANGES"
        if "Critical" in severities_present or "High" in severities_present
        else "COMMENT"
    )

    commit = list(pr.get_commits())[-1]  # latest commit on the PR

    body_summary = f"## 🤖 AI Review\n\n{summary}\n\n{len(issues)} issue(s) found."
    if pre_fallback:
        body_summary += "\n\n**Additional notes:**\n" + "\n".join(pre_fallback)

    # ── Fast path: post everything as one batch review ──────────────────
    try:
        pr.create_review(
            commit=commit,
            body=body_summary,
            event=event,
            comments=comments,
        )
        return
    except Exception:
        pass  # fall through to the per-comment retry path

    # ── Fallback: summary-only review + individual comment retry ────────
    # Post the review event first so REQUEST_CHANGES / COMMENT is never
    # lost even if every single inline comment fails.
    try:
        pr.create_review(
            commit=commit,
            body=body_summary,
            event=event,
            comments=[],   # no inline comments — avoids a second 422
        )
    except Exception as e:
        # Absolute last resort: plain issue comment.
        pr.create_issue_comment(
            f"{body_summary}\n\n_(Review event could not be posted: {e})_"
        )
        return

    # Now retry inline comments one by one.
    orphans = _post_individual_comments(pr, commit, comments)

    if orphans:
        pr.create_issue_comment(
            "## 🤖 AI Review — inline comment fallback\n\n"
            "The following findings could not be attached to a specific diff "
            "line (the LLM returned a line number outside the visible diff "
            "hunk).  They are surfaced here so nothing is silently lost:\n\n"
            + "\n\n".join(orphans)
        )