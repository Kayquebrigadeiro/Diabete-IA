from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.repositories.base import CRUDRepository
from app.models.entities import Medication
from app.schemas.entities import MedicationCreate, MedicationResponse, MedicationUpdate
from app.services.medical_services import MedicationService

router = APIRouter(prefix="/medications", tags=["medications"])
service = MedicationService()


@router.post("", response_model=MedicationResponse)
async def create(payload: MedicationCreate, session: AsyncSession = Depends(get_session)):
    return await service.create(session, payload)


@router.get("", response_model=list[MedicationResponse])
async def list_medications(child_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.list_for_child(session, child_id)


@router.put("/{medication_id}", response_model=MedicationResponse)
async def update_medication(medication_id: str, payload: MedicationUpdate, session: AsyncSession = Depends(get_session)):
    return await service.update(session, medication_id, payload.model_dump(exclude_unset=True))


@router.delete("/{medication_id}", response_model=MedicationResponse)
async def delete_medication(medication_id: str, session: AsyncSession = Depends(get_session)):
    return await service.delete(session, medication_id)
