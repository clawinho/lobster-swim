/**
 * Hook.js - Fishing hook enemy
 * Swings from above, can drop down to catch the lobster
 */

export class Hook {
    constructor(x, lineLength = 150, swingSpeed = 0.02) {
        this.x = x;
        this.lineLength = lineLength;
        this.angle = Math.random() * Math.PI * 2;
        this.swingSpeed = swingSpeed;
        this.dropping = false;
        this.dropSpeed = 0;
        this.originalLineLength = lineLength;
    }

    static create(canvasWidth, count = 2, config = {}) {
        const hooks = [];
        for (let i = 0; i < count; i++) {
            const x = Math.random() * (canvasWidth - 200) + 100;
            const lineLength = config.lineLength || (Math.random() * 100 + 100);
            const swingSpeed = config.swingSpeed || (0.015 + Math.random() * 0.02);
            hooks.push(new Hook(x, lineLength, swingSpeed));
        }
        return hooks;
    }

    update(difficultyMult = 1) {
        if (!this.dropping) {
            this.angle += this.swingSpeed * difficultyMult;
        } else {
            // Dropping behavior
            this.dropSpeed += 0.5;
            this.lineLength += this.dropSpeed;
            if (this.lineLength > 500) {
                // Reset after dropping off screen
                this.dropping = false;
                this.lineLength = this.originalLineLength;
                this.dropSpeed = 0;
            }
        }
    }

    drop() {
        if (!this.dropping) {
            this.dropping = true;
            this.dropSpeed = 2;
        }
    }

    getHookPosition() {
        const swingX = Math.sin(this.angle) * 50;
        return {
            x: this.x + swingX - 10,
            y: this.lineLength,
            radius: 20
        };
    }

    render(ctx) {
        const swingX = Math.sin(this.angle) * 50;
        const hookX = this.x + swingX;
        const hookY = this.lineLength;

        // Fishing line
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(hookX, hookY - 20);
        ctx.stroke();

        // Hook
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(hookX, hookY - 20);
        ctx.lineTo(hookX, hookY);
        ctx.arc(hookX - 10, hookY, 10, 0, Math.PI, false);
        ctx.stroke();

        // Hook point
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(hookX - 20, hookY);
        ctx.lineTo(hookX - 25, hookY - 8);
        ctx.lineTo(hookX - 18, hookY - 3);
        ctx.fill();

        ctx.lineWidth = 1;

        return this.getHookPosition();
    }

    checkCollision(player, invincible = false) {
        if (invincible) return false;
        
        const hookPos = this.getHookPosition();
        const dx = player.x - hookPos.x;
        const dy = player.y - hookPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        return dist < player.size + hookPos.radius;
    }
}
