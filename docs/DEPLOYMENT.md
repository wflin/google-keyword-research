# Deployment and Operations

## 1. Runtime

- Python 3.12+
- FastAPI + Uvicorn
- Next.js + TypeScript
- PostgreSQL
- Redis optional in local MVP, required when distributed jobs/caching are enabled
- Docker / Docker Compose

## 2. Local development

Required services:
- backend
- frontend
- PostgreSQL
- optional Redis

Provide `.env.example`; never commit real credentials.

Local startup must be documented with one short command path.

Start the local PostgreSQL with Docker Compose:

```bash
cp .env.example .env
docker compose up -d postgres
docker compose ps
```

PostgreSQL is published on `localhost:5432`. Container-to-container connections use the service name `postgres`.


The backend runs on the host and connects to the Docker PostgreSQL. Copy `.env.example` to `.env` and provide `DATABASE_URL`:
- Host machine (current local setup): `postgresql+psycopg://...@localhost:5432/keyword_research`
- Future backend container: `postgresql+psycopg://...@postgres:5432/keyword_research` (service name `postgres`)


Run Alembic migrations from `apps/api`:

```bash
alembic upgrade head
alembic current
alembic heads
alembic downgrade base
```

## 3. Production topology

```text
Internet
  -> HTTPS reverse proxy
  -> Next.js
  -> FastAPI
  -> PostgreSQL
  -> Redis
  -> provider APIs
```

Long-running research workers should be separated from the API process when load requires it.

## 4. Configuration

Environment variables must cover:
- database URL
- Redis URL
- AI provider/model
- external provider credentials
- application secret
- allowed origins
- logging level
- rate limits
- provider budgets

Secrets must be supplied by the deployment environment, not committed to Git.

## 5. CI/CD

GitHub Actions should run on pull requests and main branch changes:

1. lint
2. type check
3. unit tests
4. integration tests
5. frontend build
6. backend Docker build

Deployment happens only after the required checks pass.

## 6. Database migrations

Use Alembic. Every schema change requires a migration. Production startup must not silently mutate schema.

## 7. Observability

Log structured events with:
- request ID
- research/job ID
- provider
- duration
- status
- error code

Do not log API keys, passwords, access tokens or raw sensitive user data.

Expose health/readiness endpoints.

## 8. Backup and recovery

Production PostgreSQL requires automated backups and a documented restore test. Retention and RPO/RTO are deployment settings, not hard-coded assumptions.

## 9. Security baseline

- HTTPS only in production
- secure cookies when authentication exists
- CORS allowlist
- rate limiting
- input validation
- SSRF protection for URL fetching
- outbound request timeouts
- maximum response sizes
- dependency vulnerability scanning

## 10. SSRF protection

Any feature that fetches a user/provider supplied URL must reject localhost, loopback, private IP ranges, link-local addresses, cloud metadata endpoints and unsupported schemes. Redirects must be revalidated.

## 11. Cost and reliability

Provider calls require timeout, retry policy, caching and budget accounting. A failed provider must degrade the research result to `partial` rather than crash the whole job when sufficient evidence remains.

## 12. Deployment acceptance criteria

A clean server can deploy the documented stack from source, run migrations, pass health checks, serve the UI over HTTPS, execute a mock end-to-end research and recover from a restarted application container.
