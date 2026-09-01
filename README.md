# Rezzident Ecosystem

> **Next-Generation Multi-Tenant Estate Management SaaS Platform**

---

## Table of Contents

- [Ecosystem Components](#ecosystem-components)
- [System Design (Architecture Overview)](#system-design-architecture-overview)
- [Shared Packages](#shared-packages)
- [Interactive Model Flowchart & Architecture Visualizer](#interactive-model-flowchart--architecture-visualizer)
- [Documentation & Markdown Tools](#documentation--markdown-tools)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Git Commit Rules & Automation](#git-commit-rules--automation)
- [GitHub Templates & Workflows](#github-templates--workflows)
- [Component Guides](#component-guides)

---

## Ecosystem Components

- ⚙️ **[app/rezzident_BE](./apps/rezzident_BE)**: FastAPI Python Backend + fastguard (PostgreSQL Multi-Tenant Schema Isolation, Redis, Paystack Split Payments, JWT + PIN Auth).
- 💻 **[app/rezzident_FE](./apps/rezzident_FE)**: Modern TanStack Start (React + Vite + TailwindCSS) Web Portal (Community & Admin Management Dashboard).
- 📱 **[app/rezzident_MB](./apps/rezzident_MB)**: Expo / React Native Mobile Application (Community & Security Guard App).

---

## System Design (Architecture Overview)

```
┌─────────────────────────────────────────────────────────────────┐
│                     SHARED API LAYER                            │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │  Web Client  │    │ Mobile Client│    │  Admin Dashboard │   │
│  │  (Tanstack)  │    │(React Native)│    │   (Web)          │   │
│  └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘   │
│         │                  │                      │             │
│         └──────────────────┼──────────────────────┘             │
│                            ▼                                    │
│              ┌─────────────────────────┐                        │
│              │    Nginx / Traefik      │  (TLS, rate limit)     │
│              │  (Reverse Proxy + WAF)  │                        │
│              └────────────┬────────────┘                        │
│                           ▼                                     │
│              ┌─────────────────────────┐                        │
│              │  FastAPI + Fastgaurd    │                        │
│              │  api/v1/...             │                        │
│              │  + SaaS Subscription MW │                        │
│              │  + slowapi Rate Limiter │                        │
│              │  + Security Headers MW  │                        │
│              │  + OpenTelemetry        │                        │
│              └──────────┬──────────────┘                        │
│                         │                                       │
│          ┌──────────────┼──────────────────┐                    │
│          ▼              ▼                  ▼                    │
│  ┌──────────────┐ ┌──────────┐ ┌────────────────────┐           │
│  │ PostgreSQL   │ │  Redis   │ │  Background Jobs    │          │
│  │              │ │(Sessions │ │  ( ARQ )            │          │
│  │              │ │ + Cache) │ │  - Email            │          │
│  │              │ │          │ │  - Subscription check│         │
│  └──────────────┘ └──────────┘ └────────────────────┘           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Observability Stack                                    │    │
│  │  Prometheus → Grafana | OTel → Jaeger | Loki (Logs)     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Shared Packages

The monorepo shares code between FE and MB through workspace packages in `/packages/`:

| Package                    | Path                      | Consumed By  | Purpose                                                                                                            |
| -------------------------- | ------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------ |
| `@rezzident/design-tokens` | `packages/design-tokens/` | FE + MB      | Single source of truth for colors, typography, spacing, and border-radius. Both Tailwind configs import from here. |
| `@rezzident/shared-types`  | `packages/shared-types/`  | FE + MB + BE | TypeScript type definitions shared across all apps (auth, estate, user types).                                     |
| `@rezzident/api-client`    | `packages/api-client/`    | FE + MB      | Axios-based API client with React Query hooks (`useAuth`, `useEstates`, etc.).                                     |
| `@rezzident/utils`         | `packages/utils/`         | FE + MB      | Shared utility functions (formatters, validators, constants).                                                      |

### How Shared Packages Work

1. Each package is a standard npm package with its own `package.json` (name scoped as `@rezzident/*`).
2. Apps reference them with `"@rezzident/design-tokens": "workspace:*"` in their `package.json`.
3. pnpm resolves `workspace:*` to the local folder via `pnpm-workspace.yaml`.
4. **No build step required** — packages export raw `.ts` files, and each app's bundler (Vite for FE, Metro for MB) compiles them at dev time.

```
packages/
├── design-tokens/     # colors, fontSize, spacing, borderRadius
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts       # barrel re-export
├── shared-types/      # TypeScript interfaces
├── api-client/        # Axios + React Query hooks
└── utils/             # Shared helpers
```

To add a new token (e.g. a color), edit `packages/design-tokens/colors.ts` — both apps pick it up automatically on next dev server restart.

---

## Interactive Model Flowchart & Architecture Visualizer

Rezzident features an automated interactive visual flowchart application for database models, foreign key connections, schema boundaries, and system workflows.

- **Interactive Flowchart Application**: [models_interactive_flowchart.html](./apps/models_interactive_flowchart.html)
- **Architectural Flowchart Report**: [models_and_system_flowchart_report.md](./docs/models_and_system_flowchart_report.md)

### Contributor Automation Pipeline

The interactive flowchart updates **automatically** whenever backend models are updated, added, or deleted:

1. **Git Pre-Commit Hook**:
   Any staged edit inside `apps/rezzident_BE/api/v1/models/*.py` automatically triggers `.git/hooks/pre-commit` to re-parse the SQLAlchemy AST and stage the updated `models_interactive_flowchart.html`.

2. **FastAPI Development Startup**:
   Starting the FastAPI server (`python main.py`) in development mode auto-generates and refreshes the model graph.

3. **Manual Trigger**:
   Contributors can manually regenerate the flowchart anytime by running:
   ```bash
   python3 apps/rezzident_BE/scripts/generate_model_flowchart.py
   ```

---

## Documentation & Markdown Tools

Rezzident heavily uses Markdown (`.md`) for architecture decisions, guidelines, and project planning.

> **💡 Note:** The [`docs/architecture`](./docs/architecture/01-infrastructure-deployment.md) directory contains all core decisions, architectural guidelines, and execution plans for this project. These are **living documents** and will likely change over time as features evolve and plans adapt based on project requirements and feedback.

### 🌐 Live Documentation Viewer

If you prefer to read the documentation without setting up a Markdown editor, you can access the live, auto-updating web viewer here:
**[https://rezzident-ecosystem-ocx8.vercel.app](https://rezzident-ecosystem-ocx8.vercel.app)**

Depending on your role, here are the recommended tools to read and write documentation seamlessly locally:

### For Developers

- **[Visual Studio Code (VS Code)](https://code.visualstudio.com/)**: The standard IDE. We recommend installing the **Markdown All in One** and **Prettier** extensions for auto-formatting and table-of-contents generation.
- **[MarkdownLint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)**: Enforces standard markdown formatting and prevents broken links.

### For Product

- **[Obsidian](https://obsidian.md/)**: A powerful, visual Markdown editor that lets you view all documentation as an interconnected graph. It works directly with local folders (just open the `docs/` or `kickoff/` folder as an Obsidian Vault).
- **[Typora](https://typora.io/)**: A seamless, distraction-free WYSIWYG (What You See Is What You Get) Markdown editor. You don't need to look at raw syntax; it formats as you type. Highly recommended for non-developers.

---

## Getting Started

The Rezzident ecosystem is a **Turborepo monorepo** using **pnpm** workspaces.

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`npm install -g pnpm`)
- **Python** ≥ 3.11 (for Backend)
- **Docker** (for infrastructure services: PostgreSQL, Redis)

### 1. Install Dependencies

Run this at the root of the project to install all dependencies for frontend, mobile, and shared packages:

```bash
pnpm install
```

For the backend (Python):

```bash
cd apps/rezzident_BE
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Start Infrastructure (Docker)

Spin up PostgreSQL, Redis, and observability services:

```bash
pnpm run infra:up
# Or directly: docker compose -f infrastructure/docker-compose.yml up -d
```

### 3. Start the Entire Ecosystem

To spin up all apps concurrently using Turborepo:

```bash
pnpm run dev
```

This starts:

- **Backend** (FastAPI) on `http://localhost:8000`
- **Frontend** (Vite) on `http://localhost:3000`
- **Mobile** (Expo) on `http://localhost:8082`

### 4. Start Apps Individually

If you want to work on a specific app without starting the others:

**Backend (FastAPI)**:

```bash
cd apps/rezzident_BE && python main.py
```

**Frontend (React/TanStack Start)**:

```bash
pnpm run dev:web
# OR: pnpm --filter rezzident-fe run dev
```

**Mobile (Expo React Native)**:

```bash
pnpm run dev:mobile
# OR: pnpm --filter rezzident-mb run dev
```

To open the mobile app on a specific platform after starting:

- Press `i` → iOS Simulator
- Press `a` → Android Emulator
- Press `w` → Web browser
- Scan QR code → Physical device (Expo Go)

---

## Testing

### Run All Tests

Run every test suite across the entire monorepo in one command:

```bash
pnpm test:all
```

This runs, in order:

1. Frontend tests (Vitest)
2. Mobile tests (Jest)
3. Backend tests (pytest)
4. Shared package tests (Vitest)

### Run Tests Per App

**Frontend (rezzident_FE)** — Vitest + Testing Library:

```bash
pnpm test:fe

# Or directly:
cd apps/rezzident_FE && pnpm test

# Watch mode (re-runs on file changes):
cd apps/rezzident_FE && npx vitest
```

**Mobile (rezzident_MB)** — Jest + Testing Library RN:

```bash
pnpm test:mb

# Or directly:
cd apps/rezzident_MB && pnpm test

# Watch mode:
cd apps/rezzident_MB && npx jest --watch
```

**Backend (rezzident_BE)** — pytest:

```bash
pnpm test:be

# Or directly:
cd apps/rezzident_BE && source venv/bin/activate && python3 -m pytest tests/ -v

# Run a single test file:
cd apps/rezzident_BE && python3 -m pytest tests/test_auth.py -v

# Run with coverage:
cd apps/rezzident_BE && python3 -m pytest tests/ --cov=api --cov-report=term-missing
```

### Run Shared Package Tests

**@rezzident/utils** (validators, formatters):

```bash
pnpm --filter @rezzident/utils test

# Or directly:
cd packages/utils && npx vitest run
```

### Test Summary

| App / Package        | Framework                 | Command                               | Test Files               |
| -------------------- | ------------------------- | ------------------------------------- | ------------------------ |
| **rezzident_FE**     | Vitest + Testing Library  | `pnpm test:fe`                        | `src/**/*.test.{ts,tsx}` |
| **rezzident_MB**     | Jest + Testing Library RN | `pnpm test:mb`                        | `__tests__/**/*.test.ts` |
| **rezzident_BE**     | pytest                    | `pnpm test:be`                        | `tests/test_*.py`        |
| **@rezzident/utils** | Vitest                    | `pnpm --filter @rezzident/utils test` | `*.test.ts`              |
| **All**              | —                         | `pnpm test:all`                       | Everything above         |

---

## Git Commit Rules & Automation

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages. This ensures a readable Git history and enables automated changelog generation.

### Conventional Commit Format

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Optional. The area of the code (e.g., auth, billing, ui).
  │
  └─⫸ The type of change (see below).
```

**Allowed Types:**

- `feat`: A new feature (correlates with a MINOR version bump).
- `fix`: A bug fix (correlates with a PATCH version bump).
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `build`: Changes that affect the build system or external dependencies (example scopes: vite, pnpm).
- `ci`: Changes to our CI configuration files and scripts.
- `chore`: Other changes that don't modify `src` or test files.

**Examples:**

- `feat(auth): implement phone verification`
- `fix(billing): correct invoice calculation error`
- `docs: update API setup instructions`

### Pre-commit Hooks (Husky & lint-staged)

To ensure code quality and prevent formatting arguments, we use **Husky** and **lint-staged** to automatically lint and format your code _before_ it gets committed.

When you run `git commit`, the following happens automatically:

1. **Formatting**: `prettier` runs on all staged files (`.ts`, `.tsx`, `.json`, `.md`), ensuring consistent spacing and automatically sorting Tailwind CSS classes.
2. **Linting**: `eslint --fix` runs on staged frontend/mobile TypeScript files, fixing minor issues and enforcing architecture boundaries (e.g., Feature-Sliced Design).

**Bypassing Hooks (Emergency Only)**:
If you need to save a broken WIP commit, you can bypass the hooks using:

```bash
git commit -m "chore: wip broken state" --no-verify
```

_(Note: Code bypassing these hooks will still fail the CI/CD pipeline on GitHub)._

---

## GitHub Templates & Workflows

The `.github/` directory contains templates and CI/CD workflows that enforce contribution standards.

### Issue Templates

Create structured issues directly from GitHub's **Issues → New Issue** page. Available templates:

| Template               | File                                             | Use For                                         |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------- |
| Bug Report             | `.github/ISSUE_TEMPLATE/bug-report.md`           | Production/staging bugs with reproduction steps |
| Design Issue           | `.github/ISSUE_TEMPLATE/design.md`               | UI/UX design tasks and Figma references         |
| Engineering (Backend)  | `.github/ISSUE_TEMPLATE/engineering-backend.md`  | API endpoints, models, migrations               |
| Engineering (Frontend) | `.github/ISSUE_TEMPLATE/engineering-frontend.md` | Web/mobile UI features, components              |

**How to use**: Go to your repo on GitHub → **Issues** → **New Issue** → Select a template from the list. Fill in the pre-populated sections.

### Pull Request Templates

PRs use role-specific templates. Append the template name to the PR URL:

| Template | URL Parameter           | Use For            |
| -------- | ----------------------- | ------------------ |
| Default  | _(auto-selected)_       | General PRs        |
| Backend  | `?template=backend.md`  | API/model changes  |
| Frontend | `?template=frontend.md` | Web UI changes     |
| Mobile   | `?template=mobile.md`   | Mobile app changes |

**How to use**: When creating a PR, add the template query parameter to the URL:

```
https://github.com/<org>/rezzidentEcosystem/compare/main...your-branch?quick_pull=1&template=backend.md
```

Or navigate to the PR creation page and replace the default template content with the one from `.github/PULL_REQUEST_TEMPLATE/<name>.md`.

### CODEOWNERS

[`.github/CODEOWNERS`](./.github/CODEOWNERS) automatically assigns reviewers based on which files are changed:

| Path                      | Required Reviewers                 |
| ------------------------- | ---------------------------------- |
| `apps/rezzident_BE/`      | `@backend-team`                    |
| `apps/rezzident_FE/`      | `@frontend-team`                   |
| `apps/rezzident_MB/`      | `@mobile-team`                     |
| `packages/shared-types/`  | `@backend-team` + `@frontend-team` |
| `packages/api-client/`    | `@frontend-team` + `@mobile-team`  |
| `packages/design-tokens/` | `@frontend-team` + `@mobile-team`  |

> **Note**: CODEOWNERS only enforces reviews when your GitHub repo has **branch protection** enabled with "Require review from Code Owners" checked.

### CI/CD Workflows

Workflows in `.github/workflows/` run automatically on push/PR events. Check the workflow files for specific triggers and jobs.

---

## Component Guides

Check out the detailed guides in each component directory for deeper development flows:

- [Backend Development Guide](./apps/rezzident_BE/README.md)
- [Frontend Web Guide](./apps/rezzident_FE/README.md)
- [Mobile App Guide](./apps/rezzident_MB/README.md)
