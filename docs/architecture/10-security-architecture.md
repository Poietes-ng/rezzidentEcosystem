# 10 — Security Architecture (Nigeria Context)

[← Previous: Real Estate Firms](./09-real-estate-firm-integration.md) | [Back to Index](./README.md) | [Next: TanStack Start Frontend →](./11-tanstack-start-frontend.md)

---

## Threat Model — Nigerian Estate Management

This isn't a generic SaaS security model. It's designed for the specific threats facing a Nigerian estate security platform.

### Threat Assessment

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|------------|
| **SIM swap** → phone number takeover | **HIGH** | **CRITICAL** | PIN as 2nd factor; NIN for PIN resets; device binding |
| **Impersonation** → claiming to be a resident | **HIGH** | **HIGH** | 4-tier verification; neighbor vouching; admin queue |
| **Admin account compromise** | MEDIUM | **CRITICAL** | MFA for admins; activity logs; session management |
| **Paystack webhook forgery** | MEDIUM | **HIGH** | HMAC signature verification; idempotency keys |
| **Estate ID brute force** | LOW | MEDIUM | Rate limit 5/min; CAPTCHA after 3 failures |
| **Data exfiltration** | LOW | **CRITICAL** | Schema isolation; encrypted backups; audit logs |
| **DDoS on VPS** | LOW | **HIGH** | Cloudflare free tier; Nginx rate limiting |
| **Insider threat** (disgruntled admin) | LOW | **HIGH** | Role-based audit trails; no single admin has total access |
| **SQL injection** | LOW | **CRITICAL** | Parameterized queries (SQLAlchemy ORM); fastapi-guard detection |
| **XSS via chat messages** | MEDIUM | MEDIUM | Input sanitization; Content-Security-Policy header |

---

## 4-Layer Security Stack

### Layer 1: Network

```
┌─────────────────────────────────────────────────────────┐
│  NETWORK LAYER                                           │
│                                                          │
│  Cloudflare (Free Tier)                                  │
│  ├── DNS management                                     │
│  ├── Basic DDoS protection (L3/L4)                      │
│  ├── Static asset caching (JS, CSS, images)              │
│  ├── Bot detection                                       │
│  └── Always-on SSL (end-to-end with Nginx)              │
│                                                          │
│  Nginx Reverse Proxy                                     │
│  ├── Rate limiting zones:                                │
│  │   ├── api_auth: 5 req/min (login, register, OTP)    │
│  │   ├── api_upload: 10 req/min (file uploads)          │
│  │   └── api_general: 30 req/sec (all other API)        │
│  ├── SSL termination (Let's Encrypt)                     │
│  ├── Security headers (see below)                        │
│  └── Request size limit: 20MB                            │
│                                                          │
│  UFW Firewall                                            │
│  ├── Allow: 22 (SSH), 80 (HTTP), 443 (HTTPS)           │
│  ├── Deny: everything else                               │
│  └── SSH: key-only auth (no password)                    │
│                                                          │
│  fail2ban                                                │
│  └── Auto-ban IPs with 5 failed SSH attempts             │
└─────────────────────────────────────────────────────────┘
```

### Layer 2: Application

```
┌─────────────────────────────────────────────────────────┐
│  APPLICATION LAYER                                       │
│                                                          │
│  fastapi-guard (in-process middleware)                    │
│  ├── Attack detection: 16 categories                     │
│  │   ├── SQL Injection (SQLi)                            │
│  │   ├── Cross-Site Scripting (XSS)                     │
│  │   ├── Server-Side Request Forgery (SSRF)              │
│  │   ├── Command Injection                               │
│  │   ├── Path Traversal                                  │
│  │   └── ... (12 more categories, 72 regex patterns)     │
│  ├── IP auto-banning: ban after 5 detected attacks       │
│  ├── Behavioral correlation: cross-endpoint patterns     │
│  ├── Redis-backed rate limiting (shared across workers)   │
│  └── Custom log file: logs/security.log                  │
│                                                          │
│  Security Headers Middleware                             │
│  ├── X-Content-Type-Options: nosniff                    │
│  ├── X-Frame-Options: DENY                              │
│  ├── X-XSS-Protection: 1; mode=block                    │
│  ├── Strict-Transport-Security: max-age=31536000        │
│  ├── Referrer-Policy: strict-origin-when-cross-origin    │
│  ├── Permissions-Policy: camera=(), microphone=()        │
│  └── Content-Security-Policy: (tailored per route)       │
│                                                          │
│  Input Validation                                        │
│  ├── Pydantic models on EVERY endpoint (no raw dicts)    │
│  ├── Phone number: regex validated Nigerian format        │
│  ├── Email: RFC 5322 validation                          │
│  ├── File uploads: MIME type + magic bytes check          │
│  └── CSV: injection-safe parsing                         │
│                                                          │
│  CORS                                                    │
│  ├── Explicit origin allowlist (NO wildcards)            │
│  ├── Credentials: true (for httpOnly cookies)             │
│  └── Methods: GET, POST, PUT, PATCH, DELETE only         │
└─────────────────────────────────────────────────────────┘
```

### Layer 3: Authentication

```
┌─────────────────────────────────────────────────────────┐
│  AUTHENTICATION LAYER                                    │
│                                                          │
│  Phone OTP (Termii SMS gateway)                          │
│  ├── 6-digit code, 5-min expiry                          │
│  ├── Max 3 retries per session                           │
│  ├── Max 5 OTP requests per phone per hour               │
│  ├── ⚠️ NEVER in API response (current bug: FIXED)       │
│  └── Rate limited at Nginx layer too                     │
│                                                          │
│  PIN (4-digit numeric)                                   │
│  ├── bcrypt-hashed server-side                           │
│  ├── 5 attempts before 30-min lockout                    │
│  ├── 3 lockouts in 24hr → account frozen                 │
│  └── Reset requires OTP + NIN last 4 digits              │
│                                                          │
│  JWT Tokens                                              │
│  ├── Access: 15 min lifespan, contains permissions       │
│  ├── Refresh: 7 day lifespan, in device Keychain         │
│  ├── JTI (unique ID) in every token                      │
│  ├── Blacklist: Redis SET with TTL matching token expiry  │
│  └── SECRET_KEY: 64-byte random hex (rotated quarterly)  │
│                                                          │
│  Admin Passwords                                         │
│  ├── bcrypt hash, cost factor 12                         │
│  ├── Minimum 10 characters                               │
│  ├── Complexity requirements enforced                     │
│  ├── Common password list check (top 10,000)             │
│  └── 90-day expiry (configurable)                        │
│                                                          │
│  Biometric (Device-Level Only)                           │
│  ├── Expo LocalAuthentication + SecureStore               │
│  ├── Unlocks stored refresh token — NOT a server auth     │
│  └── Fallback: PIN always available                      │
└─────────────────────────────────────────────────────────┘
```

### Layer 4: Data

```
┌─────────────────────────────────────────────────────────┐
│  DATA LAYER                                              │
│                                                          │
│  Schema Isolation                                        │
│  ├── Each estate in its own PostgreSQL schema            │
│  ├── No cross-schema queries possible from app layer     │
│  └── Middleware enforces schema per request               │
│                                                          │
│  Encrypted Backups                                       │
│  ├── pg_dump → gzip → gpg encrypt → MinIO backups bucket │
│  ├── Automated via cron (every 6 hours)                  │
│  └── 30-day retention policy                             │
│                                                          │
│  Audit Logs                                              │
│  ├── Every mutation logged (CREATE, UPDATE, DELETE)       │
│  ├── Fields: user_id, action, resource, IP, timestamp    │
│  ├── Immutable: append-only table, no UPDATE/DELETE      │
│  └── Cross-tenant audit in public schema                 │
│                                                          │
│  NDPA Compliance (Nigeria Data Protection Act)           │
│  ├── Consent tracking: user agrees to T&C during signup  │
│  ├── Data minimization: collect only what's needed        │
│  ├── Right to deletion: user can request data export/delete│
│  ├── NIN data: stored hashed, not in plaintext            │
│  └── Privacy policy: linked in app and website            │
│                                                          │
│  Secrets Management                                      │
│  ├── Docker secrets for database passwords               │
│  ├── Environment variables for API keys                  │
│  ├── .env NEVER committed to git                         │
│  ├── .env.sample in repo (with placeholder values)       │
│  └── Quarterly secret rotation schedule                  │
└─────────────────────────────────────────────────────────┘
```

---


## SIM-Swap Protection

SIM swapping is the #1 identity theft vector in Nigeria. An attacker convinces a telecom operator to port your number to their SIM, then receives your OTPs.

### How We Defend Against It

```
Standard (vulnerable) auth:
  Phone number → OTP → Access
  Problem: SIM swap gives attacker the OTP

Our auth:
  Phone number → OTP → PIN → Access
  Protection: Even with SIM swap, attacker doesn't know the PIN

PIN reset:
  OTP + Last 4 digits of NIN → New PIN
  Protection: Attacker needs your NIN (not just phone)

Critical actions (change phone, add members):
  Current PIN + OTP on current phone + OTP on new phone
  Protection: Triple verification for account-level changes
```

---

[← Previous: Real Estate Firms](./09-real-estate-firm-integration.md) | [Back to Index](./README.md) | [Next: TanStack Start Frontend →](./11-tanstack-start-frontend.md)
