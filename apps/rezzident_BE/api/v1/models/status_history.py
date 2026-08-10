"""Status history model — tenant schema. Mirrors estate_management_BE."""

from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB

from api.v1.models.base_model import BaseTableModel


class StatusHistory(BaseTableModel):
    """Status change history for any entity — tenant schema."""

    __tablename__ = "status_history"

    entity_type = Column(String(50), nullable=False, index=True)  # 'bill', 'expense', 'user'
    entity_id = Column(String, nullable=False, index=True)
    old_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    changed_by = Column(String, nullable=True)
    reason = Column(String, nullable=True)
    metadata = Column(JSONB, nullable=True)
