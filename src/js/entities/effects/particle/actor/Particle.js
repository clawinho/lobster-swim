/**
 * Particle.js - Visual effect particles
 * Used for bubble collect, death splash, golden fish catch, stun, knockback, zap
 */

// Particle type presets — single source of truth for colors and physics
const PRESETS = {
    bubble:    { colors: ['#88ddff', '#aaeeff', '#ffffff', '#66ccff'], count: 8,  speed: [2, 2],   size: [3, 2], life: [30, 20], gravity: -0.05, vyOffset: -1, spread: 'even-jitter' },
    death:     { colors: ['#ff4500', '#ff6600', '#ff8800', '#ffaa00'], count: 20, speed: [3, 4],   size: [4, 3], life: [40, 20], gravity: 0.1,   vyOffset: 0,  spread: 'random' },
    golden:    { colors: ['#ffd700', '#ffec00', '#fff8dc', '#fffacd'], count: 12, speed: [2, 3],   size: [4, 2], life: [50, 20], gravity: -0.03, vyOffset: -2, spread: 'even' },
    stun:      { colors: ['#cc44ff', '#aa22dd', '#ee66ff', '#8800cc'], count: 10, speed: [1.5, 2], size: [2, 2], life: [25, 15], gravity: 0,     vyOffset: 0,  spread: 'even' },
    knockback: { colors: ['#ffffff', '#dddddd', '#ffeecc', '#ffffaa'], count: 6,  speed: [2, 2],   size: [3, 2], life: [20, 10], gravity: 0.05,  vyOffset: 0,  spread: 'random' },
    zap:       { colors: ['#44eeff', '#00ccff', '#88ffff', '#ffffff'], count: 12, speed: [3, 3],   size: [2, 3], life: [20, 15], gravity: 0,     vyOffset: 0,  spread: 'random' },
};

export { PRESETS as PARTICLE_PRESETS };

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

    /**
     * Config-driven particle spawner. All spawn methods delegate here.
     * @param {string} type - Key into PRESETS
     * @param {number} x - Spawn X
     * @param {number} y - Spawn Y
     * @param {number} [countOverride] - Override default count
     */
    static spawn(type, x, y, countOverride) {
        const p = PRESETS[type];
        const count = countOverride ?? p.count;
        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = p.spread === 'random'
                ? Math.random() * Math.PI * 2
                : (Math.PI * 2 * i) / count + (p.spread === 'even-jitter' ? Math.random() * 0.5 : 0);
            const speed = p.speed[0] + Math.random() * p.speed[1];
            particles.push(new Particle(
                x, y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed + p.vyOffset,
                p.colors[Math.floor(Math.random() * p.colors.length)],
                p.size[0] + Math.random() * p.size[1],
                p.life[0] + Math.random() * p.life[1],
                p.gravity
            ));
        }
        return particles;
    }

    // Named convenience methods — delegate to spawn()
    static spawnBubbleParticles(x, y, count)    { return Particle.spawn('bubble', x, y, count); }
    static spawnDeathParticles(x, y, count)     { return Particle.spawn('death', x, y, count); }
    static spawnGoldenParticles(x, y, count)    { return Particle.spawn('golden', x, y, count); }
    static spawnStunParticles(x, y, count)      { return Particle.spawn('stun', x, y, count); }
    static spawnKnockbackParticles(x, y, count) { return Particle.spawn('knockback', x, y, count); }
    static spawnZapParticles(x, y, count)       { return Particle.spawn('zap', x, y, count); }
}

export default Particle;
