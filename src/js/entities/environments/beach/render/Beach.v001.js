/**
 * Beach.v001.js - Beach: half sky+waves on top, half sandy floor+shallow water
 * @version 001
 * @current true
 */

import { hslToRgba } from '../../../utils/colors.js';

export function render(ctx, w, h, scrollX) {
    const t = Date.now() / 1000;
    const horizon = h * 0.35;
    const waterLine = h * 0.5;

    // --- Sky (top 35%) ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
    skyGrad.addColorStop(0, hslToRgba(205, 70, 72, 1));
    skyGrad.addColorStop(1, hslToRgba(195, 55, 60, 1));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizon);

    // Clouds
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 5; i++) {
        const cx = ((i * 100 + t * 6 + (scrollX || 0) * 0.05) % (w + 120)) - 60;
        const cy = 20 + (i % 3) * 25;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 35 + i * 8, 10 + i * 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // --- Ocean waves between horizon and waterline ---
    const waveGrad = ctx.createLinearGradient(0, horizon, 0, waterLine + 20);
    waveGrad.addColorStop(0, hslToRgba(200, 60, 45, 1));
    waveGrad.addColorStop(1, hslToRgba(190, 50, 55, 0.5));
    ctx.fillStyle = waveGrad;
    ctx.fillRect(0, horizon, w, waterLine - horizon + 20);

    // Wave crests
    ctx.save();
    for (let row = 0; row < 3; row++) {
        ctx.globalAlpha = 0.15 - row * 0.03;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(0, horizon + row * 20);
        for (let x = 0; x <= w; x += 3) {
            const y = horizon + row * 20 + Math.sin(x * 0.02 + t * 2.5 - row * 0.8) * 5;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(w, horizon + row * 20 + 15);
        ctx.lineTo(0, horizon + row * 20 + 15);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    // --- Shore foam ---
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = hslToRgba(0, 0, 95, 1);
    ctx.beginPath();
    ctx.moveTo(0, waterLine);
    for (let x = 0; x <= w; x += 3) {
        const y = waterLine + Math.sin(x * 0.025 + t * 1.8) * 4 + Math.sin(x * 0.06 + t * 3) * 2;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, waterLine + 12);
    ctx.lineTo(0, waterLine + 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // --- Sandy floor (bottom 50%) ---
    const sandGrad = ctx.createLinearGradient(0, waterLine, 0, h);
    sandGrad.addColorStop(0, hslToRgba(42, 55, 65, 1));
    sandGrad.addColorStop(0.15, hslToRgba(40, 50, 58, 1));
    sandGrad.addColorStop(1, hslToRgba(35, 45, 50, 1));
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, waterLine + 5, w, h - waterLine);

    // Wet sand near water
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = hslToRgba(38, 40, 42, 1);
    ctx.fillRect(0, waterLine + 5, w, 30);
    ctx.restore();

    // Sand texture dots
    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 50; i++) {
        const sx = (i * 31.7) % w;
        const sy = waterLine + 20 + (i * 19.3) % (h - waterLine - 20);
        const ss = 1 + (i % 3);
        ctx.fillStyle = hslToRgba(35, 30, 45 + (i % 5) * 5, 1);
        ctx.beginPath();
        ctx.arc(sx, sy, ss, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // --- Shells on sand ---
    ctx.save();
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 4; i++) {
        const shx = 50 + (i * 110) % (w - 100);
        const shy = waterLine + 40 + (i * 37) % 80;
        ctx.fillStyle = hslToRgba(20 + i * 15, 30, 70, 1);
        ctx.beginPath();
        ctx.arc(shx, shy, 4, 0, Math.PI);
        ctx.fill();
    }
    ctx.restore();

    // --- Shallow water shimmer over lower sand ---
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = hslToRgba(190, 60, 60, 1);
    for (let x = 0; x < w; x += 20) {
        const shimmerY = waterLine + 10 + Math.sin(x * 0.03 + t * 1.2) * 15;
        ctx.fillRect(x, waterLine + 5, 15, Math.max(0, shimmerY - waterLine));
    }
    ctx.restore();
}

export const meta = { version: '001', name: 'Beach', current: true, features: ['sky', 'ocean waves', 'shore foam', 'sandy floor', 'shells', 'water shimmer'] };
