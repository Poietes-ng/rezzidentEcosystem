"""User roles and permissions — V2.

Mirrors estate_management_BE user_roles.py pattern with V2 additions
for multi-tenant roles and managed member permissions.

Reference: docs/architecture/05-roles-permissions.md
"""

from enum import Enum
from typing import List


class UserRole(str, Enum):
    """User role types — V2 expanded with estate admin role."""

    RESIDENT = "resident"
    STAFF = "staff"
    SECURITY = "security"
    ADMIN_SECRETARY = "admin_secretary"
    SECRETARY = "secretary"
    TREASURER = "treasurer"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class DashboardRoutes:
    """Dashboard routes for each role."""

    ROUTES = {
        UserRole.RESIDENT: "/dashboard",
        UserRole.SECURITY: "/admin/security/dashboard",
        UserRole.ADMIN_SECRETARY: "/admin/secretary/dashboard",
        UserRole.SECRETARY: "/admin/secretary/dashboard",
        UserRole.TREASURER: "/admin/treasurer/dashboard",
        UserRole.ADMIN: "/admin/dashboard",
        UserRole.SUPER_ADMIN: "/superadmin/dashboard",
    }

    @classmethod
    def get_route(cls, role: UserRole) -> str:
        return cls.ROUTES.get(role, "/dashboard")


class RolePermissions:
    """Define permissions for each role."""

    ADMIN_ROLES = [
        UserRole.SECURITY,
        UserRole.ADMIN_SECRETARY,
        UserRole.SECRETARY,
        UserRole.TREASURER,
        UserRole.ADMIN,
    ]

    SUPER_ADMIN_ROLES = [UserRole.SUPER_ADMIN]

    STAFF_ROLES = ADMIN_ROLES + SUPER_ADMIN_ROLES

    # ── V2: Granular permission sets ──
    FINANCIAL_ROLES = [UserRole.TREASURER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
    SECURITY_ROLES = [UserRole.SECURITY, UserRole.ADMIN, UserRole.SUPER_ADMIN]
    USER_MGMT_ROLES = [UserRole.ADMIN, UserRole.ADMIN_SECRETARY, UserRole.SUPER_ADMIN]

    @classmethod
    def is_resident(cls, role: UserRole) -> bool:
        return role == UserRole.RESIDENT

    @classmethod
    def is_admin(cls, role: UserRole) -> bool:
        return role in cls.ADMIN_ROLES

    @classmethod
    def is_super_admin(cls, role: UserRole) -> bool:
        return role in cls.SUPER_ADMIN_ROLES

    @classmethod
    def is_staff(cls, role: UserRole) -> bool:
        return role in cls.STAFF_ROLES

    @classmethod
    def can_access_admin_panel(cls, role: UserRole) -> bool:
        return cls.is_admin(role) or cls.is_super_admin(role)

    @classmethod
    def can_manage_users(cls, role: UserRole) -> bool:
        return role in cls.USER_MGMT_ROLES

    @classmethod
    def can_manage_finances(cls, role: UserRole) -> bool:
        return role in cls.FINANCIAL_ROLES

    @classmethod
    def can_manage_security(cls, role: UserRole) -> bool:
        return role in cls.SECURITY_ROLES


class RoleHierarchy:
    """Role hierarchy for permission inheritance."""

    HIERARCHY = {
        UserRole.SUPER_ADMIN: 100,
        UserRole.ADMIN: 80,
        UserRole.TREASURER: 60,
        UserRole.ADMIN_SECRETARY: 50,
        UserRole.SECRETARY: 50,
        UserRole.SECURITY: 40,
        UserRole.STAFF: 30,
        UserRole.RESIDENT: 10,
    }

    @classmethod
    def get_level(cls, role: UserRole) -> int:
        return cls.HIERARCHY.get(role, 0)

    @classmethod
    def can_manage_role(cls, manager_role: UserRole, target_role: UserRole) -> bool:
        return cls.get_level(manager_role) > cls.get_level(target_role)
