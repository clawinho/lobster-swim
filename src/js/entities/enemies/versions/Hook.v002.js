/**
 * Hook.v002.js - Fishing hook with pendulum swing
 * @version 002
 * @current true
 * 
 * @param {number} x - Anchor X position (top of line)
 * @param {number} lineLen - Length of fishing line
 * @param {number} swingOffset - Horizontal swing offset (calculated by game class)
 */
export function render(ctx, x, lineLen, swingOffset = 0) {
    const hookX = x + swingOffset;
    const hookY = lineLen;
    
    // Fishing line
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(hookX, hookY - 20);
    ctx.stroke();
    
    // Hook curve
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hookX, hookY - 20);
    ctx.lineTo(hookX, hookY);
    ctx.arc(hookX - 10, hookY, 10, 0, Math.PI, false);
    ctx.stroke();
    
    // Hook point
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(hookX - 20, hookY);
    ctx.lineTo(hookX - 25, hookY - 8);
    ctx.lineTo(hookX - 18, hookY - 3);
    ctx.fill();
    
    ctx.lineWidth = 1;
}

export const meta = { version: "002", name: "Pendulum Hook", current: true, features: ["fishing line", "curved hook", "sharp point"] };
