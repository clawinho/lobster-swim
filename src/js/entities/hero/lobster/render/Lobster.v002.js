/**
 * Lobster.v002.js - Added claws
 * @version 002
 */
export function render(ctx, x, y, size) {
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - size * 0.9, y - size * 0.3, size * 0.5, size * 0.25, -0.3, 0, Math.PI * 2);
    ctx.ellipse(x - size * 0.9, y + size * 0.3, size * 0.5, size * 0.25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + size * 0.3, y - size * 0.2, 3, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y + size * 0.2, 3, 0, Math.PI * 2);
    ctx.fill();
}
export const meta = { version: '002', name: 'With Claws', features: ['ellipse body', 'claws'] };
