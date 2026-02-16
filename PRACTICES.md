# Lobster Swim - Development Practices

## File Structure

```
src/
├── index.html          # Main game page
├── css/game.css        # Game styles
├── js/
│   ├── app.js          # ⚠️ MAIN ENTRY POINT - this is what runs!
│   ├── main.js         # Unused/legacy modular version
│   ├── audio-module.js # Sound effects + music
│   ├── components/
│   │   ├── BottomNav.js    # Reusable nav component
│   │   ├── TitleScreen.js
│   │   ├── GameOver.js
│   │   └── Leaderboard.js
│   └── entities/
│       ├── utils/              # Shared helpers (colors.js, etc.)
│       ├── hero/
│       │   └── lobster/
│       │       ├── actor/Lobster.js        # Game class
│       │       ├── render/Lobster.v001.js  # Versioned renderers
│       │       └── preview.js              # Asset library manifest
│       ├── enemies/            # hook/, cage/, net/, fork/, seagull/, beachball/
│       ├── pickups/            # bubble/, goldfish/, pearl/
│       ├── effects/            # particle/
│       ├── mechanics/          # magnetism/, invincibility/, difficulty/, ocean-current/
│       └── environments/       # ocean/, tank/, kitchen/
├── pages/
│   ├── assets.html     # Asset library with live previews
│   ├── commits.html    # Changelog
│   └── roadmap.html    # Development roadmap
└── assets/
    └── music/          # MP3 files for level music
```

## Adding New Entities

When adding something new to the game, **always follow the entity pattern**:

### 1. Create entity folder
```
src/js/entities/<category>/<entity-name>/
├── actor/<Name>.js       # Game class (imports current renderer)
├── render/<Name>.v001.js # Versioned renderer (pure drawing)
└── preview.js            # Asset library manifest (auto-discovered)
```

Categories: `hero`, `enemies`, `pickups`, `effects`, `mechanics`, `environments`

### 2. Add versioned renderer
```js
// src/js/entities/<category>/<entity-name>/render/<Name>.v001.js
/**
 * <Name>.v001.js - Description
 * @version 001
 * @current true (if this is the active version)
 */
export function render(ctx, x, y, ...params) {
    // Drawing code
}

export const meta = {
    version: "001",
    name: "Entity Name",
    current: true,
    features: ["feature1", "feature2"]
};
```

### 3. Add actor (game class)
```js
// src/js/entities/<category>/<entity-name>/actor/<Name>.js
import { render } from '../render/<Name>.v001.js';
// Owns state, physics, collision detection. Delegates drawing to renderer.
```

### 4. Export from category index
Add to `src/js/entities/<category>/index.js`.

### 5. Add to assets library (REQUIRED)
Create a `preview.js` in your entity directory. The asset library auto-discovers it via `import.meta.glob`.

```js
// src/js/entities/<category>/<name>/preview.js
import { render as v001 } from './render/<Name>.v001.js';

export const manifest = {
    id: 'name',               // unique id
    name: 'Display Name',     // shown in card
    description: 'What it does.',
    category: '<category>',   // hero | enemies | pickups | environments | mechanics
    tags: [],                 // optional display tags
    configKey: 'configKey',   // key into ENTITY_CONFIG (null if none)
};

export const defaults = { size: 50 };  // mutable state for sliders + preview

export const versions = [
    {
        meta: { version: '001', name: 'Version Name', current: true },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2, state.size),
    },
];

// Optional: render-only controls not in ENTITY_CONFIG
export const renderControls = [
    { key: 'size', type: 'range', min: 10, max: 100, value: 50, label: 'Size' },
];
```

That's it — no HTML, no manual wiring. The `asset-library.js` module handles canvas creation, version tabs, slider generation, and the animate loop.

### 6. Version iteration
When improving an entity:
- Create `render/<Name>.v002.js` with improvements
- Add the new version to the `versions` array in `preview.js`
- Test both versions work via tabs in the asset library
- Set `@current true` on new version when ready
- Update the actor's import to point to the new renderer

## Critical Lessons Learned

### 1. ALWAYS check which file is the entry point
- `index.html` loads `<script type="module" src="js/app.js">`
- **app.js is the main game**, not main.js
- Edit the wrong file = changes don't appear

### 2. nginx serves from `/home/ubuntu/lobster-game/src/`
- NOT from `/var/www/html/`
- Check nginx config if confused: `cat /etc/nginx/sites-enabled/default`

### 3. Asset library is auto-discovered
The asset library (`pages/assets.html`) uses `import.meta.glob` to find all `preview.js` files.
No manual slider wiring, canvas registration, or renderers object needed.
See "Add to assets library" above for the `preview.js` contract.

### 4. Entity version tabs
Version tabs are generated automatically from the `versions` array in each `preview.js`.
Mark the active version with `current: true` in the version's `meta` object.

### 5. Web Components (like BottomNav)
- Use Shadow DOM for style encapsulation
- Dispatch custom events with `bubbles: true, composed: true` to escape shadow DOM
- Import with `<script type="module" src="path/Component.js">`

### 6. Music files
- Level music: `assets/music/music_ocean.mp3`, `music_tank.mp3`, `music_kitchen.mp3`
- OG groovy jazz: `assets/music/lobster_jazz_groovy.mp3` (Transport Tycoon style from v0.3.2)
- Ambient version: `assets/music/lobster_jazz.mp3` (2-min loop, less groovy)

### 7. Dev panel
- Triggered by clicking version number in BottomNav
- BottomNav dispatches `version-click` custom event
- Dev functions exposed on window: `gameDevSetLevel`, `gameDevAddScore`, etc.

### 8. Particle system
- `Particle.js` in `entities/effects/`
- Static factory methods: `Particle.spawnBubbleParticles(x, y)`
- Returns array, use spread: `particles.push(...Particle.spawnBubbleParticles(x, y))`

## Version Bumping
- Update version in: `index.html`, `pages/*.html`, `components/BottomNav.js`
- Or use sed: `sed -i 's/1.0.X/1.0.Y/g' src/index.html src/pages/*.html src/js/components/BottomNav.js`

## Testing Checklist
Before committing:
- [ ] Hard refresh (Ctrl+Shift+R) to clear cache
- [ ] Check version number shows correctly
- [ ] Test the specific feature changed
- [ ] Check browser console for errors

## Git Archaeology
To find old music/assets:
```bash
git log --oneline --all -- '*filename*'
git show <commit>:path/to/file > restored_file
```

### 9. Pre-dev reality check (added 2026-02-15)
**ALWAYS run this before any dev work:**
```bash
git log --oneline -5
```
Don't trust LLM memory or context - it gets compacted and loses track of versions.
Check the actual git history, not what you think you remember.

## Code Quality Rules (added 2026-02-15)

### 1. DRY — Don't Repeat Yourself
- If you write the same code twice, **STOP** and extract it to a shared module
- Utility functions (color conversion, math helpers, etc.) go in `entities/utils/`
- Constants and presets should exist in ONE place only

### 2. Encapsulation
- Each entity owns its own rendering and behavior
- Pass parameters IN, don't reach OUT for config
- Entity signature: `render(ctx, x, y, ...entitySpecificParams)`
- Animation states, colors, variants = parameters, not external if/else

### 3. Single Source of Truth
- Versioned renderers (`v001`, `v002`) are the source for how entities look
- Game classes should IMPORT and USE versioned renderers, not duplicate drawing code
- Asset library imports same renderers — if it works in assets, it works in game

### 4. Be Honest
- When asked "did you duplicate code?" — check and answer truthfully
- When taking shortcuts, acknowledge them upfront
- Don't claim something is "encapsulated" when it's actually copy-pasted

### 5. Refactor First
- Before adding features, check if existing code follows these rules
- Fix violations before adding more tech debt
- "Quick fix now, refactor later" = never refactored

### File Structure for Shared Code
```
src/js/entities/
├── utils/
│   └── colors.js          # hslToRgba, COLOR_PRESETS
├── hero/
│   └── lobster/
│       ├── actor/Lobster.js        # Game class (imports renderer + utils)
│       ├── render/Lobster.v004.js  # Current renderer (import from ../../utils/)
│       └── preview.js
├── pickups/
│   └── bubble/
│       ├── actor/Bubble.js         # Game class (imports renderer + utils)
│       ├── render/Bubble.v002.js   # Current renderer
│       └── preview.js
```
