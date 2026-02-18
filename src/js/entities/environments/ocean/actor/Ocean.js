/**
 * Ocean.js - Level 1 game class
 * Self-contained level entity following the game-class + versioned-renderer pattern.
 */
import { render as renderOceanBg } from '../render/Ocean.v002.js';

export class Ocean {
    static config = {
        name: 'The Ocean',
        subtitle: null,
        background: '#001020',
        scoreThreshold: 500,
        musicTrack: 'assets/music/music_ocean.mp3',
        enemies: { hooks: 0, cages: 0, beachBalls: 0, jellyfish: 0, eels: false },
        spawnOnEnter: {},
        mechanics: ['oceanCurrent'],
        waterLine: 0, // fully submerged
        movementMode: 'floor', // baby lobster — left/right only on ocean floor
        floorY: 480, // Y position of the ocean floor
    };

    renderBackground(ctx, w, h, scrollX) {
        ctx.fillStyle = Ocean.config.background;
        ctx.fillRect(0, 0, w, h);
        renderOceanBg(ctx, w, h, scrollX);
    }
}
