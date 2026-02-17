import { render as v001 } from './render/Beach.v001.js';

export const manifest = {
    id: 'beach',
    name: 'The Beach',
    description: 'Half sky and waves, half sandy floor. Level 3 environment.',
    category: 'environments',
    tags: ['level-3', 'beach'],
    configKey: null,
};

export const defaults = {};

export const versions = [
    {
        meta: { version: '001', name: 'Beach', current: true },
        preview: (ctx, w, h, frame) => v001(ctx, w, h, 0),
    },
];
