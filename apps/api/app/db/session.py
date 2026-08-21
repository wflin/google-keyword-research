"""SQLAlchemy engine and session factory.

DATABASE_URL must be provided via the environment (see .env.example).
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

database_url = os.environ.get("DATABASE_URL")
if not database_url:
    raise RuntimeError(
        "DATABASE_URL is not set. Copy .env.example to .env or export DATABASE_URL."
    )

engine = create_engine(database_url, connect_args={"connect_timeout": 5})

SessionLocal = sessionmaker(bind=engine)

__all__ = ["Session", "SessionLocal", "engine"]
