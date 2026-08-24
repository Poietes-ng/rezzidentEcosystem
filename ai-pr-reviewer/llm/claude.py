"""
Thin wrapper around the Anthropic Messages API (Claude).
Primary LLM for code review — Gemini is used as fallback.

Uses plain requests (same pattern as gemini.py) to keep
dependencies minimal in the CI environment.
"""

import os
import time
import requests

CLAUDE_MODEL = "claude-sonnet-5"
CLAUDE_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"

# Retry config
MAX_RETRIES = 3
INITIAL_BACKOFF_SECONDS = 5


def call_claude(prompt: str, api_key: str | None = None, timeout: int = 120) -> str:
    """Send a prompt to Claude and return the text response.

    Args:
        prompt: The full prompt (system instructions + diff + rules).
        api_key: Anthropic API key (falls back to ANTHROPIC_API_KEY env var).
        timeout: HTTP timeout in seconds.

    Returns:
        The text content from Claude's response.

    Raises:
        RuntimeError: If the API call fails after all retries.
    """
    api_key = api_key or os.environ.get("ANTHROPIC_API_KEY", "")

    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not set — cannot call Claude.")

    headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key,
        "anthropic-version": ANTHROPIC_VERSION,
    }

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            resp = requests.post(
                CLAUDE_URL,
                headers=headers,
                json={
                    "model": CLAUDE_MODEL,
                    "max_tokens": 4096,
                    # NOTE: Claude Sonnet 5 rejects non-default temperature/top_p/top_k
                    # with an HTTP 400 (adaptive thinking replaces manual sampling
                    # control). Don't add temperature back here — steer style via the
                    # prompt instead. See Anthropic's Sonnet 5 migration guide.
                    "messages": [
                        {"role": "user", "content": prompt},
                    ],
                },
                timeout=timeout,
            )
        except requests.exceptions.RequestException as e:
            last_error = e
            if attempt < MAX_RETRIES:
                wait = INITIAL_BACKOFF_SECONDS * (2 ** attempt)
                print(f"Claude request error: {e}. Retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})...")
                time.sleep(wait)
                continue
            raise RuntimeError(f"Claude request failed after {MAX_RETRIES + 1} attempts: {e}") from e

        if resp.status_code == 429 or resp.status_code >= 500:
            last_error = resp
            if attempt < MAX_RETRIES:
                wait = INITIAL_BACKOFF_SECONDS * (2 ** attempt)
                print(f"Claude returned {resp.status_code}. Retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})...")
                time.sleep(wait)
                continue
            else:
                print(f"Claude returned {resp.status_code} after {MAX_RETRIES + 1} attempts. Giving up.")
                resp.raise_for_status()

        resp.raise_for_status()
        data = resp.json()

        try:
            return data["content"][0]["text"]
        except (KeyError, IndexError) as e:
            raise RuntimeError(f"Unexpected Claude response shape: {data}") from e

    raise RuntimeError(f"Claude call failed after {MAX_RETRIES + 1} attempts: {last_error}")
