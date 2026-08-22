"""Keyword data provider abstraction layer.

Providers convert external keyword data sources into normalized output. The
layer must stay independent of FastAPI, SQLAlchemy, and the database.
"""

from app.providers.base import KeywordProvider, ProviderRegistry, StubKeywordProvider
from app.providers.exceptions import (
    ProviderAuthenticationError,
    ProviderError,
    ProviderNotConfiguredError,
    ProviderRateLimitError,
    ProviderRequestError,
    ProviderResponseError,
)
from app.providers.models import KeywordCandidate, KeywordMetric, KeywordProviderRequest

__all__ = [
    "KeywordCandidate",
    "KeywordMetric",
    "KeywordProvider",
    "KeywordProviderRequest",
    "ProviderAuthenticationError",
    "ProviderError",
    "ProviderNotConfiguredError",
    "ProviderRateLimitError",
    "ProviderRegistry",
    "ProviderRequestError",
    "ProviderResponseError",
    "StubKeywordProvider",
]
