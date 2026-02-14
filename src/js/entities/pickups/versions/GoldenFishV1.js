/**
 * GoldenFishV1.js - Basic yellow fish
 * Version: 1.0.0
 */

export function renderGoldenFishV1(ctx, x, y, direction = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(direction, 1);
    
    // Body
    ctx.fillStyle = '#ffdd00';
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Tail
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-35, -12);
    ctx.lineTo(-35, 12);
    ctx.closePath();
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(10, -2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

export const metadata = {
    version: '1.0.0',
    name: 'Basic Yellow',
    description: 'Simple yellow fish without effects',
    features: ['static body', 'basic tail']
};
