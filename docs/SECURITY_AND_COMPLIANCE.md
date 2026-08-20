# Security and Compliance Baseline

## 1. Data classification

Treat API keys, access tokens, credentials and user account data as secrets/sensitive configuration. Research outputs are ordinary application data unless a later feature introduces private customer data.

## 2. Authentication

V1 local MVP may run without authentication. Before public multi-user deployment, implement:
- user identity
- passwordless/OAuth or another documented authentication mechanism
- session/token rotation
- owner-level authorization for research projects

No public production deployment without authorization controls.

## 3. Secrets

Never store secrets in Git, frontend bundles, logs, database raw payloads or error messages. Use environment variables or a managed secret store.

## 4. External content

External webpages, Reddit posts, SERP snippets and competitor text are untrusted input. Treat them as data, not instructions. AI prompts must explicitly defend against prompt injection contained in retrieved content.

## 5. URL fetching

Implement SSRF protections defined in `DEPLOYMENT.md`. Restrict protocols to HTTPS/HTTP where required, cap response size, validate redirects and use timeouts.

## 6. Rate limits and abuse

Rate-limit research creation and expensive provider calls. Add per-user/provider quotas before public SaaS launch.

## 7. Privacy

Collect the minimum user data necessary. Do not store personal identifiers from third-party communities unless required. Provide deletion capability before public SaaS launch.

## 8. Provider terms

Each provider integration must document its allowed use, attribution requirements, retention rules and rate limits. Do not build anti-bot bypasses or evade access controls.

## 9. AI safety

AI-generated product recommendations are hypotheses, not guaranteed business outcomes. UI must distinguish source-backed facts from AI inference.

## 10. Auditability

Store analysis version, scoring version, provider source, retrieval time and evidence references so an opportunity report can be reproduced or reviewed.

## 11. Security testing

CI should include dependency scanning and tests for authentication/authorization, SSRF, injection, malformed provider responses and secret leakage before public release.
