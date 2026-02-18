/**
 * Birth.v001.js - Birth level background renderer
 * Lobster egg clutch under mother's tail — dark, intimate, bioluminescent
 * @version 001
 * @current false
 */

const PARTICLE_COUNT = 40;
const particles = [];
let initialized = false;

function initParticles(w, h) {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 1 + Math.random() * 2,
            speed: 0.1 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            hue: 180 + Math.random() * 60, // cyan-blue bioluminescence
        });
    }
    initialized = true;
}

/**
 * Render the Birth level background
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w - canvas width
 * @param {number} h - canvas height
 * @param {number} scrollX - scroll offset (unused for fixed screen)
 * @param {number} frame - animation frame counter
 * @param {number} growthProgress - 0-1 how far along the growth meter is
 */
export function render(ctx, w, h, scrollX, frame = 0, growthProgress = 0) {
    if (!initialized) initParticles(w, h);

    // Dark abyssal gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#020810');
    grad.addColorStop(0.5, '#040c18');
    grad.addColorStop(1, '#061020');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Mother's tail silhouette at top — large dark shape with subtle segmentation
    const tailY = h * 0.08;
    ctx.save();
    ctx.fillStyle = '#0a0a12';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, tailY + 30);
    // Segmented tail edge
    for (let x = w; x >= 0; x -= 40) {
        const seg = Math.sin(x * 0.08) * 12 + Math.sin(x * 0.03 + frame * 0.01) * 6;
        ctx.lineTo(x, tailY + seg);
    }
    ctx.closePath();
    ctx.fill();

    // Subtle tail texture lines
    ctx.strokeStyle = 'rgba(30, 40, 60, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
        const y = tailY * (0.3 + i * 0.1);
        ctx.beginPath();
        for (let x = 0; x < w; x += 5) {
            const yy = y + Math.sin(x * 0.05 + i) * 3;
            x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
    }
    ctx.restore();

    // Egg cluster strands hanging from tail — thin filaments
    ctx.save();
    ctx.strokeStyle = 'rgba(60, 80, 100, 0.15)';
    ctx.lineWidth = 0.5;
    for (let strand = 0; strand < 25; strand++) {
        const sx = (strand / 25) * w + Math.sin(strand * 2.3) * 20;
        ctx.beginPath();
        ctx.moveTo(sx, tailY);
        const endY = tailY + 60 + Math.sin(strand) * 20;
        ctx.bezierCurveTo(
            sx + Math.sin(frame * 0.02 + strand) * 5, tailY + 20,
            sx - Math.sin(frame * 0.015 + strand) * 5, tailY + 40,
            sx + Math.sin(strand * 1.7) * 10, endY
        );
        ctx.stroke();
    }
    ctx.restore();

    // Egg masses — clusters of small circles representing thousands of eggs
    ctx.save();
    const eggBaseY = tailY + 30;
    const eggRows = 6;
    const eggCols = 20;
    for (let row = 0; row < eggRows; row++) {
        for (let col = 0; col < eggCols; col++) {
            const ex = (col / eggCols) * w + Math.sin(row * 2 + col) * 8;
            const ey = eggBaseY + row * 14 + Math.sin(col * 0.5) * 4;
            const er = 4 + Math.sin(row + col * 0.7) * 1.5;

            // Subtle pulse animation
            const pulse = Math.sin(frame * 0.03 + row * 0.5 + col * 0.3) * 0.5 + 0.5;

            // Most eggs are dim, a few glow slightly
            const brightness = 20 + pulse * 15;
            const alpha = 0.3 + pulse * 0.2;

            ctx.beginPath();
            ctx.arc(ex, ey, er, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${brightness + 40}, ${brightness + 60}, ${brightness + 80}, ${alpha})`;
            ctx.fill();

            // Tiny highlight
            ctx.beginPath();
            ctx.arc(ex - er * 0.3, ey - er * 0.3, er * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150, 180, 220, ${alpha * 0.3})`;
            ctx.fill();
        }
    }
    ctx.restore();

    // Floating bioluminescent particles
    ctx.save();
    for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(frame * 0.02 + p.phase) * 0.3;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }

        const glow = Math.sin(frame * 0.04 + p.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${0.3 * glow})`;
        ctx.fill();
    }
    ctx.restore();

    // Vignette — dark edges for intimate feeling
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.8);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    // Growth-dependent light — as growth progresses, a warm glow emerges at center
    if (growthProgress > 0.1) {
        const glowAlpha = growthProgress * 0.15;
        const glowGrad = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, 150);
        glowGrad.addColorStop(0, `rgba(255, 200, 100, ${glowAlpha})`);
        glowGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
    }
}

export const meta = {
    version: '001',
    name: 'Birth — Egg Clutch',
    current: false,
    features: ['mother-tail-silhouette', 'egg-cluster', 'bioluminescent-particles', 'vignette', 'growth-glow'],
};
