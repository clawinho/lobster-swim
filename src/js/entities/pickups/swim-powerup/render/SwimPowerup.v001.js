/**
 * SwimPowerup.v001.js - Glowing wave/fin pickup that grants swimming ability
 * @version 001
 * @current true
 *
 * An animated wave/water symbol with a pulsing blue-cyan glow.
 * Clearly special — this is the progression pickup that unlocks Level 2.
 */

export function render(ctx, x, y, size, time) {
    const pulse = 0.7 + Math.sin(time * 0.04) * 0.3;
    const bob = Math.sin(time * 0.03) * 5;
    const wave = time * 0.06;

    ctx.save();
    ctx.translate(x, y + bob);

    // Outer glow
    const grd = ctx.createRadialGradient(0, 0, size * 0.2, 0, 0, size * 1.5);
    grd.addColorStop(0, `rgba(0, 200, 255, ${0.4 * pulse})`);
    grd.addColorStop(0.5, `rgba(0, 100, 255, ${0.2 * pulse})`);
    grd.addColorStop(1, 'rgba(0, 100, 255, 0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Wave shape — three undulating arcs
    for (let i = -1; i <= 1; i++) {
        const yOff = i * size * 0.35;
        const phase = wave + i * 0.8;
        ctx.beginPath();
        ctx.moveTo(-size * 0.6, yOff);
        ctx.quadraticCurveTo(
            -size * 0.2, yOff - Math.sin(phase) * size * 0.3,
            0, yOff
        );
        ctx.quadraticCurveTo(
            size * 0.2, yOff + Math.sin(phase) * size * 0.3,
            size * 0.6, yOff
        );
        ctx.strokeStyle = `rgba(100, 220, 255, ${pulse * (1 - Math.abs(i) * 0.2)})`;
        ctx.lineWidth = size * 0.1;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    // Central "SWIM" sparkle burst
    const sparkle = Math.sin(time * 0.08) * 0.5 + 0.5;
    const rays = 6;
    for (let r = 0; r < rays; r++) {
        const angle = (r / rays) * Math.PI * 2 + time * 0.02;
        const len = size * 0.3 * (0.5 + sparkle * 0.5);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * size * 0.1, Math.sin(angle) * size * 0.1);
        ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
        ctx.strokeStyle = `rgba(200, 240, 255, ${sparkle * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
    ctx.fill();

    ctx.restore();
}

export const meta = {
    version: '001',
    name: 'Swim Powerup',
    current: true,
    features: ['wave-animation', 'pulsing-glow', 'sparkle-rays', 'bobbing'],
};
