"""Auth dependencies — role-based access control.

Mirrors estate_management_BE auth_dependencies.py pattern with V2 additions.
"""

from fastapi import Depends, HTTPException, status

from api.utils.jwt_handler import get_current_user
from api.utils.user_roles import RolePermissions
from api.v1.models.users import User, UserRole


def require_roles(allowed_roles: list[UserRole]):
    """FastAPI dependency that restricts access to specified roles.

    Usage:
        @router.get("/admin/users", dependencies=[Depends(require_roles([UserRole.ADMIN]))])
        async def list_users(): ...
    """

    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
        return current_user

    return role_checker


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency: require any admin role."""
    if not current_user.has_admin_privileges():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return current_user


def require_super_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency: require super admin role."""
    if not current_user.is_super_admin_role():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required.",
        )
    return current_user


def require_financial_access(current_user: User = Depends(get_current_user)) -> User:
    """Dependency: require financial management access (Treasurer, Admin, Super Admin)."""
    if not RolePermissions.can_manage_finances(current_user.role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Financial management access required.",
        )
    return current_user


def require_security_access(current_user: User = Depends(get_current_user)) -> User:
    """Dependency: require security access (Security, Admin, Super Admin)."""
    if not RolePermissions.can_manage_security(current_user.role):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Security management access required.",
        )
    return current_user
