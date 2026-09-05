#!/usr/bin/env python3
"""Automated Database Schema Flowchart Generator for Rezzident Ecosystem.

Parses all SQLAlchemy models in `api/v1/models/` via Python AST, extracts exact
table names, columns, datatypes, primary keys, foreign keys (with target field mapping),
and relationships, and updates `models_interactive_flowchart.html` with an ERD-grade
database flow structure.
"""

import ast
import json
import os
import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
BE_DIR = SCRIPT_DIR.parent
ROOT_DIR = BE_DIR.parent
MODELS_DIR = BE_DIR / "api" / "v1" / "models"
HTML_FILE = ROOT_DIR / "models_interactive_flowchart.html"

# Domain Palette
PUBLIC_MODELS = {
    "Estate",
    "Firm",
    "FirmAdmin",
    "EstateOfficer",
    "Subscription",
    "PlatformUser",
    "PlatformAuditLog",
}

DOMAIN_CONFIG = {
    "Public Core": {
        "color": "#38bdf8",
        "col": 0,
        "models": [
            "Estate",
            "Firm",
            "FirmAdmin",
            "EstateOfficer",
            "Subscription",
            "PlatformUser",
            "PlatformAuditLog",
        ],
    },
    "Identity & Residence": {
        "color": "#818cf8",
        "col": 1,
        "models": ["Resident", "User", "Staff", "OTP", "MemberPermission"],
    },
    "Verification & Social": {
        "color": "#a78bfa",
        "col": 2,
        "models": ["VerificationRequest", "VerificationVouch", "ChatMessage"],
    },
    "Gate Access & Security": {
        "color": "#34d399",
        "col": 3,
        "models": ["VisitorCode", "Visitor", "PanicAlert"],
    },
    "Financial Dues & Ledger": {
        "color": "#f59e0b",
        "col": 4,
        "models": [
            "Bill",
            "ResidentBill",
            "Payment",
            "PaymentLedger",
            "Expense",
            "ExpenseItem",
            "ExpenseApproval",
            "Invoice",
            "InvoiceItem",
            "InvoicePayment",
        ],
    },
    "Governance & Operations": {
        "color": "#ec4899",
        "col": 5,
        "models": [
            "Vote",
            "VoteBallot",
            "Notification",
            "SupportTicket",
            "StatusHistory",
            "ActivityLog",
            "SystemHealthCheck",
        ],
    },
}

# Table name to Model Class name lookup
TABLE_TO_MODEL = {
    "estates": "Estate",
    "firms": "Firm",
    "firm_admins": "FirmAdmin",
    "estate_officers": "EstateOfficer",
    "subscriptions": "Subscription",
    "platform_users": "PlatformUser",
    "platform_audit_logs": "PlatformAuditLog",
    "residents": "Resident",
    "users": "User",
    "staff": "Staff",
    "otps": "OTP",
    "member_permissions": "MemberPermission",
    "verification_requests": "VerificationRequest",
    "verification_vouches": "VerificationVouch",
    "chat_messages": "ChatMessage",
    "visitor_codes": "VisitorCode",
    "visitors": "Visitor",
    "panic_alerts": "PanicAlert",
    "bills": "Bill",
    "resident_bills": "ResidentBill",
    "payments": "Payment",
    "payment_ledgers": "PaymentLedger",
    "expenses": "Expense",
    "expense_items": "ExpenseItem",
    "expense_approvals": "ExpenseApproval",
    "invoices": "Invoice",
    "invoice_items": "InvoiceItem",
    "invoice_payments": "InvoicePayment",
    "votes": "Vote",
    "vote_ballots": "VoteBallot",
    "notifications": "Notification",
    "support_tickets": "SupportTicket",
    "status_histories": "StatusHistory",
    "activity_logs": "ActivityLog",
    "system_health_checks": "SystemHealthCheck",
}


class SchemaASTVisitor(ast.NodeVisitor):
    def __init__(self):
        self.models = []

    def visit_ClassDef(self, node):  # noqa: N802
        bases_str = [ast.unparse(b) for b in node.bases]
        if any("Enum" in b for b in bases_str):
            return

        model_name = node.name
        tablename = model_name.lower() + "s"
        columns = []
        foreign_keys = []
        relationships = []

        # Default inherited fields from BaseTableModel
        columns.append({"name": "id", "type": "VARCHAR(36)", "isPk": True, "isFk": False})
        columns.append({"name": "created_at", "type": "TIMESTAMP", "isPk": False, "isFk": False})
        columns.append({"name": "updated_at", "type": "TIMESTAMP", "isPk": False, "isFk": False})

        for item in node.body:
            # Check table name
            if isinstance(item, ast.Assign):
                for target in item.targets:
                    if isinstance(target, ast.Name) and target.id == "__tablename__":
                        if isinstance(item.value, ast.Constant):
                            tablename = item.value.value

            # Check Column definitions
            if isinstance(item, ast.Assign):
                for target in item.targets:
                    if isinstance(target, ast.Name):
                        col_name = target.id
                        if col_name in (
                            "id",
                            "created_at",
                            "updated_at",
                            "is_deleted",
                            "deleted_at",
                        ):
                            continue

                        val_str = ast.unparse(item.value)
                        if "Column(" in val_str:
                            is_pk = "primary_key=True" in val_str
                            is_fk = "ForeignKey(" in val_str

                            # Deduce datatype string
                            type_str = "VARCHAR"
                            if "Integer" in val_str:
                                type_str = "INTEGER"
                            elif "Float" in val_str:
                                type_str = "FLOAT"
                            elif "Boolean" in val_str:
                                type_str = "BOOLEAN"
                            elif "DateTime" in val_str:
                                type_str = "TIMESTAMP"
                            elif "Enum(" in val_str:
                                type_str = "ENUM"
                            elif "JSONB" in val_str:
                                type_str = "JSONB"
                            elif "Text" in val_str:
                                type_str = "TEXT"
                            elif "String(" in val_str:
                                len_match = re.search(r"String\((\d+)\)", val_str)
                                if len_match:
                                    type_str = f"VARCHAR({len_match.group(1)})"

                            fk_target_model = None
                            fk_target_field = None

                            if is_fk:
                                fk_match = re.search(r'ForeignKey\(["\']([^"\']+)["\']\)', val_str)
                                if fk_match:
                                    fk_ref = fk_match.group(1)
                                    parts = fk_ref.split(".")
                                    target_table = parts[0]
                                    fk_target_field = parts[1] if len(parts) > 1 else "id"
                                    fk_target_model = TABLE_TO_MODEL.get(
                                        target_table, target_table.capitalize()
                                    )

                                    foreign_keys.append(
                                        {
                                            "fromField": col_name,
                                            "toModel": fk_target_model,
                                            "toField": fk_target_field,
                                        }
                                    )

                            columns.append(
                                {
                                    "name": col_name,
                                    "type": type_str,
                                    "isPk": is_pk,
                                    "isFk": is_fk,
                                    "fkTarget": (
                                        f"{fk_target_model}.{fk_target_field}"
                                        if fk_target_model
                                        else None
                                    ),
                                }
                            )

            # Check relationships
            if isinstance(item, ast.Assign):
                val_str = ast.unparse(item.value)
                if "relationship(" in val_str:
                    rel_match = re.search(r'relationship\(["\']([^"\']+)["\']', val_str)
                    if rel_match:
                        target_model = rel_match.group(1)
                        if target_model != model_name:
                            relationships.append(
                                {
                                    "relName": (
                                        item.targets[0].id
                                        if isinstance(item.targets[0], ast.Name)
                                        else "rel"
                                    ),
                                    "toModel": target_model,
                                }
                            )

        # Deduce Domain & Column Layout
        domain_name = "Governance & Operations"
        col_idx = 5
        color = "#ec4899"

        for d_name, d_cfg in DOMAIN_CONFIG.items():
            if model_name in d_cfg["models"]:
                domain_name = d_name
                col_idx = d_cfg["col"]
                color = d_cfg["color"]
                break

        schema_type = "Public Schema" if model_name in PUBLIC_MODELS else "Tenant Schema"

        self.models.append(
            {
                "id": model_name,
                "table": tablename,
                "schema": schema_type,
                "domain": domain_name,
                "color": color,
                "colIdx": col_idx,
                "columns": columns[:12],  # limit for clean card height
                "foreignKeys": foreign_keys,
                "relationships": relationships,
            }
        )

        self.generic_visit(node)


def parse_database_schema():
    visitor = SchemaASTVisitor()
    for root, _, files in os.walk(MODELS_DIR):
        for file in sorted(files):
            if file.endswith(".py") and file != "__init__.py" and file != "base_model.py":
                filepath = os.path.join(root, file)
                with open(filepath, encoding="utf-8") as f:
                    try:
                        tree = ast.parse(f.read(), filename=filepath)
                        visitor.visit(tree)
                    except Exception as e:
                        print(f"⚠️ Error parsing {file}: {e}")

    # Layout Calculation: 6 horizontal columns, evenly spaced with clean vertical gaps
    col_y_trackers = {0: 80, 1: 80, 2: 80, 3: 80, 4: 80, 5: 80}
    column_x_offsets = {
        0: 60,  # Public Core
        1: 440,  # Identity & Residence
        2: 820,  # Verification & Social
        3: 1200,  # Gate Access & Security
        4: 1580,  # Financial Dues & Ledger
        5: 1960,  # Governance & Operations
    }

    final_models = []
    for m in visitor.models:
        c_idx = m["colIdx"]
        m["x"] = column_x_offsets.get(c_idx, 1000)

        # Calculate dynamic card height based on column count
        card_height = 44 + (len(m["columns"]) * 22) + 12
        card_height = max(140, min(card_height, 340))
        m["height"] = card_height
        m["width"] = 280

        m["y"] = col_y_trackers[c_idx]
        col_y_trackers[c_idx] += card_height + 40  # 40px vertical margin between cards

        final_models.append(m)

    return final_models


def update_html(models):
    if not HTML_FILE.exists():
        print(f"❌ HTML file not found at: {HTML_FILE}")
        return False

    with open(HTML_FILE, encoding="utf-8") as f:
        content = f.read()

    models_json = json.dumps(models, indent=4)
    pattern = r"const MODELS = \[[\s\S]*?\];"
    new_content = re.sub(pattern, f"const MODELS = {models_json};", content)

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(
        f"✅ ERD Schema Generator: Successfully updated {HTML_FILE.name} with {len(models)} database tables!"
    )
    return True


if __name__ == "__main__":
    print("🔄 Parsing SQLAlchemy AST models in api/v1/models/...")
    models = parse_database_schema()
    update_html(models)
