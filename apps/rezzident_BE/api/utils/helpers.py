from uuid6 import uuid7


def generate_id():
    """Helper to generate a short unique ID."""
    return uuid7().hex
