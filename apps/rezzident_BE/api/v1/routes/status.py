"""Status / System Health routes — V2.

Endpoints:
- GET  /status           — Full health check (all services)
- GET  /status/history   — Historical checks (paginated)
- GET  /status/incidents — Recent incidents
- GET  /status/daily     — Daily uptime summary for chart
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from api.db.database import get_db
from api.utils.auth_dependencies import require_admin
from api.utils.success_response import success_response
from api.v1.models.users import User
from api.v1.services.status_service import status_service

status_router = APIRouter(prefix="/status", tags=["System Status"])


@status_router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="Full system health check",
)
def get_full_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Run all health checks and return a structured report.

    Checks: Database, Auth, Bills, Visitors, Notifications, Expenses,
    Invoices, Staff, Paystack, Termii SMS, Redis.

    Admin-only — returns response times and error details.
    """
    result = status_service.get_full_status(db)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="System status check completed",
        data=result,
    )


@status_router.get(
    "/history",
    status_code=status.HTTP_200_OK,
    summary="Health check history",
)
def get_status_history(
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Paginated history of health check results."""
    result = status_service.get_history(db, limit=limit, skip=skip)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Status history fetched successfully",
        data=result,
    )


@status_router.get(
    "/incidents",
    status_code=status.HTTP_200_OK,
    summary="Recent incidents",
)
def get_incidents(
    limit: int = Query(20, ge=1, le=100),
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Get recent incidents where services were non-operational."""
    result = status_service.get_incidents(db, limit=limit, days=days)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Incidents fetched successfully",
        data=result,
    )


@status_router.get(
    "/daily",
    status_code=status.HTTP_200_OK,
    summary="Daily uptime summary",
)
def get_daily_summary(
    days: int = Query(90, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Daily uptime percentage for the uptime bar chart.

    Returns one entry per day with status (operational/incident/no_data)
    and uptime percentage.
    """
    result = status_service.get_daily_summary(db, days=days)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Daily summary fetched successfully",
        data=result,
    )
