"""Resident model — tenant schema.

Pre-loaded CSV data for estate residents. Used for Tier 1 → Tier 2 verification
(CSV match = automatic Tier 2 "pre_verified").

V2 update: Added fields from Figma estate registration form:
- NIN for identity verification
- house_entity_data (JSONB) for structure-based house info
- is_registered flag to track if resident has created an app account
"""

from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import JSONB

from api.v1.models.base_model import BaseTableModel


class Resident(BaseTableModel):
    """Pre-loaded resident records from CSV or estate setup — tenant schema."""

    __tablename__ = "residents"

    house_number = Column(String(50), nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=True, index=True)
    email = Column(String(100), nullable=True)

    # ── V2: Identity ──
    nin = Column(String(20), nullable=True, comment="National Identification Number")

    # ── V2: House Entity Data (from Figma estate registration) ──
    house_entity_data = Column(
        JSONB, nullable=True,
        comment="Structure-specific data: block, street, floor, unit, etc.",
    )

    # ── V2: Registration Tracking ──
    is_registered = Column(
        Boolean, default=False,
        comment="True when this resident has created an app account",
    )
    registered_user_id = Column(
        String, nullable=True,
        comment="user.id of the app account linked to this pre-loaded record",
    )
