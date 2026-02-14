/**
 * Bubble.v002.js - Gradient + wobble + shine (UPGRADE CANDIDATE)
 * @version 002
 */
export function render(ctx, x, y, size, time) {
    const wobble = Math.sin(time * 0.1) * 2;
    const wobbleY = y + wobble;
    
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
    
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(x - size * 0.3, wobbleY - size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
}
export const meta = { version: '002', name: 'Gradient Wobble', features: ['gradient', 'wobble', 'shine highlight'] };
