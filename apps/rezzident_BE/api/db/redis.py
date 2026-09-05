"""Redis client — async connection pool + JWT blacklist helpers.

Provides:
- Async Redis connection pool (redis.asyncio) — non-blocking on FastAPI event loop
- JWT blacklist: blacklist_jti(), is_jti_blacklisted()
- get_redis() FastAPI dependency

Reference: docs/architecture/10-security-architecture.md
"""

from __future__ import annotations

import redis.asyncio as aioredis
from fastapi import Request

from api.loggers.app_logger import app_logger
from api.utils.settings import settings

# ── Pool singleton ─────────────────────────────────────────────────────────────
# Created once during lifespan startup, stored on app.state.redis.
# All get_redis() calls return a client from this pool.

_redis_pool: aioredis.Redis | None = None


async def init_redis() -> aioredis.Redis:
    """Create and return the async Redis connection pool.

    Called once during FastAPI lifespan startup.

    Returns:
        Async Redis client bound to the connection pool.
    """
    global _redis_pool
    _redis_pool = await aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
        max_connections=20,
    )
    app_logger.info(f"Redis connected: {settings.REDIS_URL}")
    return _redis_pool


async def close_redis() -> None:
    """Close Redis connection pool. Called on lifespan shutdown."""
    global _redis_pool
    if _redis_pool:
        await _redis_pool.aclose()
        _redis_pool = None
        app_logger.info("Redis connection closed.")


def get_redis_pool() -> aioredis.Redis | None:
    """Return the global Redis pool (may be None if not yet initialised)."""
    return _redis_pool


# ── FastAPI dependency ─────────────────────────────────────────────────────────


async def get_redis(request: Request) -> aioredis.Redis | None:
    """FastAPI dependency — yields the Redis client from app.state.

    Returns None if Redis is not available (e.g., during tests or after
    a Redis outage). Callers should handle None gracefully.

    Usage:
        redis: aioredis.Redis | None = Depends(get_redis)

    Returns:
        Async Redis client, or None if not available.
    """
    return getattr(request.app.state, "redis", None)


# ── JWT Blacklist ──────────────────────────────────────────────────────────────
# Keys: "jti_blacklist:<jti>" → "1"
# TTL is set to the remaining token lifetime so Redis auto-cleans old entries.

_JTI_PREFIX = "jti_blacklist:"


async def blacklist_jti(redis: aioredis.Redis, jti: str, ttl_seconds: int) -> None:
    """Blacklist a JWT ID (JTI) in Redis.

    Used on logout and refresh token rotation to prevent reuse of
    invalidated tokens.

    Args:
        redis: Async Redis client.
        jti: The JWT ID to blacklist (from token payload).
        ttl_seconds: How long to keep the entry (should match token remaining TTL).
    """
    key = f"{_JTI_PREFIX}{jti}"
    await redis.setex(key, ttl_seconds, "1")
    app_logger.info(f"[JWT] Blacklisted JTI: {jti} (TTL: {ttl_seconds}s)")


async def is_jti_blacklisted(redis: aioredis.Redis, jti: str) -> bool:
    """Check if a JWT ID is blacklisted.

    Args:
        redis: Async Redis client.
        jti: The JWT ID to check.

    Returns:
        True if blacklisted (token should be rejected).
    """
    key = f"{_JTI_PREFIX}{jti}"
    result = await redis.exists(key)
    return bool(result)
