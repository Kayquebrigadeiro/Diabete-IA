from fastapi import FastAPI, Request

from app.core.exceptions import BaseAppException, app_exception_handler


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(BaseAppException, app_exception_handler)

