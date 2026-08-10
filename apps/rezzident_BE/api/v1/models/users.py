"""User model — tenant schema.

V2 updates from Figma flow:
- facial_capture_url: required during registration (facial capture step)
- nin: National Identification Number (for estate house entity setup)
- dashboard_tier: computed from verification_tier (Tier 1 = restricted, Tier 2 = full)
- vouch_code: unique code for sharing vouch links

The Figma flow shows 3 registration paths:
1. Has Estate ID → Enter ID, details, facial capture → Set PIN → Dashboard Tier 1
2. No Estate ID + Vouch → Enter name + facial capture → Generate vouch link → 2 vouches → Tier 2
3. No Estate ID + No Vouch → Redirect to create estate on website

Reference: docs/architecture/13-database-schema.md, 08-pin-biometric-auth.md
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from api.v1.models.base_model import BaseTableModel


class UserRole(str, enum.Enum):
    """User role types — V2 expanded roles."""

    RESIDENT = "resident"
    STAFF = "staff"
    SECURITY = "security"
    ADMIN_SECRETARY = "admin_secretary"
    SECRETARY = "secretary"
    TREASURER = "treasurer"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class VerificationTier(str, enum.Enum):
    """Resident verification tiers — from Figma flow.

    Figma Tier 1 (restricted): SELF_REGISTERED → can view, cannot pay bills/schedule visitors
    Figma Tier 2 (full access): PRE_VERIFIED, ADMIN_APPROVED, or VOUCHED
    """

    PRE_VERIFIED = "pre_verified"       # CSV match → automatic Tier 2
    ADMIN_APPROVED = "admin_approved"   # Admin manually approved → Tier 2
    VOUCHED = "vouched"                 # 2 neighbors vouched → Tier 2
    SELF_REGISTERED = "self_registered" # Unverified → Tier 1 (restricted)


class ConnectionType(str, enum.Enum):
    """Managed member connection types for family tree."""

    FAMILY = "family"
    TENANT = "tenant"
    DOMESTIC_STAFF = "domestic_staff"
    CARETAKER = "caretaker"


class User(BaseTableModel):
    """Registered users/residents and admin staff — tenant schema."""

    __tablename__ = "users"

    resident_id = Column(String, ForeignKey("residents.id"), nullable=True, index=True)
    estate_id = Column(String, nullable=True, index=True)
    house_number = Column(String(50), nullable=True, index=True)
    phone_number = Column(String(20), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True, index=True)
    gender = Column(String(10), nullable=True)
    password_hash = Column(String(255), nullable=True)  # For admin web login
    profile_image = Column(String(500), nullable=True)  # Cloudinary URL
    is_active = Column(Boolean, default=True, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.RESIDENT, nullable=False, index=True)
    last_login = Column(DateTime(timezone=True), nullable=True)

    # ── V2: PIN Authentication (Figma: Setup 4-digit PIN, Confirm PIN) ──
    pin_hash = Column(String(255), nullable=True)  # bcrypt of 4-digit PIN

    # ── V2: Facial Capture (Figma: required at registration) ──
    facial_capture_url = Column(String(500), nullable=True)

    # ── V2: NIN (Figma: estate house entity setup, identity verification) ──
    nin = Column(String(20), nullable=True)

    # ── V2: Verification (Figma: Tier 1 = restricted, Tier 2 = full) ──
    verification_tier = Column(
        Enum(VerificationTier),
        default=VerificationTier.SELF_REGISTERED,
        nullable=False,
        index=True,
    )

    # ── V2: Vouch Code (Figma: "My neighbors can vouch for me") ──
    vouch_code = Column(
        String(20), unique=True, nullable=True, index=True,
        comment="Unique code for sharing vouch links via WhatsApp/socials",
    )

    # ── V2: Registration Source (tracks which Figma path was used) ──
    registration_source = Column(
        String(30), nullable=True,
        comment="estate_id | vouch | self | admin_invite | csv_import",
    )

    # ── V2: Family Tree ──
    primary_holder_id = Column(String, ForeignKey("users.id"), nullable=True)
    connection_type = Column(Enum(ConnectionType), nullable=True)
    slot_number = Column(Integer, nullable=True)  # 1-8 within household

    # ── V2: PIN Lockout ──
    pin_attempts = Column(Integer, default=0)
    pin_locked_until = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    resident = relationship("Resident", foreign_keys=[resident_id])
    visitors = relationship(
        "Visitor", back_populates="user", cascade="all, delete-orphan"
    )
    visitor_codes = relationship(
        "VisitorCode", back_populates="user", cascade="all, delete-orphan"
    )
    bills = relationship(
        "Bill", back_populates="user", cascade="all, delete-orphan"
    )
    payments = relationship(
        "Payment", back_populates="user", cascade="all, delete-orphan"
    )
    notifications = relationship(
        "Notification", back_populates="user", cascade="all, delete-orphan"
    )
    support_tickets = relationship(
        "SupportTicket", back_populates="user", cascade="all, delete-orphan"
    )
    resident_bills = relationship(
        "ResidentBill",
        foreign_keys="[ResidentBill.user_id]",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    activity_logs = relationship(
        "ActivityLog",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    managed_members = relationship(
        "User",
        backref="primary_holder",
        remote_side="User.id",
        foreign_keys=[primary_holder_id],
    )
    member_permissions = relationship(
        "MemberPermission",
        foreign_keys="[MemberPermission.user_id]",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # Helper methods
    def is_resident_role(self) -> bool:
        return self.role == UserRole.RESIDENT

    def is_admin_role(self) -> bool:
        return self.role in [
            UserRole.SECURITY,
            UserRole.ADMIN_SECRETARY,
            UserRole.SECRETARY,
            UserRole.TREASURER,
            UserRole.ADMIN,
        ]

    def is_super_admin_role(self) -> bool:
        return self.role == UserRole.SUPER_ADMIN

    def has_admin_privileges(self) -> bool:
        return self.is_admin_role() or self.is_super_admin_role()

    def is_primary_holder(self) -> bool:
        return self.primary_holder_id is None

    def is_pin_locked(self) -> bool:
        if self.pin_locked_until is None:
            return False
        from datetime import timezone
        return datetime.now(timezone.utc) < self.pin_locked_until

    @property
    def dashboard_tier(self) -> int:
        """Figma: Tier 1 = restricted view, Tier 2 = full access.

        Tier 1: self_registered (unverified) → can view dashboard but
                cannot pay bills, schedule visitors, etc.
        Tier 2: pre_verified, admin_approved, or vouched → full features.
        """
        if self.verification_tier == VerificationTier.SELF_REGISTERED:
            return 1
        return 2

    @property
    def is_tier_2(self) -> bool:
        """True if user has full feature access (verified)."""
        return self.dashboard_tier == 2
