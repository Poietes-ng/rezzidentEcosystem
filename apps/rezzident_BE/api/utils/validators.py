"""Validators — V2 new.

Nigerian phone number, PIN rules, email, and estate code validation.
Reference: docs/architecture/08-pin-biometric-auth.md
"""

import re
from typing import Optional


# ── Phone Number ──

NIGERIAN_PHONE_REGEX = re.compile(
    r"^(\+234|0)(70|80|81|90|91|80|70)\d{8}$"
)

def validate_phone_number(phone: str) -> str:
    """Validate and normalize Nigerian phone number to +234 format.

    Accepts: +2348012345678, 08012345678
    Returns: +2348012345678 (always +234 prefix)

    Raises:
        ValueError if phone number is invalid.
    """
    phone = phone.strip().replace(" ", "").replace("-", "")

    if phone.startswith("0") and len(phone) == 11:
        phone = "+234" + phone[1:]

    if not re.match(r"^\+234(70|80|81|90|91)\d{8}$", phone):
        raise ValueError("Invalid Nigerian phone number. Must start with +234 or 0.")

    return phone


# ── PIN ──

BLOCKED_PINS = {
    "0000", "1111", "2222", "3333", "4444",
    "5555", "6666", "7777", "8888", "9999",
    "1234", "4321", "1122", "2233", "3344",
    "0123", "3210", "9876", "6789",
}


def validate_pin(pin: str) -> str:
    """Validate a 4-digit PIN against security rules.

    Rules (from docs/architecture/08-pin-biometric-auth.md):
    1. Must be exactly 4 digits
    2. Cannot be a blocked pattern (sequential, repeated)
    3. Cannot have 3+ same digits

    Raises:
        ValueError with descriptive message.
    """
    if not pin or not pin.isdigit() or len(pin) != 4:
        raise ValueError("PIN must be exactly 4 digits.")

    if pin in BLOCKED_PINS:
        raise ValueError("This PIN is too simple. Please choose a different PIN.")

    # Check for 3+ same digits (e.g., 1112, 3331)
    for digit in set(pin):
        if pin.count(digit) >= 3:
            raise ValueError("PIN cannot have 3 or more of the same digit.")

    return pin


# ── Email ──

EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)


def validate_email(email: str) -> str:
    """Validate email format."""
    email = email.strip().lower()
    if not EMAIL_REGEX.match(email):
        raise ValueError("Invalid email address.")
    return email


# ── Estate Code ──

ESTATE_CODE_REGEX = re.compile(r"^[A-Z]{3}-[A-Z0-9]{5}$")


def validate_estate_code(code: str) -> str:
    """Validate estate code format (e.g., PAR-7X3KM)."""
    code = code.strip().upper()
    if not ESTATE_CODE_REGEX.match(code):
        raise ValueError("Invalid estate code format. Expected: XXX-XXXXX (e.g., PAR-7X3KM)")
    return code
