# Contributing to Rezzident Ecosystem

> **The rules of the road for every developer on the team.**
> Read this BEFORE your first PR. Refer back when in doubt.

---

## Table of Contents

- [1. First-Time Setup](#1-first-time-setup)
- [2. Git Workflow](#2-git-workflow)
- [3. Commit Messages](#3-commit-messages)
- [4. Pull Request Process](#4-pull-request-process)
- [5. Code Review](#5-code-review)
- [6. Frontend Guide (rezzident_FE)](#6-frontend-guide-rezzident_fe)
- [7. Backend Guide (rezzident_BE)](#7-backend-guide-rezzident_be)
- [8. Mobile Guide (rezzident_MB)](#8-mobile-guide-rezzident_mb)
- [9. Shared Packages](#9-shared-packages)
- [10. Infrastructure Changes](#10-infrastructure-changes)
- [11. Testing](#11-testing)
- [12. What NOT to Do](#12-what-not-to-do)

---

# 1. First-Time Setup

## Prerequisites

| Tool           | Version  | Check                    | Install                                                |
| -------------- | -------- | ------------------------ | ------------------------------------------------------ |
| Docker         | ≥ 24.0   | `docker --version`       | [docker.com](https://www.docker.com)                   |
| Docker Compose | ≥ 2.20   | `docker compose version` | Bundled with Docker Desktop                            |
| Node.js        | ≥ 20.0.0 | `node -v`                | [nodejs.org](https://nodejs.org)                       |
| pnpm           | ≥ 9.15.0 | `pnpm -v`                | `corepack enable pnpm`                                 |
| Python         | ≥ 3.11   | `python3 --version`      | [python.org](https://www.python.org)                   |
| Git            | Latest   | `git --version`          | `brew install git`, [git-scm.com](https://git-scm.com) |

## Clone and Install

### Option A — Docker (recommended, full stack)

Runs the entire stack with a single command. No local Python or Node setup required.

```bash
# 1. Clone the monorepo
git clone https://github.com/poietesltd/rezzidentEcosystem.git
cd rezzidentEcosystem

# 2. Copy and fill in environment variables
cp .env.example .env
cp apps/rezzident_BE/.env.example apps/rezzident_BE/.env
# Open both files and fill in the required secrets

# 3. Start the full stack
make up           # or: docker compose up

# Services will be available at:
#   Frontend  → http://127.0.0.1:3000
#   API       → http://127.0.0.1:7001
#   API docs  → http://127.0.0.1:7001/docs
#   MinIO     → http://127.0.0.1:9001

# 4. Run migrations + seed (first time only)
make migrate/seed
```

### Option B — Local dev (without Docker)

For working on a single app without rebuilding Docker images.

```bash
# 1. Clone and install Node deps
git clone https://github.com/poietesltd/rezzidentEcosystem.git
cd rezzidentEcosystem
pnpm install

# 2. Set up the backend Python venv
cd apps/rezzident_BE
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
cp .env.example .env        # Fill in your local values
cd ../..

# 3. Start the backend (spins up db + redis via Docker automatically)
make dev/be       # API on http://127.0.0.1:7001

# 4. Start the frontend or mobile separately
make dev/fe       # FE on http://127.0.0.1:3000
make dev/mb       # Mobile (Expo)

# 5. Run backend tests
make test/be
```

Run `make help` at any time to see all available targets.

## Your Editor

Use **VS Code** with these extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Python (Microsoft)
- GitLens

---

# 2. Git Workflow

## Branch Strategy

```text
main ──────────────────────────────────────────── Production-ready
  │
  └── develop ─────────────────────────────────── Integration branch
        │
        ├── feat/auth-otp-screen ──────────────── New features
        ├── fix/phone-validation-bug ──────────── Bug fixes
        ├── chore/add-eslint-mb ───────────────── Tooling/config
        └── docs/update-architecture ──────────── Documentation
```

## Branch Naming Rules

We follow a strict branch naming convention that matches our commit types. Every branch must be prefixed with the type of work being done, followed by a forward slash `/`, and a kebab-case description:

`type/kebab-case-description`

| Branch Prefix | When to Use                                    | Example                      |
| ------------- | ---------------------------------------------- | ---------------------------- |
| `feat/`       | New features or capabilities                   | `feat/payment-gateway`       |
| `fix/`        | Bug fixes                                      | `fix/login-crash`            |
| `chore/`      | Maintenance, dependencies, config              | `chore/update-typescript`    |
| `refactor/`   | Code structure changes (no new features/fixes) | `refactor/extract-auth-hook` |
| `docs/`       | Documentation updates                          | `docs/api-readme`            |
| `test/`       | Adding or fixing tests                         | `test/auth-middleware`       |
| `perf/`       | Performance improvements                       | `perf/optimize-queries`      |
| `style/`      | Code formatting (no logic changes)             | `style/format-json`          |
| `ci/`         | CI/CD pipeline changes                         | `ci/fix-lint-workflow`       |

## Rules

1. **Never push directly to `main` or `develop`**. Always use a PR.
2. **Create feature branches from `develop`**, not from `main`.
3. **Keep branches short-lived.** A branch open for more than 5 days is a problem.
4. **Delete branches after merge.** Since we don't use auto-delete, you should manually clean up your branches once your PR is merged.
   - Remote: Click the "Delete branch" button in the merged PR on GitHub.
   - Local: `git checkout develop && git pull && git branch -d feat/your-feature-name`

## How to Create a Branch

```bash
# Always start from the latest develop
git checkout develop
git pull origin develop

# Create your feature branch using the naming rules
git checkout -b feat/your-feature-name

# Work, commit, push
git add .
git commit -m "feat(auth): add OTP input component"
git push -u origin feat/your-feature-name

# Open a PR on GitHub: feat/your-feature-name → develop
```

---

# 3. Commit Messages

We use **Conventional Commits**. Every commit message follows this format:

```
<type>(<scope>): <short description>

[optional body — explain WHY, not WHAT]
[optional footer — references issues]
```

## Types

| Type       | When to Use                                       | Example                                    |
| ---------- | ------------------------------------------------- | ------------------------------------------ |
| `feat`     | New feature                                       | `feat(auth): add PIN input screen`         |
| `fix`      | Bug fix                                           | `fix(api): handle expired OTP correctly`   |
| `chore`    | Tooling, deps, config                             | `chore(deps): update TanStack to v1.98`    |
| `docs`     | Documentation only                                | `docs: add backend setup instructions`     |
| `style`    | Formatting (no logic change)                      | `style(fe): run Prettier on all files`     |
| `refactor` | Code change that doesn't add features or fix bugs | `refactor(api): extract tenant middleware` |
| `test`     | Adding or fixing tests                            | `test(utils): add phone validator tests`   |
| `ci`       | CI/CD changes                                     | `ci: add backend lint job to workflow`     |

## Scopes

| Scope         | What It Covers                                  |
| ------------- | ----------------------------------------------- |
| `fe`          | Frontend app                                    |
| `be` or `api` | Backend app                                     |
| `mb`          | Mobile app                                      |
| `utils`       | packages/utils                                  |
| `types`       | packages/shared-types                           |
| `tokens`      | packages/design-tokens                          |
| `docker`      | docker-compose.yml, Dockerfiles                 |
| `makefile`    | Makefile                                        |
| `infra`       | infrastructure/, EC2, nginx (production config) |
| `deps`        | Dependency updates                              |
| `ci`          | GitHub Actions workflows                        |
| `github`      | Issue/PR templates, CODEOWNERS, Dependabot      |
| `auth`        | Authentication feature (any app)                |

## Bad vs Good

```
❌  "fixed stuff"
❌  "WIP"
❌  "update"
❌  "changes"

✅  feat(mb): add biometric unlock to login flow
✅  fix(fe): prevent double-submit on join estate form
✅  chore(infra): pin PostgreSQL image to 16.4-alpine
✅  test(utils): add edge cases for validatePhoneNG
```

---

# 4. Pull Request Process

## Before You Open a PR

```
[ ] Your code runs locally without errors
[ ] You ran the linter and fixed all errors:
    make lint/fe      # Frontend
    make lint/mb      # Mobile
    make lint/be      # Backend (ruff + black --check)
[ ] You auto-formatted:
    make format/fe
    make format/be    # ruff --fix + black
[ ] You ran existing tests:
    make test/be
    pnpm --filter @rezzident/utils test
[ ] You wrote tests for new logic (if applicable)
[ ] You didn't commit .env, secrets, or node_modules
[ ] Your branch is up to date with develop
[ ] For DevOps/infra PRs: use ?template=devops.md when opening the PR
```

## PR Title

Same format as commit messages:

```
feat(auth): add OTP verification screen
fix(api): return 404 for non-existent estates
chore(mb): add ESLint config
```

## PR Description Template

The repo has a PR template at `.github/PULL_REQUEST_TEMPLATE/`. Use it. At minimum:

```markdown
## What

Brief description of what this PR does.

## Why

Why this change is needed. Link to issue if applicable.

## How to Test

1. Start the dev server
2. Navigate to /login
3. Enter phone number
4. Verify OTP screen appears

## Screenshots (if UI change)

Before | After
```

## PR Size

| Lines Changed | Rating     | Action                      |
| ------------- | ---------- | --------------------------- |
| < 100         | ✅ Great   | Easy to review              |
| 100-300       | 🟡 OK      | Reviewable in one sitting   |
| 300-500       | ⚠️ Large   | Split if possible           |
| 500+          | 🔴 Too big | MUST split into smaller PRs |

---

# 5. Code Review

## As a Reviewer

1. **Check the PR description first.** Understand WHAT and WHY before reading code.
2. **Run the code locally** for non-trivial changes.
3. **Be specific in feedback.** "This could be better" → "Extract this into a shared hook because X."
4. **Approve if it's good enough**, not if it's perfect. Perfect is the enemy of shipped.
5. **Block only for**: security issues, broken tests, architectural violations.

## As a PR Author

1. **Respond to every comment.** Even if it's just "Done" or "Won't fix because X."
2. **Don't take reviews personally.** The reviewer is reviewing the code, not you.
3. **Re-request review after changes.** Don't just push silently.

## Who Reviews What (CODEOWNERS)

| Path                 | Required Reviewers                        |
| -------------------- | ----------------------------------------- |
| `apps/rezzident_BE/` | @CodewithSegNet, @poietesltd              |
| `apps/rezzident_FE/` | @valentine234-ui, @alaminjibril, @Chiboka |
| `apps/rezzident_MB/` | @Israel-dot-com, @Shakur-Galla            |
| `packages/`          | Depends on package (see CODEOWNERS)       |
| `infrastructure/`    | @CodewithSegNet, @poietesltd              |
| `.github/workflows/` | @CodewithSegNet                           |

---

# 6. Frontend Guide (rezzident_FE)

## Architecture: Feature-Based

```
src/
├── routes/          # File-based routing (THIN — loader + component only)
├── features/        # Business logic, organized by domain
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── index.ts     # Public API for this feature
│   └── dashboard/
├── shared/          # Cross-cutting, NO business logic
│   ├── components/ui/
│   ├── hooks/
│   ├── lib/
│   └── utils/
└── server/          # Server-side functions
```

## Import Rules (Non-Negotiable)

```
✅ routes/       → CAN import from features/ and shared/
✅ features/X/   → CAN import from shared/ and features/X/ (itself)
❌ features/X/   → CANNOT import from features/Y/ (another feature)
✅ shared/       → CAN import from shared/ only (never features/)
```

If two features need to share something → move it to `shared/`.

## Coding Standards

| Do This                           | Not This                             |
| --------------------------------- | ------------------------------------ |
| `function MyComponent()`          | `const MyComponent = () =>`          |
| `interface Props`                 | `type Props`                         |
| `import type { X }` for type-only | `import { X }` when X is only a type |
| `#/shared/utils/cn` (path alias)  | `../../../shared/utils/cn`           |
| Route files < 20 lines            | Business logic in route files        |
| `cn()` for conditional classes    | Template literal class strings       |
| `unknown` and narrow              | `any`                                |

## File Naming

```
PascalCase.tsx      → Components (HeroSection.tsx)
camelCase.ts        → Utilities, hooks (useDebounce.ts)
kebab-case.tsx      → Route files (join-estate.tsx)
UPPER_CASE.ts       → Constants (if standalone file)
*.test.ts           → Tests (next to the file they test)
```

## Generating Routes

We use TanStack Router with file-based routing. The `routeTree.gen.ts` file is automatically generated.
To generate or update the route tree after adding or modifying a route file, run:

```bash
pnpm --filter rezzident-fe run generate-routes
```

_(Never edit `routeTree.gen.ts` manually)_

---

# 7. Backend Guide (rezzident_BE)

## Architecture: Layered

```
apps/rezzident_BE/
├── api/
│   ├── v1/
│   │   ├── routes/      # HTTP endpoints (thin — validation + call service)
│   │   ├── services/    # Business logic
│   │   ├── models/      # SQLAlchemy ORM models
│   │   └── schemas/     # Pydantic request/response schemas
│   ├── middleware/       # CORS, tenant, security headers
│   ├── db/              # Database connections
│   └── utils/           # Settings, JWT, validators
├── tests/               # pytest tests
├── alembic/             # Database migrations
└── scripts/             # Admin utilities
```

## How a Request Flows

```
Client → Nginx → CORS → Session → Tenant → RequestID → SecurityHeaders → Guard
  → Route (validates input with Pydantic schema)
    → Service (business logic, talks to DB)
      → Model (SQLAlchemy ORM query)
    ← Service returns result
  ← Route returns response envelope
Client ← JSON response
```

## Coding Standards

| Do This                                   | Not This                   |
| ----------------------------------------- | -------------------------- |
| Pydantic schemas for ALL request/response | Raw dicts                  |
| Service functions for business logic      | Logic in route handlers    |
| `async def` for I/O operations            | `def` for database queries |
| Type hints on everything                  | Untyped functions          |
| `raise HTTPException(status_code=404)`    | Return `{"error": "..."}`  |
| Use the settings module for config        | `os.getenv()` directly     |

## Database Migrations

```bash
# Create a migration after changing a model
cd apps/rezzident_BE
alembic revision --autogenerate -m "add visitor_phone column"

# Apply migration
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

**Rule**: Never edit a migration that's already been applied on staging/production. Create a new one.

## Running Backend Locally

```bash
# Recommended — starts db + redis via Docker automatically
make dev/be
# Equivalent to:
docker compose up -d db redis
cd apps/rezzident_BE && ./venv/bin/uvicorn main:app --reload --port 7001

# Tests and linting
make test/be                             # pytest -v
make lint/be                             # ruff check + black --check
make format/be                           # ruff --fix + black

# Database
make migrate                             # alembic upgrade head
make seed                                # seed estate structure templates
make shell/db                            # psql shell in db container
```

---

# 8. Mobile Guide (rezzident_MB)

## Architecture: Mirrors FE

```
apps/rezzident_MB/src/
├── app/                   # Expo Router (file-based, THIN)
│   ├── (application)/     # Splash, welcome, join-estate
│   ├── (auth)/            # Phone, OTP, PIN
│   └── (tabs)/            # Main app tabs
├── features/              # Same structure as FE
│   ├── auth/
│   └── application/
├── components/ui/         # Mobile design system
├── lib/                   # API client, utilities
└── types/                 # Type re-exports
```

## Key Differences from FE

| Web (FE)                | Mobile (MB)             |
| ----------------------- | ----------------------- |
| `<div>`                 | `<View>`                |
| `<span>`, `<p>`, `<h1>` | `<Text>`                |
| `<button onClick>`      | `<Pressable onPress>`   |
| `<input>`               | `<TextInput>`           |
| `localStorage`          | `expo-secure-store`     |
| CSS `hover:`            | Doesn't exist on touch  |
| `@media` queries        | `useWindowDimensions()` |

## NativeWind Gotchas

```
⚠️  className only works on RN primitives (View, Text, Pressable)
    For custom components, forward via cn()

⚠️  rounded-xl can be inconsistent on Pressable
    Use style={{ borderRadius: 12 }} as fallback

⚠️  font-bold maps to weight 700, not the DMSans-Bold variant
    Load the bold variant explicitly
```

## Running Mobile Locally

```bash
cd apps/rezzident_MB
pnpm start                    # Expo dev server
pnpm run ios                  # iOS simulator
pnpm run android              # Android emulator
```

---

# 9. Shared Packages

## The 4 Packages

| Package                    | Purpose                          | Used By |
| -------------------------- | -------------------------------- | ------- |
| `@rezzident/design-tokens` | Colors, typography, spacing      | FE, MB  |
| `@rezzident/shared-types`  | TypeScript interfaces            | FE, MB  |
| `@rezzident/api-client`    | Axios client + React Query hooks | FE, MB  |
| `@rezzident/utils`         | Validators, formatters           | FE, MB  |

## How They Work

Packages are **raw TypeScript** — no build step. Apps reference them via `"workspace:*"` in `package.json`. pnpm symlinks the folder, and each app's bundler compiles the TypeScript.

## Rules for Packages

1. **No app-specific code.** If it's only used by FE, it belongs in `apps/rezzident_FE/`.
2. **Export from index.ts.** Every package has a single entry point.
3. **Write tests.** Pure functions like validators and formatters are the easiest to test.
4. **Add types.** Every export should have explicit TypeScript types.

## Running Package Tests

```bash
# From repo root
pnpm --filter @rezzident/utils test

# Or directly
cd packages/utils && npx vitest run
```

---

# 10. Infrastructure Changes

Infrastructure changes require **extra caution**. A bad config can take down all 3 apps.

## What Counts as Infrastructure

- `docker-compose.yml` (root — local dev stack)
- `Makefile`
- `Dockerfile` (in any app)
- `infrastructure/` (production nginx, EC2 config)
- `.github/workflows/`
- `.github/dependabot.yml`
- `.github/CODEOWNERS`
- `turbo.json`
- `pnpm-workspace.yaml`

## Rules for Infrastructure PRs

1. **Always get DevOps lead review** (@CodewithSegNet).
2. **Test locally with `docker compose up`** before pushing.
3. **Use the DevOps PR template** — add `?template=devops.md` when opening the PR.
4. **Document what changed and why** in the PR description, including a rollback plan.
5. **Never change production configs in the same PR as local/staging configs.**
6. **Pin all Docker image tags.** No `:latest`. Dependabot will keep them current.
7. **No hardcoded secrets.** All credentials go in `.env` and are documented in `.env.example`.

---

# 11. Testing

## The Philosophy

> Test what your USER would notice if it broke.

## What to Test

| Layer       | What              | Tool            | Example                             |
| ----------- | ----------------- | --------------- | ----------------------------------- |
| Unit        | Pure functions    | Vitest / pytest | `validatePhoneNG("+2348012345678")` |
| Component   | UI primitives     | Testing Library | `<Button>` renders, fires onClick   |
| Integration | Feature flows     | Testing Library | Login form validates before submit  |
| API         | Endpoint behavior | pytest          | POST /auth/login returns JWT        |

## What NOT to Test

| Don't Test This               | Test This Instead                                   |
| ----------------------------- | --------------------------------------------------- |
| That React renders a `<div>`  | That YOUR component shows the right text            |
| That Tailwind produces CSS    | That YOUR button looks disabled when disabled       |
| That the router navigates     | That clicking "Login" calls `router.push("/login")` |
| Snapshot tests of whole pages | User-visible behavior changes                       |
| Third-party library internals | YOUR integration with them                          |

## Running Tests

```bash
# All tests (from root)
pnpm test

# Per-app
pnpm --filter @rezzident/utils test    # Shared utils
pnpm test:be                           # Backend
pnpm --filter rezzident-fe test        # Frontend (when tests exist)
```

---

# 12. What NOT to Do

| ❌ Never Do This                              | ✅ Do This Instead                                                  |
| --------------------------------------------- | ------------------------------------------------------------------- |
| Commit `.env` files                           | Use `.env.example` with placeholder values                          |
| Push to `main` directly                       | Open a PR to `develop`                                              |
| Use `any` in TypeScript                       | Use `unknown` and narrow the type                                   |
| Write 500+ line PRs                           | Split into logical chunks                                           |
| Skip code review                              | Every PR needs at least 1 approval                                  |
| Install packages globally                     | Use `npx` or add to project `devDependencies`                       |
| Copy-paste code between FE and MB             | Move it to a shared package                                         |
| Hardcode API URLs or secrets                  | Use environment variables, documented in `.env.example`             |
| Ignore CI failures                            | Fix them before merging                                             |
| Use `console.log` for debugging in production | Use proper error handling and the observability stack               |
| Commit `node_modules`                         | It's in `.gitignore` for a reason                                   |
| Edit `routeTree.gen.ts`                       | It's auto-generated. Your changes will be overwritten.              |
| Use `:latest` Docker image tags               | Pin to a specific version — Dependabot keeps them current           |
| Run the runner stage as root in a Dockerfile  | Add `USER node` (or `USER nonroot`) before `CMD`                    |
| Use mutable action tags in workflows (`@v4`)  | Pin to commit SHA — Dependabot manages updates via `github-actions` |
| `cd apps/... && pnpm lint`                    | `make lint/fe`, `make lint/be`, `make lint/mb` from repo root       |

---

## Questions?

If something isn't covered here, ask in the team Slack before guessing. A 2-minute question saves a 2-hour fix.
