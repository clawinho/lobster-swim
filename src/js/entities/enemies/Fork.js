/**
 * Fork.js - Kitchen fork enemy (Level 3)
 * Falls from sky like danger from above
 * Rendering delegated to versioned renderer (DRY)
 */
import { render as renderFork } from "./versions/Fork.v001.js";

export class Fork {
    constructor(x, canvasHeight = 600) {
        this.x = x;
        this.y = -50;
        this.fallSpeed = 2 + Math.random() * 2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.05 + Math.random() * 0.05;
        this.canvasHeight = canvasHeight;
    }

    static create(count = 3, canvasWidth = 800, canvasHeight = 600) {
        const forks = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (canvasWidth - 100) + 50;
            const fork = new Fork(x, canvasHeight);
            fork.y = -50 - (i * 150);
            forks.push(fork);
        }
        return forks;
    }

    update(difficultyMult = 1, canvasWidth = 800, canvasHeight = 600) {
        this.y += this.fallSpeed * difficultyMult;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;

        if (this.y > canvasHeight + 100) {
            this.y = -50 - Math.random() * 100;
            this.x = Math.random() * (canvasWidth - 100) + 50;
            this.fallSpeed = 2 + Math.random() * 2;
        }

        this.x = Math.max(50, Math.min(canvasWidth - 50, this.x));
    }

    render(ctx) {
        renderFork(ctx, this.x, this.y);
    }

    getBounds() {
        return {
            x: this.x - 15,
            y: this.y - 50,
            width: 30,
            height: 85,
            centerX: this.x,
            centerY: this.y
        };
    }

    checkCollision(player, invincible = false) {
        if (invincible) return false;
        const dx = Math.abs(player.x - this.x);
        const dy = player.y - this.y;
        if (dx < 20 && dy > -10 && dy < 40) {
            return true;
        }
        return false;
    }
}
