"""Health endpoint tests."""


def test_root_returns_200(client):
    """Test that root endpoint returns welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "Rezzident" in data["message"]


def test_healthz_returns_200(client):
    """Test liveness probe."""
    response = client.get("/api/v1/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"


def test_readyz_returns_200(client):
    """Test readiness probe checks DB connectivity."""
    response = client.get("/api/v1/readyz")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["checks"]["database"] is True
