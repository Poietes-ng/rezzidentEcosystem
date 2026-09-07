"""Dashboard schemas — Pydantic V2.

Covers:
- Resident dashboard (personal stats, outstanding bills)
- Admin dashboard (estate-wide metrics, revenue, user distribution)
- Security dashboard (visitor activity, gate log)
- Treasurer dashboard (financial analytics)

V2: Multi-tenant aware — all dashboards scoped to current estate.
"""

from pydantic import BaseModel

# ══════════════════════════════════════════════════════
# Shared Components
# ══════════════════════════════════════════════════════


class EstateLocationResponse(BaseModel):
    """Estate location info."""

    area: str | None = None
    city: str | None = None
    state: str | None = None


class EstateResponse(BaseModel):
    """Estate info for dashboard header."""

    name: str
    estate_code: str | None = None
    location: EstateLocationResponse


class UserSummary(BaseModel):
    """Current user summary for dashboard header."""

    id: str
    full_name: str | None = None
    role: str
    house_number: str | None = None
    profile_image: str | None = None
    welcome_message: str


# ══════════════════════════════════════════════════════
# Resident Dashboard
# ══════════════════════════════════════════════════════


class OutstandingBillItem(BaseModel):
    """Single outstanding bill in dashboard."""

    resident_bill_id: str
    bill_name: str
    status: str  # "Due", "Overdue", "Pending", "Declined"
    due_date: str
    amount: float


class ResidentSummaryStats(BaseModel):
    """Resident quick-stats."""

    active_codes: int = 0
    scheduled_visits: int = 0
    paid_bills_total: float = 0.0
    outstanding_bills_total: float = 0.0
    currency: str = "NGN"


class ResidentDashboardResponse(BaseModel):
    """Complete resident dashboard payload."""

    current_time: str
    estate: EstateResponse
    user: UserSummary
    summary: ResidentSummaryStats
    outstanding_bills: list[OutstandingBillItem] = []
    recent_visitors: list[dict] = []  # Future: recent visitor codes
    notifications_count: int = 0


# ══════════════════════════════════════════════════════
# Admin Dashboard
# ══════════════════════════════════════════════════════


class UserDistribution(BaseModel):
    """User count by role."""

    admins: int = 0
    residents: int = 0
    staff: int = 0
    security: int = 0
    total: int = 0


class MonthlyTransactionItem(BaseModel):
    """Single month in transaction volume chart."""

    month: str
    bills: int = 0
    payments: int = 0
    expenses: int = 0


class RevenueStats(BaseModel):
    """Revenue breakdown."""

    total_revenue: float = 0.0
    total_collections: float = 0.0
    total_outstanding: float = 0.0
    total_expenses: float = 0.0
    net_balance: float = 0.0
    currency: str = "NGN"


class AdminSummaryStats(BaseModel):
    """Admin dashboard quick stats."""

    total_residents: int = 0
    total_staff: int = 0
    total_admins: int = 0
    total_transactions: int = 0
    total_revenue: float = 0.0
    activities_today: int = 0
    activities_this_week: int = 0
    pending_verifications: int = 0  # V2
    active_visitors: int = 0


class AdminDashboardResponse(BaseModel):
    """Complete admin dashboard payload."""

    estate: EstateResponse
    user: UserSummary
    summary: AdminSummaryStats
    user_distribution: UserDistribution
    revenue: RevenueStats
    recent_activities: list[dict] = []


# ══════════════════════════════════════════════════════
# Security Dashboard
# ══════════════════════════════════════════════════════


class SecuritySummaryStats(BaseModel):
    """Security guard quick stats."""

    active_visitor_codes: int = 0
    visitors_checked_in: int = 0
    visitors_today: int = 0
    pending_arrivals: int = 0
    overstayed_visitors: int = 0  # Visitors past estimated departure


class SecurityDashboardResponse(BaseModel):
    """Security dashboard payload."""

    estate: EstateResponse
    user: UserSummary
    summary: SecuritySummaryStats
    recent_gate_log: list[dict] = []


# ══════════════════════════════════════════════════════
# Treasurer Dashboard
# ══════════════════════════════════════════════════════


class TreasurerSummaryStats(BaseModel):
    """Treasurer quick stats."""

    total_collected: float = 0.0
    total_outstanding: float = 0.0
    total_expenses: float = 0.0
    net_balance: float = 0.0
    overdue_bills_count: int = 0
    pending_approvals: int = 0
    currency: str = "NGN"


class TreasurerDashboardResponse(BaseModel):
    """Treasurer dashboard payload."""

    estate: EstateResponse
    user: UserSummary
    summary: TreasurerSummaryStats
    monthly_revenue: list[MonthlyTransactionItem] = []
    recent_payments: list[dict] = []
