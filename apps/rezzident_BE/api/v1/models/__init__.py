"""Model barrel exports — V2 corrected per Figma flow."""

from api.v1.models.base_model import BaseTableModel

# ── Public Schema Models ──
from api.v1.models.estate import Estate, Stakeholder, HouseEntity, EstateStructureTemplate, EstateStatus, OnboardingStep
from api.v1.models.firm import Firm
from api.v1.models.firm_admin import FirmAdmin
from api.v1.models.subscription import Subscription
from api.v1.models.platform_user import PlatformUser
from api.v1.models.platform_audit_log import PlatformAuditLog

# ── Tenant Schema Models ──
from api.v1.models.users import User, UserRole, VerificationTier, ConnectionType
from api.v1.models.otp import OTP, OTPPurpose
from api.v1.models.resident import Resident
from api.v1.models.staff import Staff
from api.v1.models.bills import Bill, BillStatus
from api.v1.models.resident_bill import ResidentBill, ResidentBillStatus
from api.v1.models.payment import Payment, PaymentStatus, PaymentChannel, PaymentLedger
from api.v1.models.visitor_code import VisitorCode
from api.v1.models.visitor_history import Visitor
from api.v1.models.notification import Notification, NotificationType
from api.v1.models.expense import Expense, ExpenseItem, ExpenseApproval, ExpenseStatus, ExpensePaymentStatus, ApprovalStatus
from api.v1.models.invoice import Invoice, InvoiceItem, InvoicePayment, InvoiceStatus
from api.v1.models.support import SupportTicket
from api.v1.models.status_history import StatusHistory
from api.v1.models.activity_log import ActivityLog, ActivityType

# ── V2 New Models ──
from api.v1.models.member_permission import MemberPermission
from api.v1.models.verification import VerificationRequest, VerificationVouch, VerificationStatus
from api.v1.models.chat_message import ChatMessage
from api.v1.models.system_health import SystemHealthCheck
from api.v1.models.panic_alert import PanicAlert, PanicAlertStatus
from api.v1.models.vote import Vote, VoteBallot, VoteStatus, VoteType

# NOTE: EstateOfficer removed — replaced by Stakeholder model in estate.py


__all__ = [
    # Base
    "BaseTableModel",
    # Public — Estate & Management
    "Estate",
    "EstateStatus",
    "OnboardingStep",
    "Stakeholder",
    "HouseEntity",
    "EstateStructureTemplate",
    "Firm",
    "FirmAdmin",
    "Subscription",
    "PlatformUser",
    "PlatformAuditLog",
    # Tenant — Core
    "User",
    "UserRole",
    "VerificationTier",
    "ConnectionType",
    "OTP",
    "OTPPurpose",
    "Resident",
    "Staff",
    # Tenant — Billing
    "Bill",
    "BillStatus",
    "ResidentBill",
    "ResidentBillStatus",
    "Payment",
    "PaymentStatus",
    "PaymentChannel",
    "PaymentLedger",
    # Tenant — Visitors
    "VisitorCode",
    "Visitor",
    # Tenant — Communication
    "Notification",
    "NotificationType",
    "ChatMessage",
    # Tenant — Financial
    "Expense",
    "ExpenseItem",
    "ExpenseApproval",
    "ExpenseStatus",
    "ExpensePaymentStatus",
    "ApprovalStatus",
    "Invoice",
    "InvoiceItem",
    "InvoicePayment",
    "InvoiceStatus",
    # Tenant — Support
    "SupportTicket",
    # Tenant — Tracking
    "StatusHistory",
    "ActivityLog",
    "ActivityType",
    "SystemHealthCheck",
    # Tenant — Verification
    "MemberPermission",
    "VerificationRequest",
    "VerificationVouch",
    "VerificationStatus",
    # Tenant — Safety
    "PanicAlert",
    "PanicAlertStatus",
    # Tenant — Voting
    "Vote",
    "VoteBallot",
    "VoteStatus",
    "VoteType",
]
