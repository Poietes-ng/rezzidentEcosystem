---
name: "[Feature] Backend implementation"
about: An API/backend build task in rezzident_BE.
title: "[Feature]: "
labels: ["backend", "needs-triage"]
assignees: []
---

### Directory
RezzidentEcosystem/apps/rezzident_BE
<!-- e.g. .../api/v1/routes/auth_route.py -->

### Related issue(s)
Relates to: #<frontend issue, if this unblocks a UI wiring ticket>

### Description
<!-- What endpoint(s)/service(s) are being added or changed, and why. -->

### Endpoint(s)
| Method | Path | Auth required | Notes |
|---|---|---|---|
| `POST` | `/api/v1/...` | Yes/No | |

### Requirements
- [ ] Request/response schemas defined in `api/v1/schemas/`
- [ ] Route added under `api/v1/routes/`, thin — business logic lives in `api/v1/services/`
- [ ] Uses `success_response()` for consistent response shape
- [ ] Respects multi-tenant schema routing (`TenantMiddleware`) — no cross-tenant leakage
- [ ] Redis access goes through `api/db/redis.py::get_redis()`, not a new client instance
- [ ] Alembic migration included if models changed (`alembic/versions/`)
- [ ] Input validated with Pydantic; no unvalidated user input reaches the DB layer

### Acceptance Criteria
- [ ] Endpoint(s) implemented and manually verified (Postman/curl or `/docs`).
- [ ] Tests added under `tests/` covering success + at least one failure case.
- [ ] No secrets or credentials hardcoded.
- [ ] Errors return the standard error envelope (see `main.py` exception handlers).

### Expected Outcome
<!-- What "done" looks like — a working, tested endpoint ready to be consumed by FE/MB. -->