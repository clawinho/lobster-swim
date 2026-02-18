/**
 * audio-module.js - Sound effects and music management (ES6 module version)
 */

// Crossfade timing constants (frame counts at 60fps)
const FADE_OUT_FRAMES = 90;  // 1.5s fade out
const FADE_IN_FRAMES = 60;   // 1s fade in
const FADE_IN_DELAY = 30;    // 0.5s delay before new track starts

export class Audio {
    constructor() {
        this.ctx = null;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.currentTrack = null;
        this.currentTrackPath = null;

        // Crossfade state
        this.fadingOutTrack = null;
        this.fadeOutTimer = 0;
        this.pendingTrackEl = null;
        this.pendingTrackPath = null;
        this.fadeInTimer = 0;
        this.fadeInDelay = 0;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // iOS unlock
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    // Music control — accepts a track file path (e.g. 'assets/music/music_ocean.mp3')
    startLevelMusic(trackPath) {
        if (!this.musicEnabled) return;
        if (this.currentTrackPath === trackPath && this.currentTrack) return;

        this.stopMusic();
        this.currentTrackPath = trackPath;

        if (!trackPath) return;

        this.currentTrack = new window.Audio(trackPath);
        this.currentTrack.loop = true;
        this.currentTrack.volume = 1.0;
        this.currentTrack.play().catch(() => {});
    }

    // Crossfade from current track to a new track
    crossfadeTo(trackPath) {
        if (!this.musicEnabled) return;
        if (this.currentTrackPath === trackPath && this.currentTrack) return;

        // Move current track to fading-out slot
        if (this.currentTrack) {
            this.fadingOutTrack = this.currentTrack;
            this.fadeOutTimer = FADE_OUT_FRAMES;
        }

        // Clean up any previous pending track
        if (this.pendingTrackEl) {
            this.pendingTrackEl.pause();
            this.pendingTrackEl = null;
        }

        this.currentTrack = null;
        this.currentTrackPath = trackPath;

        if (!trackPath) return;

        // Create new track at volume 0, queue it
        this.pendingTrackEl = new window.Audio(trackPath);
        this.pendingTrackEl.loop = true;
        this.pendingTrackEl.volume = 0;
        this.pendingTrackPath = trackPath;
        this.fadeInDelay = FADE_IN_DELAY;
        this.fadeInTimer = 0;
    }

    // Call every frame from the game loop to drive crossfade volumes
    updateFade() {
        // Fade out old track
        if (this.fadingOutTrack && this.fadeOutTimer > 0) {
            this.fadeOutTimer--;
            this.fadingOutTrack.volume = Math.max(0, this.fadeOutTimer / FADE_OUT_FRAMES);
            if (this.fadeOutTimer <= 0) {
                this.fadingOutTrack.pause();
                this.fadingOutTrack.currentTime = 0;
                this.fadingOutTrack = null;
            }
        }

        // Delay before starting new track
        if (this.pendingTrackEl && this.fadeInDelay > 0) {
            this.fadeInDelay--;
            if (this.fadeInDelay <= 0) {
                // Start playing the new track
                this.pendingTrackEl.play().catch(() => {});
                this.fadeInTimer = FADE_IN_FRAMES;
            }
        }

        // Fade in new track
        if (this.pendingTrackEl && this.fadeInTimer > 0) {
            this.fadeInTimer--;
            const progress = 1 - (this.fadeInTimer / FADE_IN_FRAMES);
            this.pendingTrackEl.volume = Math.min(1, progress);
            if (this.fadeInTimer <= 0) {
                // Fade-in complete — promote to current track
                this.pendingTrackEl.volume = 1.0;
                this.currentTrack = this.pendingTrackEl;
                this.currentTrackPath = this.pendingTrackPath;
                this.pendingTrackEl = null;
                this.pendingTrackPath = null;
            }
        }
    }

    stopMusic() {
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
            this.currentTrack = null;
        }
        // Clean up crossfade state
        if (this.fadingOutTrack) {
            this.fadingOutTrack.pause();
            this.fadingOutTrack.currentTime = 0;
            this.fadingOutTrack = null;
        }
        if (this.pendingTrackEl) {
            this.pendingTrackEl.pause();
            this.pendingTrackEl = null;
        }
        this.fadeOutTimer = 0;
        this.fadeInTimer = 0;
        this.fadeInDelay = 0;
        this.pendingTrackPath = null;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled && this.currentTrackPath) {
            this.startLevelMusic(this.currentTrackPath);
        } else {
            this.stopMusic();
        }
        return this.musicEnabled;
    }

    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    // Sound effects using Web Audio API
    playBloop() {
        if (!this.sfxEnabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playHit() {
        if (!this.sfxEnabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.2);
    }

    playDeath() {
        if (!this.sfxEnabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.5);
    }

    playExtraLife() {
        if (!this.sfxEnabled) return;
        this.init();

        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.1 + 0.15);

            osc.start(this.ctx.currentTime + i * 0.1);
            osc.stop(this.ctx.currentTime + i * 0.1 + 0.15);
        });
    }

    playHooked() {
        if (!this.sfxEnabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.8);
    }


    playHighScore() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.12);
            gain.gain.setValueAtTime(0.3, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.5);
            osc.connect(gain).connect(this.ctx.destination);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.5);
        });
        [523.25, 659.25, 783.99, 1046.50].forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + 0.7);
            gain.gain.setValueAtTime(0.2, now + 0.7);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);
            osc.connect(gain).connect(this.ctx.destination);
            osc.start(now + 0.7);
            osc.stop(now + 1.8);
        });
    }

    playLevelUp() {
        if (!this.sfxEnabled) return;
        this.init();

        const notes = [392, 494, 587, 784]; // G4, B4, D5, G5
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.15);
            gain.gain.setValueAtTime(0.4, this.ctx.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.15 + 0.2);

            osc.start(this.ctx.currentTime + i * 0.15);
            osc.stop(this.ctx.currentTime + i * 0.15 + 0.2);
        });
    }

    /**
     * THX/Kubrick-style deep drone soundscape for Birth level intro.
     * Low rumbling that swells and decays over ~4 seconds.
     * Returns duration in seconds.
     */
    playBirthIntro() {
        if (!this.sfxEnabled) return 4;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = 4.0;

        // Master gain envelope: swell up then decay
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0, now);
        master.gain.linearRampToValueAtTime(0.35, now + 1.8);
        master.gain.linearRampToValueAtTime(0.4, now + 2.5);
        master.gain.exponentialRampToValueAtTime(0.001, now + duration);
        master.connect(ctx.destination);

        // Deep bass drone — multiple detuned oscillators for richness
        const bassFreqs = [32, 33, 40, 48, 64];
        bassFreqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = i < 2 ? "sawtooth" : "sine";
            osc.frequency.setValueAtTime(freq, now);
            // Slowly converge frequencies for THX-like effect
            osc.frequency.linearRampToValueAtTime(freq * 0.85 + 10, now + 2.0);
            osc.frequency.linearRampToValueAtTime(freq, now + 3.0);
            gain.gain.setValueAtTime(i < 2 ? 0.15 : 0.2, now);
            osc.connect(gain).connect(master);
            osc.start(now);
            osc.stop(now + duration + 0.5);
        });

        // Sub-harmonic rumble
        const sub = ctx.createOscillator();
        sub.type = "sine";
        sub.frequency.setValueAtTime(22, now);
        sub.frequency.linearRampToValueAtTime(28, now + 2);
        sub.frequency.linearRampToValueAtTime(20, now + duration);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.3, now);
        sub.connect(subGain).connect(master);
        sub.start(now);
        sub.stop(now + duration + 0.5);

        // Filtered noise for texture
        const bufferSize = ctx.sampleRate * (duration + 1);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.setValueAtTime(80, now);
        noiseFilter.frequency.linearRampToValueAtTime(200, now + 2);
        noiseFilter.frequency.linearRampToValueAtTime(60, now + duration);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, now);
        noise.connect(noiseFilter).connect(noiseGain).connect(master);
        noise.start(now);
        noise.stop(now + duration + 0.5);

        return duration;
    }

    // Subtle ambient heartbeat thump — played on each beat
    playHeartbeat(synced = false) {
        if (!this.sfxEnabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const master = ctx.createGain();
        master.gain.setValueAtTime(synced ? 0.2 : 0.08, now);
        master.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        master.connect(ctx.destination);

        // Low thump — sub-bass
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(synced ? 55 : 40, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.25);
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 0.35);

        if (synced) {
            // Second thump for synced tap (lub-DUB)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(65, now + 0.12);
            osc2.frequency.exponentialRampToValueAtTime(30, now + 0.35);
            gain2.gain.setValueAtTime(0.15, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc2.connect(gain2).connect(ctx.destination);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.45);
        }
    }
}