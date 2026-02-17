/**
 * Tank.v002.js - Rich seafood restaurant tank with glass walls, gravel, decorations
 * @version 002
 * @current true
 */

import { hslToRgba } from '../../../utils/colors.js';

export function render(ctx, w, h) {
    const t = Date.now() / 1000;

    // --- Glass edges (subtle vertical highlights) ---
    ctx.save();
    ctx.globalAlpha = 0.06;
    const glassGrad = ctx.createLinearGradient(0, 0, 30, 0);
    glassGrad.addColorStop(0, hslToRgba(200, 40, 80, 1));
    glassGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(0, 0, 30, h);
    const glassGrad2 = ctx.createLinearGradient(w, 0, w - 30, 0);
    glassGrad2.addColorStop(0, hslToRgba(200, 40, 80, 1));
    glassGrad2.addColorStop(1, 'transparent');
    ctx.fillStyle = glassGrad2;
    ctx.fillRect(w - 30, 0, 30, h);
    ctx.restore();

    // --- Water surface ripple at top ---
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = hslToRgba(195, 60, 70, 1);
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 5) {
            const y = 15 + i * 8 + Math.sin(x * 0.02 + t * 1.5 + i) * 4;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();

    // --- Gravel floor ---
    const gravelGrad = ctx.createLinearGradient(0, 520, 0, h);
    gravelGrad.addColorStop(0, hslToRgba(30, 10, 35, 1));
    gravelGrad.addColorStop(1, hslToRgba(25, 8, 25, 1));
    ctx.fillStyle = gravelGrad;
    ctx.fillRect(0, 520, w, h - 520);

    // Gravel dots
    ctx.save();
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 40; i++) {
        const gx = (i * 23.7) % w;
        const gy = 525 + (i * 17.3) % 50;
        const gs = 2 + (i % 3);
        ctx.fillStyle = hslToRgba(25, 10, 30 + (i % 4) * 8, 1);
        ctx.beginPath();
        ctx.arc(gx, gy, gs, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // --- Castle decoration (improved) ---
    ctx.fillStyle = hslToRgba(30, 8, 40, 0.8);
    // Main tower
    ctx.fillRect(35, 440, 50, 80);
    // Turrets
    ctx.fillRect(25, 430, 20, 30);
    ctx.fillRect(75, 430, 20, 30);
    // Battlements
    ctx.fillStyle = hslToRgba(30, 8, 45, 0.8);
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(27 + i * 8, 422, 5, 10);
        ctx.fillRect(77 + i * 8, 422, 5, 10);
    }
    // Doorway
    ctx.fillStyle = hslToRgba(0, 0, 15, 0.6);
    ctx.beginPath();
    ctx.arc(60, 510, 10, Math.PI, 0);
    ctx.fillRect(50, 510, 20, 10);
    ctx.fill();

    // --- Plastic plant (right side) ---
    const plantX = w - 80;
    for (let j = 0; j < 5; j++) {
        const sway = Math.sin(t * 0.8 + j * 0.5) * 5;
        ctx.fillStyle = hslToRgba(140, 70, 35, 0.7);
        ctx.beginPath();
        ctx.ellipse(plantX + sway + (j % 2) * 15, 510 - j * 24, 6, 20, 0.1 + sway * 0.02, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- Air bubbles rising ---
    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 6; i++) {
        const bx = 70 + (i * 130) % (w - 100);
        const by = ((h - (t * 30 + i * 100) % h) + h) % h;
        const bs = 3 + (i % 3) * 2;
        ctx.strokeStyle = hslToRgba(200, 50, 75, 1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx + Math.sin(t + i) * 5, by, bs, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

export const meta = { version: '002', name: 'Seafood Tank — Glass', current: true, features: ['glass walls', 'gravel floor', 'castle', 'plastic plant', 'air bubbles'] };
