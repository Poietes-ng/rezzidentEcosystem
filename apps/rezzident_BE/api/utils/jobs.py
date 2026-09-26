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
        app_logger.info(f"[DEV — OTP SMS] Phone: {phone_number} | Code: {otp_code}")
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


async def send_panel_credentials_email(
    ctx: dict,
    email: str,
    estate_code: str,
    plain_password: str,
) -> None:
    """Send centre-panel login credentials to a new stakeholder.

    Called by estate_service.register_estate() after creating a stakeholder
    with panel access. Enqueued via ARQ so SMTP failures don't block the
    estate registration response and the job is automatically retried.

    ARQ retry behaviour (B9 fix):
    - On exception, ARQ retries up to `max_tries` times (default 5).
    - Each retry uses exponential backoff.
    - Failed jobs are visible in the ARQ dashboard (arq.jobs).

    Production: replace the log stub with your mail provider (fastapi-mail,
    SendGrid, Resend, etc.).
    Development: logs credentials to app.log — never sends real email.
    """
    if settings.PYTHON_ENV == "development":
        app_logger.info(
            f"[DEV — Panel Credentials] To: {email} | "
            f"Estate: {estate_code} | Password: {plain_password}"
        )
        return

    # TODO: Production email integration
    # Example with fastapi-mail:
    #   message = MessageSchema(
    #       subject=f"Your Rezzident Panel Access — {estate_code}",
    #       recipients=[email],
    #       body=render_template("panel_credentials.html", estate_code=estate_code, password=plain_password),
    #       subtype=MessageType.html,
    #   )
    #   await fast_mail.send_message(message)
    app_logger.info(f"[Job] Would send panel credentials email to {email} for estate {estate_code}")
