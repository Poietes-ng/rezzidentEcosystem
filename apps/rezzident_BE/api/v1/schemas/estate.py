"""Estate schemas — Pydantic V2 request/response models for estate registration.

Reference: docs/architecture/03-multi-tenant-architecture.md
Figma flow: Estate Registration → Structure Selection → Stakeholder Info → House Setup
"""

from pydantic import BaseModel, Field, field_validator

# ── Registration Flow ──


class StakeholderSchema(BaseModel):
    """Stakeholder info — the 2 key contacts for an estate (from Figma form)."""

    full_name: str = Field(..., min_length=2, max_length=100)
    phone_number: str = Field(..., description="Nigerian phone (+234 or 0 prefix)")
    email: str | None = None
    nin: str | None = None
    role_title: str = Field(
        default="stakeholder",
        description="chairman | secretary | treasurer | stakeholder | firm_rep",
    )
    is_primary: bool = False


class StructureLevelSchema(BaseModel):
    """One level in the estate address structure."""

    level: int
    label: str = Field(..., description="e.g., 'Block', 'Floor', 'Flat'")
    type: str = Field(default="text", description="text | numeric | alphanumeric | select")
    required: bool = True
    options: list[str] | None = None  # For 'select' type


class EstateRegisterSchema(BaseModel):
    """Estate registration — creates a new tenant (schema + record).

    This is the main registration endpoint that:
    1. Generates a unique estate_code (e.g., EST-7X3KM)
    2. Creates a PostgreSQL schema (e.g., est_est7x3km)
    3. Stores the estate record in the public schema
    4. Optionally stores stakeholders
    """

    name: str = Field(..., min_length=2, max_length=200, description="Estate name")
    address: str = Field(..., min_length=5, description="Full address")
    city: str | None = Field(None, max_length=100)
    state: str | None = Field(None, max_length=100)
    local_government: str | None = Field(None, max_length=100)
    management_type: str = Field(
        default="community",
        description="community | firm",
    )

    # ── Structure (optional at registration — can be set later) ──
    structure_template_id: str | None = Field(
        None,
        description="ID from preloaded templates, or None for custom",
    )
    custom_structure: list[StructureLevelSchema] | None = Field(
        None,
        description="Custom structure levels if not using a preloaded template",
    )

    # ── Units (NEW) ──
    number_of_units: int | None = Field(None, ge=1)

    # ── Bank Info (NEW) ──
    settlement_account_number: str | None = Field(None, max_length=20)
    settlement_bank_name: str | None = Field(None, max_length=100)
    settlement_account_name: str | None = Field(None, max_length=200)

    # ── Stakeholders (optional at registration — can be added later) ──
    stakeholders: list[StakeholderSchema] | None = Field(
        None,
        description="2 key contacts for the estate (from Figma form)",
    )

    @field_validator("management_type")
    @classmethod
    def validate_management_type(cls, v):
        valid = {"community", "firm"}
        if v not in valid:
            raise ValueError(f"management_type must be one of {valid}")
        return v


# ── Responses ──


class EstateResponse(BaseModel):
    """Estate record returned after registration."""

    id: str
    estate_code: str
    schema_name: str
    name: str
    address: str
    city: str | None = None
    state: str | None = None
    management_type: str
    status: str
    onboarding_step: str
    created_at: str

    class Config:
        from_attributes = True


class EstateListResponse(BaseModel):
    """Minimal estate info for listing / search."""

    id: str
    estate_code: str
    name: str
    city: str | None = None
    state: str | None = None
    status: str
