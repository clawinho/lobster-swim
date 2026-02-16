/**
 * Tank.v001.js - Seafood Tank background (Level 2)
 * Extracted from app.js renderBackground
 * @version 001
 * @current true
 */

export function render(ctx, w, h) {
    // Grey floor
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 520, w, 80);
    // Castle decoration
    ctx.fillStyle = '#666';
    ctx.fillRect(30, 450, 60, 70);
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(30, 450);
    ctx.lineTo(60, 420);
    ctx.lineTo(90, 450);
    ctx.fill();
}

export const meta = { version: '001', name: 'Seafood Tank', current: true };
