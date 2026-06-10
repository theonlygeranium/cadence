---
name: "Feature Spec / Build Task"
about: "Spec-driven build task for Codex to implement"
title: "SPEC-XXX: [Short Title]"
labels: ["spec", "codex-ready"]
assignees: []
---

## Spec Reference

**Spec file:** `docs/specs/SPEC-XXX-[name].md`  
**Depends on:** <!-- list spec IDs this depends on, e.g. SPEC-001 -->  
**Phase:** <!-- Phase 0, 1, 2, etc. -->

---

## Objective

<!-- One paragraph: what does this spec accomplish? -->

---

## Codex Prompt

```
Read docs/specs/SPEC-XXX-[name].md completely before writing any code.
Complete the Pre-Build Checklist, implement all sections in order,
then verify every item in the Acceptance Criteria.
Do not deploy. Commit to main when complete and update PROJECT_CONTINUITY.md.
```

---

## Acceptance Criteria

<!-- Copy from the spec file -->
- [ ] `npm run build` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] `CHANGELOG.md` updated
- [ ] `docs/PROJECT_CONTINUITY.md` updated

---

## Notes

<!-- Any additional context, edge cases, or constraints not in the spec -->