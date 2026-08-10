"""Bills model — tenant schema. Mirrors estate_management_BE.

V3 UPDATE: A Bill can now represent a platform subscription charge
(bill_type="platform_subscription") that is split across residents via
ResidentBill, same as security_levy/electricity/etc.

The key difference for these bills is is_platform_bill=True: money collected
belongs entirely to the platform, so the payment processor must NOT run the
normal Paystack subaccount split for it (no estate_settlement_kobo — see
PaymentLedger). Everything else about the Bill/ResidentBill/Payment flow is
unchanged.
"""

from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, Integer, Boolean
from sqlalchemy.orm import relationship
import enum

from api.v1.models.base_model import BaseTableModel


class BillStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class Bill(BaseTableModel):
    """Estate bills — tenant schema."""

    __tablename__ = "bills"

    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(Enum(BillStatus), default=BillStatus.ACTIVE, index=True)
    bill_type = Column(
        String(50), nullable=True,
        comment="security_levy | electricity | ... | platform_subscription",
    )
    total_expected = Column(Integer, default=0)
    total_paid = Column(Integer, default=0)

    # ── V3: Platform billing ──
    is_platform_bill = Column(
        Boolean, default=False, index=True,
        comment="True for bill_type='platform_subscription' — payments on "
                "this bill settle 100% to the platform, bypassing the "
                "estate's Paystack subaccount split entirely",
    )
    source_type = Column(
        String(50), nullable=True,
        comment="What generated this bill, e.g. 'subscription' | 'admin' | 'expense'",
    )
    source_id = Column(
        String, nullable=True, index=True,
        comment="ID of the source record, e.g. Subscription.id when "
                "source_type='subscription' (public schema — no cross-schema FK)",
    )

    # Relationships
    user = relationship("User", back_populates="bills")
    resident_bills = relationship("ResidentBill", back_populates="bill", cascade="all, delete-orphan")

    @classmethod
    def is_subscription_bill_type(cls, bill_type: str) -> bool:
        return bill_type == "platform_subscription"