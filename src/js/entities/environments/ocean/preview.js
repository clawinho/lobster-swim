import { render as v001 } from './render/Ocean.v001.js';
import { render as v002 } from './render/Ocean.v002.js';
import { render as v003 } from './render/Ocean.v003.js';
import { Ocean } from './actor/Ocean.js';

export const manifest = {
    id: 'ocean',
    name: 'Ocean',
    description: 'Level 1 — The Ocean. v003 adds deep atmosphere with bioluminescent particles and vignette.',
    category: 'environments',
    tags: [],
    configKey: null,
};

export const defaults = {};

export const versions = [
    {
        meta: { version: '001', name: 'Ocean — Basic', current: false },
        preview: (ctx, w, h, frame, state) => {
            ctx.fillStyle = '#001020';
            ctx.fillRect(0, 0, w, h);
            ctx.save();
            ctx.scale(w / 600, h / 600);
            v001(ctx, 600, 600, frame * 0.5);
            ctx.restore();
        },
    },
    {
        meta: { version: '002', name: 'Ocean — Deep', current: false },
        preview: (ctx, w, h, frame, state) => {
            ctx.fillStyle = '#001020';
            ctx.fillRect(0, 0, w, h);
            ctx.save();
            ctx.scale(w / 600, h / 600);
            v002(ctx, 600, 600, frame * 0.5);
            ctx.restore();
        },
    },
    {
        meta: { version: '003', name: 'Ocean — Depths', current: true },
        preview: (ctx, w, h, frame, state) => {
            ctx.fillStyle = Ocean.config.background;
            ctx.fillRect(0, 0, w, h);
            ctx.save();
            ctx.scale(w / 600, h / 600);
            v003(ctx, 600, 600, frame * 0.5);
            ctx.restore();
        },
    },
];
