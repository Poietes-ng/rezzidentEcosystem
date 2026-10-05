"""Health check routes — /healthz and /readyz.

Standard Kubernetes-style health checks for monitoring.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from api.db.database import get_db
from api.loggers.app_logger import app_logger
from api.utils.success_response import success_response

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
    2. TODO: Redis connectivity
    """
    checks = {"database": False, "redis": False}

    # Check PostgreSQL
    try:
        db.execute(text("SELECT 1"))
        checks["database"] = True
    except Exception as e:
        app_logger.error(f"Database health check failed: {e}")

    # TODO: Check Redis when redis client is wired
    # try:
    #     redis_client.ping()
    #     checks["redis"] = True
    # except Exception as e:
    #     app_logger.error(f"Redis health check failed: {e}")
    checks["redis"] = True  # Placeholder until Redis is wired

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
