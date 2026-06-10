# Project Continuity — Cadence
Last updated: 2026-06-10 by Codex

This document is the live state tracker for the Cadence project. All agents must update it after every significant change. It is the authoritative record of what has been done, what is in progress, and what is next.

---

## Current Phase

**Phase 4 — AI Assistant Architecture and Schubert Deployment**

Status: ✅ Complete and deployed

All Phase 0 through Phase 4 specs are implemented. Cadence is deployed on Schubert from `/opt/cadence` via Docker Compose with PostgreSQL, generated server-only app secrets, and Cloudflare Tunnel routing at `https://cadence.jgeronimo.com`. The AI assistant streams through the authenticated `/api/chat` route, uses Ollama `qwen3.6:latest`, and grounds financial answers through database tools. Full Plaid sandbox Link completion is still pending a fresh rotated Plaid secret.

---

## What Has Been Done

| Date | Agent | Action |
|------|-------|--------|
| 2026-06-09 | WRITER Agent | Market research completed; 9,800-word product proposal written |
| 2026-06-09 | WRITER Agent | Repository scaffold committed: README, AGENTS.md, CHANGELOG, CONTRIBUTING, all docs/ |
| 2026-06-09 | WRITER Agent | `.env.example` created with all required variables |
| 2026-06-09 | WRITER Agent | SPEC-000 through SPEC-003 written |
| 2026-06-09 | WRITER Agent | ADR-001 (tech stack decision) written |
| 2026-06-09 | WRITER Agent | GitHub Issue templates created |
| 2026-06-09 | WRITER Agent | CI workflow stub created |
| 2026-06-09 | Codex | SPEC-000 implemented and validated with secret scan, lint, typecheck, build, browser QA, and Schubert Compose config |
| 2026-06-09 | Codex | SPEC-001 implemented and validated with unit tests plus Drizzle push against temporary PostgreSQL on Schubert |
| 2026-06-09 | Codex | SPEC-002 implemented and validated with unit tests plus local 401 route-protection smoke; live Plaid sandbox QA pending fresh secret |
| 2026-06-10 | Codex | SPEC-003 implemented and validated with live Ollama tool-call QA, seeded PostgreSQL data, streaming browser QA, and no-tool general prompt QA |
| 2026-06-10 | Codex | Deployed Cadence to Schubert using Docker Compose, applied the Drizzle schema to production PostgreSQL, and exposed `cadence.jgeronimo.com` through the existing Cloudflare Tunnel |

---

## Next Phase

**Phase 5 — Credentialed Private Beta Hardening**

No further implementation specs are currently written. The next useful work is:

1. Rotate/provide fresh Plaid sandbox credentials and complete live Plaid Link QA.
2. Decide the first private-beta auth provider so a real user session can be created through the UI.
3. Seed or sync real Plaid accounts, then repeat AI assistant QA against real connected data.
4. Add a deployment runbook for future Schubert updates and schema pushes.

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Plaid: provide a fresh sandbox secret for live Link QA; old committed secret-looking values should be treated as exposed | Open — Jeffrey to rotate/provide |
| 2 | SMTP credentials for transactional email (billing alerts, weekly digest) | Open — Jeffrey to provide |
| 3 | PostgreSQL: run in Docker on Schubert or use managed instance? | Decision: Docker on Schubert (see ADR-001) |
| 4 | NextAuth.js provider: Google + magic link email, or credentials-only for personal use? | Open — Jeffrey to decide |

---

## Active Decisions & Constraints

- **Rapid prototyping phase**: all commits to `main`. No feature branches unless Jeffrey requests them.
- **Self-hosted LLM**: Ollama `qwen3.6:latest` at `http://127.0.0.1:11434` on Schubert. No external LLM API calls for financial data.
- **Privacy by default**: no financial data or LLM prompts leave Schubert unless explicitly opted into.
- **Domain**: `cadence.jgeronimo.com` — Caddy reverse proxy on Schubert.
- **Deployment**: `/opt/cadence` on Schubert, Docker Compose app bound to `127.0.0.1:3031`, public route through the existing Cloudflare Tunnel to `http://localhost:3031`.
- **Mobile**: PWA approach for on-the-go use cases (receipt capture, balance checks).

---

## GitHub Issues

| Issue | Title | Spec | Status |
|-------|-------|------|--------|
| #1 | SPEC-000: Environment Setup on Schubert | `docs/specs/SPEC-000-environment-setup.md` | Complete |
| #2 | SPEC-001: Database Schema (Drizzle + PostgreSQL) | `docs/specs/SPEC-001-database-schema.md` | Complete |
| #3 | SPEC-002: Plaid Link Integration & Transaction Sync | `docs/specs/SPEC-002-plaid-integration.md` | Implementation complete; live credential QA pending |
| #4 | SPEC-003: AI Assistant Architecture (Ollama Tool-Calling) | `docs/specs/SPEC-003-ai-assistant.md` | Complete |

---

## Schubert Infrastructure Reference

| Item | Value |
|------|-------|
| OS | Ubuntu 26.04 LTS |
| GPU | NVIDIA RTX PRO 4500 Blackwell (32 GB VRAM) |
| LLM | Ollama `qwen3.6:latest` at `127.0.0.1:11434` |
| Proxy | Caddy |
| Public ingress | Cloudflare Tunnel |
| Internal IP | `100.86.47.6` (Tailscale) |
| Docker | Available |
| Cadence domain | `cadence.jgeronimo.com` |
