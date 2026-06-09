from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user_id
from app.core.database import get_session
from app.schemas.entities import ChatAnswer, ChatQuery, ChatSessionCreate, ChatSessionResponse, ChatMessageResponse
from app.services.medical_services import ChatService
from app.services.rag_service import RAGService

router = APIRouter(prefix="/chat", tags=["chat"])
service = ChatService()
rag_service = RAGService()


@router.post("/sessions", response_model=ChatSessionResponse)
async def create_session(payload: ChatSessionCreate, current_user_id: str = Depends(get_current_user_id), session: AsyncSession = Depends(get_session)):
    return await service.create_session(session, UUID(current_user_id), payload.title)


@router.post("/sessions/{session_id}/messages", response_model=ChatAnswer)
async def send_message(session_id: UUID, payload: ChatQuery, session: AsyncSession = Depends(get_session)):
    payload.session_id = session_id
    return await rag_service.answer(session, payload)


@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
async def history(session_id: UUID, session: AsyncSession = Depends(get_session)):
    return await service.message_repo.list(session, service.message_repo.model.session_id == session_id)
