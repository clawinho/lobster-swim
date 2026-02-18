/**
 * Beach.js - Level 3 game class
 * Beach environment: half sky+waves, half sandy floor.
 */
import { render as renderBeachBg } from '../render/Beach.v002.js';

export class Beach {
    static config = {
        name: 'The Beach',
        subtitle: 'Sun, sand, and survival',
        background: '#1a2a35',
        scoreThreshold: 3000,
        musicTrack: 'assets/music/music_kitchen.mp3',
        enemies: { hooks: 4, cages: 4, nets: 3, forks: 4, jellyfish: 2, eels: true, seagulls: 3, beachBalls: 2 },
        spawnOnEnter: { forks: 4, hooks: 2, seagulls: 3, beachBalls: 2 },
        mechanics: [],
    };

    renderBackground(ctx, w, h, scrollX) {
        ctx.fillStyle = Beach.config.background;
        ctx.fillRect(0, 0, w, h);
        renderBeachBg(ctx, w, h, scrollX);
    }
}
