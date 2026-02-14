/**
 * Hook.v002.js - Pendulum swing + bait (CURRENT IN GAME)
 * @version 002
 * @current true
 */
export function render(ctx, x, lineLen, time, swingAmount = 10) {
    const swingAngle = Math.sin(time * 0.03 * swingAmount / 10) * 0.4;
    const hookX = x + Math.sin(swingAngle) * 40;
    
    ctx.strokeStyle = '#666'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(hookX, lineLen - 15);
    ctx.stroke();
    
    ctx.strokeStyle = '#ccc'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hookX, lineLen - 15);
    ctx.lineTo(hookX, lineLen);
    ctx.arc(hookX - 8, lineLen, 8, 0, Math.PI, false);
    ctx.stroke();
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(hookX - 16, lineLen);
    ctx.lineTo(hookX - 22, lineLen - 6);
    ctx.lineTo(hookX - 14, lineLen - 2);
    ctx.fill();
}
export const meta = { version: '002', name: 'Pendulum', current: true, features: ['pendulum swing', 'bait'] };
