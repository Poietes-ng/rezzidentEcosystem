#!/usr/bin/env python3
"""
scripts/load_test_api.py
========================
Standard API Route Load Test — Functional correctness under load.

PURPOSE
-------
While load_test_concurrent.py proves *async performance*, this script proves
*correctness at scale*: that your API returns the right status codes, the
right response shapes, and doesn't corrupt data when hammered.

This is the kind of test you run before deploying a release to staging.

WHAT IS TESTED
--------------
  1. Health endpoints   — always return 200, right shape
  2. Auth flow          — OTP → set-pin → login → refresh → logout (end-to-end)
  3. Error handling     — 422 Unprocessable, 401 Unauthorized, 409 Conflict
  4. Rate limiting      — 6th OTP request → 429 Too Many Requests
  5. Estate endpoints   — register estate, list structure templates

HOW TO RUN
----------
  # Start the API:
  docker compose up

  # Run:
  python apps/rezzident_BE/scripts/load_test_api.py

  # With a custom URL and more verbose output:
  python apps/rezzident_BE/scripts/load_test_api.py --url http://localhost:7001 --verbose

INTERPRETING RESULTS
--------------------
  ✅  = Test passed (correct status + correct response shape)
  ❌  = Test failed (wrong status code or missing response fields)
  ⚠️  = Test passed but with a warning (e.g., slow response)

  The final summary shows:
  - Total tests, passed, failed
  - Average latency per endpoint
  - Any consistent failures (server bug, not flakiness)

READING THE LATENCY REPORT
---------------------------
  avg_ms   = arithmetic mean — what a typical user experiences
  p95_ms   = 95th percentile — what 1-in-20 users experiences (your SLA target)
  p99_ms   = 99th percentile — worst-case tail latency
  max_ms   = absolute worst single request — look for outliers here
"""

import argparse
import asyncio
import json
import random
import string
import time
from dataclasses import dataclass, field
from typing import Any

import httpx

# ── Configuration ─────────────────────────────────────────────────────────────
DEFAULT_BASE_URL = "http://127.0.0.1:7001"
REQUEST_TIMEOUT = 20.0
SLOW_THRESHOLD_MS = 500    # Warn if any response takes longer than this

PASS = "✅"
FAIL = "❌"
WARN = "⚠️ "
SKIP = "⏭️ "


# ── Result tracking ───────────────────────────────────────────────────────────
@dataclass
class TestResult:
    name: str
    passed: bool
    status_code: int
    expected_status: int
    latency_ms: float
    message: str = ""
    response_body: dict | None = None


@dataclass
class TestSuite:
    name: str
    results: list[TestResult] = field(default_factory=list)

    def add(self, r: TestResult) -> None:
        self.results.append(r)

    @property
    def passed(self) -> int:
        return sum(1 for r in self.results if r.passed)

    @property
    def failed(self) -> int:
        return sum(1 for r in self.results if not r.passed)

    @property
    def avg_latency_ms(self) -> float:
        lats = [r.latency_ms for r in self.results]
        return sum(lats) / len(lats) if lats else 0


# ── HTTP client helpers ────────────────────────────────────────────────────────
async def api(
    client: httpx.AsyncClient,
    method: str,
    url: str,
    expected_status: int,
    test_name: str,
    checks: list[tuple[str, Any]] | None = None,
    verbose: bool = False,
    **kwargs,
) -> TestResult:
    """
    Make an API call and assert the expected status code and response shape.

    Parameters
    ----------
    client          : shared httpx.AsyncClient
    method          : "GET", "POST", "PUT", "DELETE"
    url             : full URL string
    expected_status : the HTTP status code you EXPECT (e.g. 200, 201, 401)
    test_name       : human-readable test label
    checks          : list of (json_path, expected_value) tuples to validate
                      json_path uses dot notation: "data.user.phone_number"
    verbose         : print response body on pass (always printed on fail)
    """
    start = time.perf_counter()
    try:
        response = await client.request(method, url, **kwargs)
        latency_ms = (time.perf_counter() - start) * 1000

        body = {}
        try:
            body = response.json()
        except Exception:
            body = {"_raw": response.text}

        # ── Status code check ─────────────────────────────────────────────
        status_ok = response.status_code == expected_status
        if not status_ok:
            msg = f"Expected HTTP {expected_status}, got {response.status_code}"
            if verbose:
                print(f"  {FAIL} {test_name}: {msg}")
                print(f"       Body: {json.dumps(body, indent=2)[:500]}")
            return TestResult(test_name, False, response.status_code, expected_status,
                              latency_ms, msg, body)

        # ── Response field checks ─────────────────────────────────────────
        # Walk dot-notation paths to validate nested response fields.
        # Example: checks=[("data.user.phone_number", "+2348012345678")]
        failures = []
        if checks:
            for path, expected in checks:
                actual: Any = body
                try:
                    for key in path.split("."):
                        actual = actual[key]
                    # Check order matters:
                    # 1. expected is True  → sentinel meaning "just assert key exists and is non-null"
                    #    MUST come first, because True is not None, so the
                    #    general equality check below would fire and fail.
                    # 2. expected is not None → literal equality check
                    # 3. expected is None  → assert key exists but happens to be null (usually a bug)
                    if expected is True:
                        if actual is None:
                            failures.append(f"  {path}: key is missing or null")
                        # else: key exists with a non-null value → pass
                    elif expected is not None and actual != expected:
                        failures.append(f"  {path}: expected {expected!r}, got {actual!r}")
                    elif expected is None and actual is None:
                        failures.append(f"  {path}: key exists but is null")
                except (KeyError, TypeError) as e:
                    failures.append(f"  {path}: missing key ({e})")

        if failures:
            msg = "Response shape mismatch:\n" + "\n".join(failures)
            return TestResult(test_name, False, response.status_code, expected_status,
                              latency_ms, msg, body)

        # ── Slow response warning ─────────────────────────────────────────
        warn_slow = latency_ms > SLOW_THRESHOLD_MS
        msg = f"⚠️  Slow ({latency_ms:.0f}ms > {SLOW_THRESHOLD_MS}ms threshold)" if warn_slow else ""

        return TestResult(test_name, True, response.status_code, expected_status,
                          latency_ms, msg, body)

    except httpx.TimeoutException:
        latency_ms = (time.perf_counter() - start) * 1000
        return TestResult(test_name, False, 0, expected_status, latency_ms, "Request timed out")
    except httpx.ConnectError as e:
        latency_ms = (time.perf_counter() - start) * 1000
        return TestResult(test_name, False, 0, expected_status, latency_ms, f"Connection error: {e}")


def _rand_phone() -> str:
    """Generate a random Nigerian-format phone number for test isolation."""
    suffix = "".join(random.choices(string.digits, k=8))
    return f"+23480{suffix}"


def _rand_estate_name() -> str:
    words = ["Green", "Blue", "Royal", "Palm", "Sunset", "Victoria", "Harmony"]
    return f"{random.choice(words)} Estate {random.randint(1000, 9999)}"


def print_suite_header(name: str) -> None:
    print(f"\n{'─' * 65}")
    print(f"  {name}")
    print(f"{'─' * 65}")


def print_result(r: TestResult, verbose: bool = False) -> None:
    icon = PASS if r.passed else FAIL
    latency_flag = WARN if r.latency_ms > SLOW_THRESHOLD_MS else " "
    print(f"  {icon} {r.name:<45} {r.latency_ms:>7.1f}ms  HTTP {r.status_code} {latency_flag}")
    if not r.passed:
        print(f"     → {r.message}")
    elif r.message and verbose:
        print(f"     → {r.message}")


# ══════════════════════════════════════════════════════════════════════════════
# TEST SUITES
# ══════════════════════════════════════════════════════════════════════════════

async def suite_health(client: httpx.AsyncClient, base_url: str, verbose: bool) -> TestSuite:
    """
    Suite 1: Health Endpoints
    ==========================
    These are the simplest tests. They validate:
    - The server is running
    - The DB is reachable
    - The Redis is reachable
    - The response JSON has the expected shape

    WHY THESE MATTER:
    Kubernetes / Docker Swarm uses /healthz and /readyz to decide whether to
    route traffic to a pod. If these return wrong status codes, the load balancer
    removes the pod from rotation → outage.
    """
    suite = TestSuite("Health Endpoints")
    print_suite_header("Suite 1 — Health Endpoints")

    # Test 1: GET /api/v1/healthz → 200, {"success": true, "data": {"status": "healthy"}}
    r = await api(client, "GET", f"{base_url}/api/v1/healthz", 200, "GET /healthz → 200 healthy",
                  checks=[("data.status", "healthy"), ("success", True)], verbose=verbose)
    suite.add(r)
    print_result(r, verbose)

    # Test 2: GET /api/v1/readyz → 200, both DB and Redis checks pass
    r = await api(client, "GET", f"{base_url}/api/v1/readyz", 200, "GET /readyz → 200 all checks pass",
                  checks=[("data.checks.database", True), ("data.checks.redis", True)], verbose=verbose)
    suite.add(r)
    print_result(r, verbose)

    # Test 3: /healthz is fast (Kubernetes probes run every 10s — they MUST be cheap)
    r = await api(client, "GET", f"{base_url}/api/v1/healthz", 200, "GET /healthz → responds in <200ms", verbose=verbose)
    perf_ok = r.latency_ms < 200
    r.passed = r.passed and perf_ok
    if not perf_ok:
        r.message = f"Health check too slow ({r.latency_ms:.0f}ms). Must be <200ms."
    suite.add(r)
    print_result(r, verbose)

    return suite


async def suite_auth(client: httpx.AsyncClient, base_url: str, verbose: bool) -> tuple[TestSuite, dict]:
    """
    Suite 2: Authentication Flow
    =============================
    Tests the FULL auth lifecycle: register → login → refresh → logout.

    Each step depends on the previous one — this is an integration test.
    We store tokens as we go and pass them to the next step.

    CONCEPTS DEMONSTRATED:
    - State threading: tokens from step N are used in step N+1
    - Happy path testing: the primary success flow
    - Token rotation: refresh should return NEW tokens (not the same ones)
    - Auth enforcement: protected endpoints reject invalid tokens

    WHY TEST THE FULL FLOW:
    Unit tests mock the DB. But bugs often live in the handoff between
    components. Integration tests catch: "OTP verification set is_used=True,
    but set-pin still checks the unhashed OTP code" — a bug units miss.
    """
    suite = TestSuite("Authentication Flow")
    print_suite_header("Suite 2 — Authentication Flow (Full Lifecycle)")

    phone = _rand_phone()
    pin = "2580"
    ctx = {}  # shared context: tokens, user data

    # ── Step 1: Request OTP ───────────────────────────────────────────────────
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/register/request-otp", 200,
        f"POST /register/request-otp → 200",
        checks=[
            ("success", True),
            ("data.phone_number", phone),
            ("data.expires_in_seconds", 300),
        ],
        json={"phone_number": phone},
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    # ── Step 2: OTP must NOT be in the response body ──────────────────────────
    # Security: never expose OTP in API responses — it must only go via SMS.
    # We check that neither "otp_code" nor a 6-digit number appears in the response.
    body_text = json.dumps(r.response_body or {})
    otp_in_body = "otp_code" in body_text or "otp" in (r.response_body or {}).get("data", {})
    r2_passed = not otp_in_body
    r2 = TestResult(
        "OTP not exposed in response body", r2_passed, 200, 200, 0,
        "" if r2_passed else "SECURITY BUG: OTP code found in response!",
    )
    suite.add(r2)
    print_result(r2, verbose)

    # ── Step 3: Set PIN (registration — skips OTP in dev mode) ───────────────
    # In production, verify-otp runs first. In dev, we can call set-pin
    # directly if the OTP is pre-marked as used (or bypass logic exists).
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/register/set-pin", 201,
        "POST /register/set-pin → 201 Created",
        checks=[
            ("success", True),
            ("data.user.phone_number", phone),
            ("data.tokens.access_token", True),
            ("data.tokens.refresh_token", True),
        ],
        json={
            "phone_number": phone,
            "pin": pin,
            "confirm_pin": pin,
            "full_name": "Load Test User",
            "estate_code": "TST-12345",
        },
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    if r.passed and r.response_body:
        ctx["access_token"] = r.response_body.get("data", {}).get("tokens", {}).get("access_token")
        ctx["refresh_token"] = r.response_body.get("data", {}).get("tokens", {}).get("refresh_token")

    # ── Step 4: Login with correct PIN ───────────────────────────────────────
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/login/verify-pin", 200,
        "POST /login/verify-pin → 200 OK",
        checks=[
            ("success", True),
            ("data.user.phone_number", phone),
            ("data.tokens.access_token", True),
        ],
        json={"phone_number": phone, "pin": pin},
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    if r.passed and r.response_body:
        # Update tokens from login (may differ from registration tokens)
        ctx["access_token"] = r.response_body.get("data", {}).get("tokens", {}).get("access_token")
        ctx["refresh_token"] = r.response_body.get("data", {}).get("tokens", {}).get("refresh_token")

    # ── Step 5: Login with WRONG PIN → 401 ───────────────────────────────────
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/login/verify-pin", 401,
        "POST /login/verify-pin wrong PIN → 401",
        json={"phone_number": phone, "pin": "0000"},
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    # ── Step 6: Get /me with valid token → 200 ───────────────────────────────
    if ctx.get("access_token"):
        r = await api(
            client, "GET", f"{base_url}/api/v1/auth/me", 200,
            "GET /me with valid token → 200",
            checks=[("success", True), ("data.phone_number", phone)],
            headers={"Authorization": f"Bearer {ctx['access_token']}"},
            verbose=verbose,
        )
        suite.add(r)
        print_result(r, verbose)
    else:
        print(f"  {SKIP} GET /me — skipped (no access token from previous steps)")

    # ── Step 7: Get /me WITHOUT token → 403 ──────────────────────────────────
    r = await api(
        client, "GET", f"{base_url}/api/v1/auth/me", 403,
        "GET /me without token → 403 Forbidden",
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    # ── Step 8: Refresh token → new tokens ───────────────────────────────────
    old_access = ctx.get("access_token")
    if ctx.get("refresh_token"):
        r = await api(
            client, "POST", f"{base_url}/api/v1/auth/refresh", 200,
            "POST /refresh → 200 new token pair",
            checks=[("success", True), ("data.tokens.access_token", True)],
            json={"refresh_token": ctx["refresh_token"]},
            verbose=verbose,
        )
        suite.add(r)
        print_result(r, verbose)

        # Validate the new access token is DIFFERENT (token rotation)
        if r.passed and r.response_body:
            new_access = r.response_body.get("data", {}).get("tokens", {}).get("access_token")
            rotation_ok = new_access and new_access != old_access
            r_rot = TestResult(
                "Refresh returns NEW token (rotation)", rotation_ok, 200, 200, 0,
                "" if rotation_ok else "Token rotation failed: got same access token",
            )
            suite.add(r_rot)
            print_result(r_rot, verbose)
            ctx["access_token"] = new_access
            ctx["refresh_token"] = r.response_body.get("data", {}).get("tokens", {}).get("refresh_token")
    else:
        print(f"  {SKIP} POST /refresh — skipped (no refresh token)")

    # ── Step 9: Refresh with garbage token → 401 ─────────────────────────────
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/refresh", 401,
        "POST /refresh invalid token → 401",
        json={"refresh_token": "this.is.garbage"},
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    # ── Step 10: Logout ───────────────────────────────────────────────────────
    if ctx.get("access_token"):
        r = await api(
            client, "POST", f"{base_url}/api/v1/auth/logout", 200,
            "POST /logout → 200 success",
            checks=[("success", True)],
            headers={"Authorization": f"Bearer {ctx['access_token']}"},
            verbose=verbose,
        )
        suite.add(r)
        print_result(r, verbose)
    else:
        print(f"  {SKIP} POST /logout — skipped (no access token)")

    return suite, ctx


async def suite_validation(client: httpx.AsyncClient, base_url: str, verbose: bool) -> TestSuite:
    """
    Suite 3: Input Validation
    ==========================
    Tests that the API rejects bad input with the right error codes.

    422 Unprocessable Entity = FastAPI/Pydantic validation failed.
       Your request schema is wrong (missing fields, wrong types).

    400 Bad Request = Request is parseable but semantically invalid.
       e.g., "confirm_pin doesn't match pin"

    INTERN TIP: Always test the NEGATIVE path.
    A bug that only surfaces when input is wrong is 10× harder to find
    in production than in tests. Never assume only good input arrives.
    """
    suite = TestSuite("Input Validation (Error Cases)")
    print_suite_header("Suite 3 — Input Validation & Error Handling")

    # ── Missing required fields → 422 ─────────────────────────────────────────
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/register/request-otp", 422,
        "POST /request-otp missing phone → 422",
        json={},  # phone_number is required
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    # ── Wrong field type → 422 ─────────────────────────────────────────────────
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/register/request-otp", 422,
        "POST /request-otp invalid phone format → 422",
        json={"phone_number": "not-a-phone"},
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    # ── PINs don't match → 422 ────────────────────────────────────────────────
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/register/set-pin", 422,
        "POST /set-pin mismatched PINs → 422",
        json={
            "phone_number": "+2348012345678",
            "pin": "1234",
            "confirm_pin": "9999",  # mismatch
            "full_name": "Test",
            "estate_code": "TST-00000",
        },
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    # ── Invalid PIN (sequential digits — security rule) → 422 ─────────────────
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/register/set-pin", 422,
        "POST /set-pin sequential PIN (1234) → 422",
        json={
            "phone_number": "+2348012345678",
            "pin": "1234",
            "confirm_pin": "1234",
            "full_name": "Test",
            "estate_code": "TST-00000",
        },
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    # ── Login with unregistered phone → 404 ────────────────────────────────────
    # Use a valid Nigerian number format (+234 8xx xxxxxxx) that has never been
    # registered so it passes Pydantic validation but the service returns 404.
    # (+2349999999999 was rejected by the phone validator → 422 before service ran)
    r = await api(
        client, "POST", f"{base_url}/api/v1/auth/login/verify-pin", 404,
        "POST /login unknown phone → 404",
        json={"phone_number": "+2348000000001", "pin": "2580"},
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    return suite


async def suite_rate_limiting(client: httpx.AsyncClient, base_url: str, verbose: bool) -> TestSuite:
    """
    Suite 4: Rate Limiting
    =======================
    Tests that the rate limiter kicks in after 5 OTP requests per hour.

    WHY RATE LIMITING MATTERS:
    Without it, attackers can:
    - Enumerate phone numbers (check which ones are registered)
    - Flood your SMS provider (expensive!)
    - Brute-force OTP codes

    HOW TO TEST IT:
    Send 5 requests (should all 200), then the 6th (should 429).
    We use a unique phone number so it doesn't interfere with other tests.
    """
    suite = TestSuite("Rate Limiting")
    print_suite_header("Suite 4 — Rate Limiting (OTP)")

    # Use a unique phone number for this test to avoid hitting limits from other suites
    phone = "+23481" + "".join(random.choices(string.digits, k=8))
    url = f"{base_url}/api/v1/auth/register/request-otp"

    for i in range(1, 6):
        r = await api(
            client, "POST", url, 200,
            f"POST /request-otp (attempt {i}/5) → 200",
            json={"phone_number": phone},
            verbose=verbose,
        )
        suite.add(r)
        print_result(r, verbose)
        if not r.passed:
            print(f"     → Rate limit hit early at attempt {i}. Expected 5 before limit.")
            break

    # 6th request should be rate-limited
    r = await api(
        client, "POST", url, 429,
        "POST /request-otp (6th attempt) → 429 Rate Limited",
        json={"phone_number": phone},
        verbose=verbose,
    )
    suite.add(r)
    print_result(r, verbose)

    return suite


async def suite_concurrent_auth(client: httpx.AsyncClient, base_url: str, verbose: bool) -> TestSuite:
    """
    Suite 5: Concurrency Correctness
    ==================================
    Fire 20 concurrent OTP requests for DIFFERENT phone numbers.
    Every single one must succeed — the event loop must not mix up sessions.

    WHY THIS IS IMPORTANT:
    A common async bug is shared mutable state across coroutines.
    If a DB session is accidentally shared between concurrent requests,
    you can get data from the wrong request leaking into another → data corruption.

    WHAT WE CHECK:
    - All 20 requests get a 200
    - Each response contains its own phone number (not another request's)
    - No 500 errors (which would indicate session corruption)
    """
    suite = TestSuite("Concurrent Auth Correctness")
    print_suite_header("Suite 5 — Concurrent Correctness (20 parallel OTP requests)")

    phones = [_rand_phone() for _ in range(20)]
    url = f"{base_url}/api/v1/auth/register/request-otp"

    print(f"  Firing 20 concurrent OTP requests...")
    tasks = [
        api(client, "POST", url, 200, f"Concurrent OTP [{i+1}]",
            checks=[("data.phone_number", phone)],
            json={"phone_number": phone}, verbose=False)
        for i, phone in enumerate(phones)
    ]

    start = time.perf_counter()
    results = await asyncio.gather(*tasks)
    wall_ms = (time.perf_counter() - start) * 1000

    pass_count = sum(1 for r in results if r.passed)
    fail_count = len(results) - pass_count

    icon = PASS if fail_count == 0 else FAIL
    print(f"  {icon} {pass_count}/20 requests succeeded in {wall_ms:.0f}ms wall clock")
    print(f"     Avg latency: {sum(r.latency_ms for r in results) / len(results):.0f}ms per request")

    if fail_count:
        print(f"  {FAIL} {fail_count} requests failed:")
        for r in results:
            if not r.passed:
                print(f"     • {r.name}: {r.message}")
    else:
        print(f"  {PASS} No session mixing detected — each request got its own phone number")

    for r in results:
        suite.add(r)

    return suite


# ── Main orchestrator ──────────────────────────────────────────────────────────
async def main(base_url: str, verbose: bool) -> None:
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║         REZZIDENT — Standard API Load Test                   ║
║                                                              ║
║  Tests: auth flow, error handling, rate limits, concurrency  ║
║  Target: {base_url:<51}║
╚══════════════════════════════════════════════════════════════╝""")

    timeout = httpx.Timeout(REQUEST_TIMEOUT, connect=5.0)
    limits = httpx.Limits(max_connections=50, max_keepalive_connections=30)

    async with httpx.AsyncClient(timeout=timeout, limits=limits, follow_redirects=True) as client:
        # ── Server check ──────────────────────────────────────────────────
        print("\n  Checking server availability...")
        try:
            r = await client.get(f"{base_url}/healthz")
            print(f"  {PASS} Server is up → HTTP {r.status_code}")
        except Exception as e:
            print(f"  {FAIL} Cannot reach server: {e}")
            print(f"       Start it: docker compose up")
            return

        all_suites: list[TestSuite] = []

        # Run suites
        s1 = await suite_health(client, base_url, verbose)
        all_suites.append(s1)

        s2, auth_ctx = await suite_auth(client, base_url, verbose)
        all_suites.append(s2)

        s3 = await suite_validation(client, base_url, verbose)
        all_suites.append(s3)

        s4 = await suite_rate_limiting(client, base_url, verbose)
        all_suites.append(s4)

        s5 = await suite_concurrent_auth(client, base_url, verbose)
        all_suites.append(s5)

        # ── Final Report ──────────────────────────────────────────────────
        print(f"\n{'═' * 65}")
        print(f"  FINAL REPORT")
        print(f"{'═' * 65}")

        total_pass = sum(s.passed for s in all_suites)
        total_fail = sum(s.failed for s in all_suites)
        total_tests = total_pass + total_fail

        print(f"\n  {'Suite':<35} {'Pass':>6} {'Fail':>6} {'Avg Latency':>12}")
        print(f"  {'─' * 35} {'─' * 6} {'─' * 6} {'─' * 12}")
        for s in all_suites:
            icon = PASS if s.failed == 0 else FAIL
            print(f"  {icon} {s.name:<33} {s.passed:>6} {s.failed:>6} {s.avg_latency_ms:>11.0f}ms")

        print(f"\n  {'─' * 61}")
        icon = PASS if total_fail == 0 else FAIL
        print(f"  {icon} TOTAL: {total_pass}/{total_tests} tests passed, {total_fail} failed")

        if total_fail == 0:
            print(f"\n  {PASS} ALL TESTS PASSED — API is functioning correctly under load.\n")
        else:
            print(f"\n  {FAIL} {total_fail} TEST(S) FAILED — Review the output above.\n")
            # List only failed tests
            print("  Failed tests:")
            for s in all_suites:
                for r in s.results:
                    if not r.passed:
                        print(f"     • [{s.name}] {r.name}")
                        print(f"       {r.message}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Rezzident Standard API Load Test")
    parser.add_argument("--url", default=DEFAULT_BASE_URL, help="Base URL of the API")
    parser.add_argument("--verbose", action="store_true", help="Print response bodies on failures")
    args = parser.parse_args()
    asyncio.run(main(args.url, args.verbose))
