"""MinIO client — sync SDK wrapped for use inside async routes."""

from datetime import timedelta

from minio import Minio
from starlette.concurrency import run_in_threadpool

from api.utils.settings import settings

minio_client = Minio(
    settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=settings.MINIO_USE_SSL,
)

BUCKET = settings.MINIO_BUCKET_NAME


async def ensure_bucket_exists() -> None:
    """Call once at startup — creates the bucket if it doesn't exist yet."""
    exists = await run_in_threadpool(minio_client.bucket_exists, BUCKET)
    if not exists:
        await run_in_threadpool(minio_client.make_bucket, BUCKET)


async def upload_file(object_name: str, data, length: int, content_type: str = "application/octet-stream"):
    return await run_in_threadpool(
        minio_client.put_object, BUCKET, object_name, data, length, content_type=content_type
    )


async def get_file_url(object_name: str, expires_seconds: int = 3600) -> str:
    return await run_in_threadpool(
        minio_client.presigned_get_object, BUCKET, object_name, expires=timedelta(seconds=expires_seconds)
    )