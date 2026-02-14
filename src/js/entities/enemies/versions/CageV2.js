/**
 * CageV2.js - Wooden lobster trap
 * Version: 2.0.0 (current)
 * Added: Wooden frame, bars, funnel entrance
 */

export function renderCageV2(ctx, x, y, size) {
    ctx.strokeStyle = '#664422';
    ctx.lineWidth = 3;
    
    // Main frame
    ctx.strokeRect(x - size/2, y - size/2, size, size * 0.8);
    
    // Vertical bars
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
        const bx = x - size/2 + (size * i / 4);
        ctx.beginPath();
        ctx.moveTo(bx, y - size/2);
        ctx.lineTo(bx, y + size * 0.3);
        ctx.stroke();
    }
    
    // Funnel entrance
    ctx.beginPath();
    ctx.moveTo(x - size * 0.3, y - size/2);
    ctx.lineTo(x, y - size * 0.2);
    ctx.lineTo(x + size * 0.3, y - size/2);
    ctx.stroke();
}

export const metadata = {
    version: '2.0.0',
    name: 'Wooden Trap',
    description: 'Thematic lobster trap with funnel entrance',
    features: ['wooden frame', 'vertical bars', 'funnel entrance'],
    current: true
};
