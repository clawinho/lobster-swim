/**
 * BubbleV1.js - Static bubble
 * Version: 1.0.0
 */

export function renderBubbleV1(ctx, x, y, size) {
    ctx.fillStyle = 'rgba(100, 180, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(150, 200, 255, 0.8)';
    ctx.stroke();
}

export const metadata = {
    version: '1.0.0',
    name: 'Static Orbs',
    description: 'Simple transparent bubbles',
    features: ['flat color', 'outline']
};
