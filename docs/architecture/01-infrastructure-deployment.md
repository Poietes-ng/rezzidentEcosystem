# 01 — Infrastructure & Deployment Decisions

[← Back to Index](./README.md) | [Next: Multi tenancy Architecture→](./03-multi-tenant-architecture.md)

---

## Locked Decisions Summary

These decisions have been finalized based on the project's requirements, scale (500-1000 users, 20-200 estates), and budget constraints.

| Decision       | Choice                                           | Rationale                                                                        |
| ----------------| --------------------------------------------------| ----------------------------------------------------------------------------------|
| Database       | PostgreSQL in Docker                             | Full control, no network latency, backup with `pg_dump` cron                     |
| Cache/Sessions | Redis in Docker (Phase 1)                        | Rate limiting, JWT blacklist, subscription cache, session store                  |
| Object Storage | MinIO (documents/receipts) + Cloudinary (images) | MinIO for cost control on bulk files, Cloudinary for image CDN + transformations |
| MinIO Instance | New instance for Paradise Estate                 | Clean separation from `media.rezzident.co`/ `rezzident` bucket                   |
| Multi-tenancy  | Schema-per-tenant                                | Moderate isolation for 20-200 estates, recommended for B2B SaaS                  |
| Frontend       | TanStack Start (start immediately)               | SSR, type-safe routing, feature-based architecture                               |
| Mobile         | React Native (Expo) — parallel with web          | Shared API client, simultaneous development                                      |
| Security fixes | Start immediately (Phase 0)                      | Critical vulnerabilities found in codebase audit                                 |
| Domain         | Namecheap domain → Nginx with Let's Encrypt      | SSL handled at reverse proxy layer                                               |
| VPS            | Hetzner (primary) / DigitalOcean (fallback)      | Best price-performance ratio for Nigerian SaaS                                   |

---

## Deployment Architecture

```
                                     ┌──────────────────┐
                                     │   App Stores     │
                                     │  (iOS / Play)    │
                                     └────────┬─────────┘
                                              │ 
                                     ┌────────▼─────────┐
                                     │ rezzident_MB App │
                                     │ (React Native)   │
                                     └────────┬─────────┘
                                              │ (API Calls)
                    ┌─────────────────────────▼────────────────────────────┐
                    │                   INTERNET                           │
                    └─────────────────────────┬────────────────────────────┘
                                              │
                              ┌───────────────▼───────────────┐
                              │    Cloudflare CDN (free tier)  │
                              │    DNS + DDoS protection       │
                              │    Static asset caching        │
                              └───────────────┬───────────────┘
                                              │
┌─────────────────────────────────────────────▼──────────────────────────────────────┐
│                         HETZNER VPS (CX42 — 16GB RAM, 8 vCPU)                      │
│                                                                                     │
│  ┌─────────────┐   ┌────────────────────────┐   ┌───────────────────────┐          │
│  │   Nginx     │──▶│  FastAPI Backend        │   │  TanStack Start FE   │          │
│  │   :80/:443  │   │  (Gunicorn + Uvicorn)   │   │  (Node.js SSR)       │          │
│  │   SSL       │──▶│  :8000                  │   │  :3000               │          │
│  │   Rate Lim  │   │  + fastapi-guard        │   │  (Nitro server)      │          │
│  └─────────────┘   │  + Redis sessions       │   └───────────────────────┘          │
│                    └──────────┬───────────────┘                                     │
│                               │                                                     │
│       ┌───────────────────────┼──────────────────────┐                             │
│       ▼                       ▼                      ▼                             │
│  ┌──────────┐         ┌──────────┐          ┌──────────────┐                       │
│  │PostgreSQL│         │  Redis   │          │    MinIO      │                       │
│  │  :5432   │         │  :6379   │          │  :9000/:9001  │                       │
│  │ schemas: │         │ rate-lim │          │  Buckets:     │                       │
│  │  public  │         │ JWT-blk  │          │  documents    │                       │
│  │  est_PAR │         │ sessions │          │  receipts     │  ┌────────────────┐   │
│  │  est_GRE │         │ cache    │          │  csv-uploads  │  │  Cloudinary    │   │
│  │  est_... │         └──────────┘          └──────────────┘  │  (External)    │   │
│  └──────────┘                                                  │  profile_imgs  │   │
│                                                                │  visitor_imgs  │   │
│  ┌────────────────────────────────────────┐                   │  estate_logos  │   │
│  │  Monitoring (Phase 2)                  │                   └────────────────┘   │
│  │  Prometheus + Grafana + Loki           │                                        │
│  └────────────────────────────────────────┘                                        │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Service Topology

| Service | Port | Purpose | Memory Limit |
|---------|------|---------|-------------|
| **Nginx** | 80, 443 | Reverse proxy, SSL termination, rate limiting | 128 MB |
| **FastAPI Backend** | 8000 | API server (4 Gunicorn workers) | 1 GB |
| **TanStack Start** | 3000 | Frontend SSR (Node.js/Nitro) | 256 MB |
| **PostgreSQL 16** | 5432 | Primary database (schema-per-tenant) | 512 MB |
| **Redis 7** | 6379 | Cache, rate limiting, JWT blacklist | 256 MB |
| **MinIO** | 9000, 9001 | S3-compatible object storage for documents | 512 MB |
| **Certbot** | — | SSL certificate auto-renewal | 64 MB |

**Total reserved:** ~2.7 GB → Fits comfortably on CX42 (16 GB RAM)

---

## Storage Strategy — Hybrid

| File Type | Destination | Why |
|-----------|-------------|-----|
| Profile photos | **Cloudinary** | Auto-resize, CDN delivery, face detection |
| Visitor photos | **Cloudinary** | CDN for fast gate display on mobile |
| Estate logos | **Cloudinary** | Auto-format (WebP/AVIF), multiple sizes |
| CSV uploads (resident lists) | **MinIO** → `csv-uploads` bucket | Bulk data, no CDN needed, cost control |
| Payment receipts | **MinIO** → `receipts` bucket | Internal documents, no public CDN needed |
| Expense documentation | **MinIO** → `documents` bucket | Internal, potentially sensitive |
| Chat media | **Cloudinary** | Real-time display needs CDN speed |

---

## Docker Compose Services

The full Docker Compose file is already created at `docker-compose.yml` in the project root. It orchestrates all 7 services with:

- **Health checks** on every service
- **Docker secrets** for database password (not env vars)
- **Named volumes** for persistent data
- **Resource limits** to prevent any service from consuming all RAM
- **Internal Docker network** — only Nginx exposes ports to the internet

---

## Backup Strategy

| Data | Method | Schedule | Retention |
|------|--------|----------|-----------|
| PostgreSQL | `pg_dump` → gzip → MinIO `backups` bucket | Every 6 hours | 30 days |
| Redis | AOF persistence (auto) | Continuous | On restart |
| MinIO data | Volume snapshot | Daily | 14 days |
| SSL certs | Certbot auto-renewal | Every 60 days | Auto |

---

[← Back to Index](./README.md) | [Next: Multi tenancy Architecture→](./03-multi-tenant-architecture.md)
