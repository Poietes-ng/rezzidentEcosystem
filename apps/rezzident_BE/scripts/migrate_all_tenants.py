"""Migrate all tenant schemas — runs alembic upgrade on every estate schema.

Usage: python scripts/migrate_all_tenants.py

Reference: docs/architecture/03-multi-tenant-architecture.md
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text

from api.db.database import engine
from api.loggers.app_logger import app_logger


def get_all_tenant_schemas():
    """Get all estate schemas from the database."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT schema_name FROM estates WHERE status = 'active'"))
        return [row[0] for row in result if row[0]]


def migrate_schema(schema_name: str):
    """Run alembic upgrade head on a specific schema."""
    from alembic import command
    from alembic.config import Config

    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("schema_name", schema_name)

    app_logger.info(f"Migrating schema: {schema_name}")

    try:
        command.upgrade(alembic_cfg, "head")
        app_logger.info(f"✅ Schema {schema_name} migrated successfully")
    except Exception as e:
        app_logger.error(f"❌ Failed to migrate {schema_name}: {e}")


def main():
    """Migrate public schema, then all tenant schemas."""
    app_logger.info("Starting multi-tenant migration...")

    # 1. Migrate public schema first
    app_logger.info("Migrating public schema...")
    from alembic import command
    from alembic.config import Config

    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    app_logger.info("✅ Public schema migrated")

    # 2. Migrate all tenant schemas
    schemas = get_all_tenant_schemas()
    app_logger.info(f"Found {len(schemas)} tenant schemas to migrate")

    for schema in schemas:
        migrate_schema(schema)

    app_logger.info(f"Migration complete. {len(schemas)} tenant schemas processed.")


if __name__ == "__main__":
    main()
