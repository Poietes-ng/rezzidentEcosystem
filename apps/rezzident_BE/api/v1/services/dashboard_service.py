"""Dashboard Service V2 — Multi-tenant, role-based dashboards (async).

Provides 4 dashboard types:
1. Resident Dashboard — personal stats, outstanding bills, visitors
2. Admin Dashboard — estate-wide metrics, revenue, user distribution
3. Security Dashboard — gate log, visitor activity, overstayed alerts
4. Treasurer Dashboard — financials, collections, expenses

All queries use AsyncSession + select() — never Session.query().

Reference: docs/architecture/13-database-schema.md
"""

from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import extract, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from api.loggers.app_logger import app_logger
from api.v1.models.activity_log import ActivityLog
from api.v1.models.bills import Bill
from api.v1.models.estate import Estate
from api.v1.models.expense import Expense
from api.v1.models.payment import Payment
from api.v1.models.resident_bill import ResidentBill, ResidentBillStatus
from api.v1.models.users import User, UserRole
from api.v1.models.visitor_code import VisitorCode
from api.v1.models.visitor_history import Visitor
from api.v1.schemas.dashboard import (
    AdminDashboardResponse,
    AdminSummaryStats,
    EstateLocationResponse,
    EstateResponse,
    MonthlyTransactionItem,
    OutstandingBillItem,
    ResidentDashboardResponse,
    ResidentSummaryStats,
    RevenueStats,
    SecurityDashboardResponse,
    SecuritySummaryStats,
    TreasurerDashboardResponse,
    TreasurerSummaryStats,
    UserDistribution,
    UserSummary,
)


class DashboardService:
    """Multi-tenant dashboard data aggregation service (async)."""

    # ══════════════════════════════════════════════════════
    # SHARED HELPERS
    # ══════════════════════════════════════════════════════

    async def _get_estate_info(self, db: AsyncSession, user: User) -> EstateResponse:
        """Resolve estate info from current user."""
        try:
            if user.estate_id:
                result = await db.execute(select(Estate).where(Estate.id == user.estate_id))
                estate = result.scalar_one_or_none()
                if estate:
                    return EstateResponse(
                        name=estate.name,
                        estate_code=getattr(estate, "estate_code", None),
                        location=EstateLocationResponse(
                            area=getattr(estate, "area", None),
                            city=getattr(estate, "city", None),
                            state=getattr(estate, "state", None),
                        ),
                    )
        except Exception:
            pass

        # Fallback
        return EstateResponse(
            name="Rezzident Estate",
            location=EstateLocationResponse(area="", city=""),
        )

    def _get_user_summary(self, user: User) -> UserSummary:
        """Build user greeting for dashboard header (no DB needed)."""
        full_name = user.full_name or "Resident"
        first_name = full_name.split()[0] if full_name else "Resident"

        return UserSummary(
            id=user.id,
            full_name=full_name,
            role=user.role.value,
            house_number=user.house_number,
            profile_image=user.profile_image,
            welcome_message=f"Welcome Back, {first_name}",
        )

    # ══════════════════════════════════════════════════════
    # RESIDENT DASHBOARD
    # ══════════════════════════════════════════════════════

    async def get_resident_dashboard(
        self, db: AsyncSession, current_user: User
    ) -> ResidentDashboardResponse:
        """Get complete resident dashboard."""
        try:
            now = datetime.now(UTC)

            estate = await self._get_estate_info(db, current_user)
            user_summary = self._get_user_summary(current_user)

            # ── Stats ──
            active_codes: int = (
                await db.scalar(
                    select(func.count())
                    .select_from(VisitorCode)
                    .where(
                        VisitorCode.user_id == current_user.id,
                        VisitorCode.is_active,
                        VisitorCode.is_used == False,  # noqa: E712
                        VisitorCode.estimated_departure > now,
                    )
                )
            ) or 0

            scheduled_visits: int = (
                await db.scalar(
                    select(func.count())
                    .select_from(Visitor)
                    .where(
                        Visitor.user_id == current_user.id,
                        Visitor.time_of_visit >= now,
                        Visitor.actual_arrival.is_(None),
                    )
                )
            ) or 0

            paid_total = (
                await db.scalar(
                    select(func.coalesce(func.sum(ResidentBill.paid_amount), 0)).where(
                        ResidentBill.user_id == current_user.id,
                        ResidentBill.payment_status == ResidentBillStatus.APPROVED,
                    )
                )
            ) or 0.0

            outstanding_total = (
                await db.scalar(
                    select(func.coalesce(func.sum(Bill.amount), 0))
                    .join(ResidentBill, Bill.id == ResidentBill.bill_id)
                    .where(
                        ResidentBill.user_id == current_user.id,
                        ResidentBill.payment_status.in_(
                            [
                                ResidentBillStatus.UNPAID,
                                ResidentBillStatus.PENDING,
                                ResidentBillStatus.DECLINED,
                            ]
                        ),
                    )
                )
            ) or 0.0

            summary = ResidentSummaryStats(
                active_codes=active_codes,
                scheduled_visits=scheduled_visits,
                paid_bills_total=float(paid_total),
                outstanding_bills_total=float(outstanding_total),
                currency="NGN",
            )

            outstanding_bills = await self._get_outstanding_bills(db, current_user)
            recent_visitors = await self._get_recent_visitors(db, current_user, limit=5)
            notif_count = await self._get_unread_notifications_count(db, current_user)

            return ResidentDashboardResponse(
                current_time=now.strftime("%H:%M"),
                estate=estate,
                user=user_summary,
                summary=summary,
                outstanding_bills=outstanding_bills,
                recent_visitors=recent_visitors,
                notifications_count=notif_count,
            )

        except HTTPException:
            raise
        except Exception as e:
            app_logger.error(f"Resident dashboard error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching dashboard: {str(e)}",
            )

    async def _get_outstanding_bills(
        self, db: AsyncSession, user: User
    ) -> list[OutstandingBillItem]:
        """Get outstanding bills for a resident."""
        try:
            from api.v1.models.bills import PaymentStatus

            result = await db.execute(
                select(ResidentBill)
                .join(Bill, Bill.id == ResidentBill.bill_id)
                .where(
                    ResidentBill.user_id == user.id,
                    ResidentBill.payment_status.in_(
                        [
                            ResidentBillStatus.UNPAID,
                            ResidentBillStatus.PENDING,
                            ResidentBillStatus.DECLINED,
                        ]
                    ),
                    Bill.status != PaymentStatus.CANCELLED,
                )
                .order_by(Bill.due_date.asc())
            )
            resident_bills = result.scalars().all()

            items = []
            for rb in resident_bills:
                bill = rb.bill
                if bill.due_date and bill.due_date < datetime.now(UTC):
                    status_display = "Overdue"
                elif rb.payment_status == ResidentBillStatus.PENDING:
                    status_display = "Pending"
                elif rb.payment_status == ResidentBillStatus.DECLINED:
                    status_display = "Declined"
                else:
                    status_display = "Due"

                items.append(
                    OutstandingBillItem(
                        resident_bill_id=rb.id,
                        bill_name=bill.title,
                        status=status_display,
                        due_date=bill.due_date.strftime("%Y-%m-%d") if bill.due_date else "",
                        amount=float(bill.amount),
                    )
                )
            return items
        except Exception:
            return []

    async def _get_recent_visitors(
        self, db: AsyncSession, user: User, limit: int = 5
    ) -> list[dict]:
        """Get recent visitor activity for resident."""
        try:
            result = await db.execute(
                select(Visitor)
                .where(Visitor.user_id == user.id)
                .order_by(Visitor.created_at.desc())
                .limit(limit)
            )
            visitors = result.scalars().all()
            return [
                {
                    "id": v.id,
                    "visitor_name": v.visitor_name,
                    "time_of_visit": v.time_of_visit.isoformat() if v.time_of_visit else None,
                    "actual_arrival": v.actual_arrival.isoformat() if v.actual_arrival else None,
                    "actual_departure": (
                        v.actual_departure.isoformat() if v.actual_departure else None
                    ),
                }
                for v in visitors
            ]
        except Exception:
            return []

    async def _get_unread_notifications_count(self, db: AsyncSession, user: User) -> int:
        """Count unread notifications."""
        try:
            from api.v1.models.notification import Notification

            return (
                await db.scalar(
                    select(func.count())
                    .select_from(Notification)
                    .where(
                        Notification.user_id == user.id,
                        Notification.is_read == False,  # noqa: E712
                    )
                )
            ) or 0
        except Exception:
            return 0

    # ══════════════════════════════════════════════════════
    # ADMIN DASHBOARD
    # ══════════════════════════════════════════════════════

    async def get_admin_dashboard(
        self, db: AsyncSession, current_user: User
    ) -> AdminDashboardResponse:
        """Full admin dashboard with estate-wide metrics."""
        try:
            estate = await self._get_estate_info(db, current_user)
            user_summary = self._get_user_summary(current_user)

            dist = await self._get_user_distribution(db)
            revenue = await self._get_revenue_stats(db)

            today_start = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)
            week_start = today_start - timedelta(days=today_start.weekday())

            activities_today: int = (
                await db.scalar(
                    select(func.count())
                    .select_from(ActivityLog)
                    .where(ActivityLog.created_at >= today_start)
                )
            ) or 0

            activities_week: int = (
                await db.scalar(
                    select(func.count())
                    .select_from(ActivityLog)
                    .where(ActivityLog.created_at >= week_start)
                )
            ) or 0

            approved_count: int = (
                await db.scalar(
                    select(func.count())
                    .select_from(ResidentBill)
                    .where(ResidentBill.payment_status == ResidentBillStatus.APPROVED)
                )
            ) or 0

            active_visitors: int = (
                await db.scalar(
                    select(func.count())
                    .select_from(VisitorCode)
                    .where(
                        VisitorCode.is_used,
                        VisitorCode.actual_arrival.isnot(None),
                        VisitorCode.actual_departure.is_(None),
                    )
                )
            ) or 0

            summary = AdminSummaryStats(
                total_residents=dist.residents,
                total_staff=dist.staff + dist.security,
                total_admins=dist.admins,
                total_transactions=approved_count,
                total_revenue=revenue.total_revenue,
                activities_today=activities_today,
                activities_this_week=activities_week,
                pending_verifications=0,  # TODO: when verification module is built
                active_visitors=active_visitors,
            )

            recent = await self._get_recent_activities(db, limit=10)

            return AdminDashboardResponse(
                estate=estate,
                user=user_summary,
                summary=summary,
                user_distribution=dist,
                revenue=revenue,
                recent_activities=recent,
            )

        except HTTPException:
            raise
        except Exception as e:
            app_logger.error(f"Admin dashboard error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching admin dashboard: {str(e)}",
            )

    async def _get_user_distribution(self, db: AsyncSession) -> UserDistribution:
        """Count users by role category."""
        try:
            admin_roles = [
                UserRole.SUPER_ADMIN,
                UserRole.ADMIN,
                UserRole.ADMIN_SECRETARY,
                UserRole.SECRETARY,
                UserRole.TREASURER,
            ]

            async def _count_role(*conditions) -> int:
                q = select(func.count()).select_from(User).where(*conditions)
                return (await db.scalar(q)) or 0

            admins = await _count_role(User.role.in_(admin_roles), User.is_active)
            residents = await _count_role(User.role == UserRole.RESIDENT, User.is_active)
            staff = await _count_role(User.role == UserRole.STAFF, User.is_active)
            security = await _count_role(User.role == UserRole.SECURITY, User.is_active)

            return UserDistribution(
                admins=admins,
                residents=residents,
                staff=staff,
                security=security,
                total=admins + residents + staff + security,
            )
        except Exception:
            return UserDistribution()

    async def _get_revenue_stats(self, db: AsyncSession) -> RevenueStats:
        """Calculate estate-wide revenue stats."""
        try:
            collected = float(
                (
                    await db.scalar(
                        select(func.coalesce(func.sum(ResidentBill.paid_amount), 0)).where(
                            ResidentBill.payment_status == ResidentBillStatus.APPROVED
                        )
                    )
                )
                or 0
            )

            outstanding = float(
                (
                    await db.scalar(
                        select(func.coalesce(func.sum(Bill.amount), 0))
                        .join(ResidentBill, Bill.id == ResidentBill.bill_id)
                        .where(
                            ResidentBill.payment_status.in_(
                                [ResidentBillStatus.UNPAID, ResidentBillStatus.PENDING]
                            )
                        )
                    )
                )
                or 0
            )

            expenses = float(
                (
                    await db.scalar(
                        select(func.coalesce(func.sum(Expense.amount), 0)).where(
                            Expense.status == "approved"
                        )
                    )
                )
                or 0
            )

            return RevenueStats(
                total_revenue=collected,
                total_collections=collected,
                total_outstanding=outstanding,
                total_expenses=expenses,
                net_balance=collected - expenses,
                currency="NGN",
            )
        except Exception:
            return RevenueStats()

    async def _get_recent_activities(self, db: AsyncSession, limit: int = 10) -> list[dict]:
        """Get recent activity log entries for admin dashboard."""
        try:
            result = await db.execute(
                select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit)
            )
            activities = result.scalars().all()
            return [
                {
                    "id": a.id,
                    "timestamp": a.created_at.isoformat() if a.created_at else None,
                    "user_name": a.user_display_name,
                    "activity_type": (
                        a.activity_type
                        if isinstance(a.activity_type, str)
                        else a.activity_type.value
                    ),
                    "action": a.action,
                    "description": a.description,
                }
                for a in activities
            ]
        except Exception:
            return []

    # ══════════════════════════════════════════════════════
    # SECURITY DASHBOARD
    # ══════════════════════════════════════════════════════

    async def get_security_dashboard(
        self, db: AsyncSession, current_user: User
    ) -> SecurityDashboardResponse:
        """Gate security dashboard."""
        try:
            now = datetime.now(UTC)
            today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            estate = await self._get_estate_info(db, current_user)
            user_summary = self._get_user_summary(current_user)

            async def _count(model, *conditions) -> int:
                q = select(func.count()).select_from(model).where(*conditions)
                return (await db.scalar(q)) or 0

            active_codes = await _count(
                VisitorCode,
                VisitorCode.is_active,
                VisitorCode.is_used == False,  # noqa: E712
                VisitorCode.estimated_departure > now,
            )

            checked_in = await _count(
                VisitorCode,
                VisitorCode.actual_arrival.isnot(None),
                VisitorCode.actual_departure.is_(None),
            )

            visitors_today = await _count(
                Visitor,
                Visitor.actual_arrival >= today_start,
            )

            pending_arrivals = await _count(
                VisitorCode,
                VisitorCode.is_active,
                VisitorCode.is_used == False,  # noqa: E712
                VisitorCode.time_of_visit >= today_start,
                VisitorCode.time_of_visit < today_start + timedelta(days=1),
            )

            overstayed = await _count(
                VisitorCode,
                VisitorCode.actual_arrival.isnot(None),
                VisitorCode.actual_departure.is_(None),
                VisitorCode.estimated_departure < now,
            )

            summary = SecuritySummaryStats(
                active_visitor_codes=active_codes,
                visitors_checked_in=checked_in,
                visitors_today=visitors_today,
                pending_arrivals=pending_arrivals,
                overstayed_visitors=overstayed,
            )

            gate_log = await self._get_recent_gate_log(db, limit=20)

            return SecurityDashboardResponse(
                estate=estate,
                user=user_summary,
                summary=summary,
                recent_gate_log=gate_log,
            )

        except Exception as e:
            app_logger.error(f"Security dashboard error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching security dashboard: {str(e)}",
            )

    async def _get_recent_gate_log(self, db: AsyncSession, limit: int = 20) -> list[dict]:
        """Recent arrivals and departures for gate security."""
        try:
            result = await db.execute(
                select(Visitor).order_by(Visitor.created_at.desc()).limit(limit)
            )
            visitors = result.scalars().all()
            return [
                {
                    "id": v.id,
                    "visitor_name": v.visitor_name,
                    "phone_number": v.phone_number,
                    "time_of_visit": v.time_of_visit.isoformat() if v.time_of_visit else None,
                    "actual_arrival": v.actual_arrival.isoformat() if v.actual_arrival else None,
                    "actual_departure": (
                        v.actual_departure.isoformat() if v.actual_departure else None
                    ),
                    "reason": v.reason_for_visit,
                    "status": (
                        "departed"
                        if v.actual_departure
                        else "checked_in" if v.actual_arrival else "pending"
                    ),
                }
                for v in visitors
            ]
        except Exception:
            return []

    # ══════════════════════════════════════════════════════
    # TREASURER DASHBOARD
    # ══════════════════════════════════════════════════════

    async def get_treasurer_dashboard(
        self, db: AsyncSession, current_user: User
    ) -> TreasurerDashboardResponse:
        """Treasurer financial dashboard."""
        try:
            estate = await self._get_estate_info(db, current_user)
            user_summary = self._get_user_summary(current_user)

            revenue = await self._get_revenue_stats(db)

            now = datetime.now(UTC)
            overdue_count: int = (
                await db.scalar(
                    select(func.count())
                    .select_from(Bill)
                    .where(
                        Bill.due_date < now,
                        Bill.status != "cancelled",
                        Bill.status != "paid",
                    )
                )
            ) or 0

            pending_approvals: int = (
                await db.scalar(
                    select(func.count()).select_from(Expense).where(Expense.status == "pending")
                )
            ) or 0

            summary = TreasurerSummaryStats(
                total_collected=revenue.total_collections,
                total_outstanding=revenue.total_outstanding,
                total_expenses=revenue.total_expenses,
                net_balance=revenue.net_balance,
                overdue_bills_count=overdue_count,
                pending_approvals=pending_approvals,
                currency="NGN",
            )

            year = now.year
            monthly = await self._get_monthly_transactions(db, year)
            recent_payments = await self._get_recent_payments(db, limit=10)

            return TreasurerDashboardResponse(
                estate=estate,
                user=user_summary,
                summary=summary,
                monthly_revenue=monthly,
                recent_payments=recent_payments,
            )

        except Exception as e:
            app_logger.error(f"Treasurer dashboard error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error fetching treasurer dashboard: {str(e)}",
            )

    async def _get_monthly_transactions(
        self, db: AsyncSession, year: int
    ) -> list[MonthlyTransactionItem]:
        """Monthly transaction volume for chart."""
        try:
            months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ]

            bills_rows = (
                await db.execute(
                    select(
                        extract("month", Bill.created_at).label("m"),
                        func.count(Bill.id),
                    )
                    .where(extract("year", Bill.created_at) == year)
                    .group_by("m")
                )
            ).all()
            bills_by_month = {int(row[0]): row[1] for row in bills_rows}

            payments_rows = (
                await db.execute(
                    select(
                        extract("month", Payment.created_at).label("m"),
                        func.count(Payment.id),
                    )
                    .where(
                        extract("year", Payment.created_at) == year,
                        Payment.payment_date.isnot(None),
                    )
                    .group_by("m")
                )
            ).all()
            payments_by_month = {int(row[0]): row[1] for row in payments_rows}

            expenses_rows = (
                await db.execute(
                    select(
                        extract("month", Expense.created_at).label("m"),
                        func.count(Expense.id),
                    )
                    .where(
                        extract("year", Expense.created_at) == year,
                        Expense.status == "approved",
                    )
                    .group_by("m")
                )
            ).all()
            expenses_by_month = {int(row[0]): row[1] for row in expenses_rows}

            return [
                MonthlyTransactionItem(
                    month=name,
                    bills=bills_by_month.get(i, 0),
                    payments=payments_by_month.get(i, 0),
                    expenses=expenses_by_month.get(i, 0),
                )
                for i, name in enumerate(months, start=1)
            ]
        except Exception:
            return []

    async def _get_recent_payments(self, db: AsyncSession, limit: int = 10) -> list[dict]:
        """Recent successful payments."""
        try:
            result = await db.execute(
                select(Payment)
                .where(Payment.payment_date.isnot(None))
                .order_by(Payment.created_at.desc())
                .limit(limit)
            )
            payments = result.scalars().all()
            return [
                {
                    "id": p.id,
                    "amount": float(p.amount) if p.amount else 0,
                    "reference": p.reference,
                    "payment_date": p.payment_date.isoformat() if p.payment_date else None,
                    "user_id": p.user_id,
                }
                for p in payments
            ]
        except Exception:
            return []

    # ══════════════════════════════════════════════════════
    # ADMIN CHART — Transaction Volume by Year
    # ══════════════════════════════════════════════════════

    async def get_transaction_volume(self, db: AsyncSession, year: int) -> dict[str, Any]:
        """Monthly transaction volume for admin chart."""
        monthly = await self._get_monthly_transactions(db, year)
        return {
            "year": year,
            "data": [m.model_dump() for m in monthly],
        }

    # ══════════════════════════════════════════════════════
    # USER PROFILE (all roles) — no DB needed
    # ══════════════════════════════════════════════════════

    def get_user_profile(self, current_user: User) -> dict:
        """Current user profile for any role."""
        return {
            "id": current_user.id,
            "role": current_user.role.value,
            "house_number": current_user.house_number,
            "phone_number": current_user.phone_number,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "is_active": current_user.is_active,
            "profile_image": current_user.profile_image,
            "verification_tier": (
                current_user.verification_tier.value if current_user.verification_tier else None
            ),
            "last_login": current_user.last_login.isoformat() if current_user.last_login else None,
        }

    async def get_smart_dashboard(self, db: AsyncSession, current_user: User) -> dict[str, Any]:
        """Route to the correct dashboard based on user role."""
        role_map = {
            UserRole.RESIDENT: (
                "Resident dashboard fetched successfully",
                lambda: self.get_resident_dashboard(db, current_user),
            ),
            UserRole.SECURITY: (
                "Security dashboard fetched successfully",
                lambda: self.get_security_dashboard(db, current_user),
            ),
            UserRole.TREASURER: (
                "Treasurer dashboard fetched successfully",
                lambda: self.get_treasurer_dashboard(db, current_user),
            ),
        }

        if current_user.role in role_map:
            message, fetcher = role_map[current_user.role]
            data = await fetcher()
        else:
            message = "Admin dashboard fetched successfully"
            data = await self.get_admin_dashboard(db, current_user)

        return {"message": message, "data": data.model_dump()}

    def get_staff_reports(self, current_user: User) -> dict[str, Any]:
        """Available reports for staff/admin users."""
        return {
            "user_role": current_user.role.value,
            "reports": [
                {"name": "Monthly Activity", "status": "available"},
                {"name": "Resident Summary", "status": "available"},
                {"name": "Financial Overview", "status": "available"},
                {"name": "Visitor Analytics", "status": "available"},
            ],
        }


# Singleton
dashboard_service = DashboardService()
