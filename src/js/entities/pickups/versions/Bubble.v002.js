/**
 * Bubble.v002.js - Gradient + wobble + shine
 * @version 002
 * @current true
 * 
 * Color presets:
 * - "blue": default ocean bubble (hue ~210)
 * - "pink": bright pink (hue ~320)
 * - or pass a hue number (0-360)
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
    // Resolve color to hue
    let hue = typeof color === "number" ? color : (COLOR_PRESETS[color] ?? 210);
    
    const wobble = Math.sin(time * 0.1) * 2;
    const wobbleY = y + wobble;
    
    const gradient = ctx.createRadialGradient(
        x - size * 0.3, wobbleY - size * 0.3, 0,
        x, wobbleY, size
    );
    
    // Generate colors based on hue
    gradient.addColorStop(0, hslToRgba(hue, 70, 85, 0.9));
    gradient.addColorStop(0.5, hslToRgba(hue, 80, 60, 0.5));
    gradient.addColorStop(1, hslToRgba(hue, 70, 35, 0.3));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, wobbleY, size, 0, Math.PI * 2);
    ctx.fill();
    
    // White shine highlight
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(x - size * 0.3, wobbleY - size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
}

export const meta = { 
    version: "002", 
    name: "Gradient Wobble", 
    current: true,
    features: ["gradient", "wobble", "shine highlight", "color parameter"],
    colorPresets: Object.keys(COLOR_PRESETS)
};
