"""Dashboard routes — V2. Role-based dashboards.

Endpoints:
- GET  /dashboard/summary           — Generic summary (any authenticated user)
- GET  /dashboard/resident          — Resident dashboard
- GET  /dashboard/admin             — Admin dashboard (Admin + Super Admin)
- GET  /dashboard/admin/security    — Security guard dashboard
- GET  /dashboard/admin/treasurer   — Treasurer dashboard
- GET  /dashboard/admin/transactions — Transaction volume chart data
- GET  /dashboard/staff/reports     — Staff reports (all staff roles)
- GET  /dashboard/profile           — User profile (any authenticated user)
"""

from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from datetime import datetime

from api.db.database import get_db
from api.utils.success_response import success_response
from api.utils.jwt_handler import get_current_user
from api.utils.auth_dependencies import (
    require_admin,
    require_super_admin,
    require_roles,
    require_financial_access,
    require_security_access,
)
from api.v1.models.users import User
from api.v1.services.dashboard_service import dashboard_service


dashboard = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ══════════════════════════════════════════════════════
# GENERIC — any authenticated user
# ══════════════════════════════════════════════════════

@dashboard.get(
    "/summary",
    status_code=status.HTTP_200_OK,
    summary="Get dashboard summary for authenticated user",
)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Smart dashboard: returns the appropriate dashboard based on user role."""
    result = dashboard_service.get_smart_dashboard(db, current_user)
    return success_response(
        status_code=status.HTTP_200_OK,
        message=result["message"],
        data=result["data"],
    )


# ══════════════════════════════════════════════════════
# RESIDENT
# ══════════════════════════════════════════════════════

@dashboard.get(
    "/resident",
    status_code=status.HTTP_200_OK,
    summary="Resident Dashboard",
)
def get_resident_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Resident-specific dashboard: outstanding bills, visitor codes, stats."""
    data = dashboard_service.get_resident_dashboard(db, current_user)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Resident dashboard data retrieved",
        data=data.model_dump(),
    )


# ══════════════════════════════════════════════════════
# ADMIN
# ══════════════════════════════════════════════════════

@dashboard.get(
    "/admin",
    status_code=status.HTTP_200_OK,
    summary="Admin Dashboard — All Admin Roles",
)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Admin dashboard: user distribution, revenue, activity logs."""
    data = dashboard_service.get_admin_dashboard(db, current_user)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Admin dashboard data retrieved",
        data=data.model_dump(),
    )


@dashboard.get(
    "/superadmin",
    status_code=status.HTTP_200_OK,
    summary="Super Admin Dashboard",
)
def get_superadmin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_super_admin),
):
    """Super admin: same as admin + full system control."""
    data = dashboard_service.get_admin_dashboard(db, current_user)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Super admin dashboard data retrieved",
        data=data.model_dump(),
    )


# ══════════════════════════════════════════════════════
# SECURITY
# ══════════════════════════════════════════════════════

@dashboard.get(
    "/admin/security",
    status_code=status.HTTP_200_OK,
    summary="Security Dashboard",
)
def get_security_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_security_access),
):
    """Gate security: active codes, check-ins, overstayed, gate log."""
    data = dashboard_service.get_security_dashboard(db, current_user)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Security dashboard data retrieved",
        data=data.model_dump(),
    )


# ══════════════════════════════════════════════════════
# TREASURER
# ══════════════════════════════════════════════════════

@dashboard.get(
    "/admin/treasurer",
    status_code=status.HTTP_200_OK,
    summary="Treasurer Dashboard",
)
def get_treasurer_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_financial_access),
):
    """Treasurer: financials, monthly chart, recent payments."""
    data = dashboard_service.get_treasurer_dashboard(db, current_user)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Treasurer dashboard data retrieved",
        data=data.model_dump(),
    )


@dashboard.get(
    "/admin/transactions",
    status_code=status.HTTP_200_OK,
    summary="Transaction volume chart data",
)
def get_transaction_volume(
    year: int = Query(default=None, description="Year (defaults to current)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Monthly transaction volume (bills, payments, expenses) for chart."""
    if year is None:
        year = datetime.now().year

    data = dashboard_service.get_transaction_volume(db, year)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Transaction volume fetched successfully",
        data=data,
    )


# ══════════════════════════════════════════════════════
# STAFF REPORTS
# ══════════════════════════════════════════════════════

@dashboard.get(
    "/staff/reports",
    status_code=status.HTTP_200_OK,
    summary="Staff Reports — All Staff Members",
)
def get_staff_reports(
    current_user: User = Depends(require_admin),
):
    """Reports accessible to all admin/staff roles."""
    data = dashboard_service.get_staff_reports(current_user)
    return success_response(
        status_code=status.HTTP_200_OK,
        message="Staff reports retrieved",
        data=data,
    )


# ══════════════════════════════════════════════════════
# PROFILE — any authenticated user
# ══════════════════════════════════════════════════════

@dashboard.get(
    "/profile",
    status_code=status.HTTP_200_OK,
    summary="User Profile",
)
def get_user_profile(
    current_user: User = Depends(get_current_user),
):
    """Current user profile for any authenticated role."""
    data = dashboard_service.get_user_profile(current_user)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Profile retrieved successfully",
        data=data,
    )
