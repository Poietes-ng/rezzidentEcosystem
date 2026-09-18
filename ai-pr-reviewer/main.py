"""
Entrypoint run by the GitHub Action on every PR event.

LLM Strategy:
  1. Try Claude (primary) — better at code reasoning
  2. Try Gemini with key rotation — cycles through GEMINI_API_KEY,
     GEMINI_API_KEY_2, GEMINI_API_KEY_3, GEMINI_API_KEY_4 (and any
     further numbered keys) before giving up. On 429 for a key, the
     next key is tried immediately rather than wasting time on backoff.
  3. Fall back to NVIDIA if all Gemini keys are exhausted or fail.

Required env vars:
  GITHUB_TOKEN        - Provided automatically by GitHub Actions
  ANTHROPIC_API_KEY   - Claude API key, stored as a repo secret
  GEMINI_API_KEY      - First free-tier Gemini key (primary Gemini key)
  GEMINI_API_KEY_2    - Second Gemini key (optional, tried on 429)
  GEMINI_API_KEY_3    - Third Gemini key  (optional, tried on 429)
  GEMINI_API_KEY_4    - Fourth Gemini key (optional, tried on 429)
  NVIDIA_API_KEY      - NVIDIA NIM key (last-resort fallback)
  GITHUB_REPOSITORY   - "owner/repo", provided automatically by Actions
  PR_NUMBER           - The pull request number (see workflow file)
"""

import logging
import os
import sys

from ghclient.diff import get_pull_request, get_changed_files
from ghclient.comments import post_review
from llm.prompts import build_prompt
from llm.claude import call_claude
from llm.gemini import call_gemini_with_rotation
from llm.nvidia import call_nvidia
from llm.parser import parse_review_response

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def _collect_gemini_keys() -> list[str]:
    """Collect all configured Gemini API keys from environment variables.

    Reads GEMINI_API_KEY (key 1), then GEMINI_API_KEY_2, GEMINI_API_KEY_3, …
    until a gap is found. Returns only non-empty values.

    This means you can add new keys purely via GitHub Secrets without any
    code changes — just add GEMINI_API_KEY_5, _6, etc. as needed.
    """
    keys: list[str] = []

    # First key uses the base name (no suffix) for backwards compatibility
    first = os.environ.get("GEMINI_API_KEY", "").strip()
    if first:
        keys.append(first)

    # Numbered keys: _2, _3, _4, … stop at first missing one
    index = 2
    while True:
        key = os.environ.get(f"GEMINI_API_KEY_{index}", "").strip()
        if not key:
            break
        keys.append(key)
        index += 1

    return keys


def _call_llm(prompt: str) -> str:
    """Call Claude first, then rotate through Gemini keys, then fall back to NVIDIA.

    The chained fallback ensures reviews still happen even if one provider
    is down or rate-limited.
    """
    last_error: Exception | None = None
    tried_providers: list[str] = []

    # ── Primary: Claude ──
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if anthropic_key:
        tried_providers.append("Claude")
        try:
            logger.info("Calling Claude (primary)...")
            return call_claude(prompt, api_key=anthropic_key)
        except Exception as e:
            logger.warning("Claude failed: %s. Falling back to Gemini...", e)
            last_error = e

    # ── Fallback 1: Gemini with key rotation ──
    gemini_keys = _collect_gemini_keys()
    if gemini_keys:
        tried_providers.append(f"Gemini ({len(gemini_keys)} key(s))")
        try:
            logger.info(
                "Calling Gemini (fallback 1) — %d key(s) available...",
                len(gemini_keys),
            )
            return call_gemini_with_rotation(prompt, keys=gemini_keys)
        except Exception as e:
            logger.warning(
                "All Gemini keys exhausted: %s. Falling back to NVIDIA...", e
            )
            last_error = e

    # ── Fallback 2: NVIDIA ──
    nvidia_key = os.environ.get("NVIDIA_API_KEY", "").strip()
    if nvidia_key:
        tried_providers.append("NVIDIA")
        try:
            logger.info("Calling NVIDIA (fallback 2)...")
            return call_nvidia(prompt, api_key=nvidia_key)
        except Exception as e:
            last_error = e

    if last_error is not None:
        raise RuntimeError(
            f"All configured LLM providers failed ({', '.join(tried_providers)}). "
            f"Last error: {last_error}"
        ) from last_error

    raise RuntimeError(
        "No LLM API key available. Set ANTHROPIC_API_KEY, GEMINI_API_KEY, or NVIDIA_API_KEY."
    )


def main():
    token = os.environ["GITHUB_TOKEN"]
    repo_full_name = os.environ["GITHUB_REPOSITORY"]
    pr_number = int(os.environ["PR_NUMBER"])

    pr = get_pull_request(token, repo_full_name, pr_number)

    # pr.get_files() returns every file touched across all commits in the PR
    # — scoped to the PR only, never the wider codebase.
    changed_files = get_changed_files(pr)

    if not changed_files:
        logger.info("No reviewable files changed. Skipping.")
        return

    prompt = build_prompt(changed_files)
    raw_response = _call_llm(prompt)
    review = parse_review_response(raw_response)

    post_review(pr, review)
    logger.info("Posted review with %d issue(s).", len(review["issues"]))


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logger.error("AI review failed: %s", e)
        # Don't fail the whole CI pipeline just because the reviewer errored
        sys.exit(0)