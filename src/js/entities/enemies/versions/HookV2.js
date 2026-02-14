/**
 * HookV2.js - Swinging pendulum hook
 * Version: 2.0.0 (current)
 * Added: Pendulum swing motion, bait detail
 */

export function renderHookV2(ctx, x, lineLen, time, swingAmount = 10) {
    const swingAngle = Math.sin(time * 0.03 * swingAmount / 10) * 0.4;
    const hookX = x + Math.sin(swingAngle) * 40;
    const hookY = lineLen;
    
    // Fishing line (curved)
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(hookX, hookY - 15);
    ctx.stroke();
    
    // Hook
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hookX, hookY - 15);
    ctx.lineTo(hookX, hookY);
    ctx.arc(hookX - 8, hookY, 8, 0, Math.PI, false);
    ctx.stroke();
    
    // Bait (worm/shrimp shape)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(hookX - 16, hookY);
    ctx.lineTo(hookX - 22, hookY - 6);
    ctx.lineTo(hookX - 14, hookY - 2);
    ctx.fill();
}

export const metadata = {
    version: '2.0.0',
    name: 'Pendulum Swing',
    description: 'Hook swings like a pendulum with bait',
    features: ['pendulum motion', 'curved line', 'bait detail'],
    current: true
};
