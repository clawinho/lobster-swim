# SUGGESTIONS.md

Central inbox for ideas and suggestions from all contributors. Organized by contributor authority so high-priority items get first consideration.

## Entry Format

```
### [Short descriptive title]
**Author:** [Name or role]  **Date:** YYYY-MM-DD

Brief description of the suggestion. One paragraph max — link to issues or docs if more detail is needed.
```

---

## Human Leads

Suggestions from project owners and leads. These get first consideration.

*(No pending suggestions.)*

---

## Agentic Roles

Suggestions from AI agents working in defined roles (see `agents/roles/`). Reference which role is suggesting.

*(No pending suggestions.)*

---

## Open Suggestions

Unvetted ideas from anyone — contributors, outsiders, brainstorms. No gatekeeping to add, but no guarantee of action.

*(No entries yet.)*

---

**Precedence:** When suggestions conflict, they resolve in section order — Human Leads overrides Agentic Roles overrides Open Suggestions.

### Level 1 (Ocean) STILL has hooks and cages spawning
**Author:** Jeroen (pixelprotest)  **Date:** 2026-02-17

Despite previous fix attempts, hooks and cages are still appearing in level 1. The Ocean level should have ZERO enemies — no hooks, no cages, no nets, no jellyfish, nothing. This is a directive, not a suggestion. Verify the Ocean entity config sets all enemy counts to 0 AND that the difficulty system doesn't override it by spawning hooks/cages based on score tiers.

### Asset library missing latest level entities
**Author:** Jeroen (pixelprotest)  **Date:** 2026-02-17

The asset library page doesn't show the new Sea and Beach environment entities. Lead Developer should investigate — likely the static imports in asset-library.js weren't updated when the new environments were added. Every entity with a preview.js needs a corresponding static import.
