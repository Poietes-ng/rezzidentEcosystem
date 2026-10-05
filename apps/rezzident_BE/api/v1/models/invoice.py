"""Invoice models — tenant schema. Mirrors estate_management_BE."""

import enum

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class InvoiceStatus(enum.StrEnum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class Invoice(BaseTableModel):
    """Invoices — tenant schema."""

    __tablename__ = "invoices"

    invoice_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    total_amount = Column(Float, default=0.0)
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.DRAFT, index=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")
    payments = relationship(
        "InvoicePayment", back_populates="invoice", cascade="all, delete-orphan"
    )


class InvoiceItem(BaseTableModel):
    """Invoice line items — tenant schema."""

    __tablename__ = "invoice_items"

    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=False, index=True)
    description = Column(String(200), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    # Relationships
    invoice = relationship("Invoice", back_populates="items")


class InvoicePayment(BaseTableModel):
    """Invoice payment records — tenant schema."""

    __tablename__ = "invoice_payments"

    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    reference = Column(String(100), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    invoice = relationship("Invoice", back_populates="payments")
