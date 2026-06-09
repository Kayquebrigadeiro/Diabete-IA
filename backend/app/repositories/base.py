from __future__ import annotations

from collections.abc import Iterable
from typing import Any, Generic, TypeVar
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.entities import Base

ModelT = TypeVar("ModelT", bound=Base)


class CRUDRepository(Generic[ModelT]):
    def __init__(self, model: type[ModelT]):
        self.model = model

    async def get(self, session: AsyncSession, id: UUID) -> ModelT:
        stmt = select(self.model).where(self.model.id == id)
        if hasattr(self.model, "deleted_at"):
            stmt = stmt.where(self.model.deleted_at.is_(None))
        result = await session.execute(stmt)
        obj = result.scalar_one_or_none()
        if obj is None:
            raise NotFoundException(f"{self.model.__name__} não encontrado")
        return obj

    async def list(self, session: AsyncSession, *criteria: Any) -> list[ModelT]:
        stmt = select(self.model)
        if hasattr(self.model, "deleted_at"):
            stmt = stmt.where(self.model.deleted_at.is_(None))
        for criterion in criteria:
            stmt = stmt.where(criterion)
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def create(self, session: AsyncSession, obj_in: dict[str, Any]) -> ModelT:
        obj = self.model(**obj_in)
        session.add(obj)
        await session.commit()
        await session.refresh(obj)
        return obj

    async def update(self, session: AsyncSession, db_obj: ModelT, obj_in: dict[str, Any]) -> ModelT:
        for field, value in obj_in.items():
            if value is not None:
                setattr(db_obj, field, value)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    async def soft_delete(self, session: AsyncSession, db_obj: ModelT) -> ModelT:
        if hasattr(db_obj, "deleted_at"):
            from datetime import datetime, UTC

            db_obj.deleted_at = datetime.now(UTC)
            await session.commit()
            await session.refresh(db_obj)
            return db_obj
        await session.delete(db_obj)
        await session.commit()
        return db_obj

