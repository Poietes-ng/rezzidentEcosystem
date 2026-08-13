"""
Fetches the changed files + diffs for a pull request.
We deliberately send ONLY the diff (not the whole repo) to keep
prompt size and API cost down.
"""

from github import Github
from github.PullRequest import PullRequest


# File extensions we don't want to bother reviewing (lockfiles, binaries, etc.)
IGNORED_EXTENSIONS = {
    ".lock", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".woff", ".woff2", ".ttf", ".min.js", ".map",
}

IGNORED_FILENAMES = {
    "package-lock.json", "yarn.lock", "poetry.lock", "Pipfile.lock",
}


def get_pull_request(token: str, repo_full_name: str, pr_number: int) -> PullRequest:
    gh = Github(token)
    repo = gh.get_repo(repo_full_name)
    return repo.get_pull(pr_number)


def _should_review(filename: str) -> bool:
    if filename in IGNORED_FILENAMES:
        return False
    for ext in IGNORED_EXTENSIONS:
        if filename.endswith(ext):
            return False
    return True


def get_changed_files(pr: PullRequest):
    """
    Returns a list of dicts: [{filename, status, patch, additions, deletions}, ...]
    `patch` is the unified diff for that file (None for binary files).
    """
    files = []
    for f in pr.get_files():
        if not _should_review(f.filename):
            continue
        if f.patch is None:
            # Binary file or too large for GitHub to generate a patch
            continue
        files.append({
            "filename": f.filename,
            "status": f.status,          # added / modified / removed / renamed
            "patch": f.patch,             # unified diff text
            "additions": f.additions,
            "deletions": f.deletions,
        })
    return files