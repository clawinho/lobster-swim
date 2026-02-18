# TODO

Updated: 2026-02-18

---

## Phase 1: Stage 1 Restructure (Ship by Feb 28)

Priority order — top item is next up.

### Level 1 Bubble Reduction + Falling Pickups (DONE)
- [x] Reduce bubble spawns significantly in Level 1 — each one should feel like a reward, not a carpet
- [x] Add falling pickups that drop from top of screen and land on ocean floor
- [x] CLAWS pickup — visual upgrade + defensive ability
- [x] SWIM pickup — collecting this transitions player to Level 2

### Level 2 Grace Period (DONE)
- [x] No enemies at start of Level 2 (Sea) — player just learned to swim
- [x] Grace period before any enemies appear (5 seconds)
- [x] Gradual enemy introduction after grace period ends (spawnOnEnter deferred)

### Birth Level — New Level 0 (HIGH PRIORITY — Jeroen directive)
- [ ] Design Birth level: lobster egg among thousands under mother's tail
- [ ] Create Birth environment entity (egg clutch visual, mother tail backdrop)
- [ ] Implement pulse mechanic (tap to nudge egg, rhythm-based movement)
- [ ] Nutrient absorption system (growth meter instead of score)
- [ ] Predator threat system (small fish eating eggs, visible hunger paths)
- [ ] Growth meter UI — embryonic development stages leading to hatch
- [ ] Hatch transition to Level 1 (Ocean) — egg cracks open, baby lobster emerges
- [ ] Shift all current levels up by 1 (Ocean=L2, Sea=L3, Beach=L4)

### Beach Boss Encounter
- [ ] Final boss encounter happens ON the beach — no water, fully on land

### Lobster POV (MEDIUM PRIORITY)
- [ ] Lobster POV: still submerged but near shore in Beach level

### Audio (MEDIUM PRIORITY)
- [ ] Music refinement — layered intensity per level (Ocean calm → Sea tension → Beach urgency)

### 80s/90s Game References (LOW PRIORITY — Jeroen directive)
- [ ] Research and plan 80s/90s iconic game references for Stage 1 levels
- [ ] Level 1 Asteroids feel, Level 3 platformer feel

---

## Phase 2+ Backlog (March–April 2026)

Parked until Phase 1 ships. Do not start these yet.

### Director Ideas — Birth Level Details (triaged 2026-02-18)
- [ ] "The Clutch" — discover yourself among thousands of identical eggs
- [ ] "Pulse to Survive" — heartbeat mechanic, rhythm-based nudging
- [ ] "The Hungry Parade" — predator fish with visible hunger paths
- [ ] "Temperature Tides" — environmental hazard waves (warm/cold)
- [ ] "The Detachment" — mid-level crisis, egg detaches from mother
- [ ] "The Growth Meter" — embryonic development as health/progress bar
- [ ] "Egg Glow" — bioluminescent chain reactions, screenshot-worthy visuals
- [ ] "The Konami Egg" — secret golden egg easter egg

### Director Ideas — Other (triaged 2026-02-18)
- [ ] Boil Meter mechanic for Stage 3 Kitchen
- [ ] Molting mechanic — risk/reward shell-shedding
- [ ] Death ghost system — ghost lobsters at previous death locations
- [ ] Spectator ghost mode — post-death observation
- [ ] Konami code Easter egg — lobster facts on title screen
- [ ] Metadata Easter eggs — HTML comments, console.log lore
- [ ] New Game Plus — remixed stages

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
