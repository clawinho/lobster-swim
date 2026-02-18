/**
 * Seagull.js - Diving seagull enemy
 * Flies across the screen, dives down when above player
 * For Beach Shallows (level 1-3)
 * Render: v001
 */

import { render as renderSeagull } from "../render/Seagull.v001.js";

export class Seagull {
    constructor(x, y, direction = 1, waterLine = 0) {
        this.x = x;
        this.y = y;
        this.direction = direction; // 1 = right, -1 = left
        this.speed = 2 + Math.random() * 1.5;
        this.wingPhase = Math.random() * Math.PI * 2;
        this.diving = false;
        this.diveSpeed = 0;
        this.diveTarget = null;
        this.baseY = y;
        this._waterLine = waterLine;
        this.returningUp = false;
    }

    static create(canvasWidth, canvasHeight, count = 2, waterLine = 0) {
        const gulls = [];
        // Seagulls fly above the waterline
        const maxFlyY = waterLine > 0 ? waterLine - 20 : 90;
        for (let i = 0; i < count; i++) {
            const fromLeft = Math.random() > 0.5;
            const x = fromLeft ? -50 : canvasWidth + 50;
            const y = 20 + Math.random() * Math.max(20, maxFlyY - 20);
            const direction = fromLeft ? 1 : -1;
            gulls.push(new Seagull(x, y, direction, waterLine));
        }
        return gulls;
    }

    update(playerX, playerY, canvasWidth, canvasHeight) {
        // Wing flapping
        this.wingPhase += this.diving ? 0.3 : 0.15;
        
        if (this.diving) {
            // Dive towards target
            this.diveSpeed = Math.min(this.diveSpeed + 0.3, 8);
            this.y += this.diveSpeed;
            
            // Check if we've gone deep enough or past target
            if (this.y > canvasHeight - 100 || this.y > this.diveTarget + 50) {
                this.diving = false;
                this.returningUp = true;
            }
        } else if (this.returningUp) {
            // Return to flying height
            this.y -= 3;
            if (this.y <= this.baseY) {
                this.y = this.baseY;
                this.returningUp = false;
                this.diveSpeed = 0;
            }
        } else {
            // Normal flying - check if should dive
            const distToPlayer = Math.abs(this.x - playerX);
            if (distToPlayer < 30 && this.y < playerY - 50 && Math.random() < 0.02) {
                this.diving = true;
                this.diveTarget = playerY;
                this.diveSpeed = 1;
            }
        }
        
        // Horizontal movement
        this.x += this.speed * this.direction;
        
        // Respawn when off screen
        if (this.direction > 0 && this.x > canvasWidth + 60) {
            this.x = -50;
            const maxY = (this._waterLine || 90) - 20;
            this.y = 20 + Math.random() * Math.max(20, maxY - 20);
            this.baseY = this.y;
        } else if (this.direction < 0 && this.x < -60) {
            this.x = canvasWidth + 50;
            const maxY2 = (this._waterLine || 90) - 20;
            this.y = 20 + Math.random() * Math.max(20, maxY2 - 20);
            this.baseY = this.y;
        }
    }

    render(ctx) {
        ctx.save();
        // Flip based on direction
        if (this.direction < 0) {
            ctx.translate(this.x, this.y);
            ctx.scale(-1, 1);
            renderSeagull(ctx, 0, 0, this.wingPhase, this.diving);
        } else {
            renderSeagull(ctx, this.x, this.y, this.wingPhase, this.diving);
        }
        ctx.restore();
    }

    checkCollision(player, invincible = false) {
        if (invincible) return false;
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Hitbox is smaller when not diving
        const hitRadius = this.diving ? 25 : 20;
        return dist < player.size + hitRadius;
    }
}
