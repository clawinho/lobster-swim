/**
 * HookV1.js - Static dropping hook
 * Version: 1.0.0
 */

export function renderHookV1(ctx, x, lineLen) {
    // Fishing line
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, lineLen - 15);
    ctx.stroke();
    
    // Hook
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, lineLen - 15);
    ctx.lineTo(x, lineLen);
    ctx.arc(x - 8, lineLen, 8, 0, Math.PI, false);
    ctx.stroke();
}

export const metadata = {
    version: '1.0.0',
    name: 'Static Drop',
    description: 'Simple hook that drops straight down',
    features: ['vertical line', 'basic hook shape']
};
