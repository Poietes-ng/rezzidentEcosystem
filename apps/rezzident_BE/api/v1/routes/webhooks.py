"""Paystack webhook route — receives payment notifications.

Reference: docs/architecture/22-payment-split-architecture.md
"""

import hashlib
import hmac

from fastapi import APIRouter, HTTPException, Request, status

from api.loggers.app_logger import app_logger
from api.utils.settings import settings

webhooks = APIRouter(prefix="/webhooks", tags=["Webhooks"])


def _verify_paystack_signature(payload: bytes, signature: str) -> bool:
    """Verify Paystack webhook signature using HMAC SHA512.

    Paystack signs every webhook payload with your secret key.
    We must verify the signature before processing.
    """
    expected = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode("utf-8"),
        payload,
        hashlib.sha512,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


@webhooks.post("/paystack", status_code=status.HTTP_200_OK)
async def paystack_webhook(request: Request):
    """Handle Paystack webhook events.

    Events handled:
    - charge.success: Payment completed
    - transfer.success: Settlement completed
    - refund.processed: Refund completed

    IMPORTANT: Always return 200 quickly. Process asynchronously.
    """
    # Verify signature
    signature = request.headers.get("X-Paystack-Signature", "")
    payload = await request.body()

    if not _verify_paystack_signature(payload, signature):
        app_logger.warning("Paystack webhook: Invalid signature")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid webhook signature.",
        )

    # Parse event
    import json

    try:
        event = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload.",
        )

    event_type = event.get("event")
    data = event.get("data", {})

    app_logger.info(f"Paystack webhook received: {event_type}")

    # Route to appropriate handler
    if event_type == "charge.success":
        # TODO: Update payment status, record in payment_ledger
        app_logger.info(
            f"Payment success: ref={data.get('reference')}, " f"amount={data.get('amount')}"
        )

    elif event_type == "transfer.success":
        # TODO: Update settlement status in payment_ledger
        app_logger.info(f"Transfer success: ref={data.get('reference')}")

    elif event_type == "refund.processed":
        # TODO: Handle refund
        app_logger.info(f"Refund processed: ref={data.get('reference')}")

    else:
        app_logger.info(f"Unhandled Paystack event: {event_type}")

    # Always return 200 to acknowledge receipt
    return {"status": "ok"}
