/**
 * game.js - Main game controller
 * Manages game state, loop, and coordinates all entities
 */

import { Lobster } from './entities/Lobster.js';
import { Hook } from './entities/Hook.js';
import { Cage } from './entities/Cage.js';
import { Bubble } from './entities/Bubble.js';
import { GoldenFish } from './entities/GoldenFish.js';
import { Net } from './entities/Net.js';
import { Fork } from './entities/Fork.js';

export class Game {
    static CANVAS_WIDTH = 800;
    static CANVAS_HEIGHT = 600;
    static INVINCIBLE_DURATION = 120;

    static LEVELS = {
        1: { name: 'The Ocean', background: '#001020', scoreThreshold: 0 },
        2: { name: 'Seafood Tank', background: '#002030', scoreThreshold: 200 },
        3: { name: 'The Kitchen', background: '#1a0a05', scoreThreshold: 500 }
    };

    static DIFFICULTY = {
        THRESHOLDS: [100, 200, 500, 1000],
        SPEED_MULT: [1.0, 1.2, 1.4, 1.6, 2.0],
        HOOK_COUNTS: [2, 2, 3, 3, 4],
        TIER_NAMES: ['', 'WARM', 'MEDIUM', 'HARD', 'HELL']
    };

    constructor(canvas, audioSystem) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audio = audioSystem;

        // Game state
        this.score = 0;
        this.lives = 3;
        this.highScore = parseInt(localStorage.getItem('lobsterHighScore') || '0');
        this.gameOver = false;
        this.gameStarted = false;
        this.currentLevel = 1;
        this.invincible = true;
        this.invincibleTimer = Game.INVINCIBLE_DURATION;
        this.caught = false;
        this.caughtY = 0;
        this.screenShake = 0;
        this.bgScrollX = 0;
        this.lastHookThreshold = 0;

        // Input state
        this.keys = {};
        this.joystick = { dx: 0, dy: 0 };
        this.hasTarget = false;

        // Entities
        this.player = new Lobster(400, 300);
        this.bubbles = [];
        this.hooks = [];
        this.cages = [];
        this.nets = [];
        this.forks = [];
        this.fish = null;
        this.fishSpawnTimer = 0;

        // Callbacks
        this.onScoreChange = null;
        this.onLivesChange = null;
        this.onLevelChange = null;
        this.onGameOver = null;

        this.setupInput();
    }

    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    setJoystick(dx, dy) {
        this.joystick.dx = dx;
        this.joystick.dy = dy;
    }

    setTarget(x, y) {
        this.player.targetX = x;
        this.player.targetY = y;
        this.hasTarget = true;
    }

    init() {
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.currentLevel = 1;
        this.invincible = true;
        this.invincibleTimer = Game.INVINCIBLE_DURATION;
        this.caught = false;
        this.lastHookThreshold = 0;

        this.player.reset(400, 300);
        this.bubbles = Bubble.create(8, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
        this.cages = Cage.create(2, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
        this.hooks = Hook.create(Game.CANVAS_WIDTH, 2);
        this.nets = [];
        this.forks = [];
        this.fish = null;
        this.fishSpawnTimer = 0;

        this.notifyScoreChange();
        this.notifyLivesChange();
        this.notifyLevelChange();
    }

    start() {
        this.gameStarted = true;
        this.init();
        this.loop();
    }

    getDifficulty() {
        let tier = 0;
        for (let i = 0; i < Game.DIFFICULTY.THRESHOLDS.length; i++) {
            if (this.score >= Game.DIFFICULTY.THRESHOLDS[i]) tier = i + 1;
        }
        return {
            tier: tier,
            name: Game.DIFFICULTY.TIER_NAMES[tier],
            speedMult: Game.DIFFICULTY.SPEED_MULT[tier],
            hookCount: Game.DIFFICULTY.HOOK_COUNTS[tier]
        };
    }

    checkDifficultyScaling() {
        const diff = this.getDifficulty();
        if (diff.hookCount > this.hooks.length && this.score > this.lastHookThreshold + 100) {
            this.hooks.push(...Hook.create(Game.CANVAS_WIDTH, 1));
            this.lastHookThreshold = this.score;
        }
    }

    checkLevelUp() {
        for (let lvl = 3; lvl >= 1; lvl--) {
            if (this.score >= Game.LEVELS[lvl].scoreThreshold && this.currentLevel < lvl) {
                this.currentLevel = lvl;
                if (lvl === 2) this.nets = Net.create(2, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
                if (lvl === 3) this.forks = Fork.create(3, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
                this.notifyLevelChange();
                if (this.audio) this.audio.playLevelUp();
                break;
            }
        }
    }

    loseLife() {
        this.screenShake = 12;
        this.lives--;
        this.notifyLivesChange();

        if (this.lives <= 0) {
            if (this.audio) this.audio.playDeath();
            this.gameOver = true;
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('lobsterHighScore', this.highScore.toString());
            }
            if (this.onGameOver) this.onGameOver(this.score);
        } else {
            if (this.audio) this.audio.playHit();
            this.player.reset(400, 300);
            this.hasTarget = false;
            this.caught = false;
            this.invincible = true;
            this.invincibleTimer = Game.INVINCIBLE_DURATION;
        }
    }

    update() {
        if (this.gameOver) return;

        const diff = this.getDifficulty();

        // Update invincibility
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }

        // Handle caught state
        if (this.caught) {
            this.caughtY -= 3;
            this.player.y = this.caughtY;
            if (this.player.y < -50) this.loseLife();
            return;
        }

        // Update player
        const stillMoving = this.player.update(this.keys, this.joystick, this.hasTarget);
        if (!stillMoving) this.hasTarget = false;
        this.player.clamp(Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

        // Update bubbles
        this.bubbles.forEach((bubble, i) => {
            bubble.update(this.player.x, this.player.y);
            if (bubble.checkCollision(this.player)) {
                if (this.audio) this.audio.playBloop();
                this.score += 10;
                bubble.respawn(Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
                this.notifyScoreChange();
                this.checkDifficultyScaling();
            }
        });

        // Update and check cages
        this.cages.forEach(cage => {
            cage.update(diff.speedMult, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
            if (cage.checkCollision(this.player, this.invincible)) {
                this.caught = true;
                this.caughtY = this.player.y;
                if (this.audio) this.audio.playHooked();
            }
        });

        // Update and check hooks
        this.hooks.forEach(hook => {
            hook.update(diff.speedMult);
            if (hook.checkCollision(this.player, this.invincible)) {
                this.caught = true;
                this.caughtY = this.player.y;
                if (this.audio) this.audio.playHooked();
            }
        });

        // Update nets (level 2+)
        if (this.currentLevel >= 2) {
            this.nets.forEach(net => {
                net.update(diff.speedMult, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
                if (net.checkCollision(this.player, this.invincible)) {
                    this.loseLife();
                }
            });
        }

        // Update forks (level 3)
        if (this.currentLevel >= 3) {
            this.forks.forEach(fork => {
                fork.update(diff.speedMult, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);
                if (fork.checkCollision(this.player, this.invincible)) {
                    this.loseLife();
                }
            });
        }

        // Golden fish spawning
        this.fishSpawnTimer++;
        if (!this.fish && this.fishSpawnTimer > GoldenFish.SPAWN_INTERVAL && this.lives < 3) {
            if (Math.random() < GoldenFish.SPAWN_CHANCE) {
                this.fish = new GoldenFish(Game.CANVAS_WIDTH);
                this.fishSpawnTimer = 0;
            }
        }

        // Update fish
        if (this.fish) {
            const offScreen = this.fish.update(this.player.x, this.player.y, Game.CANVAS_WIDTH);
            if (offScreen) {
                this.fish = null;
            } else if (this.fish.checkCollision(this.player)) {
                if (this.audio) this.audio.playExtraLife();
                this.lives++;
                this.score += 50;
                this.notifyLivesChange();
                this.notifyScoreChange();
                this.fish = null;
            }
        }

        // Check level up
        this.checkLevelUp();

        // Background scroll
        this.bgScrollX += 0.5;
    }

    render() {
        const ctx = this.ctx;

        // Screen shake
        ctx.save();
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake * 2;
            const shakeY = (Math.random() - 0.5) * this.screenShake * 2;
            ctx.translate(shakeX, shakeY);
            this.screenShake--;
        }

        // Background
        this.renderBackground();

        // Render entities
        this.bubbles.forEach(bubble => bubble.render(ctx, this.player.x, this.player.y));
        this.cages.forEach(cage => cage.render(ctx));
        this.hooks.forEach(hook => hook.render(ctx));

        if (this.currentLevel >= 2) {
            this.nets.forEach(net => net.render(ctx));
        }
        if (this.currentLevel >= 3) {
            this.forks.forEach(fork => fork.render(ctx));
        }

        if (this.fish) {
            this.fish.render(ctx);
        }

        // Render player
        this.player.render(ctx, this.invincible, this.invincibleTimer);

        ctx.restore();
    }

    renderBackground() {
        const ctx = this.ctx;
        const level = Game.LEVELS[this.currentLevel];

        // Base color
        ctx.fillStyle = level.background;
        ctx.fillRect(0, 0, Game.CANVAS_WIDTH, Game.CANVAS_HEIGHT);

        // Level-specific decorations
        if (this.currentLevel === 1) {
            this.renderOceanBackground();
        } else if (this.currentLevel === 2) {
            this.renderTankBackground();
        } else if (this.currentLevel === 3) {
            this.renderKitchenBackground();
        }
    }

    renderOceanBackground() {
        const ctx = this.ctx;
        // Sandy floor
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(0, 500, Game.CANVAS_WIDTH, 100);

        // Seaweed
        ctx.fillStyle = '#2d5a2d';
        for (let i = 0; i < 8; i++) {
            const x = (i * 120 + this.bgScrollX * 0.2) % (Game.CANVAS_WIDTH + 100) - 50;
            for (let j = 0; j < 5; j++) {
                const sway = Math.sin(Date.now() / 500 + i + j) * 10;
                ctx.beginPath();
                ctx.ellipse(x + sway, 520 - j * 30, 8, 25, 0.2 + sway * 0.02, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    renderTankBackground() {
        const ctx = this.ctx;
        // Gravel
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(0, 520, Game.CANVAS_WIDTH, 80);

        // Tank decorations
        ctx.fillStyle = '#666';
        ctx.fillRect(30, 450, 60, 70); // Castle
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.moveTo(30, 450);
        ctx.lineTo(60, 420);
        ctx.lineTo(90, 450);
        ctx.fill();
    }

    renderKitchenBackground() {
        const ctx = this.ctx;
        // Counter
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 500, Game.CANVAS_WIDTH, 100);

        // Tiles
        ctx.strokeStyle = '#ffffff22';
        for (let x = 0; x < Game.CANVAS_WIDTH; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 500);
            ctx.stroke();
        }
        for (let y = 0; y < 500; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(Game.CANVAS_WIDTH, y);
            ctx.stroke();
        }
    }

    loop() {
        if (!this.gameStarted) return;

        this.update();
        this.render();

        if (!this.gameOver) {
            requestAnimationFrame(() => this.loop());
        }
    }

    // Notification methods
    notifyScoreChange() {
        if (this.onScoreChange) this.onScoreChange(this.score);
    }

    notifyLivesChange() {
        if (this.onLivesChange) this.onLivesChange(this.lives);
    }

    notifyLevelChange() {
        if (this.onLevelChange) {
            this.onLevelChange(this.currentLevel, Game.LEVELS[this.currentLevel]);
        }
    }

    // Public API
    restart() {
        this.gameOver = false;
        this.init();
        this.loop();
    }

    pause() {
        this.gameStarted = false;
    }

    resume() {
        this.gameStarted = true;
        this.loop();
    }
}
