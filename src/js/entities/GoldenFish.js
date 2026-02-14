/**
 * GoldenFish.js - Extra life pickup
 * Rare fish that grants an extra life, but runs away from the player
 */

export class GoldenFish {
    static SPAWN_INTERVAL = 300;
    static SPAWN_CHANCE = 0.02;

    constructor(canvasWidth = 800) {
        this.size = 15;
        this.speed = 3;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.x = this.direction > 0 ? -30 : canvasWidth + 30;
        this.y = Math.random() * 400 + 100;
        this.wobble = 0;
    }

    update(playerX, playerY, canvasWidth = 800) {
        const dx = this.x - playerX;
        const dy = this.y - playerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Flee from player when close
        if (dist < 150) {
            this.x += (dx / dist) * this.speed * 1.5;
            this.y += (dy / dist) * this.speed * 0.8;
            this.direction = dx > 0 ? 1 : -1;
        } else {
            // Normal swimming
            this.wobble += 0.1;
            this.x += this.direction * this.speed * 0.5;
            this.y += Math.sin(this.wobble) * 1.5;
        }

        // Clamp Y position
        if (this.y < 50) this.y = 50;
        if (this.y > 550) this.y = 550;

        // Return true if off screen (should be removed)
        return this.x < -50 || this.x > canvasWidth + 50;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.direction, 1);

        // Body
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(-this.size * 1.5, -this.size * 0.5);
        ctx.lineTo(-this.size * 1.5, this.size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.size * 0.4, -this.size * 0.1, 2, 0, Math.PI * 2);
        ctx.fill();

        // Shine
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.size * 0.2, -this.size * 0.2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.restore();
        ctx.strokeStyle = '#ffd70066';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    checkCollision(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < player.size + this.size;
    }
}
