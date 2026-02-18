import { render as v001 } from './render/FallingPickup.v001.js';

export const manifest = {
    id: 'falling-pickup',
    name: 'Falling Pickup',
    description: 'Shells, clams, and seaweed that fall from above and land on the ocean floor. Collect them for points!',
    category: 'pickups',
    tags: ['floor', 'collectible', 'level-1'],
    configKey: null,
};

export const defaults = { size: 22, type: 'shell', landed: false };

export const versions = [
    {
        meta: { version: '001', name: 'Ocean Treasures', current: true },
        preview: (ctx, w, h, frame, state) => {
            // Show all three types side by side
            v001(ctx, w * 0.2, h * 0.5, state.size, frame, 'shell', state.landed);
            v001(ctx, w * 0.5, h * 0.5, state.size, frame, 'clam', state.landed);
            v001(ctx, w * 0.8, h * 0.5, state.size, frame, 'seaweed', state.landed);
        },
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 10, max: 40, value: 22, label: 'Size' },
    { key: 'landed', type: 'checkbox', value: false, label: 'Landed' },
];
