/**
 * CageV1.js - Original void zone (purple circle)
 * Version: 1.0.0
 */

export function renderCageV1(ctx, x, y, size) {
    ctx.fillStyle = '#440066';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    ctx.strokeStyle = '#8800ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.stroke();
}

export const metadata = {
    version: '1.0.0',
    name: 'Purple Void',
    description: 'Abstract danger zone (original placeholder)',
    features: ['circle shape', 'purple glow']
};
