/**
 * GoldenFish.js - Extra life pickup
 * Rare fish that grants an extra life, but runs away from the player
 * Render: v002 (shimmer particles + gradient + tail wag)
 */

import { render as renderFish } from './versions/GoldenFish.v002.js';

export class GoldenFish {
    static SPAWN_INTERVAL = 300;
    static SPAWN_CHANCE = 0.02;
    static SHIMMER_COUNT = 5;

    constructor(canvasWidth = 800) {
        this.size = 15;
        this.speed = 2;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.x = this.direction > 0 ? -30 : canvasWidth + 30;
        this.y = Math.random() * 400 + 100;
        this.wobble = 0;
        this.animTime = Math.random() * 1000; // Start at random phase
    }

    update(playerX, playerY, canvasWidth = 800) {
        this.animTime++;
        
        const dx = this.x - playerX;
        const dy = this.y - playerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
            this.x += (dx / dist) * this.speed * 1.2;
            this.y += (dy / dist) * this.speed * 0.6;
            this.direction = dx > 0 ? 1 : -1;
        } else {
            this.wobble += 0.1;
            this.x += this.direction * this.speed * 0.5;
            this.y += Math.sin(this.wobble) * 1.5;
        }

        if (this.y < 50) this.y = 50;
        if (this.y > 550) this.y = 550;

        return this.x < -50 || this.x > canvasWidth + 50;
    }

    render(ctx) {
        renderFish(ctx, this.x, this.y, this.animTime, this.size, this.direction, GoldenFish.SHIMMER_COUNT);
    }

    checkCollision(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < player.size + this.size;
    }
}
