"""Research data model: one keyword research task/project.

Follows docs/DATABASE.md (research_project).
"""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, UUIDPrimaryKeyMixin, utcnow

if TYPE_CHECKING:
    from app.models.keywords import ResearchKeyword


class ResearchProject(Base, UUIDPrimaryKeyMixin):
    """A single keyword research task/project."""

    __tablename__ = "research_project"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    seed_keyword: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    country_code: Mapped[str] = mapped_column(String(10), nullable=False)
    language_code: Mapped[str] = mapped_column(String(20), nullable=False)
    # Allowed values: draft / queued / running / completed / failed / cancelled
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow
    )

    research_keywords: Mapped[list["ResearchKeyword"]] = relationship(
        back_populates="research", cascade="all, delete-orphan"
    )