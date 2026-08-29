import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import Base, SessionLocal, engine, ensure_schema
from app.routers import auth
from app.routers import learning
from app.seed import seed_learning_content

logger = logging.getLogger(__name__)
app = FastAPI(title="NeoLit API", version="1.0.0")


@app.exception_handler(Exception)
async def handle_unexpected_error(request, exc):
    logger.exception("Unhandled error while processing %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(learning.router, prefix="/api", tags=["learning"])
app.include_router(auth.router, prefix="/auth", tags=["legacy-auth"])

Base.metadata.create_all(bind=engine)
ensure_schema()
with SessionLocal() as db:
    seed_learning_content(db)


@app.get("/health")
def health_check():
    return {"status": "ok"}
