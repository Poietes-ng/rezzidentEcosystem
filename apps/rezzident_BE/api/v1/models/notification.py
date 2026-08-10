"""Notification model — tenant schema. Mirrors estate_management_BE."""

from sqlalchemy import Column, String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from api.v1.models.base_model import BaseTableModel


class NotificationType(str, enum.Enum):
    BILL = "bill"
    PAYMENT = "payment"
    VISITOR = "visitor"
    ANNOUNCEMENT = "announcement"
    VERIFICATION = "verification"
    SYSTEM = "system"


class Notification(BaseTableModel):
    """In-app notifications — tenant schema."""

    __tablename__ = "notifications"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    message = Column(String, nullable=False)
    notification_type = Column(Enum(NotificationType), nullable=True)
    is_read = Column(Boolean, default=False)
    action_url = Column(String(500), nullable=True)
    resource_id = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="notifications")
