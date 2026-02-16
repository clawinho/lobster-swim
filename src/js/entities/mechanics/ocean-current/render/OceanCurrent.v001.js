/**
 * OceanCurrent.v001.js - Ocean current environmental effect
 * @version 001
 * @current true
 * 
 * Creates gentle currents that push the player and add visual water flow
 */

export function render(ctx, width, height, time, strength, angle) {
    // Draw flow lines to indicate current direction
    const lineCount = 8;
    const lineLength = 60;
    
    ctx.save();
    ctx.globalAlpha = 0.15 + Math.sin(time * 0.001) * 0.05;
    ctx.strokeStyle = '#4488aa';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < lineCount; i++) {
        // Stagger lines across screen
        const baseX = (time * strength * 0.5 + i * (width / lineCount)) % (width + lineLength) - lineLength;
        const baseY = height * 0.2 + (i % 3) * height * 0.3;
        
        // Wavy offset
        const waveOffset = Math.sin(time * 0.002 + i) * 30;
        
        ctx.beginPath();
        ctx.moveTo(baseX, baseY + waveOffset);
        
        // Draw curved line following current
        const endX = baseX + Math.cos(angle) * lineLength;
        const endY = baseY + waveOffset + Math.sin(angle) * lineLength;
        const midX = (baseX + endX) / 2;
        const midY = (baseY + waveOffset + endY) / 2 + Math.sin(time * 0.003 + i * 0.5) * 10;
        
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.stroke();
    }
    
    ctx.restore();
}

export const meta = {
    version: "001",
    name: "Ocean Current",
    current: true,
    features: ["visual-flow-lines", "directional-push"]
};
