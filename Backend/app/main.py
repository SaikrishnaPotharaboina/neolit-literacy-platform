import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import auth
from app.routers import learning

logger = logging.getLogger(__name__)

app = FastAPI(title="NeoLit API", version="1.0.0")

cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]


@app.exception_handler(Exception)
async def handle_unexpected_error(request, exc):
    logger.exception(
        "Unhandled error while processing %s %s",
        request.method,
        request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["auth"],
)

app.include_router(
    learning.router,
    prefix="/api",
    tags=["learning"],
)

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["legacy-auth"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
