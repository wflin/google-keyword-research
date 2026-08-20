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
