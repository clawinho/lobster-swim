/**
 * Bubble.v001.js - Simple solid bubble
 * @version 001
 */

const COLOR_PRESETS = {
    blue: 210,
    pink: 320,
    green: 140,
    gold: 45
};

function hslToRgba(h, s, l, a) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const f = n => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return `rgba(${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)}, ${a})`;
}

export function render(ctx, x, y, size, time, color = "blue") {
    let hue = typeof color === "number" ? color : (COLOR_PRESETS[color] ?? 210);
    
    ctx.fillStyle = hslToRgba(hue, 70, 70, 0.6);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Simple shine
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
}

export const meta = { 
    version: "001", 
    name: "Simple Solid", 
    features: ["basic circle", "color parameter"]
};
