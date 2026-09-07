from arq.connections import RedisSettings

from api.utils.jobs import (
    process_paystack_webhook,
    send_otp_sms,
    send_password_reset_email,
)
from api.utils.settings import settings


class WorkerSettings:
    functions = [
        send_password_reset_email,
        send_otp_sms,
        process_paystack_webhook,
    ]
    cron_jobs = [
        # runs migrate_all_tenants nightly instead of relying on someone
        # remembering to run the script after a migration
        # arq.cron(migrate_all_tenants_job, hour=3, minute=0)
    ]
    redis_settings = RedisSettings.from_dsn(settings.REDIS_URL)
