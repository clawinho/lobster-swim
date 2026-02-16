/**
 * BeachBall.v001.js - Colorful striped beach ball
 * @version 001
 * @current true
 */

/**
 * Render a beach ball
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - Center X
 * @param {number} y - Center Y
 * @param {number} radius - Ball radius
 * @param {number} rotation - Ball rotation angle
 * @param {string[]} colors - Array of stripe colors
 */
export function render(ctx, x, y, radius, rotation, colors) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    // Number of stripes (alternating colors)
    const stripes = 6;
    const anglePerStripe = (Math.PI * 2) / stripes;
    
    // Draw each stripe segment
    for (let i = 0; i < stripes; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, i * anglePerStripe, (i + 1) * anglePerStripe);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
    }
    
    // Outline
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Highlight (shiny reflection)
    const gradient = ctx.createRadialGradient(
        -radius * 0.3, -radius * 0.3, 0,
        -radius * 0.3, -radius * 0.3, radius * 0.5
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.restore();
}

export const meta = { 
    version: '001', 
    name: 'Striped Beach Ball', 
    current: true, 
    features: ['colorful stripes', 'shine highlight', 'rotation'] 
};
