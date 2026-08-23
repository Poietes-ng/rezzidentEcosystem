from uuid6 import uuid7
from api.db.database import Base
from sqlalchemy import Column, String, DateTime, Boolean, func


class BaseTableModel(Base):
    """Base model providing id, timestamps, and soft delete for all models.

    Mirrors BaseTableModel with additions:
    - Soft delete support (is_deleted, deleted_at)
    - to_dict() helper method
    """

    __abstract__ = True

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid7().hex))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    def to_dict(self):
        """Returns a dictionary representation of the instance."""
        obj_dict = self.__dict__.copy()
        del obj_dict["_sa_instance_state"]
        obj_dict["id"] = self.id
        if self.created_at:
            obj_dict["created_at"] = self.created_at.isoformat()
        if self.updated_at:
            obj_dict["updated_at"] = self.updated_at.isoformat()
        return obj_dict

    def soft_delete(self):
        """Mark this record as deleted without removing from database."""
        from datetime import datetime, timezone

        self.is_deleted = True
        self.deleted_at = datetime.now(timezone.utc)
