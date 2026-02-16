import { render as v001 } from './render/GoldenFish.v001.js';
import { render as v002 } from './render/GoldenFish.v002.js';

export const manifest = {
    id: 'fish',
    name: 'Golden Fish',
    description: '+1 life pickup. v002 has shimmer!',
    category: 'pickups',
    tags: [],
    configKey: 'fish',
};

export const defaults = { size: 15, shimmer: 5 };

export const renderControls = [
    { key: 'shimmer', type: 'range', min: 0, max: 10, value: 5, label: 'Shimmer' },
];

export const versions = [
    {
        meta: { version: '001', name: 'Flat Gold', current: true },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2, state.size, 1),
    },
    {
        meta: { version: '002', name: 'Shimmer', current: false },
        preview: (ctx, w, h, frame, state) => v002(ctx, w / 2, h / 2, frame, state.size, 1, state.shimmer),
    },
];
