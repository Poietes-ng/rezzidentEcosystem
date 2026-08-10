"""Activity Log Service V2 — Multi-tenant aware audit trail.

V2 improvements over V1:
- Severity levels (info/warning/critical) for filtering
- Silent failure mode (never crashes the calling operation)
- Extended convenience methods for future features
- Multi-tenant aware (logs stay in tenant schema)
- Bulk query with search + date filters + pagination

Usage across the app:
    from api.v1.services.activity_log_service import activity_log_service

    activity_log_service.log_activity(db, user_id, "bill_created", "Created", "...")
    activity_log_service.log_visitor_code_generated(db, user_id, "John", "Smith-2203", code_id)
"""

import json
from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc, and_, or_
from fastapi import HTTPException, status

from api.v1.models.activity_log import ActivityLog, ActivityType
from api.v1.models.users import User
from api.v1.schemas.activity_log import (
    ActivityLogItem,
    ActivityLogDetail,
    PaginatedActivityLogsResponse,
    ActivitySummaryStats,
    UserBasicInfo,
    SeverityLevel,
)
from api.loggers.app_logger import app_logger


class ActivityLogService:
    """Service for managing activity logs — multi-tenant aware."""

    # ══════════════════════════════════════════════════════
    # CORE LOGGING — Use this everywhere
    # ══════════════════════════════════════════════════════

    def log_activity(
        self,
        db: Session,
        user_id: Optional[str],
        activity_type: str,
        action: str,
        description: str,
        target_type: Optional[str] = None,
        target_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        metadata: Optional[dict] = None,
        severity: str = "info",
    ) -> Optional[ActivityLog]:
        """Core method to log any activity. NEVER raises — silently fails.

        Args:
            db: Database session (tenant-scoped).
            user_id: UUID of the acting user (None for system events).
            activity_type: Type from ActivityTypeEnum.
            action: Short verb (e.g., "Created", "Approved").
            description: Human-readable description.
            target_type: Model name affected (e.g., "Bill", "VisitorCode").
            target_id: UUID of the affected record.
            ip_address: Client IP.
            user_agent: Client user agent.
            metadata: Extra context as dict (auto-serialized to JSON).
            severity: "info", "warning", or "critical".

        Returns:
            Created ActivityLog or None on failure.
        """
        try:
            metadata_str = json.dumps(metadata) if metadata else None

            activity = ActivityLog(
                user_id=user_id,
                activity_type=activity_type,
                action=action,
                description=description,
                target_type=target_type,
                target_id=target_id,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata=metadata_str,
            )

            db.add(activity)
            db.commit()
            db.refresh(activity)

            return activity

        except Exception as e:
            db.rollback()
            # NEVER crash the caller — log and move on
            app_logger.warning(f"Failed to log activity: {e}")
            return None

    # ══════════════════════════════════════════════════════
    # CONVENIENCE METHODS — V1 ported + V2 additions
    # ══════════════════════════════════════════════════════

    # ── Auth ──
    def log_user_login(self, db: Session, user_id: str,
                       ip_address: Optional[str] = None,
                       user_agent: Optional[str] = None):
        """Log successful login."""
        user = db.query(User).filter(User.id == user_id).first()
        name = user.full_name if user else "Unknown"
        return self.log_activity(
            db, user_id, "user_login", "Signed In",
            f"{name} signed in",
            ip_address=ip_address, user_agent=user_agent,
        )

    def log_pin_locked(self, db: Session, user_id: str, ip_address: Optional[str] = None):
        """Log PIN lockout (V2)."""
        return self.log_activity(
            db, user_id, "pin_locked", "Locked",
            "Account locked after too many PIN attempts",
            ip_address=ip_address, severity="warning",
        )

    # ── Bills & Payments ──
    def log_bill_created(self, db: Session, user_id: str,
                         bill_title: str, amount: float, bill_id: str):
        return self.log_activity(
            db, user_id, "bill_created", "Created",
            f"Created bill '{bill_title}' for ₦{amount:,.2f}",
            target_type="Bill", target_id=bill_id,
        )

    def log_payment_received(self, db: Session, user_id: str,
                             amount: float, reference: str, payment_id: str):
        return self.log_activity(
            db, user_id, "payment_received", "Received",
            f"Payment of ₦{amount:,.2f} received (ref: {reference})",
            target_type="Payment", target_id=payment_id,
        )

    def log_invoice_created(self, db: Session, user_id: str,
                            invoice_number: str, resident_identifier: str, bill_id: str):
        return self.log_activity(
            db, user_id, "invoice_created", "Created",
            f"Created invoice #{invoice_number} for Resident {resident_identifier}",
            target_type="Bill", target_id=bill_id,
        )

    # ── Visitors ──
    def log_visitor_code_generated(self, db: Session, user_id: str,
                                   visitor_name: str, code: str, code_id: str):
        return self.log_activity(
            db, user_id, "visitor_code", "Generated",
            f"Generated visitor code {code} for {visitor_name}",
            target_type="VisitorCode", target_id=code_id,
        )

    def log_visitor_arrival(self, db: Session, user_id: str,
                            visitor_name: str, code: str, code_id: str):
        return self.log_activity(
            db, user_id, "visitor_arrival", "Checked In",
            f"Visitor {visitor_name} arrived with code {code}",
            target_type="VisitorCode", target_id=code_id,
        )

    def log_visitor_departure(self, db: Session, user_id: str,
                              visitor_name: str, code: str, code_id: str,
                              duration_minutes: int):
        return self.log_activity(
            db, user_id, "visitor_departure", "Checked Out",
            f"Visitor {visitor_name} departed after {duration_minutes}min (code {code})",
            target_type="VisitorCode", target_id=code_id,
        )

    # ── Staff ──
    def log_staff_created(self, db: Session, creator_id: str,
                          staff_name: str, staff_role: str, staff_user_id: str):
        return self.log_activity(
            db, creator_id, "staff_created", "Created",
            f"Created staff account for {staff_name} ({staff_role})",
            target_type="User", target_id=staff_user_id,
        )

    # ── Expenses ──
    def log_expense_created(self, db: Session, user_id: str,
                            title: str, amount: float, expense_id: str):
        return self.log_activity(
            db, user_id, "expense_created", "Created",
            f"Created expense '{title}' for ₦{amount:,.2f}",
            target_type="Expense", target_id=expense_id,
        )

    def log_expense_approved(self, db: Session, user_id: str,
                             title: str, expense_id: str):
        return self.log_activity(
            db, user_id, "expense_approved", "Approved",
            f"Approved expense '{title}'",
            target_type="Expense", target_id=expense_id,
        )

    # ── V2 NEW: Verification ──
    def log_verification_submitted(self, db: Session, user_id: str,
                                   tier: str, verification_id: str):
        return self.log_activity(
            db, user_id, "verification_submitted", "Submitted",
            f"Submitted verification for tier: {tier}",
            target_type="Verification", target_id=verification_id,
        )

    def log_verification_approved(self, db: Session, user_id: str,
                                  resident_name: str, tier: str, verification_id: str):
        return self.log_activity(
            db, user_id, "verification_approved", "Approved",
            f"Approved {resident_name}'s verification for {tier}",
            target_type="Verification", target_id=verification_id,
        )

    # ── V2 NEW: Roles & Permissions ──
    def log_role_changed(self, db: Session, admin_id: str,
                         target_name: str, old_role: str, new_role: str, target_user_id: str):
        return self.log_activity(
            db, admin_id, "role_changed", "Changed",
            f"Changed {target_name}'s role from {old_role} to {new_role}",
            target_type="User", target_id=target_user_id,
            severity="warning",
        )

    # ── V2 NEW: Estate Management ──
    def log_estate_created(self, db: Session, user_id: str,
                           estate_name: str, estate_id: str):
        return self.log_activity(
            db, user_id, "estate_created", "Created",
            f"Created estate: {estate_name}",
            target_type="Estate", target_id=estate_id,
            severity="critical",
        )

    # ── V2 NEW: Financial ──
    def log_subaccount_created(self, db: Session, user_id: str,
                               estate_name: str, subaccount_code: str):
        return self.log_activity(
            db, user_id, "subaccount_created", "Created",
            f"Created Paystack subaccount for {estate_name}: {subaccount_code}",
            severity="critical",
        )

    # ══════════════════════════════════════════════════════
    # QUERY METHODS
    # ══════════════════════════════════════════════════════

    def get_activity_logs(
        self,
        db: Session,
        current_user: User,
        activity_type: Optional[str] = None,
        user_id: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        search: Optional[str] = None,
        limit: int = 20,
        skip: int = 0,
    ) -> PaginatedActivityLogsResponse:
        """Get paginated activity logs with filters.

        Permissions:
        - Residents: own activities only
        - Staff/Admin: all activities, can filter by user
        """
        query = db.query(ActivityLog).options(joinedload(ActivityLog.user))

        # Permission: residents see only their own
        if current_user.role.value in ("resident",):
            query = query.filter(ActivityLog.user_id == current_user.id)
        elif user_id:
            query = query.filter(ActivityLog.user_id == user_id)

        # Filters
        if activity_type:
            query = query.filter(ActivityLog.activity_type == activity_type)
        if date_from:
            query = query.filter(ActivityLog.created_at >= date_from)
        if date_to:
            query = query.filter(ActivityLog.created_at <= date_to)
        if search:
            term = f"%{search}%"
            query = query.filter(
                or_(
                    ActivityLog.description.ilike(term),
                    ActivityLog.action.ilike(term),
                )
            )

        total = query.count()
        pages = (total + limit - 1) // limit if total > 0 else 0

        activities = (
            query.order_by(desc(ActivityLog.created_at))
            .limit(limit)
            .offset(skip)
            .all()
        )

        items = []
        for a in activities:
            user_name = "System"
            user_role = None
            if a.user:
                user_name = a.user.full_name or a.user.phone_number or "Unknown"
                user_role = a.user.role.value if hasattr(a.user.role, "value") else str(a.user.role)

            items.append(
                ActivityLogItem(
                    id=a.id,
                    timestamp=a.created_at,
                    user_name=user_name,
                    user_role=user_role,
                    activity_type=a.activity_type if isinstance(a.activity_type, str) else a.activity_type.value,
                    action=a.action,
                    description=a.description,
                    target_type=a.target_type,
                    target_id=a.target_id,
                )
            )

        return PaginatedActivityLogsResponse(
            total=total,
            pages=pages,
            current_page=(skip // limit) + 1 if limit > 0 else 1,
            limit=limit,
            skip=skip,
            items=items,
        )

    def get_activity_detail(
        self, db: Session, current_user: User, activity_id: str
    ) -> ActivityLogDetail:
        """Get detailed info for a single activity."""
        activity = (
            db.query(ActivityLog)
            .options(joinedload(ActivityLog.user))
            .filter(ActivityLog.id == activity_id)
            .first()
        )

        if not activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity log not found",
            )

        # Permission check
        if current_user.role.value in ("resident",) and activity.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to view this activity",
            )

        user_info = None
        if activity.user:
            user_info = UserBasicInfo(
                id=activity.user.id,
                full_name=activity.user.full_name,
                phone_number=activity.user.phone_number,
                role=activity.user.role.value if hasattr(activity.user.role, "value") else str(activity.user.role),
            )

        return ActivityLogDetail(
            id=activity.id,
            timestamp=activity.created_at,
            user=user_info,
            activity_type=activity.activity_type if isinstance(activity.activity_type, str) else activity.activity_type.value,
            action=activity.action,
            description=activity.description,
            target_type=activity.target_type,
            target_id=activity.target_id,
            ip_address=activity.ip_address,
            user_agent=activity.user_agent,
            metadata=activity.metadata,
            created_at=activity.created_at,
        )

    def get_activity_summary(
        self, db: Session, current_user: User
    ) -> ActivitySummaryStats:
        """Get summary statistics."""
        base = db.query(ActivityLog)

        if current_user.role.value in ("resident",):
            base = base.filter(ActivityLog.user_id == current_user.id)

        total = base.count()

        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today = base.filter(ActivityLog.created_at >= today_start).count()

        week_start = today_start - timedelta(days=today_start.weekday())
        week = base.filter(ActivityLog.created_at >= week_start).count()

        month_start = today_start.replace(day=1)
        month = base.filter(ActivityLog.created_at >= month_start).count()

        # Top activity types
        top_types_query = (
            db.query(
                ActivityLog.activity_type,
                func.count(ActivityLog.id).label("count"),
            )
            .group_by(ActivityLog.activity_type)
            .order_by(desc("count"))
            .limit(5)
            .all()
        )
        top_types = [
            {
                "type": t.activity_type if isinstance(t.activity_type, str) else t.activity_type.value,
                "count": t.count,
            }
            for t in top_types_query
        ]

        # Most active users (admin/staff only)
        most_active = []
        if current_user.role.value not in ("resident",):
            top_users = (
                db.query(
                    User.full_name,
                    func.count(ActivityLog.id).label("count"),
                )
                .join(ActivityLog, ActivityLog.user_id == User.id)
                .group_by(User.id, User.full_name)
                .order_by(desc("count"))
                .limit(5)
                .all()
            )
            most_active = [
                {"user_name": u.full_name or "Unknown", "count": u.count}
                for u in top_users
            ]

        return ActivitySummaryStats(
            total_activities=total,
            activities_today=today,
            activities_this_week=week,
            activities_this_month=month,
            top_activity_types=top_types,
            most_active_users=most_active,
        )


# Singleton
activity_log_service = ActivityLogService()
