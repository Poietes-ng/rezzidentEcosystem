"""
Entrypoint run by the GitHub Action on every PR event.

LLM Strategy:
  1. Try Claude (primary) — better at code reasoning
  2. Try Gemini (free tier) if Claude fails
  3. Fall back to NVIDIA if Gemini fails

Required env vars:
  GITHUB_TOKEN      - Provided automatically by GitHub Actions
  ANTHROPIC_API_KEY - Claude API key, stored as a repo secret
  GEMINI_API_KEY    - Free-tier Gemini API key (fallback)
  GITHUB_REPOSITORY - "owner/repo", provided automatically by Actions
  PR_NUMBER         - The pull request number (see workflow file)
"""

import os
import sys

from ghclient.diff import get_pull_request, get_changed_files
from ghclient.comments import post_review
from llm.prompts import build_prompt
from llm.claude import call_claude
from llm.gemini import call_gemini
from llm.nvidia import call_nvidia
from llm.parser import parse_review_response


def _call_llm(prompt: str) -> str:
    """Call Claude first, fall back to Gemini if Claude fails.

    The fallback ensures reviews still happen even if one provider
    is down or the API key is missing/expired.
    """
    # ── Primary: Claude ──
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if anthropic_key:
        try:
            print("Calling Claude (primary)...")
            return call_claude(prompt, api_key=anthropic_key)
        except Exception as e:
            print(f"Claude failed: {e}. Falling back to Gemini...")

    # ── Fallback 1: Gemini ──
    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    if gemini_key:
        try:
            print("Calling Gemini (fallback 1)...")
            return call_gemini(prompt, api_key=gemini_key)
        except Exception as e:
            print(f"Gemini failed: {e}. Falling back to NVIDIA...")

    # ── Fallback 2: NVIDIA ──
    nvidia_key = os.environ.get("NVIDIA_API_KEY", "")
    if nvidia_key:
        try:
            print("Calling NVIDIA (fallback 2)...")
            return call_nvidia(prompt, api_key=nvidia_key)
        except Exception as e:
            raise RuntimeError(f"All LLM providers (Claude, Gemini, NVIDIA) failed. Last error: {e}") from e

    raise RuntimeError(
        "No LLM API key available. Set ANTHROPIC_API_KEY, GEMINI_API_KEY, or use NVIDIA fallback."
    )


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
    raw_response = _call_llm(prompt)
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