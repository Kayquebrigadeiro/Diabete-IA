from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.entities import MedicationScheduleCreate, MedicationScheduleResponse, MedicationScheduleUpdate
from app.services.medical_services import MedicationScheduleService

router = APIRouter(prefix="/schedules", tags=["schedules"])
service = MedicationScheduleService()


@router.post("", response_model=MedicationScheduleResponse)
async def create(payload: MedicationScheduleCreate, session: AsyncSession = Depends(get_session)):
    return await service.create(session, payload)


@router.get("", response_model=list[MedicationScheduleResponse])
async def list_schedules(child_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.list_for_child(session, child_id)


@router.put("/{schedule_id}", response_model=MedicationScheduleResponse)
async def update_schedule(schedule_id: UUID, payload: MedicationScheduleUpdate, session: AsyncSession = Depends(get_session)):
    return await service.update(session, schedule_id, payload.model_dump(exclude_unset=True))


@router.delete("/{schedule_id}", response_model=MedicationScheduleResponse)
async def delete_schedule(schedule_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.delete(session, schedule_id)
