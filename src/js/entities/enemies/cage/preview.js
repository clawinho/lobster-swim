import { render as v001 } from './render/Cage.v001.js';
import { render as v002 } from './render/Cage.v002.js';

export const manifest = {
    id: 'cage',
    name: 'Cage',
    description: 'Lobster trap.',
    category: 'enemies',
    tags: [],
    configKey: 'cages',
};

export const defaults = { size: 50 };

export const versions = [
    {
        meta: { version: '001', name: 'Void Zone', current: false },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2, state.size),
    },
    {
        meta: { version: '002', name: 'Wooden Trap', current: true },
        preview: (ctx, w, h, frame, state) => v002(ctx, w / 2, h / 2, state.size),
    },
];
