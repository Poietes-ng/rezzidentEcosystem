"""Subscription model — public schema.

V3 UPDATE: Subscriptions are now funded by resident payments, not charged
directly to the estate/firm.

Flow:
  1. Subscription defines the plan/cycle/amount the estate owes (this model).
  2. A billing job generates ONE tenant-schema Bill per cycle
     (bill_type="platform_subscription", is_platform_bill=True) and links it
     back here via current_cycle_bill_id.
  3. That Bill is split into ResidentBill rows the same way any other
     estate-wide bill (e.g. security_levy) is split across residents.
  4. Residents pay through the normal Bill -> ResidentBill -> Payment flow.
  5. Subscription.status is derived from that cycle Bill's collection
     progress (see refresh_cycle_status below), not from a Paystack
     subscription charge succeeding.

The old direct-charge path (paystack_subscription_code / paystack_customer_code)
is kept only as an optional fallback for funding_source="direct" — e.g. a firm
that explicitly wants to pay the subscription itself instead of billing
residents. Default for every estate is "resident_billing".
"""

from datetime import UTC

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String
from sqlalchemy.dialects.postgresql import JSONB

from api.v1.models.base_model import BaseTableModel


class Subscription(BaseTableModel):
    """SaaS subscription records — public schema."""

    __tablename__ = "subscriptions"

    # ── Who owns this subscription ──
    entity_type = Column(
        String(20),
        nullable=False,
        index=True,
        comment="estate | firm",
    )
    entity_id = Column(String, nullable=False, index=True)

    # ── Plan Details ──
    plan = Column(
        String(50),
        nullable=False,
        comment="trial | basic | standard | premium | enterprise",
    )
    status = Column(
        String(20),
        default="trial",
        index=True,
        comment="trial | active | past_due | expired | cancelled",
    )

    # ── V3: Who actually pays for this ──
    funding_source = Column(
        String(20),
        default="resident_billing",
        nullable=False,
        comment="resident_billing (default) | direct — direct means the "
        "estate/firm itself is charged instead of splitting the "
        "cost across residents via a Bill",
    )

    # ── V3: Current billing-cycle bill (tenant schema — no cross-schema FK) ──
    current_cycle_bill_id = Column(
        String,
        nullable=True,
        index=True,
        comment="Bill.id (tenant schema, bill_type='platform_subscription') "
        "generated for the active billing cycle",
    )
    current_cycle_start = Column(DateTime(timezone=True), nullable=True)
    current_cycle_due_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Mirrors the cycle Bill's due_date — when residents must "
        "have finished paying this cycle",
    )

    # ── Dates ──
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)

    # ── Billing ──
    # Only populated/used when funding_source == "direct".
    paystack_subscription_code = Column(String(100), nullable=True)
    paystack_customer_code = Column(String(100), nullable=True)
    paystack_plan_code = Column(String(100), nullable=True)

    amount_ngn = Column(Float, nullable=True)
    billing_cycle = Column(
        String(20),
        default="monthly",
        comment="monthly | quarterly | yearly",
    )

    # ── Plan Features / Limits ──
    max_houses = Column(
        Integer,
        nullable=True,
        comment="Max houses allowed on this plan (null = unlimited)",
    )
    max_staff = Column(
        Integer,
        nullable=True,
        comment="Max staff accounts allowed",
    )
    features = Column(
        JSONB,
        nullable=True,
        comment='Enabled features: {"chat": true, "vote": true, "expenses": false}',
    )

    # ── Auto-renewal ──
    auto_renew = Column(Boolean, default=True)
    renewal_reminder_sent = Column(Boolean, default=False)

    # ── V3: Collection tracking for the current cycle ──
    # These mirror the cycle Bill's totals so a platform_super_admin can see
    # collection status here without a cross-schema join.
    current_cycle_total_expected = Column(Integer, default=0)
    current_cycle_total_paid = Column(Integer, default=0)

    def is_active_or_trial(self) -> bool:
        return self.status in ("trial", "active")

    def is_expired(self) -> bool:
        if self.expires_at is None:
            return False
        from datetime import datetime

        return datetime.now(UTC) > self.expires_at

    @property
    def is_resident_funded(self) -> bool:
        return self.funding_source == "resident_billing"

    @property
    def current_cycle_collection_pct(self) -> float:
        """% of the current cycle's subscription bill collected so far.

        Only meaningful when is_resident_funded is True.
        """
        if not self.current_cycle_total_expected:
            return 0.0
        return round(
            (self.current_cycle_total_paid / self.current_cycle_total_expected) * 100,
            2,
        )

    def refresh_cycle_status(self, now=None) -> str:
        """Recompute status from current-cycle collection progress.

        Call this whenever the linked cycle Bill's totals change (e.g. after
        a ResidentBill payment webhook updates total_paid).
        """
        from datetime import datetime

        now = now or datetime.now(UTC)

        if not self.is_resident_funded:
            return self.status  # direct funding_source keeps its own status flow

        if self.current_cycle_total_expected and (
            self.current_cycle_total_paid >= self.current_cycle_total_expected
        ):
            self.status = "active"
        elif self.current_cycle_due_date and now > self.current_cycle_due_date:
            self.status = "past_due"

        return self.status
