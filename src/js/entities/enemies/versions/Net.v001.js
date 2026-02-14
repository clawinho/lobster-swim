/**
 * Net.v001.js - Fishing net (CURRENT IN GAME)
 * @version 001
 * @current true
 */
export function render(ctx, x, y, width = 80) {
    ctx.strokeStyle = "#446688";
    ctx.lineWidth = 2;
    for (let r = 0; r <= 4; r++) {
        ctx.beginPath();
        ctx.moveTo(x - width/2, y - 30 + r * 15);
        ctx.lineTo(x + width/2, y - 30 + r * 15);
        ctx.stroke();
    }
    for (let c = 0; c <= 5; c++) {
        ctx.beginPath();
        ctx.moveTo(x - width/2 + c * (width/5), y - 30);
        ctx.lineTo(x - width/2 + c * (width/5), y + 30);
        ctx.stroke();
    }
    ctx.strokeStyle = "#886644";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.lineTo(x, y - 60);
    ctx.stroke();
    ctx.lineWidth = 1;
}

export const meta = { version: "001", name: "Fishing Net", current: true, features: ["grid pattern", "handle"] };
