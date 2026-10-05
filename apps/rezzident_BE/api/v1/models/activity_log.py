"""Activity log model — tenant schema.

V2 enhancements over V1:
- activity_type as String (not Enum) for extensibility — new types don't need migrations
- severity column for filtering critical events
- metadata as JSONB for structured queries
- Composite indexes for dashboard queries

This is append-only. Never update or delete entries.
"""

import enum

from sqlalchemy import Column, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class ActivityType(enum.StrEnum):
    """Activity categories — V1 compatibility + V2 extensions.

    Note: The DB column stores plain strings, so new types can be
    added without migrations. This enum is for code convenience only.
    """

    # V1 types
    INVOICE = "invoice"
    PAYMENT = "payment"
    BILL = "bill"
    VISITOR_CODE = "visitor_code"
    VISITOR_ARRIVAL = "visitor_arrival"
    VISITOR_DEPARTURE = "visitor_departure"
    USER_CREATED = "user_created"
    USER_UPDATED = "user_updated"
    USER_DELETED = "user_deleted"
    STAFF_CREATED = "staff_created"
    STAFF_UPDATED = "staff_updated"
    STAFF_DELETED = "staff_deleted"
    USER_LOGIN = "user_login"
    USER_LOGOUT = "user_logout"
    SYSTEM = "system"
    OTHER = "other"

    # V2 extensions
    PIN_CHANGED = "pin_changed"
    PIN_LOCKED = "pin_locked"
    BILL_CREATED = "bill_created"
    BILL_ASSIGNED = "bill_assigned"
    PAYMENT_RECEIVED = "payment_received"
    PAYMENT_FAILED = "payment_failed"
    INVOICE_CREATED = "invoice_created"
    EXPENSE_CREATED = "expense_created"
    EXPENSE_APPROVED = "expense_approved"
    EXPENSE_DECLINED = "expense_declined"
    NOTIFICATION_SENT = "notification_sent"
    VERIFICATION_SUBMITTED = "verification_submitted"
    VERIFICATION_APPROVED = "verification_approved"
    VERIFICATION_REJECTED = "verification_rejected"
    VOUCH_SUBMITTED = "vouch_submitted"
    FAMILY_MEMBER_ADDED = "family_member_added"
    FAMILY_MEMBER_REMOVED = "family_member_removed"
    CHAT_MESSAGE_SENT = "chat_message_sent"
    CHAT_BROADCAST = "chat_broadcast"
    ESTATE_CREATED = "estate_created"
    ESTATE_UPDATED = "estate_updated"
    SUBSCRIPTION_CHANGED = "subscription_changed"
    ROLE_CHANGED = "role_changed"
    PERMISSION_GRANTED = "permission_granted"
    PERMISSION_REVOKED = "permission_revoked"
    SUBACCOUNT_CREATED = "subaccount_created"
    SETTLEMENT_COMPLETED = "settlement_completed"
    REFUND_PROCESSED = "refund_processed"


class ActivityLog(BaseTableModel):
    """Immutable audit trail — tenant schema.

    Uses String for activity_type instead of PG Enum so new
    feature types can be added without ALTER TABLE migrations.
    """

    __tablename__ = "activity_logs"

    # Foreign Keys
    user_id = Column(
        String,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,  # Nullable for system events
        index=True,
    )

    # Activity Details
    activity_type = Column(
        String(50),
        nullable=False,
        index=True,
        comment="Category string (not PG enum) for extensibility",
    )

    action = Column(
        String(100),
        nullable=False,
        comment="Brief verb: Created, Updated, Deleted, Approved ...",
    )

    description = Column(
        Text,
        nullable=False,
        comment="Human-readable description",
    )

    # Target — what was affected
    target_type = Column(
        String(50),
        nullable=True,
        index=True,
        comment="Model name: Bill, User, VisitorCode, Expense ...",
    )

    target_id = Column(
        String,
        nullable=True,
        index=True,
        comment="UUID of affected record",
    )

    # Request context
    ip_address = Column(String(45), nullable=True)  # IPv6
    user_agent = Column(String(500), nullable=True)

    # Structured metadata (JSONB for PG queries)
    extra_metadata = Column(
        "metadata",
        JSONB,
        nullable=True,
        comment="Extra context: old/new values, amounts, references",
    )

    # V2: Severity for filtering
    severity = Column(
        String(10),
        nullable=False,
        default="info",
        comment="info | warning | critical",
    )

    # Relationships
    user = relationship(
        "User",
        back_populates="activity_logs",
        foreign_keys=[user_id],
    )

    # Composite indexes for dashboard queries
    __table_args__ = (
        Index("idx_actlog_user_created", "user_id", "created_at"),
        Index("idx_actlog_type_created", "activity_type", "created_at"),
        Index("idx_actlog_target", "target_type", "target_id"),
        Index("idx_actlog_severity", "severity", "created_at"),
    )

    def __repr__(self):
        return f"<ActivityLog(id={self.id}, type={self.activity_type}, action={self.action})>"

    @property
    def user_display_name(self):
        """Display name of the actor."""
        if self.user:
            return self.user.full_name or self.user.phone_number or "Unknown"
        return "System"
