"""Rezzident API — main application entry point.

Middleware stack (outermost → innermost):
  1. CORSMiddleware           — always adds CORS headers (outermost)
  2. SessionMiddleware        — session handling
  3. TenantMiddleware         — schema routing from JWT
  4. RequestIdMiddleware      — X-Request-ID tracing
  5. SecurityHeadersMiddleware — OWASP security headers
  6. SecurityMiddleware       — fastapi-guard: IP filtering, rate limiting, attack detection

Lifespan:
  - Redis connection pool initialised on startup, closed on shutdown.
  - Redis client stored on app.state.redis for use via get_redis() dependency.

Reference: docs/architecture/10-security-architecture.md, 17-owasp-rate-limiting.md
"""

import os
import re
import secrets
import sys
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import IntegrityError
from starlette.middleware.sessions import SessionMiddleware


def ensure_secret_key():
    """Auto-generate SECRET_KEY in .env on startup if it's the placeholder."""
    env_path = Path(__file__).resolve().parent / ".env"
    if env_path.exists():
        content = env_path.read_text()
        if "CHANGE_ME_generate_64_byte_hex_key" in content:
            new_key = secrets.token_hex(64)
            # Replace placeholder with new key
            new_content = re.sub(
                r"SECRET_KEY=CHANGE_ME_generate_64_byte_hex_key", f"SECRET_KEY={new_key}", content
            )
            env_path.write_text(new_content)
            # Inject into current env so pydantic-settings picks it up
            os.environ["SECRET_KEY"] = new_key
            app_logger.info("✅ Auto-generated new SECRET_KEY in .env")


# Run before settings are imported
ensure_secret_key()


# fastapi-guard — top-level imports (v7.x API)
from guard import SecurityConfig, SecurityMiddleware

from api.db.redis import close_redis, init_redis
from api.loggers.app_logger import app_logger
from api.middleware.request_id import RequestIdMiddleware

# V2 Middleware imports
from api.middleware.security_headers import SecurityHeadersMiddleware
from api.middleware.tenant import TenantMiddleware
from api.utils.settings import settings
from api.utils.success_response import success_response
from api.v1.routes import api_version_one

# ══════════════════════════════════════════════════════
# fastapi-guard SECURITY CONFIG (v7.x)
#
# rate_limit: max requests per rate_limit_window (60s) per IP
# auto_ban_threshold: IP banned after N suspicious requests
# auto_ban_duration: ban duration in seconds (1 hour)
# enable_redis: use Redis for distributed state (shared across workers)
# redis_url: points to our existing Redis instance
# blocked_user_agents: auto-block known scanners/attack tools
# trusted_proxies: Cloudflare/Nginx — trust X-Forwarded-For from these
# exclude_paths: never rate-limit health checks
# ══════════════════════════════════════════════════════

_GUARD_CONFIG = SecurityConfig(
    # Rate limiting
    rate_limit=settings.GUARD_RATE_LIMIT,
    rate_limit_window=settings.GUARD_RATE_LIMIT_WINDOW,
    # Auto-ban settings
    auto_ban_threshold=settings.GUARD_AUTO_BAN_THRESHOLD,
    auto_ban_duration=settings.GUARD_AUTO_BAN_DURATION,
    # Redis backend — required in production, optional in development.
    # In dev mode without Redis, guard falls back to in-memory storage.
    enable_redis=settings.PYTHON_ENV != "development",
    redis_url=settings.REDIS_URL,
    redis_prefix=settings.GUARD_REDIS_PREFIX,
    # Block known scanner / attack tool user-agents
    blocked_user_agents=[
        "sqlmap",
        "nikto",
        "masscan",
        "nmap",
        "zgrab",
        "dirbuster",
        "gobuster",
        "nuclei",
        "hydra",
    ],
    # Trust X-Forwarded-For from these proxies (Cloudflare / local Nginx)
    trusted_proxies=["127.0.0.1", "::1"],
    trusted_proxy_depth=1,
    # Paths to never rate-limit (health checks, docs)
    exclude_paths=[
        "/docs",
        "/redoc",
        "/openapi.json",
        "/api/v1/healthz",
        "/api/v1/readyz",
    ],
    # IP banning enabled
    enable_ip_banning=True,
    enable_rate_limiting=True,
    # Log suspicious activity at WARNING level
    log_suspicious_level="WARNING",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown hooks."""
    app_logger.info("Rezzident API starting up...")

    # ── Redis connection pool ──
    redis_client = await init_redis()
    app.state.redis = redis_client

    # ── Ensure required directories exist ──
    os.makedirs("./media", exist_ok=True)
    os.makedirs("./tmp/media", exist_ok=True)
    os.makedirs("./logs", exist_ok=True)

    # ── Auto-update interactive flowchart HTML (dev only) ──
    try:
        from scripts.generate_model_flowchart import parse_database_schema, update_html

        models = parse_database_schema()
        update_html(models)
        app_logger.info("✅ Automatically updated models_interactive_flowchart.html")
    except Exception as e:
        app_logger.warning(f"Flowchart auto-generator notice: {e}")

    yield

    # ── Shutdown ──
    await close_redis()
    app_logger.info("Rezzident API shutting down.")


app = FastAPI(
    lifespan=lifespan,
    title="Rezzident API",
    description="Estate Management SaaS Platform — API v1",
    version="1.0.0",
    docs_url="/docs" if settings.PYTHON_ENV != "production" else None,
    redoc_url="/redoc" if settings.PYTHON_ENV != "production" else None,
    openapi_url="/openapi.json" if settings.PYTHON_ENV != "production" else None,
)


# ── Static files ──────────────────────────────────────────────────────────────
MEDIA_DIR = "./media"
TEMP_DIR = "./tmp/media"
os.makedirs(MEDIA_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")
app.mount("/tmp/media", StaticFiles(directory=TEMP_DIR), name="tmp-media")


# ══════════════════════════════════════════════════════
# MIDDLEWARE STACK
# NOTE: Middleware executes in REVERSE order of addition.
# CORSMiddleware must be added LAST so it wraps outermost.
#
# Execution order (first → last):
#   1. SecurityMiddleware     (fastapi-guard — IP/rate/attack)
#   2. SecurityHeadersMiddleware (OWASP headers)
#   3. RequestIdMiddleware    (X-Request-ID tracing)
#   4. TenantMiddleware       (schema routing from JWT)
#   5. SessionMiddleware      (session handling)
#   6. CORSMiddleware         (outermost — always attaches CORS headers)
# ══════════════════════════════════════════════════════

# In-memory request counter (kept for /request-stats endpoint)
request_counter = defaultdict(lambda: defaultdict(int))

# 1. fastapi-guard — attack detection, IP banning, rate limiting
app.add_middleware(SecurityMiddleware, config=_GUARD_CONFIG)

# 2. OWASP security headers
app.add_middleware(SecurityHeadersMiddleware)

# 3. Request ID tracing
app.add_middleware(RequestIdMiddleware)

# 4. Multi-tenant schema routing
app.add_middleware(TenantMiddleware)

# 5. Session middleware
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# 6. CORS — must be LAST added (outermost wrapper)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    expose_headers=["X-Request-ID"],
)


# ══════════════════════════════════════════════════════
# REQUEST LOGGING
# ══════════════════════════════════════════════════════


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log method, path, status, duration, and request ID after each request."""
    start_time = time.time()

    response = await call_next(request)

    process_time = time.time() - start_time
    formatted_process_time = f"{process_time:.3f}s"

    client_ip = request.client.host if request.client else "unknown"
    method = request.method
    url = request.url.path
    status_code = response.status_code
    request_id = getattr(request.state, "request_id", "N/A")

    log_string = (
        f'{client_ip} - "{method} {url} HTTP/1.1" {status_code} '
        f"- {formatted_process_time} [{request_id}]"
    )

    app_logger.info(log_string)

    return response


# ══════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════

app.include_router(api_version_one)


@app.get("/", tags=["Home"])
async def get_root(request: Request) -> dict:
    return success_response(message="Welcome to Rezzident API", status_code=status.HTTP_200_OK)


@app.get("/request-stats", tags=["Home"])
async def get_request_stats():
    """Endpoint to get request stats."""
    return success_response(
        status_code=status.HTTP_200_OK,
        message="Endpoint request stats retrieved successfully",
        data={"request_counts": {endpoint: dict(ips) for endpoint, ips in request_counter.items()}},
    )


# ══════════════════════════════════════════════════════
# EXCEPTION HANDLERS
# ══════════════════════════════════════════════════════


@app.exception_handler(HTTPException)
async def http_exception(request: Request, exc: HTTPException):
    """HTTP exception handler."""
    exc_type, exc_obj, exc_tb = sys.exc_info()
    app_logger.info(f"HTTPException: {request.url.path} | {exc.status_code} | {exc.detail}")
    if exc_tb:
        app_logger.info(
            f"[ERROR] - An error occurred | {exc}, {exc_type} {exc_obj} line {exc_tb.tb_lineno}"
        )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": False,
            "status_code": exc.status_code,
            "message": exc.detail,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception(request: Request, exc: RequestValidationError):
    """Validation exception handler."""
    errors = [
        {"loc": error["loc"], "msg": error["msg"], "type": error["type"]} for error in exc.errors()
    ]

    exc_type, exc_obj, exc_tb = sys.exc_info()
    app_logger.info(f"RequestValidationError: {request.url.path} | {errors}")

    return JSONResponse(
        status_code=422,
        content={
            "status": False,
            "status_code": 422,
            "message": "Invalid input",
            "errors": errors,
        },
    )


@app.exception_handler(IntegrityError)
async def integrity_exception(request: Request, exc: IntegrityError):
    """Integrity error exception handler."""
    exc_type, exc_obj, exc_tb = sys.exc_info()
    app_logger.info(f"IntegrityError: {request.url.path} | 500")
    app_logger.info(f"[ERROR] - An error occurred | {exc}, {exc_type} {exc_obj}")

    return JSONResponse(
        status_code=500,
        content={
            "status": False,
            "status_code": 500,
            "message": "A database integrity error occurred.",
        },
    )


@app.exception_handler(Exception)
async def general_exception(request: Request, exc: Exception):
    """Catch-all exception handler — NEVER exposes stack traces in production."""
    exc_type, exc_obj, exc_tb = sys.exc_info()
    app_logger.info(f"Exception: {request.url.path} | 500")
    app_logger.info(f"[ERROR] - An error occurred | {exc}, {exc_type} {exc_obj}")

    message = "An unexpected error occurred."
    if settings.PYTHON_ENV == "development":
        message = f"An unexpected error occurred: {exc}"

    return JSONResponse(
        status_code=500,
        content={
            "status": False,
            "status_code": 500,
            "message": message,
        },
    )


# ══════════════════════════════════════════════════════
# ENTRYPOINT
# ══════════════════════════════════════════════════════

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        port=7001,
        reload=True,
        workers=1,  # Single worker when reload=True (uvicorn limitation)
        reload_excludes=["logs"],
    )
