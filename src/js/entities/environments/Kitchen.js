/**
 * Kitchen.js - Level 3 background renderer
 */

export function renderKitchenPreview(ctx, w, h, time) {
    // Dark kitchen
    ctx.fillStyle = '#1a1510';
    ctx.fillRect(0, 0, w, h);
    
    // Counter
    ctx.fillStyle = '#333';
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
    
    // Pot
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h * 0.6, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.3 - 30, h * 0.4, 60, h * 0.2);
    
    // Steam
    ctx.strokeStyle = 'rgba(200,200,200,0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        const sx = w * 0.3 - 15 + i * 15;
        const wave = Math.sin(time * 0.05 + i) * 5;
        ctx.beginPath();
        ctx.moveTo(sx, h * 0.35);
        ctx.quadraticCurveTo(sx + wave, h * 0.25, sx, h * 0.15);
        ctx.stroke();
    }
}

export const metadata = {
    name: 'The Kitchen',
    level: 3,
    scoreRange: '500+',
    background: '#1a0a05'
};
