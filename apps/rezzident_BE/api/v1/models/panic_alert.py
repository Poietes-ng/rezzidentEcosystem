"""Panic Alert model — tenant schema (V2 new).

From Figma flow: Home → Panic Button
→ Select Reason for panic (pre-filled / make panic gesture)
→ Complete resident vouching on the road list

Panic alerts are critical safety events that notify:
1. Estate security guards immediately
2. Estate admin/management
3. Nearby residents (optional broadcast)
"""

from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
import enum

from api.v1.models.base_model import BaseTableModel


class PanicAlertStatus(str, enum.Enum):
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"
    FALSE_ALARM = "false_alarm"
    CANCELLED = "cancelled"


class PanicAlert(BaseTableModel):
    """Panic button alerts from residents — tenant schema."""

    __tablename__ = "panic_alerts"

    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)

    # ── Alert Info ──
    reason = Column(
        String(100), nullable=False, index=True,
        comment="Pre-filled reason: fire, intrusion, medical, theft, other",
    )
    description = Column(Text, nullable=True)
    status = Column(
        String(20), default="active", nullable=False, index=True,
        comment="active | acknowledged | resolved | false_alarm | cancelled",
    )

    # ── Location (auto-captured) ──
    gps_latitude = Column(Float, nullable=True)
    gps_longitude = Column(Float, nullable=True)
    house_number = Column(String(50), nullable=True)

    # ── Response Tracking ──
    acknowledged_by = Column(String, nullable=True)  # Security guard user_id
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    resolved_by = Column(String, nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    resolution_notes = Column(Text, nullable=True)

    # ── V2: Trigger method ──
    trigger_method = Column(
        String(20), default="button",
        comment="button | gesture | voice — how alert was triggered",
    )

    # ── Metadata ──
    metadata = Column(JSONB, nullable=True)

    # Relationships
    user = relationship("User")
