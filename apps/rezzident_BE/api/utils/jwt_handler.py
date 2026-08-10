"""JWT handler — V2.

Mirrors estate_management_BE jwt_handler.py with V2 additions:
- JTI (JWT ID) for token blacklisting via Redis
- Separate access/refresh token creation with short expiry
- Multi-tenant claims (estate_id, schema, role, tier, perms)
- Refresh token rotation
- Redis JTI blacklist check in get_current_user

Reference: docs/architecture/08-pin-biometric-auth.md
"""

import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict

from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from api.utils.config import SECRET_KEY, ALGORITHM
from api.utils.settings import settings
from api.db.database import get_db


# Security scheme for Bearer token
security = HTTPBearer()


def _generate_jti() -> str:
    """Generate a unique JWT ID for token blacklisting."""
    return str(uuid.uuid4())


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create JWT access token with JTI.

    Default expiry: 15 minutes (from settings).
    Claims: sub, estate_id, schema, role, tier, jti, exp, iat, type.

    Args:
        data: Dict with user_id, phone_number, role, estate_id, schema, etc.
        expires_delta: Optional custom expiration.

    Returns:
        Encoded JWT token string.
    """
    to_encode = data.copy()

    now = datetime.now(timezone.utc)
    expire = now + (
        expires_delta
        if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update(
        {
            "exp": expire,
            "iat": now,
            "jti": _generate_jti(),
            "type": "access",
        }
    )

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_token_for_user(
    user_id: str,
    phone_number: str,
    role: str,
    house_number: Optional[str] = None,
    email: Optional[str] = None,
    estate_id: Optional[str] = None,
    schema_name: Optional[str] = None,
    verification_tier: Optional[str] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Helper to create access token with V2 multi-tenant claims.

    Args:
        user_id: User's unique ID.
        phone_number: User's phone number.
        role: User's role (from UserRole enum).
        house_number: House number (for residents).
        email: User's email (for admins).
        estate_id: Estate code (e.g., "PAR-7X3KM").
        schema_name: PostgreSQL schema (e.g., "est_par7x3km").
        verification_tier: User's verification tier.
        expires_delta: Custom expiration time.

    Returns:
        JWT token string.
    """
    token_data = {
        "user_id": user_id,
        "sub": user_id,
        "phone_number": phone_number,
        "role": role,
    }

    if house_number:
        token_data["house_number"] = house_number
    if email:
        token_data["email"] = email
    if estate_id:
        token_data["estate_id"] = estate_id
    if schema_name:
        token_data["schema"] = schema_name
    if verification_tier:
        token_data["tier"] = verification_tier

    return create_access_token(token_data, expires_delta)


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token with longer expiration.

    Default expiry: 7 days (from settings).
    Includes JTI for blacklisting on rotation.

    Args:
        data: Dict containing user identification data.

    Returns:
        Encoded JWT refresh token string.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + timedelta(days=settings.JWT_REFRESH_EXPIRY)

    to_encode.update(
        {
            "exp": expire,
            "iat": now,
            "jti": _generate_jti(),
            "type": "refresh",
        }
    )

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> Dict:
    """Verify and decode JWT token (sync — no Redis check).

    Use get_current_user() for authenticated routes; this function
    is for internal use where async Redis isn't available.

    Args:
        token: JWT token string.

    Returns:
        Decoded token payload.

    Raises:
        HTTPException: If token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def decode_access_token(token: str) -> Optional[Dict]:
    """Decode JWT access token without raising exceptions.

    Used by TenantMiddleware to extract schema without failing on
    invalid/expired tokens (the route handler will deal with auth errors).

    Args:
        token: JWT token string.

    Returns:
        Decoded payload or None if invalid.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def verify_refresh_token(token: str) -> Dict:
    """Verify refresh token and ensure it's the correct type.

    Args:
        token: Refresh token string.

    Returns:
        Decoded token payload.

    Raises:
        HTTPException: If token is invalid or not a refresh token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def _remaining_ttl_seconds(payload: Dict) -> int:
    """Calculate remaining TTL in seconds for a token.

    Used when blacklisting: we only need to keep the JTI entry in Redis
    until the token would have naturally expired anyway.

    Args:
        payload: Decoded JWT payload.

    Returns:
        Remaining seconds (minimum 1, to avoid zero-TTL edge case).
    """
    exp = payload.get("exp", 0)
    now = int(datetime.now(timezone.utc).timestamp())
    remaining = exp - now
    return max(remaining, 1)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Dependency to get current authenticated user.

    V2: Checks Redis JTI blacklist before trusting the token.
    Import User inside the function to avoid circular imports.

    Args:
        credentials: Bearer token from request header.
        db: Database session.

    Returns:
        Current authenticated User object.

    Raises:
        HTTPException: If authentication fails or token is blacklisted.
    """
    from api.v1.models.users import User
    from api.db.redis import get_redis_pool, is_jti_blacklisted

    token = credentials.credentials

    try:
        payload = verify_token(token)
        user_id: str = payload.get("user_id")
        token_role: str = payload.get("role")
        jti: str = payload.get("jti", "")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # ── Redis JTI blacklist check ──
    # If Redis is available, verify the token hasn't been revoked.
    # If Redis is down, we fail open (degrade gracefully) to avoid
    # locking out all users during a Redis outage.
    redis = get_redis_pool()
    if redis and jti:
        try:
            if await is_jti_blacklisted(redis, jti):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has been revoked. Please log in again.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        except HTTPException:
            raise
        except Exception:
            # Redis error — log and continue (fail open)
            from api.loggers.app_logger import app_logger
            app_logger.warning("[JWT] Redis blacklist check failed — skipping.")

    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user account"
        )

    # Verify token role matches database role (prevents role escalation after role change)
    if token_role and user.role.value != token_role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_active_user(current_user=Depends(get_current_user)):
    """Dependency to get current active user.

    Args:
        current_user: User from get_current_user dependency.

    Returns:
        Active User object.

    Raises:
        HTTPException: If user is inactive.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user account"
        )
    return current_user
