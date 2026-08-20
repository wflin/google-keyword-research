# Provider Specification

## 1. Principle

External data access must be isolated behind typed Provider interfaces. Business services must never call third-party HTTP APIs directly.

## 2. Provider categories

```text
KeywordExpansionProvider
SearchVolumeProvider
TrendProvider
SerpProvider
CommunityProvider
CompetitorProvider
AIProvider
```

## 3. Common contract

Every provider returns:

- normalized data
- `source`
- `provider_version`
- `retrieved_at`
- `latency_ms`
- `status`
- structured error information when unsuccessful

Provider secrets are loaded from environment/configuration and never persisted in normal business tables.

## 4. Search volume

Return:
- keyword
- country
- language
- estimated monthly volume
- monthly history when available
- CPC when available
- competition when available
- source and freshness

The field must be named/labelled as an estimate when the provider supplies estimated data.

## 5. Trend

Return normalized 0-100 relative interest, period, geography, related/rising queries when available, and source.

## 6. SERP

Return:
- keyword
- country/language
- rank
- title
- URL
- domain
- snippet
- result type
- retrieved timestamp

Respect provider terms, robots restrictions and rate limits. Do not implement anti-bot bypasses.

## 7. Community

Return:
- platform
- post/comment ID when permitted
- title
- text excerpt
- URL
- author identifier only when necessary
- published time
- engagement metrics when available

Store only the minimum data required for analysis and respect platform terms.

## 8. Competitor

Normalize:
- name
- URL
- category
- target audience
- pricing summary
- features
- evidence URLs
- confidence

## 9. AI

AIProvider must accept a structured evidence bundle and return schema-valid JSON. It must not invent missing metrics. Every material claim should contain an evidence reference or be explicitly labelled as a hypothesis.

## 10. Provider selection

Configuration selects enabled providers. If a primary provider is unavailable, the orchestrator may use a configured fallback. Fallbacks must not silently overwrite source attribution.

## 11. Mock providers

Every provider must have a deterministic Mock implementation for local development and tests. V1 must run end-to-end without any paid external API credentials.

## 12. Cost controls

- cache identical requests
- batch requests where supported
- enforce per-provider daily/monthly budgets when possible
- expose provider usage statistics
- never retry non-retryable errors
- exponential backoff with jitter for retryable errors
