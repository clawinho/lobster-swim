/**
 * Bubble.v001.js - Simple flat bubble (CURRENT IN GAME)
 * @version 001
 * @current true
 */
export function render(ctx, x, y, size, inRange = false) {
    ctx.fillStyle = inRange ? '#66aaff66' : '#4488ff44';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = inRange ? '#88ccff' : '#4488ff';
    ctx.stroke();
}
export const meta = { version: '001', name: 'Simple', current: true, features: ['flat color', 'magnet highlight'] };
