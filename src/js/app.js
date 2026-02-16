/**
 * app.js - Main application (uses regular DOM, modular entities)
 */

import { Lobster, Hook, Cage, Bubble, GoldenFish, Net, Fork } from './entities/index.js';
import { Particle } from './entities/effects/Particle.js';
import { Audio } from './audio-module.js';
import { OceanCurrent } from './entities/mechanics/OceanCurrent.js';

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const INVINCIBLE_DURATION = 120;

const LEVELS = {
    1: { name: 'The Ocean', background: '#001020', scoreThreshold: 0 },
    2: { name: 'Seafood Tank', background: '#002030', scoreThreshold: 200 },
    3: { name: 'The Kitchen', background: '#1a0a05', scoreThreshold: 500 }
};

const DIFFICULTY = {
    THRESHOLDS: [100, 200, 500, 1000],
    SPEED_MULT: [1.0, 1.2, 1.4, 1.6, 2.0],
    HOOK_COUNTS: [2, 2, 3, 3, 4],
    TIER_NAMES: ['', 'WARM', 'MEDIUM', 'HARD', 'HELL']
};

const DEATH_QUOTES = [
    "The void claims all eventually...",
    "Even the mightiest lobster falls...",
    "The kitchen always wins...",
    "Butter and garlic await...",
    "Another one for the pot..."
];

// Combo system constants
const COMBO_TIMEOUT = 90; // ~1.5 seconds at 60fps
const COMBO_MAX = 10;
const COMBO_MESSAGES = ['', 'Nice!', 'Great!', 'Awesome!', 'Amazing!', 'INCREDIBLE!', 'UNSTOPPABLE!', 'GODLIKE!', 'LEGENDARY!', 'TRANSCENDENT!'];

// Game state
let canvas, ctx, audio;
let player, bubbles, hooks, cages, nets, forks, fish, oceanCurrent;
let gameSessionId = null;
let score = 0, lives = 3, highScore = 0;
let gameOver = false, gameStarted = false;
let newBestTimer = 0; // For "NEW BEST!" celebration
let deathAnimating = false, deathTimer = 0, deathRotation = 0; // Death animation state
let levelTransition = false, levelTransitionTimer = 0, transitionLevel = 0; // Level transition state

// Combo state
let comboCount = 0;
let comboTimer = 0;
let comboPopups = []; // {x, y, text, timer, color}
let scorePopups = []; // {x, y, text, timer, color, startY}

// Screen flash for combo milestones
let comboFlash = 0; // Timer for screen flash
let comboFlashColor = '#ffff00'; // Color of flash
const COMBO_FLASH_MILESTONES = [5, 8, 10]; // Combos that trigger flash
const COMBO_FLASH_COLORS = { 5: '#ffff00', 8: '#ff8800', 10: '#ff00ff' };

const LEVEL_SUBTITLES = {
    2: "Captured... but not defeated",
    3: "Escape the pot or become dinner"
};
let currentLevel = 1, invincible = true, invincibleTimer = INVINCIBLE_DURATION;
let caught = false, caughtY = 0, screenShake = 0;
let keys = {}, joystickDx = 0, joystickDy = 0, hasTarget = false;
let bgScrollX = 0, lastHookThreshold = 0, fishSpawnTimer = 0;
let particles = [];
// DOM Elements
let titleScreen, playBtn, scoreDisplay, livesDisplay, levelDisplay, difficultyDisplay;
let leaderboard, nameInput, finalScoreDisplay, playerNameInput, submitBtn, skipBtn;

// Initialize
function init() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    audio = new Audio();
    
    // Get DOM elements
    titleScreen = document.getElementById('title-screen');
    playBtn = document.getElementById('play-btn');
    scoreDisplay = document.getElementById('score');
    livesDisplay = document.getElementById('lives');
    levelDisplay = document.getElementById('level-name');
    difficultyDisplay = document.getElementById('difficulty');
    leaderboard = document.getElementById('scores-list');
    nameInput = document.getElementById('name-input');
    finalScoreDisplay = document.getElementById('final-score-display');
    playerNameInput = document.getElementById('player-name');
    submitBtn = document.getElementById('submit-score-btn');
    skipBtn = document.getElementById('skip-btn');
    
    // Load high score
    highScore = parseInt(localStorage.getItem('lobsterHighScore') || '0');
    document.getElementById('title-hs').textContent = highScore;
    
    // Setup events
    setupEvents();
    
    // Load leaderboard
    fetchLeaderboard();
    
    console.log('🦞 Lobster Swim initialized');
}

function setupEvents() {
    // Play button
    playBtn.addEventListener('click', startGame);
    
    // Keyboard
    document.addEventListener('keydown', e => keys[e.key] = true);
    document.addEventListener('keyup', e => keys[e.key] = false);
    
    // Canvas mouse/touch - hold-down drag support
    let mouseIsDown = false;
    canvas.addEventListener('mousedown', (e) => {
        mouseIsDown = true;
        handleCanvasClick(e);
    });
    document.addEventListener('mouseup', () => {
        mouseIsDown = false;
    });
    canvas.addEventListener('mousemove', (e) => {
        if (mouseIsDown) handleCanvasClick(e);
    });
    canvas.addEventListener('touchstart', handleCanvasTouch, { passive: false });
    canvas.addEventListener('touchmove', handleCanvasTouch, { passive: false });
    
    // Joystick
    setupJoystick();
    
    // Music/SFX toggles
    document.getElementById('music-btn').addEventListener('click', () => {
        const enabled = audio.toggleMusic();
        document.getElementById('music-btn').style.opacity = enabled ? '0.8' : '0.4';
    });
    document.getElementById('sfx-btn').addEventListener('click', () => {
        const enabled = audio.toggleSfx();
        document.getElementById('sfx-btn').style.opacity = enabled ? '0.8' : '0.4';
    });
    
    // Game over buttons
    submitBtn.addEventListener('click', submitScore);
    skipBtn.addEventListener('click', returnToTitle);
    playerNameInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') submitScore();
    });
}

function setupJoystick() {
    const base = document.getElementById('joystick-base');
    const knob = document.getElementById('joystick-knob');
    if (!base || !knob) return;
    
    let active = false;
    
    const update = (clientX, clientY) => {
        const rect = base.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const maxDist = rect.width / 2 - 25;
        
        let dx = clientX - centerX;
        let dy = clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > maxDist) {
            dx = (dx / dist) * maxDist;
            dy = (dy / dist) * maxDist;
        }
        
        knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        joystickDx = dx / maxDist;
        joystickDy = dy / maxDist;
    };
    
    base.addEventListener('touchstart', e => {
        e.preventDefault();
        active = true;
        update(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    
    document.addEventListener('touchmove', e => {
        if (active && e.touches.length > 0) {
            update(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
        active = false;
        knob.style.transform = 'translate(-50%, -50%)';
        joystickDx = 0;
        joystickDy = 0;
    });
}

function handleCanvasClick(e) {
    if (!gameStarted || gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    player.targetX = (e.clientX - rect.left) * scaleX;
    player.targetY = (e.clientY - rect.top) * scaleY;
    hasTarget = true;
}

function handleCanvasTouch(e) {
    if (!gameStarted || gameOver) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    player.targetX = (touch.clientX - rect.left) * scaleX;
    player.targetY = (touch.clientY - rect.top) * scaleY;
    hasTarget = true;
}

async function startGame() {
    // Get anti-cheat session
    try {
        const res = await fetch("/api/scores/start");
        const data = await res.json();
        gameSessionId = data.session;
    } catch(e) { gameSessionId = null; }
    titleScreen.classList.add('hidden');
    audio.init();
    audio.startLevelMusic(1);
    
    // Reset game state
    score = 0;
    lives = 3;
    gameOver = false;
    gameStarted = true;
    currentLevel = 1;
    invincible = true;
    invincibleTimer = INVINCIBLE_DURATION;
    caught = false;
    lastHookThreshold = 0;
    fishSpawnTimer = 0;
    particles = [];
    deathAnimating = false;
    deathTimer = 0;
    deathRotation = 0;
    newBestTimer = 0;
    levelTransition = false;
    levelTransitionTimer = 0;
    transitionLevel = 0;
    
    // Reset combo
    comboCount = 0;
    comboTimer = 0;
    comboPopups = [];
    scorePopups = [];
    comboFlash = 0;
    
    // Create entities
    player = new Lobster(400, 300);
    bubbles = Bubble.create(8, CANVAS_WIDTH, CANVAS_HEIGHT);
    cages = Cage.create(2, CANVAS_WIDTH, CANVAS_HEIGHT);
    hooks = Hook.create(CANVAS_WIDTH, 2);
    nets = [];
    forks = [];
    fish = null;
    oceanCurrent = new OceanCurrent(0.4); // Ocean currents push player gently
    
    updateUI();
    gameLoop();
}

function getDifficulty() {
    let tier = 0;
    for (let i = 0; i < DIFFICULTY.THRESHOLDS.length; i++) {
        if (score >= DIFFICULTY.THRESHOLDS[i]) tier = i + 1;
    }
    return {
        tier,
        name: DIFFICULTY.TIER_NAMES[tier],
        speedMult: DIFFICULTY.SPEED_MULT[tier],
        hookCount: DIFFICULTY.HOOK_COUNTS[tier]
    };
}

function checkLevelUp() {
    for (let lvl = 3; lvl >= 1; lvl--) {
        if (score >= LEVELS[lvl].scoreThreshold && currentLevel < lvl) {
            currentLevel = lvl;
            document.body.style.background = LEVELS[lvl].background;
            levelDisplay.textContent = LEVELS[lvl].name;
            if (lvl === 2) nets = Net.create(2, CANVAS_WIDTH, CANVAS_HEIGHT);
            if (lvl === 3) forks = Fork.create(3, CANVAS_WIDTH, CANVAS_HEIGHT);
            audio.startLevelMusic(lvl);
            audio.playLevelUp();
            
            // Trigger level transition effect
            levelTransition = true;
            levelTransitionTimer = 120; // 2 seconds at 60fps
            transitionLevel = lvl;
            break;
        }
    }
}

// Get combo multiplier (1x, 1.5x, 2x, 2.5x, etc)
function getComboMultiplier() {
    if (comboCount <= 1) return 1;
    return 1 + (comboCount - 1) * 0.5;
}

// Get combo color based on level
function getComboColor() {
    if (comboCount <= 1) return '#00ffff';
    if (comboCount <= 3) return '#00ff00';
    if (comboCount <= 5) return '#ffff00';
    if (comboCount <= 7) return '#ff8800';
    return '#ff00ff';
}

function loseLife() {
    particles.push(...Particle.spawnDeathParticles(player.x, player.y));
    screenShake = 12;
    lives--;
    
    // Reset combo on death
    comboCount = 0;
    comboTimer = 0;
    
    updateLives();
    
    if (lives <= 0) {
        audio.playDeath();
        // Start death animation instead of immediate game over
        deathAnimating = true;
        deathTimer = 120; // 2 seconds at 60fps
        deathRotation = 0;
        screenShake = 20;
        // Reset player to visible position for death animation
        player.x = CANVAS_WIDTH / 2;
        player.y = CANVAS_HEIGHT / 3;
        // Check for new high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('lobsterHighScore', highScore.toString());
            newBestTimer = 180; // Show "NEW BEST!" for 3 seconds
        }
    } else {
        audio.playHit();
        player.reset(400, 300);
        hasTarget = false;
        caught = false;
        invincible = true;
        invincibleTimer = INVINCIBLE_DURATION;
    }
}

function update() {
    if (gameOver) return;
    
    // Death animation
    if (deathAnimating) {
        deathTimer--;
        deathRotation += 0.15; // Slower spin
        player.y += 1.5; // Slower fall
        player.x += Math.sin(deathTimer * 0.1) * 2; // Wobble side to side
        // Spawn trailing particles
        if (deathTimer % 8 === 0) {
            particles.push(...Particle.spawnDeathParticles(player.x, player.y).slice(0, 2));
        }
        if (deathTimer <= 0) {
            deathAnimating = false;
            gameOver = true;
            showGameOver();
        }
        // Update particles during death animation
        particles = particles.filter(p => p.update());
        return;
    }
    
    // New best celebration timer
    if (newBestTimer > 0) newBestTimer--;
    
    // Level transition timer
    if (levelTransitionTimer > 0) {
        levelTransitionTimer--;
        if (levelTransitionTimer <= 0) levelTransition = false;
    }
    
    // Combo timer decay
    if (comboTimer > 0) {
        comboTimer--;
        if (comboTimer <= 0) {
            comboCount = 0; // Combo expired
        }
    }
    
    // Combo flash decay
    if (comboFlash > 0) comboFlash--;
    
    // Update combo popups
    comboPopups = comboPopups.filter(p => {
        p.timer--;
        p.y -= 1.5; // Float up
        return p.timer > 0;
    });
    
    // Update score popups
    scorePopups = scorePopups.filter(p => {
        p.timer--;
        p.y -= 2; // Float up faster
        return p.timer > 0;
    });
    
    const diff = getDifficulty();
    
    // Invincibility
    if (invincible) {
        invincibleTimer--;
        if (invincibleTimer <= 0) invincible = false;
    }
    
    // Caught state
    if (caught) {
        caughtY -= 3;
        player.y = caughtY;
        if (player.y < -50) loseLife();
        return;
    }
    
    // Player movement
    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;
    
    if (joystickDx !== 0 || joystickDy !== 0) {
        player.x += joystickDx * player.speed;
        player.y += joystickDy * player.speed;
    }
    
    if (hasTarget) {
        const dx = player.targetX - player.x;
        const dy = player.targetY - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 10) {
            player.x += (dx / dist) * player.speed;
            player.y += (dy / dist) * player.speed;
        } else {
            hasTarget = false;
        }
    }
    
    // Ocean current (level 1 only - the ocean)
    if (currentLevel === 1 && oceanCurrent) {
        const diff = getDifficulty();
        oceanCurrent.applyToPlayer(player, diff.speedMult, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    player.clamp(CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Bubbles
    bubbles.forEach(bubble => {
        bubble.update(player.x, player.y);
        if (bubble.checkCollision(player)) {
            particles.push(...Particle.spawnBubbleParticles(bubble.x, bubble.y));
            audio.playBloop();
            
            // Combo system
            comboCount = Math.min(comboCount + 1, COMBO_MAX);
            comboTimer = COMBO_TIMEOUT;
            
            // Screen flash on combo milestones!
            if (COMBO_FLASH_MILESTONES.includes(comboCount)) {
                comboFlash = 20; // Flash duration in frames
                comboFlashColor = COMBO_FLASH_COLORS[comboCount];
                screenShake = Math.min(8, comboCount); // Extra shake on milestones
            }
            
            // Calculate points with multiplier
            const multiplier = getComboMultiplier();
            const basePoints = 10;
            const points = Math.floor(basePoints * multiplier);
            score += points;
            
            // Score popup
            scorePopups.push({
                x: bubble.x,
                y: bubble.y,
                text: "+" + points,
                timer: 45,
                color: comboCount > 1 ? getComboColor() : "#00ffff",
                startY: bubble.y
            });
            
            // Spawn combo popup
            if (comboCount > 1) {
                const msg = COMBO_MESSAGES[Math.min(comboCount, COMBO_MESSAGES.length - 1)];
                comboPopups.push({
                    x: bubble.x,
                    y: bubble.y,
                    text: `${multiplier}x ${msg}`,
                    timer: 60,
                    color: getComboColor()
                });
            }
            
            bubble.respawn(CANVAS_WIDTH, CANVAS_HEIGHT);
            updateScore();
            
            // Difficulty scaling
            const diff = getDifficulty();
            if (diff.hookCount > hooks.length && score > lastHookThreshold + 100) {
                hooks.push(...Hook.create(CANVAS_WIDTH, 1));
                lastHookThreshold = score;
            }
        }
    });
    
    // Cages
    cages.forEach(cage => {
        cage.update(diff.speedMult, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (cage.checkCollision(player, invincible)) {
            caught = true;
            caughtY = player.y;
            audio.playHooked();
        }
    });
    
    // Hooks
    hooks.forEach(hook => {
        hook.update(diff.speedMult);
        if (hook.checkCollision(player, invincible)) {
            caught = true;
            caughtY = player.y;
            audio.playHooked();
        }
    });
    
    // Nets (level 2+)
    if (currentLevel >= 2) {
        nets.forEach(net => {
            net.update(diff.speedMult, CANVAS_WIDTH, CANVAS_HEIGHT);
            if (net.checkCollision(player, invincible)) {
                loseLife();
            }
        });
    }
    
    // Forks (level 3)
    if (currentLevel >= 3) {
        forks.forEach(fork => {
            fork.update(diff.speedMult, CANVAS_WIDTH, CANVAS_HEIGHT);
            if (fork.checkCollision(player, invincible)) {
                loseLife();
            }
        });
    }
    
    // Golden fish
    fishSpawnTimer++;
    if (!fish && fishSpawnTimer > GoldenFish.SPAWN_INTERVAL && lives < 3) {
        if (Math.random() < GoldenFish.SPAWN_CHANCE) {
            fish = new GoldenFish(CANVAS_WIDTH);
            fishSpawnTimer = 0;
        }
    }
    
    if (fish) {
        const offScreen = fish.update(player.x, player.y, CANVAS_WIDTH);
        if (offScreen) {
            fish = null;
        } else if (fish.checkCollision(player)) {
            particles.push(...Particle.spawnGoldenParticles(fish.x, fish.y));
            audio.playExtraLife();
            lives++;
            score += 50;
            scorePopups.push({
                x: fish.x,
                y: fish.y,
                text: "+50 +❤️",
                timer: 60,
                color: "#ffd700",
                startY: fish.y
            });
            updateLives();
            updateScore();
            fish = null;
        }
    }
    
    // Level up check
    checkLevelUp();
    
    // Background scroll
    bgScrollX += 0.5;
    
    // Update particles
    particles = particles.filter(p => p.update());
}

function render() {
    ctx.save();
    
    // Screen shake
    if (screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * screenShake * 2;
        const shakeY = (Math.random() - 0.5) * screenShake * 2;
        ctx.translate(shakeX, shakeY);
        screenShake--;
    }
    
    // Background
    renderBackground();
    
    // Ocean current visual (level 1 only)
    if (currentLevel === 1 && oceanCurrent) {
        oceanCurrent.render(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // Entities
    bubbles.forEach(b => b.render(ctx, player.x, player.y));
    cages.forEach(c => c.render(ctx));
    hooks.forEach(h => h.render(ctx));
    
    if (currentLevel >= 2) nets.forEach(n => n.render(ctx));
    if (currentLevel >= 3) forks.forEach(f => f.render(ctx));
    if (fish) fish.render(ctx);
    
    // Player (with death animation rotation)
    if (deathAnimating) {
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(deathRotation);
        ctx.translate(-player.x, -player.y);
        player.render(ctx, false, 0);
        ctx.restore();
        
        // Red flash overlay
        if (deathTimer > 75) {
            ctx.fillStyle = `rgba(255, 0, 0, ${(deathTimer - 75) / 15 * 0.3})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
    } else {
        player.render(ctx, invincible, invincibleTimer);
    }
    
    // Particles (on top of everything)
    particles.forEach(p => p.render(ctx));
    
    // Score popups
    scorePopups.forEach(p => {
        const alpha = Math.min(1, p.timer / 15);
        const rise = (45 - p.timer) * 0.8;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 4;
        ctx.fillText(p.text, p.x, p.startY - rise);
        ctx.restore();
    });
    
    // Combo popups
    comboPopups.forEach(p => {
        const alpha = Math.min(1, p.timer / 20);
        const scale = 1 + (60 - p.timer) * 0.01;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${16 * scale}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
    });
    
    // Combo meter (top of screen, only when active)
    if (comboCount > 1 && !deathAnimating) {
        ctx.save();
        const barWidth = 150;
        const barHeight = 8;
        const barX = CANVAS_WIDTH / 2 - barWidth / 2;
        const barY = 15;
        const progress = comboTimer / COMBO_TIMEOUT;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
        
        // Timer bar
        ctx.fillStyle = getComboColor();
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        
        // Combo text
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = getComboColor();
        ctx.shadowColor = getComboColor();
        ctx.shadowBlur = 8;
        ctx.fillText(`${comboCount}x COMBO`, CANVAS_WIDTH / 2, barY + 25);
        ctx.restore();
    }
    
    // Combo milestone screen flash
    if (comboFlash > 0) {
        const flashAlpha = (comboFlash / 20) * 0.4;
        ctx.fillStyle = comboFlashColor.replace(')', `, ${flashAlpha})`).replace('rgb', 'rgba').replace('#', '');
        // Convert hex to rgba for flash
        const hex = comboFlashColor;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${flashAlpha})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // NEW BEST! celebration text
    if (newBestTimer > 0) {
        const pulse = 1 + Math.sin(newBestTimer * 0.2) * 0.1;
        ctx.save();
        ctx.font = `bold ${36 * pulse}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00ff00';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 20;
        ctx.fillText('✨ NEW BEST! ✨', CANVAS_WIDTH / 2, 80);
        ctx.restore();
    }
    
    // Level transition effect
    if (levelTransition && levelTransitionTimer > 0) {
        ctx.save();
        
        // White flash (fades out)
        if (levelTransitionTimer > 100) {
            const flashAlpha = (levelTransitionTimer - 100) / 20 * 0.8;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(flashAlpha, 0.8)})`;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        
        // Level name announcement
        const progress = 1 - (levelTransitionTimer / 120);
        const slideIn = progress < 0.2 ? progress / 0.2 : 1;
        const fadeOut = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;
        const alpha = slideIn * fadeOut;
        
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        
        // Big glowing level name
        const pulse = 1 + Math.sin(levelTransitionTimer * 0.15) * 0.05;
        ctx.font = `bold ${48 * pulse}px monospace`;
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#ff4500';
        ctx.shadowBlur = 30;
        ctx.fillText(LEVELS[transitionLevel].name.toUpperCase(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
        
        // Subtitle
        if (LEVEL_SUBTITLES[transitionLevel]) {
            ctx.font = '18px monospace';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ffaa00';
            ctx.fillText(LEVEL_SUBTITLES[transitionLevel], CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 25);
        }
        
        ctx.restore();
    }
    
    ctx.restore();
}

function renderBackground() {
    const level = LEVELS[currentLevel];
    ctx.fillStyle = level.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (currentLevel === 1) {
        // Sandy floor
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(0, 500, CANVAS_WIDTH, 100);
        // Seaweed
        ctx.fillStyle = '#2d5a2d';
        for (let i = 0; i < 8; i++) {
            const x = (i * 120 + bgScrollX * 0.2) % (CANVAS_WIDTH + 100) - 50;
            for (let j = 0; j < 5; j++) {
                const sway = Math.sin(Date.now() / 500 + i + j) * 10;
                ctx.beginPath();
                ctx.ellipse(x + sway, 520 - j * 30, 8, 25, 0.2 + sway * 0.02, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    } else if (currentLevel === 2) {
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(0, 520, CANVAS_WIDTH, 80);
        ctx.fillStyle = '#666';
        ctx.fillRect(30, 450, 60, 70);
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.moveTo(30, 450);
        ctx.lineTo(60, 420);
        ctx.lineTo(90, 450);
        ctx.fill();
    } else if (currentLevel === 3) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 500, CANVAS_WIDTH, 100);
        ctx.strokeStyle = '#ffffff22';
        for (let x = 0; x < CANVAS_WIDTH; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 500);
            ctx.stroke();
        }
        for (let y = 0; y < 500; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CANVAS_WIDTH, y);
            ctx.stroke();
        }
    }
}

function gameLoop() {
    if (!gameStarted) return;
    
    update();
    render();
    
    // Continue loop during death animation or normal play
    if (!gameOver || deathAnimating) {
        requestAnimationFrame(gameLoop);
    }
}

function updateUI() {
    updateScore();
    updateLives();
    levelDisplay.textContent = '';
}

function updateScore() {
    // Show score with best
    if (highScore > 0) {
        scoreDisplay.innerHTML = `${score} <span style="color:#888;font-size:0.8em">(Best: ${highScore})</span>`;
    } else {
        scoreDisplay.textContent = score;
    }
    const diff = getDifficulty();
    if (diff.name) {
        difficultyDisplay.textContent = `[${diff.name}]`;
    } else {
        difficultyDisplay.textContent = '';
    }
}

function updateLives() {
    let hearts = '';
    for (let i = 0; i < 3; i++) {
        hearts += i < lives ? '❤️' : '🖤';
    }
    livesDisplay.innerHTML = hearts;
}

function showGameOver() {
    const quote = DEATH_QUOTES[Math.floor(Math.random() * DEATH_QUOTES.length)];
    document.getElementById('death-quote').textContent = `"${quote}"`;
    finalScoreDisplay.textContent = score;
    playerNameInput.value = localStorage.getItem('lobsterPlayerName') || '';
    nameInput.style.display = 'block';
    setTimeout(() => playerNameInput.focus(), 100);
}

async function submitScore() {
    const name = playerNameInput.value.trim() || 'Anonymous';
    localStorage.setItem('lobsterPlayerName', name);
    
    try {
        await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score, session: gameSessionId })
        });
        fetchLeaderboard();
    } catch (err) {
        console.error('Failed to submit score:', err);
    }
    
    returnToTitle();
}

function returnToTitle() {
    nameInput.style.display = 'none';
    audio.stopMusic();
    gameStarted = false;
    document.getElementById('title-hs').textContent = highScore;
    titleScreen.classList.remove('hidden');
    fetchLeaderboard();
}

async function fetchLeaderboard() {
    try {
        const res = await fetch('/api/scores');
        const scores = await res.json();
        const isMobile = window.innerWidth <= 820;
        const limit = isMobile ? 5 : 10;
        const top = scores.slice(0, limit);
        
        if (top.length === 0) {
            leaderboard.innerHTML = 'No scores yet!';
            return;
        }
        
        leaderboard.innerHTML = top.map((s, i) => 
            `<div>${i + 1}. ${escapeHtml(s.name)}: ${s.score}</div>`
        ).join('');
    } catch (err) {
        leaderboard.innerHTML = 'Could not load scores';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start when DOM ready
document.addEventListener('DOMContentLoaded', init);

// Dev mode functions - exposed to window for dev panel
let godMode = false;

window.gameDevSetLevel = (lvl) => {
    if (!gameStarted) return;
    currentLevel = lvl;
    const level = LEVELS[lvl];
    if (level) {
        document.body.style.background = level.background;
        document.getElementById('level-name').textContent = level.name;
        if (lvl >= 2 && nets.length === 0) nets = Net.create(2, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (lvl >= 3 && forks.length === 0) forks = Fork.create(3, CANVAS_WIDTH, CANVAS_HEIGHT);
        audio.startLevelMusic(lvl);
    }
};

window.gameDevAddScore = (pts) => {
    if (!gameStarted) return;
    score += pts;
    updateScore();
    checkLevelUp();
};

window.gameDevToggleGod = () => {
    godMode = !godMode;
    invincible = godMode;
    if (godMode) invincibleTimer = 999999;
    return godMode;
};

window.gameDevSpawnFish = () => {
    if (!gameStarted) return;
    fish = new GoldenFish(CANVAS_WIDTH);
};

window.gameDevAddLife = () => {
    if (!gameStarted) return;
    lives++;
    updateLives();
};

window.gameDevRemoveLife = () => {
    if (!gameStarted) return;
    loseLife();
};
