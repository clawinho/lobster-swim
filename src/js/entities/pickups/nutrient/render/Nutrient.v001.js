/**
 * Nutrient.v001.js - Glowing nutrient particle for Birth level
 * Small organic matter drifting through the egg clutch
 * @version 001
 * @current true
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - center x
 * @param {number} y - center y
 * @param {number} size - radius
 * @param {number} frame - animation frame
 * @param {string} type - 'green' | 'gold' | 'blue'
 */
export function render(ctx, x, y, size, frame = 0, type = 'green') {
    const pulse = Math.sin(frame * 0.08) * 0.2 + 1;
    const r = size * pulse;

    const colors = {
        green: { h: 120, s: 70, l: 55 },
        gold: { h: 45, s: 80, l: 60 },
        blue: { h: 200, s: 70, l: 60 },
    };
    const c = colors[type] || colors.green;

    // Outer glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    glow.addColorStop(0, `hsla(${c.h}, ${c.s}%, ${c.l}%, 0.3)`);
    glow.addColorStop(1, `hsla(${c.h}, ${c.s}%, ${c.l}%, 0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);

    // Core
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${c.h}, ${c.s}%, ${c.l}%, 0.8)`;
    ctx.fill();

    // Highlight
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${c.h}, ${c.s - 10}%, ${c.l + 20}%, 0.6)`;
    ctx.fill();
}

export const meta = {
    version: '001',
    name: 'Nutrient Particle',
    current: true,
    features: ['glow', 'pulse', 'color-types'],
};
