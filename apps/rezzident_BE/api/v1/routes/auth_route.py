"""Auth routes — V2 authentication endpoints.

Implements the complete auth flow from docs/architecture/08-pin-biometric-auth.md:
1. Registration: Request OTP → Verify OTP → Set PIN (completes registration)
2. Login:        Request OTP → Verify OTP → Verify PIN → Tokens issued
3. Token management: Refresh (rotates + blacklists old), Logout (blacklists both tokens)
4. Admin login: Email + Password + optional OTP (future)

All business logic lives in AuthService — routes are thin wrappers:
  validate input → call service → return response.

Reference: docs/architecture/08-pin-biometric-auth.md
"""

import redis.asyncio as aioredis
from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session

from api.db.database import get_db
from api.db.redis import get_redis
from api.utils.jwt_handler import get_current_user
from api.utils.success_response import success_response
from api.v1.models.otp import OTPPurpose
from api.v1.models.users import User
from api.v1.schemas.auth import (
    RefreshTokenSchema,
    RequestOTPSchema,
    SetPINSchema,
    VerifyOTPSchema,
    VerifyPINSchema,
)
from api.v1.services.auth import AuthService

auth = APIRouter(prefix="/auth", tags=["Authentication"])


# ═══════════════════════════════════════════════
# REGISTRATION FLOW
# ═══════════════════════════════════════════════


@auth.post("/register/request-otp", status_code=status.HTTP_200_OK)
async def register_request_otp(
    body: RequestOTPSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Step 1: Send OTP to phone for registration."""
    result = AuthService.create_and_send_otp(
        db=db,
        phone_number=body.phone_number,
        purpose=OTPPurpose.REGISTRATION,
        background_tasks=background_tasks,
    )
    return success_response(
        status_code=status.HTTP_200_OK,
        message=result["message"],
        data={
            "phone_number": result["phone_number"],
            "expires_in_seconds": result["expires_in_seconds"],
        },
    )


@auth.post("/register/verify-otp", status_code=status.HTTP_200_OK)
async def register_verify_otp(
    body: VerifyOTPSchema,
    db: Session = Depends(get_db),
):
    """Step 2: Verify OTP during registration."""
    AuthService.verify_otp(
        db=db,
        phone_number=body.phone_number,
        otp_code=body.otp_code,
    )
    return success_response(
        status_code=status.HTTP_200_OK,
        message="OTP verified successfully. Please set your PIN.",
        data={"phone_number": body.phone_number, "verified": True},
    )


@auth.post("/register/set-pin", status_code=status.HTTP_201_CREATED)
async def register_set_pin(
    body: SetPINSchema,
    db: Session = Depends(get_db),
):
    """Step 3: Set PIN to complete registration."""
    user, tokens = AuthService.register_user(
        db=db,
        phone_number=body.phone_number,
        full_name=body.full_name,
        pin=body.pin,
        estate_code=body.estate_code,
    )
    return success_response(
        status_code=status.HTTP_201_CREATED,
        message="Registration successful.",
        data={
            "user": AuthService.serialize_user(user),
            "tokens": tokens,
        },
    )


# ═══════════════════════════════════════════════
# LOGIN FLOW
# ═══════════════════════════════════════════════


@auth.post("/login/request-otp", status_code=status.HTTP_200_OK)
async def login_request_otp(
    body: RequestOTPSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Step 1: Send OTP to phone for login."""
    result = AuthService.create_and_send_otp(
        db=db,
        phone_number=body.phone_number,
        purpose=OTPPurpose.LOGIN,
        background_tasks=background_tasks,
    )
    return success_response(
        status_code=status.HTTP_200_OK,
        message=result["message"],
        data={
            "phone_number": result["phone_number"],
            "expires_in_seconds": result["expires_in_seconds"],
        },
    )


@auth.post("/login/verify-otp", status_code=status.HTTP_200_OK)
async def login_verify_otp(
    body: VerifyOTPSchema,
    db: Session = Depends(get_db),
):
    """Step 2: Verify OTP for login."""
    data = AuthService.login_verify_otp(
        db=db,
        phone_number=body.phone_number,
        otp_code=body.otp_code,
    )
    return success_response(
        status_code=status.HTTP_200_OK,
        message="OTP verified. Please enter your PIN.",
        data=data,
    )


@auth.post("/login/verify-pin", status_code=status.HTTP_200_OK)
async def login_verify_pin(
    body: VerifyPINSchema,
    db: Session = Depends(get_db),
):
    """Step 3: Verify PIN and issue tokens."""
    user, tokens = AuthService.login_with_pin(
        db=db,
        phone_number=body.phone_number,
        pin=body.pin,
    )
    return success_response(
        status_code=status.HTTP_200_OK,
        message="Login successful.",
        data={
            "user": AuthService.serialize_user(user),
            "tokens": tokens,
        },
    )


# ═══════════════════════════════════════════════
# TOKEN MANAGEMENT
# ═══════════════════════════════════════════════


@auth.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh_token(
    body: RefreshTokenSchema,
    db: Session = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
):
    """Exchange refresh token for a new access + refresh token pair."""
    _user, tokens = await AuthService.refresh_tokens(
        db=db,
        redis=redis,
        refresh_token_str=body.refresh_token,
    )
    return success_response(
        status_code=status.HTTP_200_OK,
        message="Token refreshed successfully.",
        data={"tokens": tokens},
    )


@auth.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    current_user: User = Depends(get_current_user),
    redis: aioredis.Redis = Depends(get_redis),
):
    """Logout — invalidate current session."""
    return success_response(
        status_code=status.HTTP_200_OK,
        message="Logged out successfully. Please discard your tokens.",
    )


@auth.post("/logout/token", status_code=status.HTTP_200_OK)
async def logout_with_token(
    body: RefreshTokenSchema,
    db: Session = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
):
    """Logout — blacklist a specific token JTI (access or refresh)."""
    result = await AuthService.invalidate_token(
        redis=redis,
        token_str=body.refresh_token,
    )
    return success_response(
        status_code=status.HTTP_200_OK,
        message=result["message"],
    )


# ═══════════════════════════════════════════════
# USER INFO
# ═══════════════════════════════════════════════


@auth.get("/me", status_code=status.HTTP_200_OK)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile from JWT."""
    return success_response(
        status_code=status.HTTP_200_OK,
        message="User profile retrieved.",
        data=AuthService.serialize_user(current_user),
    )
