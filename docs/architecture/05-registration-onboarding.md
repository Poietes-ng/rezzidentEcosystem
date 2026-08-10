# 05 — Registration & Onboarding Flows

[← Previous: Estate ID](./04-estate-id-generation.md) | [Back to Index](./README.md) | [Next: Resident Verification →](./06-resident-verification.md)

---

## Three Registration Paths

The system has three distinct registration flows, each designed for a different actor:

```
PATH A: Estate Admin Registration ──── Web Only
PATH B: Resident Onboarding ────────── Mobile + Web
PATH C: Real Estate Firm Registration ─ Web Only (see page 09)
```

---

## PATH A: Estate Admin Registration (Web Only)

> This is how a new estate gets onto the platform. Only happens on the web app.

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Estate Information                                      │
│  ──────────────────────────                                      │
│  ├── Estate Name *              "BvD Estate"                     │
│  ├── Precise Address *          "Plot 123, Maryland, Lagos"      │
│  ├── Estate Structure *         [Dropdown: Estate Structure Plan]│
│  ├── State/Region *             [Dropdown: Nigerian states]      │
│  ├── Number of Houses           [Radio: <10, <20, <50, <100+]   │
│  ├── Estate Logo                [Upload → Cloudinary]            │
│  └── Description                [Optional]                       │
│                                                                  │
│  STEP 2: Key Officers (Minimum 3)                                │
│  ────────────────────────────────                                │
│  The 3 core leadership roles. Titles are flexible because        │
│  Nigerian estate structures vary:                                │
│                                                                  │
│  Officer 1: [Chairman / President / Head]                        │
│  ├── Full Legal Name *                                           │
│  ├── Phone Number * (+234...)                                    │
│  ├── Email Address *                                             │
│  ├── ID Type * [NIN / Driver's License]                          │
│  ├── ID Number *                                                 │
│  ├── Passport Photo (optional → Cloudinary)                      │
│  └── Tenureship [Current / Past / Indefinite]                    │
│                                                                  │
│  Officer 2: [Secretary / General Secretary]                      │
│  └── (same fields)                                               │
│                                                                  │
│  Officer 3: [Treasurer / Financial Secretary]                    │
│  └── (same fields)                                               │
│                                                                  │
│  [+ Add more officers] (optional, for estates with more roles)   │
│                                                                  │
│  STEP 3: NIN / Driver's License Verification                    │
│  ─────────────────────────────────────────────                   │
│  Each officer's ID is verified in real-time via Dojah API.       │
│  See verification details below.                                 │
│                                                                  │
│  STEP 4: Resident List Upload (Optional)                        │
│  ────────────────────────────────────────                        │
│  Upload CSV with: house_number, full_name, phone_number, email   │
│  This pre-populates the resident database for seamless           │
│  onboarding (Tier 1 verification — see page 06).                │
│                                                                  │
│  STEP 5: Review & Submit                                        │
│  ────────────────────────                                        │
│  Review all information → Submit                                 │
│                                                                  │
│  RESULT:                                                         │
│  ├── Estate ID generated: BVD-7X3KM                             │
│  ├── PostgreSQL schema created: est_bvd7x3km                     │
│  ├── Officers created as admin users in tenant schema            │
│  ├── Resident CSV imported (if uploaded)                         │
│  ├── Welcome email sent to all officers with Estate ID           │
│  ├── 14-day free trial starts                                    │
│  └── Officers can log in with email + password                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### NIN Verification Detail

```
Officer enters NIN: 12345678901
        │
        ▼
Backend calls Dojah API:
  POST https://api.dojah.io/api/v1/kyc/nin
  Headers: { Authorization: "Bearer sk_live_xxx", AppId: "xxx" }
  Body: { "nin": "12345678901" }
        │
        ▼
API returns:
  {
    "entity": {
      "first_name": "JOHN",
      "last_name": "ADEBAYO",
      "middle_name": "OLUWASEUN",
      "phone": "08012345678",
      "date_of_birth": "1985-03-15",
      "gender": "Male",
      "photo": "/9j/4AAQ...",  ← Base64 NIN photo
      "nin": "12345678901"
    }
  }
        │
        ▼
Match Checks:
  ✅ Name match: "John Adebayo" ≈ "JOHN ADEBAYO" (case-insensitive)
  ✅ Phone match: "+2348012345678" = "08012345678" (normalized)
  ⚠️ Photo: Stored for admin review (not shown publicly)
        │
        ▼
If ALL match → ✅ Verified badge on officer profile
If partial → ⚠️ Flagged for manual review by platform admin
If failure → ❌ Retry with correct NIN or use Driver's License
```

### NIN Verification Provider Comparison

| Provider | Per-Call Cost | API Style | Sandbox | Setup Time | Recommendation |
|----------|-------------|-----------|---------|------------|----------------|
| **Dojah** ★ | ₦100-150 | REST, great docs | ✅ Free | 1 day | **Start here** |
| VerifyMe | ₦80-120 | REST, good docs | ✅ Free | 2 days | Good alternative |
| Mono | ₦100-200 | REST | ✅ Free | 1 day | Financial focus |
| Seamfix | Negotiable | Enterprise | On request | 1 week | At scale (1000+/month) |

---

### Resident CSV Upload Format

```csv
house_number,full_name,phone_number,email
A101,"John Adebayo","+2348012345678","john@email.com"
A102,"Mary Okafor","+2348023456789","mary@email.com"
B201,"Ahmed Musa","+2348034567890",""
B202,"Grace Eze","+2348045678901","grace.eze@gmail.com"
```

### CSV Validation Rules

| Field           | Rule                                                                    |
| -----------------| -------------------------------------------------------------------------|
| `house_number`  | Required, unique within estate, max 20 chars                            |
| `full_name`     | Required, min 3 chars, stripped of special characters                   |
| `phone_number`  | Required, Nigerian format (+234 or 0xxx), unique                        |
| `email`         | Optional, valid format if provided                                      |
| **File limits** | Max 5MB, max 2,000 rows, UTF-8 encoding                                 |
| **Security**    | Strip cells starting with `=`, `+`, `-`, `@` (CSV injection prevention) |

---

## PATH B: Resident Onboarding (Mobile + Web)

> This is how individual residents join their estate after it's been registered.

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Enter Estate ID                                        │
│  ────────────────────────                                        │
│  Screen: "Join Your Estate"                                      │
│  Input: [___]-[_____]  (masked input for PAR-7X3KM format)      │
│  Validation: Check estate exists, is active, subscription valid  │
│                                                                  │
│  STEP 2: Verification Check                                     │
│  ──────────────────────────                                      │
│  System checks if phone number is in resident CSV:               │
│  ├── FOUND → Tier 1 (pre-verified), proceed to step 3           │
│  └── NOT FOUND → Tier 4 (self-registered), additional info:     │
│      ├── House Number *                                          │
│      ├── Full Name *                                             │
│      ├── Selfie (optional but recommended)                       │
│      └── Proceed to step 3, but with limited access              │
│                                                                  │
│  STEP 3: Phone Verification                                     │
│  ───────────────────────────                                     │
│  Enter phone number → Receive OTP via SMS → Enter OTP            │
│  (6-digit, expires in 5 minutes, max 3 retries)                  │
│  OTP provider: Termii (Nigerian SMS gateway)                     │
│                                                                  │
│  STEP 4: Set PIN                                                │
│  ────────────────                                                │
│  Set 4-digit numeric PIN                                         │
│  Rules: No sequential (1234), no repeated (1111), not phone#     │
│  Confirm PIN (enter twice)                                       │
│                                                                  │
│  STEP 5: Profile Setup                                          │
│  ──────────────────                                              │
│  ├── Profile photo (optional → Cloudinary)                       │
│  ├── Email (optional)                                            │
│  └── Confirm house number (if pre-verified, pre-filled)          │
│                                                                  │
│  STEP 6: Biometric Setup (Mobile Only, Optional)                │
│  ────────────────────────────────────────────────                │
│  "Enable Face ID / Fingerprint for quick access?"                │
│  [Enable] [Skip]                                                 │
│                                                                  │
│  RESULT:                                                         │
│  ├── User created in tenant schema (est_bvd7x3km.users)          │
│  ├── JWT access token (15 min) + refresh token (7 days)          │
│  ├── Verification tier assigned (1, 2, 3, or 4)                  │
│  ├── Access level based on tier (see page 06)                    │
│  └── Welcome notification sent                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Admin Login (Separate from Resident)

Admin officers log in differently — they use email + password (not phone + OTP):

```
Admin Login (Web):
├── Enter Estate ID: BVD-7X3KM
├── Enter Email: [EMAIL_ADDRESS]
├── Enter Password: ••••••••••
├── 2FA: OTP sent to phone (for security)
└── Access: Full admin dashboard
```

---

### What Happens After Registration

```
AFTER ESTATE REGISTRATION:
├── Officers share Estate ID via WhatsApp, notice board, estate meetings
├── Residents download app → enter Estate ID → onboard themselves
├── Admin dashboard shows real-time onboarding progress:
│   ├── "45 of 120 residents registered" (if CSV uploaded)
│   └── "12 pending verification requests" (if no CSV)
└── Billing starts after 14-day trial
```

---

[← Previous: Estate ID](./04-estate-id-generation.md) | [Back to Index](./README.md) | [Next: Resident Verification →](./06-resident-verification.md)
