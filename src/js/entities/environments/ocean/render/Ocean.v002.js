/**
 * Ocean.v002.js - Rich ocean background with depth layers
 * Adds: gradient sky-to-deep, caustic light rays, coral, rocks, animated seaweed, drifting particles
 * @version 002
 * @current true
 */

import { hslToRgba } from '../../../utils/colors.js';

export function render(ctx, w, h, scrollX) {
    const t = Date.now() / 1000;

    // --- Light rays from surface ---
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 5; i++) {
        const rx = ((i * 200 + scrollX * 0.05) % (w + 200)) - 100;
        const sway = Math.sin(t * 0.3 + i * 1.5) * 30;
        ctx.fillStyle = hslToRgba(190, 80, 80, 1);
        ctx.beginPath();
        ctx.moveTo(rx + sway - 15, 0);
        ctx.lineTo(rx + sway + 15, 0);
        ctx.lineTo(rx + sway + 60, h);
        ctx.lineTo(rx + sway - 60, h);
        ctx.fill();
    }
    ctx.restore();

    // --- Background rocks / coral silhouettes (far layer) ---
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = hslToRgba(200, 30, 12, 1);
    for (let i = 0; i < 6; i++) {
        const bx = ((i * 160 + scrollX * 0.1) % (w + 120)) - 60;
        const bh = 40 + Math.sin(i * 2.7) * 20;
        // Rounded rock mound
        ctx.beginPath();
        ctx.ellipse(bx, 530, 35 + i * 3, bh, 0, Math.PI, 0);
        ctx.fill();
    }
    ctx.restore();

    // --- Sandy floor with gradient ---
    const sandGrad = ctx.createLinearGradient(0, 500, 0, h);
    sandGrad.addColorStop(0, hslToRgba(30, 50, 20, 1));
    sandGrad.addColorStop(0.4, hslToRgba(30, 45, 15, 1));
    sandGrad.addColorStop(1, hslToRgba(25, 40, 10, 1));
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, 500, w, h - 500);

    // Sandy ripples
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = hslToRgba(35, 50, 30, 1);
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) {
        const rx = ((i * 100 + scrollX * 0.15) % (w + 80)) - 40;
        ctx.beginPath();
        ctx.moveTo(rx, 520 + i * 7);
        ctx.quadraticCurveTo(rx + 25, 516 + i * 7, rx + 50, 520 + i * 7);
        ctx.stroke();
    }
    ctx.restore();

    // --- Coral pieces (mid-ground) ---
    for (let i = 0; i < 4; i++) {
        const cx = ((i * 220 + 80 + scrollX * 0.15) % (w + 100)) - 50;
        const coralHue = [350, 20, 330, 15][i];
        ctx.fillStyle = hslToRgba(coralHue, 60, 35, 0.6);
        // Branching coral
        for (let b = 0; b < 3; b++) {
            const angle = -0.4 + b * 0.4 + Math.sin(t * 0.5 + i) * 0.05;
            ctx.save();
            ctx.translate(cx, 510);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, -20, 5, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            // Coral tip
            ctx.beginPath();
            ctx.arc(0, -42, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Seaweed (foreground, improved) ---
    for (let i = 0; i < 8; i++) {
        const sx = ((i * 120 + scrollX * 0.2) % (w + 100)) - 50;
        const hue = 120 + (i % 3) * 15; // Vary green shades
        ctx.fillStyle = hslToRgba(hue, 50, 28, 0.8);
        for (let j = 0; j < 6; j++) {
            const sway = Math.sin(t + i * 0.7 + j * 0.4) * (8 + j * 2);
            ctx.beginPath();
            ctx.ellipse(sx + sway, 515 - j * 28, 7, 22, 0.15 + sway * 0.015, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // --- Drifting particles (plankton/dust) ---
    ctx.save();
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 12; i++) {
        const px = ((i * 73 + t * 8 + scrollX * 0.3) % w);
        const py = ((i * 51 + Math.sin(t * 0.4 + i) * 20) % (h - 100)) + 20;
        const size = 1.5 + (i % 3);
        ctx.fillStyle = hslToRgba(180, 40, 70, 1);
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

export const meta = { version: '002', name: 'The Ocean — Deep', current: true, features: ['light rays', 'coral', 'sand ripples', 'plankton particles'] };
