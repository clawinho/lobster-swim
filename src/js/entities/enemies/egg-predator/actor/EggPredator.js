/**
 * EggPredator.js - Small fish that preys on lobster eggs
 * Swims in visible hunger paths across the egg clutch area.
 */
import { render } from '../render/EggPredator.v001.js';

export class EggPredator {
    constructor(x, y, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.size = 25 + Math.random() * 15;
        this.speed = 0.8 + Math.random() * 0.6;
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.frame = Math.random() * 100 | 0;
        this.vy = 0;
        this.targetY = y;
        this.alive = true;
        // Hunger path — sinusoidal sweep pattern
        this.pathPhase = Math.random() * Math.PI * 2;
        this.pathAmplitude = 30 + Math.random() * 40;
    }

    update() {
        this.frame++;
        // Move horizontally
        this.x += this.speed * this.direction;

        // Sinusoidal vertical sweep — "hunger path"
        this.targetY = this.canvasHeight * 0.35 +
            Math.sin(this.frame * 0.01 + this.pathPhase) * this.pathAmplitude;
        this.y += (this.targetY - this.y) * 0.02;

        // Wrap around
        if (this.direction > 0 && this.x > this.canvasWidth + 50) {
            this.x = -50;
            this.y = this.canvasHeight * 0.25 + Math.random() * this.canvasHeight * 0.4;
        }
        if (this.direction < 0 && this.x < -50) {
            this.x = this.canvasWidth + 50;
            this.y = this.canvasHeight * 0.25 + Math.random() * this.canvasHeight * 0.4;
        }
    }

    getBounds() {
        return {
            x: this.x - this.size * 0.4,
            y: this.y - this.size * 0.2,
            width: this.size * 0.8,
            height: this.size * 0.4,
        };
    }

    checkCollision(player) {
        const pb = player.getBounds();
        const eb = this.getBounds();
        return pb.x < eb.x + eb.width &&
               pb.x + pb.width > eb.x &&
               pb.y < eb.y + eb.height &&
               pb.y + pb.height > eb.y;
    }

    draw(ctx) {
        render(ctx, this.x, this.y, this.size, this.frame, this.direction);
    }

    /** Create initial set of predators */
    static create(count, canvasWidth, canvasHeight) {
        const predators = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * canvasWidth;
            const y = canvasHeight * 0.25 + Math.random() * canvasHeight * 0.4;
            predators.push(new EggPredator(x, y, canvasWidth, canvasHeight));
        }
        return predators;
    }
}
