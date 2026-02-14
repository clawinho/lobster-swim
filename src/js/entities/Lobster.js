/**
 * Lobster.js - Player entity
 * The main character with animated claws, tail physics, and invincibility effects
 */

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
        if (invincible && Math.floor(invincibleTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        this.updateAngle();
        this.updateTail();

        const size = this.size;
        const x = this.x;
        const y = this.y;

        // Draw tail segments first (behind body)
        ctx.fillStyle = '#cc3300';
        
        // Segment 1 (closest to body)
        ctx.save();
        ctx.translate(this.tailSegments[0].x, this.tailSegments[0].y);
        ctx.rotate(this.tailSegments[0].angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Segment 2
        ctx.save();
        ctx.translate(this.tailSegments[1].x, this.tailSegments[1].y);
        ctx.rotate(this.tailSegments[1].angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.35, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Tail fan (segment 3)
        ctx.fillStyle = '#ff4500';
        ctx.save();
        ctx.translate(this.tailSegments[2].x, this.tailSegments[2].y);
        ctx.rotate(this.tailSegments[2].angle);
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.ellipse(-8, i * 4, 8, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Draw body
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.angle);

        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        let clawWave = Math.sin(Date.now() / 200) * 0.15;

        // Upper claw
        ctx.save();
        ctx.rotate(-0.5 + clawWave);
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.ellipse(size * 0.9, -size * 0.1, size * 0.5, size * 0.25, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cc3300';
        ctx.beginPath();
        ctx.moveTo(size * 1.3, -size * 0.2);
        ctx.lineTo(size * 1.6, -size * 0.4);
        ctx.lineTo(size * 1.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Lower claw
        ctx.save();
        ctx.rotate(0.5 - clawWave);
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.ellipse(size * 0.9, size * 0.1, size * 0.5, size * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cc3300';
        ctx.beginPath();
        ctx.moveTo(size * 1.3, size * 0.2);
        ctx.lineTo(size * 1.6, size * 0.4);
        ctx.lineTo(size * 1.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(size * 0.4, -size * 0.25, 3, 0, Math.PI * 2);
        ctx.arc(size * 0.4, size * 0.25, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(size * 0.42, -size * 0.27, 1.5, 0, Math.PI * 2);
        ctx.arc(size * 0.42, size * 0.23, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Antennae
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        let antWave = Math.sin(Date.now() / 150) * 5;
        ctx.beginPath();
        ctx.moveTo(size * 0.5, -size * 0.3);
        ctx.quadraticCurveTo(size * 0.8, -size * 0.8 + antWave, size * 1.2, -size * 0.6 + antWave);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.3);
        ctx.quadraticCurveTo(size * 0.8, size * 0.8 - antWave, size * 1.2, size * 0.6 - antWave);
        ctx.stroke();
        ctx.lineWidth = 1;

        ctx.restore();
        ctx.globalAlpha = 1;

        // Invincibility shield
        if (invincible) {
            ctx.strokeStyle = '#ffff0066';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, size + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
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
