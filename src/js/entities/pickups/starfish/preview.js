import { render as v001 } from './render/Starfish.v001.js';

export const manifest = {
    id: 'starfish',
    name: 'Starfish',
    description: 'Golden starfish pickup. Grants 2x score multiplier for 8 seconds.',
    category: 'pickups',
    tags: ['multiplier', 'score'],
    configKey: null,
};

export const defaults = { size: 20 };

export const versions = [
    {
        meta: { version: '001', name: 'Golden Starfish', current: true },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2, frame, state.size),
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 10, max: 40, value: 20, label: 'Size' },
];
