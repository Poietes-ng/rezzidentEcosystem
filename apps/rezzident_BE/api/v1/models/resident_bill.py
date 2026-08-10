"""Resident bill model — tenant schema. Mirrors estate_management_BE."""

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from api.v1.models.base_model import BaseTableModel


class ResidentBillStatus(str, enum.Enum):
    PENDING = "pending"
    PARTIALLY_PAID = "partially_paid"
    PAID = "paid"
    OVERDUE = "overdue"
    WAIVED = "waived"


class ResidentBill(BaseTableModel):
    """Per-resident bill assignment and payment tracking — tenant schema."""

    __tablename__ = "resident_bills"

    bill_id = Column(String, ForeignKey("bills.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    house_number = Column(String(50), nullable=True)
    amount_due = Column(Float, nullable=False)
    amount_paid = Column(Float, default=0.0)
    status = Column(Enum(ResidentBillStatus), default=ResidentBillStatus.PENDING, index=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    payment_reference = Column(String(100), nullable=True)

    # Relationships
    bill = relationship("Bill", back_populates="resident_bills")
    user = relationship("User", foreign_keys=[user_id], back_populates="resident_bills")
