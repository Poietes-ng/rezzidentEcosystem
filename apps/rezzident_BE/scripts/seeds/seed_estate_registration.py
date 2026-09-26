"""Seed script to register a new estate via the API.

Usage: python scripts/seeds/seed_estate_registration.py
"""

import json
import urllib.error
import urllib.request

# Update the base URL if your server runs on a different host/port
API_BASE_URL = "http://localhost:7001"
REGISTER_ENDPOINT = f"{API_BASE_URL}/api/v1/estates/register"

PAYLOAD = {
    "name": "Chevy View Estate",
    "address": "123 Admiralty Way, Lekki Phase 1",
    "state": "Lagos",
    "local_government": "Eti-Osa",
    "management_type": "community",
    "structure_template_id": "block_floor_flat",
    "number_of_units": 300,
    "settlement_account_number": "0123456789",
    "settlement_bank_name": "Access Bank",
    "settlement_account_name": "Chevy View Estate Association",
    "stakeholders": [
        {
            "full_name": "John Doe",
            "phone_number": "+2348012345678",
            "email": "john@example.com",
            "role_title": "stakeholder",
            "is_primary": True,
        },
        {
            "full_name": "Jane Smith",
            "phone_number": "+2348023456789",
            "email": "jane@example.com",
            "role_title": "stakeholder",
            "is_primary": False,
        },
    ],
}


def seed_estate():
    print(f"\n🏢 Seeding estate registration via {REGISTER_ENDPOINT}\n")

    data = json.dumps(PAYLOAD).encode("utf-8")
    req = urllib.request.Request(
        REGISTER_ENDPOINT,
        data=data,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            response_body = response.read().decode("utf-8")

            print(f"✅ Success! (Status Code: {status_code})")
            print("Response Data:")
            print(json.dumps(json.loads(response_body), indent=2))

    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error (Status Code: {e.code})")
        error_body = e.read().decode("utf-8")
        try:
            print(json.dumps(json.loads(error_body), indent=2))
        except json.JSONDecodeError:
            print(error_body)
    except urllib.error.URLError as e:
        print(f"❌ URL Error: Failed to reach the server. Is the API running on {API_BASE_URL}?")
        print(e.reason)
    except Exception as e:
        print(f"❌ Unexpected Error: {str(e)}")


if __name__ == "__main__":
    seed_estate()
