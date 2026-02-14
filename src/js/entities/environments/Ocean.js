/**
 * Ocean.js - Level 1 background renderer
 */

export function renderOceanPreview(ctx, w, h, time) {
    // Gradient sky to deep
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#001830');
    gradient.addColorStop(1, '#000810');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Seaweed
    ctx.strokeStyle = '#1a4a2a';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
        const x = 20 + i * 40;
        ctx.beginPath();
        ctx.moveTo(x, h);
        const wave = Math.sin(time * 0.02 + i) * 10;
        ctx.quadraticCurveTo(x + wave, h - 40, x + wave * 0.5, h - 70);
        ctx.stroke();
    }
    
    // Rising bubbles
    ctx.fillStyle = 'rgba(100,150,200,0.3)';
    for (let i = 0; i < 8; i++) {
        const bx = (i * 30 + time * 0.3) % w;
        const by = h - (time * 0.5 + i * 50) % h;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

export const metadata = {
    name: 'The Ocean',
    level: 1,
    scoreRange: '0-199',
    background: '#001020'
};
