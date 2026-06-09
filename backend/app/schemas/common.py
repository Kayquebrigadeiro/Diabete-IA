from datetime import date, datetime, time
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ORMBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class IDResponse(ORMBaseModel):
    id: UUID
    created_at: datetime | None = None
    updated_at: datetime | None = None
    deleted_at: datetime | None = None


class Paging(BaseModel):
    limit: int = 50
    offset: int = 0

