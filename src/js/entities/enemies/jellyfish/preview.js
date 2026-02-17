import { render as v001 } from './render/Jellyfish.v001.js';

export const manifest = {
    id: 'jellyfish',
    name: 'Jellyfish',
    description: 'Translucent pulsating jellyfish that stuns the lobster on contact.',
    category: 'enemies',
    tags: ['stun', 'glow'],
    configKey: null,
};

export const defaults = { size: 30 };

export const versions = [
    {
        meta: { version: '001', name: 'Translucent Jellyfish', current: true },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2, state.size, frame * 0.05),
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 15, max: 60, value: 30, label: 'Size' },
];
