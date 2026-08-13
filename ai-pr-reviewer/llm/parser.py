"""
Parses the LLM's JSON response defensively — models occasionally wrap
JSON in markdown fences or add stray text even when told not to.
"""

import json
import re

VALID_SEVERITIES = {"Critical", "High", "Medium", "Low"}


def parse_review_response(raw_text: str) -> dict:
    cleaned = raw_text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", cleaned.strip())

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Last resort: grab the first {...} block
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            return {"summary": "Could not parse AI response.", "issues": []}
        data = json.loads(match.group(0))

    issues = []
    for issue in data.get("issues", []):
        if issue.get("severity") not in VALID_SEVERITIES:
            issue["severity"] = "Low"
        if "file" in issue and "line" in issue:
            issues.append(issue)

    return {
        "summary": data.get("summary", ""),
        "issues": issues,
    }