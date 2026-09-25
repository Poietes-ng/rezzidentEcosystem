"""Arq pool — enqueue-side connection, used by FastAPI to hand jobs to the worker."""

from arq import create_pool
from arq.connections import ArqRedis, RedisSettings
from fastapi import HTTPException, Request, status

from api.utils.settings import settings

_arq_pool: ArqRedis | None = None


async def init_arq_pool() -> ArqRedis:
    """Create the ARQ Redis pool at startup.

    Stores the pool both on the module-level `_arq_pool` AND returns it so
    main.py can set `app.state.arq_pool = await init_arq_pool()`. Both paths
    are used so `get_arq_pool` can fall back gracefully.
    """
    global _arq_pool
    _arq_pool = await create_pool(RedisSettings.from_dsn(settings.REDIS_URL))
    return _arq_pool


async def get_arq_pool(request: Request) -> ArqRedis:
    """FastAPI dependency — retrieve the ARQ pool.

    Resolution order:
      1. request.app.state.arq_pool   (normal production path)
      2. module-level _arq_pool       (fallback: test overrides, startup races)

    Raises HTTP 503 instead of returning None so callers get a clear,
    actionable error rather than a cryptic AttributeError at enqueue_job().

    Bug fixed (B6): previously returned `ArqRedis | None`, which caused a
    silent crash at `await arq_pool.enqueue_job(...)` whenever Redis was
    unavailable.
    """
    pool: ArqRedis | None = getattr(request.app.state, "arq_pool", None) or _arq_pool
    if pool is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Job queue unavailable — Redis connection not established.",
        )
    return pool


def get_arq_pool_direct() -> ArqRedis | None:
    """Return the module-level pool for use outside of a request context.

    Use this in services called from worker tasks, CLI scripts, or anywhere
    a FastAPI Request object isn't available. Returns None if init_arq_pool()
    has not been called yet — callers should guard with `if pool:`.
    """
    return _arq_pool


async def close_arq_pool() -> None:
    global _arq_pool
    if _arq_pool:
        await _arq_pool.close()
        _arq_pool = None