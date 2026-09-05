"""Activity Log routes — V2.

Endpoints:
- GET  /activity-logs             — List with filters (paginated)
- GET  /activity-logs/summary     — Stats (today, week, month, top types)
- GET  /activity-logs/{id}        — Single activity detail
- GET  /activity-logs/users/{uid} — Staff: activities for a specific user
"""

from datetime import datetime

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from api.db.database import get_db
from api.utils.auth_dependencies import require_admin
from api.utils.jwt_handler import get_current_user
from api.utils.success_response import success_response
from api.v1.models.users import User
from api.v1.services.activity_log_service import activity_log_service

activity_logs = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])


@activity_logs.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List activity logs with filters",
)
def list_activity_logs(
    activity_type: str | None = Query(None, description="Filter by type"),
    user_id: str | None = Query(None, description="Filter by user (staff only)"),
    date_from: datetime | None = Query(None, description="From date (ISO 8601)"),
    date_to: datetime | None = Query(None, description="To date (ISO 8601)"),
    search: str | None = Query(None, description="Search description/action"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List activity logs.

    - Residents: own activities only
    - Staff/Admin: all activities, filterable by user
    """
    result = activity_log_service.get_activity_logs(
        db=db,
        current_user=current_user,
        activity_type=activity_type,
        user_id=user_id,
        date_from=date_from,
        date_to=date_to,
        search=search,
        limit=limit,
        skip=skip,
    )

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Activity logs fetched successfully",
        data=result.model_dump(),
    )


@activity_logs.get(
    "/summary",
    status_code=status.HTTP_200_OK,
    summary="Get activity summary statistics",
)
def get_activity_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Summary stats: total, today, this week, this month, top types."""
    result = activity_log_service.get_activity_summary(db=db, current_user=current_user)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Activity summary fetched successfully",
        data=result.model_dump(),
    )


@activity_logs.get(
    "/{activity_id}",
    status_code=status.HTTP_200_OK,
    summary="Get activity log detail",
)
def get_activity_detail(
    activity_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Full detail for a single activity log entry."""
    result = activity_log_service.get_activity_detail(
        db=db, current_user=current_user, activity_id=activity_id
    )

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Activity log details fetched successfully",
        data=result.model_dump(),
    )


# ── Staff-Only ──


@activity_logs.get(
    "/users/{user_id}/activities",
    status_code=status.HTTP_200_OK,
    summary="Get activities for specific user — Admin only",
)
def get_user_activities(
    user_id: str,
    activity_type: str | None = Query(None),
    date_from: datetime | None = Query(None),
    date_to: datetime | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Admin-only: get all activities for a specific user."""
    result = activity_log_service.get_activity_logs(
        db=db,
        current_user=current_user,
        activity_type=activity_type,
        user_id=user_id,
        date_from=date_from,
        date_to=date_to,
        limit=limit,
        skip=skip,
    )

    return success_response(
        status_code=status.HTTP_200_OK,
        message=f"Activities for user {user_id} fetched successfully",
        data=result.model_dump(),
    )
