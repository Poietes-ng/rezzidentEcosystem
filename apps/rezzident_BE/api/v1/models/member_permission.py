"""Member permission model — tenant schema (V2 new).

Granular permissions for managed members (family tree).
A primary holder can grant/revoke specific actions for their managed members.

Reference: docs/architecture/06-managed-members.md
"""

from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class MemberPermission(BaseTableModel):
    """Per-member permission grants — tenant schema."""

    __tablename__ = "member_permissions"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    granted_by = Column(String, ForeignKey("users.id"), nullable=False)

    # Individual permissions (default: False — opt-in)
    can_pay_bills = Column(Boolean, default=False)
    can_create_visitor_code = Column(Boolean, default=True)
    can_view_bills = Column(Boolean, default=True)
    can_community_chat = Column(Boolean, default=True)
    can_report_issues = Column(Boolean, default=True)
    can_view_expenses = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="member_permissions")
