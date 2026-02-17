# TODO

Updated: 2026-02-17

---

## Phase 1: Stage 1 Restructure (Ship by Feb 28)

Priority order — top item is next up.

### Beach Visual Redesign (HIGH PRIORITY — Jeroen directive)
- [ ] Redesign Beach level: camera underwater looking toward shore
- [ ] Top half sky, middle waterline with crashing waves, bottom half sea with yellow sand floor
- [ ] Sand bank slopes up left to right
- [ ] Beach-specific enemies: seagulls dive from above waterline, beach balls float at surface
- [ ] Lobster POV: still submerged but near shore

### Progressive Lobster Abilities (HIGH PRIORITY — Jeroen directive)
- [ ] Level 1: Baby lobster, left/right only on ocean floor (Asteroids-style)
- [ ] Level 2: Swimming lobster, full movement
- [ ] Level 3: Can jump above water and walk on land
- [ ] Lobster sprite should change between levels (QA: swimming sprite on Beach looks wrong)

### Lobster Art (MEDIUM PRIORITY — Jeroen directive)
- [ ] Design legs for the hero lobster

### Audio (MEDIUM PRIORITY)
- [ ] Music refinement — layered intensity per level (Ocean calm → Sea tension → Beach urgency)

### Enemy Balance (DONE)
- [x] Reduce enemies in Level 1 (Ocean) — make it chill, very few enemies
- [x] Level 1 now has ZERO enemies (Jeroen directive)
- [x] Ramp up enemies in Level 2 (Sea)
- [x] Full enemy density in Level 3 (Beach)
- [x] Sea level still too many enemies at low scores — reduce initial spawn counts and delay ramp
- [x] Per-level enemy filtering — limit enemy types by environment
- [x] Eel movement toned down
- [x] Fix difficulty system spawning hooks/cages in Ocean (bypassed level config)
- [x] Add Sea and Beach environments to asset library — smoother slithering, less erratic (Jeroen directive)

### Stage 1 Restructure: Ocean → Sea → Beach (DONE)
- [x] Rename/redesign Level 2 from "Seafood Tank" → "Sea"
- [x] Rename/redesign Level 3 from "The Kitchen" → "Beach"
- [x] Update environment renderers for Sea and Beach
- [x] Update level transitions — Ocean→Sea at 1000, Sea→Beach at 3000 (Jeroen directive)

### 80s/90s Game References (LOW PRIORITY — Jeroen directive)
- [ ] Research and plan 80s/90s iconic game references for Stage 1 levels
- [ ] Level 1 Asteroids feel, Level 3 platformer feel

---

## Phase 2+ Backlog (March–April 2026)

Parked until Phase 1 ships. Do not start these yet.

### Research: Diverse Game Styles (Jeroen directive)
- [ ] Research how to refactor game for diverse gameplay styles in stages 2-4
- [ ] Document findings in a research doc for later reference

### Stage 1 Boss (Phase 2 — March)
- [ ] Giant Enemy Crab boss encounter
- [ ] Boss defeat → trawler net transition cutscene

### Stage 2 Prototype (Phase 2 — March)
- [ ] Scrolling tank exploration mechanics
- [ ] New sound effects for Stage 2 enemies

### Stage 3 Prototype (Phase 3 — March/April)
- [ ] Side-scrolling platformer mechanics
- [ ] Kitchen escape level design

### Stage 4 Concept (Phase 4 — April)
- [ ] Abstract/experimental gameplay prototype
- [ ] Decide final boss concept

### Nice-to-Have (No deadline)
- [ ] Achievement system
- [ ] Personal best tracking per session
- [ ] Save system / checkpoints (needed for multi-stage)
- [ ] Game jam submission polish pass
