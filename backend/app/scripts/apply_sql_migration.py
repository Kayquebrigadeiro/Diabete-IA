from __future__ import annotations

import asyncio
import sys
from pathlib import Path

from sqlalchemy import text

from app.core.database import engine


def split_sql_statements(sql: str) -> list[str]:
    return [statement.strip() for statement in sql.split(";") if statement.strip()]


async def apply_sql_migration(path: Path) -> None:
    sql = path.read_text(encoding="utf-8")
    async with engine.begin() as connection:
        for statement in split_sql_statements(sql):
            await connection.execute(text(statement))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python -m app.scripts.apply_sql_migration <arquivo.sql>")
    asyncio.run(apply_sql_migration(Path(sys.argv[1])))
