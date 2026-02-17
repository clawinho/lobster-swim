/**
 * Eel.js - Electric eel enemy
 * Render: v001 (segmented with electric sparks)
 * 
 * Design: Fast, sinuous predator that swims horizontally across screen
 * - Enters from one side, exits the other
 * - Sine-wave vertical movement makes it hard to dodge
 * - Lethal on contact (costs a life)
 * - Spawns occasionally based on difficulty tier
 * - Telegraphed with a brief warning flash on the side it's coming from
 */

import { render as renderEel } from '../render/Eel.v001.js';

const BASE_SPEED = 3;
const BODY_SIZE = 8;
const WARNING_DURATION = 45; // 0.75s warning flash before appearing

export class Eel {
    constructor(canvasWidth, canvasHeight, fromRight = Math.random() > 0.5) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.size = BODY_SIZE;
        
        this.direction = fromRight ? -1 : 1;
        this.x = fromRight ? canvasWidth + 60 : -60;
        this.y = 80 + Math.random() * (canvasHeight - 160);
        this.baseY = this.y;
        
        this.speed = BASE_SPEED + Math.random() * 1.5;
        this.waveAmp = 12 + Math.random() * 15;
        this.waveFreq = 0.012 + Math.random() * 0.008;
        
        this.phase = Math.random() * Math.PI * 2;
        this.sparkPhase = Math.random() * Math.PI * 2;
        
        // Warning state
        this.warning = true;
        this.warningTimer = WARNING_DURATION;
        
        this.alive = true;
    }

    /**
     * Spawn eels for the current state
     */
    static create(count, canvasWidth, canvasHeight) {
        const eels = [];
        for (let i = 0; i < count; i++) {
            eels.push(new Eel(canvasWidth, canvasHeight));
        }
        return eels;
    }

    update(difficultyMult = 1) {
        this.sparkPhase += 0.08;
        
        if (this.warning) {
            this.warningTimer--;
            if (this.warningTimer <= 0) {
                this.warning = false;
            }
            return; // Don't move during warning
        }
        
        this.phase += this.waveFreq * this.speed * difficultyMult;
        this.x += this.direction * this.speed * difficultyMult;
        this.y = this.baseY + Math.sin(this.phase) * this.waveAmp;
        
        // Off-screen? Dead.
        if (this.direction > 0 && this.x > this.canvasWidth + 100) this.alive = false;
        if (this.direction < 0 && this.x < -100) this.alive = false;
    }

    render(ctx) {
        if (this.warning) {
            // Draw warning indicator on the edge it's coming from
            const wx = this.direction > 0 ? 10 : this.canvasWidth - 10;
            const alpha = 0.3 + 0.7 * Math.abs(Math.sin(this.warningTimer * 0.15));
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#44eeff';
            // Arrow/triangle pointing inward
            ctx.beginPath();
            if (this.direction > 0) {
                ctx.moveTo(wx, this.baseY - 15);
                ctx.lineTo(wx + 15, this.baseY);
                ctx.lineTo(wx, this.baseY + 15);
            } else {
                ctx.moveTo(wx, this.baseY - 15);
                ctx.lineTo(wx - 15, this.baseY);
                ctx.lineTo(wx, this.baseY + 15);
            }
            ctx.closePath();
            ctx.fill();
            // Glow
            ctx.shadowColor = '#44eeff';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.restore();
            return;
        }
        
        renderEel(ctx, this.x, this.y, this.size, this.phase, this.direction, this.sparkPhase);
    }

    /**
     * Check collision - returns true if hit
     */
    checkCollision(player, invincible = false) {
        if (invincible || this.warning || !this.alive) return false;
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Generous hitbox (head area)
        if (dist < this.size * 2.5 + player.size * 0.8) {
            return true;
        }
        return false;
    }
}
