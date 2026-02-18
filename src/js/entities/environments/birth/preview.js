import { render as v001 } from './render/Birth.v001.js';

export const manifest = {
    id: 'birth',
    name: 'Birth',
    description: 'Lobster egg clutch under mother\'s tail. Dark, bioluminescent, intimate.',
    category: 'environments',
    tags: ['level-0', 'birth', 'eggs', 'bioluminescent'],
    configKey: null,
};

export const defaults = { frame: 0, growthProgress: 0 };

export const versions = [
    {
        meta: { version: '001', name: 'Egg Clutch', current: true },
        preview: (ctx, w, h, frame, state) => v001(ctx, w, h, 0, frame, state.growthProgress),
    },
];

export const renderControls = [
    { key: 'growthProgress', type: 'range', min: 0, max: 1, value: 0, step: 0.01, label: 'Growth Progress' },
];
