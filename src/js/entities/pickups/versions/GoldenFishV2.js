/**
 * GoldenFishV2.js - Shimmering golden fish with particles
 * Version: 2.0.0 (current in assets.html)
 * Added: Gradient body, shimmer particles, tail wag
 */

export function renderGoldenFishV2(ctx, x, y, time, direction = 1, shimmerCount = 5) {
    const wobble = Math.sin(time * 0.1) * 5;
    
    ctx.save();
    ctx.translate(x + wobble, y);
    ctx.scale(direction, 1);
    
    // Shimmer particles
    ctx.fillStyle = '#ffff0044';
    for (let i = 0; i < shimmerCount; i++) {
        const px = Math.sin(time * 0.1 + i * 1.5) * 25;
        const py = Math.cos(time * 0.13 + i) * 15;
        const ps = 2 + Math.sin(time * 0.2 + i) * 1;
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Gradient body
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
    gradient.addColorStop(0, '#ffdd00');
    gradient.addColorStop(1, '#ff8800');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Animated tail
    ctx.fillStyle = '#ffaa00';
    const tailWag = Math.sin(time * 0.4) * 0.3;
    ctx.save();
    ctx.rotate(tailWag);
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-35, -12);
    ctx.lineTo(-35, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(10, -2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye highlight
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(11, -3, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

export const metadata = {
    version: '2.0.0',
    name: 'Shimmer Particles',
    description: 'Golden gradient with shimmer particles and tail wag',
    features: ['gradient body', 'shimmer particles', 'animated tail', 'eye highlight'],
    current: true
};
