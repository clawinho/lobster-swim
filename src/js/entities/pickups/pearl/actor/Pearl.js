/**
 * Pearl.js - Magic pearl pickup that grants invincibility
 * Imports renderer from versioned file (DRY principle)
 */

import { render as renderPearl } from '../render/Pearl.v001.js';

export class Pearl {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 25;
        this.time = Math.random() * 100; // Randomize animation phase
        this.active = true;
        this.bobOffset = Math.random() * Math.PI * 2;
        
        // Slowly float upward
        this.vy = -0.3;
        // Gentle horizontal drift
        this.vx = (Math.random() - 0.5) * 0.5;
    }
    
    update() {
        this.time++;
        
        // Gentle floating motion
        this.y += this.vy + Math.sin(this.time * 0.02 + this.bobOffset) * 0.3;
        this.x += this.vx;
        
        // Despawn if off screen
        if (this.y < -50 || this.x < -50 || this.x > 850) {
            this.active = false;
        }
    }
    
    render(ctx) {
        if (!this.active) return;
        renderPearl(ctx, this.x, this.y, this.time, this.size);
    }
    
    // For collision detection - circular hitbox around the pearl
    getHitbox() {
        return {
            x: this.x - this.size * 0.5,
            y: this.y - this.size * 0.5,
            width: this.size,
            height: this.size
        };
    }
}
