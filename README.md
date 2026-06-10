# Cadence

> AI-native personal finance platform. Semi-monthly paycheck optimization, subscription intelligence, and credit card clarity — self-hosted, privacy-first.

[![Status](https://img.shields.io/badge/status-active--development-brightgreen)]()
[![Stack](https://img.shields.io/badge/stack-Next.js%2016-black)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

---

## What Is Cadence?

Cadence is a web-first, AI-powered personal finance platform that occupies the territory between active budgeters (YNAB) and automation-first tools (Monarch Money). It is architected around three core problems that no incumbent adequately addresses:

1. **Paycheck timing** — mapping all financial obligations to semi-monthly pay cycles and surfacing liquidity risks before they materialize.
2. **Subscription creep** — detecting, categorizing, and surfacing recurring charges that erode discretionary income invisibly over time.
3. **Credit card clarity** — modeling credit card spend as cashflow events rather than simple balance-sheet entries.

AI is not a feature appended to a ledger. It is the operating layer through which every insight, alert, and recommendation is generated. The self-hosted LLM stack (Ollama on Schubert) ensures that no financial data or LLM prompts leave the server infrastructure.

---

## Tech Stack

| Layer       | Technology                                                  |
|-------------|-------------------------------------------------------------|
| Frontend    | Next.js 16 (App Router), React 19, TypeScript               |
| Styling     | Tailwind v4, shadcn/ui                                      |
| Database    | PostgreSQL via Drizzle ORM                                  |
| AI          | Ollama (qwen3.6:latest) — tool-calling architecture         |
| Bank Sync   | Plaid API (sandbox → production)                            |
| Auth        | NextAuth.js v5 with Drizzle adapter                         |
| Deployment  | Docker Compose on Schubert (Ubuntu 26.04 LTS)               |
| Proxy       | Caddy reverse proxy                                         |
| Domain      | cadence.jgeronimo.com                                       |

---

## Repository Structure

```text
cadence/
├── AGENTS.md                         # Codex agent orientation (read first)
├── CONTRIBUTING.md                   # Contribution workflow
├── CHANGELOG.md                      # Phase-based changelog
├── .env.example                      # Environment variable template
├── src/
│   ├── app/                          # Next.js App Router pages and API routes
│   ├── components/ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── db/                       # Drizzle ORM schema and client
│   │   ├── plaid/                    # Plaid client and sync logic
│   │   ├── ai/                       # Ollama tool-calling layer
│   │   └── env.ts                    # Zod environment validation
│   └── server/                       # Server-only utilities
├── docs/
│   ├── AGENT_HANDOFF.md              # Full agent onboarding document
│   ├── PROJECT_CONTINUITY.md         # Live project state
│   ├── CODEX_BEST_PRACTICES.md       # Codex collaboration patterns
│   ├── specs/                        # Numbered build specifications
│   ├── adr/                          # Architecture Decision Records
│   └── research/                     # Market research and product proposal
└── .github/
    ├── ISSUE_TEMPLATE/
    └── workflows/
```

---

## Quick Start

Full environment setup: `docs/specs/SPEC-000-environment-setup.md`

```bash
git clone https://github.com/theonlygeranium/cadence.git
cd cadence
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

---

## Agent Partnership Model

| Agent           | Role                                                                  |
|-----------------|-----------------------------------------------------------------------|
| WRITER Agent    | Principal Strategist — research, specs, architecture, documentation   |
| Codex           | Builder — implements specs, commits code, updates CHANGELOG           |
| Jeffrey (human) | Product Owner — reviews work, approves deployments, domain direction  |

All agents must read `AGENTS.md` and `docs/AGENT_HANDOFF.md` before taking any action. Specs in `docs/specs/` define the build contract. `docs/PROJECT_CONTINUITY.md` tracks current state.

---

## Documentation Index

| Document                         | Purpose                                              |
|----------------------------------|------------------------------------------------------|
| `AGENTS.md`                      | Codex orientation — read before any code change      |
| `docs/AGENT_HANDOFF.md`          | Full project context for incoming agents             |
| `docs/PROJECT_CONTINUITY.md`     | Current phase, active decisions, open questions      |
| `docs/specs/SPEC-000`            | Environment and infrastructure setup on Schubert     |
| `docs/specs/SPEC-001`            | Database schema (Drizzle, PostgreSQL)                |
| `docs/specs/SPEC-002`            | Plaid Link integration and transaction sync          |
| `docs/specs/SPEC-003`            | AI assistant architecture (Ollama tool-calling)      |
| `docs/research/cadence-product-proposal.md` | Full original product proposal and market research |

---

*Built with AI. Operated with Cadence.*