/**
 * audio.js - Sound effects and music management
 */

const Audio = {
    ctx: null,
    musicEnabled: true,
    sfxEnabled: true,
    currentTrack: null,
    currentLevel: 0,
    
    levelTracks: {
        1: 'assets/music/music_ocean.mp3',
        2: 'assets/music/music_tank.mp3',
        3: 'assets/music/music_kitchen.mp3'
    },
    
    init() {
        // Create audio context on first user interaction
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.ctx;
    },
    
    // Music control
    startLevelMusic(level) {
        if (!this.musicEnabled) return;
        if (this.currentLevel === level && this.currentTrack) return;
        
        this.stopMusic();
        this.currentLevel = level;
        
        const track = this.levelTracks[level];
        if (!track) return;
        
        this.currentTrack = new window.Audio(track);
        this.currentTrack.loop = true;
        this.currentTrack.volume = 1.0;
        this.currentTrack.play().catch(() => {});
    },
    
    stopMusic() {
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
            this.currentTrack = null;
        }
    },
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.startLevelMusic(this.currentLevel || 1);
        } else {
            this.stopMusic();
        }
        return this.musicEnabled;
    },
    
    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    },
    
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
    },
    
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
    },
    
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
    },
    
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
    },
    
    playHooked() {
        if (!this.sfxEnabled) return;
        this.init();
        
        // Dramatic descending tone
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
    },
    
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
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Audio;
}
