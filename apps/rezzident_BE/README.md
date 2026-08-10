# Rezzident Backend — `rezzident_BE`

Estate Management SaaS Platform — FastAPI Backend (V2)

## Prerequisites

- Python 3.11+
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose (recommended)

## Quick Start (Docker)

```bash
# 1. Copy environment file
cp .env.example .env
# Edit .env with your actual values (especially SECRET_KEY)

# 2. Start all services
docker compose up -d

# 3. Run database migrations
docker compose exec api alembic upgrade head

# 4. Create super admin (first time only)
docker compose exec api python scripts/create_superadmin.py

# API is now running at http://localhost:7001
# Docs at http://localhost:7001/docs
```

## Quick Start (Local Development)

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements-dev.txt

# 3. Copy and configure environment
cp .env.example .env
# Edit .env — at minimum set DB_URL and SECRET_KEY

# 4. Start PostgreSQL and Redis (via Docker or locally)
docker compose up postgres redis -d

# 5. Run migrations
alembic upgrade head

# 6. Start development server
python main.py
# or: uvicorn main:app --reload --port 7001
```

## Project Structure

```
rezzident_BE/
├── main.py                     # FastAPI app + middleware + exception handlers
├── alembic.ini                 # Alembic migration config
├── alembic/                    # Database migrations
│   ├── env.py                  # Multi-tenant aware
│   └── versions/               # Auto-generated migration files
├── api/
│   ├── core/                   # Base classes, constants, dependencies
│   ├── db/                     # Database engine, tenant context
│   ├── loggers/                # Structured logging
│   ├── middleware/             # V2: Security, RequestID, Tenant
│   ├── utils/                  # Settings, JWT, validators, pagination
│   └── v1/
│       ├── models/             # SQLAlchemy models (public + tenant)
│       ├── routes/             # API endpoints
│       ├── schemas/            # Pydantic V2 request/response models
│       └── services/           # Business logic
├── scripts/                    # Operational scripts
├── tests/                      # pytest test suite
├── docker-compose.yml          # PostgreSQL + Redis + MinIO + API
├── Dockerfile                  # Multi-stage production build
├── requirements.txt            # Production dependencies
└── requirements-dev.txt        # Development dependencies
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome / root |
| GET | `/api/v1/healthz` | Liveness probe |
| GET | `/api/v1/readyz` | Readiness probe (DB + Redis) |
| POST | `/api/v1/auth/register/request-otp` | Send OTP for registration |
| POST | `/api/v1/auth/register/verify-otp` | Verify OTP |
| POST | `/api/v1/auth/register/set-pin` | Complete registration |
| POST | `/api/v1/auth/login/request-otp` | Send OTP for login |
| POST | `/api/v1/auth/login/verify-otp` | Verify login OTP |
| POST | `/api/v1/auth/login/verify-pin` | Verify PIN → get tokens |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout (blacklist tokens) |
| GET | `/api/v1/auth/me` | Current user profile |
| POST | `/api/v1/webhooks/paystack` | Paystack payment webhook |

## Architecture

- **Multi-tenancy**: Schema-per-tenant via `schema_translate_map`
- **Auth**: Phone OTP → PIN → JWT (15-min access + 7-day refresh)
- **Security**: OWASP headers, request tracing, attack detection
- **Payments**: Paystack split payments via subaccounts

## Running Tests

```bash
pytest
```

## Environment Variables

See `.env.example` for the complete list of required environment variables.

## Coding Standards

- **Formatter**: Black (100 line length)
- **Linter**: Ruff
- **Type checking**: mypy
- **API response**: `{status_code, success, message, data}`

## 🎨 Interactive Model Flowchart & Automation

Rezzident includes an interactive visual animated flowchart of all backend database models, foreign keys, relationships, and system workflows at `models_interactive_flowchart.html`.

### 🔄 Automatic Flowchart Updates
Whenever you add, modify, or delete models in `api/v1/models/`:

1. **Git Pre-Commit Hook** (Automatic):
   - Staged changes in `api/v1/models/*.py` trigger `.git/hooks/pre-commit` to re-parse the SQLAlchemy AST and update `models_interactive_flowchart.html` before the commit is finalized.

2. **FastAPI Dev Startup** (Automatic):
   - Starting `main.py` in development automatically updates the flowchart on server startup and hot-reload.

3. **Manual Generation**:
   Run the parser script anytime manually:
   ```bash
   python scripts/generate_model_flowchart.py
   ```

