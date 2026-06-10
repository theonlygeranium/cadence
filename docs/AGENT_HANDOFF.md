# Cadence Agent Handoff

Last updated: 2026-06-09  
Maintained by: WRITER Agent

This document is written for AI agents joining Cadence. Read it completely before proposing any plan or making any change. It summarizes the product, architecture, server infrastructure, active decisions, current phase, and recommended next steps.

---

## First Instructions for Any Agent

1. Read these files before changing anything:
   ```
   AGENTS.md
   docs/AGENT_HANDOFF.md   (this file)
   docs/PROJECT_CONTINUITY.md
   CHANGELOG.md
   .env.example
   ```

2. Do not commit secrets. Plaid credentials, database URLs, session secrets, and Ollama endpoint details belong only in `.env.local`.

3. Commit to `main` during the rapid prototyping phase.

4. For Schubert infrastructure work, also read `docs/specs/SPEC-000-environment-setup.md`.

---

## Current State

**Phase:** 0 — Repository Scaffold and Documentation  
**Active branch:** `main`  
**Application code:** None yet exists. Phase 0 establishes documentation, specification, and environment scaffolding.

---

## Product Summary

Cadence is an AI-native personal finance platform. The name reflects both the rhythmic timing of recurring financial obligations and the principled orchestration of money across pay cycles.

### Core Problems Addressed

| Problem | Description |
|---------|-------------|
| Paycheck timing | Which obligations fall between semi-monthly pay dates? Is sufficient liquidity available? |
| Subscription creep | Which recurring charges erode discretionary income invisibly? |
| Credit card clarity | Treating credit card spend as cashflow events, not balance-sheet entries |

### Differentiators from Incumbents

- AI as the operating layer, not a feature appended to a ledger
- Self-hosted LLM stack (Ollama on Schubert) — no financial data leaves the server
- Privacy-first: manual CSV entry is a first-class input channel alongside Plaid
- Web-first, mobile-responsive (PWA) — not platform-locked like Copilot
- Semi-monthly paycheck optimization — unaddressed by any current competitor

Full market research and competitive analysis: `docs/research/cadence-product-proposal.md`

---

## Tech Stack

| Layer          | Technology                                    | Notes                                        |
|----------------|-----------------------------------------------|----------------------------------------------|
| Frontend       | Next.js 16 (App Router), React 19, TypeScript | Server Components by default                 |
| Styling        | Tailwind v4, shadcn/ui                        | Use cn() helper; Radix UI primitives         |
| Database       | PostgreSQL, Drizzle ORM                       | Schema-first; parameterized queries only     |
| AI             | Ollama — qwen3.6:latest, tool-calling         | All claims grounded in DB records            |
| Bank Sync      | Plaid API                                     | Sandbox credentials active; production TBD  |
| Auth           | NextAuth.js v5 with Drizzle adapter           | Email/password; optional OAuth               |
| Deployment     | Docker Compose                                | App + PostgreSQL + Caddy containers          |
| Proxy          | Caddy reverse proxy                           | TLS termination; reverse proxy to Next.js    |

---

## Server Infrastructure (Schubert)

| Property        | Value                                              |
|-----------------|----------------------------------------------------|
| OS              | Ubuntu 26.04 LTS                                   |
| Tailscale IP    | 100.86.47.6                                        |
| Domain          | cadence.jgeronimo.com                              |
| GPU             | NVIDIA RTX PRO 4500 Blackwell, 32 GB VRAM          |
| LLM runtime     | Ollama — qwen3.6:latest at 127.0.0.1:11434         |
| Proxy           | Caddy reverse proxy                                |
| Container runtime | Docker + Docker Compose                          |
| Existing services | Project Foxtrot (separate stack on same server)  |
| Reference docs  | https://schubertlife.atlassian.net/wiki/spaces/schubert/ |

**Critical