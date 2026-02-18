/**
 * FallingPickup.v001.js - Falling collectible renders (shell, clam, seaweed)
 * @version 001
 * @current true
 */

const PICKUP_TYPES = {
    shell: { color: '#FFD699', accent: '#E8A830', points: 15 },
    clam:  { color: '#DDA0DD', accent: '#9B59B6', points: 25 },
    seaweed: { color: '#5DBB63', accent: '#2E7D32', points: 10 },
};

export function render(ctx, x, y, size, time, type = 'shell', landed = false) {
    const config = PICKUP_TYPES[type] || PICKUP_TYPES.shell;
    const bob = landed ? Math.sin(time * 0.04) * 2 : 0;
    const glow = landed ? 0.3 + Math.sin(time * 0.06) * 0.15 : 0;

    ctx.save();
    ctx.translate(x, y + bob);

    // Glow when landed (waiting to be picked up)
    if (glow > 0) {
        ctx.shadowColor = config.color;
        ctx.shadowBlur = 8 + glow * 10;
    }

    if (type === 'shell') {
        // Spiral shell
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.6, size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = config.color;
        ctx.fill();
        ctx.strokeStyle = config.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Ridges
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(-(size * 0.15) + i * (size * 0.15), 0, size * (0.15 + i * 0.1), size * (0.1 + i * 0.08), 0, 0, Math.PI * 2);
            ctx.strokeStyle = config.accent;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }
    } else if (type === 'clam') {
        // Clam with two halves
        ctx.beginPath();
        ctx.ellipse(0, -2, size * 0.55, size * 0.35, 0, Math.PI, Math.PI * 2);
        ctx.fillStyle = config.color;
        ctx.fill();
        ctx.strokeStyle = config.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 2, size * 0.55, size * 0.35, 0, 0, Math.PI);
        ctx.fillStyle = config.color;
        ctx.fill();
        ctx.strokeStyle = config.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Pearl inside
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFEF0';
        ctx.fill();
    } else if (type === 'seaweed') {
        // Wavy seaweed strand
        ctx.beginPath();
        ctx.moveTo(0, size * 0.4);
        ctx.quadraticCurveTo(-size * 0.3, size * 0.1, 0, -size * 0.1);
        ctx.quadraticCurveTo(size * 0.3, -size * 0.3, 0, -size * 0.45);
        ctx.strokeStyle = config.color;
        ctx.lineWidth = size * 0.2;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.strokeStyle = config.accent;
        ctx.lineWidth = size * 0.08;
        ctx.stroke();
    }

    ctx.restore();
}

export function getPoints(type = 'shell') {
    return (PICKUP_TYPES[type] || PICKUP_TYPES.shell).points;
}

export const meta = {
    version: '001',
    name: 'Falling Pickups',
    current: true,
    features: ['shell', 'clam', 'seaweed', 'landing', 'glow-when-landed'],
};
