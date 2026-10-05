"""Platform user model — public schema.

CORRECTED: Connected to the system with proper role, relationships,
and audit logging. These are the Rezzident platform super-admins
who manage the entire SaaS platform (not estate admins).
"""

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class PlatformUser(BaseTableModel):
    """Platform super admin accounts — public schema.

    Connected to:
    - PlatformAuditLog (tracks their actions)
    - Estate (registered_by references this)
    """

    __tablename__ = "platform_users"

    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)

    # ── V2: Role & Permissions ──
    role = Column(
        String(30),
        default="platform_admin",
        comment="platform_admin | platform_super_admin | support",
    )
    permissions = Column(
        JSONB,
        nullable=True,
        comment='Granular permissions: {"manage_estates": true, "manage_billing": true}',
    )

    # ── V2: Session Tracking ──
    login_count = Column(Integer, default=0)
    last_ip = Column(String(45), nullable=True)

    # Relationships
    audit_logs = relationship(
        "PlatformAuditLog",
        back_populates="actor",
        foreign_keys="[PlatformAuditLog.actor_id]",
    )
