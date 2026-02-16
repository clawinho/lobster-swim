import { render as v001 } from './render/Bubble.v001.js';
import { render as v002 } from './render/Bubble.v002.js';

export const manifest = {
    id: 'bubble',
    name: 'Bubble',
    description: 'Collectible. v002 has gradient!',
    category: 'pickups',
    tags: [],
    configKey: 'bubbles',
};

export const defaults = { size: 18, color: 'blue' };

export const renderControls = [
    { key: 'color', type: 'buttons', options: ['blue', 'pink', 'green', 'gold'], value: 'blue', label: 'Color' },
];

export const versions = [
    {
        meta: { version: '001', name: 'Simple', current: false },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2, state.size, frame, state.color),
    },
    {
        meta: { version: '002', name: 'Gradient', current: true },
        preview: (ctx, w, h, frame, state) => v002(ctx, w / 2, h / 2, state.size, frame, state.color),
    },
];
