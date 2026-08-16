"""Estate routes — registration and management endpoints.

The registration endpoint is the entry point for the SaaS onboarding flow:
1. Admin registers an estate → system generates estate_code + PostgreSQL schema
2. Admin sets up house structure (preloaded template or custom)
3. Admin adds stakeholders (2 key contacts)
4. Estate goes active → residents can join using the estate_code

Reference: docs/architecture/03-multi-tenant-architecture.md
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api.db.database import get_db
from api.utils.success_response import success_response
from api.utils.jwt_handler import get_current_user
from api.v1.models.users import User
from api.v1.models.estate import Estate, Stakeholder
from api.v1.schemas.estate import EstateRegisterSchema, EstateResponse
from api.v1.services.tenant_service import TenantService
from api.loggers.app_logger import app_logger


estates = APIRouter(prefix="/estates", tags=["Estates"])


# ═══════════════════════════════════════════════
# ESTATE REGISTRATION (creates per-tenant schema)
# ═══════════════════════════════════════════════

@estates.post("/register", status_code=status.HTTP_201_CREATED)
async def register_estate(
    body: EstateRegisterSchema,
    db: Session = Depends(get_db),
):
    """Register a new estate — creates the per-tenant PostgreSQL schema.

    This is the core SaaS onboarding endpoint:
    1. Generates unique estate_code (e.g., PAR-7X3KM) — system-generated
    2. Derives schema_name (e.g., est_par7x3km)
    3. Creates PostgreSQL schema via TenantService
    4. Stores estate record in public schema
    5. Optionally stores stakeholders and structure

    No auth required for initial registration (the registering admin
    becomes the first stakeholder). Auth is added after estate is created.
    """
    try:
        estate = TenantService.register_estate(
            db=db,
            name=body.name,
            address=body.address,
            city=body.city,
            state=body.state,
            management_type=body.management_type,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

    # ── Optional: set structure template ──
    if body.structure_template_id:
        estate.structure_template_id = body.structure_template_id
        estate.has_structure = True
    if body.custom_structure:
        estate.structure_definition = [
            level.model_dump() for level in body.custom_structure
        ]
        estate.is_custom_structure = True
        estate.has_structure = True

    # ── Optional: house count ──
    if body.house_count_tier:
        estate.house_count_tier = body.house_count_tier

    # ── Optional: add stakeholders ──
    if body.stakeholders:
        for s in body.stakeholders:
            stakeholder = Stakeholder(
                estate_id=estate.id,
                full_name=s.full_name,
                phone_number=s.phone_number,
                email=s.email,
                role_title=s.role_title,
                is_primary=s.is_primary,
            )
            db.add(stakeholder)

    db.commit()
    db.refresh(estate)

    app_logger.info(
        f"Estate registered: {estate.name} ({estate.estate_code}) "
        f"→ schema: {estate.schema_name}"
    )

    return success_response(
        status_code=status.HTTP_201_CREATED,
        message="Estate registered successfully.",
        data={
            "id": estate.id,
            "estate_code": estate.estate_code,
            "schema_name": estate.schema_name,
            "name": estate.name,
            "address": estate.address,
            "city": estate.city,
            "state": estate.state,
            "management_type": estate.management_type,
            "status": estate.status,
            "onboarding_step": estate.onboarding_step,
        },
    )


# ═══════════════════════════════════════════════
# ESTATE LOOKUP (by estate_code — for residents joining)
# ═══════════════════════════════════════════════

@estates.get("/lookup/{estate_code}", status_code=status.HTTP_200_OK)
async def lookup_estate(
    estate_code: str,
    db: Session = Depends(get_db),
):
    """Look up an estate by its code — used by residents when joining.

    Returns public estate info (name, address) without sensitive data.
    This is called during user registration when they enter an estate_code.
    """
    estate = db.query(Estate).filter(
        Estate.estate_code == estate_code.upper(),
        Estate.status == "active",
    ).first()

    if not estate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estate not found. Please check the estate code.",
        )

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Estate found.",
        data={
            "id": estate.id,
            "estate_code": estate.estate_code,
            "name": estate.name,
            "city": estate.city,
            "state": estate.state,
            "has_structure": estate.has_structure,
        },
    )


# ═══════════════════════════════════════════════
# ESTATE INFO (authenticated — for members)
# ═══════════════════════════════════════════════

@estates.get("/me", status_code=status.HTTP_200_OK)
async def get_my_estate(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current user's estate details."""
    if not current_user.estate_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not associated with any estate.",
        )

    estate = db.query(Estate).filter(
        Estate.estate_code == current_user.estate_id,
    ).first()

    if not estate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Estate not found.",
        )

    return success_response(
        status_code=status.HTTP_200_OK,
        message="Estate details retrieved.",
        data={
            "id": estate.id,
            "estate_code": estate.estate_code,
            "name": estate.name,
            "address": estate.address,
            "city": estate.city,
            "state": estate.state,
            "management_type": estate.management_type,
            "status": estate.status,
            "onboarding_step": estate.onboarding_step,
            "has_structure": estate.has_structure,
        },
    )
