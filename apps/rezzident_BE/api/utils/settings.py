import os
from pydantic_settings import BaseSettings
from pydantic import computed_field
from pathlib import Path


# Use this to build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Application configuration — loaded from .env file by pydantic-settings.

    pydantic-settings reads .env natively — no need for python-decouple.

    Rules:
    - Secrets (passwords, API keys) have NO defaults — the app crashes on
      startup if they are missing. This is intentional.
    - Non-secret config (ports, feature flags) may have sensible defaults.
    """

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

    # ── Environment ──
    PYTHON_ENV: str = "development"

    # ── Security (NO defaults — must be set) ──
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    JWT_REFRESH_EXPIRY: int = 7
    SUPER_ADMIN_SETUP_KEY: str = ""

    # ── Application ──
    APP_URL: str = "http://localhost:7001"
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # ── Database (password has NO default) ──
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str
    DB_NAME: str = "rezzident_db"
    DB_TYPE: str = "postgresql"
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_RECYCLE: int = 300
    DB_POOL_PRE_PING: bool = True

    # ── Redis ──
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── Security Guard (fastapi-guard) ──
    GUARD_RATE_LIMIT: int = 100
    GUARD_RATE_LIMIT_WINDOW: int = 60
    GUARD_AUTO_BAN_THRESHOLD: int = 25
    GUARD_AUTO_BAN_DURATION: int = 3600
    GUARD_REDIS_PREFIX: str = "guard:"

    # ── Paystack (NO defaults for secrets) ──
    PAYSTACK_SECRET_KEY: str = ""
    PAYSTACK_PUBLIC_KEY: str = ""
    PAYSTACK_WEBHOOK_SECRET: str = ""
    PAYSTACK_BASE_URL: str = "https://api.paystack.co"

    # ── Termii (SMS OTP) ──
    TERMII_API_KEY: str = ""
    TERMII_SENDER_ID: str = "Rezzident"

    # ── Dojah (NIN Verification) ──
    DOJAH_APP_ID: str = ""
    DOJAH_SECRET_KEY: str = ""
    DOJAH_API_KEY: str = ""

    # ── MinIO (Object Storage) ──
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "rezzident"
    MINIO_USE_SSL: bool = False

    # ── Cloudinary (Image CDN) ──
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # ── Email ──
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_PORT: int = 465
    MAIL_SERVER: str = "smtp.gmail.com"

    # ── Helpers ──
    TEMP_DIR: str = os.path.join(BASE_DIR, "tmp", "media")

    @property
    def cors_origins(self) -> list[str]:
        """Parse ALLOWED_ORIGINS comma-separated string into a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    @property
    def database_url(self) -> str:
        """Construct database URL from components.

        Single source of truth — used by both the app and Alembic.
        """
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()
