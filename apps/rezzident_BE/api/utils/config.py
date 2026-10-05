"""JWT configuration — re-exports from the unified Settings.

Kept for backward compatibility with jwt_handler.py imports.
"""

from api.utils.settings import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
