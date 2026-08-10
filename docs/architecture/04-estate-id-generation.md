# 04 — Estate ID Generation System

[← Previous: Multi-Tenant](./03-multi-tenant-architecture.md) | [Back to Index](./README.md) | [Next: Registration & Onboarding →](./05-registration-onboarding.md)

---

## Requirements

The Estate ID is the single most important identifier in the system. Residents use it to join their estate, security guards use it to verify visitors, and admins use it to access their dashboard.

| Requirement            | Why                                                                        |
| ------------------------| ----------------------------------------------------------------------------|
| **Human-readable**     | Residents type it on their phone to join                                   |
| **Verbally shareable** | "My estate code is BVD dash 7 X 3 K M" — works over phone calls            |
| **Short**              | Fits in a WhatsApp message, easy to remember                               |
| **Secure**             | Can't be guessed or enumerated by attackers                                |
| **Unique**             | Zero collision across all estates                                          |
| **Nigeria-friendly**   | Works on standard phone keyboards, no confusion between similar characters |

---

## The Algorithm: `PREFIX-NANOID`

```
Format: [3 letters from estate name]-[5 alphanumeric chars]

Examples:
  "BvD Estate"               → BVD-7X3KM
  "Green Valley Estate"      → GRE-N8P4R
  "Lekki Phase 1 Residents"  → LEK-W2M6D
  "Banana Island"            → BAN-9F5HT
  "Aso Rock Villa"           → ASO-4C8JN

Total length: 9 characters (including hyphen)
```

### Why This Format

- **3-letter prefix:** Instantly recognizable — residents know "BVD" is BvD Estate
- **Hyphen separator:** Makes it easy to read and dictate
- **5-char random:** Cryptographically secure, sufficient entropy for millions of estates
- **ALL UPPERCASE:** No case confusion when typing or dictating

---

## Safe Character Alphabet

We use a custom 30-character alphabet that removes characters commonly confused when spoken aloud or typed on a phone:

```
SAFE: 2 3 4 5 6 7 8 9 A B C D E F G H J K M N P Q R S T U V W X Y Z

REMOVED:
  0 (zero)   — confused with O (letter)
  O (letter) — confused with 0 (zero)  
  1 (one)    — confused with I, l, |
  I (letter) — confused with 1, l
  L (letter) — confused with 1, I (especially lowercase)
```

This is the same approach used by airline booking codes, hospital patient IDs, and military communications.

---

## Implementation

```python
# api/utils/estate_id.py

import secrets
from sqlalchemy.orm import Session
from sqlalchemy import text

# 30-char alphabet with ambiguous characters removed
SAFE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

def generate_estate_code(estate_name: str, db: Session) -> str:
    """
    Generate a unique, human-readable estate ID.
    
    Format: XXX-YYYYY
      - XXX: First 3 alpha characters of estate name (uppercase)
      - YYYYY: 5 cryptographically random chars from safe alphabet
    
    Entropy: 30^5 = 24,300,000 combinations per prefix
    Collision probability at 1,000 estates: 0.002%
    
    Retries up to 5 times if collision detected (astronomically unlikely).
    """
    # Extract first 3 uppercase letters
    prefix_chars = [c.upper() for c in estate_name if c.isalpha()][:3]
    
    # Pad with 'X' if name is too short (e.g., "AB Estate" → "ABX")
    while len(prefix_chars) < 3:
        prefix_chars.append('X')
    
    prefix = ''.join(prefix_chars)
    
    # Try up to 5 times (collision is nearly impossible, but be safe)
    for attempt in range(5):
        random_part = ''.join(
            secrets.choice(SAFE_ALPHABET) for _ in range(5)
        )
        estate_code = f"{prefix}-{random_part}"
        
        # Check uniqueness in database
        existing = db.execute(
            text("SELECT 1 FROM public.estates WHERE estate_code = :code"),
            {"code": estate_code}
        ).fetchone()
        
        if not existing:
            return estate_code
    
    # This should never happen (30^5 = 24M combinations)
    raise RuntimeError(
        f"Failed to generate unique estate code after 5 attempts. "
        f"Prefix: {prefix}"
    )
```

---

## Security Analysis

### Brute-Force Resistance

| Metric | Value |
|--------|-------|
| Character set size | 30 |
| Random portion length | 5 characters |
| Combinations per prefix | 30⁵ = **24,300,000** |
| Unique prefixes (assuming 1,000 estates) | ~300 unique 3-letter combos |
| Total search space | ~24.3M × 300 = **7.29 billion** |
| Rate limit on estate lookup | **5 attempts/minute** |
| Time to brute-force (at 5/min) | **2,770 years** |

### Additional Protections

| Protection | Where |
|-----------|-------|
| Rate limiting: 5 lookups/minute per IP | Nginx `limit_req` zone |
| CAPTCHA after 3 failed lookups | Frontend (hCaptcha) |
| IP banning after 20 failed lookups | fastapi-guard auto-ban |
| No public estate list endpoint | Cannot enumerate estates |
| Estate code not in URLs | Stored in JWT claims only |

### What an Attacker Would Need

To access an estate's data, an attacker needs **all three**:
1. A valid estate code (e.g., `BVD-7X3KM`) — brute-force resistant
2. A valid phone number registered to that estate — can't enumerate
3. The OTP sent to that phone — SIM-swap is the only vector (mitigated by PIN)

---

## Schema Name Derivation

The estate code is also used to derive the PostgreSQL schema name:

```python
def estate_code_to_schema(estate_code: str) -> str:
    """
    Convert estate code to PostgreSQL schema name.
    
    "PAR-7X3KM" → "est_par7x3km"
    
    Rules:
    - Prefix: "est_"
    - Lowercase
    - Remove hyphen
    - Max 20 chars (PostgreSQL limit is 63, but keep short)
    """
    clean = estate_code.replace("-", "").lower()
    return f"est_{clean}"
```

---

## Display & Usage Rules

| Context              | How Estate ID is Shown                                     |
| ----------------------| ------------------------------------------------------------|
| Admin dashboard      | Displayed in header: `BVD-7X3KM`                           |
| Resident app         | Shown in profile: "Estate: Paradise Boulevard (BVD-7X3KM)" |
| Join estate screen   | Input field with mask: `___-_____`                         |
| Email communications | "Your Estate Code: **BVD-7X3KM**"                          |
| API (JWT claims)     | `{ "estate_id": "BVD-7X3KM" }`                             |
| Database             | `public.estates.estate_code = 'BVD-7X3KM'`                 |
| Never shown          | In URLs, error messages, or public pages                   |

---

[← Previous: Multi-Tenant](./03-multi-tenant-architecture.md) | [Back to Index](./README.md) | [Next: Registration & Onboarding →](./05-registration-onboarding.md)
