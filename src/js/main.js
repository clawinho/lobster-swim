/**
 * main.js - Entry point
 * Initializes the game and connects Web Components
 */

import { Game } from './game.js';
import { Audio } from './audio-module.js';
import './components/TitleScreen.js';
import './components/Leaderboard.js';
import './components/GameOver.js';

class LobsterSwim {
    constructor() {
        this.game = null;
        this.audio = null;
        this.titleScreen = null;
        this.leaderboard = null;
        this.gameOver = null;

        this.init();
    }

    async init() {
        // Wait for DOM
        if (document.readyState !== 'complete') {
            await new Promise(resolve => window.addEventListener('load', resolve));
        }

        // Get canvas
        const canvas = document.getElementById('game');

        // Get/create Web Components
        this.titleScreen = document.querySelector('title-screen');
        this.leaderboard = document.querySelector('leader-board');
        this.gameOver = document.querySelector('game-over');

        // Get UI elements
        this.scoreDisplay = document.getElementById('score');
        this.livesDisplay = document.getElementById('lives');
        this.levelDisplay = document.getElementById('level-name');
        this.difficultyDisplay = document.getElementById('difficulty');

        // Initialize audio
        this.audio = new Audio();

        // Initialize game
        this.game = new Game(canvas, this.audio);

        // Connect game callbacks
        this.game.onScoreChange = (score) => this.updateScore(score);
        this.game.onLivesChange = (lives) => this.updateLives(lives);
        this.game.onLevelChange = (level, data) => this.updateLevel(level, data);
        this.game.onGameOver = (score) => this.showGameOver(score);

        // Connect component callbacks
        if (this.titleScreen) {
            this.titleScreen.onPlay = () => this.startGame();
            this.titleScreen.setHighScore(this.game.highScore);
        }

        if (this.gameOver) {
            this.gameOver.onSubmit = (name, score) => this.submitScore(name, score);
            this.gameOver.onSkip = () => this.returnToTitle();
        }

        // Setup canvas events
        this.setupCanvasEvents(canvas);

        // Setup joystick
        this.setupJoystick();

        // Setup control buttons
        this.setupControlButtons();

        console.log('🦞 Lobster Swim initialized (modular)');
    }

    setupCanvasEvents(canvas) {
        // Mouse hold-down to move (tracks while dragging)
        let mouseIsDown = false;
        
        const handleMouseMove = (e) => {
            console.log('🎯 handleMouseMove called, gameStarted:', this.game.gameStarted);
            if (!this.game.gameStarted) {
                console.log('❌ game not started, ignoring');
                return;
            }
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            console.log('📍 setTarget:', x, y);
            this.game.setTarget(x, y);
        };
        
        canvas.addEventListener('mousedown', (e) => {
            console.log('🖱️ mousedown', e.clientX, e.clientY, 'gameStarted:', this.game.gameStarted);
            mouseIsDown = true;
            handleMouseMove(e);
        });
        
        document.addEventListener('mouseup', () => {
            console.log('🖱️ mouseup');
            mouseIsDown = false;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (mouseIsDown) {
                console.log('🖱️ mousemove while down');
                handleMouseMove(e);
            }
        });

        // Touch to move
        canvas.addEventListener('touchstart', (e) => {
            if (!this.game.gameStarted) return;
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            this.game.setTarget(x, y);
        }, { passive: false });
    }

    setupJoystick() {
        const joystickBase = document.getElementById('joystick-base');
        const joystickKnob = document.getElementById('joystick-knob');
        if (!joystickBase || !joystickKnob) return;

        let joystickActive = false;

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

    setupControlButtons() {
        const musicBtn = document.getElementById('music-btn');
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                const enabled = this.audio.toggleMusic();
                musicBtn.style.opacity = enabled ? '0.8' : '0.4';
            });
        }

        const sfxBtn = document.getElementById('sfx-btn');
        if (sfxBtn) {
            sfxBtn.addEventListener('click', () => {
                const enabled = this.audio.toggleSfx();
                sfxBtn.style.opacity = enabled ? '0.8' : '0.4';
            });
        }
    }

    startGame() {
        if (this.titleScreen) this.titleScreen.hide();
        this.audio.init();
        this.audio.startLevelMusic(1);
        this.game.start();
    }

    updateScore(score) {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = score;
        }
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
        if (this.gameOver) {
            this.gameOver.show(score);
        }
    }

    async submitScore(name, score) {
        if (this.leaderboard) {
            await this.leaderboard.submitScore(name, score);
        }
        this.returnToTitle();
    }

    returnToTitle() {
        this.audio.stopMusic();
        if (this.titleScreen) {
            this.titleScreen.setHighScore(this.game.highScore);
            this.titleScreen.show();
        }
        if (this.leaderboard) {
            this.leaderboard.refresh();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.lobsterSwim = new LobsterSwim();
});
