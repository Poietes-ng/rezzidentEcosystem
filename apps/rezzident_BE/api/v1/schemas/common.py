"""Common schemas — shared Pydantic models for pagination, filters, and enums."""

from typing import Optional
from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    """Query parameters for pagination."""
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
    sort: Optional[str] = Field(default="-created_at", description="Sort field with - prefix for desc")


class PaginationMeta(BaseModel):
    """Pagination metadata in API responses."""
    page: int
    per_page: int
    total: int
    total_pages: int


class ApiEnvelope(BaseModel):
    """Standard API response envelope."""
    status: bool
    status_code: int
    message: str
    data: Optional[dict] = None
    meta: Optional[PaginationMeta] = None
