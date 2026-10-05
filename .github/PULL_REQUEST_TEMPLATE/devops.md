This PR contains Infrastructure, CI/CD, or DevOps changes.

## Description
<!-- What infrastructure changes are introduced?
     Mention Docker, GitHub Actions, Makefile, scripts, EC2, etc.
     State which services / workflows / files are affected and why. -->

## Related Issue
Closes #
<!-- This project only accepts pull requests related to open issues.
     If suggesting a new change, discuss it in an issue first. -->

## Affected area(s)
- [ ] Docker / Containers (`docker-compose.yml`, `Dockerfile`)
- [ ] CI/CD Pipelines (`.github/workflows/`)
- [ ] Database (migrations, seeds, backups)
- [ ] Developer Experience (`Makefile`, scripts, tooling)
- [ ] Cloud / AWS (EC2, S3, RDS, IAM)
- [ ] Secrets / Environment config (`.env.example`)
- [ ] Observability (logging, metrics, tracing)

## Motivation and Context
<!-- Why are these changes necessary?
     What was broken, slow, or missing before this PR? -->

## Changes
<!-- Briefly describe each changed file and the reason for the change.
     Group by component (Docker, CI, Makefile, etc.) if multiple areas are touched. -->

## Bugs fixed during implementation
<!-- List any unexpected issues discovered and fixed while working on this.
     Include: symptom → root cause → fix -->

## How Has This Been Tested?
<!-- What did you run / verify to confirm this works? -->

- [ ] `docker compose up` — all services start cleanly
- [ ] `make migrate` / `make seed` — exits 0
- [ ] `curl` / browser verification of affected endpoints or pages
- [ ] CI pipeline passing on this branch
- [ ] Deployed to staging environment

## Type of change
- [ ] Bug fix (non-breaking — fixes a broken infra behaviour)
- [ ] New feature (non-breaking — adds new capability)
- [ ] Breaking change (requires manual steps or env changes from other engineers)
- [ ] Refactor / improvement (no functional change)

## Rollback Plan
<!-- What is the recovery path if this change causes a problem in production?
     e.g. "Revert this PR — no schema change, no data migration." -->

## Checklist
- [ ] I have read the **CONTRIBUTING** document.
- [ ] Infrastructure code is formatted and linted.
- [ ] No secrets, tokens, or credentials are hardcoded or logged in any file.
- [ ] All required environment variables are documented in the relevant `.env.example`.
- [ ] Port bindings use `127.0.0.1`, not `0.0.0.0` (where applicable).
- [ ] One-shot services (`migrate`, `seed`) use `restart: "no"`.
- [ ] README or runbook updated if the developer workflow has changed.
- [ ] I am only making changes to files relevant to this PR.
