/**
 * Fork.js - Kitchen fork enemy (Level 3)
 * Falls from sky like danger from above
 */

export class Fork {
    constructor(x, canvasHeight = 600) {
        this.x = x;
        this.y = -50;  // Start above screen
        this.fallSpeed = 2 + Math.random() * 2;  // Random fall speed
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.05 + Math.random() * 0.05;
        this.canvasHeight = canvasHeight;
    }

    static create(count = 3, canvasWidth = 800, canvasHeight = 600) {
        const forks = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (canvasWidth - 100) + 50;
            const fork = new Fork(x, canvasHeight);
            // Stagger initial Y positions so they don't all fall at once
            fork.y = -50 - (i * 150);
            forks.push(fork);
        }
        return forks;
    }

    update(difficultyMult = 1, canvasWidth = 800, canvasHeight = 600) {
        // Fall down
        this.y += this.fallSpeed * difficultyMult;
        
        // Wobble side to side
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;

        // Respawn at top when off bottom
        if (this.y > canvasHeight + 100) {
            this.y = -50 - Math.random() * 100;
            this.x = Math.random() * (canvasWidth - 100) + 50;
            this.fallSpeed = 2 + Math.random() * 2;
        }

        // Keep X in bounds
        this.x = Math.max(50, Math.min(canvasWidth - 50, this.x));
    }

    render(ctx) {
        // Handle
        ctx.fillStyle = '#8B4513';  // Brown wooden handle
        ctx.fillRect(this.x - 4, this.y - 50, 8, 50);

        // Metal part
        ctx.fillStyle = '#c0c0c0';
        
        // Prongs
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + i * 10 - 3, this.y);
            ctx.lineTo(this.x + i * 10 + 3, this.y);
            ctx.lineTo(this.x + i * 10 + 1, this.y + 35);
            ctx.lineTo(this.x + i * 10 - 1, this.y + 35);
            ctx.closePath();
            ctx.fill();
        }
        
        // Add shine
        ctx.fillStyle = '#ffffff44';
        ctx.fillRect(this.x - 2, this.y, 2, 30);
    }

    getBounds() {
        return {
            x: this.x - 15,
            y: this.y - 50,
            width: 30,
            height: 85,
            centerX: this.x,
            centerY: this.y
        };
    }

    checkCollision(player, invincible = false) {
        if (invincible) return false;

        // Check against prongs area
        const dx = Math.abs(player.x - this.x);
        const dy = player.y - this.y;
        
        // Prong collision zone
        if (dx < 20 && dy > -10 && dy < 40) {
            return true;
        }
        
        return false;
    }
}
