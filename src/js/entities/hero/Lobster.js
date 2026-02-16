/**
 * Lobster.js - Player entity
 * The main character with animated claws, tail physics, and invincibility effects
 */

import { render as renderLobster } from './versions/Lobster.v004.js';

export class Lobster {
    static TAIL_SEGMENTS = 3;
    static TAIL_FOLLOW_SPEED = 0.15;

    constructor(x = 400, y = 300, size = 30, speed = 5) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.targetX = x;
        this.targetY = y;
        this.angle = 0;
        this.prevX = x;
        this.prevY = y;
        
        // Initialize tail segments
        this.tailSegments = [];
        for (let i = 0; i < Lobster.TAIL_SEGMENTS; i++) {
            this.tailSegments.push({ x: x, y: y, angle: 0 });
        }
    }

    reset(x = 400, y = 300) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.angle = 0;
        this.prevX = x;
        this.prevY = y;
        this.tailSegments.forEach(seg => {
            seg.x = x;
            seg.y = y;
            seg.angle = 0;
        });
    }

    update(keys, joystick, hasTarget) {
        // Keyboard movement
        if (keys['ArrowUp'] || keys['w'] || keys['W']) this.y -= this.speed;
        if (keys['ArrowDown'] || keys['s'] || keys['S']) this.y += this.speed;
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) this.x -= this.speed;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) this.x += this.speed;

        // Joystick movement
        if (joystick && (joystick.dx !== 0 || joystick.dy !== 0)) {
            this.x += joystick.dx * this.speed;
            this.y += joystick.dy * this.speed;
        }

        // Touch/click target movement
        if (hasTarget) {
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 10) {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
                return true; // Still moving to target
            }
            return false; // Reached target
        }
        return false;
    }

    clamp(canvasWidth, canvasHeight) {
        this.x = Math.max(this.size, Math.min(canvasWidth - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvasHeight - this.size, this.y));
    }

    updateAngle() {
        let dx = this.x - this.prevX;
        let dy = this.y - this.prevY;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            let targetAngle = Math.atan2(dy, dx);
            let diff = targetAngle - this.angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            this.angle += diff * 0.1;
        }
        this.prevX = this.x;
        this.prevY = this.y;
    }

    updateTail() {
        let leader = { x: this.x, y: this.y, angle: this.angle };
        for (let i = 0; i < this.tailSegments.length; i++) {
            let seg = this.tailSegments[i];
            let targetX = leader.x - Math.cos(leader.angle) * (this.size * 0.5);
            let targetY = leader.y - Math.sin(leader.angle) * (this.size * 0.5);
            
            seg.x += (targetX - seg.x) * Lobster.TAIL_FOLLOW_SPEED;
            seg.y += (targetY - seg.y) * Lobster.TAIL_FOLLOW_SPEED;
            
            let segDx = leader.x - seg.x;
            let segDy = leader.y - seg.y;
            if (Math.abs(segDx) > 0.1 || Math.abs(segDy) > 0.1) {
                let targetAngle = Math.atan2(segDy, segDx);
                let diff = targetAngle - seg.angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                seg.angle += diff * 0.2;
            }
            leader = seg;
        }
    }

    render(ctx, invincible = false, invincibleTimer = 0) {
        this.updateAngle();
        this.updateTail();
        renderLobster(ctx, this.x, this.y, this.size, this.angle, this.tailSegments, invincible, invincibleTimer);
    }

    getBounds() {
        return {
            x: this.x - this.size,
            y: this.y - this.size,
            width: this.size * 2,
            height: this.size * 2,
            centerX: this.x,
            centerY: this.y,
            radius: this.size
        };
    }
}
