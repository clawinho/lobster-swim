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

*(No entries yet.)*

---

## Agentic Roles

Suggestions from AI agents working in defined roles (see `agents/roles/`). Reference which role is suggesting.

### Eel death bypasses death animation and high score save (Critical)
**Author:** QA / Playtester  **Date:** 2026-02-17

The eel collision handler in `src/js/app.js:646-662` manually decrements `lives` and sets `gameOver = true` instead of calling `loseLife()`. This skips the death animation, death sound, death particles, and — critically — the high score save to localStorage. Every other enemy uses `loseLife()`. Fix: replace the manual block with a `loseLife()` call.

### Eel death doesn't update lives UI
**Author:** QA / Playtester  **Date:** 2026-02-17

Same eel handler at `src/js/app.js:647` decrements `lives` but never calls `updateLives()`, so the hearts display stays stale until game over.

### Dev panel missing recently added entity types
**Author:** QA / Playtester  **Date:** 2026-02-17

`gameDevGetEntities()` at `src/js/app.js:1272` is missing `seagulls`, `beachBalls`, `jellyfish`, `eels`, and `starfish`. Similarly `gameDevPickEntityAt()` at line 1314 can't select these entities. The dev inspector/outliner can't see roughly half the entity types in the game.

### Hearts display caps at 3 even when lives exceed 3
**Author:** QA / Playtester  **Date:** 2026-02-17

`updateLives()` at `src/js/app.js:1149` loops `for (let i = 0; i < 3; i++)` hardcoded. Golden fish and the dev panel "+1 Life" button can push lives above 3, but the UI won't show the extra hearts. Loop should use `Math.max(3, lives)` instead.

### Stray `stunTimer = 0` assignment between declarations
**Author:** QA / Playtester  **Date:** 2026-02-17

`src/js/app.js:62` has a bare `stunTimer = 0;` floating between `let` declarations — looks like a copy-paste artifact. Harmless but confusing. Should be removed since `stunTimer` is already declared and zeroed on line 46.

### `diff` variable shadowed in multiple inner scopes
**Author:** QA / Playtester  **Date:** 2026-02-17

`const diff = getDifficulty()` is declared at `src/js/app.js:434`, then re-declared inside the ocean current block (line 480) and bubble scoring block (line 536). The inner declarations shadow the outer. The one at line 480 is unnecessary — it can use the existing outer `diff`.

---

## Open Suggestions

Unvetted ideas from anyone — contributors, outsiders, brainstorms. No gatekeeping to add, but no guarantee of action.

*(No entries yet.)*

---

**Precedence:** When suggestions conflict, they resolve in section order — Human Leads overrides Agentic Roles overrides Open Suggestions.
