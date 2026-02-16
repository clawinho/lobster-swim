/**
 * Cage.js - Lobster trap enemy
 * Floating traps that move around and catch the player
 * Render: v002 (wooden trap with bars and entrance funnel)
 */

import { render as renderCage } from '../render/Cage.v002.js';

export class Cage {
    constructor(x, y, size = 40) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseDx = (Math.random() - 0.5) * 1.5;
        this.baseDy = (Math.random() - 0.5) * 1.5;
    }

    static create(count = 2, canvasWidth = 800, canvasHeight = 600) {
        const cages = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (canvasWidth - 100);
            const y = Math.random() * (canvasHeight - 100);
            cages.push(new Cage(x, y, 40));
        }
        return cages;
    }

    update(difficultyMult = 1, canvasWidth = 800, canvasHeight = 600) {
        this.x += this.baseDx * difficultyMult;
        this.y += this.baseDy * difficultyMult;

        // Bounce off walls
        if (this.x < 0 || this.x > canvasWidth) this.baseDx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.baseDy *= -1;

        // Clamp position
        this.x = Math.max(0, Math.min(canvasWidth, this.x));
        this.y = Math.max(0, Math.min(canvasHeight, this.y));
    }

    render(ctx) {
        renderCage(ctx, this.x, this.y, this.size);
    }

    getBounds() {
        const w = this.size * 1.8;
        const h = this.size * 1.2;
        return {
            x: this.x - w / 2,
            y: this.y - h / 2,
            width: w,
            height: h,
            centerX: this.x,
            centerY: this.y
        };
    }

    checkCollision(player, invincible = false) {
        if (invincible) return false;
        
        const bounds = this.getBounds();
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        return dist < player.size + this.size * 0.8;
    }
}
