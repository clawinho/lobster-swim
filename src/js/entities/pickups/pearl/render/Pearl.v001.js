/**
 * Pearl.v001.js - Magical pearl that grants invincibility
 * @version 001
 * @current true
 * 
 * A shimmering pearl inside an oyster shell. When collected,
 * grants temporary invincibility. Rare spawn, strategic value.
 */

import { hslToRgba } from '../../../utils/colors.js';

export function render(ctx, x, y, time = 0, size = 20) {
    const t = time * 0.05;
    
    // Glow effect
    const glowPulse = 0.5 + Math.sin(t * 2) * 0.3;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    gradient.addColorStop(0, `rgba(255, 255, 200, ${glowPulse * 0.4})`);
    gradient.addColorStop(0.5, `rgba(255, 200, 255, ${glowPulse * 0.2})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Oyster shell - bottom half
    ctx.save();
    ctx.translate(x, y);
    const shellOpen = Math.sin(t) * 0.15 + 0.3; // Slightly open, pulsing
    
    // Bottom shell
    ctx.fillStyle = '#8b7355';
    ctx.beginPath();
    ctx.ellipse(0, size * 0.3, size * 1.2, size * 0.6, 0, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#6b5344';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Shell ridges
    for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size * 0.3, size * 0.3);
        ctx.lineTo(i * size * 0.2, size * 0.8);
        ctx.strokeStyle = 'rgba(107, 83, 68, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Top shell (hinged open)
    ctx.save();
    ctx.translate(0, -size * 0.1);
    ctx.rotate(-shellOpen);
    ctx.fillStyle = '#9b8365';
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.2, size * 1.1, size * 0.5, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7b6354';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    
    // The pearl!
    const pearlY = -size * 0.1;
    const pearlSize = size * 0.5;
    
    // Pearl base
    const pearlGrad = ctx.createRadialGradient(
        x - pearlSize * 0.3, pearlY - pearlSize * 0.3, 0,
        0, pearlY, pearlSize
    );
    pearlGrad.addColorStop(0, '#ffffff');
    pearlGrad.addColorStop(0.3, '#ffeef8');
    pearlGrad.addColorStop(0.6, '#e0d0e8');
    pearlGrad.addColorStop(1, '#c0b0d0');
    
    ctx.fillStyle = pearlGrad;
    ctx.beginPath();
    ctx.arc(0, pearlY, pearlSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Pearl shimmer
    const shimmerAngle = t * 3;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(shimmerAngle) * 0.3})`;
    ctx.beginPath();
    ctx.arc(-pearlSize * 0.3, pearlY - pearlSize * 0.3, pearlSize * 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    // Rainbow iridescence
    const iridHue = (time * 2) % 360;
    ctx.fillStyle = hslToRgba(iridHue, 50, 70, 0.2);
    ctx.beginPath();
    ctx.arc(pearlSize * 0.2, pearlY + pearlSize * 0.2, pearlSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Sparkles around
    for (let i = 0; i < 3; i++) {
        const sparkAngle = t * 2 + i * (Math.PI * 2 / 3);
        const sparkDist = size * 1.5 + Math.sin(t * 3 + i) * 5;
        const sparkX = Math.cos(sparkAngle) * sparkDist;
        const sparkY = Math.sin(sparkAngle) * sparkDist * 0.6;
        const sparkAlpha = 0.5 + Math.sin(t * 4 + i * 2) * 0.4;
        
        ctx.fillStyle = `rgba(255, 255, 200, ${sparkAlpha})`;
        ctx.beginPath();
        ctx.arc(x + sparkX, y + sparkY, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

export const meta = {
    version: '001',
    name: 'Magic Pearl',
    current: true,
    features: ['invincibility', 'iridescent', 'oyster shell', 'sparkles']
};
