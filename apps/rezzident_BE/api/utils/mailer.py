"""Mailer — generic email-sending utility built on fastapi-mail.

Follows the same dev/production convention already used for OTP delivery
(see api/v1/services/auth.py::_deliver_otp) and password-reset emails
(see api/utils/jobs.py::send_password_reset_email):

  - development (PYTHON_ENV=development): never actually sends — logs the
    subject/recipient/body to app.log so nothing leaks to a real inbox
    during local testing.
  - production/staging: sends for real via SMTP using the MAIL_* settings
    in api/utils/settings.py. If MAIL_USERNAME isn't configured, logs a
    warning instead of raising, so a missing mail config doesn't take
    down the calling request.

This is intentionally generic (to/subject/html) — callers own their own
message content and templates.
"""

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from api.loggers.app_logger import app_logger
from api.utils.settings import settings


def _get_mail_config() -> ConnectionConfig:
    return ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )


async def send_email(to: str, subject: str, body_html: str) -> None:
    """Send a single HTML email.

    Development: logs instead of sending (never touches a real inbox).
    Production: sends via SMTP using the configured MAIL_* settings.
    Never raises — a failed/misconfigured send is logged, not propagated,
    so it never breaks the request that triggered it (this is always
    called from a background task, see api/v1/services/estate_service.py).
    """
    if settings.PYTHON_ENV == "development":
        app_logger.info(f"[DEV — Email] To: {to} | Subject: {subject}\n{body_html}")
        return

    if not settings.MAIL_USERNAME or not settings.MAIL_FROM:
        app_logger.warning(
            f"[Mailer] MAIL_USERNAME/MAIL_FROM not configured — "
            f"skipped sending '{subject}' to {to}"
        )
        return

    message = MessageSchema(
        recipients=[to],
        subject=subject,
        body=body_html,
        subtype=MessageType.html,
    )

    try:
        fm = FastMail(_get_mail_config())
        await fm.send_message(message)
        app_logger.info(f"[Mailer] Sent '{subject}' to {to}")
    except Exception as e:
        app_logger.error(f"[Mailer] Failed to send '{subject}' to {to}: {e}")
