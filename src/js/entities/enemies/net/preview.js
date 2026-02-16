import { render as v001 } from './render/Net.v001.js';

export const manifest = {
    id: 'net',
    name: 'Net',
    description: 'Level 2 sweeping hazard.',
    category: 'enemies',
    tags: [],
    configKey: 'nets',
};

export const defaults = { width: 80, height: 60 };

export const versions = [
    {
        meta: { version: '001', name: 'Fishing Net', current: true },
        preview: (ctx, w, h, frame, state) => {
            v001(ctx, w / 2 - state.width / 2, h / 2 - state.height / 2, state.width, state.height);
        },
    },
];
