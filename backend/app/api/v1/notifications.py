from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user_id
from app.core.database import get_session
from app.schemas.entities import NotificationResponse
from app.services.medical_services import NotificationService

router = APIRouter(prefix="/notifications", tags=["notifications"])
service = NotificationService()


@router.get("", response_model=list[NotificationResponse])
async def list_notifications(current_user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_session)):
    return await service.list_for_user(session, UUID(current_user_id))


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(notification_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.mark_as_read(session, notification_id)


@router.delete("/{notification_id}", response_model=NotificationResponse)
async def delete_notification(notification_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.delete(session, notification_id)
