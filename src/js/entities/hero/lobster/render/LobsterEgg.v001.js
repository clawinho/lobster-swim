/**
 * LobsterEgg.v001.js - Lobster egg renderer for Birth level
 * Translucent egg with visible embryo, pulsing with life.
 * Growth stages: tiny dark dot → curled embryo → recognizable baby lobster.
 * @version 001
 * @current true
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - center x
 * @param {number} y - center y
 * @param {number} size - egg radius
 * @param {number} frame - animation frame
 * @param {number} growthProgress - 0 to 1 (embryonic development)
 */
export function render(ctx, x, y, size, frame = 0, growthProgress = 0) {
    ctx.save();
    ctx.translate(x, y);

    const pulse = Math.sin(frame * 0.06) * 0.08 + 1;
    const r = size * pulse;

    // Outer glow — increases with growth
    const glowAlpha = 0.1 + growthProgress * 0.2;
    const glowGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.5);
    glowGrad.addColorStop(0, `rgba(180, 220, 255, ${glowAlpha})`);
    glowGrad.addColorStop(1, 'rgba(180, 220, 255, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(-r * 3, -r * 3, r * 6, r * 6);

    // Egg shell — translucent sphere
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    const shellGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
    shellGrad.addColorStop(0, 'rgba(160, 200, 230, 0.35)');
    shellGrad.addColorStop(0.7, 'rgba(100, 140, 180, 0.25)');
    shellGrad.addColorStop(1, 'rgba(60, 90, 130, 0.3)');
    ctx.fillStyle = shellGrad;
    ctx.fill();

    // Shell outline
    ctx.strokeStyle = 'rgba(120, 160, 200, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Embryo inside — grows with progress
    if (growthProgress < 0.3) {
        // Stage 1: dark dot with yolk
        const dotSize = r * 0.2 + growthProgress * r * 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 80, 60, ${0.4 + growthProgress})`;
        ctx.fill();
        // Yolk
        ctx.beginPath();
        ctx.arc(dotSize * 0.3, dotSize * 0.2, dotSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 160, 80, 0.3)';
        ctx.fill();
    } else if (growthProgress < 0.7) {
        // Stage 2: curled embryo shape
        const embryoSize = r * (0.3 + (growthProgress - 0.3) * 0.7);
        ctx.save();
        ctx.rotate(Math.sin(frame * 0.02) * 0.05); // gentle sway
        // Curved body
        ctx.beginPath();
        ctx.arc(0, 0, embryoSize, -Math.PI * 0.8, Math.PI * 0.6);
        ctx.strokeStyle = `rgba(200, 80, 50, ${0.5 + growthProgress * 0.3})`;
        ctx.lineWidth = embryoSize * 0.35;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Eye dot
        const eyeAngle = -Math.PI * 0.6;
        const eyeX = Math.cos(eyeAngle) * embryoSize * 0.7;
        const eyeY = Math.sin(eyeAngle) * embryoSize * 0.7;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, embryoSize * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20, 20, 20, 0.7)';
        ctx.fill();
        ctx.restore();
    } else {
        // Stage 3: recognizable baby lobster curled in egg
        const babySize = r * 0.65;
        ctx.save();
        const sway = Math.sin(frame * 0.03) * 0.08;
        ctx.rotate(sway);
        // Body segments
        const bodyColor = `rgba(200, 70, 40, ${0.6 + growthProgress * 0.3})`;
        // Head/carapace
        ctx.beginPath();
        ctx.ellipse(-babySize * 0.15, -babySize * 0.2, babySize * 0.35, babySize * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();
        // Tail curled under
        ctx.beginPath();
        ctx.arc(0, babySize * 0.1, babySize * 0.5, -Math.PI * 0.3, Math.PI * 0.9);
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = babySize * 0.2;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Eyes
        ctx.beginPath();
        ctx.arc(-babySize * 0.3, -babySize * 0.35, babySize * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 10, 10, 0.8)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-babySize * 0.15, -babySize * 0.38, babySize * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 10, 10, 0.8)';
        ctx.fill();
        // Tiny claws
        if (growthProgress > 0.85) {
            ctx.strokeStyle = bodyColor;
            ctx.lineWidth = babySize * 0.08;
            ctx.beginPath();
            ctx.moveTo(-babySize * 0.4, -babySize * 0.15);
            ctx.lineTo(-babySize * 0.6, -babySize * 0.3);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-babySize * 0.35, -babySize * 0.05);
            ctx.lineTo(-babySize * 0.55, -babySize * 0.15);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Specular highlight on egg shell
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.3, r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(220, 240, 255, 0.2)';
    ctx.fill();

    // Heartbeat pulse ring — visible at higher growth
    if (growthProgress > 0.2) {
        const heartbeat = Math.sin(frame * 0.1) * 0.5 + 0.5;
        if (heartbeat > 0.8) {
            const ringAlpha = (heartbeat - 0.8) * 2 * growthProgress * 0.3;
            ctx.beginPath();
            ctx.arc(0, 0, r * 1.1, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 150, 100, ${ringAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    ctx.restore();
}

export const meta = {
    version: '001',
    name: 'Lobster Egg',
    current: true,
    features: ['translucent-shell', 'growth-stages', 'embryo-development', 'heartbeat-pulse', 'specular-highlight'],
};
