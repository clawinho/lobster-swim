/**
 * Bubble.v002.js - Gradient + wobble + shine
 * @version 002
 * @current true
 */
import { hslToRgba, resolveHue, COLOR_PRESETS } from "../../utils/colors.js";

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @param {number} time - Animation frame/time
 * @param {string|number} color - Preset name or hue
 * @param {boolean} inRange - Whether player is in magnet range (brighter glow)
 */
export function render(ctx, x, y, size, time, color = "blue", inRange = false) {
    const hue = resolveHue(color);
    
    const wobble = Math.sin(time * 0.1) * 2;
    const wobbleY = y + wobble;
    
    const gradient = ctx.createRadialGradient(
        x - size * 0.3, wobbleY - size * 0.3, 0,
        x, wobbleY, size
    );
    
    if (inRange) {
        // Brighter when in magnet range
        gradient.addColorStop(0, hslToRgba(hue, 80, 88, 0.95));
        gradient.addColorStop(0.5, hslToRgba(hue, 85, 65, 0.7));
        gradient.addColorStop(1, hslToRgba(hue, 75, 45, 0.4));
    } else {
        gradient.addColorStop(0, hslToRgba(hue, 70, 80, 0.9));
        gradient.addColorStop(0.5, hslToRgba(hue, 80, 58, 0.5));
        gradient.addColorStop(1, hslToRgba(hue, 70, 35, 0.3));
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, wobbleY, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Shine highlight
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(x - size * 0.3, wobbleY - size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Magnet range indicator ring
    if (inRange) {
        ctx.strokeStyle = hslToRgba(hue, 70, 70, 0.4);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, wobbleY, size + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
    }
}

export const meta = { 
    version: "002", 
    name: "Gradient Wobble", 
    current: true,
    features: ["gradient", "wobble", "shine", "color param", "inRange glow"],
    colorPresets: Object.keys(COLOR_PRESETS)
};
