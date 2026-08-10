"""Estate ID generator — V2 new.

Generates unique estate codes in the format: PAR-7X3KM
- 3-letter prefix derived from estate name
- 5-character alphanumeric suffix (uppercase, no ambiguous chars)

Reference: docs/architecture/13-database-schema.md
"""

import secrets
import re


# Characters that won't be confused: no 0/O, 1/I/L
SAFE_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"


def generate_estate_code(estate_name: str) -> str:
    """Generate a unique estate code from the estate name.

    Examples:
        "Paradise Boulevard Estate" -> "PAR-7X3KM"
        "Lekki Gardens" -> "LEK-9M2HT"
        "Banana Island" -> "BAN-4R8WN"

    Args:
        estate_name: The full name of the estate.

    Returns:
        A code in the format XXX-XXXXX.
    """
    # Extract prefix: first 3 uppercase letters from estate name
    letters = re.sub(r"[^A-Za-z]", "", estate_name).upper()
    prefix = letters[:3] if len(letters) >= 3 else letters.ljust(3, "X")

    # Generate 5-char cryptographically secure suffix
    suffix = "".join(secrets.choice(SAFE_CHARS) for _ in range(5))

    return f"{prefix}-{suffix}"


def generate_schema_name(estate_code: str) -> str:
    """Convert estate code to PostgreSQL schema name.

    Examples:
        "PAR-7X3KM" -> "est_par7x3km"

    Args:
        estate_code: The estate code (e.g., PAR-7X3KM).

    Returns:
        A valid PostgreSQL schema name.
    """
    clean = estate_code.replace("-", "").lower()
    return f"est_{clean}"
