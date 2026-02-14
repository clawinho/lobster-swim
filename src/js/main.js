/**
 * main.js - Entry point
 * Initializes the game and connects UI components
 */

import { Game } from './game.js';
import { Audio } from './audio-module.js';

class LobsterSwim {
    constructor() {
        this.game = null;
        this.audio = null;
        this.titleScreen = null;
        this.leaderboard = null;

        this.init();
    }

    async init() {
        // Wait for DOM
        if (document.readyState !== 'complete') {
            await new Promise(resolve => window.addEventListener('load', resolve));
        }

        // Get elements
        const canvas = document.getElementById('game');
        this.titleScreen = document.getElementById('title-screen');
        this.scoreDisplay = document.getElementById('score');
        this.livesDisplay = document.getElementById('lives');
        this.levelDisplay = document.getElementById('level-name');
        this.difficultyDisplay = document.getElementById('difficulty');

        // Initialize audio
        this.audio = new Audio();

        // Initialize game
        this.game = new Game(canvas, this.audio);

        // Connect callbacks
        this.game.onScoreChange = (score) => this.updateScore(score);
        this.game.onLivesChange = (lives) => this.updateLives(lives);
        this.game.onLevelChange = (level, data) => this.updateLevel(level, data);
        this.game.onGameOver = (score) => this.showGameOver(score);

        // Setup UI events
        this.setupEvents(canvas);

        // Show title screen
        this.showTitleScreen();

        console.log('🦞 Lobster Swim initialized');
    }

    setupEvents(canvas) {
        // Play button
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.startGame());
        }

        // Canvas touch/click
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            this.game.setTarget(x, y);
        });

        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            this.game.setTarget(x, y);
        }, { passive: false });

        // Joystick (if exists)
        this.setupJoystick();

        // Music toggle
        const musicBtn = document.getElementById('music-btn');
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                const enabled = this.audio.toggleMusic();
                musicBtn.style.opacity = enabled ? '0.8' : '0.4';
            });
        }

        // SFX toggle
        const sfxBtn = document.getElementById('sfx-btn');
        if (sfxBtn) {
            sfxBtn.addEventListener('click', () => {
                const enabled = this.audio.toggleSfx();
                sfxBtn.style.opacity = enabled ? '0.8' : '0.4';
            });
        }
    }

    setupJoystick() {
        const joystickBase = document.getElementById('joystick-base');
        const joystickKnob = document.getElementById('joystick-knob');
        if (!joystickBase || !joystickKnob) return;

        let joystickActive = false;
        let joystickCenter = { x: 0, y: 0 };

        const updateJoystick = (clientX, clientY) => {
            const rect = joystickBase.getBoundingClientRect();
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

            joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
            this.game.setJoystick(dx / maxDist, dy / maxDist);
        };

        joystickBase.addEventListener('touchstart', (e) => {
            e.preventDefault();
            joystickActive = true;
            updateJoystick(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (joystickActive && e.touches.length > 0) {
                updateJoystick(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            joystickActive = false;
            joystickKnob.style.transform = 'translate(-50%, -50%)';
            this.game.setJoystick(0, 0);
        });
    }

    showTitleScreen() {
        if (this.titleScreen) {
            this.titleScreen.classList.remove('hidden');
        }
        // Update high score display
        const hsDisplay = document.getElementById('title-hs');
        if (hsDisplay) {
            hsDisplay.textContent = this.game.highScore;
        }
    }

    hideTitleScreen() {
        if (this.titleScreen) {
            this.titleScreen.classList.add('hidden');
        }
    }

    startGame() {
        this.hideTitleScreen();
        this.audio.init();
        this.audio.startLevelMusic(1);
        this.game.start();
    }

    updateScore(score) {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = score;
        }
        // Update difficulty display
        const diff = this.game.getDifficulty();
        if (this.difficultyDisplay && diff.name) {
            this.difficultyDisplay.textContent = `[${diff.name}]`;
        }
    }

    updateLives(lives) {
        if (this.livesDisplay) {
            let hearts = '';
            for (let i = 0; i < 3; i++) {
                hearts += i < lives ? '❤️' : '🖤';
            }
            this.livesDisplay.innerHTML = hearts;
        }
    }

    updateLevel(level, data) {
        if (this.levelDisplay) {
            this.levelDisplay.textContent = data.name;
        }
        document.body.style.background = data.background;
        this.audio.startLevelMusic(level);
    }

    showGameOver(score) {
        // Show name input modal
        const nameInput = document.getElementById('name-input');
        const finalScore = document.getElementById('final-score-display');
        if (nameInput) {
            nameInput.style.display = 'block';
        }
        if (finalScore) {
            finalScore.textContent = score;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.lobsterSwim = new LobsterSwim();
});
