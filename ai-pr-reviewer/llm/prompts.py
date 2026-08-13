"""
Builds the prompt sent to the LLM: system instructions + your team's
rules + the actual diff content.
"""

import os
import yaml

RULES_DIR = os.path.join(os.path.dirname(__file__), "..", "rules")
PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")


def load_yaml(name: str) -> dict:
    path = os.path.join(RULES_DIR, f"{name}.yml")
    if not os.path.exists(path):
        return {}
    with open(path) as f:
        return yaml.safe_load(f) or {}


def load_text(dir_path: str, name: str) -> str:
    path = os.path.join(dir_path, f"{name}.md")
    if not os.path.exists(path):
        return ""
    with open(path) as f:
        return f.read()


def detect_stack(filename: str) -> str:
    """Very simple heuristic router — expand this as your stack grows."""
    # Multi-tenant migration runner — always worth a closer look, same
    # bucket as other database-risk files.
    if filename.endswith("scripts/migrate_all_tenants.py"):
        return "database"
    # Database: SQL files and Alembic migration scripts
    if filename.endswith(".sql") or filename.startswith("alembic/versions/"):
        return "database"
    if filename.endswith((".py",)):
        return "backend"
    if filename.endswith((".ts", ".tsx", ".js", ".jsx")):
        return "frontend"
    if filename in ("Dockerfile",) or filename.endswith((".yml", ".yaml")):
        return "devops"
    return "general"


def build_prompt(changed_files: list[dict]) -> str:
    system = load_text(PROMPTS_DIR, "system")
    global_rules = load_yaml("global")
    rezzident_rules = load_yaml("rezzident")
    backend_rules = load_yaml("backend")
    frontend_rules = load_yaml("frontend")
    devops_rules = load_yaml("devops")
    database_rules = load_yaml("database")

    # Figure out which rule sets are actually relevant to this PR
    stacks_touched = {detect_stack(f["filename"]) for f in changed_files}

    # Global + Rezzident-specific conventions apply to every PR regardless
    # of which stack it touches (the tenant-isolation and shared-UI rules
    # in particular span backend AND frontend files).
    rules_section = f"## Global rules\n{yaml.dump(global_rules)}\n"
    rules_section += f"\n## Rezzident-specific conventions\n{yaml.dump(rezzident_rules)}\n"

    if "backend" in stacks_touched:
        rules_section += f"\n## Backend rules\n{yaml.dump(backend_rules)}\n"
    if "frontend" in stacks_touched:
        rules_section += f"\n## Frontend rules\n{yaml.dump(frontend_rules)}\n"
    if "devops" in stacks_touched:
        rules_section += f"\n## DevOps rules\n{yaml.dump(devops_rules)}\n"
    if "database" in stacks_touched:
        rules_section += f"\n## Database rules\n{yaml.dump(database_rules)}\n"

    diffs_section = ""
    for f in changed_files:
        diffs_section += (
            f"\n### File: {f['filename']} ({f['status']}, "
            f"+{f['additions']}/-{f['deletions']})\n```diff\n{f['patch']}\n```\n"
        )

    return f"""{system}

{rules_section}

# Pull Request Diff

Review ONLY the changed lines below. Reference exact line numbers from
the diff hunks (the numbers after the `@@` markers).

{diffs_section}

# Output format

Return ONLY valid JSON, no markdown fences, no commentary, matching this schema:

{{
  "summary": "1-2 sentence overall assessment",
  "issues": [
    {{
      "file": "path/to/file.py",
      "line": 42,
      "severity": "Critical|High|Medium|Low",
      "title": "Short title",
      "description": "What is wrong and why it matters",
      "suggestion": "Concrete fix"
    }}
  ]
}}

If there are no issues, return an empty "issues" array.
"""