from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import ForbiddenException
from app.core.security import decode_token

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user_id(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)):
    if credentials is None:
        raise ForbiddenException("Autenticação obrigatória")
    payload = decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise ForbiddenException("Token inválido")
    return payload["sub"]

