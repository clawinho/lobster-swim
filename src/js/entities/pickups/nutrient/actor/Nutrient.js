/**
 * Nutrient.js - Drifting nutrient pickup for Birth level
 * Organic matter floating through the egg clutch. Absorb to grow.
 */
import { render } from '../render/Nutrient.v001.js';

const TYPES = ['green', 'gold', 'blue'];
const SCORES = { green: 10, gold: 25, blue: 15 };

export class Nutrient {
    constructor(x, y, type = 'green') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = type === 'gold' ? 8 : 6;
        this.score = SCORES[type];
        this.frame = Math.random() * 100 | 0;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -0.2 - Math.random() * 0.3; // drift upward gently
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.alive = true;
    }

    update(canvasWidth, canvasHeight) {
        this.frame++;
        this.x += this.vx + Math.sin(this.frame * 0.02 + this.wobblePhase) * 0.2;
        this.y += this.vy;
        // Wrap around edges
        if (this.x < -20) this.x = canvasWidth + 20;
        if (this.x > canvasWidth + 20) this.x = -20;
        if (this.y < -20) this.alive = false; // despawn off top
    }

    getBounds() {
        return {
            x: this.x - this.size,
            y: this.y - this.size,
            width: this.size * 2,
            height: this.size * 2,
        };
    }

    checkCollision(player) {
        const pb = player.getBounds();
        const nb = this.getBounds();
        return pb.x < nb.x + nb.width &&
               pb.x + pb.width > nb.x &&
               pb.y < nb.y + nb.height &&
               pb.y + pb.height > nb.y;
    }

    draw(ctx) {
        render(ctx, this.x, this.y, this.size, this.frame, this.type);
    }

    /** Spawn a batch of nutrients scattered across the play area */
    static createBatch(count, canvasWidth, canvasHeight) {
        const nutrients = [];
        for (let i = 0; i < count; i++) {
            const type = TYPES[Math.random() < 0.15 ? 1 : (Math.random() < 0.3 ? 2 : 0)];
            const x = Math.random() * canvasWidth;
            const y = canvasHeight * 0.3 + Math.random() * canvasHeight * 0.6;
            nutrients.push(new Nutrient(x, y, type));
        }
        return nutrients;
    }

    /** Spawn a single nutrient at a random position */
    static spawnOne(canvasWidth, canvasHeight) {
        const type = TYPES[Math.random() < 0.15 ? 1 : (Math.random() < 0.3 ? 2 : 0)];
        const x = Math.random() * canvasWidth;
        const y = canvasHeight + 10; // spawn below screen, drift up
        return new Nutrient(x, y, type);
    }
}
