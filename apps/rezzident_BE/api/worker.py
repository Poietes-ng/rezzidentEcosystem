import arq
from arq.connections import RedisSettings

from api.utils.jobs import (
    migrate_all_tenants_job,
    process_paystack_webhook,
    send_otp_sms,
    send_panel_credentials_email,
    send_password_reset_email,
)
from api.utils.settings import settings


class WorkerSettings:
    functions = [
        send_password_reset_email,
        send_otp_sms,
        process_paystack_webhook,
        send_panel_credentials_email,  # was enqueued by name but never registered
        migrate_all_tenants_job,  # defined in jobs.py but was missing here
    ]
    cron_jobs = [
        # Nightly tenant schema migration at 03:00 UTC.
        # was commented out — now active so migrations run automatically.
        arq.cron(migrate_all_tenants_job, hour=3, minute=0),
    ]
    redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)
