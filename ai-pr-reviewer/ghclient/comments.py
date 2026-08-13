"""
Converts parsed issues into a GitHub PR review with inline comments.

Note: GitHub's review API requires the `line` to correspond to a line
that actually appears in the diff (i.e. it must be a changed/context
line in the current patch), or the comment creation will fail. If a
comment's line isn't valid, we fall back to posting it in the summary
body instead of dropping it silently.
"""

from github.PullRequest import PullRequest

SEVERITY_EMOJI = {
    "Critical": "🔴",
    "High": "🟠",
    "Medium": "🟡",
    "Low": "🔵",
}


def post_review(pr: PullRequest, review: dict) -> None:
    issues = review.get("issues", [])
    summary = review.get("summary", "")

    if not issues:
        pr.create_issue_comment(
            f"## 🤖 AI Review\n\n{summary or 'No issues found. Looks good!'}"
        )
        return

    comments = []
    fallback_lines = []

    commit = list(pr.get_commits())[-1]  # latest commit on the PR

    for issue in issues:
        emoji = SEVERITY_EMOJI.get(issue["severity"], "⚪")
        body = (
            f"{emoji} **{issue['severity']} — {issue['title']}**\n\n"
            f"{issue['description']}\n\n"
            f"**Suggestion:** {issue.get('suggestion', 'N/A')}"
        )
        try:
            comments.append({
                "path": issue["file"],
                "line": issue["line"],
                "body": body,
            })
        except KeyError:
            fallback_lines.append(f"- {issue['file']}:{issue.get('line', '?')} — {body}")

    severities_present = {i["severity"] for i in issues}
    event = "REQUEST_CHANGES" if "Critical" in severities_present or "High" in severities_present else "COMMENT"

    body_summary = f"## 🤖 AI Review\n\n{summary}\n\n{len(issues)} issue(s) found."
    if fallback_lines:
        body_summary += "\n\n**Additional notes:**\n" + "\n".join(fallback_lines)

    try:
        pr.create_review(
            commit=commit,
            body=body_summary,
            event=event,
            comments=comments,
        )
    except Exception as e:
        # If GitHub rejects any comment (e.g. line not in diff), fall back
        # to a single summary comment so the review isn't lost entirely.
        pr.create_issue_comment(
            f"{body_summary}\n\n_(Inline comments failed to post: {e})_"
        )