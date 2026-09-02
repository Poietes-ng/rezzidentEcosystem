"""Auth service — V2 business logic for registration, login, OTP, PIN.

Handles the complete 4-layer authentication flow:
Layer 1: Phone OTP (in-built dev log / Termii SMS in prod)
Layer 2: PIN (4-digit, bcrypt hashed)
Layer 3: Biometric (client-side, unlocks stored token)
Layer 4: JWT (15-min access + 7-day refresh + Redis JTI blacklist)

OTP delivery uses FastAPI BackgroundTasks so it never blocks the request.
In development (PYTHON_ENV=development): OTP is printed to app.log only.
In production: plug in Termii API where the # TODO comment is.

Reference: docs/architecture/08-pin-biometric-auth.md
"""

import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple, Dict, Any

from fastapi import BackgroundTasks, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from api.v1.models.users import User, VerificationTier
from api.v1.models.otp import OTP, OTPPurpose
from api.v1.models.resident import Resident
from api.utils.jwt_handler import (
    create_token_for_user,
    create_refresh_token,
    verify_token,
    verify_refresh_token,
    _remaining_ttl_seconds,
)
from api.utils.settings import settings
from api.loggers.app_logger import app_logger


# ── Crypto context for PIN / password hashing ──────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── OTP constants ──────────────────────────────────────────────────────────────
OTP_LENGTH = 6
OTP_EXPIRY_MINUTES = 5
OTP_MAX_RETRIES = 3
OTP_RATE_LIMIT_PER_HOUR = 5

# ── PIN constants ──────────────────────────────────────────────────────────────
PIN_MAX_ATTEMPTS = 5
PIN_LOCKOUT_MINUTES = 30


# ── Private helpers ────────────────────────────────────────────────────────────

def _generate_otp() -> str:
    """Generate a cryptographically secure 6-digit OTP.

    Uses secrets.randbelow (CSPRNG) instead of random.randint.
    """
    return "".join([str(secrets.randbelow(10)) for _ in range(OTP_LENGTH)])

def _generate_password() -> str:
    """Generate a password of 8-16 digits"""
    return "".join([str(secrets.randbelow(10)) for _ in range(secrets.randbelow(9) + 8)])


def _hash_value(value: str) -> str:
    """Hash a value using bcrypt."""
    return pwd_context.hash(value)


def _verify_hash(plain: str, hashed: str) -> bool:
    """Verify a plain value against its bcrypt hash."""
    return pwd_context.verify(plain, hashed)


def _deliver_otp(phone_number: str, otp_code: str) -> None:
    """Deliver OTP to the user — runs in a background task.

    Development: logs OTP to app.log (check logs/app.log).
    Production: replace the TODO below with Termii API call.

    This function is intentionally synchronous so FastAPI's
    BackgroundTasks thread pool can run it without blocking the event loop.
    """
    if settings.PYTHON_ENV == "development":
        # DEV ONLY — visible in logs/app.log, never in API response
        app_logger.info(
            f"[DEV ONLY — OTP] Phone: {phone_number} | Code: {otp_code}"
        )
        return

    # ── PRODUCTION: Termii SMS integration ──
    # Uncomment and fill in when Termii account is funded:
    #
    # import httpx
    # payload = {
    #     "to": phone_number,
    #     "from": settings.TERMII_SENDER_ID,
    #     "sms": f"Your Rezzident OTP is {otp_code}. Valid for 5 minutes. Do not share.",
    #     "type": "plain",
    #     "channel": "dnd",
    #     "api_key": settings.TERMII_API_KEY,
    # }
    # with httpx.Client(timeout=10.0) as client:
    #     resp = client.post("https://v3.api.termii.com/api/sms/send", json=payload)
    #     if resp.status_code != 200:
    #         app_logger.error(f"[Termii] OTP send failed for {phone_number}: {resp.text}")
    #     else:
    #         app_logger.info(f"[Termii] OTP sent to {phone_number}")

    # Placeholder log until Termii is funded
    app_logger.info(f"[OTP] Would send SMS to {phone_number} (Termii not configured)")


# ── AuthService ────────────────────────────────────────────────────────────────

class AuthService:
    """Authentication business logic."""

    # ── OTP ────────────────────────────────────────────────────────────────────

    @staticmethod
    def create_and_send_otp(
        db: Session,
        phone_number: str,
        purpose: OTPPurpose,
        background_tasks: BackgroundTasks,
    ) -> dict:
        """Create OTP, hash it, store it, and queue SMS delivery.

        IMPORTANT: OTP is NEVER returned in the API response.
        Delivery is offloaded to BackgroundTasks so the HTTP response
        is returned immediately without waiting for the SMS gateway.

        Args:
            db: Database session.
            phone_number: Normalised +234 phone number.
            purpose: OTP purpose enum value.
            background_tasks: FastAPI BackgroundTasks instance from the route.

        Returns:
            Dict with message and expiry info (no OTP value).
        """
        # Rate limit: max 5 OTPs per phone per hour
        one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
        recent_count = (
            db.query(OTP)
            .filter(
                OTP.phone_number == phone_number,
                OTP.created_at >= one_hour_ago,
            )
            .count()
        )

        if recent_count >= OTP_RATE_LIMIT_PER_HOUR:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many OTP requests. Please try again in an hour.",
            )

        # Invalidate any existing unused OTPs for this phone + purpose
        db.query(OTP).filter(
            OTP.phone_number == phone_number,
            OTP.purpose == purpose,
            OTP.is_used == False,  # noqa: E712
        ).update({"is_used": True})

        # Generate cryptographically secure OTP and hash it
        otp_code = _generate_otp()
        otp_hash = _hash_value(otp_code)

        # Store hashed OTP — plaintext is NEVER persisted
        otp_record = OTP(
            phone_number=phone_number,
            otp_hash=otp_hash,
            purpose=purpose,
            expires_at=datetime.now(timezone.utc)
            + timedelta(minutes=OTP_EXPIRY_MINUTES),
        )
        db.add(otp_record)
        db.commit()

        # Queue OTP delivery as a background task — response returns immediately
        background_tasks.add_task(_deliver_otp, phone_number, otp_code)

        return {
            "message": "OTP sent successfully",
            "phone_number": phone_number,
            "expires_in_seconds": OTP_EXPIRY_MINUTES * 60,
        }

    @staticmethod
    def verify_otp(
        db: Session,
        phone_number: str,
        otp_code: str,
    ) -> bool:
        """Verify an OTP code against its stored hash.

        Args:
            db: Database session.
            phone_number: Phone number.
            otp_code: The 6-digit OTP to verify.

        Returns:
            True if valid.

        Raises:
            HTTPException if invalid, expired, or max attempts reached.
        """
        otp_record = (
            db.query(OTP)
            .filter(
                OTP.phone_number == phone_number,
                OTP.is_used == False,  # noqa: E712
            )
            .order_by(OTP.created_at.desc())
            .first()
        )

        if not otp_record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No pending OTP found. Please request a new one.",
            )

        if otp_record.is_expired():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP has expired. Please request a new one.",
            )

        if otp_record.is_max_attempts():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum OTP attempts reached. Please request a new OTP.",
            )

        # Increment attempt counter before verifying (prevents timing attacks)
        otp_record.attempts += 1

        if not _verify_hash(otp_code, otp_record.otp_hash):
            db.commit()
            remaining = otp_record.max_attempts - otp_record.attempts
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid OTP. {remaining} attempt(s) remaining.",
            )

        # Mark as used — prevents replay attacks
        otp_record.is_used = True
        db.commit()

        return True

    # ── PIN ────────────────────────────────────────────────────────────────────

    @staticmethod
    def set_pin(db: Session, user: User, pin: str) -> User:
        """Set or update a user's PIN.

        Args:
            db: Database session.
            user: User object.
            pin: Validated 4-digit PIN.

        Returns:
            Updated user.
        """
        user.pin_hash = _hash_value(pin)
        user.pin_attempts = 0
        user.pin_locked_until = None
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def verify_pin(db: Session, user: User, pin: str) -> bool:
        """Verify a user's PIN with lockout protection.

        Rules:
        - Max 5 failed attempts before 30-minute lockout.
        - Lockout resets on successful verification.

        Args:
            db: Database session.
            user: User object.
            pin: 4-digit PIN to verify.

        Returns:
            True if valid.

        Raises:
            HTTPException if locked or invalid.
        """
        if user.is_pin_locked():
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=(
                    "Account temporarily locked due to too many failed PIN attempts. "
                    "Please try again later."
                ),
            )

        if not user.pin_hash:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="PIN not set. Please set your PIN first.",
            )

        if not _verify_hash(pin, user.pin_hash):
            user.pin_attempts += 1

            if user.pin_attempts >= PIN_MAX_ATTEMPTS:
                user.pin_locked_until = datetime.now(timezone.utc) + timedelta(
                    minutes=PIN_LOCKOUT_MINUTES
                )
                db.commit()
                raise HTTPException(
                    status_code=status.HTTP_423_LOCKED,
                    detail=(
                        f"Account locked for {PIN_LOCKOUT_MINUTES} minutes "
                        f"due to {PIN_MAX_ATTEMPTS} failed PIN attempts."
                    ),
                )

            db.commit()
            remaining = PIN_MAX_ATTEMPTS - user.pin_attempts
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid PIN. {remaining} attempt(s) remaining.",
            )

        # Success — reset lockout state
        user.pin_attempts = 0
        user.pin_locked_until = None
        user.last_login = datetime.now(timezone.utc)
        db.commit()

        return True

    # ── Token generation ───────────────────────────────────────────────────────

    @staticmethod
    def generate_tokens(
        user: User,
        estate_code: Optional[str] = None,
        schema_name: Optional[str] = None,
    ) -> dict:
        """Generate access + refresh token pair for a user.

        Args:
            user: Authenticated user.
            estate_code: Estate code for multi-tenant JWT claims.
            schema_name: PostgreSQL schema name.

        Returns:
            Dict with access_token, refresh_token, token_type, expires_in.
        """
        access_token = create_token_for_user(
            user_id=user.id,
            phone_number=user.phone_number,
            role=user.role.value,
            house_number=user.house_number,
            email=user.email,
            estate_id=estate_code,
            schema_name=schema_name,
            verification_tier=(
                user.verification_tier.value if user.verification_tier else None
            ),
        )

        refresh_token = create_refresh_token(
            {
                "user_id": user.id,
                "sub": user.id,
                "phone_number": user.phone_number,
                "role": user.role.value,
            }
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }

    # ── Registration ───────────────────────────────────────────────────────────

    @staticmethod
    def register_user(
        db: Session,
        phone_number: str,
        full_name: str,
        pin: str,
        estate_code: str,
    ) -> Tuple[User, dict]:
        """Complete user registration after OTP verification.

        Steps:
        1. Check if user already exists.
        2. Check if phone matches CSV pre-loaded data (Tier 1 / PRE_VERIFIED).
        3. Create user with hashed PIN.
        4. Assign verification tier.
        5. Generate tokens.

        Args:
            db: Database session.
            phone_number: Verified phone number.
            full_name: User's full name.
            pin: Validated 4-digit PIN.
            estate_code: Estate code.

        Returns:
            Tuple of (User, token_dict).
        """
        # Guard: no duplicate registrations
        existing = db.query(User).filter(User.phone_number == phone_number).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This phone number is already registered.",
            )

        # CSV pre-verification check (Tier 1 = PRE_VERIFIED = full access)
        csv_match = (
            db.query(Resident)
            .filter(Resident.phone_number == phone_number)
            .first()
        )

        tier = VerificationTier.SELF_REGISTERED
        house_number = None

        if csv_match:
            tier = VerificationTier.PRE_VERIFIED
            house_number = csv_match.house_number

        # Create user
        user = User(
            phone_number=phone_number,
            full_name=full_name,
            pin_hash=_hash_value(pin),
            house_number=house_number,
            estate_id=estate_code,
            verification_tier=tier,
            resident_id=csv_match.id if csv_match else None,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        tokens = AuthService.generate_tokens(user, estate_code=estate_code)

        return user, tokens

    # ── Login helpers (extracted from routes) ──────────────────────────────────

    @staticmethod
    def login_verify_otp(
        db: Session,
        phone_number: str,
        otp_code: str,
    ) -> Dict[str, Any]:
        """Verify OTP for login and check if user has a PIN set.

        Args:
            db: Database session.
            phone_number: User's phone number.
            otp_code: The 6-digit OTP to verify.

        Returns:
            Dict with phone_number, verified flag, and requires_pin flag.
        """
        AuthService.verify_otp(db=db, phone_number=phone_number, otp_code=otp_code)

        user = db.query(User).filter(User.phone_number == phone_number).first()
        has_pin = user is not None and user.pin_hash is not None

        return {
            "phone_number": phone_number,
            "verified": True,
            "requires_pin": has_pin,
        }

    @staticmethod
    def login_with_pin(
        db: Session,
        phone_number: str,
        pin: str,
    ) -> Tuple[User, dict]:
        """Verify PIN and issue tokens for login.

        Args:
            db: Database session.
            phone_number: User's phone number.
            pin: 4-digit PIN.

        Returns:
            Tuple of (User, token_dict).

        Raises:
            HTTPException: If user not found or PIN invalid.
        """
        user = db.query(User).filter(User.phone_number == phone_number).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Please register first.",
            )

        AuthService.verify_pin(db=db, user=user, pin=pin)
        tokens = AuthService.generate_tokens(user, estate_code=user.estate_id)

        return user, tokens

    @staticmethod
    def serialize_user(user: User) -> Dict[str, Any]:
        """Serialize a User object into a dict for API responses.

        Single source of truth for user serialization — prevents
        inconsistent field selection across routes.

        Args:
            user: User model instance.

        Returns:
            Dict with user fields.
        """
        return {
            "id": user.id,
            "phone_number": user.phone_number,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value,
            "house_number": user.house_number,
            "profile_image": user.profile_image,
            "verification_tier": (
                user.verification_tier.value if user.verification_tier else None
            ),
            "dashboard_tier": user.dashboard_tier,
            "is_primary_holder": user.is_primary_holder(),
        }

    @staticmethod
    async def refresh_tokens(
        db: Session,
        redis,
        refresh_token_str: str,
    ) -> Tuple[User, dict]:
        """Exchange a refresh token for a new token pair.

        Implements refresh token rotation:
        - Old refresh token JTI is blacklisted in Redis.
        - New token pair is issued.

        Args:
            db: Database session.
            redis: Redis connection (or None).
            refresh_token_str: The refresh token string.

        Returns:
            Tuple of (User, new_token_dict).

        Raises:
            HTTPException: If token is invalid or user not found.
        """
        from api.db.redis import blacklist_jti

        payload = verify_refresh_token(refresh_token_str)
        user_id = payload.get("user_id")
        old_jti = payload.get("jti", "")

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found.",
            )

        # Blacklist the old refresh token JTI (rotation)
        if redis and old_jti:
            try:
                ttl = _remaining_ttl_seconds(payload)
                await blacklist_jti(redis, old_jti, ttl)
            except Exception:
                app_logger.warning(
                    "[JWT Refresh] Could not blacklist old JTI — Redis error."
                )

        tokens = AuthService.generate_tokens(user, estate_code=user.estate_id)
        return user, tokens

    @staticmethod
    async def invalidate_token(
        redis,
        token_str: str,
    ) -> Dict[str, str]:
        """Invalidate a specific token by blacklisting its JTI.

        Used for explicit logout — pass access_token or refresh_token.

        Args:
            redis: Redis connection (or None).
            token_str: The token string to invalidate.

        Returns:
            Dict with message.
        """
        from api.db.redis import blacklist_jti

        try:
            payload = verify_token(token_str)
            jti = payload.get("jti", "")
            token_type = payload.get("type", "unknown")

            if redis and jti:
                ttl = _remaining_ttl_seconds(payload)
                await blacklist_jti(redis, jti, ttl)

            return {
                "message": f"{token_type.capitalize()} token invalidated successfully."
            }
        except Exception:
            return {"message": "Logged out successfully."}
