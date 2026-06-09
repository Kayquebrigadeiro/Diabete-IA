from fastapi import Request
from fastapi.responses import JSONResponse


class BaseAppException(Exception):
    status_code = 400
    code = "APP_ERROR"

    def __init__(self, message: str, details: list[dict] | None = None):
        self.message = message
        self.details = details or []


class NotFoundException(BaseAppException):
    status_code = 404
    code = "NOT_FOUND"


class ForbiddenException(BaseAppException):
    status_code = 403
    code = "FORBIDDEN"


class ValidationException(BaseAppException):
    status_code = 422
    code = "VALIDATION_ERROR"


async def app_exception_handler(_: Request, exc: BaseAppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message, "details": exc.details}},
    )

