/**
 * KitchenLevel.js - Level 3 game class
 * Self-contained level entity following the game-class + versioned-renderer pattern.
 */
import { render as renderKitchenBg } from './versions/KitchenLevel.v001.js';

export class KitchenLevel {
    static config = {
        name: 'The Kitchen',
        subtitle: 'Escape the pot or become dinner',
        background: '#1a0a05',
        scoreThreshold: 500,
        musicTrack: 'assets/music/music_kitchen.mp3',
        enemies: { hooks: 2, nets: 2, forks: 3 },
        spawnOnEnter: { forks: 3 },
        mechanics: [],
    };

    renderBackground(ctx, w, h, scrollX) {
        ctx.fillStyle = KitchenLevel.config.background;
        ctx.fillRect(0, 0, w, h);
        renderKitchenBg(ctx, w, h);
    }
}
