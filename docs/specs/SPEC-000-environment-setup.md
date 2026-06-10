# SPEC-000: Environment Setup on Schubert

**Version:** 1.0  
**Status:** Ready for Implementation  
**Author:** WRITER Agent  
**Assignee:** Codex  
**Date:** 2026-06-09

---

## Objective

Scaffold the complete Cadence development and production environment. This spec produces a runnable Next.js 16 application with TypeScript, Tailwind v4, Drizzle ORM, and NextAuth.js configured — deployable via Docker Compose on the Schubert server.

---

## Pre-Build Checklist

Before writing any code, verify the following:

- [ ] Read `AGENTS.md` in full
- [ ] Read `docs/AGENT_HANDOFF.md` in full
- [ ] Read `docs/PROJECT_CONTINUITY.md` for current state
- [ ] Read `.env.example` to understand required variables
- [ ] Confirm `npm` and `node` (≥22.x) are available in the build environment
- [ ] Confirm no existing `src/` directory or `package.json` in the repository root

---

## Scope

This spec covers:

1. Next.js 16 App Router scaffold with TypeScript, Tailwind v4, and ESLint
2. Drizzle ORM configuration with PostgreSQL client
3. NextAuth.js v5 installation and basic session configuration
4. Zod environment validation at `src/lib/env.ts`
5. shadcn/ui initialization and base component installation
6. Docker Compose service definitions (app + PostgreSQL)
7. Caddy configuration for `cadence.jgeronimo.com`
8. `package.json` script additions

This spec does **not** cover: database schema tables (SPEC-001), Plaid integration (SPEC-002), or AI assistant (SPEC-003).

---

## Implementation

### 1. Next.js 16 Scaffold

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```

After scaffolding, verify `package.json` contains `"next": "^16.x"`.

### 2. Install Core Dependencies

```bash
npm install drizzle-orm @auth/drizzle-adapter next-auth@beta \
  postgres zod @t3-oss/env-nextjs

npm install -D drizzle-kit @types/pg
```

### 3. Zod Environment Validation — `src/lib/env.ts`

Create `src/lib/env.ts` that validates and exports all required environment variables using `@t3-oss/env-nextjs`. The module must:

- Use `createEnv()` from `@t3-oss/env-nextjs`
- Define server-side variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`
- Define client-side variables: `NEXT_PUBLIC_APP_URL`
- Export the validated `env` object as the default export
- This module must be imported by `src/app/layout.tsx` to fail fast on missing variables

### 4. Drizzle Configuration — `drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";
import { env } from "@/lib/env";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
});
```

Create `src/lib/db/client.ts` that exports a singleton Drizzle client using the `postgres` driver.

Create `src/lib/db/schema.ts` as an empty placeholder with a comment indicating tables will be added in SPEC-001.

### 5. NextAuth.js v5 Configuration

Create `src/lib/auth.ts` with `NextAuth()` initialized with the Drizzle adapter. Use session strategy `"database"`. Export `{ auth, handlers, signIn, signOut }`.

Create `src/app/api/auth/[...nextauth]/route.ts` that exports the handlers.

### 6. shadcn/ui Initialization

```bash
npx shadcn@latest init
```

Select: New York style, neutral color, CSS variables on. Install base components: `button`, `card`, `input`, `label`, `separator`.

### 7. package.json Script Additions

Add to `scripts` in `package.json`:

```json
{
  "typecheck": "tsc --noEmit",
  "db:push": "drizzle-kit push",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

### 8. Docker Compose — `docker-compose.yml`

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env.local
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: cadence
      POSTGRES_USER: cadence
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cadence"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
```

Create `Dockerfile` for the Next.js application using the official Next.js standalone output pattern.

### 9. Caddy Configuration Stub — `ops/Caddyfile`

```
cadence.jgeronimo.com {
  reverse_proxy localhost:3000
}
```

Note: This file is a reference stub for the Schubert operator. The live Caddyfile on Schubert is managed separately. Do not modify the Schubert server directly — request deployment via Jeffrey.

---

## Acceptance Criteria

- [ ] `npm run build` exits 0 with zero TypeScript errors
- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] `src/lib/env.ts` exports a validated `env` object; running with a missing required variable crashes with a readable error
- [ ] `src/lib/db/client.ts` exports a Drizzle client
- [ ] `src/lib/auth.ts` exports `{ auth, handlers, signIn, signOut }`
- [ ] `docker-compose.yml` is present and `docker compose config` validates successfully
- [ ] At least 5 shadcn/ui base components are installed in `src/components/ui/`
- [ ] `CHANGELOG.md` is updated with a new entry for this phase
- [ ] `docs/PROJECT_CONTINUITY.md` reflects Phase 1 as complete and describes Phase 2 as next

---

## File Change Summary

Files to create:
- `src/lib/env.ts`
- `src/lib/db/client.ts`
- `src/lib/db/schema.ts`
- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/components/ui/` (shadcn components)
- `drizzle.config.ts`
- `docker-compose.yml`
- `Dockerfile`
- `ops/Caddyfile`

Files to modify:
- `package.json` (add scripts)
- `src/app/layout.tsx` (import env.ts for validation)
- `CHANGELOG.md` (add entry)
- `docs/PROJECT_CONTINUITY.md` (update phase)