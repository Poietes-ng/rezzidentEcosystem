# 03 — Multi-Tenant Architecture: Schema-Per-Tenant

[← Previous: VPS Comparison](./02-vps-provider-comparison.md) | [Back to Index](./README.md) | [Next: Estate ID Generation →](./04-estate-id-generation.md)

---

## Why Schema-Per-Tenant

We evaluated three multi-tenancy models. Schema-per-tenant is the right fit for 20-200 estates.

| Approach | Isolation | Complexity | Best For | Risk |
|----------|-----------|------------|----------|------|
| Shared schema + `estate_id` column | Low | Low | MVP, < 10 estates | Data leak via missing WHERE clause |
| **Schema-per-tenant** ★ | **Moderate** | **Moderate** | **20-200 estates** | **Migration management** |
| Database-per-tenant | Maximum | High | Enterprise, > 200 | Operational overhead |

### Why NOT Shared Schema

With a shared schema, every single query in the entire codebase must include `WHERE estate_id = ?`. One forgotten filter in a JOIN, a report query, or an admin endpoint, and **Estate A's residents can see Estate B's data**. In a estate security app, this is unacceptable.

### Why NOT Database-Per-Tenant (Yet)

At 20-200 estates, managing 200 separate PostgreSQL databases (each with its own connection pool, backup schedule, and migration state) creates massive operational overhead. This model makes sense at 500+ estates or when an enterprise client demands total isolation — and the architecture supports upgrading individual tenants to their own database later.

### Why Schema-Per-Tenant Works

- Models are defined **once** — no duplication
- Each estate gets its own PostgreSQL schema (e.g., `est_par7x3km`)
- A query in schema A **physically cannot** access schema B's tables
- Backups can target individual schemas
- Can upgrade a single estate to its own database without changing application code

---

## Schema Layout

```
PostgreSQL Database: paradise_estate
│
├── public schema (shared global data)
│   ├── estates              ← Estate registry (name, code, config)
│   ├── subscriptions        ← Estate/firm subscription status
│   ├── platform_users       ← Platform-level super admin accounts
│   └── audit_log            ← Cross-tenant audit trail
│
├── est_par7x3km schema (NAME OF ESTATE)
│   ├── users
│   ├── residents
│   ├── staff
│   ├── bills
│   ├── resident_bills
│   ├── payments
│   ├── visitor_codes
│   ├── visitors
│   ├── notifications
│   ├── expenses
│   ├── expense_items
│   ├── expense_approvals
│   ├── verification_requests
│   ├── verification_vouches
│   ├── member_permissions
│   ├── chat_messages
│   ├── activity_logs
│   └── support_tickets
│
├── est_gre8n4pr schema (Green Valley Estate)
│   └── ... (same tables, completely separate data)
│
└── est_lak4x8nh schema (Lakeview Gardens — under construction)
    └── ... (same tables, minimal data until move-in)
```

---

## SQLAlchemy Implementation

### Tenant Context (ContextVar)

```python
# api/db/tenant.py

from contextvars import ContextVar
from sqlalchemy.orm import Session, sessionmaker

# Thread-safe / async-safe tenant context
current_tenant_schema: ContextVar[str] = ContextVar(
    "current_tenant_schema", default="public"
)

def get_tenant_session(tenant_schema: str) -> Session:
    """
    Create a SQLAlchemy session scoped to a specific tenant schema.
    Uses schema_translate_map to route all queries to the right schema
    without modifying model definitions.
    """
    engine = get_db_engine()
    session_factory = sessionmaker(
        bind=engine.execution_options(
            schema_translate_map={None: tenant_schema}
        )
    )
    return session_factory()
```

### Tenant Middleware

```python
# api/middleware/tenant.py

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from api.db.tenant import current_tenant_schema

class TenantMiddleware(BaseHTTPMiddleware):
    """
    Extracts estate_id from JWT token, resolves it to a PostgreSQL
    schema name, and sets the tenant context for the request.
    """
    
    # Routes that don't need tenant context
    PUBLIC_PATHS = {"/healthz", "/readyz", "/docs", "/openapi.json"}
    
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        
        # Skip tenant resolution for public/platform-level routes
        if path in self.PUBLIC_PATHS or path.startswith("/api/v1/platform/"):
            return await call_next(request)
        
        # Extract estate_id from JWT claims
        estate_id = request.state.jwt_claims.get("estate_id")
        
        if estate_id:
            # Look up schema name from public.estates
            schema_name = await resolve_schema(estate_id)
            # Set context for this request
            token = current_tenant_schema.set(schema_name)
            try:
                response = await call_next(request)
                return response
            finally:
                current_tenant_schema.reset(token)
        
        return await call_next(request)
```

### Request Flow

```
1. Request arrives with JWT: { "estate_id": "PAR-7X3KM", "user_id": "abc123" }
         │
2. TenantMiddleware:
   ├── Decode JWT → extract estate_id = "PAR-7X3KM"
   ├── Query: SELECT schema_name FROM public.estates WHERE estate_code = 'PAR-7X3KM'
   ├── Result: schema_name = "est_par7x3km"
   └── Set current_tenant_schema context = "est_par7x3km"
         │
3. Route handler calls get_db() → returns session with schema_translate_map
         │
4. db.query(User).filter(User.id == user_id)
   └── Executes as: SELECT * FROM est_par7x3km.users WHERE id = 'abc123'
         │
5. Response returned — tenant context is reset
```

---

## Alembic Multi-Tenant Migrations

The biggest operational challenge with schema-per-tenant is running migrations across all schemas. Here's the strategy:

### Migration Runner Script

```python
# scripts/migrate_all_tenants.py

"""
Run Alembic migrations across all active tenant schemas.

Usage:
    python scripts/migrate_all_tenants.py upgrade head
    python scripts/migrate_all_tenants.py downgrade -1
"""

import sys
from alembic.config import Config
from alembic import command
from sqlalchemy import create_engine, text

def get_all_tenant_schemas():
    """Fetch all active tenant schemas from the public.estates table."""
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text(
            "SELECT schema_name FROM public.estates WHERE status = 'active'"
        ))
        return [row[0] for row in result]

def migrate_all(direction: str, revision: str):
    schemas = get_all_tenant_schemas()
    print(f"Found {len(schemas)} active tenant schemas")
    
    failed = []
    for schema in schemas:
        try:
            print(f"  Migrating: {schema}...", end=" ")
            alembic_cfg = Config("alembic.ini")
            alembic_cfg.set_main_option("version_table_schema", schema)
            
            # Set search_path so Alembic creates tables in the right schema
            alembic_cfg.set_main_option(
                "sqlalchemy.url",
                f"{DATABASE_URL}?options=-csearch_path%3D{schema}"
            )
            
            if direction == "upgrade":
                command.upgrade(alembic_cfg, revision)
            elif direction == "downgrade":
                command.downgrade(alembic_cfg, revision)
            
            print("✅")
        except Exception as e:
            print(f"❌ {e}")
            failed.append((schema, str(e)))
    
    print(f"\n{'='*50}")
    print(f"Results: {len(schemas) - len(failed)}/{len(schemas)} succeeded")
    if failed:
        print(f"Failed schemas:")
        for schema, error in failed:
            print(f"  - {schema}: {error}")

if __name__ == "__main__":
    direction = sys.argv[1]  # "upgrade" or "downgrade"
    revision = sys.argv[2]   # "head", "-1", etc.
    migrate_all(direction, revision)
```

### Creating a New Tenant

```python
# api/services/tenant_service.py

async def create_tenant_schema(estate_code: str, schema_name: str):
    """
    Create a new PostgreSQL schema and run all migrations.
    Called during estate registration.
    """
    engine = get_db_engine()
    
    async with engine.begin() as conn:
        # 1. Create the schema
        await conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {schema_name}"))
        
        # 2. Run Alembic migrations on the new schema
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("version_table_schema", schema_name)
        alembic_cfg.set_main_option(
            "sqlalchemy.url",
            f"{DATABASE_URL}?options=-csearch_path%3D{schema_name}"
        )
        command.upgrade(alembic_cfg, "head")
    
    print(f"✅ Created tenant schema: {schema_name}")
```

---

## Global vs Tenant Data

| Data                | Where                               | Why                                                |
| ---------------------| -------------------------------------| ----------------------------------------------------|
| Estate registry     | `public.estates`                    | Cross-tenant lookup (resolve estate code → schema) |
| Subscription status | `public.subscriptions`              | Billing is platform-level                          |
| Platform admins     | `public.platform_users`             | Super admins who manage all estates                |
| Users/residents     | `est_xxx.users`                     | Tenant-specific                                    |
| Bills/payments      | `est_xxx.bills`, `est_xxx.payments` | Tenant-specific                                    |
| Visitor codes       | `est_xxx.visitor_codes`             | Tenant-specific                                    |
| Chat messages       | `est_xxx.chat_messages`             | Tenant-specific                                    |
| Everything else     | `est_xxx.*`                         | Tenant-specific                                    |

---

## Scaling Path

```
Phase 1-3 (1-50 estates):
└── Single PostgreSQL instance, all schemas in one database
    └── Fine for this scale — PostgreSQL handles 1000+ schemas easily

Phase 4 (50-200 estates):
└── Monitor query performance
    └── Add read replicas if needed
    └── Move large/enterprise estates to dedicated schemas on separate DB

Phase 5 (200+ estates):
└── Shard by geography or firm
    └── West Africa DB, East Africa DB (if expanding)
    └── Or: firm-level databases for enterprise clients
```

---

[← Previous: VPS Comparison](./02-vps-provider-comparison.md) | [Back to Index](./README.md) | [Next: Estate ID Generation →](./04-estate-id-generation.md)
