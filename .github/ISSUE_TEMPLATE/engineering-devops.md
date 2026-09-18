---
name: "[DevOps] Infrastructure / CI / Tooling"
about: A Docker, CI/CD, GitHub Actions, scripting, or developer tooling task.
title: "[DevOps]: "
labels: ["devops", "infrastructure", "needs-triage"]
assignees: []
---

### Directory
`RezzidentEcosystem/` — narrow it further if useful:
<!-- e.g. docker-compose.yml / .github/workflows/ / Makefile / infrastructure/ -->

### Related issue(s)
Relates to: #<!-- link upstream issue if this unblocks another team -->

---

### Problem
<!-- What is broken, missing, or painful right now? Be specific.
     e.g. "There is no single command to start the full stack locally."
     e.g. "The CI pipeline re-installs pnpm dependencies on every run — no cache." -->

---

### Description
<!-- What needs to be built or changed, and why.
     State the scope clearly: local dev / CI / staging / production.
     Mention which files / services / workflows are affected. -->

---

### Affected area(s)
- [ ] Docker / Containers (`docker-compose.yml`, `Dockerfile`)
- [ ] CI/CD Pipelines (`.github/workflows/`)
- [ ] Database (migrations, seeds, backups)
- [ ] Developer Experience (`Makefile`, scripts, tooling)
- [ ] Cloud / AWS (EC2, S3, RDS, IAM)
- [ ] Secrets / Environment config (`.env.example`, Vault)
- [ ] Observability (logging, metrics, tracing)

---

### Requirements
<!-- List every concrete thing that must be true when this is done.
     Be specific enough that any engineer can pick this up cold. -->
- [ ]
- [ ]
- [ ]

---

### Acceptance Criteria
- [ ] `docker compose up` (or equivalent) completes without errors — no manual steps required.
- [ ] All affected environment variables are documented in the relevant `.env.example` file(s).
- [ ] No secrets, credentials, or tokens are hardcoded in any committed file.
- [ ] CI pipeline passes on the feature branch.
- [ ] README / runbook updated if the developer workflow changes.

---

### Rollback plan
<!-- What is the recovery path if this change causes a problem?
     e.g. "Revert this PR — no schema changes, no data migration." -->

---

### Expected Outcome
<!-- One paragraph: what does the working result look like?
     e.g. "Any engineer can clone the repo, copy .env.example → .env, run `make up`,
     and have the full Rezzident stack running locally within 5 minutes." -->
