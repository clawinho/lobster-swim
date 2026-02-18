# TODO

Updated: 2026-02-18

---

## Phase 1: Stage 1 Restructure (Ship by Feb 28)

Priority order — top item is next up.

### Enemy Spawn Zones (HIGH PRIORITY — Jeroen directive)
- [x] Each environment defines a water level Y coordinate
- [x] Enemies constrained to valid zones: hooks from above water, jellyfish underwater, beach balls at surface, seagulls from sky
- [x] No hooks flying in the sky, no jellyfish in the air, no beach balls deep underwater

### Beach Scrolling Environment (HIGH PRIORITY — Jeroen directive)
- [x] Beach level scrolls right-to-left (lobster swimming toward shore)
- [x] Water gets shallower, sand rises, more sky visible, waves closer as level progresses
- [ ] Final boss encounter happens ON the beach — no water, fully on land

### Beach Visual Redesign (DONE)
- [x] Redesign Beach level: camera underwater looking toward shore
- [x] Top half sky, middle waterline with crashing waves, bottom half sea with yellow sand floor
- [x] Sand bank slopes up left to right
- [x] Beach-specific enemies: seagulls dive from above waterline, beach balls float at surface

### High Score Celebration (DONE)
- [x] Add celebration moment when player gets a new high score (confetti, score highlight, brief fanfare)
- [x] Brief delay before transitioning back — let player feel the achievement

### Lobster POV (MEDIUM PRIORITY)
- [ ] Lobster POV: still submerged but near shore in Beach level

### Progressive Lobster Abilities (HIGH PRIORITY — Jeroen directive)
- [x] Level 1: Baby lobster, left/right only on ocean floor (Asteroids-style)
- [x] Level 2: Swimming lobster, full movement (v005 renderer — baby→adult visual transition)
- [x] Level 3: Can jump above water and walk on land
- [x] Lobster sprite changes between levels (v005 stage-aware renderer)
- [x] Level 1 baby lobster small hop/jump ability (Jeroen directive — dodge obstacles on ocean floor)
- [x] Level 1 bubbles spawn near ocean floor so baby lobster can reach them (Jom report)

### Lobster Art (MEDIUM PRIORITY — Jeroen directive)
- [x] Design legs for the hero lobster

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
