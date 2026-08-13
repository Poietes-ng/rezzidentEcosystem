"""
Entrypoint run by the GitHub Action on every PR event.

Required env vars:
  GITHUB_TOKEN     - Provided automatically by GitHub Actions
  GEMINI_API_KEY   - Free-tier Gemini API key, stored as a repo secret
  GITHUB_REPOSITORY - "owner/repo", provided automatically by Actions
  PR_NUMBER        - The pull request number (see workflow file)
"""

import os
import sys

from ghclient.diff import get_pull_request, get_changed_files
from ghclient.comments import post_review
from llm.prompts import build_prompt
from llm.gemini import call_gemini
from llm.parser import parse_review_response


def main():
    token = os.environ["GITHUB_TOKEN"]
    repo_full_name = os.environ["GITHUB_REPOSITORY"]
    pr_number = int(os.environ["PR_NUMBER"])

    pr = get_pull_request(token, repo_full_name, pr_number)
    changed_files = get_changed_files(pr)

    if not changed_files:
        print("No reviewable files changed. Skipping.")
        return

    prompt = build_prompt(changed_files)
    raw_response = call_gemini(prompt)
    review = parse_review_response(raw_response)

    post_review(pr, review)
    print(f"Posted review with {len(review['issues'])} issue(s).")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"AI review failed: {e}", file=sys.stderr)
        # Don't fail the whole CI pipeline just because the reviewer errored
        sys.exit(0)