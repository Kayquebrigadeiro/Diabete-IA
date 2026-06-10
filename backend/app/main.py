from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import re

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.middleware.error_handler import register_error_handlers

settings = get_settings()

app = FastAPI(title=settings.app_name)

# CORS configuration - read from ALLOWED_ORIGIN (comma-separated)
# Supports:
# - Exact origins (https://auri-ecru.vercel.app)
# - Wildcard patterns using * (https://*.vercel.app)
# - Single '*' to allow all origins (use with caution)
origins = settings.allowed_origin_list
if any(o.strip() == "*" for o in origins):
    allow_origins = ["*"]
    allow_origin_regex = None
else:
    exact_origins = [o for o in origins if "*" not in o]
    regex_items = []
    for o in origins:
        if "*" in o:
            # convert wildcard to regex, escape dots
            pattern = '^' + re.escape(o).replace(r'\*', '.*') + '$'
            regex_items.append(pattern)
    allow_origins = exact_origins
    allow_origin_regex = '|'.join(regex_items) if regex_items else None

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
register_error_handlers(app)
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health():
    return {"status": "ok"}

