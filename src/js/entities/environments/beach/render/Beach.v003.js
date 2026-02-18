/**
 * Beach.v003.js - Progressive Beach: water gets shallower as lobster approaches shore
 * progress 0.0 = deep water (same as v002), progress 1.0 = on the beach, no water
 * Scrolls right-to-left to simulate swimming toward shore
 * @version 003
 * @current true
 */

import { hslToRgba } from '../../../utils/colors.js';

export function render(ctx, w, h, scrollX, progress) {
    // progress: 0 (deep underwater) → 1 (on dry beach)
    const p = Math.max(0, Math.min(1, progress || 0));
    const t = Date.now() / 1000;

    // --- Key zones that shift with progress ---
    // Surface line moves DOWN as we surface (more sky visible)
    const surfaceLine = h * (0.25 + p * 0.45); // 0.25 → 0.70
    // Water alpha fades out as we reach shore
    const waterAlpha = 1 - p * 0.9; // 1.0 → 0.1
    // Sand rises dramatically
    const sandBaseLeft = h * (0.85 - p * 0.55);  // 0.85 → 0.30
    const sandBaseRight = h * (0.55 - p * 0.35);  // 0.55 → 0.20

    // --- Sky (increasingly visible as we surface) ---
    const skyAlpha = 0.45 + p * 0.55; // 0.45 → 1.0
    ctx.save();
    const skyGrad = ctx.createLinearGradient(0, 0, 0, surfaceLine);
    skyGrad.addColorStop(0, hslToRgba(205, 70, 78, 1));
    skyGrad.addColorStop(0.5, hslToRgba(200, 60, 70, 1));
    skyGrad.addColorStop(1, hslToRgba(195, 50, 65, 1));
    ctx.globalAlpha = skyAlpha;
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, surfaceLine + 10);
    ctx.restore();

    // Sun (visible when p > 0.3)
    if (p > 0.3) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.3) * 2);
        const sunX = w * 0.75;
        const sunY = h * 0.08;
        const sunR = 30 + p * 15;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR * 2);
        sunGrad.addColorStop(0, hslToRgba(45, 100, 90, 0.8));
        sunGrad.addColorStop(0.5, hslToRgba(45, 90, 80, 0.3));
        sunGrad.addColorStop(1, hslToRgba(45, 80, 70, 0));
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * 2, 0, Math.PI * 2);
        ctx.fill();
        // Sun core
        ctx.fillStyle = hslToRgba(48, 100, 95, 1);
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // --- Underwater fill (fades as we surface) ---
    if (waterAlpha > 0.05) {
        ctx.save();
        ctx.globalAlpha = waterAlpha;
        const waterGrad = ctx.createLinearGradient(0, surfaceLine, 0, h);
        waterGrad.addColorStop(0, hslToRgba(195, 55, 55, 1));
        waterGrad.addColorStop(0.5, hslToRgba(200, 60, 40, 1));
        waterGrad.addColorStop(1, hslToRgba(195, 50, 30, 1));
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, surfaceLine, w, h - surfaceLine);
        ctx.restore();
    }

    // --- Water surface line (wobbly, fades near end) ---
    if (p < 0.85) {
        ctx.save();
        ctx.globalAlpha = (0.35 - p * 0.3) * Math.min(1, (0.85 - p) * 5);
        ctx.fillStyle = hslToRgba(180, 40, 85, 1);
        ctx.beginPath();
        ctx.moveTo(0, surfaceLine - 8);
        for (let x = 0; x <= w; x += 3) {
            const waveSize = 6 * (1 - p * 0.5);
            const y = surfaceLine + Math.sin(x * 0.015 + t * 2.0) * waveSize
                                  + Math.sin(x * 0.04 + t * 3.2) * (waveSize * 0.5);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(w, surfaceLine + 20);
        ctx.lineTo(0, surfaceLine + 20);
        ctx.closePath();
        ctx.fill();

        // Foam at surface
        ctx.globalAlpha = 0.2 * (1 - p);
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
    }

    // --- Crashing waves (stronger as we get closer) ---
    if (p < 0.9) {
        ctx.save();
        const waveCycle = (Math.sin(t * 0.8) + 1) / 2;
        const waveIntensity = 0.12 + p * 0.15; // stronger near shore
        ctx.globalAlpha = waveIntensity * waveCycle * (1 - p * 0.8);
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
    }

    // --- God rays (fade as we surface) ---
    if (p < 0.6) {
        ctx.save();
        ctx.globalAlpha = 0.04 * (1 - p * 1.5);
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
    }

    // --- Sandy floor (rises dramatically with progress) ---
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, sandBaseLeft);
    for (let x = 0; x <= w; x += 3) {
        const slope = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (x / w);
        const ripple = Math.sin(x * 0.03 + t * 0.5 + (scrollX || 0) * 0.01) * (3 - p * 2);
        ctx.lineTo(x, slope + ripple);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    // Sand color — drier (lighter) as we surface
    const sandLightness = 65 + p * 15; // 65 → 80
    const sandSat = 65 - p * 15;       // 65 → 50
    const sandGrad = ctx.createLinearGradient(0, sandBaseRight - 20, 0, h);
    sandGrad.addColorStop(0, hslToRgba(48, sandSat, sandLightness, 1));
    sandGrad.addColorStop(0.4, hslToRgba(44, sandSat - 10, sandLightness - 10, 1));
    sandGrad.addColorStop(1, hslToRgba(38, sandSat - 20, sandLightness - 20, 1));
    ctx.fillStyle = sandGrad;
    ctx.fill();
    ctx.restore();

    // Sand texture
    ctx.save();
    ctx.globalAlpha = 0.15 + p * 0.1;
    for (let i = 0; i < 60; i++) {
        const sx = (i * 31.7 + (scrollX || 0) * 0.02) % w;
        const sandY = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (sx / w);
        const sy = sandY + 8 + (i * 19.3) % Math.max(5, h - sandY - 5);
        if (sy > h) continue;
        const ss = 1 + (i % 3);
        ctx.fillStyle = hslToRgba(40, 30, 50 + (i % 5) * 6, 1);
        ctx.beginPath();
        ctx.arc(sx, sy, ss, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // Shells
    ctx.save();
    ctx.globalAlpha = 0.3 + p * 0.2;
    for (let i = 0; i < 5 + Math.floor(p * 5); i++) {
        const shx = (40 + (i * 170) + (scrollX || 0) * 0.03) % (w - 80) + 40;
        const sandY = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (shx / w);
        const shy = sandY + 10 + (i * 23) % 30;
        if (shy > h - 5) continue;
        ctx.fillStyle = hslToRgba(20 + i * 18, 35, 72, 1);
        ctx.beginPath();
        ctx.arc(shx, shy, 4 + (i % 2), 0, Math.PI);
        ctx.fill();
    }
    ctx.restore();

    // Seaweed (fades as water recedes)
    if (p < 0.7) {
        ctx.save();
        ctx.globalAlpha = 0.4 * (1 - p * 1.2);
        for (let i = 0; i < 7; i++) {
            const swx = 30 + (i * 120) % (w - 60);
            const sandY = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (swx / w);
            const swy = sandY + 2;
            const sway = Math.sin(t * 1.5 + i * 1.7) * 6 * (1 - p);
            ctx.strokeStyle = hslToRgba(120, 50, 30 + (i % 3) * 8, 1);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(swx, swy);
            ctx.quadraticCurveTo(swx + sway, swy - 20 - (i % 3) * 8, swx + sway * 0.5, swy - 30 - (i % 3) * 10);
            ctx.stroke();
        }
        ctx.restore();
    }

    // --- Beach elements (appear as we near shore) ---
    if (p > 0.5) {
        const beachAlpha = (p - 0.5) * 2; // 0→1 over last half

        // Beach umbrella
        ctx.save();
        ctx.globalAlpha = beachAlpha * 0.6;
        const umbX = w * 0.3 + Math.sin(scrollX * 0.005) * 20;
        const umbSandY = sandBaseLeft + (sandBaseRight - sandBaseLeft) * (umbX / w);
        const umbY = umbSandY - 5;
        // Pole
        ctx.strokeStyle = hslToRgba(30, 40, 50, 1);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(umbX, umbY);
        ctx.lineTo(umbX, umbY - 40);
        ctx.stroke();
        // Canopy
        ctx.fillStyle = hslToRgba(0, 70, 55, 1);
        ctx.beginPath();
        ctx.arc(umbX, umbY - 40, 25, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = hslToRgba(45, 80, 70, 1);
        ctx.beginPath();
        ctx.arc(umbX, umbY - 40, 25, Math.PI, Math.PI + Math.PI / 3);
        ctx.arc(umbX, umbY - 40, 25, Math.PI + (2 * Math.PI / 3), 0);
        ctx.fill();
        ctx.restore();
    }

    // Floating particles in water (fade with water)
    if (p < 0.8) {
        ctx.save();
        ctx.globalAlpha = 0.1 * (1 - p);
        for (let i = 0; i < 20; i++) {
            const px = (i * 47.1 + t * 8 + (scrollX || 0) * 0.05) % w;
            const minY = surfaceLine + 30;
            const maxY = sandBaseLeft - 10;
            if (maxY <= minY) continue;
            const py = minY + (i * 33.7) % (maxY - minY);
            ctx.fillStyle = hslToRgba(45, 40, 70, 1);
            ctx.beginPath();
            ctx.arc(px, py, 1 + (i % 2), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

export const meta = {
    version: '003',
    name: 'Beach — Progressive Shore Approach',
    current: true,
    features: ['progressive depth', 'water recedes with progress', 'sky expands', 'sand rises', 'beach elements appear', 'scrolling parallax', 'sun appears']
};
