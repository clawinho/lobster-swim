/**
 * Net.js - Fishing net enemy (Level 2+)
 * Large rectangular hazard that sweeps across the screen
 */

export class Net {
    constructor(x, y, width = 100, height = 60) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = Math.random() > 0.5 ? 2 : -2;
    }

    static create(count = 2, canvasWidth = 800, canvasHeight = 600) {
        const nets = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() > 0.5 ? -100 : canvasWidth;
            const y = Math.random() * (canvasHeight - 100) + 50;
            nets.push(new Net(x, y, 100, 60));
        }
        return nets;
    }

    update(difficultyMult = 1, canvasWidth = 800, canvasHeight = 600) {
        this.x += this.speed * difficultyMult;

        // Reset when off screen
        if (this.x < -150) {
            this.x = canvasWidth + 50;
            this.y = Math.random() * (canvasHeight - 100) + 50;
        }
        if (this.x > canvasWidth + 100) {
            this.x = -100;
            this.y = Math.random() * (canvasHeight - 100) + 50;
        }
    }

    render(ctx) {
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Net grid
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + i * this.height / 4);
            ctx.lineTo(this.x + this.width, this.y + i * this.height / 4);
            ctx.stroke();
            ctx.moveTo(this.x + i * this.width / 4, this.y);
            ctx.lineTo(this.x + i * this.width / 4, this.y + this.height);
            ctx.stroke();
        }

        ctx.lineWidth = 1;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    checkCollision(player, invincible = false) {
        if (invincible) return false;

        // Simple AABB collision
        return player.x + player.size > this.x &&
               player.x - player.size < this.x + this.width &&
               player.y + player.size > this.y &&
               player.y - player.size < this.y + this.height;
    }
}
