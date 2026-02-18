/**
 * EggPredator.v001.js - Small fish that eats lobster eggs
 * Translucent, darting movement, visible hunger path
 * @version 001
 * @current true
 */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - center x
 * @param {number} y - center y
 * @param {number} size - body length
 * @param {number} frame - animation frame
 * @param {number} direction - 1 = right, -1 = left
 */
export function render(ctx, x, y, size, frame = 0, direction = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(direction, 1);

    const tailWag = Math.sin(frame * 0.15) * 0.2;

    // Body — semi-transparent silvery fish
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.5, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120, 140, 160, 0.6)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(80, 100, 120, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-size * 0.45, 0);
    ctx.lineTo(-size * 0.7, -size * 0.2 + tailWag * size);
    ctx.lineTo(-size * 0.7, size * 0.2 + tailWag * size);
    ctx.closePath();
    ctx.fillStyle = 'rgba(100, 120, 140, 0.5)';
    ctx.fill();

    // Eye — slightly menacing
    ctx.beginPath();
    ctx.arc(size * 0.25, -size * 0.05, size * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 180, 100, 0.8)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.26, -size * 0.05, size * 0.03, 0, Math.PI * 2);
    ctx.fillStyle = '#111';
    ctx.fill();

    // Mouth
    ctx.beginPath();
    ctx.moveTo(size * 0.5, 0);
    ctx.lineTo(size * 0.4, size * 0.06);
    ctx.strokeStyle = 'rgba(80, 60, 60, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
}

export const meta = {
    version: '001',
    name: 'Egg Predator Fish',
    current: true,
    features: ['translucent', 'tail-wag', 'menacing-eye'],
};
