import { render as v001 } from './render/Tank.v001.js';
import { render as v002 } from './render/Tank.v002.js';
import { Tank } from './actor/Tank.js';

export const manifest = {
    id: 'tank',
    name: 'Tank',
    description: 'Level 2 — Seafood Tank',
    category: 'environments',
    tags: [],
    configKey: null,
};

export const defaults = {};

export const versions = [
    {
        meta: { version: '001', name: 'Tank — Basic', current: false },
        preview: (ctx, w, h, frame, state) => {
            ctx.fillStyle = Tank.config.background;
            ctx.fillRect(0, 0, w, h);
            ctx.save();
            ctx.scale(w / 600, h / 600);
            v001(ctx, 600, 600);
            ctx.restore();
        },
    },
    {
        meta: { version: '002', name: 'Tank — Glass', current: true },
        preview: (ctx, w, h, frame, state) => {
            ctx.fillStyle = Tank.config.background;
            ctx.fillRect(0, 0, w, h);
            ctx.save();
            ctx.scale(w / 600, h / 600);
            v002(ctx, 600, 600);
            ctx.restore();
        },
    },
];
