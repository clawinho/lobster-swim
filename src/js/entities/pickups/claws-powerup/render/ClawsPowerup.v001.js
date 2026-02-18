/**
 * ClawsPowerup.v001.js - Glowing claw pickup that grants defensive ability
 * @version 001
 * @current true
 *
 * A pair of golden claws rotating slowly, with a pulsing glow.
 * Unmistakably special — this is a progression pickup, not a regular collectible.
 */

export function render(ctx, x, y, size, time) {
    const pulse = 0.7 + Math.sin(time * 0.05) * 0.3;
    const bob = Math.sin(time * 0.03) * 4;
    const rot = time * 0.01;

    ctx.save();
    ctx.translate(x, y + bob);

    // Outer glow
    const grd = ctx.createRadialGradient(0, 0, size * 0.2, 0, 0, size * 1.2);
    grd.addColorStop(0, `rgba(255, 200, 50, ${0.3 * pulse})`);
    grd.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Draw two claws mirrored
    for (let mirror = -1; mirror <= 1; mirror += 2) {
        ctx.save();
        ctx.scale(mirror, 1);
        ctx.rotate(rot * mirror);

        // Claw arm
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(size * 0.3, -size * 0.1, size * 0.5, -size * 0.3);
        ctx.strokeStyle = `rgba(255, 170, 30, ${pulse})`;
        ctx.lineWidth = size * 0.15;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Upper pincer
        ctx.beginPath();
        ctx.moveTo(size * 0.5, -size * 0.3);
        ctx.quadraticCurveTo(size * 0.7, -size * 0.55, size * 0.55, -size * 0.65);
        ctx.strokeStyle = `rgba(255, 200, 50, ${pulse})`;
        ctx.lineWidth = size * 0.12;
        ctx.stroke();

        // Lower pincer
        ctx.beginPath();
        ctx.moveTo(size * 0.5, -size * 0.3);
        ctx.quadraticCurveTo(size * 0.75, -size * 0.2, size * 0.65, -size * 0.05);
        ctx.strokeStyle = `rgba(255, 200, 50, ${pulse})`;
        ctx.lineWidth = size * 0.12;
        ctx.stroke();

        ctx.restore();
    }

    // Central sparkle
    const sparkle = Math.sin(time * 0.1) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1 * (1 + sparkle * 0.5), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 200, ${sparkle})`;
    ctx.fill();

    ctx.restore();
}

export const meta = {
    version: '001',
    name: 'Claws Powerup',
    current: true,
    features: ['golden-claws', 'pulsing-glow', 'rotation', 'bobbing'],
};
