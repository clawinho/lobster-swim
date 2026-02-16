/**
 * Hook.v001.js - Static drop
 * @version 001
 */
export function render(ctx, x, lineLen) {
    ctx.strokeStyle = '#666'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, lineLen - 15);
    ctx.stroke();
    ctx.strokeStyle = '#ccc'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, lineLen - 15);
    ctx.lineTo(x, lineLen);
    ctx.arc(x - 8, lineLen, 8, 0, Math.PI, false);
    ctx.stroke();
}
export const meta = { version: '001', name: 'Static Drop', features: ['vertical line'] };
