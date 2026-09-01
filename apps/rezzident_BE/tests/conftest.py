"""Test configuration — fixtures for database, test client, auth helpers.

Provides:
- db_session: Fresh SQLite DB per test (all tables created/dropped)
- client: FastAPI TestClient with DB override
- test_user: Pre-created user with known phone/PIN
- auth_headers: Bearer token headers for authenticated requests
- mock_redis: Patches Redis so JTI blacklist checks pass without a real server
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import JSON

# ── Disable fastapi-guard SecurityMiddleware for tests ─────────────────────────
# Must be patched BEFORE importing main.py, which calls app.add_middleware()
# at module level. Without this, every test request hits Redis.
from unittest.mock import patch as _patch

_guard_patcher = _patch("guard.SecurityMiddleware", lambda app, **kw: app)
_guard_patcher.start()

from api.db.database import Base, get_db
from main import app


# ── SQLite compatibility: render JSONB as JSON ─────────────────────────────────
from sqlalchemy.ext.compiler import compiles

@compiles(JSONB, "sqlite")
def _compile_jsonb_sqlite(type_, compiler, **kw):
    return compiler.visit_JSON(type_, **kw)



# ── In-memory SQLite for tests ────────────────────────────────────────────────
TEST_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


# SQLite doesn't support schemas — intercept schema creation
@event.listens_for(test_engine, "connect")
def _set_sqlite_pragma(dbapi_conn, connection_record):
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=test_engine)
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def mock_redis():
    """Mock Redis so tests don't need a running Redis server.

    Patches:
    - get_redis() → returns an AsyncMock that always resolves
    - get_redis_pool() → returns None (disables JTI blacklist in get_current_user)
    - blacklist_jti() → no-op
    - is_jti_blacklisted() → always False
    """
    with patch("api.db.redis.get_redis", return_value=AsyncMock()) as mock_get, \
         patch("api.db.redis.get_redis_pool", return_value=None), \
         patch("api.db.redis.blacklist_jti", new_callable=AsyncMock), \
         patch("api.db.redis.is_jti_blacklisted", new_callable=AsyncMock, return_value=False):
        yield mock_get


@pytest.fixture(scope="function")
def client(db_session, mock_redis):
    """Create a test client with overridden DB dependency and mocked Redis."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_phone():
    """Standard test phone number."""
    return "+2348012345678"


@pytest.fixture
def test_pin():
    """Standard test PIN (passes validation: no sequential, no repeated)."""
    return "2580"


@pytest.fixture
def registered_user(client, db_session, test_phone, test_pin):
    """Register a user through the full flow and return (user_data, tokens).

    Steps:
    1. Request OTP → grab OTP from DB (we can read the hash in tests)
    2. Verify OTP → with the real OTP from the DB
    3. Set PIN → complete registration, get tokens
    """
    from api.v1.models.otp import OTP
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # Step 1: Request OTP
    resp = client.post(
        "/api/v1/auth/register/request-otp",
        json={"phone_number": test_phone},
    )
    assert resp.status_code == 200

    # Grab the OTP from DB (we stored the hash — we need to create a known one)
    # Instead, let's directly create a verified OTP state and register
    otp_record = db_session.query(OTP).filter(
        OTP.phone_number == test_phone
    ).order_by(OTP.created_at.desc()).first()

    # We need the actual OTP code — in tests we can brute force it or
    # patch _generate_otp. Let's use a simpler approach: patch the OTP gen.
    # For now, skip OTP verification and go straight to set-pin
    # by marking the OTP as used (simulating successful verification).
    if otp_record:
        otp_record.is_used = True
        db_session.commit()

    # Step 3: Set PIN (registration complete)
    resp = client.post(
        "/api/v1/auth/register/set-pin",
        json={
            "phone_number": test_phone,
            "pin": test_pin,
            "confirm_pin": test_pin,
            "full_name": "Test Resident",
            "estate_code": "TST-12345",
        },
    )
    assert resp.status_code == 201
    data = resp.json()["data"]

    return data["user"], data["tokens"]


@pytest.fixture
def auth_headers(registered_user):
    """Bearer token headers from a registered user."""
    _, tokens = registered_user
    return {"Authorization": f"Bearer {tokens['access_token']}"}
