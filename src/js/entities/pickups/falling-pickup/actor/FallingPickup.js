/**
 * FallingPickup.js - Collectible that falls from the top and lands on the ocean floor
 * Different types (shell, clam, seaweed) with varying point values
 */
import { render as renderPickup, getPoints } from '../render/FallingPickup.v001.js';

const TYPES = ['shell', 'clam', 'seaweed'];

export class FallingPickup {
    constructor(x, floorY, type = null) {
        this.x = x;
        this.y = -20; // Start above screen
        this.floorY = floorY;
        this.size = 16 + Math.random() * 8;
        this.type = type || TYPES[Math.floor(Math.random() * TYPES.length)];
        this.points = getPoints(this.type);
        this.time = Math.random() * 100;
        this.active = true;
        this.landed = false;

        // Fall speed with slight variation
        this.vy = 1.0 + Math.random() * 0.8;
        // Gentle horizontal drift
        this.vx = (Math.random() - 0.5) * 0.5;
    }

    update() {
        if (!this.active) return;
        this.time++;

        if (!this.landed) {
            this.y += this.vy;
            this.x += this.vx;

            // Land on the floor
            if (this.y >= this.floorY - this.size * 0.5) {
                this.y = this.floorY - this.size * 0.5;
                this.landed = true;
                this.vy = 0;
                this.vx = 0;
            }
        }
    }

    render(ctx) {
        if (!this.active) return;
        renderPickup(ctx, this.x, this.y, this.size, this.time, this.type, this.landed);
    }

    checkCollision(player) {
        if (!this.active) return false;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < player.size + this.size;
    }

    /** Spawn a single falling pickup at a random x position */
    static spawnOne(canvasWidth, floorY) {
        const x = 40 + Math.random() * (canvasWidth - 80);
        return new FallingPickup(x, floorY);
    }
}
