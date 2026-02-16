/**
 * Lobster.v003.js - Game class rendering with real tail physics
 * @version 003
 * @current false
 *
 * Renders the lobster using pre-computed tail segment positions from the game class.
 * Uses Date.now() for claw wave and antenna wave to match original game behavior.
 */
export function render(ctx, x, y, size, angle, tailSegments, invincible, invincibleTimer) {
    if (invincible && Math.floor(invincibleTimer / 5) % 2 === 0) {
        ctx.globalAlpha = 0.4;
    }

    // Draw tail segments first (behind body)
    ctx.fillStyle = '#cc3300';

    // Segment 1 (closest to body)
    ctx.save();
    ctx.translate(tailSegments[0].x, tailSegments[0].y);
    ctx.rotate(tailSegments[0].angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Segment 2
    ctx.save();
    ctx.translate(tailSegments[1].x, tailSegments[1].y);
    ctx.rotate(tailSegments[1].angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.35, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Tail fan (segment 3)
    ctx.fillStyle = '#ff4500';
    ctx.save();
    ctx.translate(tailSegments[2].x, tailSegments[2].y);
    ctx.rotate(tailSegments[2].angle);
    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(-8, i * 4, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // Draw body
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    let clawWave = Math.sin(Date.now() / 200) * 0.15;

    // Upper claw
    ctx.save();
    ctx.rotate(-0.5 + clawWave);
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.ellipse(size * 0.9, -size * 0.1, size * 0.5, size * 0.25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cc3300';
    ctx.beginPath();
    ctx.moveTo(size * 1.3, -size * 0.2);
    ctx.lineTo(size * 1.6, -size * 0.4);
    ctx.lineTo(size * 1.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Lower claw
    ctx.save();
    ctx.rotate(0.5 - clawWave);
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.ellipse(size * 0.9, size * 0.1, size * 0.5, size * 0.25, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cc3300';
    ctx.beginPath();
    ctx.moveTo(size * 1.3, size * 0.2);
    ctx.lineTo(size * 1.6, size * 0.4);
    ctx.lineTo(size * 1.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.25, 3, 0, Math.PI * 2);
    ctx.arc(size * 0.4, size * 0.25, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size * 0.42, -size * 0.27, 1.5, 0, Math.PI * 2);
    ctx.arc(size * 0.42, size * 0.23, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Antennae
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    let antWave = Math.sin(Date.now() / 150) * 5;
    ctx.beginPath();
    ctx.moveTo(size * 0.5, -size * 0.3);
    ctx.quadraticCurveTo(size * 0.8, -size * 0.8 + antWave, size * 1.2, -size * 0.6 + antWave);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(size * 0.5, size * 0.3);
    ctx.quadraticCurveTo(size * 0.8, size * 0.8 - antWave, size * 1.2, size * 0.6 - antWave);
    ctx.stroke();
    ctx.lineWidth = 1;

    ctx.restore();
    ctx.globalAlpha = 1;

    // Invincibility shield
    if (invincible) {
        ctx.strokeStyle = '#ffff0066';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
    }
}

export const meta = {
    version: "003",
    name: "Game Renderer (Real Tail Physics)",
    current: true,
    features: ["real tail physics", "animated claws", "antennae", "invincibility shield"]
};
