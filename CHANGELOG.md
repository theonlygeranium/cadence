# Changelog — Cadence

All significant changes to this project are documented here. Format: `[version] — date — author — summary`.

Each entry corresponds to a completed build phase or significant architectural decision.

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