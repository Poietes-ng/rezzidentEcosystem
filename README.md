# Rezzident Ecosystem

> **Next-Generation Multi-Tenant Estate Management SaaS Platform**

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

| Package | Path | Consumed By | Purpose |
|---|---|---|---|
| `@rezzident/design-tokens` | `packages/design-tokens/` | FE + MB | Single source of truth for colors, typography, spacing, and border-radius. Both Tailwind configs import from here. |
| `@rezzident/shared-types` | `packages/shared-types/` | FE + MB + BE | TypeScript type definitions shared across all apps (auth, estate, user types). |
| `@rezzident/api-client` | `packages/api-client/` | FE + MB | Axios-based API client with React Query hooks (`useAuth`, `useEstates`, etc.). |
| `@rezzident/utils` | `packages/utils/` | FE + MB | Shared utility functions (formatters, validators, constants). |

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

## GitHub Templates & Workflows

The `.github/` directory contains templates and CI/CD workflows that enforce contribution standards.

### Issue Templates

Create structured issues directly from GitHub's **Issues → New Issue** page. Available templates:

| Template | File | Use For |
|---|---|---|
| Bug Report | `.github/ISSUE_TEMPLATE/bug-report.md` | Production/staging bugs with reproduction steps |
| Design Issue | `.github/ISSUE_TEMPLATE/design.md` | UI/UX design tasks and Figma references |
| Engineering (Backend) | `.github/ISSUE_TEMPLATE/engineering-backend.md` | API endpoints, models, migrations |
| Engineering (Frontend) | `.github/ISSUE_TEMPLATE/engineering-frontend.md` | Web/mobile UI features, components |

**How to use**: Go to your repo on GitHub → **Issues** → **New Issue** → Select a template from the list. Fill in the pre-populated sections.

### Pull Request Templates

PRs use role-specific templates. Append the template name to the PR URL:

| Template | URL Parameter | Use For |
|---|---|---|
| Default | *(auto-selected)* | General PRs |
| Backend | `?template=backend.md` | API/model changes |
| Frontend | `?template=frontend.md` | Web UI changes |
| Mobile | `?template=mobile.md` | Mobile app changes |

**How to use**: When creating a PR, add the template query parameter to the URL:
```
https://github.com/<org>/rezzidentEcosystem/compare/main...your-branch?quick_pull=1&template=backend.md
```

Or navigate to the PR creation page and replace the default template content with the one from `.github/PULL_REQUEST_TEMPLATE/<name>.md`.

### CODEOWNERS

[`.github/CODEOWNERS`](./.github/CODEOWNERS) automatically assigns reviewers based on which files are changed:

| Path | Required Reviewers |
|---|---|
| `apps/rezzident_BE/` | `@backend-team` |
| `apps/rezzident_FE/` | `@frontend-team` |
| `apps/rezzident_MB/` | `@mobile-team` |
| `packages/shared-types/` | `@backend-team` + `@frontend-team` |
| `packages/api-client/` | `@frontend-team` + `@mobile-team` |
| `packages/design-tokens/` | `@frontend-team` + `@mobile-team` |

> **Note**: CODEOWNERS only enforces reviews when your GitHub repo has **branch protection** enabled with "Require review from Code Owners" checked.

### CI/CD Workflows

Workflows in `.github/workflows/` run automatically on push/PR events. Check the workflow files for specific triggers and jobs.

---

## Component Guides

Check out the detailed guides in each component directory for deeper development flows:
- [Backend Development Guide](./apps/rezzident_BE/README.md)
- [Frontend Web Guide](./apps/rezzident_FE/README.md)
- [Mobile App Guide](./apps/rezzident_MB/README.md)
