/**
 * Starfish.js - Score multiplier pickup
 * Collecting grants 2x score multiplier for 8 seconds
 */
import { render as renderStarfish } from '../render/Starfish.v001.js';

export class Starfish {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.time = Math.random() * 100;
        this.active = true;
        this.bobOffset = Math.random() * Math.PI * 2;
        
        // Gentle sinking motion
        this.vy = 0.2;
        this.vx = (Math.random() - 0.5) * 0.4;
    }
    
    update() {
        this.time++;
        
        // Gentle floating/sinking with wobble
        this.y += this.vy + Math.sin(this.time * 0.03 + this.bobOffset) * 0.2;
        this.x += this.vx + Math.cos(this.time * 0.02) * 0.15;
        
        // Despawn if off screen
        if (this.y > 650 || this.x < -50 || this.x > 850) {
            this.active = false;
        }
    }
    
    render(ctx) {
        if (!this.active) return;
        renderStarfish(ctx, this.x, this.y, this.time, this.size);
    }
    
    checkCollision(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < player.size + this.size;
    }
}
