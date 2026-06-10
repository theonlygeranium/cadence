# Changelog — Cadence

All significant changes to this project are documented here. Format: `[version] — date — author — summary`.

Each entry corresponds to a completed build phase or significant architectural decision.

---

## [0.5.1] — 2026-06-10 — Codex

### Added
- Added a dashboard Plaid Link launcher using `react-plaid-link`, backed by the existing `/api/plaid/link-token` and `/api/plaid/exchange-token` routes.
- Added an authentication precheck before Link token creation so unauthenticated users get a clean in-page status without a failed Link-token request in the browser console.
- Updated dashboard state text to reflect that the Ollama tool loop is enabled.
- Added `docs/PLAID_LIVE_QA_RUNBOOK.md` for the remaining sandbox secret rotation and live Link/sync QA workflow.

### Validation
- `scripts/secret-scan.sh all`
- `npm run lint`
- `npm run typecheck`
- `npm run test:run` (4 files, 6 tests)
- `npm run build`
- Browser QA at desktop and 390px mobile viewports confirmed the Plaid connection control renders, unauthenticated state is handled cleanly, no horizontal overflow occurs, and no console warnings/errors are emitted.

### Notes
- Plaid dashboard inspection confirmed the visible sandbox secret still matches the original exposed Phase 0 value. Live Plaid Link/item/transaction QA still requires rotating the Plaid sandbox secret before using it in Schubert or local `.env.local`.

---

## [0.5.0] — 2026-06-10 — Codex

### Added
- Implemented SPEC-003 AI assistant: Ollama chat client, five tool schemas, DB-grounded query executor, authenticated streaming `/api/chat` route, per-user in-memory rate limiting, and responsive chat UI.
- Hardened chat payload validation so public clients can only submit user/assistant message content and cannot inject system/tool messages.
- Added tolerant Ollama tool-argument parsing for both object and JSON-string argument formats.
- Added `trustHost` for Auth.js behind Cloudflare/Caddy and a startup warning when `OLLAMA_BASE_URL` is non-localhost with `OLLAMA_ALLOW_REMOTE=true`.
- Deployed Cadence to Schubert at `/opt/cadence` with Docker Compose, PostgreSQL, generated server-only secrets, and Cloudflare Tunnel routing for `cadence.jgeronimo.com`.
- Added localhost-only configurable Compose port binding and Docker host mapping for host-level Ollama access.

### Validation
- `scripts/secret-scan.sh all`
- `npm run lint`
- `npm run typecheck`
- `npm run test:run` (4 files, 6 tests)
- `npm run build`
- Authenticated live AI smoke against seeded temporary PostgreSQL on Schubert: balance prompt executed `get_account_balances` and returned exact seeded account figures.
- General finance prompt responded without any tool execution.
- Browser QA at desktop and 390px mobile viewports confirmed streaming UI behavior, no horizontal overflow, accessible send-button label, and no console warnings/errors.
- Schubert Compose build and start completed; Drizzle schema push applied to production PostgreSQL.
- Public Cloudflare Tunnel smoke: `https://cadence.jgeronimo.com/` returned `200`; unauthenticated `POST /api/chat` returned typed `401`; deployed `/chat` rendered cleanly in browser QA.

### Notes
- Full Plaid Link completion remains pending a fresh rotated Plaid secret. The live deployment intentionally uses placeholder Plaid values so protected app surfaces and AI infrastructure can be validated without reusing exposed credentials.
- Public routing uses the existing Schubert Cloudflare Tunnel. The local Caddy reference binds Cadence to the LAN interface to avoid Tailscale's `443` listener.

---

## [0.4.0] — 2026-06-09 — Codex

### Added
- Implemented SPEC-002 Plaid integration: SDK client, Link token route, public-token exchange route, item removal route, all-items sync route, incremental transaction sync, and account summary helper.
- Stored Plaid access tokens only through the AES-256-GCM encryption boundary.
- Added sanitized Plaid error helpers and unit coverage for safe error metadata extraction.
- Added session/user ownership checks to all Plaid API routes and item-scoped operations.

### Validation
- `scripts/secret-scan.sh all`
- `npm run lint`
- `npm run typecheck`
- `npm run test:run` (3 files, 4 tests)
- `npm run build` with placeholder non-secret environment variables
- Live local API smoke confirmed Plaid Link, exchange, sync, and delete routes return typed `401` responses when no session is present.

### Notes
- Full Plaid sandbox Link completion remains pending because no safe untracked `.env.local` or Schubert Plaid secret is present. The previously committed Plaid secret-looking values were removed from `.env.example` and should be treated as exposed.

---

## [0.3.0] — 2026-06-09 — Codex

### Added
- Implemented SPEC-001 database schema for Auth.js users/accounts/sessions/verification tokens, Plaid items/accounts/transactions, subscriptions, and paycheck profiles.
- Added Drizzle relations and inferred select/insert TypeScript types for the Cadence financial model.
- Added AES-256-GCM encryption helpers for Plaid access tokens in `src/lib/db/crypto.ts`.
- Added focused Vitest coverage for encrypted secret handling and the required table-name contract.
- Updated CI to run unit tests and use placeholder Plaid values during build validation.

### Validation
- `scripts/secret-scan.sh all`
- `npm run lint`
- `npm run typecheck`
- `npm run test:run` (2 files, 3 tests)
- `npm run build` with placeholder non-secret environment variables
- `npx drizzle-kit push` against a temporary PostgreSQL 16 QA container on Schubert
- PostgreSQL metadata verification confirmed all expected tables and required indexes

---

## [0.2.0] — 2026-06-09 — Codex

### Added
- Implemented SPEC-000 core infrastructure: Next.js 16 App Router scaffold, Tailwind v4, shadcn/ui base components, Auth.js v5 route handlers, Drizzle client/configuration, and Zod environment validation.
- Added Docker deployment assets: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, and `ops/Caddyfile`.
- Added `scripts/secret-scan.sh` and replaced committed Plaid secret-looking values in `.env.example` with placeholders.
- Replaced the default scaffold screen with a Cadence dashboard shell suitable for live browser QA.

### Validation
- `scripts/secret-scan.sh all`
- `npm run lint`
- `npm run typecheck`
- `npm run build` with placeholder non-secret environment variables
- Missing-env validation via `src/lib/env.ts`
- Local browser QA at desktop and mobile viewports: no console errors and no horizontal overflow
- Schubert `docker compose config` validation with temporary placeholder env values

### Notes
- Local Docker CLI is not installed on this Mac shell, so Compose validation was performed on Schubert.
- npm audit still reports the upstream Next/PostCSS advisory pinned inside `next@16.2.9`; npm's proposed fix is an invalid major downgrade, so no downgrade was applied.

---

## [0.1.0] — 2026-06-09 — WRITER Agent

### Added
- Initial repository scaffold mirroring Project Foxtrot documentation conventions.
- `README.md` — project overview, tech stack table, repository structure, agent partnership model.
- `AGENTS.md` — Codex orientation file with coding standards, sandbox boundary rules, and security constraints.
- `CONTRIBUTING.md` — multi-agent workflow description and contribution guidelines.
- `docs/AGENT_HANDOFF.md` — full project context for incoming agents.
- `docs/PROJECT_CONTINUITY.md` — live project state tracker (current phase: scaffold).
- `docs/CODEX_BEST_PRACTICES.md` — Cadence-specific Codex collaboration patterns.
- `docs/specs/SPEC-000-environment-setup.md` — Schubert server environment setup specification.
- `docs/specs/SPEC-001-database-schema.md` — PostgreSQL/Drizzle ORM schema specification.
- `docs/specs/SPEC-002-plaid-integration.md` — Plaid API link, exchange, and sync specification.
- `docs/specs/SPEC-003-ai-assistant.md` — Ollama tool-calling AI assistant specification.
- `docs/adr/ADR-001-tech-stack.md` — Architecture Decision Record for the core technology stack.
- `docs/research/cadence-product-proposal.md` — Full original market research and product proposal.
- `.env.example` — environment variable template with all required variables.
- `.github/ISSUE_TEMPLATE/` — GitHub issue templates for feature specs, bug reports, and ADR proposals.
- `.github/workflows/ci.yml` — basic CI workflow for lint, typecheck, and build validation.

### Notes
- Rapid prototyping phase: all commits to `main`.
- Plaid credentials configured for sandbox environment pending production upgrade.
- Schubert server infrastructure confirmed: Ubuntu 26.04 LTS, NVIDIA RTX PRO 4500, Caddy, Ollama `qwen3.6:latest`.

---

*Future entries will follow this format as build phases complete.*
