/**
 * GoldenFish.v002.js - Shimmer particles + gradient (UPGRADE CANDIDATE)
 * @version 002
 */
export function render(ctx, x, y, time, size = 15, direction = 1, shimmerCount = 5) {
    const wobble = Math.sin(time * 0.1) * 5;
    ctx.save();
    ctx.translate(x + wobble, y);
    ctx.scale(direction, 1);
    
    // Shimmer particles
    ctx.fillStyle = '#ffff0044';
    for (let i = 0; i < shimmerCount; i++) {
        const px = Math.sin(time * 0.1 + i * 1.5) * 25;
        const py = Math.cos(time * 0.13 + i) * 15;
        ctx.beginPath();
        ctx.arc(px, py, 2 + Math.sin(time * 0.2 + i), 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Gradient body
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, '#ffdd00');
    gradient.addColorStop(1, '#ff8800');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Animated tail
    ctx.fillStyle = '#ffaa00';
    ctx.save();
    ctx.rotate(Math.sin(time * 0.4) * 0.3);
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(-size * 1.8, -size * 0.6);
    ctx.lineTo(-size * 1.8, size * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size * 0.5, -size * 0.1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size * 0.55, -size * 0.15, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}
export const meta = { version: '002', name: 'Shimmer', features: ['gradient', 'shimmer particles', 'tail wag', 'wobble'] };
