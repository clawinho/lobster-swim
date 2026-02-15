/**
 * Bubble.js - Collectible bubble (game class)
 * Points collectible with magnetism effect when player is nearby
 * Rendering delegated to versioned renderer (DRY)
 */
import { render as renderBubble } from "./versions/Bubble.v002.js";

export class Bubble {
    static MAGNET_RADIUS = 80;
    static MAGNET_STRENGTH = 3;
    static color = "pink";  // Game default color

    constructor(x, y, size = 18) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.phase = Math.random() * Math.PI * 2;
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
        this.phase = Math.random() * Math.PI * 2;
    }

    update(playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < Bubble.MAGNET_RADIUS && dist > 5) {
            const pullFactor = (1 - dist / Bubble.MAGNET_RADIUS);
            this.x += (dx / dist) * Bubble.MAGNET_STRENGTH * pullFactor;
            this.y += (dy / dist) * Bubble.MAGNET_STRENGTH * pullFactor;
            return true;
        }
        return false;
    }

    render(ctx, playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inRange = dist < Bubble.MAGNET_RADIUS;
        
        // Use time based on instance phase for varied animation
        const time = Date.now() * 0.01 + this.phase * 100;
        
        // Delegate to versioned renderer
        renderBubble(ctx, this.x, this.y, this.size, time, Bubble.color, inRange);
    }

    checkCollision(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < player.size + this.size;
    }
}
