"""
Fallback LLM implementation using NVIDIA's API via the OpenAI client.
"""

import os
from openai import OpenAI

def call_nvidia(prompt: str, timeout: int = 120) -> str:
    """Send a prompt to NVIDIA OpenAI API and return the text response.

    Args:
        prompt: The full prompt (system instructions + diff + rules).
        timeout: HTTP timeout in seconds.

    Returns:
        The text content from the response.
    """
    api_key = os.environ.get("NVIDIA_API_KEY", "")
    
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key,
        timeout=timeout
    )

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            top_p=1,
            max_tokens=4096,
            stream=False
        )
        return completion.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"NVIDIA API call failed: {e}") from e
