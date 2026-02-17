# TODO

Updated: 2026-02-17

---

## Phase 1: Stage 1 Polish (Ship by Feb 28)

Priority order — top item is next up.

### Bugs (Ship Blockers)
- [ ] Fix eel death handler — replace manual `lives--`/`gameOver=true` with `loseLife()` call (`app.js:646-662`). Currently bypasses death animation, death sound, death particles, high score save, and `updateLives()` UI update.
- [ ] Hearts display caps at 3 even when lives > 3 — change `updateLives()` loop to use `Math.max(3, lives)` (`app.js:1149`)

### Game Feel (High Priority)
- [ ] Screen shake on death
- [ ] Better death animation
- [ ] Particle effects — expand use of existing particle system (bubble pops, enemy deaths, pickups)
- [ ] Transition effects between levels (visual + audio fade)

### Balance (High Priority)
- [ ] Respawn invincibility tuning
- [ ] Progressive difficulty balancing (enemy speed/count curves at 100/200/500/1000)

### Platform (High Priority)
- [ ] Mobile optimization pass — touch responsiveness, joystick feel, viewport edge cases

### Audio (Medium Priority)
- [ ] Music refinement — layered intensity per level (Ocean calm → Tank tension → Kitchen urgency)
- [ ] Background art polish

### Code Cleanup (Low Priority)
- [ ] Remove stray `stunTimer = 0` assignment at `app.js:62` (duplicate of declaration on line 46)
- [ ] Remove shadowed `const diff = getDifficulty()` re-declarations at `app.js:480` and `app.js:536` — use outer scope `diff`

### Dev Tooling (Low Priority)
- [ ] Add missing entities to `gameDevGetEntities()` — `seagulls`, `beachBalls`, `jellyfish`, `eels`, `starfish` (`app.js:1272`)
- [ ] Add missing entity types to `gameDevPickEntityAt()` array keys and singleton checks (`app.js:1314`)

---

## Phase 2+ Backlog (March–April 2026)

Parked until Phase 1 ships. Do not start these yet.

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
