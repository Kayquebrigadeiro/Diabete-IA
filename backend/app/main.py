from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.middleware.error_handler import register_error_handlers

settings = get_settings()

app = FastAPI(title=settings.app_name)

# Configuração de CORS para permitir requisições do frontend
origins = [
    "https://auri-ecru.vercel.app",  # Frontend em produção
    "http://localhost:5173",          # Frontend local (Vite)
    "http://localhost:3000",          # Frontend local alternativo
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_error_handlers(app)
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health():
    return {"status": "ok"}

