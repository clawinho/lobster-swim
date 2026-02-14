/**
 * Cage.v002.js - Wooden trap with bars (CURRENT IN GAME)
 * @version 002
 * @current true
 */
export function render(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    const w = size * 1.8, h = size * 1.2;
    
    ctx.fillStyle = '#1a0a0066';
    ctx.fillRect(-w/2, -h/2, w, h);
    
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 3;
    ctx.strokeRect(-w/2, -h/2, w, h);
    
    ctx.lineWidth = 2; ctx.strokeStyle = '#666';
    for (let i = -w/2 + w/5; i < w/2; i += w/5) {
        ctx.beginPath();
        ctx.moveTo(i, -h/2);
        ctx.lineTo(i, h/2);
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(w/2, 0);
    ctx.stroke();
    
    ctx.strokeStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(w/2, -h/3);
    ctx.lineTo(w/4, 0);
    ctx.lineTo(w/2, h/3);
    ctx.stroke();
    
    ctx.restore();
}
export const meta = { version: '002', name: 'Wooden Trap', current: true, features: ['frame', 'bars', 'entrance'] };
