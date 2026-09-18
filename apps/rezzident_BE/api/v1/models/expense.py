"""Expense models — tenant schema. Mirrors estate_management_BE."""

import enum

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class ExpenseStatus(enum.StrEnum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class ExpensePaymentStatus(enum.StrEnum):
    UNPAID = "unpaid"
    PARTIALLY_PAID = "partially_paid"
    PAID = "paid"


class ApprovalStatus(enum.StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Expense(BaseTableModel):
    """Estate expenses — tenant schema."""

    __tablename__ = "expenses"

    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    total_amount = Column(Float, default=0.0)
    category = Column(String(50), nullable=True)
    status = Column(Enum(ExpenseStatus), default=ExpenseStatus.DRAFT, index=True)
    payment_status = Column(Enum(ExpensePaymentStatus), default=ExpensePaymentStatus.UNPAID)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    receipt_url = Column(String(500), nullable=True)

    # Relationships
    items = relationship("ExpenseItem", back_populates="expense", cascade="all, delete-orphan")
    approvals = relationship(
        "ExpenseApproval", back_populates="expense", cascade="all, delete-orphan"
    )


class ExpenseItem(BaseTableModel):
    """Individual line items within an expense — tenant schema."""

    __tablename__ = "expense_items"

    expense_id = Column(String, ForeignKey("expenses.id"), nullable=False, index=True)
    description = Column(String(200), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    # Relationships
    expense = relationship("Expense", back_populates="items")


class ExpenseApproval(BaseTableModel):
    """Expense approval records — tenant schema."""

    __tablename__ = "expense_approvals"

    expense_id = Column(String, ForeignKey("expenses.id"), nullable=False, index=True)
    approver_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    comment = Column(String, nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    expense = relationship("Expense", back_populates="approvals")
