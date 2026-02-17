/**
 * Starfish.v001.js - Spinning starfish with warm glow
 * @version 001
 * @current true
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} time - Animation frame
 * @param {number} size - Radius
 */
export function render(ctx, x, y, time, size = 20) {
    ctx.save();
    ctx.translate(x, y);
    
    // Slow rotation
    const rotation = time * 0.02;
    ctx.rotate(rotation);
    
    // Pulsing glow
    const pulse = 0.7 + Math.sin(time * 0.08) * 0.3;
    const glowSize = size * 1.5 * pulse;
    
    // Outer glow
    const glow = ctx.createRadialGradient(0, 0, size * 0.3, 0, 0, glowSize);
    glow.addColorStop(0, 'rgba(255, 200, 50, 0.4)');
    glow.addColorStop(0.6, 'rgba(255, 150, 30, 0.15)');
    glow.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw 5-pointed star
    const arms = 5;
    const outerR = size;
    const innerR = size * 0.45;
    
    // Body gradient
    const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR);
    bodyGrad.addColorStop(0, '#ffcc44');
    bodyGrad.addColorStop(0.5, '#ff8833');
    bodyGrad.addColorStop(1, '#dd5522');
    
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    for (let i = 0; i < arms * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / arms - Math.PI / 2;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    
    // Subtle outline
    ctx.strokeStyle = 'rgba(180, 80, 20, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Center dot (eye-like)
    ctx.fillStyle = 'rgba(255, 240, 200, 0.9)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    // Small dots on each arm tip
    for (let i = 0; i < arms; i++) {
        const angle = (i * 2 * Math.PI) / arms - Math.PI / 2;
        const dx = Math.cos(angle) * outerR * 0.65;
        const dy = Math.sin(angle) * outerR * 0.65;
        ctx.fillStyle = 'rgba(255, 220, 150, 0.7)';
        ctx.beginPath();
        ctx.arc(dx, dy, size * 0.08, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

export const meta = {
    version: "001",
    name: "Golden Starfish",
    current: true,
    features: ["rotation", "pulse glow", "gradient body", "arm dots"]
};
