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

export default Particle;
