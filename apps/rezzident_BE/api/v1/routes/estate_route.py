"""Estate routes — registration and management endpoints.

The registration endpoint is the entry point for the SaaS onboarding flow:
1. Admin registers an estate → system generates estate_code + PostgreSQL schema
2. Admin sets up house structure (preloaded template or custom)
3. Admin adds stakeholders (2 key contacts) — the first 2 are granted
   admin-panel access and emailed their dashboard credentials
4. Estate goes active → residents can join using the estate_code

All business logic lives in EstateService — routes are thin wrappers:
validate input → call service → return response.
(Same convention as AuthService — see api/v1/routes/auth_route.py.)

Reference: docs/architecture/03-multi-tenant-architecture.md
"""

from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session

from api.db.database import get_db
from api.utils.jwt_handler import get_current_user
from api.utils.success_response import success_response
from api.v1.models.users import User
from api.v1.schemas.estate import EstateRegisterSchema
from api.v1.services.estate_service import EstateService

estates = APIRouter(prefix="/estates", tags=["Estates"])


# ═══════════════════════════════════════════════
# ESTATE REGISTRATION (creates per-tenant schema)
# ═══════════════════════════════════════════════


@estates.post("/register", status_code=status.HTTP_201_CREATED)
async def register_estate(
    body: EstateRegisterSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Register a new estate.

    No auth required for initial registration (the registering admin
    becomes the first stakeholder). Auth is added after estate is created.
    """
    estate = EstateService.register_estate(
        db=db,
        background_tasks=background_tasks,
        body=body,
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
    """
    estate = EstateService.get_estate_by_code(db=db, estate_code=estate_code)

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
    estate = EstateService.get_estate_for_user(db=db, current_user=current_user)

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


# ═══════════════════════════════════════════════
# LIST ESTATE STRUCTURE TEMPLATES
# ═══════════════════════════════════════════════


@estates.get("/structure-templates", status_code=status.HTTP_200_OK)
async def list_structure_templates(
    levels: int = None,  # Filter by level count
    category: str = None,  # Filter by category
    db: Session = Depends(get_db),
):
    """List available estate structure templates for registration form."""
    templates = EstateService.list_structure_templates(
        db=db,
        levels=levels,
        category=category,
    )

    return success_response(
        status_code=200,
        message="Structure templates retrieved.",
        data=[
            {
                "template_id": t.template_id,
                "name": t.name,
                "description": t.description,
                "category": t.category,
                "levels": t.levels,
                "address_format": t.address_format,
                "structure": t.structure,
                "example_address": t.example_address,
            }
            for t in templates
        ],
    )
