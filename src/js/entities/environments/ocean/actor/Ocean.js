/**
 * Ocean.js - Level 1 game class
 * Self-contained level entity following the game-class + versioned-renderer pattern.
 */
import { render as renderOceanBg } from '../render/Ocean.v001.js';

export class Ocean {
    static config = {
        name: 'The Ocean',
        subtitle: null,
        background: '#001020',
        scoreThreshold: 0,
        musicTrack: 'assets/music/music_ocean.mp3',
        enemies: { hooks: 2, beachBalls: 2 },
        spawnOnEnter: {},
        mechanics: ['oceanCurrent'],
    };

    renderBackground(ctx, w, h, scrollX) {
        ctx.fillStyle = Ocean.config.background;
        ctx.fillRect(0, 0, w, h);
        renderOceanBg(ctx, w, h, scrollX);
    }
}
