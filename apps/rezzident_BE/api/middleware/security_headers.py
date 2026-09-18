"""Security headers middleware — OWASP recommended headers.

Reference: docs/architecture/10-security-architecture.md, 17-owasp-rate-limiting.md
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

# Swagger UI / ReDoc load assets from jsdelivr and run inline init scripts.
# ReDoc also pulls fonts from Google Fonts. These paths get a relaxed CSP;
# everything else keeps the strict one.
_DOCS_PATHS = {"/docs", "/redoc", "/openapi.json"}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add OWASP-recommended security headers to every response."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Prevent MIME-type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Clickjacking protection
        response.headers["X-Frame-Options"] = "DENY"

        # XSS filter (legacy browsers)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Strict Transport Security (HSTS) — force HTTPS
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains; preload"
        )

        # Referrer policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Permissions policy (disable unnecessary browser features)
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), payment=()"
        )

        # Content Security Policy
        if request.url.path in _DOCS_PATHS:
            # Relaxed CSP for Swagger UI / ReDoc — they load from jsdelivr
            # and ReDoc also pulls fonts from Google Fonts.
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; "
                "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net fonts.googleapis.com; "
                "img-src 'self' data: https: fastapi.tiangolo.com; "
                "font-src 'self' data: cdn.jsdelivr.net fonts.gstatic.com; "
                "frame-ancestors 'none'"
            )
        else:
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self'; "
                "frame-ancestors 'none'"
            )

        return response
