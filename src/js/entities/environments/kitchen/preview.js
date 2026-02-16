import { render as v001 } from './render/Kitchen.v001.js';
import { Kitchen } from './actor/Kitchen.js';

export const manifest = {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Level 3 — The Kitchen',
    category: 'environments',
    tags: [],
    configKey: null,
};

export const defaults = {};

export const versions = [
    {
        meta: { version: '001', name: 'Kitchen', current: true },
        preview: (ctx, w, h, frame, state) => {
            ctx.fillStyle = Kitchen.config.background;
            ctx.fillRect(0, 0, w, h);
            ctx.save();
            ctx.scale(w / 600, h / 600);
            v001(ctx, 600, 600);
            ctx.restore();
        },
    },
];
