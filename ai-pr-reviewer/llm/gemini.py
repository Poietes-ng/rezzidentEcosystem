"""
Thin wrapper around the Gemini REST API (free tier: gemini-2.5-flash).
Uses plain requests so we don't need the heavier google-generativeai SDK.
"""

import os
import time
import requests

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)

# Retry config
MAX_RETRIES = 3
INITIAL_BACKOFF_SECONDS = 10


def call_gemini(prompt: str, api_key: str | None = None, timeout: int = 90) -> str:
    api_key = api_key or os.environ["GEMINI_API_KEY"]

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        resp = requests.post(
            GEMINI_URL,
            params={"key": api_key},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.1,       
                    "responseMimeType": "application/json",
                },
            },
            timeout=timeout,
        )

        if resp.status_code == 429 or resp.status_code >= 500:
            last_error = resp
            if attempt < MAX_RETRIES:
                wait = INITIAL_BACKOFF_SECONDS * (2 ** attempt)
                print(f"Gemini returned {resp.status_code}. Retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})...")
                time.sleep(wait)
                continue
            else:
                print(f"Gemini returned {resp.status_code} after {MAX_RETRIES + 1} attempts. Giving up.")
                resp.raise_for_status()

        resp.raise_for_status()
        data = resp.json()

        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError) as e:
            raise RuntimeError(f"Unexpected Gemini response shape: {data}") from e

    # Should not reach here, but just in case
    raise RuntimeError(f"Gemini call failed after {MAX_RETRIES + 1} attempts: {last_error}")

