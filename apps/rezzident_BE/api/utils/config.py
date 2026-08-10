import os

# JWT configuration — loaded from environment
# IMPORTANT: In production, SECRET_KEY must be a 64-byte random hex string
# Generate with: python -c "import secrets; print(secrets.token_hex(64))"
SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_ME_IN_PRODUCTION")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
