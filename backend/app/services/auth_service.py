from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenException, ValidationException
from app.core.security import create_access_token, create_refresh_token, hash_password, revoke_token, verify_password
from app.models.entities import User
from app.repositories.base import CRUDRepository
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse


class AuthService:
    def __init__(self) -> None:
        self.repo = CRUDRepository(User)

    async def register(self, session: AsyncSession, payload: RegisterRequest) -> User:
        existing = await session.execute(select(User).where(User.email == payload.email))
        if existing.scalar_one_or_none():
            raise ValidationException("E-mail já cadastrado")
        return await self.repo.create(
            session,
            {
                "name": payload.name,
                "email": payload.email,
                "phone": payload.phone,
                "password_hash": hash_password(payload.password),
            },
        )

    async def login(self, session: AsyncSession, payload: LoginRequest) -> TokenResponse:
        result = await session.execute(select(User).where(User.email == payload.email, User.deleted_at.is_(None)))
        user = result.scalar_one_or_none()
        if user is None or not verify_password(payload.password, user.password_hash):
            raise ForbiddenException("Credenciais inválidas")
        return TokenResponse(
            user_id=str(user.id),
            access_token=create_access_token(str(user.id), {"email": user.email}),
            refresh_token=create_refresh_token(str(user.id), {"email": user.email}),
        )

    async def refresh(self, payload: RefreshRequest) -> TokenResponse:
        from app.core.security import decode_token

        data = decode_token(payload.refresh_token)
        if data.get("type") != "refresh":
            raise ForbiddenException("Token inválido")
        subject = data["sub"]
        return TokenResponse(
            user_id=subject,
            access_token=create_access_token(subject),
            refresh_token=create_refresh_token(subject),
        )

    async def logout(self, token: str) -> None:
        revoke_token(token)
