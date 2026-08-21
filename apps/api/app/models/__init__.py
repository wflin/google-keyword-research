"""Business models package.

Importing this package registers every business model on Base.metadata so
that Alembic autogenerate can discover the full schema.
"""

from app.db.base import Base
from app.models.keywords import Keyword, KeywordMetricSnapshot, ResearchKeyword
from app.models.research import ResearchProject

__all__ = [
    "Base",
    "Keyword",
    "KeywordMetricSnapshot",
    "ResearchKeyword",
    "ResearchProject",
]