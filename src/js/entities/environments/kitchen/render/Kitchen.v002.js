/**
 * Kitchen.v002.js - Rich kitchen background with counter, tiles, shelf, steam, utensils
 * @version 002
 * @current true
 */

import { hslToRgba } from '../../../utils/colors.js';

export function render(ctx, w, h) {
    const t = Date.now() / 1000;

    // --- Tile wall ---
    ctx.save();
    const tileSize = 50;
    for (let tx = 0; tx < w; tx += tileSize) {
        for (let ty = 0; ty < 500; ty += tileSize) {
            // Alternating tile shades
            const shade = ((tx / tileSize + ty / tileSize) % 2 === 0) ? 92 : 88;
            ctx.fillStyle = hslToRgba(0, 0, shade, 0.08);
            ctx.fillRect(tx, ty, tileSize, tileSize);
        }
    }
    // Grout lines
    ctx.strokeStyle = hslToRgba(0, 0, 60, 0.1);
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += tileSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 500); ctx.stroke();
    }
    for (let y = 0; y <= 500; y += tileSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.restore();

    // --- Shelf with items (top area) ---
    ctx.fillStyle = hslToRgba(25, 40, 30, 0.5);
    ctx.fillRect(50, 60, 200, 8);
    // Bottles on shelf
    const bottles = [
        { x: 80, h: 35, hue: 120, s: 40 },
        { x: 120, h: 28, hue: 0, s: 50 },
        { x: 170, h: 40, hue: 30, s: 30 },
    ];
    for (const b of bottles) {
        ctx.fillStyle = hslToRgba(b.hue, b.s, 35, 0.4);
        ctx.fillRect(b.x - 8, 60 - b.h, 16, b.h);
        // Cap
        ctx.fillStyle = hslToRgba(b.hue, b.s, 25, 0.5);
        ctx.fillRect(b.x - 4, 60 - b.h - 5, 8, 5);
    }

    // --- Hanging utensils (right side) ---
    ctx.save();
    ctx.globalAlpha = 0.3;
    const utensilX = w - 100;
    // Ladle
    ctx.strokeStyle = hslToRgba(0, 0, 55, 1);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(utensilX, 40);
    ctx.lineTo(utensilX, 90);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(utensilX, 98, 10, 0, Math.PI);
    ctx.stroke();
    // Spatula
    ctx.beginPath();
    ctx.moveTo(utensilX + 30, 40);
    ctx.lineTo(utensilX + 30, 80);
    ctx.stroke();
    ctx.fillStyle = hslToRgba(0, 0, 50, 0.4);
    ctx.fillRect(utensilX + 23, 80, 14, 25);
    ctx.restore();

    // --- Wooden counter with grain ---
    const counterGrad = ctx.createLinearGradient(0, 490, 0, h);
    counterGrad.addColorStop(0, hslToRgba(25, 55, 32, 1));
    counterGrad.addColorStop(0.15, hslToRgba(25, 50, 28, 1));
    counterGrad.addColorStop(1, hslToRgba(20, 45, 20, 1));
    ctx.fillStyle = counterGrad;
    ctx.fillRect(0, 490, w, h - 490);

    // Counter edge highlight
    ctx.strokeStyle = hslToRgba(30, 40, 40, 0.4);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 492);
    ctx.lineTo(w, 492);
    ctx.stroke();

    // Wood grain lines
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = hslToRgba(20, 40, 20, 1);
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        const gy = 500 + i * 12;
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
            const y = gy + Math.sin(x * 0.03 + i) * 2;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();

    // --- Steam wisps ---
    ctx.save();
    ctx.globalAlpha = 0.06;
    for (let i = 0; i < 4; i++) {
        const sx = 150 + i * 160;
        const sPhase = t * 0.5 + i * 2;
        const sy = 460 - ((t * 15 + i * 40) % 200);
        ctx.fillStyle = hslToRgba(0, 0, 95, 1);
        ctx.beginPath();
        ctx.ellipse(sx + Math.sin(sPhase) * 15, sy, 12 + Math.sin(sPhase * 0.7) * 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

export const meta = { version: '002', name: 'The Kitchen — Detailed', current: true, features: ['tile wall', 'shelf', 'utensils', 'wood grain', 'steam'] };
