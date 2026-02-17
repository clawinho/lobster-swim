/**
 * Ocean.v001.js - Ocean background (Level 1)
 * Extracted from app.js renderBackground
 * @version 001
 * @current false
 */

export function render(ctx, w, h, scrollX) {
    // Sandy floor
    ctx.fillStyle = '#3d2817';
    ctx.fillRect(0, 500, w, 100);
    // Seaweed
    ctx.fillStyle = '#2d5a2d';
    for (let i = 0; i < 8; i++) {
        const x = (i * 120 + scrollX * 0.2) % (w + 100) - 50;
        for (let j = 0; j < 5; j++) {
            const sway = Math.sin(Date.now() / 500 + i + j) * 10;
            ctx.beginPath();
            ctx.ellipse(x + sway, 520 - j * 30, 8, 25, 0.2 + sway * 0.02, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export const meta = { version: '001', name: 'The Ocean', current: false };
