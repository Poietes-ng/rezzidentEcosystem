"""
Thin wrapper around the Gemini REST API (gemini-3.6-flash).
Uses plain requests so we don't need the heavier google-generativeai SDK.

NOTE: gemini-2.5-flash was retired for new users; migrated to gemini-3.6-flash.
Gemini 3.x models also deprecated temperature, top_p, and top_k — don't add
them back to generationConfig. Steer output via the prompt instead.

Key rotation:
  call_gemini_with_rotation() accepts a list of API keys and tries them in
  order. On 429 (rate-limit), it immediately moves to the next key rather
  than wasting time on backoff for the same exhausted key. On 5xx (server
  errors), it retries the current key with exponential backoff as before.
"""

import logging
import time
import requests

logger = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-3.6-flash"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)

# Retry config for 5xx server errors (not applied to 429 — we rotate instead)
MAX_SERVER_RETRIES = 3
INITIAL_BACKOFF_SECONDS = 10


def call_gemini(prompt: str, api_key: str, timeout: int = 90) -> str:
    """Call Gemini with a single API key.

    Retries up to MAX_SERVER_RETRIES times on 5xx server errors with
    exponential backoff. Raises immediately on 429 so the caller can
    rotate to the next key.
    """
    last_error = None
    for attempt in range(MAX_SERVER_RETRIES + 1):
        resp = requests.post(
            GEMINI_URL,
            params={"key": api_key},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                },
            },
            timeout=timeout,
        )

        # 429 → caller should rotate to next key immediately, no backoff here
        if resp.status_code == 429:
            resp.raise_for_status()

        # 5xx → worth retrying the same key with backoff
        if resp.status_code >= 500:
            last_error = resp
            if attempt < MAX_SERVER_RETRIES:
                wait = INITIAL_BACKOFF_SECONDS * (2 ** attempt)
                logger.warning(
                    "Gemini returned %s. Retrying in %ss (attempt %d/%d)...",
                    resp.status_code, wait, attempt + 1, MAX_SERVER_RETRIES,
                )
                time.sleep(wait)
                continue
            else:
                logger.warning(
                    "Gemini returned %s after %d attempts. Giving up.",
                    resp.status_code, MAX_SERVER_RETRIES + 1,
                )
                resp.raise_for_status()

        resp.raise_for_status()
        data = resp.json()

        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError) as e:
            raise RuntimeError(f"Unexpected Gemini response shape: {data}") from e

    raise RuntimeError(f"Gemini call failed after {MAX_SERVER_RETRIES + 1} attempts: {last_error}")


def call_gemini_with_rotation(prompt: str, keys: list[str], timeout: int = 90) -> str:
    """Try each Gemini API key in order, rotating on 429 rate-limit errors.

    Strategy:
      - 429 (rate-limited): immediately move to the next key — no backoff.
        Free-tier limits reset after 60 seconds; waiting 10s on the same
        exhausted key doesn't help.
      - 5xx (server error): retry the current key with exponential backoff
        (handled inside call_gemini).
      - Any other error: treated as fatal for that key, rotate to next.

    Raises RuntimeError if all keys are exhausted.
    """
    if not keys:
        raise RuntimeError("No Gemini API keys provided.")

    last_error: Exception | None = None
    for i, key in enumerate(keys):
        key_label = f"key {i + 1}/{len(keys)}"
        try:
            logger.info("Calling Gemini (%s)...", key_label)
            return call_gemini(prompt, api_key=key, timeout=timeout)
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 429:
                logger.warning(
                    "Gemini %s hit 429 (rate-limited). Trying next key...", key_label
                )
            else:
                logger.warning(
                    "Gemini %s failed with HTTP error: %s. Trying next key...", key_label, e
                )
            last_error = e
        except Exception as e:
            logger.warning(
                "Gemini %s failed: %s. Trying next key...", key_label, e
            )
            last_error = e

    raise RuntimeError(
        f"All {len(keys)} Gemini API key(s) failed. Last error: {last_error}"
    ) from last_error