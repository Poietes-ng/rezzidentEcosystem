"""Estate model — public schema.

based on Figma flow:
- Estate structure system: supports 200+ address patterns with preloaded
  templates AND custom structure requests
- Stakeholders are the 2 contact people (from Figma registration form)
- Connected to Subscription properly
- Onboarding flow: registration → verification → house_setup → active

Structure Examples (preloaded):
  Pattern 1: Estate Name → Street → House Number
  Pattern 2: Estate Name → Block → Flat Number  
  Pattern 3: Estate Name → Area → Plot → Unit
  Pattern 4: Estate Name → Phase → Street → House Number
  Pattern 5: Estate Name → Zone → Block → Floor → Flat
  ... (200+ combinations stored in estate_structure_templates table)
"""

from sqlalchemy import Column, String, Float, ForeignKey, Integer, Boolean, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
import enum

from api.v1.models.base_model import BaseTableModel


class EstateStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DELETED = "deleted"


class OnboardingStep(str, enum.Enum):
    REGISTRATION = "registration"
    STAKEHOLDER_VERIFICATION = "stakeholder_verification"
    HOUSE_SETUP = "house_setup"
    ACTIVE = "active"


class Estate(BaseTableModel):
    """Estate registry — public schema (cross-tenant)."""

    __tablename__ = "estates"

    # ── Core Identity ──
    estate_code = Column(String(10), unique=True, nullable=False, index=True)
    schema_name = Column(String(20), unique=True, nullable=False)
    name = Column(String(200), nullable=False)

    # ── Location (Figma: Estate Address, State, Local Government, GPS) ──
    address = Column(String, nullable=False)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    local_government = Column(String(100), nullable=True)
    country = Column(String(100), default="Nigeria")
    gps_latitude = Column(Float, nullable=True)
    gps_longitude = Column(Float, nullable=True)

    # ── Media ──
    estate_logo_url = Column(String(500), nullable=True)

    # ══════════════════════════════════════════════════════
    # ESTATE STRUCTURE (Figma: "preloaded and option to indicate absence")
    #
    # This is the KEY feature — 200+ address pattern combinations.
    # stored as a JSONB array of level definitions.
    #
    # Example structure_template for "Estate → Block → Floor → Flat":
    # {
    #   "template_id": "block_floor_flat",
    #   "template_name": "Block → Floor → Flat",
    #   "levels": [
    #     {"level": 1, "label": "Block", "type": "alphanumeric", "prefix": "Block "},
    #     {"level": 2, "label": "Floor", "type": "numeric", "prefix": "Floor "},
    #     {"level": 3, "label": "Flat", "type": "alphanumeric", "prefix": "Flat "}
    #   ]
    # }
    #
    # Custom structures also use this same format — user defines their own levels.
    # ══════════════════════════════════════════════════════
    has_structure = Column(Boolean, default=True)
    structure_template_id = Column(
        String(50), nullable=True,
        comment="ID from estate_structure_templates table, or 'custom'",
    )
    structure_definition = Column(
        JSONB, nullable=True,
        comment="Full structure definition (levels array) — either from template or custom",
    )
    is_custom_structure = Column(
        Boolean, default=False,
        comment="True if user requested a custom structure not in preloaded templates",
    )

    # ── House Count ──
    house_count_tier = Column(String(20), nullable=True)  # "<10", "<20", "<50", "<100", "100+"
    actual_house_count = Column(Integer, nullable=True)

    # ── Ownership ──
    # No more firm_id / EstateOfficer — replaced by stakeholders
    # If a firm manages the estate, they register as stakeholders
    registered_by = Column(String, nullable=True, comment="platform_user.id who registered")
    management_type = Column(
        String(20), default="community",
        comment="community | firm — who manages this estate",
    )

    # ── Status & Onboarding ──
    status = Column(String(20), default="pending", index=True)
    onboarding_step = Column(String(30), default="registration")

    # ── Subscription ──
    subscription_id = Column(
        String, ForeignKey("subscriptions.id"), nullable=True,
        comment="Connected subscription record",
    )

    # ── Paystack Split Payment ──
    settlement_bank_code = Column(String(10), nullable=True)
    settlement_account_number = Column(String(20), nullable=True)
    settlement_account_name = Column(String(200), nullable=True)
    paystack_subaccount_code = Column(String(50), nullable=True)
    paystack_subaccount_id = Column(Integer, nullable=True)
    platform_fee_percentage = Column(Float, default=2.00)
    fee_bearer = Column(String(20), default="subaccount")

    # ── Stakeholder Notification Tracking ──
    stakeholder_email_sent = Column(Boolean, default=False)
    center_panel_credentials_sent = Column(Boolean, default=False)

    # Relationships
    subscription = relationship("Subscription", foreign_keys=[subscription_id])
    stakeholders = relationship("Stakeholder", back_populates="estate", cascade="all, delete-orphan")
    house_entities = relationship("HouseEntity", back_populates="estate", cascade="all, delete-orphan")


class Stakeholder(BaseTableModel):
    """Estate stakeholders — public schema.

    Replaces both EstateOfficer and FirmAdmin concept.
    From Figma: "2 min stake holders info" — the 2 contacts
    that residents might reach for approvals.

    If management_type = "firm", these are the firm's designated contacts.
    If management_type = "community", these are elected estate leaders.
    """

    __tablename__ = "stakeholders"

    estate_id = Column(String, ForeignKey("estates.id"), nullable=False, index=True)

    # ── Identity (from Figma registration form) ──
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    nin = Column(String(20), nullable=True)  # Hashed in practice

    # ── Role ──
    role_title = Column(
        String(50), default="stakeholder",
        comment="chairman | secretary | treasurer | stakeholder | firm_rep",
    )
    is_primary = Column(Boolean, default=False, comment="Primary contact for approvals")

    # ── Access ──
    has_panel_access = Column(Boolean, default=False, comment="Can access estate admin panel")
    panel_password_hash = Column(String(255), nullable=True)
    last_login = Column(String, nullable=True)

    # ── Verification ──
    nin_verified = Column(Boolean, default=False)
    photo_url = Column(String(500), nullable=True)

    # Relationships
    estate = relationship("Estate", back_populates="stakeholders")


class HouseEntity(BaseTableModel):
    """Individual house records — public schema.

    From Figma: "fill up house details following selected structure"
    Each row is one addressable unit in the estate.
    The address_components follow the estate's structure_definition.

    Example for "Block → Floor → Flat" structure:
    {
      "Block": "A",
      "Floor": "3",
      "Flat": "12"
    }
    → formatted_address: "Block A, Floor 3, Flat 12"
    """

    __tablename__ = "house_entities"

    estate_id = Column(String, ForeignKey("estates.id"), nullable=False, index=True)

    # ── Address Components (following estate structure) ──
    address_components = Column(
        JSONB, nullable=False,
        comment='Key-value pairs following structure: {"Block": "A", "Floor": "3", "Flat": "12"}',
    )
    formatted_address = Column(
        String(200), nullable=False, index=True,
        comment="Human-readable: 'Block A, Floor 3, Flat 12'",
    )

    # ── Shorthand ──
    house_number = Column(
        String(50), nullable=True, index=True,
        comment="Short reference like 'A-3-12' — generated from components",
    )

    # ── Occupancy ──
    is_occupied = Column(Boolean, default=False)
    occupant_name = Column(String(100), nullable=True)
    occupant_phone = Column(String(20), nullable=True)

    # Relationships
    estate = relationship("Estate", back_populates="house_entities")


class EstateStructureTemplate(BaseTableModel):
    """Preloaded estate address structure templates — public schema.

    200+ combinations of address patterns that estates can choose from.
    Users can also request custom structures.

    Each template defines an ordered list of "levels" that make up an address.
    """

    __tablename__ = "estate_structure_templates"

    # ── Template Identity ──
    template_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    # ── Category for filtering ──
    category = Column(
        String(50), nullable=True, index=True,
        comment="residential | commercial | mixed | gated_community | estate | apartment",
    )

    # ── Structure Definition ──
    levels = Column(
        JSONB, nullable=False,
        comment="""Array of level definitions:
        [
          {"level": 1, "label": "Street", "type": "text", "required": true},
          {"level": 2, "label": "House Number", "type": "alphanumeric", "required": true}
        ]
        Types: text, numeric, alphanumeric, select (with options array)
        """,
    )

    # ── Format ──
    address_format = Column(
        String(200), nullable=True,
        comment="Display format template: '{Street}, House {House Number}'",
    )

    # ── Usage tracking ──
    usage_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
