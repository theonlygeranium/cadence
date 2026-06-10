# ADR-001: Core Technology Stack Selection

**Status:** Accepted  
**Date:** 2026-06-09  
**Authors:** WRITER Agent, Jeffrey Geronimo  
**Deciders:** Jeffrey Geronimo

---

## Context

Cadence requires a modern, AI-native web application stack that satisfies the following constraints simultaneously:

1. Full-stack TypeScript with strong type safety across the database, API, and UI layers.
2. Self-hosted deployment on Schubert (Ubuntu 26.04 LTS, NVIDIA RTX PRO 4500).
3. Integration with Plaid for bank sync and Ollama for local LLM inference.
4. Mobile-responsive PWA capability for on-the-go use cases.
5. Rapid prototyping velocity — the project starts as a personal tool and may scale to a paid product.
6. Long-term extensibility: the stack must accommodate real-time features, complex data visualizations, and advanced AI tool-calling without requiring a full rewrite.

---

## Decision

The following technology stack is selected:

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | **Next.js 16 (App Router)** | Server Components by default reduce client bundle size; streaming RSC enables progressive AI response rendering; App Router co-locates API routes with pages |
| UI framework | **React 19** | Required peer of Next.js 16; concurrent features improve perceived performance for streaming AI responses |
| Language | **TypeScript (strict mode)** | End-to-end type safety; Drizzle, shadcn/ui, and Next.js all provide first-class TypeScript support |
| Styling | **Tailwind v4 + shadcn/ui** | Tailwind v4 eliminates the config file and supports CSS-native cascade layers; shadcn/ui provides accessible, unstyled primitives that match the visual design direction |
| Database | **PostgreSQL** | Relational model suits financial transaction data; excellent JSON support for Plaid API response caching; mature ecosystem on Ubuntu |
| ORM | **Drizzle ORM** | Type-safe queries without a query builder abstraction layer; schema-as-code enables TypeScript inference across the full data access layer; migration system is explicit and auditable |
| Authentication | **NextAuth.js v5** | Native App Router integration; Drizzle adapter available; supports multiple providers for future multi-tenant expansion |
| Bank sync | **Plaid API** | Industry-standard bank aggregator; supports transaction, account, balance, and investment endpoints; sandbox environment available for development |
| LLM | **Ollama (qwen3.6:latest)** | Self-hosted on Schubert; no financial data leaves the server; tool-calling support for grounded financial queries; NVIDIA RTX PRO 4500 (32 GB VRAM) provides sufficient throughput for interactive use |
| Deployment | **Docker Compose** | Reproducible multi-service environment (app + PostgreSQL + optional Redis); simple `docker compose up` deploy flow on Schubert |
| Reverse proxy | **Caddy** | Already installed on Schubert; automatic HTTPS; simpler configuration than Nginx for single-domain use |

---

## Consequences

### Positive

- Full-stack TypeScript eliminates an entire class of runtime type errors at the API boundary.
- Drizzle's schema-as-code approach means database types are always in sync with application types.
- Self-hosted Ollama satisfies the privacy-by-default constraint without sacrificing AI capability.
- Docker Compose enables deployment reproducibility and easy local development parity.
- shadcn/ui components are copy-paste, not a dependency, which means the design system can be modified without upstream constraints.

### Trade-offs

- **Next.js App Router complexity**: RSC mental model has a steeper learning curve for Codex agents than Pages Router. Mitigated by explicit `"use client"` boundary rules in `AGENTS.md`.
- **Drizzle migration management**: schema changes require explicit migration files. Mitigated by `npm run db:push` for rapid prototyping phase and `npm run db:migrate` for production.
- **Ollama latency**: local inference will have higher latency than hosted API calls for the first token. Mitigated by streaming responses and keeping AI prompts concise and tool-call-focused.
- **PostgreSQL on Docker**: no managed failover in the initial deployment. Acceptable for a personal-use product; documented as a risk in PROJECT_CONTINUITY.md.

---

## Rejected Alternatives

| Alternative | Reason Rejected |
|-------------|-----------------|
| SvelteKit | Smaller ecosystem for shadcn/ui-style component libraries; less Codex training data |
| Remix | App Router is the strategic direction for React; routing model overlap |
| Prisma ORM | Generates a query engine binary (heavier); less type inference transparency than Drizzle |
| SQLite | Lacks concurrent write support for multi-session use; limited JSON query capability |
| Hosted LLM (OpenAI/Anthropic) | Violates privacy-by-default constraint; financial data would leave the server |
| Nginx | More configuration required for HTTPS vs. Caddy's `tls` directive; Caddy already installed on Schubert |