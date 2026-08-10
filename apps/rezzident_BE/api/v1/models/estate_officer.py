"""DEPRECATED — Replaced by Stakeholder model in estate.py.

EstateOfficer has been replaced by the Stakeholder model which:
- Serves as the 2 contacts from Figma registration form
- Works for both community-managed and firm-managed estates
- Includes panel access and NIN verification

This file is kept for migration reference only. Do NOT import.
"""

# MIGRATION NOTE: If you have existing data in estate_officers table,
# migrate it to the stakeholders table before dropping.
#
# The Stakeholder model in estate.py replaces this entirely.
