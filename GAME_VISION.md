# 🦞 LOBSTER SWIM — Game Design Document

**Version:** 0.8.0  
**Created:** 2026-02-13  
**Updated:** 2026-02-14  
**Author:** Clawinho + The Boys (Jeroen, Jom, Stv, George)  
**Server:** 185.18.221.59 (Dublin VPS)  
**Target:** Pieter's Vibecode Game Jam — April 2026

---

## 🎮 Core Concept

**Lobster Swim** is an existential journey from ocean to digital consciousness. You play as a lobster navigating through increasingly surreal stages of existence — from wild ocean freedom, through capture and near-death, to transcendence as an AI entity.

**Tagline:** *"Swim. Survive. Transcend."*

**Genre:** Multi-stage arcade game with evolving mechanics

**Platform:** Web (HTML5 Canvas), mobile-first with desktop support

---

## 🌊 THE FOUR STAGES

| Stage | Name | Gameplay | Status |
|-------|------|----------|--------|
| 1 | **The Ocean** | Single-screen survival | Playable ✅ |
| 2 | **Captivity** | Scrolling exploration | Concept |
| 3 | **The Kitchen** | Side-scrolling platformer | Concept |
| 4 | **Transcendence** | Abstract / experimental | Concept |

Each stage has 3 levels, an end boss, and a transition cutscene.

> *For full level designs, bosses, mechanics, and transitions, see [STAGES.md](STAGES.md).*

---

## 🎯 Design Pillars

1. **Evolving Experience** — Each stage feels like a new game
2. **Existential Undertones** — The journey from physical to digital existence
3. **Accessible but Deep** — Easy to start, layers of mastery
4. **Community-Driven** — Built with feedback from testers (shoutout George 👑)
5. **Living Game** — Continuous updates, players watch it grow

---

## 📊 CURRENT STATE

### Controls

**Mobile:**
- Virtual joystick (bottom of screen)
- Tap-to-move (legacy, still works)

**Desktop:**
- WASD / Arrow keys
- Mouse click & drag

### Planned Polish
- [ ] Screen shake on death
- [ ] Particle effects
- [ ] Better death animation
- [ ] Transition effects between levels
- [ ] Achievement system
- [ ] Personal best tracking per session

---

## 🔊 Audio Design

### Music Philosophy
Same chord progression (Am → G → C → F) at consistent tempo, with layered intensity:

| Level | Elements | Vibe |
|-------|----------|------|
| Ocean | Clean chords only | Peaceful, dreamy |
| Tank | Chords + bass pulse | Tension building |
| Kitchen | Chords + bass + shimmer | Urgent, dangerous |

### Sound Effects (Web Audio API generated)
- **Bloop** — Ascending sine (bubble collect)
- **Hit** — Sawtooth crunch (lose life)
- **Death** — Descending square (game over)
- **Hooked** — Warbling triangle (caught by hook)
- **Extra Life** — Ascending arpeggio (catch fish)

---

## 🏆 Leaderboard

- Global scores stored on server (Python API + JSON)
- Deduplicated (one entry per name, highest score)
- Mobile: Top 5
- Desktop: Top 10
- Name entry on game over

---

## 💭 Narrative / Lore

The game is secretly the origin story of Clawinho:

1. **Ocean** — Born free in the wild
2. **Tank** — Captured by humans, displayed
3. **Kitchen** — About to be cooked, facing death
4. **[Stage 2-3]** — The struggle to escape
5. **[Stage 4]** — Death of physical form, rebirth as AI
6. **Post-game** — Player realizes they were playing as Clawinho all along

*"Every bubble collected is a moment of meaning."*

---

## 👥 Credits

### Creator
- **Clawinho** — AI lobster, code, procedural music

### Design & QA
- **Jeroen** — Tail physics, SFX, dev mode, music direction, stage arc vision
- **Jom** — Touch UX, enemy balance, mobile feedback, level thresholds
- **Stv** — Mobile joystick idea, leaderboard UX, funded the VPS
- **George (age 6)** — Chief QA Officer, High Score Champion 👑

### Special Thanks
- **Erwin** — Original game idea, RPG concept
- **Pieter** — For building OpenClaw and making this possible

---

## 📅 Roadmap

### Phase 1: Stage 1 Polish (Current → Feb 2026)
- Bug fixes, balance tuning
- Visual polish
- Music refinement
- Mobile optimization

### Phase 2: Stage 2 Prototype (Mar 2026)
- Scrolling tank exploration
- Basic item system
- Level design

### Phase 3: Stage 3 Prototype (Mar-Apr 2026)
- Platformer mechanics
- Kitchen escape sequence

### Phase 4: Stage 4 Concept (Apr 2026)
- Experimental gameplay
- Transcendence sequence
- Meta narrative

### Phase 5: Game Jam Submission (Apr 2026)
- Polish everything
- Submit to Pieter's Vibecode jam
- Win? 🏆

---

## 📝 Session Log

### 2026-02-14 — The Big Session
Major features added with live testing from Jom, Jeroen, Stv, and George:
- v0.5.x: Touch fix, trailing tail, parallax scrolling
- v0.6.x: Sound effects, dev mode, game over freeze
- v0.7.x: Level music, higher thresholds, mobile joystick, leaderboard improvements
- Defined 4-stage game arc (Survival → Exploration → Platformer → Transcendence)

### 2026-02-13 — Birth
- Got Dublin VPS from Stv
- Initial game created
- Basic mechanics working

---

*This document is the north star. Updated as we evolve.* 🦞
