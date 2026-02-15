/**
 * Bubble.v001.js - Simple solid bubble
 * @version 001
 */
import { hslToRgba, resolveHue } from "../../utils/colors.js";

export function render(ctx, x, y, size, time, color = "blue") {
    const hue = resolveHue(color);
    
    ctx.fillStyle = hslToRgba(hue, 70, 70, 0.6);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
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
