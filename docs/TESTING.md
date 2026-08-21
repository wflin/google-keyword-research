# Testing Strategy

## 1. Test pyramid

- Unit tests: scoring, normalization, validation, parsers, provider adapters.
- Integration tests: FastAPI + PostgreSQL + provider mocks.
- End-to-end tests: browser flow from seed keyword to opportunity report.
- Contract tests: provider response normalization and API schemas.

## 2. Mandatory V1 tests

### Backend
- create research
- validate invalid input
- start job
- job progress/state transitions
- idempotent/repeated run behavior
- provider timeout/failure
- partial result behavior
- pagination/filtering
- opportunity score calculation
- AI schema validation
- SSRF URL rejection

### Frontend
- dashboard loads
- create research form validation
- progress states
- keyword table filtering/sorting
- opportunity detail rendering
- loading/empty/error/partial states

### End-to-end

Using only Mock Providers:

`invoice` -> create research -> run -> progress -> keyword list -> opportunity detail.

This must pass with no external API keys.

## 3. Quality gates

A feature is complete only when:
- tests pass
- lint/type checks pass
- API schemas are updated
- docs are updated
- no secrets are committed
- error and partial states are covered

## 4. Regression dataset

Maintain a small deterministic dataset containing seeds such as:
- invoice
- pdf converter
- qr code
- resume
- image compressor

The expected output is not a fixed score; tests should verify schema, ordering rules, source attribution and score component behavior.

## 5. Performance baseline

V1 should support concurrent mock research jobs and record provider latency. Exact production SLOs are established after real usage data is available.

## 6. Evaluation of AI quality

Keep a small human-reviewed benchmark of opportunity reports. Track:
- factual support rate
- unsupported claim rate
- evidence coverage
- schema validity
- recommendation usefulness

Do not optimize only for a numeric AI score.

## 7. Unified local validation commands

All local validation runs from a clean working tree on the `main` branch.

### Backend

Prerequisite: PostgreSQL must be running and healthy.

```bash
docker compose ps            # postgres must be healthy
cd apps/api
python -m pytest -v          # requires DATABASE_URL (see .env.example)
```

Database tests connect to the real PostgreSQL from docker compose (postgres:16).
Mocking PostgreSQL, the SQLAlchemy Engine, Session, Alembic, /health or /ready is forbidden.

Readiness database-down scenario (manual verification with the real lifecycle):

```bash
docker compose stop postgres
# GET /ready must return 503 {"status": "not_ready"}
# GET /health must still return 200 {"status": "ok"}
docker compose start postgres
# after healthy, GET /ready must return 200 {"status": "ready"}
```

### Frontend

```bash
cd apps/web
npm run typecheck
npm run lint
npm run build
```

### Full-stack regression checklist

1. PostgreSQL healthy (`docker compose ps`)
2. backend `python -m pytest -v`
3. frontend `npm run typecheck`, `npm run lint`, `npm run build`
4. `git status` clean

## 8. Codex acceptance criteria

Every completed Task must at least pass:

- Backend Task: pytest passes; database-related tests use the real PostgreSQL; no secrets or sensitive data leak.
- Frontend Task: typecheck, lint and build all pass.
- Full-stack Task: backend pytest plus frontend typecheck, lint and build all pass.
- Task touching Docker: additionally run `docker compose config`.
- Task touching the database: additionally verify against the real database.
