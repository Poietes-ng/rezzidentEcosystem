This PR contains the implementation of ```[METHOD] /api/v1/...``` [Protected/Unprotected Endpoint]

## Description
<!-- What was built. Mention new endpoints, utility functions, services, dependencies added, and how they fit together. -->

## Related Issue
Closes #
<!--- This project only accepts pull requests related to open issues -->
<!--- If suggesting a new feature or change, please discuss it in an issue first -->
<!--- If fixing a bug, there should be an issue describing it with steps to reproduce -->

## Additions
<!-- New dependencies added to requirements.txt / requirements-dev.txt and why they're needed -->

## Motivation and Context
<!-- Why this change is required, what problem it solves -->

## How Has This Been Tested?
<!-- pytest / httpx / Postman — what scenarios were covered -->
- [ ] Happy path
- [ ] Auth/permission failure case
- [ ] Validation error case
- [ ] Multi-tenant isolation verified (if this touches tenant-scoped data)

#### Test environment
- [ ] Local PostgreSQL + Redis (docker compose)
- [ ] Async test setup (FastAPI + httpx + pytest)

## Screenshots (Postman, FastAPI /docs, etc.)
### Successful response


### Error response


## Types of changes
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)

## Checklist
- [ ] My code follows the code style of this project.
- [ ] My change requires a change to the documentation, and I have made it.
- [ ] I have read the **CONTRIBUTING** document.
- [ ] I have added tests to cover my changes.
- [ ] All new and existing tests pass.
- [ ] New endpoints use `success_response()` and the standard error envelope.
- [ ] New/changed models include an Alembic migration.
- [ ] No secrets, tokens, or credentials are hardcoded or logged.
- [ ] I am only making changes to files relevant to this PR.