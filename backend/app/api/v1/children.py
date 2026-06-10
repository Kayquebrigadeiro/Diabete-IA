from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user_id
from app.core.database import get_session
from app.schemas.entities import ChildCreate, ChildResponse, ChildUpdate
from app.services.medical_services import ChildService

router = APIRouter(prefix="/children", tags=["children"])
service = ChildService()


@router.post("", response_model=ChildResponse)
async def create(payload: ChildCreate, current_user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_session)):
    return await service.create(session, UUID(current_user_id), payload)


@router.get("", response_model=list[ChildResponse])
async def list_children(current_user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_session)):
    return await service.list_for_user(session, UUID(current_user_id))
