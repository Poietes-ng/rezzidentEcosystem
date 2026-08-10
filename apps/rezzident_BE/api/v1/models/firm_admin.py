"""Firm admin model — public schema.

CORRECTED: FirmAdmin is now the 2 designated contacts when a Firm
(real estate company) manages an estate instead of a community.

When management_type = "firm":
  - The Firm record holds company info
  - FirmAdmin records hold the 2 designated contacts (same as stakeholders)
  - These contacts are mirrored into the Stakeholder table for the estate

When management_type = "community":
  - No Firm or FirmAdmin needed
  - Stakeholders are the elected community leaders
"""

from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class FirmAdmin(BaseTableModel):
    """Firm's designated estate contacts — public schema.

    Max 2 per firm per estate. When a firm registers an estate,
    these become the stakeholders in the Stakeholder table.
    """

    __tablename__ = "firm_admins"

    firm_id = Column(String, ForeignKey("firms.id"), nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)

    # ── V2: Which estate this admin is designated for ──
    designated_estate_id = Column(
        String, nullable=True, index=True,
        comment="Estate this firm admin is designated to manage",
    )
    is_primary_contact = Column(
        Boolean, default=False,
        comment="Primary contact for resident approvals",
    )

    # Relationships
    firm = relationship("Firm", back_populates="admins")
