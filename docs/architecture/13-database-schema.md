# 13 — Database Schema Design

[← Previous: Mobile](./12-react-native-mobile.md) | 

---

## Schema Overview

```
PostgreSQL Database: paradise_estate
│
├── public schema ──── Global, cross-tenant data
│   ├── estates
│   ├── firms
│   ├── estate_officers
│   ├── firm_admins
│   ├── subscriptions
│   └── platform_audit_log
│
└── est_xxx schema ─── Per-tenant data (one per estate)
    ├── users
    ├── residents (pre-loaded CSV data)
    ├── staff
    ├── member_permissions
    ├── verification_requests
    ├── verification_vouches
    ├── bills
    ├── resident_bills
    ├── payments
    ├── visitor_codes
    ├── visitors (visit history)
    ├── notifications
    ├── expenses
    ├── expense_items
    ├── expense_approvals
    ├── invoices
    ├── invoice_items
    ├── invoice_payments
    ├── chat_messages
    ├── activity_logs
    ├── support_tickets
    └── status_history
```

---

## Public Schema Tables

### `public.estates`

```sql
CREATE TABLE public.estates (
    id              VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    estate_code     VARCHAR(10) UNIQUE NOT NULL,     -- "PAR-7X3KM"
    schema_name     VARCHAR(20) UNIQUE NOT NULL,     -- "est_par7x3km"
    name            VARCHAR(200) NOT NULL,
    address         TEXT NOT NULL,
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'Nigeria',
    logo_url        VARCHAR(500),                    -- Cloudinary
    house_count_tier VARCHAR(20),                    -- "<10", "<20", "<50", "<100", "100+"
    firm_id         VARCHAR REFERENCES public.firms(id),
    status          VARCHAR(20) DEFAULT 'active',    -- active, construction, suspended, deleted
    subscription_id VARCHAR,
    created_at      TIMESTAMP DEFAULT now(),
    updated_at      TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_estates_code ON public.estates(estate_code);
CREATE INDEX idx_estates_firm ON public.estates(firm_id);
CREATE INDEX idx_estates_status ON public.estates(status);
```

### `public.firms`

```sql
CREATE TABLE public.firms (
    id                      VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    firm_code               VARCHAR(10) UNIQUE NOT NULL,     -- "FRM-8K4WN"
    company_name            VARCHAR(200) NOT NULL,
    cac_number              VARCHAR(50),
    address                 TEXT,
    logo_url                VARCHAR(500),
    website                 VARCHAR(200),
    primary_contact_name    VARCHAR(100),
    primary_contact_phone   VARCHAR(20),
    primary_contact_email   VARCHAR(100),
    nin_verified            BOOLEAN DEFAULT false,
    is_active               BOOLEAN DEFAULT true,
    created_at              TIMESTAMP DEFAULT now(),
    updated_at              TIMESTAMP DEFAULT now()
);
```

### `public.estate_officers`

```sql
CREATE TABLE public.estate_officers (
    id              VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    estate_id       VARCHAR NOT NULL REFERENCES public.estates(id),
    full_name       VARCHAR(100) NOT NULL,
    phone_number    VARCHAR(20) NOT NULL,
    email           VARCHAR(100) NOT NULL,
    role_title      VARCHAR(100) NOT NULL,            -- "Chairman", "Secretary", etc.
    id_type         VARCHAR(20) NOT NULL,              -- "nin", "drivers_license"
    id_number_hash  VARCHAR(255) NOT NULL,             -- bcrypt hash (NOT plaintext!)
    id_verified     BOOLEAN DEFAULT false,
    verification_response JSONB,                       -- Redacted API response
    photo_url       VARCHAR(500),                      -- Cloudinary
    is_current_tenure BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT now(),
    updated_at      TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_officers_estate ON public.estate_officers(estate_id);
```

### `public.subscriptions`

```sql
CREATE TABLE public.subscriptions (
    id              VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    entity_type     VARCHAR(20) NOT NULL,             -- 'estate' or 'firm'
    entity_id       VARCHAR NOT NULL,                 -- estate_id or firm_id
    plan            VARCHAR(50) NOT NULL,              -- 'trial', 'basic', 'premium'
    status          VARCHAR(20) DEFAULT 'trial',      -- trial, active, expired, cancelled
    trial_ends_at   TIMESTAMP,
    started_at      TIMESTAMP,
    expires_at      TIMESTAMP,
    paystack_subscription_code VARCHAR(100),
    paystack_customer_code VARCHAR(100),
    amount_ngn      FLOAT,
    billing_cycle   VARCHAR(20) DEFAULT 'monthly',
    created_at      TIMESTAMP DEFAULT now(),
    updated_at      TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_subs_entity ON public.subscriptions(entity_type, entity_id);
```

---

## Tenant Schema Tables (Per Estate)

### `users` (Expanded from Current)

```sql
-- Changes from current model:
-- + pin_hash (4-digit PIN, bcrypt hashed)
-- + verification_tier (pre_verified, admin_approved, vouched, self_registered)
-- + primary_holder_id (NULL = primary, <id> = managed member)
-- + connection_type (family, tenant, domestic_staff, caretaker)
-- + slot_number (1-8 within household)

CREATE TABLE users (
    id                  VARCHAR PRIMARY KEY,
    phone_number        VARCHAR(20) UNIQUE NOT NULL,
    full_name           VARCHAR(100),
    email               VARCHAR(100),
    gender              VARCHAR(10),
    house_number        VARCHAR(50),
    role                VARCHAR(20) NOT NULL DEFAULT 'resident',
    pin_hash            VARCHAR(255),              -- NEW: bcrypt of 4-digit PIN
    password_hash       VARCHAR(255),              -- For admin web login
    profile_image       VARCHAR(500),              -- Cloudinary URL
    
    -- Verification
    verification_tier   VARCHAR(20) DEFAULT 'self_registered',
    -- 'pre_verified', 'admin_approved', 'vouched', 'self_registered'
    
    -- Family tree
    primary_holder_id   VARCHAR REFERENCES users(id),  -- NULL = primary
    connection_type     VARCHAR(20),                    -- family, tenant, etc.
    slot_number         INTEGER,                        -- 1-8
    
    -- Status
    is_active           BOOLEAN DEFAULT true,
    last_login          TIMESTAMP,
    pin_attempts        INTEGER DEFAULT 0,
    pin_locked_until    TIMESTAMP,
    
    created_at          TIMESTAMP DEFAULT now(),
    updated_at          TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_house ON users(house_number);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_primary ON users(primary_holder_id);
CREATE INDEX idx_users_tier ON users(verification_tier);
```

### `member_permissions`

```sql
CREATE TABLE member_permissions (
    id              VARCHAR PRIMARY KEY,
    user_id         VARCHAR UNIQUE NOT NULL REFERENCES users(id),
    permissions     JSONB NOT NULL DEFAULT '[]',
    -- ["pay_bills", "create_visitor_code", "community_chat", ...]
    granted_by      VARCHAR NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT now(),
    updated_at      TIMESTAMP DEFAULT now()
);
```

### `verification_requests`

```sql
CREATE TABLE verification_requests (
    id              VARCHAR PRIMARY KEY,
    user_id         VARCHAR NOT NULL REFERENCES users(id),
    house_number    VARCHAR(50) NOT NULL,
    tier            VARCHAR(20) NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending',
    -- pending, approved, rejected, suspended, expired
    selfie_url      VARCHAR(500),
    rejection_reason TEXT,
    reviewed_by     VARCHAR REFERENCES users(id),
    reviewed_at     TIMESTAMP,
    expires_at      TIMESTAMP,              -- 14-day auto-suspend
    created_at      TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_verif_status ON verification_requests(status);
CREATE INDEX idx_verif_user ON verification_requests(user_id);
```

### `verification_vouches`

```sql
CREATE TABLE verification_vouches (
    id              VARCHAR PRIMARY KEY,
    request_id      VARCHAR NOT NULL REFERENCES verification_requests(id),
    voucher_user_id VARCHAR NOT NULL REFERENCES users(id),
    voucher_tier    VARCHAR(20) NOT NULL,
    vouch_type      VARCHAR(20) NOT NULL,   -- neighbor, security_guard, landlord
    is_withdrawn    BOOLEAN DEFAULT false,
    created_at      TIMESTAMP DEFAULT now(),
    
    UNIQUE (request_id, voucher_user_id)
);
```

### `chat_messages`

```sql
CREATE TABLE chat_messages (
    id              VARCHAR PRIMARY KEY,
    user_id         VARCHAR NOT NULL REFERENCES users(id),
    message         TEXT NOT NULL,
    message_type    VARCHAR(20) DEFAULT 'text',   -- text, image, system
    media_url       VARCHAR(500),                 -- Cloudinary URL
    is_announcement BOOLEAN DEFAULT false,
    is_pinned       BOOLEAN DEFAULT false,
    created_at      TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_chat_created ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_announcement ON chat_messages(is_announcement) WHERE is_announcement = true;
```

### `activity_logs`

```sql
CREATE TABLE activity_logs (
    id                  VARCHAR PRIMARY KEY,
    user_id             VARCHAR NOT NULL REFERENCES users(id),
    primary_holder_id   VARCHAR REFERENCES users(id),  -- if managed member
    action              VARCHAR(100) NOT NULL,
    resource_type       VARCHAR(50),
    resource_id         VARCHAR,
    details             JSONB,
    ip_address          VARCHAR(45),
    device_info         VARCHAR(200),
    created_at          TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);
-- Immutable: No UPDATE or DELETE operations on this table
```

---

## Migration from Current Schema

The existing tables (`bills`, `payments`, `visitor_codes`, `visitors`, `notifications`, `expenses`, `expense_items`, `expense_approvals`, `invoices`, `support_tickets`, `status_history`, `otp`) remain largely unchanged. They get moved into the tenant schema and gain an `estate_id` during migration.

### Key Changes to Existing Tables

| Table | Change | Why |
|-------|--------|-----|
| `users` | Add `pin_hash`, `verification_tier`, `primary_holder_id` | New auth + family tree |
| `users` | Add `slot_number`, `connection_type`, `gender` | Household management |
| `users` | Add `pin_attempts`, `pin_locked_until` | PIN lockout tracking |
| `estate` | Move to `public.estates` with `estate_code` + `schema_name` | Multi-tenant registry |
| `residents` | Keep as-is (pre-loaded CSV data) | Tier 1 verification lookup |
| `staff` | Keep as-is | Security guard role for gate verification |

---

[← Previous: Mobile](./12-react-native-mobile.md) | [Back to Index](./README.md) | 
