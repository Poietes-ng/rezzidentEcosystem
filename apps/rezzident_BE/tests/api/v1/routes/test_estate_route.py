import pytest
from fastapi.testclient import TestClient

def test_register_estate_success(client: TestClient):
    """Test successful estate registration."""
    payload = {
        "name": "Test Estate",
        "address": "123 Main St",
        "city": "Lagos",
        "state": "Lagos",
        "local_government": "Ikeja",
        "management_type": "community",
        "number_of_units": 100,
        "stakeholders": [
            {
                "full_name": "John Doe",
                "phone_number": "08012345678",
                "email": "john.doe@example.com",
                "role_title": "chairman",
                "is_primary": True
            },
            {
                "full_name": "Jane Smith",
                "phone_number": "08087654321",
                "role_title": "secretary",
                "is_primary": False
            }
        ]
    }
    
    response = client.post("/api/v1/estates/register", json=payload)
    assert response.status_code == 201
    
    data = response.json()["data"]
    assert data["name"] == "Test Estate"
    assert data["management_type"] == "community"
    assert "estate_code" in data
    assert "schema_name" in data


def test_register_estate_missing_fields(client: TestClient):
    """Test registration fails when required fields are missing."""
    payload = {
        "name": "Missing Address Estate"
        # address is missing
    }
    
    response = client.post("/api/v1/estates/register", json=payload)
    assert response.status_code == 422
    
    errors = response.json()["errors"]
    assert any(err["loc"][-1] == "address" for err in errors)


def test_register_estate_invalid_management_type(client: TestClient):
    """Test registration fails with invalid management_type."""
    payload = {
        "name": "Test Estate 2",
        "address": "123 Main St",
        "management_type": "invalid_type",
    }
    
    response = client.post("/api/v1/estates/register", json=payload)
    assert response.status_code == 422
    
    errors = response.json()["errors"]
    assert any(err["loc"][-1] == "management_type" for err in errors)


def test_register_estate_invalid_number_of_units(client: TestClient):
    """Test registration fails with invalid number of units (must be >= 1)."""
    payload = {
        "name": "Test Estate 3",
        "address": "123 Main St",
        "management_type": "community",
        "number_of_units": 0
    }
    
    response = client.post("/api/v1/estates/register", json=payload)
    assert response.status_code == 422
    
    errors = response.json()["errors"]
    assert any(err["loc"][-1] == "number_of_units" for err in errors)


def test_list_structure_templates(client: TestClient):
    """Test listing structure templates."""
    response = client.get("/api/v1/estates/structure-templates")
    assert response.status_code == 200
    
    data = response.json()["data"]
    assert isinstance(data, list)
