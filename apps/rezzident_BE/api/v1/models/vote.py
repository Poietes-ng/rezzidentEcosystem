"""Vote model — tenant schema (V2 new).

From Figma flow: Dashboard → Vote tab.

Supports estate-wide polls/votes:
- Estate elections (chairman, secretary, etc.)
- Levy approvals / community decisions
- General polls / surveys
"""

import enum

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from api.v1.models.base_model import BaseTableModel


class VoteStatus(enum.StrEnum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class VoteType(enum.StrEnum):
    POLL = "poll"  # Simple yes/no or multiple choice
    ELECTION = "election"  # Candidate selection
    LEVY_APPROVAL = "levy_approval"  # Financial decision
    RESOLUTION = "resolution"  # Community resolution


class Vote(BaseTableModel):
    """A poll or election created by estate admin — tenant schema."""

    __tablename__ = "votes"

    created_by = Column(String, ForeignKey("users.id"), nullable=False)

    # ── Vote Info ──
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    vote_type = Column(
        String(20),
        default="poll",
        nullable=False,
        index=True,
        comment="poll | election | levy_approval | resolution",
    )
    status = Column(
        String(20),
        default="draft",
        nullable=False,
        index=True,
        comment="draft | active | closed | cancelled",
    )

    # ── Timing ──
    starts_at = Column(DateTime(timezone=True), nullable=True)
    ends_at = Column(DateTime(timezone=True), nullable=True)

    # ── Options (JSONB array of options) ──
    options = Column(
        JSONB,
        nullable=False,
        default=[],
        comment='Array of option objects: [{"id": "a", "label": "Yes"}, ...]',
    )

    # ── Rules ──
    allow_multiple_choices = Column(Boolean, default=False)
    is_anonymous = Column(Boolean, default=False)
    min_verification_tier = Column(
        Integer,
        default=2,
        comment="Minimum verification tier to vote (Figma: only Tier 2 users)",
    )

    # ── Results (cached for performance) ──
    total_votes = Column(Integer, default=0)
    results_snapshot = Column(
        JSONB,
        nullable=True,
        comment='Cached results: {"option_id": count, ...}',
    )

    # Relationships
    creator = relationship("User", foreign_keys=[created_by])
    ballots = relationship("VoteBallot", back_populates="vote", cascade="all, delete-orphan")


class VoteBallot(BaseTableModel):
    """Individual ballot cast by a resident — tenant schema."""

    __tablename__ = "vote_ballots"

    vote_id = Column(String, ForeignKey("votes.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)

    # ── Choice ──
    selected_options = Column(
        JSONB,
        nullable=False,
        comment='Array of selected option IDs: ["a", "c"]',
    )

    # ── Metadata ──
    ip_address = Column(String(45), nullable=True)

    # Relationships
    vote = relationship("Vote", back_populates="ballots")
    user = relationship("User")
