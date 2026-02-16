/**
 * Magnetism.js - Bubble magnetism demo renderer
 */
export function render(ctx, w, h, t, radius = 80, strength = 3) {
    ctx.fillStyle = "#000810";
    ctx.fillRect(0, 0, w, h);
    
    const cx = w / 2, cy = h / 2;
    
    // Magnet radius indicator
    ctx.strokeStyle = "rgba(100,200,255,0.3)";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Orbiting bubbles
    for (let i = 0; i < 5; i++) {
        const angle = t * 0.02 + i * (Math.PI * 2 / 5);
        const dist = (radius * 0.6) + Math.sin(t * 0.02 * strength + i) * 15;
        const bx = cx + Math.cos(angle) * dist;
        const by = cy + Math.sin(angle) * dist;
        
        ctx.fillStyle = "rgba(100,180,255,0.6)";
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Connection line
        ctx.strokeStyle = "rgba(100,200,255,0.2)";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(bx, by);
        ctx.stroke();
    }
    
    // Center lobster dot
    ctx.fillStyle = "#ff4500";
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
}

export const meta = { name: "Bubble Magnetism", description: "Bubbles attracted within radius" };
