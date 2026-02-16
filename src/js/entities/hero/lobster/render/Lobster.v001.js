/**
 * Lobster.v001.js - Basic circle prototype
 * @version 001
 */
export function render(ctx, x, y, size) {
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + size * 0.3, y - size * 0.2, 3, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y + size * 0.2, 3, 0, Math.PI * 2);
    ctx.fill();
}
export const meta = { version: '001', name: 'Basic Circle', features: ['circle body'] };
