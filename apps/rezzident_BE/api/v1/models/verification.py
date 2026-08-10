"""Verification models — tenant schema (V2).

Updated from Figma flow:
- vouch_code on VerificationRequest (shareable via WhatsApp, socials, etc.)
- vouch_link_url for deep linking
- min_vouches_required (Figma says "at least 2")
- voucher tracking with full name + phone for identity

Figma Flow: "My neighbors can vouch for me (at least 2)"
→ Enter name + facial capture
→ Generate Link for vouching/vouch
→ Share via WhatsApp, Facebook, Instagram, X, TikTok & Copy
→ 2 vouches → Tier 2

Reference: docs/architecture/07-resident-verification-tiers.md
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import JSONB
import enum

from api.v1.models.base_model import BaseTableModel


class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXPIRED = "expired"


class VerificationRequest(BaseTableModel):
    """Resident verification requests — tenant schema."""

    __tablename__ = "verification_requests"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    requested_tier = Column(String(20), nullable=False)  # The tier being requested

    # ── Verification Method ──
    method = Column(
        String(30), nullable=False, default="vouch",
        comment="vouch | admin_review | csv_match | nin_verify",
    )

    status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, index=True)
    evidence = Column(JSONB, nullable=True)  # Supporting documents / data

    # ── V2: Vouch Flow (from Figma) ──
    vouch_code = Column(
        String(20), unique=True, nullable=True, index=True,
        comment="Shareable code for vouch links (Figma: share via WhatsApp etc.)",
    )
    vouch_link_url = Column(
        String(500), nullable=True,
        comment="Deep link URL: rezzident.app/vouch/{vouch_code}",
    )
    min_vouches_required = Column(
        Integer, default=2,
        comment="Figma says 'at least 2' neighbors",
    )
    vouches_received = Column(Integer, default=0)

    # ── Admin Review ──
    reviewed_by = Column(String, nullable=True)  # Admin user_id
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_comment = Column(String, nullable=True)

    # ── V2: Facial Capture (from Figma registration) ──
    facial_capture_url = Column(
        String(500), nullable=True,
        comment="Facial capture submitted during verification",
    )


class VerificationVouch(BaseTableModel):
    """Neighbor vouch records — tenant schema.

    Figma: "My neighbors can vouch for me (at least 2)"
    Each vouch is one neighbor confirming the resident's identity.
    """

    __tablename__ = "verification_vouches"

    verification_request_id = Column(
        String, ForeignKey("verification_requests.id"), nullable=False, index=True
    )
    voucher_user_id = Column(String, ForeignKey("users.id"), nullable=False)
    voucher_house_number = Column(String(50), nullable=True)

    # ── V2: Voucher Identity (for audit trail) ──
    voucher_full_name = Column(String(100), nullable=True)
    voucher_phone_number = Column(String(20), nullable=True)

    is_valid = Column(Boolean, default=True)
    vouched_at = Column(DateTime(timezone=True), nullable=True)

    # ── V2: Vouch method tracking ──
    vouch_method = Column(
        String(20), nullable=True,
        comment="link | code | in_app — how the vouch was submitted",
    )
