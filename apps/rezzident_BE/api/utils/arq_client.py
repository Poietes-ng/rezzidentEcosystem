"""Arq pool — enqueue-side connection, used by FastAPI to hand jobs to the worker."""

from arq import create_pool
from arq.connections import ArqRedis, RedisSettings
from fastapi import Request

from api.utils.settings import settings

_arq_pool: ArqRedis | None = None

async def init_arq_pool() -> ArqRedis:
    global _arq_pool
    _arq_pool = await create_pool(RedisSettings.from_dsn(settings.REDIS_URL))
    return _arq_pool

async def get_arq_pool(request: Request) -> ArqRedis | None:
    return getattr(request.app.state, "arq_pool", None)

async def close_arq_pool() -> None:
    global _arq_pool
    if _arq_pool:
        await _arq_pool.close()
        _arq_pool = None