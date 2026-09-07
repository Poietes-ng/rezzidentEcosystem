"""System health check model — tenant schema (or public schema).

Records snapshots of system health checks for uptime tracking,
incident history, and daily uptime bar charts.
Separate from status_history.py which tracks entity status changes.
"""

from sqlalchemy import Boolean, Column, Float, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from api.v1.models.base_model import BaseTableModel


class SystemHealthCheck(BaseTableModel):
    """Records each health check result for historical tracking."""

    __tablename__ = "system_health_checks"

    # Overall system status at time of check
    overall_status = Column(
        String(30),
        nullable=False,
        index=True,
        comment="operational | degraded | partial_outage | major_outage",
    )

    overall_label = Column(
        String(100),
        nullable=False,
        comment="Human label: 'All Systems Operational'",
    )

    # Snapshot of all service check results (JSON array)
    services = Column(
        JSONB,
        nullable=False,
        comment="Array of {name, status, response_time_ms, description}",
    )

    # Server uptime at time of check
    uptime_seconds = Column(Float, nullable=False, default=0)

    # Whether any service was non-operational
    has_incident = Column(Boolean, nullable=False, default=False, index=True)

    # Comma-separated names of non-operational services
    incident_services = Column(Text, nullable=True)

    __table_args__ = (Index("idx_health_incident_created", "has_incident", "created_at"),)

    def __repr__(self):
        return f"<SystemHealthCheck(id={self.id}, status={self.overall_status})>"
