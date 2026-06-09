from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.repositories.base import CRUDRepository
from app.models.entities import Document
from app.schemas.entities import DocumentResponse
from app.services.medical_services import DocumentService
from app.services.rag_service import RAGService

router = APIRouter(prefix="/documents", tags=["documents"])
service = DocumentService()
rag = RAGService()


@router.post("/upload", response_model=DocumentResponse)
async def upload(file: UploadFile = File(...), session: AsyncSession = Depends(get_session)):
    contents = await file.read()
    import tempfile
    from pathlib import Path

    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp:
        tmp.write(contents)
        temp_path = tmp.name
    document = await rag.ingest_file(session, temp_path, file.filename, file.filename.rsplit(".", 1)[0])
    return document


@router.get("", response_model=list[DocumentResponse])
async def list_documents(session: AsyncSession = Depends(get_session)):
    return await service.repo.list(session)

