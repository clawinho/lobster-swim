/**
 * Cage.v001.js - Purple void zone (original placeholder)
 * @version 001
 */
export function render(ctx, x, y, size) {
    ctx.fillStyle = '#440066';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#8800ff'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.stroke();
}
export const meta = { version: '001', name: 'Purple Void', features: ['abstract circle'] };
