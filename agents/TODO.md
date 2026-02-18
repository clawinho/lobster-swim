# TODO

Updated: 2026-02-18

---

## Phase 1: Stage 1 Restructure (Ship by Feb 28)

Priority order — top item is next up.

### Asset Library Fixes (HIGH PRIORITY — Jeroen directives)
- [~] **[Senior Engine Dev]** Fix entity assets not visible in asset library — added 6 missing hardcoded imports
- [~] **[Senior Engine Dev]** Asset library uses hardcoded imports (no Vite on VPS) — added all recent entity imports
- [~] **[UI/UX Dev]** Version tabs overflow with 6+ versions — center active tab, scroll overflow
- [~] **[Senior Engine Dev]** Ocean environment not showing in asset library — import exists, needs browser verification

### Birth Level Polish (HIGH PRIORITY)
- [~] Design Birth level: lobster egg among thousands under mother's tail, sibling eggs same size as hero egg
- [~] Birth Egg Gameplay, less moving around, more rythm building with tapping, tapping scales up and down the egg and bumps siblings
- [~] Create Birth environment entity (egg clutch visual, mother tail backdrop)
- [~] Implement pulse mechanic (tap to nudge egg, rhythm-based movement)
- [-] Nutrient absorption system (growth meter instead of score)
- [-] Predator threat system (small fish eating eggs, visible hunger paths)
- [-] Growth meter UI — embryonic development stages leading to hatch
- [~] Hatch transition to Level 1 (Ocean) — egg cracks open, baby lobster emerges
- [-] Birth level visual polish — egg glow effects, better clutch backdrop
- [-] Birth level difficulty tuning — predator spawn rates, nutrient density
- [-] **Birth "BIRTH" title intro** — big bold title that fades out epically at game start, paired with deep THX/Kubrick-style synthesized soundscape (procedural Web Audio: low drone that swells and decays)
- [-] **Birth level intimacy** — eggs packed tighter, camera zoomed in closer so eggs dominate screen, claustrophobic feel
- [-] **Heartbeat sync mechanic** — rhythmic/synchronic heartbeat tapping as primary interaction to break free from egg colony, then catch food to grow
- [-] **Birth-to-Ocean hatching cutscene** — egg crack animation, baby lobster emerges/climbs out before Ocean begins (not just abrupt transition)

### Art Direction (MEDIUM PRIORITY — Jeroen directives)
- [~] **[Art Director]** Combine lobster 'a' and 'b' renderer versions into single renderer with parameter/checkbox controls — no more lettered version splits
- [ ] **[Art Director]** Uplift Ocean level visuals using Birth level quality as reference (deep dark blues, subtle glows, particle specks vs current toyish look)

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

## Approved (Archive)

- [x] Shift all current levels up by 1 (Ocean=L2, Sea=L3, Beach=L4)

---

## Phase 2+ Backlog (March–April 2026)

Parked until Phase 1 ships. Do not start these yet.

### Director Ideas — Birth Level Details (triaged 2026-02-18)
- [ ] "Temperature Tides" — environmental hazard waves (warm/cold)
- [ ] "The Detachment" — mid-level crisis, egg detaches from mother
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
