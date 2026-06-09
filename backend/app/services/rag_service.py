from __future__ import annotations

import hashlib
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from uuid import UUID, uuid4

import fitz
import httpx
import chromadb
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import ValidationException
from app.models.entities import ChatMessage, ChatSession, Document, DocumentChunk
from app.repositories.base import CRUDRepository
from app.schemas.entities import ChatAnswer, ChatQuery, SourceCitation

settings = get_settings()


class LocalEmbedder:
    def __init__(self, dimensions: int = 384) -> None:
        self.dimensions = dimensions

    def embed(self, text: str) -> list[float]:
        buckets = [0.0] * self.dimensions
        for token in text.lower().split():
            idx = int(hashlib.sha256(token.encode("utf-8")).hexdigest(), 16) % self.dimensions
            buckets[idx] += 1.0
        norm = sum(value * value for value in buckets) ** 0.5 or 1.0
        return [value / norm for value in buckets]


@dataclass
class SearchHit:
    document_id: UUID
    chunk_id: UUID
    content: str
    distance: float
    document_title: str
    chunk_index: int


class RAGService:
    def __init__(self) -> None:
        self.document_repo = CRUDRepository(Document)
        self.chunk_repo = CRUDRepository(DocumentChunk)
        self.session_repo = CRUDRepository(ChatSession)
        self.message_repo = CRUDRepository(ChatMessage)
        self.embedder = LocalEmbedder()
        self.client = chromadb.PersistentClient(path=settings.chroma_path)
        self.collection = self.client.get_or_create_collection(name="diabetes_guardian")

    def _chunk_text(self, text: str, chunk_size: int = 1200, overlap: int = 200) -> list[str]:
        chunks: list[str] = []
        start = 0
        while start < len(text):
            end = min(len(text), start + chunk_size)
            chunks.append(text[start:end].strip())
            if end == len(text):
                break
            start = max(0, end - overlap)
        return [chunk for chunk in chunks if chunk]

    def _extract_pdf(self, file_path: str) -> str:
        doc = fitz.open(file_path)
        try:
            pages = [page.get_text() for page in doc]
        finally:
            doc.close()
        return "\n".join(pages)

    async def ingest_file(self, session: AsyncSession, file_path: str, filename: str, title: str, source_organization: str | None = None) -> Document:
        text = self._extract_pdf(file_path) if file_path.lower().endswith(".pdf") else Path(file_path).read_text(encoding="utf-8")
        file_hash = hashlib.sha256(Path(file_path).read_bytes()).hexdigest()
        document = await self.document_repo.create(
            session,
            {
                "filename": filename,
                "title": title,
                "source_organization": source_organization,
                "file_hash": file_hash,
            },
        )
        for index, chunk in enumerate(self._chunk_text(text)):
            vector_id = str(uuid4())
            embedding = self.embedder.embed(chunk)
            self.collection.add(ids=[vector_id], documents=[chunk], embeddings=[embedding], metadatas=[{"document_id": str(document.id), "chunk_index": index, "title": title}])
            await self.chunk_repo.create(
                session,
                {
                    "document_id": document.id,
                    "chunk_index": index,
                    "content": chunk,
                    "vector_id": vector_id,
                },
            )
        return document

    async def search(self, query: str, top_k: int = 5) -> list[SearchHit]:
        embedding = self.embedder.embed(query)
        results = self.collection.query(query_embeddings=[embedding], n_results=top_k, include=["documents", "metadatas", "distances"])
        hits: list[SearchHit] = []
        for i, document in enumerate(results.get("documents", [[]])[0]):
            metadata = results["metadatas"][0][i]
            hits.append(
                SearchHit(
                    document_id=UUID(metadata["document_id"]),
                    chunk_id=UUID(self.collection.get(ids=[results["ids"][0][i]], include=[]).get("ids")[0]),
                    content=document,
                    distance=float(results["distances"][0][i]),
                    document_title=metadata.get("title", ""),
                    chunk_index=int(metadata.get("chunk_index", 0)),
                )
            )
        return hits

    async def answer(self, session: AsyncSession, payload: ChatQuery) -> ChatAnswer:
        if payload.session_id is not None:
            await self.message_repo.create(
                session,
                {
                    "session_id": payload.session_id,
                    "sender": "USER",
                    "message_text": payload.message,
                    "confidence_score": None,
                    "citations": None,
                },
            )
        hits = await self.search(payload.message, top_k=5)
        if not hits:
            answer = ChatAnswer(
                answer="Não encontrei informações confiáveis sobre este assunto na minha base de conhecimento oficial. Para sua segurança, recomendo consultar a equipe médica que acompanha a criança.",
                confidence_score=0.0,
                confidence_label="Baixa",
                fallback=True,
            )
            if payload.session_id is not None:
                await self.message_repo.create(
                    session,
                    {
                        "session_id": payload.session_id,
                        "sender": "AI",
                        "message_text": answer.answer,
                        "confidence_score": answer.confidence_score,
                        "citations": [f"{item.document}#{item.chunk_index}" for item in answer.citations],
                    },
                )
            return answer
        top_hits = hits[:3]
        avg_distance = sum(hit.distance for hit in top_hits) / len(top_hits)
        similarity = max(0.0, 1.0 - avg_distance)
        citations = [
            SourceCitation(document=hit.document_title or "Documento", chunk_index=hit.chunk_index, excerpt=hit.content[:180])
            for hit in top_hits
        ]
        confidence_score = round(min(1.0, max(0.0, similarity * 0.8 + 0.2)), 2)
        if confidence_score < 0.7:
            answer = ChatAnswer(
                answer="Não encontrei informações confiáveis sobre este assunto na minha base de conhecimento oficial. Para sua segurança, recomendo consultar a equipe médica que acompanha a criança.",
                confidence_score=confidence_score,
                confidence_label="Baixa",
                citations=citations,
                fallback=True,
            )
            if payload.session_id is not None:
                await self.message_repo.create(
                    session,
                    {
                        "session_id": payload.session_id,
                        "sender": "AI",
                        "message_text": answer.answer,
                        "confidence_score": answer.confidence_score,
                        "citations": [f"{item.document}#{item.chunk_index}" for item in answer.citations],
                    },
                )
            return answer
        prompt_context = "\n\n".join(f"[{c.document} #{c.chunk_index}] {c.excerpt}" for c in citations)
        answer = await self._call_deepseek(payload.message, prompt_context)
        result = ChatAnswer(
            answer=answer,
            confidence_score=confidence_score,
            confidence_label="Alta" if confidence_score >= 0.9 else "Moderada",
            citations=citations,
        )
        if payload.session_id is not None:
            await self.message_repo.create(
                session,
                {
                    "session_id": payload.session_id,
                    "sender": "AI",
                    "message_text": result.answer,
                    "confidence_score": result.confidence_score,
                    "citations": [f"{item.document}#{item.chunk_index}" for item in result.citations],
                },
            )
        return result

    async def _call_deepseek(self, query: str, context: str) -> str:
        if not settings.deepseek_api_key:
            return f"Baseado no contexto oficial, revise a orientação com a equipe médica. Contexto: {context[:600]}"
        async with httpx.AsyncClient(base_url=settings.deepseek_base_url, timeout=60) as client:
            response = await client.post(
                "/chat/completions",
                headers={"Authorization": f"Bearer {settings.deepseek_api_key}"},
                json={
                    "model": settings.deepseek_chat_model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "Responda apenas com base no contexto e cite as fontes fornecidas. Nunca invente doses.",
                        },
                        {"role": "user", "content": f"Contexto:\n{context}\n\nPergunta:\n{query}"},
                    ],
                    "temperature": 0.2,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
