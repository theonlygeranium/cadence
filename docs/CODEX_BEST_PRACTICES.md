# Codex Best Practices — Cadence Reference Guide
**Compiled:** June 9, 2026  
**Maintained by:** WRITER Agent + Human Oversight  
**Audience:** Jeffrey Geronimo, Cadence contributors, Codex agents working in this repo

---

## 1. Core Philosophy

Treat Codex as an **autonomous senior engineer**, not a code autocomplete tool. This means:

- Give it **direction and specs**, not line-by-line instructions.
- Let it **gather context, plan, implement, test, and refine** without waiting for prompts at each step.
- Your job shifts from **writing code** to **designing environments, specifying intent, and building feedback loops**.
- Humans interact primarily through **prompts and spec files** — Codex opens PRs (or commits to `main`), you review them.

---

## 2. AGENTS.md

`AGENTS.md` at the repository root is the single most important file for working with Codex. Codex reads it **before doing any work**. Think of it as a briefing document the agent uses to orient itself in every session.

### What a Good AGENTS.md Must Answer

1. **What is this project and how is it organized?** — folder structure, key files, architecture.
2. **Which commands should Codex run (and which should it avoid)?** — build, test, lint, deploy.
3. **What coding standards must it follow?** — TypeScript strict mode, Drizzle, commit format.
4. **What does "done" look like?** — acceptance criteria, test coverage expectations, review steps.

The Cadence `AGENTS.md` is at the repository root. Keep it current.

---

## 3. Prompt Patterns for Maximum Autonomy

### The Autonomous Senior Engineer Prompt

```
You are an autonomous senior engineer. Once I give you a direction,
proactively gather context, plan, implement, test, and refine without
waiting for additional prompts at each step. Prefer action over asking
clarifying questions. When you encounter uncertainty, make a reasonable
decision, document it, and move on.
```

### Spec-Driven Prompts (Our Pattern)

The most reliable pattern for Cadence — hand Codex a spec file:

```
Read docs/specs/SPEC-001-database-schema.md completely before writing any code.
Follow the Pre-Build Checklist in §Checklist, implement all sections in order,
then verify every item in the Acceptance Criteria checklist.
Do not deploy. Commit to main when complete.
```

### The Five Elements of a Codex Spec Prompt

```
1. WHERE to find the spec:
   "Read docs/specs/SPEC-001-database-schema.md"

2. WHAT to do before writing code:
   "Complete the Pre-Build Checklist before touching any files"

3. WHAT the output should be:
   "Implement all items in §Schema Definition"

4. WHAT to verify:
   "Verify all items in the Acceptance Criteria"

5. WHAT NOT to do:
   "Do not deploy. Do not modify .env.local. Commit to main when complete."
```

---

## 4. Multi-Agent Orchestration

### The Handoff Pattern (Current Working Model)

```
WRITER Agent (design + spec)
    → writes spec to docs/specs/SPEC-XXX.md
    → pushes spec to GitHub
    → provides Codex prompt

Codex (implement + test)
    → reads spec
    → implements on main (rapid prototyping phase)
    → runs validation checklist
    → commits + updates CHANGELOG.md

Jeffrey (review + approve)
    → reviews changes
    → approves or redirects
    → triggers deploy to Schubert when ready

WRITER Agent (docs + continuity)
    → updates CHANGELOG.md if needed
    → updates PROJECT_CONTINUITY.md
    → updates AGENT_HANDOFF.md
```

### Files as the Message Bus

The most reliable pattern for multi-agent coordination passes messages through **Markdown and JSON files** rather than in-memory state:

```
[WRITER Agent writes] → docs/specs/SPEC-XXX.md
[Codex reads + builds]
[Codex writes] → docs/BUILD_LOG.md (what it did, decisions made)
[Codex writes] → CHANGELOG.md (phase entry)
[WRITER Agent reads BUILD_LOG.md] → reviews, updates PROJECT_CONTINUITY.md
```

---

## 5. Human-in-the-Loop

### Three-Tier HITL Model

```
Tier 1 — Autonomous (no human needed):
  File reads, analysis, writing new files, running tests,
  updating docs, CSS changes, creating issues

Tier 2 — Notify & Continue (human informed, not blocking):
  Architectural decisions, new dependencies, large refactors,
  changes to existing API contracts

Tier 3 — Block & Wait (explicit human approval required):
  Deploys to cadence.jgeronimo.com, secrets/env changes,
  auth logic changes, deletions, production database migrations
```

---

## 6. Context Management

- **AGENTS.md** → persistent instructions (loaded every session, keep it lean)
- **Spec files** → task-specific context (reference by path, don't paste inline)
- **Recent commits** → Codex reads git log automatically; keep commit messages descriptive
- **AGENT_HANDOFF.md / PROJECT_CONTINUITY.md** → project state (always keep current)

### The Context Layering Pattern

```
Session start → AGENTS.md (persistent project rules)
      ↓
Task assignment → docs/specs/[SPEC_FILE].md (task-specific spec)
      ↓
Pre-build → read relevant source files (targeted reads, not whole repo)
      ↓
Build → implement
      ↓
Post-build → update CHANGELOG.md + PROJECT_CONTINUITY.md
```

---

## 7. Using WRITER Agent for Spec Review Before Handing to Codex

Before sending a spec to Codex, run it through WRITER Agent first:

```
[To WRITER Agent]: "Review docs/specs/SPEC-001-database-schema.md for completeness.
Check: does it have a Pre-Build Checklist? Acceptance Criteria? File change summary?
Flag anything Codex would need to guess."
```

This catches gaps before Codex spends tokens on a wrong implementation.

---

## 8. Effective Review Checklist

When Codex commits, review with this checklist:

```
[ ] Did it follow the spec file exactly?
[ ] Are all new types/names consistent with existing naming?
[ ] Does npm run build exit 0?
[ ] Does npm run typecheck exit 0?
[ ] Did it update CHANGELOG.md?
[ ] Did it update PROJECT_CONTINUITY.md?
[ ] Are there any changes outside the allowed file list in the spec?
[ ] Are there any secrets committed?
```