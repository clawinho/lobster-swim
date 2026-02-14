/**
 * Fork.v001.js - Kitchen fork (CURRENT IN GAME)
 * @version 001
 * @current true
 */
export function render(ctx, x, y, size = 40) {
    // Handle
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x - 4, y - 50, 8, 50);
    
    // Metal prongs
    ctx.fillStyle = "#c0c0c0";
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 10 - 3, y);
        ctx.lineTo(x + i * 10 + 3, y);
        ctx.lineTo(x + i * 10 + 1, y + 35);
        ctx.lineTo(x + i * 10 - 1, y + 35);
        ctx.closePath();
        ctx.fill();
    }
    
    // Shine
    ctx.fillStyle = "#ffffff44";
    ctx.fillRect(x - 2, y, 2, 30);
}

export const meta = { version: "001", name: "Kitchen Fork", current: true, features: ["wooden handle", "metal prongs", "shine"] };
