# Project Structure Contract

> Phase 0 必须严格按照此结构初始化。后续只有在 ADR 或架构文档明确批准后才能调整顶层结构。

```text
google-keyword-research/
├── apps/
│   ├── api/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── core/
│   │   │   ├── domain/
│   │   │   ├── services/
│   │   │   ├── providers/
│   │   │   ├── repositories/
│   │   │   ├── schemas/
│   │   │   └── main.py
│   │   └── tests/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── tests/
├── packages/
│   └── shared/
├── infra/
│   ├── docker/
│   └── scripts/
├── docs/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── Makefile
```

## Responsibilities

### apps/api

Python/FastAPI backend. Business logic must not live in route handlers.

### apps/api/app/api

HTTP routers/controllers only: authentication, validation, response mapping and dependency wiring.

### apps/api/app/domain

Stable business concepts and rules. Must not depend directly on external HTTP clients.

### apps/api/app/services

Use-case orchestration. Coordinates domain, repositories and Providers.

### apps/api/app/providers

Adapters for Trends, Suggestions, GitHub, Public Web, Community and AI. Every external service must be isolated here.

### apps/api/app/repositories

Persistence abstraction. SQLAlchemy implementation stays behind repository boundaries where practical.

### apps/api/app/schemas

Pydantic request/response contracts.

### apps/web

Next.js UI. It calls backend APIs and must not directly access provider credentials.

### packages/shared

Only genuinely shared contracts/utilities. Do not create a dumping ground.

### infra

Docker, deployment and operational scripts. No business logic.

## Dependency direction

```text
web → API → services → domain
                  ↓
             repositories
                  ↓
              database

services → providers → external services
```

Domain must remain independent of FastAPI, SQLAlchemy HTTP clients and vendor SDKs.

## Naming rules

- Python: snake_case
- TypeScript: camelCase for variables/functions, PascalCase for React components/types
- API routes: kebab-case or established REST convention; remain consistent once chosen
- Database tables: snake_case
- Provider names describe capability, not vendor, when defining interfaces (e.g. TrendProvider rather than GoogleProvider)

## Forbidden shortcuts

- No third-party API calls from React components.
- No third-party API calls directly from FastAPI route handlers.
- No secrets in source code.
- No giant `utils.py` or `helpers.py` used as an unstructured dumping ground.
- No cross-layer imports that violate the dependency direction.
