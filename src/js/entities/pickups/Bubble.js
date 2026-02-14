/**
 * Bubble.js - Collectible bubble
 * Points collectible with magnetism effect when player is nearby
 */

export class Bubble {
    static MAGNET_RADIUS = 80;
    static MAGNET_STRENGTH = 3;

    constructor(x, y, size = 18) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    static create(count = 8, canvasWidth = 800, canvasHeight = 600) {
        const bubbles = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (canvasWidth - 50) + 25;
            const y = Math.random() * (canvasHeight - 50) + 25;
            bubbles.push(new Bubble(x, y, 18));
        }
        return bubbles;
    }

    respawn(canvasWidth = 800, canvasHeight = 600) {
        this.x = Math.random() * (canvasWidth - 50) + 25;
        this.y = Math.random() * (canvasHeight - 50) + 25;
    }

    update(playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Magnetism effect
        if (dist < Bubble.MAGNET_RADIUS && dist > 5) {
            const pullFactor = (1 - dist / Bubble.MAGNET_RADIUS);
            this.x += (dx / dist) * Bubble.MAGNET_STRENGTH * pullFactor;
            this.y += (dy / dist) * Bubble.MAGNET_STRENGTH * pullFactor;
            return true; // Being pulled
        }
        return false;
    }

    render(ctx, playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inRange = dist < Bubble.MAGNET_RADIUS;

        ctx.fillStyle = inRange ? '#66aaff66' : '#4488ff44';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = inRange ? '#88ccff' : '#4488ff';
        ctx.stroke();
    }

    checkCollision(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < player.size + this.size;
    }
}
