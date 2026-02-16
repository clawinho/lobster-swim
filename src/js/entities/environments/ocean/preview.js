import { render as v001 } from './render/Ocean.v001.js';
import { Ocean } from './actor/Ocean.js';

export const manifest = {
    id: 'ocean',
    name: 'Ocean',
    description: 'Level 1 — The Ocean',
    category: 'environments',
    tags: [],
    configKey: null,
};

export const defaults = {};

export const versions = [
    {
        meta: { version: '001', name: 'Ocean', current: true },
        preview: (ctx, w, h, frame, state) => {
            ctx.fillStyle = Ocean.config.background;
            ctx.fillRect(0, 0, w, h);
            ctx.save();
            ctx.scale(w / 600, h / 600);
            v001(ctx, 600, 600, frame * 0.5);
            ctx.restore();
        },
    },
];
