/**
 * Tank.js - Level 2 game class
 * Self-contained level entity following the game-class + versioned-renderer pattern.
 */
import { render as renderTankBg } from '../render/Tank.v002.js';

export class Tank {
    static config = {
        name: 'Seafood Tank',
        subtitle: 'Captured... but not defeated',
        background: '#002030',
        scoreThreshold: 200,
        musicTrack: 'assets/music/music_tank.mp3',
        enemies: { hooks: 3, nets: 3 },
        spawnOnEnter: { nets: 3, hooks: 2 },
        mechanics: [],
    };

    renderBackground(ctx, w, h, scrollX) {
        ctx.fillStyle = Tank.config.background;
        ctx.fillRect(0, 0, w, h);
        renderTankBg(ctx, w, h);
    }
}
