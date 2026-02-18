/**
 * ClawsPowerup.js - Special progression pickup that grants claws
 * 
 * Spawns once at a score threshold in Level 1. Falls from top, lands on floor.
 * Collecting it grants:
 * - Visual upgrade (lobster gets claws)
 * - Defensive ability: deflect one enemy hit (consumes claws, brief invincibility)
 */
import { render as renderClaws } from '../render/ClawsPowerup.v001.js';

export class ClawsPowerup {
    constructor(x, floorY) {
        this.x = x;
        this.y = -30;
        this.floorY = floorY;
        this.size = 24;
        this.time = 0;
        this.active = true;
        this.landed = false;
        this.vy = 0.8;
    }

    update() {
        if (!this.active) return;
        this.time++;

        if (!this.landed) {
            this.y += this.vy;
            if (this.y >= this.floorY - this.size * 0.5) {
                this.y = this.floorY - this.size * 0.5;
                this.landed = true;
            }
        }
    }

    render(ctx) {
        if (!this.active) return;
        renderClaws(ctx, this.x, this.y, this.size, this.time);
    }

    checkCollision(player) {
        if (!this.active) return false;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) < player.size + this.size;
    }

    static spawnOne(canvasWidth, floorY) {
        const x = 80 + Math.random() * (canvasWidth - 160);
        return new ClawsPowerup(x, floorY);
    }
}
