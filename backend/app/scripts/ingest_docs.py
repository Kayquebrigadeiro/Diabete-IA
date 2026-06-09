import asyncio
import os
from pathlib import Path

from app.core.database import AsyncSessionLocal
from app.services.rag_service import RAGService

BASE_DIR = Path(__file__).parent.parent.parent.parent
FOLDERS = [
    ("contexto_diabetetipo1", "SBD"),
    ("ISPAD", "ISPAD"),
    ("ministério_d_saude(Brasil)", "Ministério da Saúde")
]

async def main():
    rag_service = RAGService()
    
    async with AsyncSessionLocal() as session:
        for folder_name, org_name in FOLDERS:
            folder_path = BASE_DIR / folder_name
            if not folder_path.exists():
                print(f"Aviso: Pasta '{folder_name}' não encontrada. Pulando...")
                continue
                
            for file_path in folder_path.glob("*"):
                if file_path.suffix.lower() in [".pdf", ".md", ".txt"]:
                    print(f"Ingerindo {file_path.name} ({org_name})...")
                    
                    # Check if file exists
                    from sqlalchemy import select
                    from app.models.entities import Document
                    existing = (await session.execute(select(Document).where(Document.filename == file_path.name))).scalar_one_or_none()
                    if existing:
                        print(f"Arquivo já ingerido. Pulando...")
                        continue

                    try:
                        await rag_service.ingest_file(
                            session=session,
                            file_path=str(file_path),
                            filename=file_path.name,
                            title=file_path.stem,
                            source_organization=org_name
                        )
                        await session.commit()
                        print(f"[OK] Ingerido: {file_path.name}")
                    except Exception as e:
                        await session.rollback()
                        print(f"[ERRO] Falha ao ingerir {file_path.name}: {e}")
                        
if __name__ == "__main__":
    asyncio.run(main())
