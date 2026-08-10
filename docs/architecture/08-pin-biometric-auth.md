# 08 — PIN & Biometric Authentication System

[← Previous: Family Tree](./07-family-tree-access.md) | [Back to Index](./README.md) | [Next: Security Architecture →](./10-security-architecture.md)

---

## Authentication Layers

The system uses 4 layers of authentication. Not all layers are required for every action — the level of security scales with the sensitivity of the operation.

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: Identity — "Who are you?"                              │
│  ─────────────────────────────────                               │
│  Phone Number + OTP (one-time, during registration/first login)  │
│  Purpose: Prove phone ownership                                  │
│  Provider: Termii (Nigerian SMS gateway)                         │
│  OTP: 6-digit, expires in 5 minutes, max 3 retries              │
│  ⚠️ CRITICAL: OTP is NEVER returned in API response              │
│                                                                  │
│  LAYER 2: Knowledge — "What do you know?"                        │
│  ──────────────────────────────────────                           │
│  4-digit numeric PIN (set during onboarding)                     │
│  Purpose: Quick app unlock, confirm sensitive transactions       │
│  Storage: bcrypt-hashed server-side                              │
│  Mobile: Also stored in device Keychain (encrypted)              │
│                                                                  │
│  LAYER 3: Biometric — "What are you?" (Optional)                 │
│  ─────────────────────────────────────────────                    │
│  Face ID / Fingerprint (device-level, NOT server-stored)         │
│  Purpose: Replace PIN for app unlock (convenience)               │
│  Fallback: PIN is always available                               │
│  Implementation: Expo LocalAuthentication + SecureStore           │
│                                                                  │
│  LAYER 4: Session — Bearer token                                 │
│  ──────────────────────────────                                   │
│  Access token: 15-minute lifespan (in-memory only)               │
│  Refresh token: 7-day lifespan (device Keychain)                 │
│  JWT contains: user_id, estate_id, role, permissions             │
│  Blacklist: Redis set of revoked JTIs (for logout)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## PIN Rules

```python
PIN_RULES = {
    "length": 4,
    "type": "numeric",          # 0-9 only
    "max_attempts": 5,          # before lockout
    "lockout_duration": 1800,   # 30 minutes (1800 seconds)
    
    "blocked_patterns": [
        "1234", "4321", "0000", "1111", "2222", "3333",
        "4444", "5555", "6666", "7777", "8888", "9999",
        "1111", "2580", "0852",  # vertical keyboard patterns
    ],
    
    "cannot_match": [
        "phone_last_4",         # Can't use last 4 digits of phone
        "birth_year",           # Can't use birth year (if NIN verified)
    ],
}
```

### PIN Storage

```python
# Server-side: bcrypt hash (same as password hashing)
import bcrypt

def hash_pin(pin: str) -> str:
    return bcrypt.hashpw(pin.encode(), bcrypt.gensalt()).decode()

def verify_pin(pin: str, pin_hash: str) -> bool:
    return bcrypt.checkpw(pin.encode(), pin_hash.encode())

# Mobile: PIN verification happens server-side
# The mobile app sends the PIN to the backend, never stores it in plaintext
# Biometric unlock releases the stored JWT refresh token from Keychain
```

---

## When Each Auth Layer Is Required

| Action | Layer Required | Why |
|--------|---------------|-----|
| **Open app** (after 5 min background) | PIN or Biometric | Quick re-auth, prevent walk-away access |
| **View dashboard** | Session token only | Low sensitivity, no PIN needed |
| **View bills** | Session token only | Read-only, no financial action |
| **View notifications** | Session token only | Read-only |
| **Pay a bill** (Paystack) | **PIN confirmation** | Financial transaction |
| **Create visitor code** | **PIN confirmation** | Security-sensitive (grants physical access) |
| **Send community chat message** | Session token only | Low sensitivity |
| **View expense details** | Session token only | Read-only |
| **Approve expense** (admin) | **PIN confirmation** | Financial authorization |
| **Add managed member** | **PIN + OTP** | Grants account-level access |
| **Change phone number** | **OTP on old + new phone** | Highest sensitivity |
| **Change PIN** | **Current PIN + OTP** | Credential change |
| **Reset forgotten PIN** | **OTP + last 4 of NIN** | Account recovery |
| **Admin: reject/approve resident** | **PIN confirmation** | Security decision |
| **Remove managed member** | **PIN confirmation** | Account-level change |

---

## PIN Lockout Flow

```
Attempt 1: Wrong PIN → "Incorrect PIN. 4 attempts remaining."
Attempt 2: Wrong PIN → "Incorrect PIN. 3 attempts remaining."
Attempt 3: Wrong PIN → "Incorrect PIN. 2 attempts remaining."
Attempt 4: Wrong PIN → "Incorrect PIN. 1 attempt remaining."
Attempt 5: Wrong PIN → 🔒 "Account locked for 30 minutes."
                        └── Push notification to primary holder (if managed member)
                        └── Activity log entry: "PIN lockout - 5 failed attempts"
                        └── If admin account: email alert sent

After 30 min → Unlocked. Counter resets.
After 3 lockouts in 24 hours → Account frozen. Must contact admin.
```

---

## Forgotten PIN Recovery

```
User taps "Forgot PIN"
        │
Step 1: Enter phone number → OTP sent via SMS
        │
Step 2: Enter OTP (6-digit, 5-min expiry)
        │
Step 3: Enter last 4 digits of NIN
        ├── If NIN-verified: Checked against stored NIN hash
        └── If not NIN-verified: Enter full NIN → verify via Dojah API
        │
Step 4: Set new PIN (same rules: no sequences, no phone#)
        │
✅ PIN reset. All active sessions invalidated.
   Old refresh tokens blacklisted in Redis.
```

---

## Admin Authentication (Web)

Admin officers use a different auth flow on the web — email + password instead of phone + OTP:

```
Admin Web Login:
1. Enter Estate ID: BVD-7X3KM
2. Enter Email: [EMAIL_ADDRESS]  
3. Enter Password: ••••••••••••
4. 2FA: OTP sent to registered phone number
5. Enter OTP
6. ✅ Access granted to admin dashboard

Admin Password Rules:
├── Minimum 10 characters
├── Must contain: uppercase, lowercase, number, special char
├── Cannot be in common password list (top 10,000)
├── Cannot match estate name or email prefix
├── Expires every 90 days (configurable by platform admin)
└── bcrypt hash with cost factor 12
```

---

## JWT Token Design

```json
// Access Token (15-minute lifespan)
{
  "sub": "user_abc123",           // User ID
  "estate_id": "BVD-7X3KM",      // Estate code
  "schema": "est_bvd7x3km",      // Direct schema reference
  "role": "resident",            // User role
  "tier": "pre_verified",        // Verification tier
  "primary": true,               // Is primary account holder
  "perms": ["pay_bills", "create_visitor_code"],  // Permissions
  "jti": "tok_xyz789",           // Unique token ID (for blacklisting)
  "iat": 1721174400,             // Issued at
  "exp": 1721175300              // Expires (15 min later)
}

// Refresh Token (7-day lifespan)
{
  "sub": "user_abc123",
  "jti": "ref_abc456",
  "type": "refresh",
  "iat": 1721174400,
  "exp": 1721779200              // 7 days later
}
```

### JWT Blacklisting (Redis)

```python
# On logout or PIN reset
async def blacklist_token(jti: str, exp: int):
    """Add token JTI to Redis blacklist. Auto-expires when token would have expired."""
    ttl = exp - int(time.time())
    if ttl > 0:
        await redis.setex(f"blacklist:{jti}", ttl, "1")

# In auth middleware
async def is_token_blacklisted(jti: str) -> bool:
    return await redis.exists(f"blacklist:{jti}")
```

---

[← Previous: Family Tree](./07-family-tree-access.md) | [Back to Index](./README.md) | [Next: Security Architecture →](./10-security-architecture.md)

