# 06 — Resident Verification: The Hard Problem

[← Previous: Registration](./05-registration-onboarding.md) | [Back to Index](./README.md) | [Next: Family Tree Access →](./07-family-tree-access.md)

---

## The Challenge

> _"How do we verify that someone is actually a resident of the estate if admins didn't upload a full resident list? Admins can't verify everybody. Some people might be renting, some might be owners. How do we solve this so onboarding can be seamless for residents and we can confirm whoever is trying to access the estate is a resident?"_

This is the hardest product problem in the system. A brute-force approach (everyone waits for admin approval) kills adoption. A trust-everyone approach (anyone with the estate code gets in) kills security. The solution is a **tiered trust system** with multiple verification paths.

---

## The 4-Tier Verification System

```
 TIER 1          TIER 2            TIER 3              TIER 4
 Pre-Verified    Admin-Approved    Neighbor-Vouched     Self-Registered
 ───────────     ──────────────    ────────────────     ─────────────────
 Highest Trust   High Trust        Medium Trust         Low Trust
 
 Phone in CSV  → Admin clicks    → 2 neighbors vouch → Waiting for
                  "Approve"         for you              verification
                  
 FULL ACCESS     FULL ACCESS       FULL ACCESS          LIMITED ACCESS
 immediately     after approval    after 2 vouches      (read-only)
```

---

### Tier 1: Pre-Verified (Highest Trust)

**How it works:**
- Admin uploaded a CSV with resident phone numbers during estate registration
- When resident enters their phone number during onboarding, the system finds a match
- Instant verification — no waiting, no admin action needed

**Access:** Full app features immediately

**Best for:** Estates where admin has a complete or near-complete resident list

```
Resident opens app → enters Estate ID → enters phone number
        │
System checks: SELECT * FROM residents WHERE phone_number = '+2348012345678'
        │
FOUND → ✅ Tier 1: Pre-Verified
        │
Continue to OTP → PIN → Full access
```

---

### Tier 2: Admin-Approved (High Trust)

**How it works:**
- Resident's phone number is NOT in the uploaded CSV
- Resident submits a verification request with their house number and name
- Request appears in the admin dashboard's verification queue
- An admin (Chairman, Secretary, or Treasurer) reviews and approves/rejects

**Access:** Account is locked until admin approves. Can see estate name and a "pending" status screen.

**Best for:** Residents who weren't on the original list — new tenants, renters, recently moved in.

```
Resident applies → request enters admin queue
        │
Admin Dashboard:
┌──────────────────────────────────────────────────────────────┐
│ 🟡 PENDING: John Smith                                       │
│    House: B204                                                │
│    Phone: +234801...                                          │
│    Applied: 2 hours ago                                       │
│    Selfie: [View Photo]                                       │
│                                                              │
│    [✅ Approve]  [❌ Reject]  [💬 Ask for more info]          │
└──────────────────────────────────────────────────────────────┘
        │
Admin clicks "Approve" → User upgraded to Tier 2 → Full access
```

---

### Tier 3: Neighbor-Vouched (Medium Trust)

**How it works:**
- Resident applies, no CSV match, admin hasn't reviewed yet (or admin queue is overwhelmed)
- The system enables a **peer vouching** mechanism
- Any Tier 1 or Tier 2 verified resident can vouch for the applicant
- **2 vouches from different households = automatic upgrade to Tier 3 (full access)**
- A security guard at the gate can also vouch (counts as 1 vouch)

**Access:** Read-only (view announcements only) until 2 vouches are received

**Why this works in Nigeria:**
- Nigerian estates are tight-knit communities — everyone knows their neighbors
- Rather than overloading the admin, let the community self-verify
- Security guards see residents daily — their vouch is valuable
- Reduces admin workload while maintaining trust

```
Unverified resident → app shows "Ask a neighbor to vouch for you"
        │
Verified neighbor opens their app → "Verification Requests" section
        │
Sees: "John Smith (House B204) is requesting verification"
      "Do you confirm this person lives in this estate?"
      [✅ Yes, I confirm]  [❌ I don't know this person]
        │
2 confirmations from different houses → ✅ Auto-upgraded to Tier 3
```

### Vouch Rules

| Rule | Value |
|------|-------|
| Minimum vouches for auto-upgrade | 2 |
| Vouchers must be from different house numbers | Yes (prevents collusion within one household) |
| Voucher minimum tier | Tier 1 or Tier 2 only (no Tier 3 vouching for Tier 4) |
| Security guard vouch | Counts as 1 vouch (same weight as neighbor) |
| Landlord vouch for tenant | Counts as 1 vouch + auto-links them as household |
| Can withdraw a vouch | Yes, within 24 hours |
| False vouching consequences | Account flagged, 3 false vouches = suspension |

---

### Tier 4: Self-Registered (Low Trust, Observation Period)

**How it works:**
- No CSV match, no admin approval, no vouches yet
- Resident provided their house number, name, and optionally a selfie
- Account enters a **7-day observation period**
- After 7 days, a reminder is sent to admin to review
- After **14 days unverified**, account is automatically suspended

**Access:** Can ONLY view estate announcements (read-only). Cannot create visitor codes, pay bills, or use community chat.

```
Day 0:  Self-registered → Limited access (announcements only)
Day 3:  System: "Tap here to ask neighbors to vouch for you"
Day 7:  Reminder sent to admin: "12 residents still unverified"
Day 10: Nudge to resident: "Ask your neighbor to verify you"
Day 14: ⚠️ Account suspended if still unverified
        Admin notified: "5 accounts auto-suspended"
```

---

### Special: Gate Verification (Nigeria-Specific)

This is unique to the Nigerian context where manned security gates are standard.

```
Unverified Resident at Gate:
        │
Opens app → shows QR code with their verification request
        │
Security Guard scans QR with their app
        │
Guard sees: "John Smith claims to live in House B204"
            "Do you recognize this resident?"
            [✅ Confirm]  [❌ Deny]
        │
Guard confirms → counts as 1 vouch
Guard's vouch + 1 neighbor vouch = ✅ Full verification
```

---

## Verification Summary Table

| Tier | How Verified | Access Level | Time to Full Access |
|------|-------------|-------------|-------------------|
| **Tier 1** | Phone in CSV | Full | Instant |
| **Tier 2** | Admin manually approves | Full | Hours to 1 day |
| **Tier 3** | 2 neighbor/guard vouches | Full | Minutes to days |
| **Tier 4** | Self-registered, unverified | Read-only | Up to 14 days |

---

## Edge Cases

| Scenario | Solution |
|----------|----------|
| Admin uploads empty CSV → all residents are Tier 4 | Show admin a warning: "Upload a resident list to speed up onboarding" |
| Tenant (renter) not on owner's list | Owner/landlord (if Tier 1/2) can vouch as "landlord" type — counts as 1 vouch |
| Brand new estate, zero residents | First 3 officers are auto Tier 1. They vouch for early residents. |
| Person uses a friend's estate code to get in | They still need a valid house number. Admin verification queue will catch mismatches. |
| Same phone number tries to join two estates | Allowed — one person can be in multiple estates (e.g., owns properties in two estates) |
| Admin accidentally rejects a real resident | Resident can re-apply. Admin sees "Previously rejected" tag and reason. |

---

## Database Tables

```sql
-- In each tenant schema

CREATE TABLE verification_requests (
    id              VARCHAR PRIMARY KEY,
    user_id         VARCHAR REFERENCES users(id),
    house_number    VARCHAR(50) NOT NULL,
    tier            VARCHAR(20) NOT NULL,  
    -- 'pre_verified', 'admin_approved', 'vouched', 'self_registered'
    status          VARCHAR(20) DEFAULT 'pending',
    -- 'pending', 'approved', 'rejected', 'suspended', 'expired'
    selfie_url      VARCHAR(500),
    rejection_reason TEXT,
    reviewed_by     VARCHAR REFERENCES users(id),
    reviewed_at     TIMESTAMP,
    expires_at      TIMESTAMP,  -- 14-day auto-suspend
    created_at      TIMESTAMP DEFAULT now()
);

CREATE TABLE verification_vouches (
    id              VARCHAR PRIMARY KEY,
    request_id      VARCHAR REFERENCES verification_requests(id),
    voucher_user_id VARCHAR REFERENCES users(id),
    voucher_tier    VARCHAR(20) NOT NULL,  -- must be 'pre_verified' or 'admin_approved'
    vouch_type      VARCHAR(20) NOT NULL,  -- 'neighbor', 'security_guard', 'landlord'
    is_withdrawn    BOOLEAN DEFAULT false,
    created_at      TIMESTAMP DEFAULT now(),
    
    UNIQUE (request_id, voucher_user_id)  -- one vouch per person per request
);
```

---

[← Previous: Registration](./05-registration-onboarding.md) | [Back to Index](./README.md) | [Next: Family Tree Access →](./07-family-tree-access.md)
