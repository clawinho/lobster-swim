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

### Level 3 (Beach) — scrolling environment toward shore
**Author:** Jeroen (pixelprotest)  **Date:** 2026-02-17

The Beach level should have the environment slowly scrolling from right to left, as if the lobster is swimming toward the beach front. As the level progresses: water gets shallower, sand rises, more sky becomes visible, waves get closer. The final boss encounter happens ON the beach — no water, fully on land. This gives the level a sense of journey and progression instead of a static background.

### Enemy spawn zones must respect water levels per environment
**Author:** Jeroen (pixelprotest)  **Date:** 2026-02-17

Each level has a different water line — Ocean is fully submerged, Sea has sky at the top, Beach has half sky half water. Enemies MUST only spawn in zones that make sense: hooks come from above the water (their lines dangle down), jellyfish stay underwater, beach balls float at the surface, seagulls dive from the sky. No hooks flying in the sky. No jellyfish in the air. No beach balls deep underwater. Each environment should define a water level Y coordinate and enemies should be constrained to spawn within their valid zone (above water, below water, or at the surface).
