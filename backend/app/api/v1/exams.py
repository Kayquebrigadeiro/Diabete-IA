from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.entities import ExamCreate, ExamResponse, ExamResultCreate, ExamResultResponse
from app.services.medical_services import ExamService

router = APIRouter(prefix="/exams", tags=["exams"])
service = ExamService()


@router.post("", response_model=ExamResponse)
async def create(payload: ExamCreate, session: AsyncSession = Depends(get_session)):
    return await service.create(session, payload)


@router.post("/{exam_id}/results", response_model=ExamResultResponse)
async def add_result(payload: ExamResultCreate, session: AsyncSession = Depends(get_session)):
    return await service.add_result(session, payload)

