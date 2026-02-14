/**
 * Fork.v001.js - Kitchen fork (CURRENT IN GAME)
 * @version 001
 * @current true
 */
export function render(ctx, x, y, size = 40) {
    const scale = size / 40; // normalize to default size
    
    // Handle
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x - 4 * scale, y - 50 * scale, 8 * scale, 50 * scale);
    
    // Metal prongs
    ctx.fillStyle = "#c0c0c0";
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 10 * scale - 3 * scale, y);
        ctx.lineTo(x + i * 10 * scale + 3 * scale, y);
        ctx.lineTo(x + i * 10 * scale + 1 * scale, y + 35 * scale);
        ctx.lineTo(x + i * 10 * scale - 1 * scale, y + 35 * scale);
        ctx.closePath();
        ctx.fill();
    }
    
    // Shine
    ctx.fillStyle = "#ffffff44";
    ctx.fillRect(x - 2 * scale, y, 2 * scale, 30 * scale);
}

export const meta = { version: "001", name: "Kitchen Fork", current: true, features: ["wooden handle", "metal prongs", "shine"] };
