"""Background job definitions for the ARQ worker.

These functions run asynchronously via Redis + ARQ (see api/worker.py).
In development, they log instead of performing real actions.
In production, replace the logging stubs with actual integrations.

Usage in routes:
    from arq.connections import ArqRedis
    await arq_redis.enqueue_job("send_otp_sms", phone_number="+234...", otp_code="123456")
"""

from api.loggers.app_logger import app_logger
from api.utils.settings import settings


async def send_password_reset_email(ctx: dict, email: str, reset_token: str) -> None:
    """Send password reset email.

    Production: integrate with fastapi-mail or SendGrid.
    Development: logs the reset link.
    """
    if settings.PYTHON_ENV == "development":
        app_logger.info(
            f"[DEV — Password Reset] Email: {email} | "
            f"Link: {settings.FRONTEND_URL}/reset-password?token={reset_token}"
        )
        return

    # TODO: Production email integration
    app_logger.info(f"[Job] Would send password reset email to {email}")


async def send_otp_sms(ctx: dict, phone_number: str, otp_code: str) -> None:
    """Send OTP via SMS (Termii).

    Production: calls Termii API.
    Development: logs OTP to app.log.

    Note: The synchronous _deliver_otp in auth service uses BackgroundTasks.
    This ARQ version is for future use when migrating OTP delivery to the
    worker queue for better reliability and retry handling.
    """
    if settings.PYTHON_ENV == "development":
        app_logger.info(
            f"[DEV — OTP SMS] Phone: {phone_number} | Code: {otp_code}"
        )
        return

    # TODO: Termii SMS integration
    app_logger.info(f"[Job] Would send OTP SMS to {phone_number}")


async def process_paystack_webhook(ctx: dict, event_type: str, payload: dict) -> None:
    """Process Paystack webhook events asynchronously.

    Handles: charge.success, transfer.success, subscription.create, etc.
    Offloading to the worker prevents webhook timeout (Paystack expects < 10s response).
    """
    app_logger.info(f"[Paystack Webhook] Processing event: {event_type}")

    if event_type == "charge.success":
        # TODO: Update payment status, credit resident account
        app_logger.info(f"[Paystack] Payment successful: {payload.get('reference', 'N/A')}")

    elif event_type == "transfer.success":
        # TODO: Mark estate payout as completed
        app_logger.info(f"[Paystack] Transfer successful: {payload.get('reference', 'N/A')}")

    else:
        app_logger.info(f"[Paystack] Unhandled event type: {event_type}")


async def migrate_all_tenants_job(ctx: dict) -> None:
    """Run Alembic migrations across all tenant schemas.

    Called by the ARQ cron scheduler (nightly at 3 AM).
    Wraps the existing scripts/migrate_all_tenants.py logic.
    """
    app_logger.info("[Job] Starting nightly tenant migration...")

    try:
        from scripts.migrate_all_tenants import migrate_all
        await migrate_all()
        app_logger.info("[Job] Tenant migration completed successfully.")
    except Exception as e:
        app_logger.error(f"[Job] Tenant migration failed: {e}")
        raise
