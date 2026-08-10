# 🏢 Rezzident Platform — V1 Architecture Blueprint

> **Complete System design: Registration, Multi-Tenancy, Security & Deployment**

---

## 📖 Document Navigation

This architecture blueprint is split into individual pages for easy reading and team presentation. Each page is self-contained and can be shared independently.

| #   | Page                                                                       | Summary                                                             |
| -----| ----------------------------------------------------------------------------| ---------------------------------------------------------------------|
|     | **V1 SYSTEM DESIGN**                                                       |                                                                     |
| 01  | [Infrastructure & Deployment Decisions](./01-infrastructure-deployment.md) | Locked decisions, deployment architecture diagram, service topology |
| 03  | [Multi-Tenant Architecture](./03-multi-tenant-architecture.md)             | Schema-per-tenant with SQLAlchemy, Alembic migration strategy       |
| 04  | [Estate ID Generation](./04-estate-id-generation.md)                       | Algorithm, security analysis, UX for Nigerian verbal sharing        |
| 05  | [Registration & Onboarding](./05-registration-onboarding.md)               | Estate admin, resident, and firm registration flows                 |
| 06  | [Resident Verification](./06-resident-verification.md)                     | 4-tier verification system, neighbor vouching, admin queue          |
| 07  | [Family Tree Access Model](./07-family-tree-access.md)                     | Household slots, managed members, permission system                 |
| 08  | [PIN & Biometric Auth](./08-pin-biometric-auth.md)                         | 4-layer auth, PIN rules, when each layer is required                |
| 10  | [Security Architecture](./10-security-architecture.md)                     | Nigeria-specific threat model, 4-layer security stack               |
| 11  | [TanStack Start Frontend](./11-tanstack-start-frontend.md)                 | Feature-based project structure, SSR strategy, FastAPI integration  |
| 12  | [React Native Mobile](./12-react-native-mobile.md)                         | Expo project structure, shared code strategy, monorepo              |
| 13  | [Database Schema Design](./13-database-schema.md)                          | Public schema, tenant schema, new tables for V1                     |
---

## 🔑 Key Decisions (Quick Reference)

| Decision              | Choice                                                                 |
| -----------------------| ------------------------------------------------------------------------|
| VPS Provider          | **Hetzner CX42** (16GB RAM, 8 vCPU, €15.49/mo)                         |
| Database              | **PostgreSQL in Docker** (self-managed)                                |
| Cache                 | **Redis in Docker** (Phase 1 — rate limiting, JWT blacklist, sessions) |
| Object Storage        | **MinIO** (documents) + **Cloudinary** (images)                        |
| Multi-tenancy         | **Schema-per-tenant** (20-200 estates)                                 |
| Frontend              | **TanStack Start** (SSR, type-safe, feature-based)                     |
| Mobile                | **React Native (Expo)** — parallel with web                            |
| Identity Verification | **Dojah API** (NIN/Driver's License)                                   |
| Payment Gateway       | **Paystack** (existing)                                                |
| Security Middleware   | **fastapi-guard** (attack detection, IP banning)                       |
| SSL                   | **Nginx + Let's Encrypt** (auto-renewal)                               |
| CI/CD                 | **GitHub Actions → Docker → VPS**                                      |

---

## 👥 Target Audience

- **Engineering Team** — Technical implementation details
- **Product Managers** — Feature scope and user flows
- **Stakeholders** — Architecture decisions and cost analysis
- **DevOps** — Infrastructure and deployment specifics

---

## 📊 System Context

```
Actors:
├── Estate Admin (Chairman, Secretary, Treasurer)
│   └── Web only for registration, web + mobile for management
├── Resident (Primary Account Holder)
│   └── Mobile primary, web secondary
├── Managed Member (Family, Tenant, Domestic Staff)
│   └── Mobile primary, web secondary
├── Security Guard
│   └── Mobile primary, web secondary (gate verification)
├── Real Estate Firm (Portfolio Manager)
│   └── Web only (portfolio dashboard)
└── Platform Super Admin
    └── Web only (cross-tenant management)
```

---

*Last Updated: July 17, 2026*  