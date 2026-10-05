"""Platform audit log — public schema.

CORRECTED: Connected to PlatformUser with proper relationships.
Tracks all platform-level actions across all estates.
"""

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class PlatformAuditLog(BaseTableModel):
    """Cross-tenant audit trail — public schema. Append-only."""

    __tablename__ = "platform_audit_log"

    # ── Actor ──
    actor_id = Column(
        String,
        ForeignKey("platform_users.id"),
        nullable=False,
        index=True,
    )
    actor_type = Column(
        String(20),
        nullable=False,
        comment="platform_admin | platform_super_admin | system",
    )

    # ── Action ──
    action = Column(String(100), nullable=False)
    description = Column(String, nullable=True)

    # ── Target ──
    resource_type = Column(
        String(50),
        nullable=True,
        comment="estate | subscription | stakeholder | platform_user",
    )
    resource_id = Column(String, nullable=True)
    estate_id = Column(String, nullable=True, index=True)

    # ── Context ──
    details = Column(JSONB, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)

    # Relationships
    actor = relationship(
        "PlatformUser",
        back_populates="audit_logs",
        foreign_keys=[actor_id],
    )
