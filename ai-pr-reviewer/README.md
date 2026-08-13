# AI PR Reviewer

A self-hosted, $0/month AI code reviewer for GitHub pull requests, built on
GitHub Actions + Gemini's free API tier. Works with private repos.

## Setup (5 minutes)

1. **Copy this whole `ai-pr-reviewer/` folder into the root of your repository.**
   (The `.github/workflows/ai-review.yml` file must live at that exact path —
   if your repo already has a `.github/` folder, merge the `workflows/`
   subfolder in rather than overwriting it.)

2. **Get a free Gemini API key**: https://aistudio.google.com/app/apikey

3. **Add the key as a repo secret**:
   Repo → Settings → Secrets and variables → Actions → New repository secret
   - Name: `GEMINI_API_KEY`
   - Value: (your key)

   You do NOT need to add `GITHUB_TOKEN` — GitHub provides that automatically.

4. **Open a pull request.** The action runs automatically and posts inline
   review comments within ~30-60 seconds.

## Customizing the rules

Edit the YAML files in `rules/`:
- `global.yml` — rules that apply to every file
- `rezzident.yml` — conventions specific to this codebase (multi-tenant
  schema routing, the `success_response()` contract, pooled Redis usage,
  `shared/components/ui` reuse, migration safety) — loaded unconditionally,
  same as `global.yml`, since it spans both backend and frontend files
- `backend.yml` — Python/FastAPI-specific rules
- `frontend.yml` — React-specific rules
- `devops.yml` — Docker/CI rules
- `database.yml` — migration/schema rules

Add a new stack (e.g. `mobile.yml`) and wire it into
`llm/prompts.py::detect_stack()` and `build_prompt()` the same way
`rezzident.yml` was wired in.

Edit `prompts/system.md` to change the reviewer's persona, tone, or scope
(e.g. add "Ignore TODO comments" or "Flag missing docstrings").

## How review severity maps to PR status

- Any `Critical` or `High` issue → review posted as **Request Changes**
- Otherwise → review posted as a **Comment** (non-blocking)

Adjust this logic in `ghclient/comments.py::post_review()`.

## Project structure

```
ai-pr-reviewer/
├── main.py                    # entrypoint run by the GitHub Action
├── requirements.txt
├── .github/workflows/ai-review.yml
├── prompts/
│   └── system.md              # reviewer persona/instructions
├── rules/
│   ├── global.yml
│   ├── rezzident.yml          # this codebase's own conventions
│   ├── backend.yml
│   ├── frontend.yml
│   ├── devops.yml
│   └── database.yml
├── ghclient/                  # GitHub API interactions
│   ├── diff.py                 # fetch changed files/diff
│   └── comments.py             # post review back to PR
└── llm/
    ├── gemini.py                # Gemini API call
    ├── prompts.py                # builds the prompt from rules + diff
    └── parser.py                  # defensively parses model's JSON output
```

## Extending it (roadmap ideas)

- **Repo-wide context**: currently only the diff is sent. For deeper checks
  (e.g. "does this violate our Repository pattern?") you'd fetch a few
  related files too — but watch your token budget, this is what keeps
  costs at $0.
- **Swap Gemini for Claude**: replace `llm/gemini.py` with a Claude API call
  (`claude-sonnet-4-6` via `/v1/messages`) — same JSON-in, JSON-out contract.
- **Auto-fix mode**: have the model also return a diff/patch per issue, and
  open a follow-up PR applying it.
- **Turn into a GitHub App** instead of a per-repo Action, so it installs
  across your whole org with one click instead of copying this folder
  into every repo.
- **Shared-packages rules**: once `packages/api-client`, `packages/shared-types`,
  etc. are live (see `SETUP.md`), add a `shared-packages` section to
  `rezzident.yml` covering breaking type changes and missing corresponding
  `shared-types` interfaces for new `api-client` methods.

## Known limitations

- GitHub's review API requires inline comment `line` numbers to fall within
  the diff hunk. If the model gives a line the API rejects, the reviewer
  falls back to posting that issue in the summary comment instead of
  failing the whole review.
- Gemini's free tier has rate limits (requests/minute and requests/day).
  On a very active repo you may hit them — see
  https://ai.google.dev/gemini-api/docs/rate-limits