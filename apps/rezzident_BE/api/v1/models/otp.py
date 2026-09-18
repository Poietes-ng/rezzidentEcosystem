"""OTP model — tenant schema.

V2: Fixed Boolean import, added ESTATE_REGISTRATION purpose for Figma flow
where estate holder enters code and registers phone number → OTP → access.
"""

import enum
from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String

from api.v1.models.base_model import BaseTableModel


class OTPPurpose(enum.StrEnum):
    REGISTRATION = "registration"
    LOGIN = "login"
    PIN_RESET = "pin_reset"
    PHONE_CHANGE = "phone_change"
    ADD_MEMBER = "add_member"
    ESTATE_REGISTRATION = "estate_registration"  # V2: Figma estate holder flow


class OTP(BaseTableModel):
    __tablename__ = "otps"

    phone_number = Column(String(20), nullable=False, index=True)
    otp_hash = Column(String(255), nullable=False)  # bcrypt hashed — NEVER in API response
    purpose = Column(Enum(OTPPurpose), nullable=False)
    attempts = Column(Integer, default=0)  # Max 3 retries
    max_attempts = Column(Integer, default=3)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False)

    def is_expired(self) -> bool:
        return datetime.now(UTC) > self.expires_at

    def is_max_attempts(self) -> bool:
        return self.attempts >= self.max_attempts
