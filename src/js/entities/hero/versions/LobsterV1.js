/**
 * LobsterV1.js - Basic circle lobster (original prototype)
 * Version: 1.0.0
 * Date: 2024-01-xx (original)
 */

export function renderLobsterV1(ctx, x, y, size) {
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Simple eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + size * 0.3, y - size * 0.2, 3, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y + size * 0.2, 3, 0, Math.PI * 2);
    ctx.fill();
}

export const metadata = {
    version: '1.0.0',
    name: 'Basic Circle',
    description: 'Original prototype - simple circle with eyes',
    features: ['circle body', 'basic eyes']
};
