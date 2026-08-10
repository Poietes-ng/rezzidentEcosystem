def generate_id():
    """Helper to generate a short unique ID."""
    from uuid_extensions import uuid7
    return str(uuid7().hex)
