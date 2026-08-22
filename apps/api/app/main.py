"""FastAPI application entrypoint."""

from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.research import router as research_router
from app.api.research_jobs import router as research_jobs_router

app = FastAPI()
app.include_router(health_router)
app.include_router(research_router, prefix="/api")
app.include_router(research_jobs_router, prefix="/api")
