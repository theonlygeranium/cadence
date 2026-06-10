# Contributing to Cadence

Cadence is built by a multi-agent team. This document describes the workflow for all contributors — human and AI.

---

## Agent Roles

| Agent           | Role                                                                  |
|-----------------|-----------------------------------------------------------------------|
| WRITER Agent    | Principal Strategist — research, specifications, architecture, documentation |
| Codex           | Builder — implements specs, commits code, updates CHANGELOG           |
| Jeffrey (human) | Product Owner — reviews work, approves deployments, sets direction    |

---

## Before You Begin

All agents must read the following files before proposing any plan or making any change:

```
AGENTS.md
docs/AGENT_HANDOFF.md
docs/PROJECT_CONTINUITY.md
CHANGELOG.md
.env.example
```

---

## Workflow

### 1. Spec-Driven Development

All work is driven by specifications in `docs/specs/`. WRITER Agent writes specs; Codex implements them.

```
WRITER Agent writes spec → docs/specs/SPEC-XXX-*.md
Codex reads spec → implements in worktree or directly on main
Codex validates → npm run build && npm run typecheck && npm run lint
Codex commits → follows commit format below
Jeffrey reviews → approves or redirects
```

### 2. Commit Format

```
type(scope): description

Examples:
feat(plaid): add link token creation endpoint
fix(ai): correct tool-call parameter binding for balance queries
docs(spec): add SPEC-004 cash flow calendar
refactor(db): normalize subscription detection schema
```

Valid types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

### 3. Branch Strategy

**Rapid prototyping phase**: all commits go directly to `main`. No feature branches unless Jeffrey explicitly requests one.

### 4. After Every Significant Commit

- Update `CHANGELOG.md` with a new entry.
- Update `docs/PROJECT_CONTINUITY.md` to reflect current state.
- If a new architectural decision was made, create a new ADR in `docs/adr/`.

---

## What Requires Human Approval

The following actions require explicit approval from Jeffrey before proceeding:

- Any deployment to Schubert (`rsync`, `docker compose up`, etc.)
- Any push that modifies authentication or session logic
- Any modification to Plaid webhook handling
- Any changes to `.env.local` or server-side secrets
- Deletion of files in `src/lib/db/`

---

## Opening Issues

Use GitHub Issues for:
- Spec ambiguities that need clarification before implementation
- Bug reports with reproduction steps
- Architecture proposals that need discussion

Use the issue templates in `.github/ISSUE_TEMPLATE/`.

---

## Definition of Done

A task is complete when:

1. `npm run build` exits 0
2. `npm run typecheck` exits 0
3. `npm run lint` exits 0
4. All acceptance criteria in the relevant spec are met
5. `CHANGELOG.md` has a new entry
6. `docs/PROJECT_CONTINUITY.md` is updated