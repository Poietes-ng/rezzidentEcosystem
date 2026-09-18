from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


def success_response(status_code: int, message: str, data: dict | None = None):
    """Returns a JSON response for success responses.

    Standard API envelope format:
    {
        "status_code": 200,
        "success": True,
        "message": "...",
        "data": { ... }
    }
    """

    response_data = {"status_code": status_code, "success": True, "message": message}

    if data is not None:
        response_data["data"] = data

    return JSONResponse(status_code=status_code, content=jsonable_encoder(response_data))
