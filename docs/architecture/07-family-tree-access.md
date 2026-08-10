# 07 — Family Tree Access Model

[← Previous: Verification](./06-resident-verification.md) | [Back to Index](./README.md) | [Next: PIN & Biometric Auth →](./08-pin-biometric-auth.md)

---

## The Concept

Each verified resident is a **Primary Account Holder**. They get 3 slots (including themselves) to add family members, tenants, or domestic staff who get controlled access to the app.

Think of it like a family phone plan — one person is the account owner, and they can add lines with different permissions.

---

## Household Structure

```
┌─────────────────────────────────────────────────────────────┐
│          PRIMARY ACCOUNT HOLDER (Slot 1 of 3)                │
│          "John Adebayo" — House A101                         │
│          Role: Resident (Tier 1: Pre-Verified)               │
│          Powers: FULL ACCESS                                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  MANAGED MEMBER (Slot 2 of 3) — FREE                │    │
│  │  "Sarah Adebayo" — Wife                              │    │
│  │  Connection: Family                                  │    │
│  │  Phone: +234805...                                   │    │
│  │  Permissions:                                        │    │
│  │    ☑ Pay Bills  ☑ Visitor Codes  ☑ Community Chat    │    │
│  │    ☑ View Bills  ☐ View Expenses  ☐ Report Issues    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  MANAGED MEMBER (Slot 3 of 3) — FREE                │    │
│  │  "David Adebayo" — Son (18+)                         │    │
│  │  Connection: Family                                  │    │
│  │  Phone: +234806...                                   │    │
│  │  Permissions:                                        │    │
│  │    ☐ Pay Bills  ☑ Visitor Codes  ☑ Community Chat    │    │
│  │    ☑ View Bills  ☐ View Expenses  ☐ Report Issues    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🔒 PAID SLOT (Slot 4) — ₦500/month                  │    │
│  │  "Grace Okoro" — Domestic Staff                       │    │
│  │  Connection: Domestic Staff                          │    │
│  │  Permissions:                                        │    │
│  │    ☐ Pay Bills  ☑ Visitor Codes  ☐ Community Chat    │    │
│  │    ☐ View Bills  ☐ View Expenses  ☐ Report Issues    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  [+ Add Member]  (Slot 5-8 available for ₦500)  │
└─────────────────────────────────────────────────────────────┘
```

---

## Slot Rules

| Rule                                    | Value                                                  |
| -----------------------------------------| --------------------------------------------------------|
| **Free slots per household**            | 3 (including the primary holder)                       |
| **Max paid additional slots**           | 5 (total max: 8 per household)                         |
| **Paid slot price**                     | ₦500 (configurable per estate)                         |
| **Who can add members**                 | Primary Account Holder only                            |
| **Who can remove members**              | Primary Account Holder only                            |
| **How managed members authenticate**    | Phone OTP → Set PIN (same as everyone)                 |
| **Can a managed member become primary** | Yes — admin can "promote" if the primary holder leaves |

---

## Connection Types

| Type | Description | Default Permissions | Nigerian Context |
|------|-------------|-------------------|-----------------|
| **Family** | Spouse, children (18+), siblings | Most permissions | "My wife also needs to schedule visitors" |
| **Tenant** | Person renting the property | View bills, visitor codes, chat | Owner adds their tenant to the system |
| **Domestic Staff** | Driver, cook, nanny, cleaner | Visitor codes only | "My driver needs to let delivery people in" |
| **Caretaker** | Property manager, agent | View bills, visitor codes, report issues | When owner lives elsewhere, caretaker manages |

---

## Permission System

### Available Permissions

| Permission | Code | What It Allows |
|-----------|------|---------------|
| Pay Bills | `pay_bills` | Make payments via Paystack |
| View Bills | `view_bills` | See bill list and amounts |
| Create Visitor Codes | `create_visitor_code` | Schedule and generate visitor access codes |
| View Visitor Codes | `view_visitor_codes` | See existing visitor codes |
| Community Chat | `community_chat` | Send messages in estate community group |
| View Announcements | `view_announcements` | See estate-wide announcements |
| Report Issues | `report_issues` | Submit maintenance/complaint tickets |
| View Expenses | `view_expenses` | See estate expense reports |

### Default Permission Sets

When a primary holder adds a member, permissions are pre-filled based on the connection type. The primary holder can then customize:

```python
DEFAULT_PERMISSIONS = {
    "family": [
        "pay_bills", "view_bills", "create_visitor_code",
        "view_visitor_codes", "community_chat", 
        "view_announcements", "report_issues"
    ],
    "tenant": [
        "view_bills", "create_visitor_code", 
        "view_visitor_codes", "community_chat", 
        "view_announcements"
    ],
    "domestic_staff": [
        "create_visitor_code", "view_visitor_codes", 
        "view_announcements"
    ],
    "caretaker": [
        "view_bills", "create_visitor_code", 
        "view_visitor_codes", "view_announcements", 
        "report_issues"
    ],
}
```

---

## Adding a Managed Member — Flow

```
Primary Holder → App → "My Household" → [+ Add Member]
        │
Enter member details:
        ├── Full Name *          "Sarah Adebayo"
        ├── Gender *             [Female]
        ├── Phone Number *       +2348051234567
        ├── Connection *         [Family ▼]
        └── Permissions          [Pre-filled, editable checkboxes]
        │
        ▼
System checks:
        ├── Is phone number already registered in this estate? → Error
        ├── Is this a free slot (slot ≤ 3) or paid (slot > 3)? 
        │   └── If paid: "Adding this member costs ₦500. [Continue] [Cancel]"
        └── Valid phone format? → Proceed
        │
        ▼
System sends SMS to member:
  "Hi Sarah! John Adebayo has added you to BvD Estate app.
   Download: https://bvd.app/download
   Your Estate Code: BVD-7X3KM"
        │
        ▼
Member opens app:
  1. Enter Estate Code: BVD-7X3KM
  2. Enter phone number: +2348051234567
  3. System: "You've been invited by John Adebayo (House A101)"
  4. OTP sent → verify
  5. Set 4-digit PIN
  6. Optional: Enable biometric
  7. ✅ Access granted with assigned permissions
```

---

## Activity Tracking

Every action by every user — primary or managed — is logged with full accountability:

```
Activity Log Example:

2026-07-17 14:23  Sarah Adebayo (managed by John Adebayo)
                  Created visitor code for "Delivery - Jumia"
                  Code: VIS-4839  |  Valid: 2:00 PM - 5:00 PM
                  IP: 102.89.x.x  |  Device: iPhone 14

2026-07-17 15:01  John Adebayo (primary holder)
                  Paid electricity bill: ₦45,000
                  Bill: BILL-2026-00234  |  Paystack ref: PAY_xxx
                  IP: 102.89.x.x  |  Device: Samsung S24

2026-07-17 15:30  Grace Okoro (managed by John Adebayo)  
                  Created visitor code for "Plumber - Oga Segun"
                  Code: VIS-4840  |  Valid: 4:00 PM - 6:00 PM
```

This means every action is traceable to the **individual person**, even within the same household. The primary holder can also see all activity from their managed members in the "My Household" section.

---

## Billing for Extra Slots

| Slots                   | Cost        | Example                       |
| -------------------------| -------------| -------------------------------|
| 1-3 (including primary) | **Free**    | John + wife + son             |
| Slot 4                  | ₦500        | Add domestic staff            |
| Slot 5                  | ₦500        | Add another family member     |
| Slots 6-8               | ₦500 each   | Large households              |
| **Maximum**             | **8 total** | ₦2,500 for max (5 paid slots) |


---

## Database Tables

```sql
-- Users table (expanded)
-- primary_holder_id = NULL means this is a primary account
-- primary_holder_id = <user_id> means this is a managed member

ALTER TABLE users ADD COLUMN primary_holder_id VARCHAR REFERENCES users(id);
ALTER TABLE users ADD COLUMN connection_type VARCHAR(20);  
-- 'family', 'tenant', 'domestic_staff', 'caretaker'
ALTER TABLE users ADD COLUMN slot_number INTEGER;  -- 1-8

-- Separate permissions table for managed members
CREATE TABLE member_permissions (
    id              VARCHAR PRIMARY KEY,
    user_id         VARCHAR REFERENCES users(id) UNIQUE,
    permissions     JSONB NOT NULL,
    -- ["pay_bills", "create_visitor_code", "community_chat"]
    granted_by      VARCHAR REFERENCES users(id),  -- primary holder
    created_at      TIMESTAMP DEFAULT now(),
    updated_at      TIMESTAMP DEFAULT now()
);
```

---

[← Previous: Verification](./06-resident-verification.md) | [Back to Index](./README.md) | [Next: PIN & Biometric Auth →](./08-pin-biometric-auth.md)
