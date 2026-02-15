/**
 * colors.js - Shared color utilities
 * Single source of truth for color presets and conversion
 */

export const COLOR_PRESETS = {
    blue: 210,
    pink: 320,
    green: 140,
    gold: 45
};

/**
 * Convert HSL to RGBA string
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @param {number} a - Alpha (0-1)
 * @returns {string} rgba() color string
 */
export function hslToRgba(h, s, l, a) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const f = n => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return `rgba(${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)}, ${a})`;
}

/**
 * Resolve color to hue value
 * @param {string|number} color - Preset name or hue number
 * @param {number} fallback - Default hue if not found
 * @returns {number} Hue value 0-360
 */
export function resolveHue(color, fallback = 210) {
    if (typeof color === "number") return color;
    return COLOR_PRESETS[color] ?? fallback;
}
