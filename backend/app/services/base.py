from __future__ import annotations

from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import CRUDRepository


class CRUDService:
    def __init__(self, repository: CRUDRepository):
        self.repository = repository

    async def get(self, session: AsyncSession, id: UUID):
        return await self.repository.get(session, id)

    async def list(self, session: AsyncSession, *criteria: Any):
        return await self.repository.list(session, *criteria)

    async def create(self, session: AsyncSession, data: dict[str, Any]):
        return await self.repository.create(session, data)

    async def update(self, session: AsyncSession, id: UUID, data: dict[str, Any]):
        obj = await self.repository.get(session, id)
        return await self.repository.update(session, obj, data)

    async def delete(self, session: AsyncSession, id: UUID):
        obj = await self.repository.get(session, id)
        return await self.repository.soft_delete(session, obj)

