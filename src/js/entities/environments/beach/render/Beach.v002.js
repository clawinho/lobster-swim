/**
 * Beach.v002.js - Beach: underwater camera looking toward shore
 * Top: sky visible through water surface with crashing waves
 * Middle: waterline with wave distortion and foam
 * Bottom: shallow sea with yellow sand floor sloping up left→right
 * @version 002
 * @current true
 */

import { hslToRgba } from '../../../utils/colors.js';

export function render(ctx, w, h, scrollX) {
    const t = Date.now() / 1000;

    // Key zones
    const surfaceLine = h * 0.25;   // Water surface (seen from below)
    const sandBaseLeft = h * 0.85;  // Sand floor left side (deeper)
    const sandBaseRight = h * 0.55; // Sand floor right side (shallower, slopes up)

    // --- Underwater background (full canvas) ---
    const waterGrad = ctx.createLinearGradient(0, 0, 0, h);
    waterGrad.addColorStop(0, hslToRgba(195, 55, 55, 1));   // Lighter near surface
    waterGrad.addColorStop(0.3, hslToRgba(200, 60, 40, 1));  // Mid water
    waterGrad.addColorStop(1, hslToRgba(195, 50, 30, 1));    // Darker near floor
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, w, h);

    // --- Sky seen through water surface (distorted, refracted) ---
    ctx.save();
    ctx.globalAlpha = 0.45;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, surfaceLine);
    skyGrad.addColorStop(0, hslToRgba(205, 70, 78, 1));
    skyGrad.addColorStop(1, hslToRgba(200, 50, 65, 1));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, surfaceLine + 10);
    ctx.restore();

    // --- Water surface from below: wobbly, bright refraction line ---
    ctx.save();
    // Bright refraction band
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = hslToRgba(180, 40, 85, 1);
    ctx.beginPath();
    ctx.moveTo(0, surfaceLine - 8);
    for (let x = 0; x <= w; x += 3) {
        const y = surfaceLine + Math.sin(x * 0.015 + t * 2.0) * 6
                              + Math.sin(x * 0.04 + t * 3.2) * 3;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, surfaceLine + 20);
    ctx.lineTo(0, surfaceLine + 20);
    ctx.closePath();
    ctx.fill();

    // Foam/bubbles at surface
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 25; i++) {
        const bx = (i * 37.3 + t * 15 + (scrollX || 0) * 0.1) % (w + 40) - 20;
        const by = surfaceLine + Math.sin(i * 2.1 + t * 1.5) * 8 - 2;
        const br = 1.5 + (i % 3) * 1.2;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // --- Crashing wave effect (periodic white wash from above) ---
    ctx.save();
    const waveCycle = (Math.sin(t * 0.8) + 1) / 2; // 0→1 pulse
    ctx.globalAlpha = 0.12 * waveCycle;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(0, surfaceLine - 5);
    for (let x = 0; x <= w; x += 4) {
        const y = surfaceLine + Math.sin(x * 0.01 + t * 1.5) * 10
                              + Math.sin(x * 0.035 + t * 2.8) * 5;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, surfaceLine + 40);
    ctx.lineTo(0, surfaceLine + 40);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // --- Light rays from surface (god rays underwater) ---
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 6; i++) {
        const rx = (i * 140 + 50) % w;
        const rw = 30 + Math.sin(t * 0.5 + i) * 15;
        const rayGrad = ctx.createLinearGradient(rx, surfaceLine, rx + rw * 0.5, h * 0.7);
        rayGrad.addColorStop(0, hslToRgba(55, 80, 90, 1));
        rayGrad.addColorStop(1, hslToRgba(55, 80, 90, 0));
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rx - rw / 2, surfaceLine);
        ctx.lineTo(rx + rw / 2, surfaceLine);
        ctx.lineTo(rx + rw * 0.8 + Math.sin(t * 0.3 + i) * 10, h * 0.7);
        ctx.lineTo(rx - rw * 0.3 + Math.sin(t * 0.3 + i) * 10, h * 0.7);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    // --- Sandy floor sloping up left→right ---
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, sandBaseLeft);
    // Slope from left (deep) to right (shallow) with gentle undulation
    for (let x = 0; x <= w; x += 3) {
        const slope = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (x / w);
        const ripple = Math.sin(x * 0.03 + t * 0.5) * 3;
        ctx.lineTo(x, slope + ripple);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    // Sand gradient
    const sandGrad = ctx.createLinearGradient(0, sandBaseRight - 20, 0, h);
    sandGrad.addColorStop(0, hslToRgba(48, 65, 65, 1));  // Bright yellow sand
    sandGrad.addColorStop(0.4, hslToRgba(44, 55, 55, 1));
    sandGrad.addColorStop(1, hslToRgba(38, 45, 45, 1));   // Darker at bottom
    ctx.fillStyle = sandGrad;
    ctx.fill();
    ctx.restore();

    // Sand texture — small dots and pebbles
    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 60; i++) {
        const sx = (i * 31.7) % w;
        const sandY = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (sx / w);
        const sy = sandY + 8 + (i * 19.3) % (h - sandY - 5);
        if (sy > h) continue;
        const ss = 1 + (i % 3);
        ctx.fillStyle = hslToRgba(40, 30, 50 + (i % 5) * 6, 1);
        ctx.beginPath();
        ctx.arc(sx, sy, ss, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // Shells on the sand
    ctx.save();
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 5; i++) {
        const shx = 40 + (i * 170) % (w - 80);
        const sandY = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (shx / w);
        const shy = sandY + 10 + (i * 23) % 30;
        if (shy > h - 5) continue;
        ctx.fillStyle = hslToRgba(20 + i * 18, 35, 72, 1);
        ctx.beginPath();
        ctx.arc(shx, shy, 4 + (i % 2), 0, Math.PI);
        ctx.fill();
    }
    ctx.restore();

    // --- Seaweed tufts on sand ---
    ctx.save();
    ctx.globalAlpha = 0.4;
    for (let i = 0; i < 7; i++) {
        const swx = 30 + (i * 120) % (w - 60);
        const sandY = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (swx / w);
        const swy = sandY + 2;
        const sway = Math.sin(t * 1.5 + i * 1.7) * 6;
        ctx.strokeStyle = hslToRgba(120, 50, 30 + (i % 3) * 8, 1);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(swx, swy);
        ctx.quadraticCurveTo(swx + sway, swy - 20 - (i % 3) * 8, swx + sway * 0.5, swy - 30 - (i % 3) * 10);
        ctx.stroke();
    }
    ctx.restore();

    // --- Floating particles / suspended sand in water ---
    ctx.save();
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 20; i++) {
        const px = (i * 47.1 + t * 8 + (scrollX || 0) * 0.05) % w;
        const py = surfaceLine + 30 + (i * 33.7) % (sandBaseLeft - surfaceLine - 50);
        ctx.fillStyle = hslToRgba(45, 40, 70, 1);
        ctx.beginPath();
        ctx.arc(px, py, 1 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

export const meta = {
    version: '002',
    name: 'Beach — Underwater View',
    current: true,
    features: ['underwater camera', 'refracted sky', 'crashing waves from below', 'god rays', 'sloping sand bank L→R', 'seaweed', 'suspended particles']
};
