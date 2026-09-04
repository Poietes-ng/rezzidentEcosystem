"""Create platform super admin — one-time setup script.

Usage: python scripts/create_superadmin.py

Requires SUPER_ADMIN_SETUP_KEY environment variable to match.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from getpass import getpass

from passlib.context import CryptContext

from api.db.database import SessionLocal
from api.loggers.app_logger import app_logger
from api.utils.settings import settings
from api.v1.models.platform_user import PlatformUser

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def main():
    """Create a platform super admin interactively."""
    print("\n🔐 Rezzident — Create Platform Super Admin\n")

    # Verify setup key
    setup_key = input("Enter setup key: ").strip()
    if setup_key != settings.SUPER_ADMIN_SETUP_KEY:
        print("❌ Invalid setup key.")
        sys.exit(1)

    # Collect admin details
    email = input("Email: ").strip()
    full_name = input("Full name: ").strip()
    phone = input("Phone (+234...): ").strip()
    password = getpass("Password (min 10 chars): ")
    confirm = getpass("Confirm password: ")

    if password != confirm:
        print("❌ Passwords do not match.")
        sys.exit(1)

    if len(password) < 10:
        print("❌ Password must be at least 10 characters.")
        sys.exit(1)

    # Create admin
    db = SessionLocal()
    try:
        existing = db.query(PlatformUser).filter(PlatformUser.email == email).first()
        if existing:
            print(f"❌ Admin with email {email} already exists.")
            sys.exit(1)

        admin = PlatformUser(
            email=email,
            full_name=full_name,
            phone_number=phone,
            password_hash=pwd_context.hash(password),
            is_active=True,
        )
        db.add(admin)
        db.commit()

        print(f"\n✅ Super admin created: {email}")
        app_logger.info(f"Platform super admin created: {email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
