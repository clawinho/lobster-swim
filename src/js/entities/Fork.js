/**
 * Fork.js - Kitchen fork enemy (Level 3)
 * Dangerous utensil that moves around the kitchen level
 */

export class Fork {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = (Math.random() - 0.5) * 3;
        this.ySpeed = (Math.random() - 0.5) * 2;
    }

    static create(count = 3, canvasWidth = 800, canvasHeight = 600) {
        const forks = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (canvasWidth - 100) + 50;
            const y = Math.random() * (canvasHeight - 150) + 50;
            forks.push(new Fork(x, y));
        }
        return forks;
    }

    update(difficultyMult = 1, canvasWidth = 800, canvasHeight = 600) {
        this.x += this.speed * difficultyMult;
        this.y += this.ySpeed * difficultyMult;

        // Bounce off walls
        if (this.x < 50 || this.x > canvasWidth - 50) {
            this.speed *= -1;
        }
        if (this.y < 50 || this.y > canvasHeight - 100) {
            this.ySpeed *= -1;
        }

        // Clamp position
        this.x = Math.max(50, Math.min(canvasWidth - 50, this.x));
        this.y = Math.max(50, Math.min(canvasHeight - 100, this.y));
    }

    render(ctx) {
        // Handle
        ctx.fillStyle = '#ccc';
        ctx.fillRect(this.x - 4, this.y - 50, 8, 50);

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
