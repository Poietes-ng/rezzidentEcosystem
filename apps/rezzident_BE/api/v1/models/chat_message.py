"""Chat message model — tenant schema (V2 new).

Community chat for estate residents.
Reference: docs/architecture/13-database-schema.md
"""

from sqlalchemy import Column, String, DateTime, ForeignKey

from api.v1.models.base_model import BaseTableModel


class ChatMessage(BaseTableModel):
    """Community chat messages — tenant schema."""

    __tablename__ = "chat_messages"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    channel = Column(String(50), default="general", index=True)
    # Channels: "general", "announcements", "marketplace", etc.
    message = Column(String, nullable=False)
    message_type = Column(String(20), default="text")  # "text", "image", "file"
    media_url = Column(String(500), nullable=True)
    reply_to_id = Column(String, ForeignKey("chat_messages.id"), nullable=True)
