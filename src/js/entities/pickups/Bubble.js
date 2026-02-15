/**
 * Bubble.js - Collectible bubble
 * Points collectible with magnetism effect when player is nearby
 */

const COLOR_PRESETS = {
    blue: 210,
    pink: 320,
    green: 140,
    gold: 45
};

function hslToRgba(h, s, l, a) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const f = n => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return `rgba(${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)}, ${a})`;
}

export class Bubble {
    static MAGNET_RADIUS = 80;
    static MAGNET_STRENGTH = 3;
    static color = "pink";  // Default color for game

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
        
        const t = Date.now() * 0.01 + this.phase * 100;
        const wobble = Math.sin(t * 0.08) * 2;
        const drawY = this.y + wobble;

        // Get hue from color setting
        const hue = typeof Bubble.color === "number" 
            ? Bubble.color 
            : (COLOR_PRESETS[Bubble.color] ?? 320);

        const gradient = ctx.createRadialGradient(
            this.x - this.size * 0.3, drawY - this.size * 0.3, 0,
            this.x, drawY, this.size
        );
        
        if (inRange) {
            // Brighter when in magnet range
            gradient.addColorStop(0, hslToRgba(hue, 80, 85, 0.95));
            gradient.addColorStop(0.5, hslToRgba(hue, 85, 60, 0.7));
            gradient.addColorStop(1, hslToRgba(hue, 75, 40, 0.4));
        } else {
            gradient.addColorStop(0, hslToRgba(hue, 70, 75, 0.9));
            gradient.addColorStop(0.5, hslToRgba(hue, 80, 55, 0.5));
            gradient.addColorStop(1, hslToRgba(hue, 70, 35, 0.3));
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Shine highlight
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, drawY - this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Magnet range indicator
        if (inRange) {
            ctx.strokeStyle = hslToRgba(hue, 70, 70, 0.4);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, drawY, this.size + 3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
    }

    checkCollision(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < player.size + this.size;
    }
}
