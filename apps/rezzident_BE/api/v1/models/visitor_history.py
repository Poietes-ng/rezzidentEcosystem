"""Visitor history model — tenant schema.

V2 update: Added V1 compatibility fields that the dashboard and security
flow require: time_of_visit, actual_arrival, actual_departure, reason_for_visit.
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class Visitor(BaseTableModel):
    """Visitor entry/exit log — tenant schema."""

    __tablename__ = "visitors"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    visitor_code_id = Column(String, ForeignKey("visitor_codes.id"), nullable=True, index=True)

    # ── Visitor Info ──
    visitor_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=True)  # V2: renamed from visitor_phone
    visitor_image = Column(String(500), nullable=True)

    # ── Visit Details ──
    purpose = Column(String(100), nullable=True)
    reason_for_visit = Column(Text, nullable=True)  # V2: detailed reason
    house_number = Column(String(50), nullable=True)

    # ── Scheduling & Gate Log ──
    time_of_visit = Column(DateTime(timezone=True), nullable=True)  # Scheduled time
    actual_arrival = Column(DateTime(timezone=True), nullable=True)  # Gate check-in
    actual_departure = Column(DateTime(timezone=True), nullable=True)  # Gate check-out

    # ── V1 compat aliases (some code may reference old field names) ──
    checked_in_at = Column(DateTime(timezone=True), nullable=True)  # Same as actual_arrival
    checked_out_at = Column(DateTime(timezone=True), nullable=True)  # Same as actual_departure
    checked_in_by = Column(String, nullable=True)  # Security guard user_id

    # Relationships
    user = relationship("User", back_populates="visitors")
    visitor_code = relationship("VisitorCode", back_populates="visits")
