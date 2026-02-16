import { render as v001 } from './render/Hook.v001.js';
import { render as v002 } from './render/Hook.v002.js';

export const manifest = {
    id: 'hook',
    name: 'Hook',
    description: 'Pendulum swing hazard.',
    category: 'enemies',
    tags: [],
    configKey: 'hooks',
};

export const defaults = { lineLength: 100, swingSpeed: 0.03 };

export const versions = [
    {
        meta: { version: '001', name: 'Static Drop', current: false },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, state.lineLength),
    },
    {
        meta: { version: '002', name: 'Pendulum', current: true },
        preview: (ctx, w, h, frame, state) => {
            const hookX = w / 2 + Math.sin(frame * state.swingSpeed) * 15;
            v002(ctx, w / 2, hookX, state.lineLength);
        },
    },
];
