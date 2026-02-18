/**
 * Ocean.v003.js - Deep ocean with atmospheric depth
 * Inspired by Birth level quality: dark palette, subtle glows, particle specks, vignette
 * @version 003
 * @current true
 */

import { hslToRgba } from '../../../utils/colors.js';

const PARTICLE_COUNT = 20;
const particles = [];
let initialized = false;

function initParticles(w, h) {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h * 0.85,
            r: 0.8 + Math.random() * 2,
            speed: 0.05 + Math.random() * 0.2,
            phase: Math.random() * Math.PI * 2,
            hue: 170 + Math.random() * 40,
        });
    }
    initialized = true;
}

export function render(ctx, w, h, scrollX) {
    if (!initialized) initParticles(w, h);

    const t = Date.now() / 1000;

    // --- Deep gradient background ---
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#041828');
    bgGrad.addColorStop(0.3, '#031220');
    bgGrad.addColorStop(0.7, '#020c18');
    bgGrad.addColorStop(1, '#010810');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // --- Subtle light rays from surface ---
    ctx.save();
    for (let i = 0; i < 4; i++) {
        const rx = ((i * 200 + scrollX * 0.05) % (w + 200)) - 100;
        const sway = Math.sin(t * 0.2 + i * 1.8) * 25;
        const rayAlpha = 0.02 + Math.sin(t * 0.15 + i * 0.7) * 0.01;
        const rayGrad = ctx.createLinearGradient(rx + sway, 0, rx + sway, h * 0.7);
        rayGrad.addColorStop(0, hslToRgba(195, 60, 75, rayAlpha * 2));
        rayGrad.addColorStop(0.5, hslToRgba(195, 60, 60, rayAlpha));
        rayGrad.addColorStop(1, hslToRgba(195, 60, 50, 0));
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rx + sway - 12, 0);
        ctx.lineTo(rx + sway + 12, 0);
        ctx.lineTo(rx + sway + 70, h * 0.7);
        ctx.lineTo(rx + sway - 70, h * 0.7);
        ctx.fill();
    }
    ctx.restore();

    // --- Background rock silhouettes (far layer) ---
    ctx.save();
    ctx.fillStyle = hslToRgba(210, 20, 8, 0.5);
    for (let i = 0; i < 6; i++) {
        const bx = ((i * 160 + scrollX * 0.08) % (w + 120)) - 60;
        const bh = 35 + Math.sin(i * 2.7) * 18;
        ctx.beginPath();
        ctx.ellipse(bx, 520, 30 + i * 4, bh, 0, Math.PI, 0);
        ctx.fill();
    }
    ctx.restore();

    // --- Sandy floor with deep gradient ---
    const sandGrad = ctx.createLinearGradient(0, 490, 0, h);
    sandGrad.addColorStop(0, hslToRgba(25, 35, 14, 1));
    sandGrad.addColorStop(0.3, hslToRgba(25, 30, 10, 1));
    sandGrad.addColorStop(1, hslToRgba(20, 25, 6, 1));
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, 490, w, h - 490);

    // Sand ripples
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = hslToRgba(30, 30, 25, 1);
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
        const rx = ((i * 100 + scrollX * 0.15) % (w + 80)) - 40;
        ctx.beginPath();
        ctx.moveTo(rx, 510 + i * 8);
        ctx.quadraticCurveTo(rx + 25, 506 + i * 8, rx + 50, 510 + i * 8);
        ctx.stroke();
    }
    ctx.restore();

    // --- Coral (subdued, darker) ---
    for (let i = 0; i < 4; i++) {
        const cx = ((i * 220 + 80 + scrollX * 0.12) % (w + 100)) - 50;
        const coralHue = [340, 15, 320, 10][i];
        ctx.fillStyle = hslToRgba(coralHue, 40, 22, 0.5);
        for (let b = 0; b < 3; b++) {
            const angle = -0.4 + b * 0.4 + Math.sin(t * 0.4 + i) * 0.04;
            ctx.save();
            ctx.translate(cx, 500);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, -18, 4, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, -38, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Seaweed (darker, more organic sway) ---
    for (let i = 0; i < 8; i++) {
        const sx = ((i * 120 + scrollX * 0.2) % (w + 100)) - 50;
        const hue = 140 + (i % 3) * 12;
        ctx.fillStyle = hslToRgba(hue, 35, 18, 0.7);
        for (let j = 0; j < 6; j++) {
            const sway = Math.sin(t * 0.8 + i * 0.7 + j * 0.4) * (6 + j * 2);
            ctx.beginPath();
            ctx.ellipse(sx + sway, 505 - j * 26, 6, 20, 0.12 + sway * 0.012, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // --- Bioluminescent particle specks ---
    ctx.save();
    for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(t + p.phase) * 0.2;
        if (p.y < -5) { p.y = h * 0.85; p.x = Math.random() * w; }

        const glow = Math.sin(t * 0.6 + p.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 65%, ${0.2 * glow})`;
        ctx.fill();
    }
    ctx.restore();

    // --- Vignette for depth ---
    const vigGrad = ctx.createRadialGradient(w / 2, h * 0.4, h * 0.25, w / 2, h * 0.4, h * 0.85);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, w, h);
}

export const meta = {
    version: '003',
    name: 'The Ocean — Depths',
    current: true,
    features: ['deep-gradient', 'fading-light-rays', 'bioluminescent-particles', 'vignette', 'subdued-coral', 'dark-seaweed'],
};
