/**
 * OceanCurrent.js - Ocean current mechanic
 * Pushes player gently in shifting directions
 */

import { render as renderCurrent } from '../render/OceanCurrent.v001.js';

export class OceanCurrent {
    constructor(baseStrength = 0.3) {
        this.baseStrength = baseStrength;
        this.angle = Math.random() * Math.PI * 2;
        this.targetAngle = this.angle;
        this.strength = baseStrength;
        this.time = 0;
        this.changeTimer = 0;
        this.changeInterval = 300; // Frames between direction changes (~5 seconds)
    }

    update(difficultyMult = 1) {
        this.time++;
        this.changeTimer++;
        
        // Periodically shift current direction
        if (this.changeTimer >= this.changeInterval) {
            this.changeTimer = 0;
            this.targetAngle = Math.random() * Math.PI * 2;
            // Vary strength slightly
            this.strength = this.baseStrength * (0.8 + Math.random() * 0.4);
        }
        
        // Smoothly rotate toward target angle
        const angleDiff = this.targetAngle - this.angle;
        // Handle wraparound
        let shortestDiff = ((angleDiff + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        this.angle += shortestDiff * 0.02;
        
        // Apply difficulty scaling
        return {
            dx: Math.cos(this.angle) * this.strength * difficultyMult,
            dy: Math.sin(this.angle) * this.strength * difficultyMult
        };
    }

    applyToPlayer(player, difficultyMult = 1, canvasWidth = 800, canvasHeight = 600) {
        const force = this.update(difficultyMult);
        player.x += force.dx;
        player.y += force.dy;
        
        // Keep player in bounds
        player.x = Math.max(player.size, Math.min(canvasWidth - player.size, player.x));
        player.y = Math.max(player.size, Math.min(canvasHeight - player.size, player.y));
        
        return force;
    }

    render(ctx, width, height) {
        renderCurrent(ctx, width, height, this.time, this.strength, this.angle);
    }

    // Get current info for UI/debug
    getInfo() {
        return {
            angle: this.angle,
            angleDeg: (this.angle * 180 / Math.PI) % 360,
            strength: this.strength,
            direction: this.getDirectionName()
        };
    }

    getDirectionName() {
        const deg = ((this.angle * 180 / Math.PI) % 360 + 360) % 360;
        if (deg < 22.5 || deg >= 337.5) return 'East';
        if (deg < 67.5) return 'Southeast';
        if (deg < 112.5) return 'South';
        if (deg < 157.5) return 'Southwest';
        if (deg < 202.5) return 'West';
        if (deg < 247.5) return 'Northwest';
        if (deg < 292.5) return 'North';
        return 'Northeast';
    }
}

export default OceanCurrent;
