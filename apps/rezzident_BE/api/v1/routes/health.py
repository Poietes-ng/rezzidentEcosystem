"""Health check routes — /healthz and /readyz.

Standard Kubernetes-style health checks for monitoring.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from api.db.database import get_db
from api.loggers.app_logger import app_logger
from api.utils.success_response import success_response
from api.utils.redis_client import get_redis_pool

health = APIRouter(tags=["Health"])


@health.get("/healthz", status_code=status.HTTP_200_OK)
async def health_check():
    """Liveness probe — is the application running?"""
    return success_response(
        status_code=status.HTTP_200_OK,
        message="Rezzident API is healthy.",
        data={"status": "healthy"},
    )


@health.get("/readyz", status_code=status.HTTP_200_OK)
async def readiness_check(db: Session = Depends(get_db)):
    """Readiness probe — can the application serve requests?

    Checks:
    1. Database connectivity (PostgreSQL)
    2. Redis connectivity
    """
    checks = {"database": False, "redis": False}

    # Check PostgreSQL
    try:
        db.execute(text("SELECT 1"))
        checks["database"] = True
    except Exception as e:
        app_logger.error(f"Database health check failed: {e}")

    try:
        redis_pool = get_redis_pool()
        if redis_pool is not None:
            redis_ok = await redis_pool.ping()
            checks["redis"] = redis_ok
        else:
            app_logger.error("Redis health check failed: Redis pool is not initialized.") 
    except Exception as e:
        app_logger.error(f"Redis health check failed: {e}")

    all_healthy = all(checks.values())

    if not all_healthy:
        return success_response(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            message="Service not ready.",
            data={"checks": checks},
        )

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Rezzident API is ready.",
        data={"checks": checks},
    )
