"""Route registration — __init__.py barrel pattern."""

from fastapi import APIRouter

from api.v1.routes.auth_route import auth
from api.v1.routes.estate_route import estates
from api.v1.routes.health import health
from api.v1.routes.webhooks import webhooks
from api.v1.routes.dashboard import dashboard
from api.v1.routes.activity_log import activity_logs
from api.v1.routes.status import status_router


api_version_one = APIRouter(prefix="/api/v1")

api_version_one.include_router(auth)
api_version_one.include_router(estates)
api_version_one.include_router(health)
api_version_one.include_router(webhooks)
api_version_one.include_router(dashboard)
api_version_one.include_router(activity_logs)
api_version_one.include_router(status_router)

# Future route registrations:
# api_version_one.include_router(visitor)
# api_version_one.include_router(admin_visitor)
# api_version_one.include_router(bills)
# api_version_one.include_router(admin_bills)
# api_version_one.include_router(residents)
# api_version_one.include_router(notifications)
# api_version_one.include_router(expenses)
# api_version_one.include_router(invoices)

