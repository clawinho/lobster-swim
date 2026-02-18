/**
 * Beach.js - Level 3 game class
 * Beach environment: progressive scrolling toward shore.
 * Progress 0→1 as score increases within Beach level.
 */
import { render as renderBeachBg } from '../render/Beach.v003.js';

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
        waterLine: 0.5,
        movementMode: 'swim', // full 2D swimming
        scrolling: true,         // Beach level scrolls
        progressStart: 3000,     // score at which Beach starts
        progressEnd: 6000,       // score at which progress reaches 1.0
    };

    constructor() {
        this.progress = 0; // 0 = deep water, 1 = on beach
    }

    /** Call each frame with current score to update progress */
    updateProgress(score) {
        const { progressStart, progressEnd } = Beach.config;
        this.progress = Math.max(0, Math.min(1, (score - progressStart) / (progressEnd - progressStart)));
    }

    /** Returns current water line Y ratio, adjusting for progress */
    getWaterLine() {
        // Water line moves down as we approach shore (more sky)
        return 0.25 + this.progress * 0.45;
    }

    renderBackground(ctx, w, h, scrollX) {
        ctx.fillStyle = Beach.config.background;
        ctx.fillRect(0, 0, w, h);
        renderBeachBg(ctx, w, h, scrollX, this.progress);
    }
}
