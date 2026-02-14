/**
 * Tank.js - Level 2 background renderer (Seafood Tank)
 */

export function renderTankPreview(ctx, w, h) {
    // Tank water
    ctx.fillStyle = '#002838';
    ctx.fillRect(0, 0, w, h);
    
    // Glass edge reflection
    ctx.strokeStyle = 'rgba(100,200,255,0.2)';
    ctx.lineWidth = 4;
    ctx.strokeRect(5, 5, w - 10, h - 10);
    
    // Gravel floor
    ctx.fillStyle = '#334';
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(10 + i * 10, h - 10, 5 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Plastic plant
    ctx.fillStyle = '#00aa44';
    ctx.beginPath();
    ctx.moveTo(w - 30, h);
    ctx.lineTo(w - 40, h - 50);
    ctx.lineTo(w - 20, h - 50);
    ctx.closePath();
    ctx.fill();
}

export const metadata = {
    name: 'Seafood Tank',
    level: 2,
    scoreRange: '200-499',
    background: '#002030'
};
