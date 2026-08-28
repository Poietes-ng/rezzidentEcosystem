from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.orm import scoped_session, declarative_base
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from api.utils.settings import settings, BASE_DIR


DB_HOST = settings.DB_HOST
DB_PORT = settings.DB_PORT
DB_USER = settings.DB_USER
DB_PASSWORD = settings.DB_PASSWORD
DB_NAME = settings.DB_NAME
DB_TYPE = settings.DB_TYPE
DB_POOL_SIZE = settings.DB_POOL_SIZE
DB_MAX_OVERFLOW = settings.DB_MAX_OVERFLOW
DB_POOL_RECYCLE = settings.DB_POOL_RECYCLE
DB_POOL_PRE_PING = settings.DB_POOL_PRE_PING


def get_db_engine(test_mode: bool = False):
    """Create and return a SQLAlchemy engine.

    Mirrors estate_management_BE pattern with connection pooling.
    Supports PostgreSQL (primary) and SQLite (test fallback).
    """
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    if DB_TYPE == "sqlite" or test_mode:
        BASE_PATH = f"sqlite:///{BASE_DIR}"
        DATABASE_URL = BASE_PATH + "/"

        if test_mode:
            DATABASE_URL = BASE_PATH + "test.db"

            return create_engine(
                DATABASE_URL, connect_args={"check_same_thread": False}
            )
    elif DB_TYPE == "postgresql":
        DATABASE_URL = (
            f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        )

    # Connection pool settings for PostgreSQL
    # pool_pre_ping: Test connections before using them (fixes stale connection errors)
    # pool_recycle: Recycle connections after 300 seconds (5 minutes)
    # pool_size: Number of connections to keep open
    # max_overflow: Additional connections allowed beyond pool_size
    return create_engine(
        DATABASE_URL,
        pool_pre_ping=DB_POOL_PRE_PING,
        pool_recycle=DB_POOL_RECYCLE,
        pool_size=DB_POOL_SIZE,
        max_overflow=DB_MAX_OVERFLOW,
        poolclass=QueuePool,
    )


engine = get_db_engine()

SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)

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
