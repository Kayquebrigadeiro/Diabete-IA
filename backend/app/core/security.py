from datetime import UTC, datetime, timedelta
from hashlib import sha256
from uuid import uuid4

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()
revoked_jti: set[str] = set()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _create_token(subject: str, token_type: str, expires_delta: timedelta, extra: dict | None = None) -> str:
    now = datetime.now(UTC)
    jti = str(uuid4())
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
        "jti": jti,
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_access_token(subject: str, extra: dict | None = None) -> str:
    return _create_token(subject, "access", timedelta(minutes=settings.access_token_expire_minutes), extra)


def create_refresh_token(subject: str, extra: dict | None = None) -> str:
    return _create_token(subject, "refresh", timedelta(days=settings.refresh_token_expire_days), extra)


def decode_token(token: str) -> dict:
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    if payload.get("jti") in revoked_jti:
        raise JWTError("Token revoked")
    return payload


def revoke_token(token: str) -> None:
    payload = jwt.get_unverified_claims(token)
    jti = payload.get("jti")
    if jti:
        revoked_jti.add(jti)


def token_fingerprint(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()

