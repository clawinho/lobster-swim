/**
 * LobsterV2.js - Lobster with claws
 * Version: 2.0.0
 * Added: Ellipse body, animated claws
 */

export function renderLobsterV2(ctx, x, y, size) {
    ctx.fillStyle = '#ff4500';
    
    // Ellipse body
    ctx.beginPath();
    ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Claws
    ctx.beginPath();
    ctx.ellipse(x - size * 0.9, y - size * 0.3, size * 0.5, size * 0.25, -0.3, 0, Math.PI * 2);
    ctx.ellipse(x - size * 0.9, y + size * 0.3, size * 0.5, size * 0.25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + size * 0.3, y - size * 0.2, 3, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y + size * 0.2, 3, 0, Math.PI * 2);
    ctx.fill();
}

export const metadata = {
    version: '2.0.0',
    name: 'With Claws',
    description: 'Added ellipse body and static claws',
    features: ['ellipse body', 'claws', 'basic eyes']
};
