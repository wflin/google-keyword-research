"""FastAPI application entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.research import router as research_router
from app.api.research_jobs import router as research_jobs_router

# Minimal CORS for the local Next.js dev server (apps/web on localhost:3000).
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)
app.include_router(health_router)
app.include_router(research_router, prefix="/api")
app.include_router(research_jobs_router, prefix="/api")
