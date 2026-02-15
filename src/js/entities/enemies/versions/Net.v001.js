/**
 * Net.v001.js - Fishing net
 * @version 001
 * @current true
 */
export function render(ctx, x, y, width = 100, height = 60) {
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Net grid
    for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + i * height / 4);
        ctx.lineTo(x + width, y + i * height / 4);
        ctx.stroke();
        ctx.moveTo(x + i * width / 4, y);
        ctx.lineTo(x + i * width / 4, y + height);
        ctx.stroke();
    }

    ctx.lineWidth = 1;
}

export const meta = { version: "001", name: "Fishing Net", current: true, features: ["grid pattern", "rectangular"] };
