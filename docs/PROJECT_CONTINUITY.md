# Project Continuity — Cadence
Last updated: 2026-06-09 by WRITER Agent

This document is the live state tracker for the Cadence project. All agents must update it after every significant change. It is the authoritative record of what has been done, what is in progress, and what is next.

---

## Current Phase

**Phase 0 — Repository Scaffold & Documentation**

Status: ✅ Complete

All foundational documentation and environment specifications have been committed to `main`. The repository mirrors the Project Foxtrot documentation architecture.

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

---

## Next Phase

**Phase 1 — Core Infrastructure & Environment Setup**

Codex should implement `docs/specs/SPEC-000-environment-setup.md` to:

1. Scaffold the Next.js 16 App Router project (`create-next-app` with TypeScript, Tailwind v4)
2. Configure Drizzle ORM with PostgreSQL connection
3. Configure NextAuth.js v5
4. Implement Zod environment validation (`src/lib/env.ts`)
5. Create Docker Compose service definitions for the application and PostgreSQL
6. Create Caddy configuration for `cadence.jgeronimo.com`
7. Validate: `npm run build` exits 0

Codex prompt template:
```
Read docs/specs/SPEC-000-environment-setup.md completely before writing any code.
Complete the Pre-Build Checklist in §Checklist, implement all sections in order,
then verify every item in the Acceptance Criteria.
Do not deploy. Commit to main when complete and update PROJECT_CONTINUITY.md.
```

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Plaid: confirm whether API key is sandbox or production (Client ID: `6a28c468cd6f99000ddddc6a`) | Open — Jeffrey to confirm |
| 2 | SMTP credentials for transactional email (billing alerts, weekly digest) | Open — Jeffrey to provide |
| 3 | PostgreSQL: run in Docker on Schubert or use managed instance? | Decision: Docker on Schubert (see ADR-001) |
| 4 | NextAuth.js provider: Google + magic link email, or credentials-only for personal use? | Open — Jeffrey to decide |

---

## Active Decisions & Constraints

- **Rapid prototyping phase**: all commits to `main`. No feature branches unless Jeffrey requests them.
- **Self-hosted LLM**: Ollama `qwen3.6:latest` at `http://127.0.0.1:11434` on Schubert. No external LLM API calls for financial data.
- **Privacy by default**: no financial data or LLM prompts leave Schubert unless explicitly opted into.
- **Domain**: `cadence.jgeronimo.com` — Caddy reverse proxy on Schubert.
- **Mobile**: PWA approach for on-the-go use cases (receipt capture, balance checks).

---

## GitHub Issues

| Issue | Title | Spec | Status |
|-------|-------|------|--------|
| #1 | SPEC-000: Environment Setup on Schubert | `docs/specs/SPEC-000-environment-setup.md` | Open |
| #2 | SPEC-001: Database Schema (Drizzle + PostgreSQL) | `docs/specs/SPEC-001-database-schema.md` | Open |
| #3 | SPEC-002: Plaid Link Integration & Transaction Sync | `docs/specs/SPEC-002-plaid-integration.md` | Open |
| #4 | SPEC-003: AI Assistant Architecture (Ollama Tool-Calling) | `docs/specs/SPEC-003-ai-assistant.md` | Open |

---

## Schubert Infrastructure Reference

| Item | Value |
|------|-------|
| OS | Ubuntu 26.04 LTS |
| GPU | NVIDIA RTX PRO 4500 Blackwell (32 GB VRAM) |
| LLM | Ollama `qwen3.6:latest` at `127.0.0.1:11434` |
| Proxy | Caddy |
| Internal IP | `100.86.47.6` (Tailscale) |
| Docker | Available |
| Cadence domain | `cadence.jgeronimo.com` |