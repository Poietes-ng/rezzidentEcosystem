import json

# Define the models dataset with precise schemas, domain groupings, colors, and layout column positions.

MODELS = [
    # ── PUBLIC CORE DOMAIN (#38bdf8 - Cyan) ──
    {
        "id": "Estate",
        "table": "estates",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "name", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "estate_code", "type": "VARCHAR(10)", "isPk": False, "isFk": False},
            {"name": "address", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "state", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "local_government", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "gps_latitude", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "gps_longitude", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "estate_photo_url", "type": "VARCHAR(500)", "isPk": False, "isFk": False},
            {"name": "logo_url", "type": "VARCHAR(500)", "isPk": False, "isFk": False},
            {"name": "management_type", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "structure_template_id", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "structure_definition", "type": "JSONB", "isPk": False, "isFk": False},
            {"name": "is_custom_structure", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "has_structure", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "actual_house_count", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "subscription_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Subscription.id"},
            {"name": "status", "type": "ENUM(EstateStatus)", "isPk": False, "isFk": False},
            {"name": "current_onboarding_step", "type": "ENUM", "isPk": False, "isFk": False},
            {"name": "stakeholder_email_sent", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "settlement_bank_code", "type": "VARCHAR(10)", "isPk": False, "isFk": False},
            {"name": "settlement_account_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "settlement_account_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "paystack_subaccount_code", "type": "VARCHAR(50)", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Stakeholder",
        "table": "stakeholders",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "estate_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Estate.id"},
            {"name": "full_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "email", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "phone_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "nin_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "nin_verified", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "is_primary_contact", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "has_panel_access", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "role_title", "type": "VARCHAR(50)", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "HouseEntity",
        "table": "house_entities",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "estate_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Estate.id"},
            {"name": "house_code", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "address_components", "type": "JSONB", "isPk": False, "isFk": False},
            {"name": "full_address_formatted", "type": "VARCHAR(255)", "isPk": False, "isFk": False},
            {"name": "occupant_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "status", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "house_type", "type": "VARCHAR(50)", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "EstateStructureTemplate",
        "table": "estate_structure_templates",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "template_id", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "description", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "category", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "levels", "type": "JSONB", "isPk": False, "isFk": False},
            {"name": "address_format", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "is_active", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Subscription",
        "table": "subscriptions",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "plan_name", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "price", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "billing_cycle", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "features", "type": "JSONB", "isPk": False, "isFk": False},
            {"name": "max_houses", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "max_staff", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "paystack_plan_code", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "status", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "auto_renew", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "cancelled_at", "type": "TIMESTAMP", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "PlatformUser",
        "table": "platform_users",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "email", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "password_hash", "type": "VARCHAR(255)", "isPk": False, "isFk": False},
            {"name": "full_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "phone_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "role", "type": "VARCHAR(30)", "isPk": False, "isFk": False},
            {"name": "permissions", "type": "JSONB", "isPk": False, "isFk": False},
            {"name": "is_active", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "last_login_at", "type": "TIMESTAMP", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "PlatformAuditLog",
        "table": "platform_audit_logs",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "actor_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "PlatformUser.id"},
            {"name": "action", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "target_type", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "target_id", "type": "VARCHAR", "isPk": False, "isFk": False},
            {"name": "description", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "ip_address", "type": "VARCHAR(45)", "isPk": False, "isFk": False},
            {"name": "user_agent", "type": "VARCHAR(500)", "isPk": False, "isFk": False},
            {"name": "metadata", "type": "JSONB", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Firm",
        "table": "firms",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "firm_code", "type": "VARCHAR(10)", "isPk": False, "isFk": False},
            {"name": "company_name", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "cac_number", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "address", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "primary_contact_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "primary_contact_email", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "nin_verified", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "is_active", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "FirmAdmin",
        "table": "firm_admins",
        "schema": "Public Schema",
        "domain": "Public Core",
        "color": "#38bdf8",
        "colIdx": 0,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "firm_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Firm.id"},
            {"name": "email", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "full_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "phone_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "designated_estate_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Estate.id"},
            {"name": "is_primary_contact", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "is_active", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },

    # ── IDENTITY & RESIDENCE DOMAIN (#818cf8 - Indigo) ──
    {
        "id": "User",
        "table": "users",
        "schema": "Tenant Schema",
        "domain": "Identity & Residence",
        "color": "#818cf8",
        "colIdx": 1,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "phone_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "email", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "password_hash", "type": "VARCHAR(255)", "isPk": False, "isFk": False},
            {"name": "pin_hash", "type": "VARCHAR(255)", "isPk": False, "isFk": False},
            {"name": "full_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "profile_photo_url", "type": "VARCHAR(500)", "isPk": False, "isFk": False},
            {"name": "facial_bio_photo_url", "type": "VARCHAR(500)", "isPk": False, "isFk": False},
            {"name": "role", "type": "ENUM(UserRole)", "isPk": False, "isFk": False},
            {"name": "verification_tier", "type": "ENUM(VerificationTier)", "isPk": False, "isFk": False},
            {"name": "is_active", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "is_verified", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "house_number", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "street_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "estate_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "nin_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "nin_verified", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "connection_type", "type": "ENUM(ConnectionType)", "isPk": False, "isFk": False},
            {"name": "current_family_head_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"}
        ]
    },
    {
        "id": "OTP",
        "table": "otps",
        "schema": "Tenant Schema",
        "domain": "Identity & Residence",
        "color": "#818cf8",
        "colIdx": 1,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "phone_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "code", "type": "VARCHAR(6)", "isPk": False, "isFk": False},
            {"name": "purpose", "type": "ENUM(OTPPurpose)", "isPk": False, "isFk": False},
            {"name": "expires_at", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "is_used", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "attempts", "type": "INTEGER", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Resident",
        "table": "residents",
        "schema": "Tenant Schema",
        "domain": "Identity & Residence",
        "color": "#818cf8",
        "colIdx": 1,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "house_entity_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "HouseEntity.id"},
            {"name": "resident_type", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "move_in_date", "type": "DATE", "isPk": False, "isFk": False},
            {"name": "emergency_contact_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "emergency_contact_phone", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "is_active", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Staff",
        "table": "staff",
        "schema": "Tenant Schema",
        "domain": "Identity & Residence",
        "color": "#818cf8",
        "colIdx": 1,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "role_title", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "department", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "access_level", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "is_active", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },

    # ── VERIFICATION & SOCIAL DOMAIN (#a78bfa - Purple) ──
    {
        "id": "MemberPermission",
        "table": "member_permissions",
        "schema": "Tenant Schema",
        "domain": "Verification & Social",
        "color": "#a78bfa",
        "colIdx": 2,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "can_generate_visitor_codes", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "can_view_financials", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "can_vote", "type": "BOOLEAN", "isPk": False, "isFk": False},
            {"name": "can_raise_panic", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "VerificationRequest",
        "table": "verification_requests",
        "schema": "Tenant Schema",
        "domain": "Verification & Social",
        "color": "#a78bfa",
        "colIdx": 2,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "status", "type": "ENUM(VerificationStatus)", "isPk": False, "isFk": False},
            {"name": "tier_requested", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "verified_by_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "review_notes", "type": "TEXT", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "VerificationVouch",
        "table": "verification_vouches",
        "schema": "Tenant Schema",
        "domain": "Verification & Social",
        "color": "#a78bfa",
        "colIdx": 2,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "request_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "VerificationRequest.id"},
            {"name": "voucher_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "status", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "comment", "type": "TEXT", "isPk": False, "isFk": False}
        ]
    },

    # ── GATE ACCESS DOMAIN (#34d399 - Emerald) ──
    {
        "id": "VisitorCode",
        "table": "visitor_codes",
        "schema": "Tenant Schema",
        "domain": "Gate Access",
        "color": "#34d399",
        "colIdx": 3,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "code", "type": "VARCHAR(10)", "isPk": False, "isFk": False},
            {"name": "visitor_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "visitor_phone", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "vehicle_number", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "entry_type", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "valid_from", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "valid_until", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "max_uses", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "current_uses", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "is_active", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Visitor",
        "table": "visitors",
        "schema": "Tenant Schema",
        "domain": "Gate Access",
        "color": "#34d399",
        "colIdx": 3,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "code_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "VisitorCode.id"},
            {"name": "visitor_name", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "check_in_time", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "check_out_time", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "security_guard_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "gate_entry_point", "type": "VARCHAR(50)", "isPk": False, "isFk": False}
        ]
    },

    # ── FINANCIAL DUES DOMAIN (#f59e0b - Amber) ──
    {
        "id": "Bill",
        "table": "bills",
        "schema": "Tenant Schema",
        "domain": "Financial Dues",
        "color": "#f59e0b",
        "colIdx": 4,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "title", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "description", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "amount", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "due_date", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "status", "type": "ENUM(BillStatus)", "isPk": False, "isFk": False},
            {"name": "bill_type", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "total_expected", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "total_paid", "type": "INTEGER", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "ResidentBill",
        "table": "resident_bills",
        "schema": "Tenant Schema",
        "domain": "Financial Dues",
        "color": "#f59e0b",
        "colIdx": 4,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "bill_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Bill.id"},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "amount", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "status", "type": "ENUM(ResidentBillStatus)", "isPk": False, "isFk": False},
            {"name": "paid_at", "type": "TIMESTAMP", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Payment",
        "table": "payments",
        "schema": "Tenant Schema",
        "domain": "Financial Dues",
        "color": "#f59e0b",
        "colIdx": 4,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "bill_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Bill.id"},
            {"name": "amount", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "reference", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "paystack_reference", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "status", "type": "ENUM(PaymentStatus)", "isPk": False, "isFk": False},
            {"name": "channel", "type": "ENUM(PaymentChannel)", "isPk": False, "isFk": False},
            {"name": "paid_at", "type": "TIMESTAMP", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "PaymentLedger",
        "table": "payment_ledger",
        "schema": "Tenant Schema",
        "domain": "Financial Dues",
        "color": "#f59e0b",
        "colIdx": 4,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "estate_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Estate.id"},
            {"name": "bill_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Bill.id"},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "paystack_reference", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "gross_amount_kobo", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "paystack_fee_kobo", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "platform_fee_kobo", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "estate_settlement_kobo", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "settlement_status", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "reconciled", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },

    # ── GOVERNANCE & OPERATIONS DOMAIN (#ec4899 - Pink) ──
    {
        "id": "Expense",
        "table": "expenses",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "title", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "category", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "total_amount", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "status", "type": "ENUM(ExpenseStatus)", "isPk": False, "isFk": False},
            {"name": "requested_by_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"}
        ]
    },
    {
        "id": "ExpenseItem",
        "table": "expense_items",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "expense_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Expense.id"},
            {"name": "description", "type": "VARCHAR(255)", "isPk": False, "isFk": False},
            {"name": "quantity", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "unit_price", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "total_price", "type": "FLOAT", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "ExpenseApproval",
        "table": "expense_approvals",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "expense_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Expense.id"},
            {"name": "approver_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "status", "type": "ENUM(ApprovalStatus)", "isPk": False, "isFk": False},
            {"name": "comment", "type": "TEXT", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Invoice",
        "table": "invoices",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "invoice_number", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "vendor_name", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "total_amount", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "status", "type": "ENUM(InvoiceStatus)", "isPk": False, "isFk": False},
            {"name": "created_by_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"}
        ]
    },
    {
        "id": "InvoiceItem",
        "table": "invoice_items",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "invoice_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Invoice.id"},
            {"name": "description", "type": "VARCHAR(255)", "isPk": False, "isFk": False},
            {"name": "quantity", "type": "INTEGER", "isPk": False, "isFk": False},
            {"name": "unit_price", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "line_total", "type": "FLOAT", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "InvoicePayment",
        "table": "invoice_payments",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "invoice_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Invoice.id"},
            {"name": "amount", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "payment_date", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "reference", "type": "VARCHAR(100)", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "PanicAlert",
        "table": "panic_alerts",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "panic_type", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "status", "type": "ENUM(PanicAlertStatus)", "isPk": False, "isFk": False},
            {"name": "latitude", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "longitude", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "resolved_by_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "resolved_at", "type": "TIMESTAMP", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Vote",
        "table": "votes",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "title", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "description", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "vote_type", "type": "ENUM(VoteType)", "isPk": False, "isFk": False},
            {"name": "status", "type": "ENUM(VoteStatus)", "isPk": False, "isFk": False},
            {"name": "options", "type": "JSONB", "isPk": False, "isFk": False},
            {"name": "start_time", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "end_time", "type": "TIMESTAMP", "isPk": False, "isFk": False},
            {"name": "created_by_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"}
        ]
    },
    {
        "id": "VoteBallot",
        "table": "vote_ballots",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "vote_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "Vote.id"},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "selected_option", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "cast_at", "type": "TIMESTAMP", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "Notification",
        "table": "notifications",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "title", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "message", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "notification_type", "type": "ENUM(NotificationType)", "isPk": False, "isFk": False},
            {"name": "is_read", "type": "BOOLEAN", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "ChatMessage",
        "table": "chat_messages",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "channel", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "message", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "message_type", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "reply_to_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "ChatMessage.id"}
        ]
    },
    {
        "id": "SupportTicket",
        "table": "support_tickets",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "subject", "type": "VARCHAR(200)", "isPk": False, "isFk": False},
            {"name": "category", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "priority", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "status", "type": "VARCHAR(20)", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "ActivityLog",
        "table": "activity_logs",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "user_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "activity_type", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "action", "type": "VARCHAR(100)", "isPk": False, "isFk": False},
            {"name": "description", "type": "TEXT", "isPk": False, "isFk": False},
            {"name": "target_type", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "target_id", "type": "VARCHAR", "isPk": False, "isFk": False},
            {"name": "ip_address", "type": "VARCHAR(45)", "isPk": False, "isFk": False},
            {"name": "user_agent", "type": "VARCHAR(500)", "isPk": False, "isFk": False},
            {"name": "metadata", "type": "JSONB", "isPk": False, "isFk": False},
            {"name": "severity", "type": "VARCHAR(10)", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "StatusHistory",
        "table": "status_histories",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "target_type", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "target_id", "type": "VARCHAR", "isPk": False, "isFk": False},
            {"name": "old_status", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "new_status", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "changed_by_id", "type": "VARCHAR", "isPk": False, "isFk": True, "fkTarget": "User.id"},
            {"name": "reason", "type": "TEXT", "isPk": False, "isFk": False}
        ]
    },
    {
        "id": "SystemHealthCheck",
        "table": "system_health_checks",
        "schema": "Tenant Schema",
        "domain": "Governance & Ops",
        "color": "#ec4899",
        "colIdx": 5,
        "columns": [
            {"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False},
            {"name": "component", "type": "VARCHAR(50)", "isPk": False, "isFk": False},
            {"name": "status", "type": "VARCHAR(20)", "isPk": False, "isFk": False},
            {"name": "latency_ms", "type": "FLOAT", "isPk": False, "isFk": False},
            {"name": "details", "type": "JSONB", "isPk": False, "isFk": False},
            {"name": "checked_at", "type": "TIMESTAMP", "isPk": False, "isFk": False}
        ]
    }
]

print(f"Total Models Configured: {len(MODELS)}")
