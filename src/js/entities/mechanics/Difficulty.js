/**
 * Difficulty.js - Difficulty scaling graph renderer
 */
export function render(ctx, w, h) {
    ctx.fillStyle = "#000810";
    ctx.fillRect(0, 0, w, h);
    
    // Axes
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(30, h - 20);
    ctx.lineTo(w - 20, h - 20);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = "#666";
    ctx.font = "10px monospace";
    ctx.fillText("diff", 35, 25);
    ctx.fillText("score", w - 45, h - 8);
    
    // Difficulty curve
    ctx.strokeStyle = "#ff4500";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, h - 25);
    
    const points = [
        [0, 1.0],
        [100, 1.2],
        [200, 1.4],
        [500, 1.6],
        [1000, 2.0]
    ];
    
    points.forEach(([score, mult]) => {
        const x = 30 + (score / 1000) * (w - 50);
        const y = h - 25 - (mult - 1) * (h - 50);
        ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Points
    ctx.fillStyle = "#ff4500";
    points.forEach(([score, mult]) => {
        const x = 30 + (score / 1000) * (w - 50);
        const y = h - 25 - (mult - 1) * (h - 50);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.lineWidth = 1;
}

export const meta = { name: "Difficulty Scaling", description: "Speed scales with score" };
