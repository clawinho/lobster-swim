/**
 * Seagull.v001.js - Diving seagull enemy
 * @version 001
 * @current true
 */

export function render(ctx, x, y, wingPhase = 0, diving = false) {
    ctx.save();
    ctx.translate(x, y);
    
    // Body (white/gray seagull)
    ctx.fillStyle = diving ? "#e8e8e8" : "#f5f5f5";
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wings with flapping animation
    const wingY = Math.sin(wingPhase) * (diving ? 3 : 8);
    const wingAngle = diving ? 0.3 : Math.sin(wingPhase) * 0.4;
    
    // Left wing
    ctx.fillStyle = "#d0d0d0";
    ctx.save();
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.quadraticCurveTo(-30, -5 + wingY, -35, 5 + wingY);
    ctx.quadraticCurveTo(-25, 2, -10, 3);
    ctx.fill();
    ctx.restore();
    
    // Right wing
    ctx.save();
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.quadraticCurveTo(30, -5 + wingY, 35, 5 + wingY);
    ctx.quadraticCurveTo(25, 2, 10, 3);
    ctx.fill();
    ctx.restore();
    
    // Head
    ctx.fillStyle = "#f5f5f5";
    ctx.beginPath();
    ctx.arc(-15, -5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak (orange/yellow)
    ctx.fillStyle = "#ff9933";
    ctx.beginPath();
    ctx.moveTo(-22, -5);
    ctx.lineTo(-32, -3);
    ctx.lineTo(-22, -2);
    ctx.closePath();
    ctx.fill();
    
    // Eye (beady black)
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-17, -7, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Tail feathers
    ctx.fillStyle = "#c0c0c0";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(25, -3);
    ctx.lineTo(28, 0);
    ctx.lineTo(25, 3);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

export const meta = { 
    version: "001", 
    name: "Diving Seagull", 
    current: true,
    features: ["wing flap animation", "dive pose", "beach shallows enemy"]
};
