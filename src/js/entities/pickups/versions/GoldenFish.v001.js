/**
 * GoldenFish.v001.js - Simple flat gold (CURRENT IN GAME)
 * @version 001
 * @current true
 */
export function render(ctx, x, y, size = 15, direction = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(direction, 1);
    
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size * 1.5, -size * 0.5);
    ctx.lineTo(-size * 1.5, size * 0.5);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.1, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.2, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    ctx.strokeStyle = '#ffd70066';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, size + 5, 0, Math.PI * 2);
    ctx.stroke();
}
export const meta = { version: '001', name: 'Simple Gold', current: true, features: ['flat color', 'glow ring'] };
