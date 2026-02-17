/**
 * Eel.v001.js - Electric eel renderer
 * @version 001
 * @current true
 * 
 * A sinuous, electric eel drawn as a segmented body with
 * crackling electric highlights. Neon green/blue palette.
 */

const SEGMENT_COUNT = 12;
const BODY_COLOR = '#1a6b3a';
const BELLY_COLOR = '#2aff6a';
const ELECTRIC_COLOR = '#44eeff';
const EYE_COLOR = '#ff3333';

/**
 * Render an eel
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x - head x position
 * @param {number} y - head y position  
 * @param {number} size - body thickness
 * @param {number} phase - animation phase for body wave
 * @param {number} direction - 1=right, -1=left
 * @param {number} sparkPhase - phase for electric sparks
 */
export function render(ctx, x, y, size, phase, direction = 1, sparkPhase = 0) {
    const segLen = size * 1.2;
    const waveAmp = size * 0.8;
    
    ctx.save();
    
    // Build segment positions (head to tail)
    const segments = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
        const t = i / SEGMENT_COUNT;
        const sx = x - direction * i * segLen;
        const sy = y + Math.sin(phase + i * 0.7) * waveAmp * t;
        segments.push({ x: sx, y: sy });
    }
    
    // Draw body (thick line through segments)
    ctx.beginPath();
    ctx.moveTo(segments[0].x, segments[0].y);
    for (let i = 1; i < segments.length; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];
        const mx = (prev.x + curr.x) / 2;
        const my = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
    }
    ctx.strokeStyle = BODY_COLOR;
    ctx.lineWidth = size * 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Belly highlight
    ctx.strokeStyle = BELLY_COLOR + '40';
    ctx.lineWidth = size * 0.8;
    ctx.stroke();
    
    // Electric sparks (intermittent)
    if (Math.sin(sparkPhase) > 0.3) {
        for (let i = 1; i < segments.length - 1; i += 2) {
            const s = segments[i];
            const sparkLen = size * (0.5 + Math.random() * 1.0);
            const angle = Math.random() * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            // Zigzag spark
            const mid1x = s.x + Math.cos(angle) * sparkLen * 0.3;
            const mid1y = s.y + Math.sin(angle) * sparkLen * 0.3;
            const mid2x = s.x + Math.cos(angle + 0.5) * sparkLen * 0.7;
            const mid2y = s.y + Math.sin(angle + 0.5) * sparkLen * 0.7;
            const endx = s.x + Math.cos(angle) * sparkLen;
            const endy = s.y + Math.sin(angle) * sparkLen;
            ctx.lineTo(mid1x, mid1y);
            ctx.lineTo(mid2x, mid2y);
            ctx.lineTo(endx, endy);
            ctx.strokeStyle = ELECTRIC_COLOR;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.6 + Math.random() * 0.4;
            ctx.stroke();
        }
    }
    ctx.globalAlpha = 1;
    
    // Head (slightly wider)
    const head = segments[0];
    ctx.beginPath();
    ctx.arc(head.x, head.y, size * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = BODY_COLOR;
    ctx.fill();
    
    // Eye
    const eyeOffX = direction * size * 0.4;
    const eyeOffY = -size * 0.3;
    ctx.beginPath();
    ctx.arc(head.x + eyeOffX, head.y + eyeOffY, size * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = EYE_COLOR;
    ctx.fill();
    // Pupil
    ctx.beginPath();
    ctx.arc(head.x + eyeOffX + direction * 1, head.y + eyeOffY, size * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    
    // Electric glow around head
    if (Math.sin(sparkPhase * 2) > 0.5) {
        ctx.beginPath();
        ctx.arc(head.x, head.y, size * 2, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(head.x, head.y, size * 0.5, head.x, head.y, size * 2);
        glow.addColorStop(0, ELECTRIC_COLOR + '30');
        glow.addColorStop(1, ELECTRIC_COLOR + '00');
        ctx.fillStyle = glow;
        ctx.fill();
    }
    
    ctx.restore();
}

export const meta = {
    version: "001",
    name: "Electric Eel",
    current: true,
    features: ["segmented-body", "sine-wave-motion", "electric-sparks", "head-glow"]
};
