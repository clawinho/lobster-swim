/**
 * Invincibility.js - Invincibility shield demo renderer
 */
export function render(ctx, w, h, t, dur = 120) {
    ctx.fillStyle = "#000810";
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2, cy = h / 2;
    
    // Flashing lobster
    const flash = Math.floor(t / 5) % 2;
    ctx.globalAlpha = flash ? 1 : 0.4;
    ctx.fillStyle = "#ff4500";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 25, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Pulsing shield
    ctx.strokeStyle = "#ffff0066";
    ctx.lineWidth = 3;
    const pulse = 1 + Math.sin(t * 0.1) * 0.1;
    ctx.beginPath();
    ctx.arc(cx, cy, 35 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    
    // Duration bar
    const progress = (t % dur) / dur;
    ctx.fillStyle = "#333";
    ctx.fillRect(w * 0.2, h - 20, w * 0.6, 8);
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(w * 0.2, h - 20, w * 0.6 * (1 - progress), 8);
}

export const meta = { name: "Invincibility", description: "Shield + flash on spawn/damage" };
