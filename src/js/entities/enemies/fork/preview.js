import { render as v001 } from './render/Fork.v001.js';

export const manifest = {
    id: 'fork',
    name: 'Fork',
    description: 'Level 3 falling hazard.',
    category: 'enemies',
    tags: [],
    configKey: 'forks',
};

export const defaults = { size: 40 };

export const renderControls = [
    { key: 'size', type: 'range', min: 20, max: 60, value: 40, label: 'Size' },
];

export const versions = [
    {
        meta: { version: '001', name: 'Kitchen Fork', current: true },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2 + 10, state.size),
    },
];
