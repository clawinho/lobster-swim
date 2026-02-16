/**
 * Lobster.v004.js - Animated with sine-wave tail
 * @version 004
 * @current false
 *
 * Animation states:
 * - "normal": default swimming animation
 * - "invincible": golden shimmer with flicker
 * - "death": spinning with red glow and fade
 */
export function render(ctx, x, y, size, time, tailWag = 8, animState = "normal") {
    ctx.save();
    
    // Apply animation state effects BEFORE drawing
    let extraRotation = 0;
    if (animState === "invincible") {
        // Flicker effect
        if (Math.floor(time / 5) % 2 === 0) {
            ctx.globalAlpha = 0.6;
        }
        // Golden glow
        ctx.shadowColor = "#ffdd00";
        ctx.shadowBlur = 20;
    } else if (animState === "death") {
        // Spin
        extraRotation = time * 0.15;
        // Pulsing fade
        ctx.globalAlpha = 0.4 + Math.sin(time * 0.1) * 0.3;
        // Red glow
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 15;
    }
    
    const tailAngle = Math.sin(time * 0.05 * tailWag / 8) * 0.3;
    ctx.translate(x, y);
    ctx.rotate(extraRotation);
    
    // Tail segments
    ctx.fillStyle = "#cc3300";
    for (let i = 0; i < 3; i++) {
        const segX = -size * (0.6 + i * 0.4);
        const segY = Math.sin(time * 0.05 + i * 0.5) * tailWag;
        const segSize = size * (0.5 - i * 0.12);
        ctx.beginPath();
        ctx.ellipse(segX, segY, segSize, segSize * 0.7, tailAngle * (i + 1), 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Tail fan
    ctx.fillStyle = "#ff4500";
    const fanX = -size * 1.8, fanY = Math.sin(time * 0.05 + 1.5) * tailWag;
    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(fanX, fanY + i * 4, 8, 3, tailAngle * 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Claws
    const clawAngle = Math.sin(time * 0.1) * 0.15;
    ctx.save(); ctx.rotate(-0.5 + clawAngle);
    ctx.beginPath();
    ctx.ellipse(size * 0.9, -size * 0.1, size * 0.5, size * 0.25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#cc3300";
    ctx.beginPath();
    ctx.moveTo(size * 1.3, -size * 0.2);
    ctx.lineTo(size * 1.6, -size * 0.4);
    ctx.lineTo(size * 1.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    ctx.save(); ctx.rotate(0.5 - clawAngle);
    ctx.fillStyle = "#ff4500";
    ctx.beginPath();
    ctx.ellipse(size * 0.9, size * 0.1, size * 0.5, size * 0.25, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#cc3300";
    ctx.beginPath();
    ctx.moveTo(size * 1.3, size * 0.2);
    ctx.lineTo(size * 1.6, size * 0.4);
    ctx.lineTo(size * 1.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Antennae
    ctx.strokeStyle = "#ff6600"; ctx.lineWidth = 2;
    const antWave = Math.sin(time * 0.15) * 5;
    ctx.beginPath();
    ctx.moveTo(size * 0.5, -size * 0.3);
    ctx.quadraticCurveTo(size * 0.8, -size * 0.8 + antWave, size * 1.2, -size * 0.6 + antWave);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.5, size * 0.3);
    ctx.quadraticCurveTo(size * 0.8, size * 0.8 - antWave, size * 1.2, size * 0.6 - antWave);
    ctx.stroke();
    
    // Eyes
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(size * 0.3, -size * 0.2, 4, 0, Math.PI * 2);
    ctx.arc(size * 0.3, size * 0.2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(size * 0.32, -size * 0.22, 1.5, 0, Math.PI * 2);
    ctx.arc(size * 0.32, size * 0.18, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

export const meta = {
    version: "004",
    name: "Animated (Sine Tail)",
    current: false,
    features: ["tail physics", "animated claws", "antennae", "animation states"]
};
