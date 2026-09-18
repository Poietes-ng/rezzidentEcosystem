"""Auth schemas — Pydantic V2 request/response models.

Reference: docs/architecture/08-pin-biometric-auth.md
"""

from pydantic import BaseModel, Field, field_validator

from api.utils.validators import validate_phone_number, validate_pin

# ── Registration Flow ──


class RequestOTPSchema(BaseModel):
    """Request OTP for registration or login."""

    phone_number: str = Field(..., description="Nigerian phone number (+234 or 0 prefix)")
    purpose: str = Field(default="registration", description="'registration' or 'login'")

    @field_validator("phone_number")
    @classmethod
    def normalize_phone(cls, v):
        return validate_phone_number(v)


class VerifyOTPSchema(BaseModel):
    """Verify OTP code."""

    phone_number: str = Field(..., description="Phone number that received the OTP")
    otp_code: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code")

    @field_validator("phone_number")
    @classmethod
    def normalize_phone(cls, v):
        return validate_phone_number(v)


class SetPINSchema(BaseModel):
    """Set 4-digit PIN after OTP verification."""

    phone_number: str
    pin: str = Field(..., min_length=4, max_length=4, description="4-digit PIN")
    confirm_pin: str = Field(..., min_length=4, max_length=4, description="Confirm PIN")
    full_name: str | None = Field(default=None, min_length=2, max_length=100)
    estate_code: str | None = Field(default=None, description="Estate code (e.g., PAR-7X3KM)")

    @field_validator("phone_number")
    @classmethod
    def normalize_phone(cls, v):
        return validate_phone_number(v)

    @field_validator("pin")
    @classmethod
    def validate_pin_rules(cls, v):
        return validate_pin(v)

    @field_validator("confirm_pin")
    @classmethod
    def pins_match(cls, v, info):
        if "pin" in info.data and v != info.data["pin"]:
            raise ValueError("PINs do not match.")
        return v


# ── Login Flow ──


class VerifyPINSchema(BaseModel):
    """Verify PIN for login (after OTP)."""

    phone_number: str
    pin: str = Field(..., min_length=4, max_length=4)

    @field_validator("phone_number")
    @classmethod
    def normalize_phone(cls, v):
        return validate_phone_number(v)


# ── Token Management ──


class RefreshTokenSchema(BaseModel):
    """Exchange refresh token for new access token."""

    refresh_token: str


class AdminLoginSchema(BaseModel):
    """Admin email + password login."""

    email: str
    password: str
    otp_code: str | None = None


# ── Responses ──


class TokenResponse(BaseModel):
    """Token pair response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access token expiry in seconds")


class OTPResponse(BaseModel):
    """OTP sent confirmation — NEVER includes the OTP itself."""

    message: str
    phone_number: str
    expires_in_seconds: int = 300


class UserResponse(BaseModel):
    """User profile response."""

    id: str
    phone_number: str
    full_name: str | None = None
    email: str | None = None
    role: str
    house_number: str | None = None
    profile_image: str | None = None
    verification_tier: str | None = None
    is_primary_holder: bool = True

    class Config:
        from_attributes = True
