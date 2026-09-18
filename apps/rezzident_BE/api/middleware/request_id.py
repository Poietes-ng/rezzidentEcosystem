"""Request ID middleware — injects X-Request-ID for tracing.

Every request gets a unique ID for log correlation and debugging.
If the client sends X-Request-ID, it's preserved; otherwise generated.
"""

import uuid

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


class RequestIdMiddleware(BaseHTTPMiddleware):
    """Inject X-Request-ID header for request tracing."""

    async def dispatch(self, request: Request, call_next):
        # Use client-provided request ID if present, else generate
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))

        # Store in request state for downstream access
        request.state.request_id = request_id

        response = await call_next(request)

        # Include in response headers
        response.headers["X-Request-ID"] = request_id

        return response
