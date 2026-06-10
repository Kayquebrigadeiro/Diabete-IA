from fastapi import APIRouter, Depends, HTTPException
import traceback
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.auth import LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
service = AuthService()


@router.post("/register")
async def register(payload: RegisterRequest, session: AsyncSession = Depends(get_session)):
    try:
        user = await service.register(session, payload)
        return {"id": str(user.id), "email": user.email, "name": user.name}
    except Exception as e:
        try:
            await session.rollback()
        except Exception:
            pass
        error_detalhado = "".join(traceback.format_exception(type(e), e, e.__traceback__))
        print("=== ERRO DETALHADO CRÍTICO ===\n" + error_detalhado)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_session)):
    return await service.login(session, payload)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest):
    return await service.refresh(payload)


@router.post("/logout")
async def logout(payload: LogoutRequest):
    await service.logout(payload.token)
    return {"status": "ok"}

