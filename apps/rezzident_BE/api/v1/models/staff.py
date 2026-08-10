"""Staff model — tenant schema. Mirrors estate_management_BE."""

from sqlalchemy import Column, String, Boolean
from api.v1.models.base_model import BaseTableModel


class Staff(BaseTableModel):
    """Estate staff records (security guards, etc.) — tenant schema."""

    __tablename__ = "staff"

    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=False, index=True)
    email = Column(String(100), nullable=True)
    role = Column(String(50), nullable=False)  # "security_guard", "maintenance", etc.
    photo_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
