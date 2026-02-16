import { render as v001, meta as meta001 } from './render/Seagull.v001.js';

export const manifest = {
    id: 'seagull',
    name: 'Seagull',
    description: 'Diving seagull that swoops from above.',
    category: 'enemies',
    tags: [],
    configKey: 'seagulls',
};

export const defaults = {};

export const versions = [
    {
        meta: meta001,
        preview: (ctx, w, h, frame, state) => {
            const wingPhase = frame * 0.1;
            v001(ctx, w / 2, h / 2, wingPhase, false);
        },
    },
];
