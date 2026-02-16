/**
 * TankLevel.js - Level 2 game class
 * Self-contained level entity following the game-class + versioned-renderer pattern.
 */
import { render as renderTankBg } from './versions/TankLevel.v001.js';

export class TankLevel {
    static config = {
        name: 'Seafood Tank',
        subtitle: 'Captured... but not defeated',
        background: '#002030',
        scoreThreshold: 200,
        musicTrack: 'assets/music/music_tank.mp3',
        enemies: { hooks: 2, nets: 2 },
        spawnOnEnter: { nets: 2 },
        mechanics: [],
    };

    renderBackground(ctx, w, h, scrollX) {
        ctx.fillStyle = TankLevel.config.background;
        ctx.fillRect(0, 0, w, h);
        renderTankBg(ctx, w, h);
    }
}
