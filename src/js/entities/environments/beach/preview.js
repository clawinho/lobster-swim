import { render as v001 } from './render/Beach.v001.js';
import { render as v002 } from './render/Beach.v002.js';

export const manifest = {
    id: 'beach',
    name: 'The Beach',
    description: 'Underwater camera looking toward shore. Sloping sand bank, god rays, crashing waves from below.',
    category: 'environments',
    tags: ['level-3', 'beach'],
    configKey: null,
};

export const defaults = {};

export const versions = [
    {
        meta: { version: '001', name: 'Beach — Above Water', current: false },
        preview: (ctx, w, h, frame) => v001(ctx, w, h, 0),
    },
    {
        meta: { version: '002', name: 'Beach — Underwater View', current: true },
        preview: (ctx, w, h, frame) => v002(ctx, w, h, 0),
    },
];
