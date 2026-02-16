/**
 * Lobster.v004.js - Game renderer with rotated tail ellipses and bigger eyes
 * @version 004
 * @current true
 *
 * Renders the lobster using pre-computed tail segment positions from the game class.
 * Visual style: varying segment proportions, sine-rotated ellipses, bigger eyes at (0.3, ±0.2).
 * Uses Date.now() for claw wave, antenna wave, and subtle tail rotation.
 */
export function render(ctx, x, y, size, angle, tailSegments, invincible, invincibleTimer) {
    if (invincible && Math.floor(invincibleTimer / 5) % 2 === 0) {
        ctx.globalAlpha = 0.4;
    }

    const tailAngle = Math.sin(Date.now() / 300) * 0.3;

    // Tail segments (behind body) — v004 style: varying proportions, rotated ellipses
    ctx.fillStyle = '#cc3300';
    for (let i = 0; i < 2; i++) {
        const segSize = size * (0.5 - i * 0.12);
        ctx.save();
        ctx.translate(tailSegments[i].x, tailSegments[i].y);
        ctx.rotate(tailSegments[i].angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, segSize, segSize * 0.7, tailAngle * (i + 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Tail fan at segment 3 — v004 style: sine-rotated petals
    ctx.fillStyle = '#ff4500';
    ctx.save();
    ctx.translate(tailSegments[2].x, tailSegments[2].y);
    ctx.rotate(tailSegments[2].angle);
    for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(-8, i * 4, 8, 3, tailAngle * 3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // Body
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Claws
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

    // Eyes — v004 style: bigger (radius 4) at (0.3, ±0.2)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(size * 0.3, -size * 0.2, 4, 0, Math.PI * 2);
    ctx.arc(size * 0.3, size * 0.2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(size * 0.32, -size * 0.22, 1.5, 0, Math.PI * 2);
    ctx.arc(size * 0.32, size * 0.18, 1.5, 0, Math.PI * 2);
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
    version: "004",
    name: "Game Renderer (Rotated Tail, Big Eyes)",
    current: false,
    features: ["real tail physics", "rotated tail ellipses", "bigger eyes", "animated claws", "antennae", "invincibility shield"]
};
