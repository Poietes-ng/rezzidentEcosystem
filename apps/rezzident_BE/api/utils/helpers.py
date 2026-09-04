def generate_id():
    """Helper to generate a short unique ID."""
    from uuid6 import uuid7

    return str(uuid7().hex)
