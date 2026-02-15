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
│       ├── hero/           # Lobster + versions
│       ├── enemies/        # Hook, Cage, Net, Fork + versions
│       ├── pickups/        # Bubble, GoldenFish + versions
│       ├── effects/        # Particle.js
│       ├── mechanics/      # Magnetism, Invincibility, Difficulty
│       └── environments/   # Ocean, Tank, Kitchen backgrounds
├── pages/
│   ├── assets.html     # Asset library with live previews
│   ├── commits.html    # Changelog
│   └── roadmap.html    # Development roadmap
└── assets/
    └── music/          # MP3 files for level music
```

## Adding New Entities

When adding something new to the game, **always follow the entity pattern**:

### 1. Create versioned entity file
```
src/js/entities/<category>/versions/<Name>.v001.js
```

Categories: `hero`, `enemies`, `pickups`, `effects`, `mechanics`, `environments`

### 2. Entity file structure
```js
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

### 3. Export from index
Add to `src/js/entities/<category>/index.js` or create main `<Name>.js` that imports the current version.

### 4. Add to assets library (REQUIRED)
Every entity must be previewable in the assets page:

a) Add canvas in HTML:
```html
<div class="asset-card" data-entity="name">
    <div class="version-tabs">
        <span class="version-tab active" data-version="001">v001<span class="star">★</span></span>
    </div>
    <div class="asset-preview"><canvas id="name-canvas" width="200" height="150"></canvas></div>
    <div class="asset-info">
        <h3>Name</h3><p>Description</p>
        <div class="controls">
            <div class="control-row"><label>Param</label><input type="range" id="name-param" min="0" max="100" value="50"><span class="value">50</span></div>
        </div>
    </div>
</div>
```

b) Import renderer in assets.html:
```js
import { render as nameV001 } from '../js/entities/<category>/versions/<Name>.v001.js';
```

c) Add to renderers object:
```js
'name-001': (c,x,y,param) => nameV001(c,x,y,param),
```

d) Add to params and selectedVersions:
```js
params.nameParam = 50;
selectedVersions.name = '001';
```

e) Add canvas to canvases object:
```js
canvases.name = document.getElementById('name-canvas');
```

f) Add render call in animate():
```js
if(c('name')) {
    const r = renderers[`name-${selectedVersions.name}`];
    if(r) r(c('name'), 100, 75, params.nameParam);
}
```

g) Wire slider in sliderConfig:
```js
['name-param', 'nameParam'],
```

### 5. Version iteration
When improving an entity:
- Create `<Name>.v002.js` with improvements
- Add new version tab to assets page
- Update renderers object with new version
- Test both versions work via tabs
- Set `@current true` on new version when ready

## Critical Lessons Learned

### 1. ALWAYS check which file is the entry point
- `index.html` loads `<script type="module" src="js/app.js">`
- **app.js is the main game**, not main.js
- Edit the wrong file = changes don't appear

### 2. nginx serves from `/home/ubuntu/lobster-game/src/`
- NOT from `/var/www/html/`
- Check nginx config if confused: `cat /etc/nginx/sites-enabled/default`

### 3. Asset page slider wiring pattern
When adding a slider to assets.html:
1. Add HTML slider with id: `<input type="range" id="entity-param">`
2. Add to params object: `params.entityParam = defaultValue`
3. Add to sliderConfig array: `['entity-param', 'entityParam']`
4. Pass param to renderer in animate(): `renderer(ctx, x, y, params.entityParam)`
5. **Update renderer wrapper** in renderers object to accept and pass the param

Common mistake: Renderer wrapper ignores extra params!
```js
// BAD - ignores shimmer:
'fish-002': (c,x,y,t) => fishV002(c,x,y,t,15,1,5)

// GOOD - passes shimmer through:
'fish-002': (c,x,y,t,size,dir,shimmer) => fishV002(c,x,y,t,size||15,dir||1,shimmer||5)
```

### 4. Entity version tabs
- Each card needs `data-entity="name"` attribute
- Tabs need `data-version="00X"` attribute
- selectedVersions object tracks current version per entity
- animate() uses `renderers[\`entity-${selectedVersions.entity}\`]`

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
