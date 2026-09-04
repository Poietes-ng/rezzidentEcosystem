"""Support ticket model — tenant schema. Mirrors estate_management_BE."""

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class SupportTicket(BaseTableModel):
    """Support tickets — tenant schema."""

    __tablename__ = "support_tickets"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    subject = Column(String(200), nullable=False)
    message = Column(String, nullable=False)
    status = Column(String(20), default="open", index=True)  # open, in_progress, resolved, closed
    priority = Column(String(20), default="medium")  # low, medium, high, urgent
    category = Column(String(50), nullable=True)
    assigned_to = Column(String, nullable=True)
    resolved_at = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="support_tickets")
