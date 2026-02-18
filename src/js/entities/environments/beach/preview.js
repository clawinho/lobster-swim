import { render as v001 } from './render/Beach.v001.js';
import { render as v002 } from './render/Beach.v002.js';
import { render as v003 } from './render/Beach.v003.js';

export const manifest = {
    id: 'beach',
    name: 'The Beach',
    description: 'Progressive shore approach: water recedes, sand rises, sky expands as lobster swims toward beach.',
    category: 'environments',
    tags: ['level-3', 'beach', 'scrolling'],
    configKey: null,
};

export const defaults = { progress: 0 };

export const versions = [
    {
        meta: { version: '001', name: 'Beach — Above Water', current: false },
        preview: (ctx, w, h, frame) => v001(ctx, w, h, 0),
    },
    {
        meta: { version: '002', name: 'Beach — Underwater View', current: false },
        preview: (ctx, w, h, frame) => v002(ctx, w, h, 0),
    },
    {
        meta: { version: '003', name: 'Beach — Progressive Shore Approach', current: true },
        preview: (ctx, w, h, frame, state) => v003(ctx, w, h, frame * 0.5, state.progress),
    },
];

export const renderControls = [
    { key: 'progress', type: 'range', min: 0, max: 1, step: 0.01, value: 0, label: 'Shore Progress' },
];
