"""Estate service — business logic for estate registration and management.

All business logic for estate endpoints lives here. Routes are thin
wrappers: validate input → call service → return response.
(Same convention as AuthService — see api/v1/services/auth.py.)

Registration flow:
1. TenantService generates the estate_code + PostgreSQL schema and
   creates the Estate record.
2. Optional bank / unit-count / structure-template fields are applied.
3. Stakeholders are created. The first PANEL_ACCESS_STAKEHOLDER_COUNT
   (2) stakeholders each get admin-panel access: a generated password
   is hashed and stored (panel_password_hash), and the estate_code,
   their email, the plain password, and the dashboard link are sent to
   them by email in a background task — never in the API response.

Reference: docs/architecture/03-multi-tenant-architecture.md
"""

import secrets

from fastapi import BackgroundTasks, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from api.loggers.app_logger import app_logger
from api.utils.mailer import send_email
from api.utils.settings import settings
from api.v1.models.estate import Estate, EstateStructureTemplate, Stakeholder
from api.v1.models.users import User
from api.v1.schemas.estate import EstateRegisterSchema
from api.v1.services.tenant_service import TenantService

# ── Crypto context for stakeholder panel-password hashing ──────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Only the first N stakeholders provided at registration get admin-panel
# access — matches the "2 key contacts" registration flow.
PANEL_ACCESS_STAKEHOLDER_COUNT = 2


# ── Private helpers ──────────────────────────────────────────────────────────


def _generate_panel_password() -> str:
    """Generate a random 8-16 digit password for stakeholder panel access."""
    return "".join([str(secrets.randbelow(10)) for _ in range(secrets.randbelow(9) + 8)])


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


async def _send_panel_credentials_email(email: str, estate_code: str, password: str) -> None:
    """Email a stakeholder their estate admin-dashboard credentials.

    Runs as a background task so it never blocks the registration
    response. Sends: estate ID (estate_code), the stakeholder's email,
    their generated password, and the dashboard login link.
    """
    subject = "Your Rezzident Admin Dashboard Access"
    body_html = f"""
    <p>Hello,</p>
    <p>Your estate has been registered on Rezzident, and you've been
    granted access to the estate admin dashboard as a stakeholder.</p>
    <p><strong>Estate ID:</strong> {estate_code}<br>
    <strong>Email:</strong> {email}<br>
    <strong>Password:</strong> {password}</p>
    <p><a href="{settings.ADMIN_DASHBOARD_URL}">Log in to your dashboard</a></p>
    <p>For security, please log in and change your password as soon as
    possible.</p>
    """
    await send_email(to=email, subject=subject, body_html=body_html)


# ── EstateService ─────────────────────────────────────────────────────────


class EstateService:
    """Estate registration and management business logic."""

    @staticmethod
    def register_estate(
        db: Session,
        background_tasks: BackgroundTasks,
        body: EstateRegisterSchema,
    ) -> Estate:
        """Register a new estate — full onboarding orchestration.

        1. Create the tenant record + PostgreSQL schema (TenantService).
        2. Apply optional bank / unit-count / structure fields.
        3. Create stakeholders; grant the first 2 admin-panel access with
           a generated password, and email each their credentials.

        Args:
            db: Database session.
            background_tasks: FastAPI BackgroundTasks — used to send
                stakeholder credential emails without blocking the response.
            body: Validated registration payload.

        Returns:
            The created Estate record.

        Raises:
            HTTPException: 500 if estate code / schema generation fails.
        """
        try:
            estate = TenantService.register_estate(
                db=db,
                name=body.name,
                address=body.address,
                city=body.city,
                state=body.state,
                local_government=body.local_government,
                management_type=body.management_type,
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            )

        # ── Bank info ──
        if body.settlement_account_number:
            estate.settlement_account_number = body.settlement_account_number
            estate.settlement_account_name = body.settlement_account_name
            # TODO: Map bank name → bank code for Paystack
            # estate.settlement_bank_code = resolve_bank_code(body.settlement_bank_name)

        # ── Units ──
        if body.number_of_units:
            estate.actual_house_count = body.number_of_units

        # ── Optional: set structure template ──
        if body.structure_template_id:
            estate.structure_template_id = body.structure_template_id
            estate.has_structure = True
        if body.custom_structure:
            estate.structure_definition = [level.model_dump() for level in body.custom_structure]
            estate.is_custom_structure = True
            estate.has_structure = True

        # ── Stakeholders (first PANEL_ACCESS_STAKEHOLDER_COUNT get
        #    dashboard access + a credentials email) ──
        credentials_to_email: list[tuple[str, str]] = []  # [(email, plain_password)]

        if body.stakeholders:
            for idx, s in enumerate(body.stakeholders):
                stakeholder = Stakeholder(
                    estate_id=estate.id,
                    full_name=s.full_name,
                    phone_number=s.phone_number,
                    email=s.email,
                    nin=s.nin if s.nin else None,
                    role_title=s.role_title,
                    is_primary=idx == 0,
                )

                if idx < PANEL_ACCESS_STAKEHOLDER_COUNT and s.email:
                    plain_password = _generate_panel_password()
                    stakeholder.has_panel_access = True
                    stakeholder.panel_password_hash = _hash_password(plain_password)
                    credentials_to_email.append((s.email, plain_password))

                db.add(stakeholder)

        db.commit()
        db.refresh(estate)

        # ── Send dashboard credentials (background — never blocks response) ──
        for email, plain_password in credentials_to_email:
            background_tasks.add_task(
                _send_panel_credentials_email,
                email,
                estate.estate_code,
                plain_password,
            )

        if credentials_to_email:
            estate.center_panel_credentials_sent = True
            db.commit()

        app_logger.info(
            f"Estate registered: {estate.name} ({estate.estate_code}) "
            f"→ schema: {estate.schema_name} "
            f"({len(credentials_to_email)} stakeholder(s) granted panel access)"
        )

        return estate

    @staticmethod
    def get_estate_by_code(db: Session, estate_code: str) -> Estate:
        """Look up an active estate by its code — used by residents joining."""
        estate = (
            db.query(Estate)
            .filter(
                Estate.estate_code == estate_code.upper(),
                Estate.status == "active",
            )
            .first()
        )

        if not estate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Estate not found. Please check the estate code.",
            )

        return estate

    @staticmethod
    def get_estate_for_user(db: Session, current_user: User) -> Estate:
        """Get the estate associated with the current authenticated user."""
        if not current_user.estate_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="You are not associated with any estate.",
            )

        estate = (
            db.query(Estate)
            .filter(
                Estate.estate_code == current_user.estate_id,
            )
            .first()
        )

        if not estate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Estate not found.",
            )

        return estate

    @staticmethod
    def list_structure_templates(
        db: Session,
        levels: int | None = None,
        category: str | None = None,
    ) -> list[EstateStructureTemplate]:
        """List available estate structure templates for the registration form."""
        query = db.query(EstateStructureTemplate).filter(
            EstateStructureTemplate.is_active == True  # noqa: E712
        )

        if category:
            query = query.filter(EstateStructureTemplate.category == category)

        templates = query.all()

        # Level-count filter applied in Python (JSONB array length).
        if levels is not None:
            templates = [t for t in templates if len(t.levels) == levels]

        return templates
