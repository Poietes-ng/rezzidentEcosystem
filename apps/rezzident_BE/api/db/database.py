"""Database engine, session, and base — single source of truth.

Uses settings.database_url (constructed from DB_HOST, DB_PORT, etc.)
so there is no duplicate DB_URL env var. Async engine — driver is
swapped to asyncpg/aiosqlite at runtime; settings.database_url itself
stays in its sync form for Alembic.
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool

from api.utils.settings import BASE_DIR, settings


def _to_async_url(url: str) -> str:
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


def get_db_engine(test_mode: bool = False):
    if settings.DB_TYPE == "sqlite" or test_mode:
        url = (
            f"sqlite+aiosqlite:///{BASE_DIR}/test.db"
            if test_mode
            else f"sqlite+aiosqlite:///{BASE_DIR}/app.db"
        )
        return create_async_engine(
            url, connect_args={"check_same_thread": False}, poolclass=NullPool
        )

    return create_async_engine(
        _to_async_url(settings.database_url),
        pool_pre_ping=settings.DB_POOL_PRE_PING,
        pool_recycle=settings.DB_POOL_RECYCLE,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
    )


engine = get_db_engine()

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

Base = declarative_base()


async def create_database() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """Dependency that provides an async database session per request."""
    async with SessionLocal() as db:
        yield db
