/**
 * Jellyfish.v001.js - Translucent pulsating jellyfish
 * @version 001
 * @current true
 * 
 * A glowing, translucent jellyfish with pulsating bell and trailing tentacles.
 * Uses sine waves for organic movement and glow effects.
 */

export function render(ctx, x, y, size = 30, pulsePhase = 0, color = '#cc44ff') {
    const pulse = Math.sin(pulsePhase) * 0.15 + 1; // 0.85 to 1.15
    const bellWidth = size * pulse;
    const bellHeight = size * 0.7 * (2 - pulse); // Inverse pulse for squish
    
    ctx.save();
    ctx.translate(x, y);
    
    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 15 + Math.sin(pulsePhase * 2) * 5;
    
    // Bell (dome shape)
    ctx.beginPath();
    ctx.ellipse(0, 0, bellWidth, bellHeight, 0, Math.PI, 0);
    
    // Scalloped bottom edge of bell
    const scallops = 8;
    for (let i = 0; i <= scallops; i++) {
        const t = i / scallops;
        const sx = -bellWidth + t * bellWidth * 2;
        const sy = Math.sin(t * Math.PI * scallops) * 4 * pulse;
        if (i === 0) ctx.lineTo(sx, sy);
        else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    
    // Translucent fill
    const grad = ctx.createRadialGradient(0, -bellHeight * 0.3, 0, 0, 0, bellWidth);
    grad.addColorStop(0, color + 'aa');
    grad.addColorStop(0.6, color + '66');
    grad.addColorStop(1, color + '22');
    ctx.fillStyle = grad;
    ctx.fill();
    
    // Inner glow
    ctx.beginPath();
    ctx.ellipse(0, -bellHeight * 0.2, bellWidth * 0.4, bellHeight * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff44';
    ctx.fill();
    
    // Tentacles
    ctx.shadowBlur = 8;
    const tentacleCount = 5;
    for (let i = 0; i < tentacleCount; i++) {
        const tx = -bellWidth * 0.6 + (i / (tentacleCount - 1)) * bellWidth * 1.2;
        const tentLen = size * (0.8 + Math.random() * 0.1);
        
        ctx.beginPath();
        ctx.moveTo(tx, 2);
        
        // Wavy tentacle using quadratic curves
        const segments = 3;
        for (let s = 1; s <= segments; s++) {
            const sy = (s / segments) * tentLen;
            const wave = Math.sin(pulsePhase + i * 0.8 + s * 1.5) * (8 + s * 3);
            ctx.quadraticCurveTo(tx + wave, sy - tentLen / segments * 0.5, tx + wave * 0.5, sy);
        }
        
        ctx.strokeStyle = color + '88';
        ctx.lineWidth = 1.5 - (i % 2) * 0.5;
        ctx.stroke();
    }
    
    // Small dots on tentacles (stinging cells)
    for (let i = 0; i < 6; i++) {
        const dx = (Math.random() - 0.5) * bellWidth;
        const dy = 5 + Math.random() * size * 0.6;
        ctx.beginPath();
        ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff88';
        ctx.fill();
    }
    
    ctx.restore();
}

export const meta = {
    version: "001",
    name: "Jellyfish",
    current: true,
    features: ["translucent bell", "pulsating animation", "wavy tentacles", "glow effect"]
};
