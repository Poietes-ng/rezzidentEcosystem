"""Activity Log routes — V2.

Endpoints:
- GET  /activity-logs             — List with filters (paginated)
- GET  /activity-logs/summary     — Stats (today, week, month, top types)
- GET  /activity-logs/{id}        — Single activity detail
- GET  /activity-logs/users/{uid} — Staff: activities for a specific user
"""

from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from api.db.database import get_db
from api.utils.success_response import success_response
from api.utils.jwt_handler import get_current_user
from api.utils.auth_dependencies import require_admin
from api.v1.models.users import User
from api.v1.services.activity_log_service import activity_log_service


activity_logs = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])


@activity_logs.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List activity logs with filters",
)
def list_activity_logs(
    activity_type: Optional[str] = Query(None, description="Filter by type"),
    user_id: Optional[str] = Query(None, description="Filter by user (staff only)"),
    date_from: Optional[datetime] = Query(None, description="From date (ISO 8601)"),
    date_to: Optional[datetime] = Query(None, description="To date (ISO 8601)"),
    search: Optional[str] = Query(None, description="Search description/action"),
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
    result = activity_log_service.get_activity_summary(
        db=db, current_user=current_user
    )

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
    activity_type: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
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
