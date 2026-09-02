"""Database engine, session, and base — single source of truth.

Uses settings.database_url (constructed from DB_HOST, DB_PORT, etc.)
so there is no duplicate DB_URL env var.
"""

from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from api.utils.settings import settings, BASE_DIR


def get_db_engine(test_mode: bool = False):
    """Create and return a SQLAlchemy engine.

    Supports PostgreSQL (primary) and SQLite (test fallback).
    Connection pool settings are read from the unified Settings.
    """
    if settings.DB_TYPE == "sqlite" or test_mode:
        base_path = f"sqlite:///{BASE_DIR}"

        if test_mode:
            url = f"{base_path}/test.db"
            return create_engine(url, connect_args={"check_same_thread": False})

        url = f"{base_path}/"
        return create_engine(url, connect_args={"check_same_thread": False})

    # PostgreSQL — use the unified database_url property
    return create_engine(
        settings.database_url,
        pool_pre_ping=settings.DB_POOL_PRE_PING,
        pool_recycle=settings.DB_POOL_RECYCLE,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        poolclass=QueuePool,
    )


engine = get_db_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db_session = scoped_session(SessionLocal)

Base = declarative_base()


def create_database():
    return Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency that provides a database session.

    Creates a new session for each request and properly closes it after.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
