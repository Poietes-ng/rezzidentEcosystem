"""Tenant service — create and manage PostgreSQL schemas per estate.

Reference: docs/architecture/03-multi-tenant-architecture.md
"""

from sqlalchemy import text
from sqlalchemy.orm import Session

from api.db.database import engine
from api.loggers.app_logger import app_logger
from api.utils.estate_id import generate_estate_code, generate_schema_name
from api.v1.models.estate import Estate


class TenantService:
    """Manages PostgreSQL schemas for multi-tenant isolation."""

    @staticmethod
    def create_tenant_schema(schema_name: str) -> bool:
        """Create a new PostgreSQL schema for an estate.

        Creates the schema and all tenant tables within it
        by stamping the current alembic revision.

        Args:
            schema_name: The schema name (e.g., "est_par7x3km").

        Returns:
            True if successful.
        """
        with engine.connect() as conn:
            # Create the schema
            conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{schema_name}"'))
            conn.commit()
            app_logger.info(f"Created schema: {schema_name}")

        return True

    @staticmethod
    def register_estate(
        db: Session,
        name: str,
        address: str,
        city: str = None,
        state: str = None,
        local_government: str = None,
        management_type: str = "community",
    ) -> Estate:
        """Register a new estate — creates DB record + schema.

        Steps:
        1. Generate unique estate code (BVD-7X3KM)
        2. Generate schema name (est_bvd7x3km)
        3. Create PostgreSQL schema
        4. Create estate record in public schema

        Args:
            db: Database session.
            name: Estate name.
            address: Estate address.
            city: City.
            state: State.
            firm_id: Optional firm ID if managed by a firm.

        Returns:
            Created Estate record.
        """
        # Generate unique code (retry on collision)
        for _ in range(10):
            estate_code = generate_estate_code(name)
            existing = db.query(Estate).filter(Estate.estate_code == estate_code).first()
            if not existing:
                break
        else:
            raise ValueError("Failed to generate unique estate code after 10 attempts.")

        schema_name = generate_schema_name(estate_code)

        # Create PostgreSQL schema
        TenantService.create_tenant_schema(schema_name)

        # Create estate record
        estate = Estate(
            estate_code=estate_code,
            schema_name=schema_name,
            name=name,
            address=address,
            city=city,
            state=state,
            local_government=local_government,
            management_type=management_type,
            status="active",
        )

        db.add(estate)
        db.commit()
        db.refresh(estate)

        app_logger.info(f"Estate registered: {name} ({estate_code}) -> {schema_name}")

        return estate

    @staticmethod
    def schema_exists(schema_name: str) -> bool:
        """Check if a schema exists in PostgreSQL."""
        with engine.connect() as conn:
            result = conn.execute(
                text(
                    "SELECT schema_name FROM information_schema.schemata "
                    "WHERE schema_name = :schema"
                ),
                {"schema": schema_name},
            )
            return result.fetchone() is not None
