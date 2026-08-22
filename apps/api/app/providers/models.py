"""Provider input/output contract models.

These models define the provider layer contract only. They deliberately do
not depend on FastAPI, SQLAlchemy, or the Research API schemas so that real
providers can be added later without touching the rest of the application.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class KeywordProviderRequest(BaseModel):
    """Normalized request for keyword discovery or metrics.

    ``seed_keyword`` must be non-empty. ``country_code`` and ``language_code``
    follow the project convention (e.g. US / en) and default to the same
    values used by the Research API.
    """

    seed_keyword: str = Field(min_length=1)
    country_code: str = "US"
    language_code: str = "en"


class KeywordCandidate(BaseModel):
    """A keyword candidate returned by a provider.

    ``source_type`` follows the project convention used by
    ``research_keyword.source_type`` (seed / ai_generated / provider /
    imported / manual). ``provider`` identifies which provider produced the
    candidate.
    """

    keyword_text: str
    normalized_keyword: str
    source_type: str
    provider: str


class KeywordMetric(BaseModel):
    """Point-in-time keyword demand metrics from a single provider.

    All external metric fields default to ``None`` because missing data must
    never be represented with fabricated values such as ``0``. A provider
    only fills in the fields it actually observed from the data source.
    """

    keyword_text: str
    estimated_monthly_searches: int | None = None
    cpc: float | None = None
    currency: str | None = None
    competition: float | None = None
    competition_level: str | None = None
    source: str | None = None
    retrieved_at: datetime | None = None
    provider_version: str | None = None
    raw_payload: dict[str, object] | None = None
