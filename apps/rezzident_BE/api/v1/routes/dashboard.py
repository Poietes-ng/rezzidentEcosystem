"""Dashboard routes — V2 (async).

Endpoints:
- GET /dashboard/summary           — Smart dashboard (role-based)
- GET /dashboard/resident          — Resident dashboard
- GET /dashboard/admin             — Admin dashboard
- GET /dashboard/superadmin        — Super admin dashboard
- GET /dashboard/admin/security    — Security dashboard
- GET /dashboard/admin/treasurer   — Treasurer dashboard
- GET /dashboard/admin/transactions — Transaction volume chart
- GET /dashboard/staff/reports     — Staff reports metadata
- GET /dashboard/profile           — Any authenticated user profile
"""

from datetime import datetime

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.db.database import get_db
from api.utils.auth_dependencies import (
    require_admin,
    require_financial_access,
    require_security_access,
    require_super_admin,
)
from api.utils.jwt_handler import get_current_user
from api.utils.success_response import success_response
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
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Smart dashboard: returns the appropriate dashboard based on user role."""
    result = await dashboard_service.get_smart_dashboard(db, current_user)
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
async def get_resident_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Resident-specific dashboard: outstanding bills, visitor codes, stats."""
    data = await dashboard_service.get_resident_dashboard(db, current_user)

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
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Admin dashboard: user distribution, revenue, activity logs."""
    data = await dashboard_service.get_admin_dashboard(db, current_user)

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
async def get_superadmin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_super_admin),
):
    """Super admin: same as admin + full system control."""
    data = await dashboard_service.get_admin_dashboard(db, current_user)

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
async def get_security_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_security_access),
):
    """Gate security: active codes, check-ins, overstayed, gate log."""
    data = await dashboard_service.get_security_dashboard(db, current_user)

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
async def get_treasurer_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_financial_access),
):
    """Treasurer: financials, monthly chart, recent payments."""
    data = await dashboard_service.get_treasurer_dashboard(db, current_user)

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
async def get_transaction_volume(
    year: int = Query(default=None, description="Year (defaults to current)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Monthly transaction volume (bills, payments, expenses) for chart."""
    if year is None:
        year = datetime.now().year

    data = await dashboard_service.get_transaction_volume(db, year)

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
async def get_staff_reports(
    current_user: User = Depends(require_admin),
):
    """Reports accessible to all admin/staff roles."""
    # get_staff_reports is synchronous (no DB) — no await needed
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
async def get_user_profile(
    current_user: User = Depends(get_current_user),
):
    """Current user profile for any authenticated role."""
    # get_user_profile is synchronous (no DB) — no await needed
    data = dashboard_service.get_user_profile(current_user)

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Profile retrieved successfully",
        data=data,
    )
