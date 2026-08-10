"""Tenant middleware — multi-tenant schema routing from JWT.

Extracts estate_id / schema from the JWT token and sets the
ContextVar so all subsequent DB queries target the correct schema.

Reference: docs/architecture/03-multi-tenant-architecture.md
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from api.db.tenant import current_tenant_schema
from api.utils.jwt_handler import decode_access_token


# Routes that don't require tenant context
PUBLIC_PATHS = {
    "/",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/api/v1/healthz",
    "/api/v1/readyz",
    "/api/v1/auth/register/request-otp",
    "/api/v1/auth/register/verify-otp",
    "/api/v1/auth/register/set-pin",
    "/api/v1/auth/login/request-otp",
    "/api/v1/auth/login/verify-otp",
    "/api/v1/auth/login/verify-pin",
    "/api/v1/auth/refresh",
    "/api/v1/webhooks/paystack",
}


class TenantMiddleware(BaseHTTPMiddleware):
    """Set tenant schema ContextVar from JWT claims.

    For authenticated requests, extracts the 'schema' claim from the JWT
    and sets current_tenant_schema so schema_translate_map routes queries
    to the correct PostgreSQL schema.

    Public routes default to 'public' schema.
    """

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Skip tenant resolution for public routes
        if path in PUBLIC_PATHS or path.startswith("/media"):
            current_tenant_schema.set("public")
            return await call_next(request)

        # Try to extract schema from JWT
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
            payload = decode_access_token(token)

            if payload and payload.get("schema"):
                current_tenant_schema.set(payload["schema"])
            else:
                current_tenant_schema.set("public")
        else:
            current_tenant_schema.set("public")

        response = await call_next(request)
        return response
