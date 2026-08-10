"""Firm model — public schema.

Real estate firms that can manage estates on behalf of communities.
When management_type = "firm", the Firm's FirmAdmin contacts become
the estate's stakeholders.

Note: Not all estates use firms. Community-managed estates don't need this.
"""

from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class Firm(BaseTableModel):
    """Real estate firm registry — public schema."""

    __tablename__ = "firms"

    firm_code = Column(String(10), unique=True, nullable=False, index=True)
    company_name = Column(String(200), nullable=False)
    cac_number = Column(String(50), nullable=True)
    address = Column(String, nullable=True)
    logo_url = Column(String(500), nullable=True)
    website = Column(String(200), nullable=True)
    primary_contact_name = Column(String(100), nullable=True)
    primary_contact_phone = Column(String(20), nullable=True)
    primary_contact_email = Column(String(100), nullable=True)
    nin_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    # Relationships
    admins = relationship("FirmAdmin", back_populates="firm")
