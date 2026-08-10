"""Payment model — tenant schema. Mirrors estate_management_BE + V2 payment ledger."""

from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from api.v1.models.base_model import BaseTableModel


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentChannel(str, enum.Enum):
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    USSD = "ussd"
    CASH = "cash"


class Payment(BaseTableModel):
    """Payment records — tenant schema."""

    __tablename__ = "payments"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    bill_id = Column(String, ForeignKey("bills.id"), nullable=True, index=True)
    amount = Column(Float, nullable=False)
    reference = Column(String(100), unique=True, nullable=False)
    paystack_reference = Column(String(100), nullable=True)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, index=True)
    channel = Column(Enum(PaymentChannel), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="payments")


class PaymentLedger(BaseTableModel):
    """Split payment ledger — tracks every naira of every transaction.

    V2 addition for Paystack split payments.
    Reference: docs/architecture/22-payment-split-architecture.md
    """

    __tablename__ = "payment_ledger"

    estate_id = Column(String, nullable=False, index=True)
    bill_id = Column(String, nullable=True)
    user_id = Column(String, nullable=True)

    # Transaction details
    paystack_reference = Column(String(100), unique=True, nullable=False, index=True)
    paystack_transaction_id = Column(Integer, nullable=True)

    # Amounts (all in kobo for precision)
    gross_amount_kobo = Column(Integer, nullable=False)
    paystack_fee_kobo = Column(Integer, nullable=False, default=0)
    platform_fee_kobo = Column(Integer, nullable=False, default=0)
    estate_settlement_kobo = Column(Integer, nullable=False)

    # Settlement tracking
    fee_bearer = Column(String(20), nullable=True)  # 'subaccount', 'account'
    settlement_status = Column(String(20), default="pending")
    # 'pending', 'settled', 'failed'
    settled_at = Column(DateTime(timezone=True), nullable=True)

    # Payment method
    payment_channel = Column(String(20), nullable=True)
    card_type = Column(String(20), nullable=True)
    bank_name = Column(String(100), nullable=True)

    # Metadata
    currency = Column(String(3), default="NGN")
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # Reconciliation
    reconciled = Column(Boolean, default=False)
    reconciled_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(String, nullable=True)
