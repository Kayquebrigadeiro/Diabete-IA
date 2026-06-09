from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user_id
from app.core.database import get_session
from app.schemas.entities import UserResponse, UserUpdate
from app.services.medical_services import UserService

router = APIRouter(prefix="/users", tags=["users"])
service = UserService()


@router.get("/me", response_model=UserResponse)
async def me(current_user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_session)):
    return await service.me(session, UUID(current_user_id))


@router.put("/me", response_model=UserResponse)
async def update_me(payload: UserUpdate, current_user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_session)):
    return await service.update_me(session, UUID(current_user_id), payload.model_dump(exclude_unset=True))


@router.delete("/me", response_model=UserResponse)
async def delete_me(current_user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_session)):
    return await service.delete_me(session, UUID(current_user_id))
