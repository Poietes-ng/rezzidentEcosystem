"""Status Service V2 — System health monitoring (async).

V2 improvements:
- Future-proof module checks (dynamically add new modules)
- Termii SMS gateway health check (V2 uses Termii, not Firebase for SMS)
- Redis health check (for distributed rate limiting / caching)
- Daily uptime summary for dashboard bar chart
- Incident history with pagination
- Uptime percentage calculation
- Fully async: uses AsyncSession + await db.execute()

Note on external service checks (Redis, Paystack, Termii):
  These are run via httpx.AsyncClient / aioredis to avoid blocking
  the event loop on network I/O. The DB-touching methods all use
  AsyncSession throughout.

Reference: docs/architecture/12-observability.md
"""

import time
from collections import defaultdict
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import desc, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from api.loggers.app_logger import app_logger
from api.utils.settings import settings
from api.v1.models.system_health import SystemHealthCheck
from api.utils.redis_client import get_redis_pool

# Track server start time
_server_start_time = time.time()


def get_uptime_seconds() -> float:
    return time.time() - _server_start_time


def format_uptime(seconds: float) -> str:
    days = int(seconds // 86400)
    hours = int((seconds % 86400) // 3600)
    minutes = int((seconds % 3600) // 60)
    if days > 0:
        return f"{days}d {hours}h {minutes}m"
    if hours > 0:
        return f"{hours}h {minutes}m"
    return f"{minutes}m"


class StatusService:
    """System health monitoring service (async)."""

    # ── Database ─────────────────────────────────────────
    async def check_database(self, db: AsyncSession) -> dict[str, Any]:
        try:
            start = time.time()
            await db.execute(text("SELECT 1"))
            latency = round((time.time() - start) * 1000, 2)
            return {
                "name": "Database",
                "status": "operational",
                "response_time_ms": latency,
                "description": "PostgreSQL primary database",
            }
        except Exception as e:
            app_logger.error(f"Database health check failed: {e}")
            return {
                "name": "Database",
                "status": "major_outage",
                "response_time_ms": None,
                "description": "PostgreSQL primary database",
                "error": str(e),
            }

    # ── Redis (V2 — for caching + rate limiting) ─────────
    async def check_redis(self) -> dict[str, Any]:
        """Check Redis connectivity (if configured) — async via aioredis."""
        redis_url = getattr(settings, "REDIS_URL", None)
        if not redis_url:
            return {
                "name": "Cache (Redis)",
                "status": "not_configured",
                "response_time_ms": None,
                "description": "Redis cache & rate limiter",
            }
        try:
            r = get_redis_pool()
            if not r:
                raise ConnectionError("Redis pool not initialized")
            start = time.time()
            await r.ping()
            latency = round((time.time() - start) * 1000, 2)
            return {
                "name": "Cache (Redis)",
                "status": "operational",
                "response_time_ms": latency,
                "description": "Redis cache & rate limiter",
            }
        except ImportError:
            return {
                "name": "Cache (Redis)",
                "status": "not_configured",
                "response_time_ms": None,
                "description": "Redis package not installed",
            }
        except Exception as e:
            app_logger.warning(f"Redis health check failed: {e}")
            return {
                "name": "Cache (Redis)",
                "status": "degraded",
                "response_time_ms": None,
                "description": "Redis cache & rate limiter",
                "error": "Unreachable",
            }

    # ── Paystack Payment Gateway ─────────────────────────
    async def check_paystack(self) -> dict[str, Any]:
        try:
            import httpx

            start = time.time()
            async with httpx.AsyncClient(timeout=5) as client:
                resp = await client.get(
                    f"{settings.PAYSTACK_BASE_URL}/bank",
                    headers={"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"},
                )
            latency = round((time.time() - start) * 1000, 2)
            ok = resp.status_code == 200
            return {
                "name": "Payment Gateway",
                "status": "operational" if ok else "degraded",
                "response_time_ms": latency,
                "description": "Paystack payment processing",
            }
        except Exception as e:
            app_logger.warning(f"Paystack health check failed: {e}")
            return {
                "name": "Payment Gateway",
                "status": "degraded",
                "response_time_ms": None,
                "description": "Paystack payment processing",
                "error": "Unreachable",
            }

    # ── Termii SMS Gateway (V2 — replaces Firebase for OTP) ──
    async def check_termii(self) -> dict[str, Any]:
        """Check Termii SMS API connectivity — async via httpx."""
        termii_key = getattr(settings, "TERMII_API_KEY", None)
        # Treat missing or placeholder values as not configured
        if not termii_key or termii_key in ("your_termii_api_key", "<your_termii_api_key>", ""):
            return {
                "name": "SMS Gateway",
                "status": "not_configured",
                "response_time_ms": None,
                "description": "Termii SMS delivery",
            }
        try:
            import httpx

            start = time.time()
            async with httpx.AsyncClient(timeout=5) as client:
                resp = await client.get(
                    "https://api.ng.termii.com/api/check/balance",
                    params={"api_key": termii_key},
                )
            latency = round((time.time() - start) * 1000, 2)
            ok = resp.status_code == 200
            return {
                "name": "SMS Gateway",
                "status": "operational" if ok else "degraded",
                "response_time_ms": latency,
                "description": "Termii SMS delivery",
            }
        except Exception as e:
            app_logger.warning(f"Termii health check failed: {e}")
            return {
                "name": "SMS Gateway",
                "status": "degraded",
                "response_time_ms": None,
                "description": "Termii SMS delivery",
                "error": "Unreachable",
            }

    # ── Generic module check (table query) ───────────────
    async def _check_module(
        self, db: AsyncSession, name: str, model: Any, description: str
    ) -> dict[str, Any]:
        """Check if a module's table is queryable."""
        try:
            start = time.time()
            await db.execute(select(model.id).limit(1))
            latency = round((time.time() - start) * 1000, 2)
            return {
                "name": name,
                "status": "operational",
                "response_time_ms": latency,
                "description": description,
            }
        except Exception as e:
            app_logger.warning(f"{name} health check failed: {e}")
            return {
                "name": name,
                "status": "partial_outage",
                "response_time_ms": None,
                "description": description,
                "error": str(e),
            }

    async def check_auth(self, db: AsyncSession) -> dict[str, Any]:
        from api.v1.models.users import User

        return await self._check_module(
            db, "Authentication", User, "User authentication & authorization"
        )

    async def check_bills(self, db: AsyncSession) -> dict[str, Any]:
        from api.v1.models.bills import Bill

        return await self._check_module(
            db, "Bills Management", Bill, "Bill creation and payment tracking"
        )

    async def check_visitors(self, db: AsyncSession) -> dict[str, Any]:
        from api.v1.models.visitor_code import VisitorCode

        return await self._check_module(
            db, "Visitor Management", VisitorCode, "Visitor access and code generation"
        )

    async def check_notifications(self, db: AsyncSession) -> dict[str, Any]:
        from api.v1.models.notification import Notification

        return await self._check_module(
            db, "Notifications", Notification, "Push & in-app notifications"
        )

    async def check_expenses(self, db: AsyncSession) -> dict[str, Any]:
        from api.v1.models.expense import Expense

        return await self._check_module(
            db, "Expense Management", Expense, "Expense tracking and approvals"
        )

    async def check_invoices(self, db: AsyncSession) -> dict[str, Any]:
        from api.v1.models.invoice import Invoice

        return await self._check_module(
            db, "Invoice Management", Invoice, "Invoice generation and tracking"
        )

    async def check_staff(self, db: AsyncSession) -> dict[str, Any]:
        from api.v1.models.staff import Staff

        return await self._check_module(
            db, "Staff Management", Staff, "Estate staff administration"
        )

    # ── Persistence ──────────────────────────────────────
    async def log_health_check(
        self,
        db: AsyncSession,
        overall: str,
        overall_label: str,
        services: list[dict[str, Any]],
        uptime: float,
    ) -> SystemHealthCheck:
        """Persist health check snapshot."""
        bad = [s["name"] for s in services if s["status"] not in ("operational", "not_configured")]

        record = SystemHealthCheck(
            overall_status=overall,
            overall_label=overall_label,
            services=services,
            uptime_seconds=round(uptime, 2),
            has_incident=len(bad) > 0,
            incident_services=", ".join(bad) if bad else None,
        )

        try:
            db.add(record)
            await db.commit()
            await db.refresh(record)
        except Exception as e:
            await db.rollback()
            app_logger.error(f"Failed to log health check: {e}")

        return record

    # ── History queries ──────────────────────────────────
    async def get_history(self, db: AsyncSession, limit: int = 50, skip: int = 0) -> dict[str, Any]:
        """Get paginated health check history."""
        from sqlalchemy import func

        total: int = (await db.scalar(select(func.count()).select_from(SystemHealthCheck))) or 0

        result = await db.execute(
            select(SystemHealthCheck)
            .order_by(desc(SystemHealthCheck.created_at))
            .offset(skip)
            .limit(limit)
        )
        records = result.scalars().all()

        return {
            "total": total,
            "limit": limit,
            "skip": skip,
            "checks": [
                {
                    "id": r.id,
                    "overall_status": r.overall_status,
                    "overall_label": r.overall_label,
                    "has_incident": r.has_incident,
                    "incident_services": r.incident_services,
                    "uptime_seconds": r.uptime_seconds,
                    "services": r.services,
                    "checked_at": r.created_at.isoformat() if r.created_at else None,
                }
                for r in records
            ],
        }

    async def get_incidents(
        self, db: AsyncSession, limit: int = 20, days: int = 30
    ) -> dict[str, Any]:
        """Get recent incidents."""
        since = datetime.now(UTC) - timedelta(days=days)
        result = await db.execute(
            select(SystemHealthCheck)
            .where(
                SystemHealthCheck.has_incident,
                SystemHealthCheck.created_at >= since,
            )
            .order_by(desc(SystemHealthCheck.created_at))
            .limit(limit)
        )
        records = result.scalars().all()

        return {
            "days": days,
            "total_incidents": len(records),
            "incidents": [
                {
                    "id": r.id,
                    "overall_status": r.overall_status,
                    "overall_label": r.overall_label,
                    "incident_services": r.incident_services,
                    "services": r.services,
                    "occurred_at": r.created_at.isoformat() if r.created_at else None,
                }
                for r in records
            ],
        }

    async def get_daily_summary(self, db: AsyncSession, days: int = 90) -> list[dict[str, Any]]:
        """Daily uptime summary for uptime bar chart."""
        since = datetime.now(UTC) - timedelta(days=days)
        result = await db.execute(
            select(SystemHealthCheck)
            .where(SystemHealthCheck.created_at >= since)
            .order_by(SystemHealthCheck.created_at)
        )
        records = result.scalars().all()

        # Group by date
        daily: dict[str, dict[str, int]] = defaultdict(
            lambda: {"total_checks": 0, "incident_checks": 0}
        )
        for r in records:
            day_key = r.created_at.strftime("%Y-%m-%d") if r.created_at else "unknown"
            daily[day_key]["total_checks"] += 1
            if r.has_incident:
                daily[day_key]["incident_checks"] += 1

        result_list = []
        for i in range(days):
            d = (datetime.now(UTC) - timedelta(days=days - 1 - i)).strftime("%Y-%m-%d")
            info = daily.get(d, {"total_checks": 0, "incident_checks": 0})
            total = info["total_checks"]
            incidents = info["incident_checks"]

            if total == 0:
                day_status = "no_data"
                uptime_pct = None
            elif incidents == 0:
                day_status = "operational"
                uptime_pct = 100.0
            else:
                uptime_pct = round((1 - incidents / total) * 100, 2)
                day_status = "incident" if uptime_pct < 100 else "operational"

            result_list.append(
                {
                    "date": d,
                    "status": day_status,
                    "uptime_pct": uptime_pct,
                    "total_checks": total,
                    "incident_checks": incidents,
                }
            )

        return result_list

    # ── Aggregate: full status report ────────────────────
    async def get_full_status(self, db: AsyncSession) -> dict[str, Any]:
        """Run all health checks, log, and return structured report."""
        import asyncio

        # asyncpg raises "This session is provisioning a new connection;
        # concurrent operations are not permitted" even with sequential awaits
        # when the physical TCP+auth connection is still being established.
        # A single warm-up execute forces asyncpg to fully complete the
        # connection handshake before any module-level queries run, so all
        # subsequent session.execute() calls reuse the same ready connection.
        await db.execute(text("SELECT 1"))

        # DB-bound checks all share one AsyncSession — run them sequentially.
        db_check = await self.check_database(db)
        auth_check = await self.check_auth(db)
        bills_check = await self.check_bills(db)
        visitors_check = await self.check_visitors(db)
        notif_check = await self.check_notifications(db)
        expenses_check = await self.check_expenses(db)
        invoices_check = await self.check_invoices(db)
        staff_check = await self.check_staff(db)

        # All DB work is done — safe to fan-out external I/O concurrently.
        paystack_check, termii_check, redis_check = await asyncio.gather(
            self.check_paystack(),
            self.check_termii(),
            self.check_redis(),
        )

        services: list[dict[str, Any]] = [
            db_check,
            auth_check,
            bills_check,
            visitors_check,
            notif_check,
            expenses_check,
            invoices_check,
            staff_check,
            paystack_check,
            termii_check,
            redis_check,
        ]

        # Filter out not_configured services for overall status calc
        active = [s for s in services if s["status"] != "not_configured"]
        statuses = [s["status"] for s in active]

        if all(s == "operational" for s in statuses):
            overall = "operational"
            overall_label = "All Systems Operational"
        elif any(s == "major_outage" for s in statuses):
            overall = "major_outage"
            overall_label = "Major Outage"
        elif any(s == "partial_outage" for s in statuses):
            overall = "partial_outage"
            overall_label = "Partial Outage"
        else:
            overall = "degraded"
            overall_label = "Degraded Performance"

        uptime = get_uptime_seconds()

        # Persist
        await self.log_health_check(db, overall, overall_label, services, uptime)

        return {
            "status": overall,
            "overall_label": overall_label,
            "timestamp": datetime.now(UTC).isoformat(),
            "uptime_seconds": round(uptime, 2),
            "uptime_formatted": format_uptime(uptime),
            "environment": getattr(settings, "PYTHON_ENV", "development"),
            "services": services,
        }


# Singleton
status_service = StatusService()
