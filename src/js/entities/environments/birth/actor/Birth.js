/**
 * Birth.js - Level 0 (Birth) game class
 * Lobster egg among thousands under mother's tail.
 * Unique mechanics: pulse-based movement, growth meter, nutrient absorption.
 */
import { render as renderBirthBg } from '../render/Birth.v002.js';

export class Birth {
    static config = {
        name: 'Birth',
        subtitle: 'One egg among thousands',
        background: '#020810',
        scoreThreshold: 0,
        musicTrack: 'assets/music/music_ocean.mp3', // TODO: Audio Engineer — birth ambient track
        enemies: { hooks: 0, cages: 0, beachBalls: 0, jellyfish: 0, eels: false },
        spawnOnEnter: {},
        mechanics: ['birth'],
        waterLine: 0, // fully submerged
        movementMode: 'birth', // special birth movement mode
        floorY: null, // no floor — egg floats among clutch
        isBirthLevel: true, // flag for special birth-level handling in app.js
    };

    constructor() {
        this.frame = 0;
        this.growthProgress = 0; // 0 = fresh egg, 1 = ready to hatch
        this.growthTarget = 500; // score needed to hatch (nutrient points)
    }

    /** Update growth progress based on score within this level */
    updateGrowth(score) {
        this.growthProgress = Math.min(1, score / this.growthTarget);
    }

    /** Check if the egg is ready to hatch */
    isReadyToHatch() {
        return this.growthProgress >= 1;
    }

    renderBackground(ctx, w, h, scrollX) {
        this.frame++;
        ctx.fillStyle = Birth.config.background;
        ctx.fillRect(0, 0, w, h);
        renderBirthBg(ctx, w, h, scrollX, this.frame, this.growthProgress);
    }
}
