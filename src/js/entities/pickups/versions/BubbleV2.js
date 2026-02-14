/**
 * BubbleV2.js - Magnetic bubble with wobble and gradient
 * Version: 2.0.0 (current)
 * Added: Gradient, wobble animation, highlight
 */

export function renderBubbleV2(ctx, x, y, size, time) {
    const wobble = Math.sin(time * 0.1) * 2;
    const wobbleY = y + wobble;
    
    // Gradient body
    const gradient = ctx.createRadialGradient(
        x - size * 0.3, wobbleY - size * 0.3, 0,
        x, wobbleY, size
    );
    gradient.addColorStop(0, 'rgba(200, 230, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(100, 180, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(50, 100, 200, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, wobbleY, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(x - size * 0.3, wobbleY - size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
}

export const metadata = {
    version: '2.0.0',
    name: 'Magnetic + Wobble',
    description: 'Gradient bubble with wobble and highlight',
    features: ['gradient', 'wobble animation', 'highlight', 'magnetism'],
    current: true
};
