/**
 * sprites.js - All game drawing functions
 * Single source of truth for visual rendering
 */

const Sprites = {
    // Animation state
    frame: 0,
    
    /**
     * Draw the lobster (Clawinho)
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - center x
     * @param {number} y - center y  
     * @param {number} size - base size
     * @param {number} angle - rotation angle
     * @param {Array} tailSegments - tail physics segments (optional, for game)
     * @param {boolean} invincible - flashing effect
     * @param {number} invincibleTimer - flash timer
     */
    drawLobster(ctx, x, y, size, angle = 0, tailSegments = null, invincible = false, invincibleTimer = 0) {
        if (invincible && Math.floor(invincibleTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // If we have tail segments (game mode), use physics-based tail
        if (tailSegments && tailSegments.length >= 3) {
            ctx.restore(); // We'll draw tail in world space
            this._drawTailPhysics(ctx, tailSegments, size);
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
        } else {
            // Standalone tail (assets mode)
            this._drawTailStandalone(ctx, size, this.frame);
        }
        
        // Body
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Claws
        const clawWave = Math.sin(Date.now() / 200) * 0.15;
        
        // Upper claw
        ctx.save();
        ctx.rotate(-0.5 + clawWave);
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.ellipse(size * 0.9, -size * 0.1, size * 0.5, size * 0.25, 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Pincer
        ctx.fillStyle = '#cc3300';
        ctx.beginPath();
        ctx.moveTo(size * 1.3, -size * 0.2);
        ctx.lineTo(size * 1.6, -size * 0.4);
        ctx.lineTo(size * 1.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Lower claw
        ctx.save();
        ctx.rotate(0.5 - clawWave);
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.ellipse(size * 0.9, size * 0.1, size * 0.5, size * 0.25, -0.3, 0, Math.PI * 2);
        ctx.fill();
        // Pincer
        ctx.fillStyle = '#cc3300';
        ctx.beginPath();
        ctx.moveTo(size * 1.3, size * 0.2);
        ctx.lineTo(size * 1.6, size * 0.4);
        ctx.lineTo(size * 1.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(size * 0.4, -size * 0.25, 3, 0, Math.PI * 2);
        ctx.arc(size * 0.4, size * 0.25, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye highlights
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(size * 0.42, -size * 0.27, 1.5, 0, Math.PI * 2);
        ctx.arc(size * 0.42, size * 0.23, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Antennae
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        const antWave = Math.sin(Date.now() / 150) * 5;
        ctx.beginPath();
        ctx.moveTo(size * 0.5, -size * 0.3);
        ctx.quadraticCurveTo(size * 0.8, -size * 0.8 + antWave, size * 1.2, -size * 0.6 + antWave);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size * 0.5, size * 0.3);
        ctx.quadraticCurveTo(size * 0.8, size * 0.8 - antWave, size * 1.2, size * 0.6 - antWave);
        ctx.stroke();
        ctx.lineWidth = 1;
        
        ctx.restore();
        
        // Invincibility shield
        if (invincible) {
            ctx.strokeStyle = '#ffff0066';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, size + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        
        ctx.globalAlpha = 1;
    },
    
    _drawTailPhysics(ctx, tailSegments, size) {
        // Segment 1 (closest to body)
        ctx.fillStyle = '#cc3300';
        ctx.save();
        ctx.translate(tailSegments[0].x, tailSegments[0].y);
        ctx.rotate(tailSegments[0].angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Segment 2
        ctx.save();
        ctx.translate(tailSegments[1].x, tailSegments[1].y);
        ctx.rotate(tailSegments[1].angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.35, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Tail fan (segment 3)
        ctx.fillStyle = '#ff4500';
        ctx.save();
        ctx.translate(tailSegments[2].x, tailSegments[2].y);
        ctx.rotate(tailSegments[2].angle);
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.ellipse(-8, i * 4, 8, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    },
    
    _drawTailStandalone(ctx, size, frame) {
        const wag = 8;
        const time = frame * 0.05;
        const tailAngle = Math.sin(time * wag / 8) * 0.3;
        
        ctx.fillStyle = '#cc3300';
        for (let i = 0; i < 3; i++) {
            const segX = -size * (0.6 + i * 0.4);
            const segY = Math.sin(time + i * 0.5) * wag;
            const segSize = size * (0.5 - i * 0.12);
            ctx.beginPath();
            ctx.ellipse(segX, segY, segSize, segSize * 0.7, tailAngle * (i + 1), 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Tail fan
        ctx.fillStyle = '#ff4500';
        const fanX = -size * 1.8;
        const fanY = Math.sin(time + 1.5) * wag;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.ellipse(fanX, fanY + i * 4, 8, 3, tailAngle * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    /**
     * Draw golden fish
     */
    drawFish(ctx, x, y, speed = 5, shimmer = 5) {
        const time = this.frame * 0.1;
        const wobble = Math.sin(time * speed / 5) * 5;
        
        ctx.save();
        ctx.translate(x + wobble, y);
        
        // Shimmer particles
        ctx.fillStyle = '#ffff0044';
        for (let i = 0; i < shimmer; i++) {
            const px = Math.sin(time + i * 1.5) * 25;
            const py = Math.cos(time * 1.3 + i) * 15;
            const ps = 2 + Math.sin(time * 2 + i) * 1;
            ctx.beginPath();
            ctx.arc(px, py, ps, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Body gradient
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        gradient.addColorStop(0, '#ffdd00');
        gradient.addColorStop(1, '#ff8800');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.fillStyle = '#ffaa00';
        const tailWag = Math.sin(time * 8) * 0.3;
        ctx.save();
        ctx.rotate(tailWag);
        ctx.beginPath();
        ctx.moveTo(-18, 0);
        ctx.lineTo(-35, -12);
        ctx.lineTo(-35, 12);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(10, -2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(11, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },
    
    /**
     * Draw fishing hook
     */
    drawHook(ctx, x, y, lineLength = 100, swingAmount = 10) {
        const time = this.frame * 0.03;
        const swingAngle = Math.sin(time * swingAmount / 10) * 0.4;
        const hookX = x + Math.sin(swingAngle) * 40;
        const hookY = y + lineLength;
        
        // Line
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(hookX, hookY - 15);
        ctx.stroke();
        
        // Hook curve
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(hookX, hookY - 15);
        ctx.lineTo(hookX, hookY);
        ctx.arc(hookX - 8, hookY, 8, 0, Math.PI, false);
        ctx.stroke();
        
        // Barb
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(hookX - 16, hookY);
        ctx.lineTo(hookX - 22, hookY - 6);
        ctx.lineTo(hookX - 14, hookY - 2);
        ctx.fill();
        
        return { x: hookX - 8, y: hookY, radius: 15 }; // Return hitbox
    },
    
    /**
     * Draw lobster trap/cage
     */
    drawCage(ctx, x, y, size = 50) {
        ctx.strokeStyle = '#664422';
        ctx.lineWidth = 3;
        
        // Frame
        ctx.strokeRect(x - size/2, y - size/2, size, size * 0.8);
        
        // Bars
        ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
            const bx = x - size/2 + (size * i / 4);
            ctx.beginPath();
            ctx.moveTo(bx, y - size/2);
            ctx.lineTo(bx, y + size * 0.3);
            ctx.stroke();
        }
        
        // Entrance funnel
        ctx.beginPath();
        ctx.moveTo(x - size * 0.3, y - size/2);
        ctx.lineTo(x, y - size * 0.2);
        ctx.lineTo(x + size * 0.3, y - size/2);
        ctx.stroke();
    },
    
    /**
     * Draw fishing net
     */
    drawNet(ctx, x, y, width = 80) {
        ctx.strokeStyle = '#446688';
        ctx.lineWidth = 2;
        
        const rows = 4;
        const cols = 5;
        
        // Horizontal lines
        for (let r = 0; r <= rows; r++) {
            ctx.beginPath();
            ctx.moveTo(x - width/2, y - 30 + r * 15);
            ctx.lineTo(x + width/2, y - 30 + r * 15);
            ctx.stroke();
        }
        
        // Vertical lines
        for (let c = 0; c <= cols; c++) {
            ctx.beginPath();
            ctx.moveTo(x - width/2 + c * (width/cols), y - 30);
            ctx.lineTo(x - width/2 + c * (width/cols), y + 30);
            ctx.stroke();
        }
        
        // Handle
        ctx.strokeStyle = '#886644';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, y - 30);
        ctx.lineTo(x, y - 60);
        ctx.stroke();
    },
    
    /**
     * Draw fork (kitchen enemy)
     */
    drawFork(ctx, x, y, size = 40) {
        ctx.fillStyle = '#ccc';
        
        // Handle
        ctx.fillRect(x - 4, y + size * 0.3, 8, size);
        
        // Tines
        for (let i = -1.5; i <= 1.5; i++) {
            ctx.fillRect(x + i * 8 - 3, y - size * 0.6, 6, size * 0.9);
        }
        
        // Shine
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(x - 2, y - size * 0.5, 2, size * 0.7);
        ctx.globalAlpha = 1;
    },
    
    /**
     * Draw bubble (collectible)
     */
    drawBubble(ctx, x, y, size = 18) {
        const time = this.frame * 0.05;
        const wobble = Math.sin(time * 2) * 2;
        
        ctx.beginPath();
        ctx.arc(x, y + wobble, size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
            x - size * 0.3, y + wobble - size * 0.3, 0,
            x, y + wobble, size
        );
        gradient.addColorStop(0, 'rgba(200, 230, 255, 0.9)');
        gradient.addColorStop(0.5, 'rgba(100, 180, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(50, 100, 200, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y + wobble - size * 0.3, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    },
    
    /**
     * Update animation frame counter
     */
    tick() {
        this.frame++;
    }
};

// Export for both browser and module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sprites;
}
