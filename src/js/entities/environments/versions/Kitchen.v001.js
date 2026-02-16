/**
 * Kitchen.v001.js - Kitchen background (Level 3)
 * Extracted from app.js renderBackground
 * @version 001
 * @current true
 */

export function render(ctx, w, h) {
    // Wooden counter
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 500, w, 100);
    // Tile grid
    ctx.strokeStyle = '#ffffff22';
    for (let x = 0; x < w; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 500);
        ctx.stroke();
    }
    for (let y = 0; y < 500; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}

export const meta = { version: '001', name: 'The Kitchen', current: true };
