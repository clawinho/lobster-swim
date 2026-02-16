import { render } from './render/Magnetism.js';

export const manifest = {
    id: 'magnetism',
    name: 'Bubble Magnetism',
    description: 'Bubbles attracted to lobster within radius.',
    category: 'mechanics',
    tags: ['core'],
    configKey: null,
};

export const defaults = { radius: 80, strength: 3 };

export const renderControls = [
    { key: 'radius', type: 'range', min: 30, max: 150, value: 80, label: 'Radius' },
    { key: 'strength', type: 'range', min: 1, max: 10, value: 3, label: 'Strength' },
];

export const versions = [
    {
        meta: { version: '001', name: 'Magnetism', current: true },
        preview: (ctx, w, h, frame, state) => render(ctx, w, h, frame, state.radius, state.strength),
    },
];
