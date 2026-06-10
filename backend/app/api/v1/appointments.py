from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.entities import AppointmentCancelRequest, AppointmentCreate, AppointmentResponse, AppointmentRescheduleRequest, AppointmentUpdate
from app.services.medical_services import AppointmentService

router = APIRouter(prefix="/appointments", tags=["appointments"])
service = AppointmentService()


@router.post("", response_model=AppointmentResponse)
async def create(payload: AppointmentCreate, session: AsyncSession = Depends(get_session)):
    return await service.create(session, payload)


@router.get("", response_model=list[AppointmentResponse])
async def list_appointments(child_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.list_for_child(session, child_id)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(appointment_id: UUID, payload: AppointmentUpdate, session: AsyncSession = Depends(get_session)):
    return await service.update(session, appointment_id, payload.model_dump(exclude_unset=True))


@router.put("/{appointment_id}/reschedule", response_model=AppointmentResponse)
async def reschedule(appointment_id: UUID, payload: AppointmentRescheduleRequest, session: AsyncSession = Depends(get_session)):
    return await service.reschedule(session, appointment_id, payload.new_time, payload.reason)


@router.put("/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel(appointment_id: UUID, payload: AppointmentCancelRequest, session: AsyncSession = Depends(get_session)):
    return await service.cancel(session, appointment_id, payload.reason)


@router.delete("/{appointment_id}", response_model=AppointmentResponse)
async def delete_appointment(appointment_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.delete(session, appointment_id)
