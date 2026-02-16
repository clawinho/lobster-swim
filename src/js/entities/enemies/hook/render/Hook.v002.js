/**
 * Hook.v002.js - Pendulum swing + bait (CURRENT IN GAME)
 * @version 002
 * @current true
 */
export function render(ctx, anchorX, hookX, hookY) {
    // Fishing line
    ctx.strokeStyle = '#666'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(anchorX, 0);
    ctx.lineTo(hookX, hookY - 15);
    ctx.stroke();

    // Hook curve
    ctx.strokeStyle = '#ccc'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hookX, hookY - 15);
    ctx.lineTo(hookX, hookY);
    ctx.arc(hookX - 8, hookY, 8, 0, Math.PI, false);
    ctx.stroke();

    // Hook point
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(hookX - 16, hookY);
    ctx.lineTo(hookX - 22, hookY - 6);
    ctx.lineTo(hookX - 14, hookY - 2);
    ctx.fill();

    ctx.lineWidth = 1;
}
export const meta = { version: '002', name: 'Pendulum', current: true, features: ['pendulum swing', 'bait'] };
