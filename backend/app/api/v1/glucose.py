from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.entities import GlucoseRecordCreate, GlucoseRecordResponse
from app.services.medical_services import GlucoseService
from uuid import UUID

router = APIRouter(prefix="/glucose", tags=["glucose"])
service = GlucoseService()


@router.post("", response_model=GlucoseRecordResponse)
async def create(payload: GlucoseRecordCreate, session: AsyncSession = Depends(get_session)):
    return await service.create(session, payload)


@router.get("", response_model=list[GlucoseRecordResponse])
async def list_glucose(child_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.list_for_child(session, child_id)
