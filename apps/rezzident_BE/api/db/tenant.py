"""Multi-tenant schema management using ContextVar.

Provides thread-safe / async-safe tenant context for schema-per-tenant
architecture. Each estate gets its own PostgreSQL schema (e.g., est_par7x3km).

Reference: docs/architecture/03-multi-tenant-architecture.md
"""

from contextvars import ContextVar
from sqlalchemy.orm import Session, sessionmaker
from api.db.database import get_db_engine


# Thread-safe / async-safe tenant context
current_tenant_schema: ContextVar[str] = ContextVar(
    "current_tenant_schema", default="public"
)


def get_tenant_session(tenant_schema: str) -> Session:
    """Create a SQLAlchemy session scoped to a specific tenant schema.

    Uses schema_translate_map to route all queries to the right schema
    without modifying model definitions.

    Args:
        tenant_schema: The PostgreSQL schema name (e.g., "est_par7x3km")

    Returns:
        A SQLAlchemy Session bound to the specified schema.
    """
    engine = get_db_engine()
    session_factory = sessionmaker(
        bind=engine.execution_options(
            schema_translate_map={None: tenant_schema}
        )
    )
    return session_factory()


def get_current_schema() -> str:
    """Get the current tenant schema from context."""
    return current_tenant_schema.get()
