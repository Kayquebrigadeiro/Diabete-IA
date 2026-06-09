from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.entities import MedicationLogCreate, MedicationLogResponse
from app.services.medical_services import MedicationLogService

router = APIRouter(prefix="/logs", tags=["logs"])
service = MedicationLogService()


@router.post("", response_model=MedicationLogResponse)
async def create(payload: MedicationLogCreate, session: AsyncSession = Depends(get_session)):
    return await service.create(session, payload)

