/**
 * Jellyfish.js - Drifting jellyfish that stings on contact
 * Render: v001 (translucent pulsating)
 * 
 * Design: Non-lethal hazard that stuns/slows the lobster
 * - Drifts slowly with gentle bobbing motion
 * - Pulsates organically
 * - On collision: stuns player (reduced speed) for ~2 seconds
 * - Multiple color variants
 */

import { render as renderJellyfish } from '../render/Jellyfish.v001.js';

const COLORS = ['#cc44ff', '#44ccff', '#ff44aa', '#44ffcc', '#ffaa44'];
const STUN_DURATION = 120; // 2 seconds at 60fps
const STUN_SPEED_MULT = 0.3; // 30% speed while stunned

export class Jellyfish {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 25 + Math.random() * 15;
        
        // Slow drift
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -0.3 - Math.random() * 0.3; // Gentle upward drift
        
        // Animation
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.bobPhase = Math.random() * Math.PI * 2;
        
        // Color
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        
        // Sting cooldown
        this.stingCooldown = 0;
    }

    static get STUN_DURATION() { return STUN_DURATION; }
    static get STUN_SPEED_MULT() { return STUN_SPEED_MULT; }

    /**
     * Create jellyfish for a level
     */
    static create(count, canvasWidth, canvasHeight) {
        const jellies = [];
        for (let i = 0; i < count; i++) {
            const x = 50 + Math.random() * (canvasWidth - 100);
            const y = 100 + Math.random() * (canvasHeight - 200);
            jellies.push(new Jellyfish(x, y));
        }
        return jellies;
    }

    update(difficultyMult = 1, canvasWidth, canvasHeight) {
        // Pulse animation
        this.pulsePhase += 0.04 * difficultyMult;
        this.bobPhase += 0.02;
        
        // Drift with bobbing
        this.x += this.vx * difficultyMult;
        this.y += this.vy * difficultyMult + Math.sin(this.bobPhase) * 0.3;
        
        // Wrap around screen edges
        if (this.x < -this.size) this.x = canvasWidth + this.size;
        if (this.x > canvasWidth + this.size) this.x = -this.size;
        if (this.y < -this.size * 2) {
            // Respawn at bottom
            this.y = canvasHeight + this.size;
            this.x = 50 + Math.random() * (canvasWidth - 100);
        }
        if (this.y > canvasHeight + this.size) {
            this.y = -this.size;
        }
        
        if (this.stingCooldown > 0) this.stingCooldown--;
    }

    render(ctx) {
        renderJellyfish(ctx, this.x, this.y, this.size, this.pulsePhase, this.color);
    }

    /**
     * Check collision - returns true if stung
     */
    checkCollision(player, invincible = false) {
        if (invincible || this.stingCooldown > 0) return false;
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.size + player.size * 0.8) {
            this.stingCooldown = 90; // 1.5s cooldown before can sting again
            return true;
        }
        return false;
    }
}
