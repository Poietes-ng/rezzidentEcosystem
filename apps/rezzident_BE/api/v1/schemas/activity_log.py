"""Activity Log schemas — Pydantic V2.

V2 enhancements over V1:
- Extended activity types for future features (chat, verification, family_tree, etc.)
- Multi-tenant context tracking (estate_id, schema_name)
- Severity levels for filtering critical actions
- Bulk operations support

Reference: docs/architecture/15-audit-and-activity.md
"""

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field, field_validator


class ActivityTypeEnum(StrEnum):
    """Activity types — includes V1 types + future feature types."""

    # ── Auth (V1) ──
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    USER_CREATED = "user_created"
    USER_UPDATED = "user_updated"
    USER_DELETED = "user_deleted"
    PIN_CHANGED = "pin_changed"
    PIN_LOCKED = "pin_locked"

    # ── Staff (V1) ──
    STAFF_CREATED = "staff_created"
    STAFF_UPDATED = "staff_updated"
    STAFF_DELETED = "staff_deleted"

    # ── Bills & Payments (V1) ──
    BILL = "bill"
    BILL_CREATED = "bill_created"
    BILL_ASSIGNED = "bill_assigned"
    PAYMENT = "payment"
    PAYMENT_RECEIVED = "payment_received"
    PAYMENT_FAILED = "payment_failed"
    INVOICE = "invoice"
    INVOICE_CREATED = "invoice_created"

    # ── Visitors (V1) ──
    VISITOR_CODE = "visitor_code"
    VISITOR_ARRIVAL = "visitor_arrival"
    VISITOR_DEPARTURE = "visitor_departure"

    # ── Expenses (V1) ──
    EXPENSE_CREATED = "expense_created"
    EXPENSE_APPROVED = "expense_approved"
    EXPENSE_DECLINED = "expense_declined"

    # ── Notifications (V1) ──
    NOTIFICATION_SENT = "notification_sent"

    # ── V2 NEW: Verification ──
    VERIFICATION_SUBMITTED = "verification_submitted"
    VERIFICATION_APPROVED = "verification_approved"
    VERIFICATION_REJECTED = "verification_rejected"
    VOUCH_SUBMITTED = "vouch_submitted"

    # ── V2 NEW: Family Tree ──
    FAMILY_MEMBER_ADDED = "family_member_added"
    FAMILY_MEMBER_REMOVED = "family_member_removed"

    # ── V2 NEW: Chat ──
    CHAT_MESSAGE_SENT = "chat_message_sent"
    CHAT_BROADCAST = "chat_broadcast"

    # ── V2 NEW: Estate Management ──
    ESTATE_CREATED = "estate_created"
    ESTATE_UPDATED = "estate_updated"
    SUBSCRIPTION_CHANGED = "subscription_changed"
    ROLE_CHANGED = "role_changed"
    PERMISSION_GRANTED = "permission_granted"
    PERMISSION_REVOKED = "permission_revoked"

    # ── V2 NEW: Financial ──
    SUBACCOUNT_CREATED = "subaccount_created"
    SETTLEMENT_COMPLETED = "settlement_completed"
    REFUND_PROCESSED = "refund_processed"

    # ── System ──
    SYSTEM = "system"
    OTHER = "other"


class SeverityLevel(StrEnum):
    """Severity for filtering — V2 addition."""

    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


# ══════════════════════════════════════════════════════
# Request Schemas
# ══════════════════════════════════════════════════════


class CreateActivityLogRequest(BaseModel):
    """Request to manually create an activity log."""

    user_id: str | None = None
    activity_type: str = Field(..., max_length=50)
    action: str = Field(..., max_length=100)
    description: str = Field(..., min_length=1)
    target_type: str | None = Field(None, max_length=50)
    target_id: str | None = None
    ip_address: str | None = Field(None, max_length=45)
    user_agent: str | None = Field(None, max_length=500)
    metadata: str | None = None  # JSON string
    severity: SeverityLevel = SeverityLevel.INFO

    @field_validator("activity_type")
    @classmethod
    def validate_activity_type(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("action")
    @classmethod
    def validate_action(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Action cannot be empty")
        return v


# ══════════════════════════════════════════════════════
# Response Schemas
# ══════════════════════════════════════════════════════


class UserBasicInfo(BaseModel):
    """Basic user info embedded in activity log."""

    id: str
    full_name: str | None = None
    phone_number: str | None = None
    role: str

    model_config = {"from_attributes": True}


class ActivityLogItem(BaseModel):
    """Single activity in list view."""

    id: str
    timestamp: datetime = Field(..., description="When the activity occurred")
    user_name: str = Field(..., description="Display name of actor")
    user_role: str | None = Field(None, description="Role of actor")
    activity_type: str
    action: str
    description: str
    target_type: str | None = None
    target_id: str | None = None
    severity: str = "info"

    model_config = {"from_attributes": True}


class ActivityLogDetail(BaseModel):
    """Full activity detail view."""

    id: str
    timestamp: datetime
    user: UserBasicInfo | None = None
    activity_type: str
    action: str
    description: str
    target_type: str | None = None
    target_id: str | None = None
    ip_address: str | None = None
    user_agent: str | None = None
    metadata: str | None = None
    severity: str = "info"
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedActivityLogsResponse(BaseModel):
    """Paginated activity logs."""

    total: int
    pages: int
    current_page: int
    limit: int
    skip: int
    items: list[ActivityLogItem]


class ActivitySummaryStats(BaseModel):
    """Activity summary statistics."""

    total_activities: int = 0
    activities_today: int = 0
    activities_this_week: int = 0
    activities_this_month: int = 0
    top_activity_types: list[dict] = []
    most_active_users: list[dict] = []


class ActivityLogResponse(BaseModel):
    """Response after creating an activity log."""

    success: bool
    message: str
    activity_log: ActivityLogDetail
