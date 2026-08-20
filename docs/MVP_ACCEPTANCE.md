# MVP Acceptance Criteria

## 1. MVP goal
A user can open the Web application, create a research project for a seed keyword such as `invoice`, run the research workflow with Mock Providers, and receive a traceable product opportunity report. No paid API account is required for this acceptance test.

## 2. Functional acceptance
- Create a research project with seed keyword, country and language.
- Validate required input and reject invalid values.
- Start a research job and expose queued/running/completed/failed states.
- Generate related keywords through a Provider.
- Store estimated keyword metrics and clearly label them as estimated.
- Store trend, SERP, community and competitor evidence from Providers.
- Calculate a deterministic Opportunity Score with a formula version.
- Produce at least one structured product opportunity.
- Generate an AI report from persisted evidence using a validated schema.
- Display evidence and confidence separately from AI conclusions.
- Show research progress and partial provider failures.
- Allow viewing research history and an opportunity detail page.

## 3. UI acceptance
The MVP must include:
- Dashboard
- New Research form
- Research progress/result page
- Keyword Explorer
- Opportunity list/ranking
- Opportunity detail/report
- Basic settings/status page

The primary workflow must be usable without opening a terminal.

## 4. Data acceptance
For each research run, the database must retain enough metadata to answer:
- where a fact came from;
- when it was retrieved;
- which country/language was used;
- which Provider/version produced it;
- which scoring formula produced the score;
- which AI model/prompt version produced the report.

Secrets must never be persisted in research data.

## 5. Quality acceptance
- Backend unit tests cover core domain calculations and Provider adapters.
- Integration tests cover database and research orchestration.
- E2E test covers create research -> run -> view opportunity.
- CI runs formatting/lint/type/test checks.
- Docker Compose starts the complete local stack.
- Mock Providers make the end-to-end workflow deterministic and offline-capable.

## 6. Failure acceptance
A single Provider timeout or failure must be visible in the research result and must not corrupt already persisted evidence. The research may complete as partial when the configured policy allows it.

## 7. Security acceptance
- No secrets in Git history or source code.
- SSRF protection for user/external URLs.
- External fetched content is treated as untrusted data.
- Basic API rate limiting and timeout controls exist.
- User-visible HTML is sanitized.

## 8. Non-goals for MVP
- Real Google Ads integration.
- Automated ad creation or spending.
- Full SEO suite.
- Perfect Google search-volume accuracy.
- Enterprise multi-tenant billing.
- Complex ML model training.

## 9. Demo scenario
Input:
`invoice`

Expected flow:
`invoice -> related keywords -> estimated demand -> trend -> SERP -> community -> competitors -> score -> opportunity -> AI report`

The final report must explicitly distinguish measured/estimated evidence from hypotheses and recommendations.

## 10. Release gate
MVP is ready for deployment only when all functional, UI, data, quality, failure, and security acceptance criteria above pass in CI and in a clean Docker Compose environment.
