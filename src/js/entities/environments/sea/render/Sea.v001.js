/**
 * Sea.v001.js - Open sea with sliver of sky visible at top
 * @version 001
 * @current true
 */

import { hslToRgba } from '../../../utils/colors.js';

export function render(ctx, w, h, scrollX) {
    const t = Date.now() / 1000;

    // --- Sky sliver at top (10% of screen) ---
    const skyH = h * 0.1;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, skyH);
    skyGrad.addColorStop(0, hslToRgba(210, 60, 70, 1));
    skyGrad.addColorStop(1, hslToRgba(200, 50, 55, 1));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, skyH);

    // Clouds
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) {
        const cx = ((i * 120 + t * 8 + (scrollX || 0) * 0.1) % (w + 80)) - 40;
        const cy = 10 + (i % 2) * 12;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 30 + i * 5, 8 + i * 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // --- Water surface with waves ---
    ctx.save();
    ctx.fillStyle = hslToRgba(200, 55, 45, 0.6);
    ctx.beginPath();
    ctx.moveTo(0, skyH);
    for (let x = 0; x <= w; x += 4) {
        const y = skyH + Math.sin(x * 0.015 + t * 2) * 6 + Math.sin(x * 0.03 + t * 1.3) * 3;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, skyH + 20);
    ctx.lineTo(0, skyH + 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // --- Deep water gradient ---
    const waterGrad = ctx.createLinearGradient(0, skyH, 0, h);
    waterGrad.addColorStop(0, hslToRgba(200, 60, 35, 1));
    waterGrad.addColorStop(0.4, hslToRgba(210, 65, 22, 1));
    waterGrad.addColorStop(1, hslToRgba(220, 70, 12, 1));
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, skyH + 10, w, h - skyH);

    // --- Light rays from surface ---
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 5; i++) {
        const rx = (i * w / 5) + Math.sin(t * 0.3 + i) * 30;
        ctx.fillStyle = hslToRgba(55, 80, 85, 1);
        ctx.beginPath();
        ctx.moveTo(rx - 8, skyH);
        ctx.lineTo(rx + 25, h * 0.7);
        ctx.lineTo(rx - 25, h * 0.7);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    // --- Bubbles rising ---
    ctx.save();
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 8; i++) {
        const bx = (i * 97 + 40) % w;
        const by = ((h - (t * 25 + i * 80) % (h - skyH)) + h - skyH) % (h - skyH) + skyH;
        const bs = 2 + (i % 3) * 1.5;
        ctx.strokeStyle = hslToRgba(200, 50, 75, 1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx + Math.sin(t * 0.8 + i) * 8, by, bs, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();

    // --- Distant fish silhouettes ---
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = hslToRgba(210, 30, 50, 1);
    for (let i = 0; i < 3; i++) {
        const fx = ((t * 15 + i * 200) % (w + 100)) - 50;
        const fy = h * 0.4 + i * 60;
        ctx.beginPath();
        ctx.ellipse(fx, fy, 18, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tail
        ctx.beginPath();
        ctx.moveTo(fx + 18, fy);
        ctx.lineTo(fx + 28, fy - 6);
        ctx.lineTo(fx + 28, fy + 6);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    // --- Seaweed on distant floor ---
    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 6; i++) {
        const sx = (i * w / 6) + 20;
        const sway = Math.sin(t * 0.6 + i * 0.8) * 8;
        ctx.fillStyle = hslToRgba(140, 50, 25, 1);
        ctx.beginPath();
        ctx.ellipse(sx + sway, h - 15, 5, 30 + (i % 3) * 10, 0.05 + sway * 0.01, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

export const meta = { version: '001', name: 'Open Sea', current: true, features: ['sky sliver', 'wave surface', 'light rays', 'distant fish', 'seaweed'] };
