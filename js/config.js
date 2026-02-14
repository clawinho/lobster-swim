/**
 * config.js - Game constants and configuration
 * Single source of truth for tunable values
 */

const Config = {
    // Version
    VERSION: 'v0.9.0',
    
    // Canvas
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Lobster
    LOBSTER_SIZE: 30,
    LOBSTER_SPEED: 5,
    TAIL_FOLLOW_SPEED: 0.15,
    
    // Bubble magnetism
    MAGNET_RADIUS: 80,
    MAGNET_STRENGTH: 2.5,
    
    // Invincibility
    INVINCIBLE_DURATION: 120, // frames
    
    // Difficulty thresholds
    DIFFICULTY: {
        1: { score: 0,    speedMult: 1.0, hookCount: 2, name: '' },
        2: { score: 100,  speedMult: 1.2, hookCount: 2, name: 'WARM' },
        3: { score: 200,  speedMult: 1.4, hookCount: 3, name: 'MEDIUM' },
        4: { score: 500,  speedMult: 1.6, hookCount: 3, name: 'HARD' },
        5: { score: 1000, speedMult: 2.0, hookCount: 4, name: 'HELL' }
    },
    
    // Level transitions
    LEVELS: {
        1: { name: 'Ocean',   minScore: 0,   background: 'ocean' },
        2: { name: 'Tank',    minScore: 200, background: 'tank' },
        3: { name: 'Kitchen', minScore: 500, background: 'kitchen' }
    },
    
    // Colors
    COLORS: {
        lobster: '#ff4500',
        lobsterDark: '#cc3300',
        lobsterLight: '#ff5500',
        antennae: '#ff6600',
        bubble: 'rgba(100, 180, 255, 0.5)',
        cage: '#664422',
        hook: '#ccc',
        hookLine: '#666',
        net: '#446688',
        fork: '#ccc',
        fish: '#ffdd00',
        fishTail: '#ffaa00'
    },
    
    // Audio
    AUDIO: {
        masterVolume: 1.0,
        musicVolume: 1.0,
        sfxVolume: 0.5
    },
    
    // Leaderboard
    LEADERBOARD_URL: '/scores',
    MAX_LEADERBOARD_ENTRIES: 10,
    
    // Spawning
    INITIAL_BUBBLES: 7,
    INITIAL_DANGERS: 4,
    INITIAL_HOOKS: 2,
    FISH_SPAWN_CHANCE: 0.001,
    
    // Get difficulty for a given score
    getDifficulty(score) {
        if (score >= 1000) return this.DIFFICULTY[5];
        if (score >= 500) return this.DIFFICULTY[4];
        if (score >= 200) return this.DIFFICULTY[3];
        if (score >= 100) return this.DIFFICULTY[2];
        return this.DIFFICULTY[1];
    },
    
    // Get level for a given score
    getLevel(score) {
        if (score >= 500) return 3;
        if (score >= 200) return 2;
        return 1;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
