# API Specification

## 1. Scope

REST API for the web application. Backend: Python 3.12+ / FastAPI. API prefix: `/api/v1`.

## 2. Conventions

- JSON request/response.
- UUID identifiers.
- ISO-8601 UTC timestamps.
- Pagination: `page` (1-based), `page_size` (default 20, max 100).
- Long-running research is asynchronous.
- Every research job has a status: `queued`, `running`, `succeeded`, `partial`, `failed`, `cancelled`.
- Errors use `{ "code": "...", "message": "...", "details": {} }`.

## 3. Health

### GET `/health`

Returns service health and application version. No authentication in local MVP.

## 4. Researches

### POST `/api/v1/researches`

Create a research project.

Request:

```json
{
  "name": "Invoice research",
  "seed_keyword": "invoice",
  "country_code": "US",
  "language_code": "en",
  "max_keywords": 100
}
```

Validation:
- `seed_keyword`: 1-200 characters.
- `country_code`: ISO-like country code.
- `max_keywords`: 10-500.

Response: `201` with research project and initial status.

### GET `/api/v1/researches`

List projects with filters and pagination.

### GET `/api/v1/researches/{research_id}`

Return project metadata, latest job status, counts and summary.

### POST `/api/v1/researches/{research_id}/run`

Start a new asynchronous research run.

Request:

```json
{
  "refresh": false,
  "max_keywords": 100,
  "providers": ["keyword", "trend", "serp", "community", "competitor", "ai"]
}
```

Response: `202` with `job_id`.

### POST `/api/v1/researches/{research_id}/cancel`

Cancel a queued/running job when possible.

## 5. Jobs

### GET `/api/v1/jobs/{job_id}`

Return status, current stage, progress percentage, provider results, errors and timestamps.

Example:

```json
{
  "job_id": "uuid",
  "status": "running",
  "stage": "serp",
  "progress": 55,
  "message": "Analyzing search results",
  "started_at": "2026-08-20T08:00:00Z"
}
```

## 6. Keywords

### GET `/api/v1/researches/{research_id}/keywords`

Filters: `q`, `intent`, `min_volume`, `max_competition`, `sort`, `page`, `page_size`.

Return normalized keyword data plus source attribution and freshness.

### GET `/api/v1/keywords/{keyword_id}`

Return keyword history, trend, SERP summary and opportunity references.

## 7. Opportunities

### GET `/api/v1/opportunities`

Global ranked opportunity list. Filters: country, category, minimum score, status, date range.

### GET `/api/v1/researches/{research_id}/opportunities`

Return opportunities discovered by a research run.

### GET `/api/v1/opportunities/{opportunity_id}`

Return complete evidence-backed product opportunity report.

### POST `/api/v1/opportunities/{opportunity_id}/favorite`

Toggle favorite status.

## 8. Daily discovery

### GET `/api/v1/discoveries/today`

Return daily automatically discovered opportunities. V1 can be disabled until scheduled discovery is implemented.

## 9. Settings

### GET `/api/v1/settings/providers`

Return configured provider names and availability without exposing secrets.

### GET `/api/v1/settings`

Return non-secret application settings relevant to the current user.

## 10. Security

- Never return provider API keys.
- Validate all external URLs before fetching.
- Apply request rate limits to expensive endpoints.
- Research jobs must be isolated by owner once authentication is enabled.
- Provider raw payloads are never exposed by default.

## 11. API acceptance criteria

Codex must implement OpenAPI schemas from FastAPI, request validation, consistent errors, pagination, async job status, and pytest coverage for every endpoint before marking an API phase complete.
