/**
 * Birth.v002.js - Birth level background renderer (polished)
 * Egg glow effects, richer clutch backdrop, organic feel
 * @version 002
 * @current true
 */

const PARTICLE_COUNT = 50;
const particles = [];
const EGG_COUNT = 300;
const eggs = [];
let initialized = false;

function initScene(w, h) {
    // Bioluminescent particles
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.5 + Math.random() * 2.5,
            speed: 0.05 + Math.random() * 0.25,
            phase: Math.random() * Math.PI * 2,
            hue: 170 + Math.random() * 70,
            drift: (Math.random() - 0.5) * 0.15,
        });
    }

    // Pre-generate egg positions in organic clusters
    eggs.length = 0;
    const clusterCenters = [];
    const numClusters = 14;
    for (let c = 0; c < numClusters; c++) {
        clusterCenters.push({
            x: w * 0.1 + (c / numClusters) * w * 0.8 + (Math.random() - 0.5) * 40,
            y: h * 0.10 + Math.random() * h * 0.35,
        });
    }
    for (let i = 0; i < EGG_COUNT; i++) {
        const cluster = clusterCenters[Math.floor(Math.random() * numClusters)];
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 30;
        eggs.push({
            x: cluster.x + Math.cos(angle) * dist,
            y: cluster.y + Math.sin(angle) * dist,
            r: 3.5 + Math.random() * 4,
            phaseOffset: Math.random() * Math.PI * 2,
            hue: 190 + Math.random() * 30,
            saturation: 40 + Math.random() * 30,
        });
    }
    initialized = true;
}

/**
 * Render the Birth level background
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w - canvas width
 * @param {number} h - canvas height
 * @param {number} scrollX - scroll offset
 * @param {number} frame - animation frame counter
 * @param {number} growthProgress - 0-1 growth meter
 */
export function render(ctx, w, h, scrollX, frame = 0, growthProgress = 0) {
    if (!initialized) initScene(w, h);

    // Deep ocean gradient — richer blues
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#010610');
    grad.addColorStop(0.3, '#030a16');
    grad.addColorStop(0.6, '#051020');
    grad.addColorStop(1, '#08152a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle caustic light pattern at bottom
    ctx.save();
    ctx.globalAlpha = 0.03 + growthProgress * 0.02;
    for (let i = 0; i < 6; i++) {
        const cx = w * (0.2 + i * 0.12) + Math.sin(frame * 0.008 + i * 1.5) * 30;
        const cy = h * 0.85 + Math.cos(frame * 0.006 + i) * 15;
        const cr = 60 + Math.sin(frame * 0.01 + i * 2) * 20;
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        cg.addColorStop(0, 'rgba(100, 180, 255, 0.8)');
        cg.addColorStop(1, 'rgba(100, 180, 255, 0)');
        ctx.fillStyle = cg;
        ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
    }
    ctx.restore();

    // Mother's tail silhouette — more organic shape with gentle sway
    const tailY = h * 0.06;
    const tailSway = Math.sin(frame * 0.008) * 3;
    ctx.save();

    // Tail body — dark with subtle warm undertone
    const tailGrad = ctx.createLinearGradient(0, 0, 0, tailY + 40);
    tailGrad.addColorStop(0, '#060610');
    tailGrad.addColorStop(1, '#0c0a14');
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, tailY + 35 + tailSway);
    for (let x = w; x >= 0; x -= 20) {
        const seg = Math.sin(x * 0.06) * 14 + Math.sin(x * 0.025 + frame * 0.012) * 8;
        ctx.lineTo(x, tailY + seg + tailSway);
    }
    ctx.closePath();
    ctx.fill();

    // Tail texture — segmented plates
    ctx.strokeStyle = 'rgba(40, 50, 70, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        const y = tailY * (0.2 + i * 0.09);
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
            const yy = y + Math.sin(x * 0.04 + i * 0.8) * 3 + tailSway * 0.5;
            x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.stroke();
    }

    // Pleopod swimmerets — feathery appendages holding eggs
    ctx.strokeStyle = 'rgba(50, 60, 80, 0.2)';
    ctx.lineWidth = 1.5;
    for (let s = 0; s < 30; s++) {
        const sx = (s / 30) * w + Math.sin(s * 2.1) * 15;
        const sway = Math.sin(frame * 0.015 + s * 0.7) * 4;
        ctx.beginPath();
        ctx.moveTo(sx, tailY + tailSway);
        const endY = tailY + 50 + Math.sin(s * 1.3) * 15;
        ctx.bezierCurveTo(
            sx + sway, tailY + 18 + tailSway,
            sx - sway * 0.7, tailY + 35 + tailSway,
            sx + Math.sin(s * 1.7) * 8, endY + tailSway
        );
        ctx.stroke();

        // Fine hair-like branches
        if (s % 3 === 0) {
            ctx.strokeStyle = 'rgba(50, 60, 80, 0.1)';
            ctx.lineWidth = 0.5;
            const midX = sx + sway * 0.5;
            const midY = tailY + 30 + tailSway;
            for (let b = -1; b <= 1; b += 2) {
                ctx.beginPath();
                ctx.moveTo(midX, midY);
                ctx.lineTo(midX + b * 12, midY + 8);
                ctx.stroke();
            }
            ctx.strokeStyle = 'rgba(50, 60, 80, 0.2)';
            ctx.lineWidth = 1.5;
        }
    }
    ctx.restore();

    // Egg clusters with glow effects
    ctx.save();
    for (const egg of eggs) {
        const pulse = Math.sin(frame * 0.025 + egg.phaseOffset) * 0.5 + 0.5;
        const lightness = 25 + pulse * 15 + growthProgress * 10;
        const alpha = 0.35 + pulse * 0.25;
        const r = egg.r + pulse * 0.8;

        // Outer glow — warm as growth progresses
        const glowHue = egg.hue + growthProgress * -30; // shift toward warm
        const glowR = r * (2 + growthProgress * 1.5);
        const glow = ctx.createRadialGradient(egg.x, egg.y, r * 0.5, egg.x, egg.y, glowR);
        glow.addColorStop(0, `hsla(${glowHue}, ${egg.saturation}%, ${lightness}%, ${alpha * 0.3})`);
        glow.addColorStop(1, `hsla(${glowHue}, ${egg.saturation}%, ${lightness}%, 0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(egg.x - glowR, egg.y - glowR, glowR * 2, glowR * 2);

        // Egg body
        ctx.beginPath();
        ctx.arc(egg.x, egg.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${egg.hue}, ${egg.saturation}%, ${lightness}%, ${alpha})`;
        ctx.fill();

        // Inner embryo hint — grows with progress
        if (growthProgress > 0.2) {
            const embryoR = r * 0.4 * growthProgress;
            const embryoAlpha = (growthProgress - 0.2) * 0.5;
            ctx.beginPath();
            ctx.arc(egg.x, egg.y + r * 0.1, embryoR, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(20, 60%, 50%, ${embryoAlpha})`;
            ctx.fill();
        }

        // Specular highlight
        ctx.beginPath();
        ctx.arc(egg.x - r * 0.25, egg.y - r * 0.25, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 210, 240, ${alpha * 0.35})`;
        ctx.fill();
    }
    ctx.restore();

    // Floating bioluminescent particles
    ctx.save();
    for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(frame * 0.015 + p.phase) * 0.3 + p.drift;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;

        const glow = Math.sin(frame * 0.035 + p.phase) * 0.4 + 0.6;
        const pr = p.r * glow;

        // Soft glow halo
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pr * 3);
        halo.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${0.15 * glow})`);
        halo.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
        ctx.fillStyle = halo;
        ctx.fillRect(p.x - pr * 3, p.y - pr * 3, pr * 6, pr * 6);

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${0.5 * glow})`;
        ctx.fill();
    }
    ctx.restore();

    // Vignette
    const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.85);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);

    // Growth-dependent warm glow — pulsing heart-like
    if (growthProgress > 0.1) {
        const heartbeat = Math.sin(frame * 0.06) * 0.3 + 0.7;
        const glowAlpha = growthProgress * 0.12 * heartbeat;
        const glowSize = 100 + growthProgress * 80;
        const warmGlow = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, glowSize);
        warmGlow.addColorStop(0, `rgba(255, 180, 80, ${glowAlpha})`);
        warmGlow.addColorStop(0.5, `rgba(255, 140, 60, ${glowAlpha * 0.4})`);
        warmGlow.addColorStop(1, 'rgba(255, 140, 60, 0)');
        ctx.fillStyle = warmGlow;
        ctx.fillRect(0, 0, w, h);
    }
}

export const meta = {
    version: '002',
    name: 'Birth — Polished Clutch',
    current: true,
    features: ['organic-clusters', 'egg-glow', 'embryo-hints', 'caustic-light', 'heartbeat-glow', 'pleopod-detail', 'particle-halos'],
};
