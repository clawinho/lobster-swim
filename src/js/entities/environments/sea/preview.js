import { render as v001 } from './render/Sea.v001.js';

export const manifest = {
    id: 'sea',
    name: 'The Sea',
    description: 'Open sea with a sliver of sky. Level 2 environment.',
    category: 'environments',
    tags: ['level-2', 'sea'],
    configKey: null,
};

export const defaults = {};

export const versions = [
    {
        meta: { version: '001', name: 'Open Sea', current: true },
        preview: (ctx, w, h, frame) => v001(ctx, w, h, 0),
    },
];
