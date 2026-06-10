import asyncio
from app.core.database import Base, engine
from app.models.entities import *

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tabelas criadas com sucesso!")

asyncio.run(create_tables())
