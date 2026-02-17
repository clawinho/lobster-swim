/**
 * Sea.js - Level 2 game class
 * Open sea environment with sky visible at top.
 */
import { render as renderSeaBg } from '../render/Sea.v001.js';

export class Sea {
    static config = {
        name: 'The Sea',
        subtitle: 'Deeper waters, greater dangers',
        background: '#001830',
        scoreThreshold: 1000,
        musicTrack: 'assets/music/music_tank.mp3',
        enemies: { hooks: 3, cages: 3, nets: 2, jellyfish: 1, eels: true },
        spawnOnEnter: { nets: 1, hooks: 1 },
        mechanics: [],
    };

    renderBackground(ctx, w, h, scrollX) {
        ctx.fillStyle = Sea.config.background;
        ctx.fillRect(0, 0, w, h);
        renderSeaBg(ctx, w, h, scrollX);
    }
}
