/**
 * Particle.js - Visual effect particles
 * Used for bubble collect, death splash, golden fish catch
 */

export class Particle {
    constructor(x, y, vx, vy, color, size, life, gravity = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.life = life;
        this.maxLife = life;
        this.gravity = gravity;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life--;
        return this.life > 0;
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    // Static factory methods for different particle effects
    static spawnBubbleParticles(x, y, count = 8) {
        const particles = [];
        const colors = ['#88ddff', '#aaeeff', '#ffffff', '#66ccff'];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = 2 + Math.random() * 2;
            particles.push(new Particle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 1,
                colors[Math.floor(Math.random() * colors.length)],
                3 + Math.random() * 2,
                30 + Math.random() * 20,
                -0.05
            ));
        }
        return particles;
    }
    
    static spawnDeathParticles(x, y, count = 20) {
        const particles = [];
        const colors = ['#ff4500', '#ff6600', '#ff8800', '#ffaa00'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 4;
            particles.push(new Particle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                colors[Math.floor(Math.random() * colors.length)],
                4 + Math.random() * 3,
                40 + Math.random() * 20,
                0.1
            ));
        }
        return particles;
    }
    
    static spawnGoldenParticles(x, y, count = 12) {
        const particles = [];
        const colors = ['#ffd700', '#ffec00', '#fff8dc', '#fffacd'];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            particles.push(new Particle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 2,
                colors[Math.floor(Math.random() * colors.length)],
                4 + Math.random() * 2,
                50 + Math.random() * 20,
                -0.03
            ));
        }
        return particles;
    }
}

// Preview renderer for assets page
export function render(ctx, width, height, frame, type = 'bubble') {
    ctx.fillStyle = '#000810';
    ctx.fillRect(0, 0, width, height);
    
    const cx = width / 2;
    const cy = height / 2;
    
    // Spawn new particles periodically for preview
    const spawnFrame = frame % 60;
    
    if (spawnFrame < 1) {
        // Draw fresh burst
        const colors = type === 'bubble' ? ['#88ddff', '#aaeeff', '#ffffff'] :
                       type === 'death' ? ['#ff4500', '#ff6600', '#ff8800'] :
                       ['#ffd700', '#ffec00', '#fff8dc'];
        const count = type === 'death' ? 12 : 8;
        const gravity = type === 'bubble' ? -0.05 : type === 'death' ? 0.1 : -0.03;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const dist = spawnFrame * 3;
            const size = 4 * (1 - spawnFrame / 60);
            const alpha = 1 - spawnFrame / 60;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = colors[i % colors.length];
            ctx.shadowColor = colors[i % colors.length];
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist + gravity * spawnFrame * spawnFrame, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    } else {
        // Draw expanding particles
        const progress = spawnFrame / 60;
        const colors = type === 'bubble' ? ['#88ddff', '#aaeeff', '#ffffff'] :
                       type === 'death' ? ['#ff4500', '#ff6600', '#ff8800'] :
                       ['#ffd700', '#ffec00', '#fff8dc'];
        const count = type === 'death' ? 12 : 8;
        const gravity = type === 'bubble' ? -0.05 : type === 'death' ? 0.1 : -0.03;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
            const speed = 2 + (i % 3);
            const dist = progress * speed * 20;
            const gravityOffset = gravity * spawnFrame * spawnFrame * 0.5;
            const size = 4 * (1 - progress);
            const alpha = 1 - progress;
            
            if (alpha > 0 && size > 0) {
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = colors[i % colors.length];
                ctx.shadowColor = colors[i % colors.length];
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist + gravityOffset, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }
    
    // Label
    ctx.fillStyle = '#666';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(type.toUpperCase(), cx, height - 10);
}

export default Particle;
