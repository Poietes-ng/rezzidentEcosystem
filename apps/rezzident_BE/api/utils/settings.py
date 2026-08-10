import os
from pydantic_settings import BaseSettings
from decouple import config
from pathlib import Path


# Use this to build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Application configuration — loaded from .env file.

    Mirrors the estate_management_BE settings.py pattern with V2 additions
    for multi-tenancy, Redis, security middleware, and split payments.
    """

    # ── Environment ──
    PYTHON_ENV: str = config("PYTHON_ENV", default="development")

    # ── Security ──
    SECRET_KEY: str = config("SECRET_KEY")
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config(
        "ACCESS_TOKEN_EXPIRE_MINUTES", default=15, cast=int
    )
    JWT_REFRESH_EXPIRY: int = config("JWT_REFRESH_EXPIRY", default=7, cast=int)
    SUPER_ADMIN_SETUP_KEY: str = config("SUPER_ADMIN_SETUP_KEY", default="")

    # ── Application ──
    APP_URL: str = config("APP_URL", default="http://localhost:7001")
    FRONTEND_URL: str = config("FRONTEND_URL", default="http://localhost:3000")
    ALLOWED_ORIGINS: str = config(
        "ALLOWED_ORIGINS", default="http://localhost:3000,http://localhost:5173"
    )

    # ── Database ──
    DB_HOST: str = config("DB_HOST", default="localhost")
    DB_PORT: int = config("DB_PORT", default=5432, cast=int)
    DB_USER: str = config("DB_USER", default="postgres")
    DB_PASSWORD: str = config("DB_PASSWORD", default="password")
    DB_NAME: str = config("DB_NAME", default="rezzident_db")
    DB_TYPE: str = config("DB_TYPE", default="postgresql")
    DB_URL: str = config(
        "DB_URL",
        default="postgresql://postgres:password@localhost:5432/rezzident_db",
    )

    # ── Redis ──
    REDIS_URL: str = config("REDIS_URL", default="redis://localhost:6379/0")

    # ── Paystack ──
    PAYSTACK_SECRET_KEY: str = config("PAYSTACK_SECRET_KEY", default="")
    PAYSTACK_PUBLIC_KEY: str = config("PAYSTACK_PUBLIC_KEY", default="")
    PAYSTACK_WEBHOOK_SECRET: str = config("PAYSTACK_WEBHOOK_SECRET", default="")
    PAYSTACK_BASE_URL: str = "https://api.paystack.co"

    # ── Termii (SMS OTP) ──
    TERMII_API_KEY: str = config("TERMII_API_KEY", default="")
    TERMII_SENDER_ID: str = config("TERMII_SENDER_ID", default="Rezzident")

    # ── Dojah (NIN Verification) ──
    DOJAH_APP_ID: str = config("DOJAH_APP_ID", default="")
    DOJAH_SECRET_KEY: str = config("DOJAH_SECRET_KEY", default="")
    DOJAH_API_KEY: str = config("DOJAH_API_KEY", default="")

    # ── MinIO (Object Storage) ──
    MINIO_ENDPOINT: str = config("MINIO_ENDPOINT", default="localhost:9000")
    MINIO_ACCESS_KEY: str = config("MINIO_ACCESS_KEY", default="minioadmin")
    MINIO_SECRET_KEY: str = config("MINIO_SECRET_KEY", default="minioadmin")
    MINIO_BUCKET_NAME: str = config("MINIO_BUCKET_NAME", default="rezzident")
    MINIO_USE_SSL: bool = config("MINIO_USE_SSL", default=False, cast=bool)

    # ── Cloudinary (Image CDN) ──
    CLOUDINARY_CLOUD_NAME: str = config("CLOUDINARY_CLOUD_NAME", default="")
    CLOUDINARY_API_KEY: str = config("CLOUDINARY_API_KEY", default="")
    CLOUDINARY_API_SECRET: str = config("CLOUDINARY_API_SECRET", default="")

    # ── Email ──
    MAIL_USERNAME: str = config("MAIL_USERNAME", default="")
    MAIL_PASSWORD: str = config("MAIL_PASSWORD", default="")
    MAIL_FROM: str = config("MAIL_FROM", default="")
    MAIL_PORT: int = config("MAIL_PORT", default=465, cast=int)
    MAIL_SERVER: str = config("MAIL_SERVER", default="smtp.gmail.com")

    # ── Helpers ──
    TEMP_DIR: str = os.path.join(BASE_DIR, "tmp", "media")

    @property
    def cors_origins(self) -> list[str]:
        """Parse ALLOWED_ORIGINS comma-separated string into a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    @property
    def database_url(self) -> str:
        """Construct database URL from components."""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()
