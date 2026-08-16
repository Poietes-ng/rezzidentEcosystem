"""Auth route tests — covers the full OTP → PIN → JWT flow.

Tests follow the auth flow documented in docs/architecture/08-pin-biometric-auth.md:
  Registration: request-otp → verify-otp → set-pin → tokens
  Login:        request-otp → verify-otp → verify-pin → tokens
  Session:      /me, /refresh, /logout
"""

import pytest
from unittest.mock import patch


# ══════════════════════════════════════════════════════
# REGISTRATION FLOW
# ══════════════════════════════════════════════════════

class TestRegistrationRequestOTP:
    """POST /api/v1/auth/register/request-otp"""

    def test_returns_200_with_valid_phone(self, client):
        resp = client.post(
            "/api/v1/auth/register/request-otp",
            json={"phone_number": "+2348012345678"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert data["data"]["phone_number"] == "+2348012345678"
        assert data["data"]["expires_in_seconds"] == 300

    def test_otp_never_in_response(self, client):
        """OTP must NEVER be returned in the API response body."""
        resp = client.post(
            "/api/v1/auth/register/request-otp",
            json={"phone_number": "+2348012345678"},
        )
        body = resp.text
        # OTP is 6 digits — ensure no raw OTP in response
        assert "otp_code" not in body
        assert "otp" not in resp.json().get("data", {})

    def test_rate_limit_after_5_requests(self, client):
        """6th OTP request within 1 hour should return 429."""
        phone = "+2348099999999"
        for i in range(5):
            resp = client.post(
                "/api/v1/auth/register/request-otp",
                json={"phone_number": phone},
            )
            assert resp.status_code == 200, f"Request {i+1} failed unexpectedly"

        # 6th request should be rate limited
        resp = client.post(
            "/api/v1/auth/register/request-otp",
            json={"phone_number": phone},
        )
        assert resp.status_code == 429


class TestRegistrationSetPIN:
    """POST /api/v1/auth/register/set-pin"""

    def test_register_returns_user_and_tokens(self, registered_user):
        """Full registration returns user profile + token pair."""
        user, tokens = registered_user
        assert user["phone_number"] == "+2348012345678"
        assert user["full_name"] == "Test Resident"
        assert user["role"] == "RESIDENT"
        assert tokens["access_token"]
        assert tokens["refresh_token"]
        assert tokens["token_type"] == "bearer"
        assert tokens["expires_in"] > 0

    def test_duplicate_registration_rejected(self, client, registered_user, test_phone, test_pin):
        """Cannot register same phone number twice."""
        resp = client.post(
            "/api/v1/auth/register/set-pin",
            json={
                "phone_number": test_phone,
                "pin": test_pin,
                "confirm_pin": test_pin,
                "full_name": "Duplicate User",
                "estate_code": "TST-12345",
            },
        )
        assert resp.status_code == 409


# ══════════════════════════════════════════════════════
# LOGIN FLOW
# ══════════════════════════════════════════════════════

class TestLoginVerifyPIN:
    """POST /api/v1/auth/login/verify-pin"""

    def test_login_with_correct_pin(self, client, registered_user, test_phone, test_pin):
        """Correct PIN returns user + tokens."""
        resp = client.post(
            "/api/v1/auth/login/verify-pin",
            json={"phone_number": test_phone, "pin": test_pin},
        )
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["user"]["phone_number"] == test_phone
        assert data["tokens"]["access_token"]

    def test_login_wrong_pin_returns_401(self, client, registered_user, test_phone):
        """Wrong PIN returns 401 with remaining attempts."""
        resp = client.post(
            "/api/v1/auth/login/verify-pin",
            json={"phone_number": test_phone, "pin": "0000"},
        )
        assert resp.status_code == 401

    def test_pin_lockout_after_5_failures(self, client, registered_user, test_phone):
        """5 wrong PINs → 423 LOCKED for 30 minutes."""
        for i in range(5):
            resp = client.post(
                "/api/v1/auth/login/verify-pin",
                json={"phone_number": test_phone, "pin": "0000"},
            )
            # First 4 return 401, 5th returns 423
            if i < 4:
                assert resp.status_code == 401
            else:
                assert resp.status_code == 423

    def test_login_nonexistent_user_returns_404(self, client):
        """PIN verification for unregistered phone returns 404."""
        resp = client.post(
            "/api/v1/auth/login/verify-pin",
            json={"phone_number": "+2340000000000", "pin": "1234"},
        )
        assert resp.status_code == 404


# ══════════════════════════════════════════════════════
# TOKEN MANAGEMENT
# ══════════════════════════════════════════════════════

class TestTokenRefresh:
    """POST /api/v1/auth/refresh"""

    def test_refresh_returns_new_tokens(self, client, registered_user):
        """Valid refresh token returns a new token pair."""
        _, tokens = registered_user
        resp = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": tokens["refresh_token"]},
        )
        assert resp.status_code == 200
        new_tokens = resp.json()["data"]["tokens"]
        assert new_tokens["access_token"]
        assert new_tokens["access_token"] != tokens["access_token"]

    def test_refresh_with_invalid_token(self, client):
        """Garbage refresh token returns 401."""
        resp = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": "invalid.token.here"},
        )
        assert resp.status_code == 401


class TestGetMe:
    """GET /api/v1/auth/me"""

    def test_get_me_with_valid_token(self, client, auth_headers):
        """Returns user profile for authenticated request."""
        resp = client.get("/api/v1/auth/me", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["phone_number"] == "+2348012345678"
        assert data["full_name"] == "Test Resident"
        assert data["role"] == "RESIDENT"

    def test_get_me_without_token(self, client):
        """Returns 403 without Authorization header."""
        resp = client.get("/api/v1/auth/me")
        assert resp.status_code == 403


class TestLogout:
    """POST /api/v1/auth/logout"""

    def test_logout_returns_200(self, client, auth_headers):
        """Authenticated logout returns success."""
        resp = client.post("/api/v1/auth/logout", headers=auth_headers)
        assert resp.status_code == 200
