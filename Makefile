# ════════════════════════════════════════════════════════════════════════════
# Rezzident Ecosystem — Makefile
# ════════════════════════════════════════════════════════════════════════════
# Usage: make <target>
#        make help       → list all available targets

.DEFAULT_GOAL := help

CYAN  := \033[0;36m
BOLD  := \033[1m
RESET := \033[0m

# ── Self-documenting help ────────────────────────────────────────────────────

.PHONY: help
help: ## Show this help
	@echo ""
	@echo "$(BOLD)Rezzident Ecosystem$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_/]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-22s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ════════════════════════════════════════════════════════════════════════════
# DOCKER — full stack  (docker-compose.yml at repo root)
# ════════════════════════════════════════════════════════════════════════════

.PHONY: up
up: ## Start all services detached
	docker compose up -d

.PHONY: up/build
up/build: ## Rebuild images then start all services detached
	docker compose up -d --build

.PHONY: down
down: ## Stop and remove containers (volumes preserved)
	docker compose down

.PHONY: down/v
down/v: ## Stop containers AND delete named volumes  ⚠ destructive
	docker compose down -v

.PHONY: ps
ps: ## Show container status
	docker compose ps

.PHONY: logs
logs: ## Tail logs for all services  (Ctrl+C to stop)
	docker compose logs -f

.PHONY: logs/api
logs/api: ## Tail API logs only
	docker compose logs -f api

.PHONY: logs/web
logs/web: ## Tail frontend logs only
	docker compose logs -f web

.PHONY: rebuild/api
rebuild/api: ## Rebuild + force-recreate the API container
	docker compose up -d --build --force-recreate api worker

.PHONY: rebuild/web
rebuild/web: ## Rebuild + force-recreate the web container
	docker compose up -d --build --force-recreate web

# ════════════════════════════════════════════════════════════════════════════
# DATABASE
# ════════════════════════════════════════════════════════════════════════════

.PHONY: migrate
migrate: ## Run Alembic migrations  (alembic upgrade head)
	docker compose run --rm migrate

.PHONY: seed
seed: ## Seed estate structure templates  (68 records, idempotent)
	docker compose run --rm seed

.PHONY: migrate/seed
migrate/seed: migrate seed ## Run migrations then seed in sequence

.PHONY: shell/db
shell/db: ## Open a psql shell in the db container
	docker compose exec db psql -U rezzident -d rezzident

# ════════════════════════════════════════════════════════════════════════════
# LOCAL DEV — without Docker  (requires local venv + pnpm)
# ════════════════════════════════════════════════════════════════════════════

.PHONY: dev/be
dev/be: ## Start backend locally with hot-reload  (starts db + redis via Docker)
	docker compose up -d db redis
	cd apps/rezzident_BE && ./venv/bin/uvicorn main:app --reload --port 7001

.PHONY: dev/fe
dev/fe: ## Start frontend dev server
	pnpm --filter rezzident-fe dev

.PHONY: dev/mb
dev/mb: ## Start mobile dev server
	pnpm --filter rezzident-mb dev

# ════════════════════════════════════════════════════════════════════════════
# TEST
# ════════════════════════════════════════════════════════════════════════════

.PHONY: test
test: ## Run all tests  (FE + MB + BE + packages via turbo)
	pnpm test:all

.PHONY: test/fe
test/fe: ## Run frontend tests only
	pnpm --filter rezzident-fe test

.PHONY: test/mb
test/mb: ## Run mobile tests only
	pnpm --filter rezzident-mb test

.PHONY: test/be
test/be: ## Run backend tests only  (pytest -v)
	cd apps/rezzident_BE && ./venv/bin/python -m pytest tests/ -v

# ════════════════════════════════════════════════════════════════════════════
# LINT
# ════════════════════════════════════════════════════════════════════════════

.PHONY: lint
lint: ## Lint all apps  (turbo)
	pnpm lint

.PHONY: lint/be
lint/be: ## Lint backend  (ruff + black --check)
	cd apps/rezzident_BE && ruff check . && black --check .

.PHONY: lint/fe
lint/fe: ## Lint frontend only
	pnpm --filter rezzident-fe lint

.PHONY: lint/mb
lint/mb: ## Lint mobile only
	pnpm --filter rezzident-mb lint

# ════════════════════════════════════════════════════════════════════════════
# FORMAT
# ════════════════════════════════════════════════════════════════════════════

.PHONY: format
format: ## Format all apps  (turbo)
	pnpm format

.PHONY: format/be
format/be: ## Format backend  (ruff --fix + black)
	cd apps/rezzident_BE && ruff check --fix . && black .

.PHONY: format/fe
format/fe: ## Format frontend only
	pnpm --filter rezzident-fe format

# ════════════════════════════════════════════════════════════════════════════
# BUILD
# ════════════════════════════════════════════════════════════════════════════

.PHONY: build
build: ## Build all apps  (turbo)
	pnpm build

.PHONY: build/fe
build/fe: ## Build frontend only
	pnpm build:web

.PHONY: clean
clean: ## Remove build artefacts and node_modules
	pnpm clean