"""Status Service V2 — System health monitoring.

V2 improvements:
- Future-proof module checks (dynamically add new modules)
- Termii SMS gateway health check (V2 uses Termii, not Firebase for SMS)
- Redis health check (for distributed rate limiting / caching)
- Daily uptime summary for dashboard bar chart
- Incident history with pagination
- Uptime percentage calculation

Reference: docs/architecture/12-observability.md
"""

import time
from collections import defaultdict
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import desc, text
from sqlalchemy.orm import Session

from api.loggers.app_logger import app_logger
from api.utils.settings import settings
from api.v1.models.system_health import SystemHealthCheck

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
    """System health monitoring service."""

    # ── Database ─────────────────────────────────────────
    def check_database(self, db: Session) -> dict[str, Any]:
        try:
            start = time.time()
            db.execute(text("SELECT 1"))
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
    def check_redis(self) -> dict[str, Any]:
        """Check Redis connectivity (if configured)."""
        redis_url = getattr(settings, "REDIS_URL", None)
        if not redis_url:
            return {
                "name": "Cache (Redis)",
                "status": "not_configured",
                "response_time_ms": None,
                "description": "Redis cache & rate limiter",
            }
        try:
            import redis

            start = time.time()
            r = redis.from_url(redis_url, socket_timeout=3)
            r.ping()
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
    def check_paystack(self) -> dict[str, Any]:
        try:
            import httpx

            start = time.time()
            resp = httpx.get(
                f"{settings.PAYSTACK_BASE_URL}/bank",
                headers={"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"},
                timeout=5,
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
    def check_termii(self) -> dict[str, Any]:
        """Check Termii SMS API connectivity."""
        termii_key = getattr(settings, "TERMII_API_KEY", None)
        if not termii_key:
            return {
                "name": "SMS Gateway",
                "status": "not_configured",
                "response_time_ms": None,
                "description": "Termii SMS delivery",
            }
        try:
            import httpx

            start = time.time()
            resp = httpx.get(
                "https://api.ng.termii.com/api/check/balance",
                params={"api_key": termii_key},
                timeout=5,
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
    def _check_module(self, db: Session, name: str, model, description: str) -> dict[str, Any]:
        """Check if a module's table is queryable."""
        try:
            start = time.time()
            db.query(model.id).limit(1).all()
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

    def check_auth(self, db: Session) -> dict[str, Any]:
        from api.v1.models.users import User

        return self._check_module(db, "Authentication", User, "User authentication & authorization")

    def check_bills(self, db: Session) -> dict[str, Any]:
        from api.v1.models.bills import Bill

        return self._check_module(
            db, "Bills Management", Bill, "Bill creation and payment tracking"
        )

    def check_visitors(self, db: Session) -> dict[str, Any]:
        from api.v1.models.visitor_code import VisitorCode

        return self._check_module(
            db, "Visitor Management", VisitorCode, "Visitor access and code generation"
        )

    def check_notifications(self, db: Session) -> dict[str, Any]:
        from api.v1.models.notification import Notification

        return self._check_module(db, "Notifications", Notification, "Push & in-app notifications")

    def check_expenses(self, db: Session) -> dict[str, Any]:
        from api.v1.models.expense import Expense

        return self._check_module(
            db, "Expense Management", Expense, "Expense tracking and approvals"
        )

    def check_invoices(self, db: Session) -> dict[str, Any]:
        from api.v1.models.invoice import Invoice

        return self._check_module(
            db, "Invoice Management", Invoice, "Invoice generation and tracking"
        )

    def check_staff(self, db: Session) -> dict[str, Any]:
        from api.v1.models.staff import Staff

        return self._check_module(db, "Staff Management", Staff, "Estate staff administration")

    # ── Persistence ──────────────────────────────────────
    def log_health_check(
        self,
        db: Session,
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
            db.commit()
            db.refresh(record)
        except Exception as e:
            db.rollback()
            app_logger.error(f"Failed to log health check: {e}")

        return record

    # ── History queries ──────────────────────────────────
    def get_history(self, db: Session, limit: int = 50, skip: int = 0) -> dict[str, Any]:
        """Get paginated health check history."""
        total = db.query(SystemHealthCheck).count()
        records = (
            db.query(SystemHealthCheck)
            .order_by(desc(SystemHealthCheck.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

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

    def get_incidents(self, db: Session, limit: int = 20, days: int = 30) -> dict[str, Any]:
        """Get recent incidents."""
        since = datetime.now(UTC) - timedelta(days=days)
        records = (
            db.query(SystemHealthCheck)
            .filter(
                SystemHealthCheck.has_incident,
                SystemHealthCheck.created_at >= since,
            )
            .order_by(desc(SystemHealthCheck.created_at))
            .limit(limit)
            .all()
        )

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

    def get_daily_summary(self, db: Session, days: int = 90) -> list[dict[str, Any]]:
        """Daily uptime summary for uptime bar chart."""
        since = datetime.now(UTC) - timedelta(days=days)
        records = (
            db.query(SystemHealthCheck)
            .filter(SystemHealthCheck.created_at >= since)
            .order_by(SystemHealthCheck.created_at)
            .all()
        )

        # Group by date
        daily: dict[str, dict[str, int]] = defaultdict(
            lambda: {"total_checks": 0, "incident_checks": 0}
        )
        for r in records:
            day_key = r.created_at.strftime("%Y-%m-%d") if r.created_at else "unknown"
            daily[day_key]["total_checks"] += 1
            if r.has_incident:
                daily[day_key]["incident_checks"] += 1

        result = []
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

            result.append(
                {
                    "date": d,
                    "status": day_status,
                    "uptime_pct": uptime_pct,
                    "total_checks": total,
                    "incident_checks": incidents,
                }
            )

        return result

    # ── Aggregate: full status report ────────────────────
    def get_full_status(self, db: Session) -> dict[str, Any]:
        """Run all health checks, log, and return structured report."""

        services: list[dict[str, Any]] = [
            self.check_database(db),
            self.check_auth(db),
            self.check_bills(db),
            self.check_visitors(db),
            self.check_notifications(db),
            self.check_expenses(db),
            self.check_invoices(db),
            self.check_staff(db),
            self.check_paystack(),
            self.check_termii(),
            self.check_redis(),
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
        self.log_health_check(db, overall, overall_label, services, uptime)

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
