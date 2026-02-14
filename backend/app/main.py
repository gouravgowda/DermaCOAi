# DermaScope AI – FastAPI Backend
# Serves wound analysis API, treatment generation, and patient management

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.api.v1.routes import upload, analyze, treatment
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    print("🏥 DermaScope AI Backend starting up...")
    print(f"📍 Environment: {settings.ENVIRONMENT}")
    yield
    print("🔒 DermaScope AI Backend shutting down...")


app = FastAPI(
    title="DermaScope AI API",
    description="Smartphone wound intelligence platform for India's PHCs",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://dermascope.ai",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(upload.router, prefix="/api/v1", tags=["Upload"])
app.include_router(analyze.router, prefix="/api/v1", tags=["Analysis"])
app.include_router(treatment.router, prefix="/api/v1", tags=["Treatment"])


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "ok",
        "service": "dermascope-ai",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
