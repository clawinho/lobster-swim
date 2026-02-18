import { render as v001 } from './render/EggPredator.v001.js';

export const manifest = {
    id: 'egg-predator',
    name: 'Egg Predator',
    description: 'Small translucent fish that preys on lobster eggs during Birth level.',
    category: 'enemies',
    tags: ['birth-level', 'fish', 'predator'],
    configKey: null,
};

export const defaults = { size: 30, frame: 0 };

export const versions = [
    {
        meta: { version: '001', name: 'Predator Fish', current: true },
        preview: (ctx, w, h, frame) => {
            v001(ctx, w * 0.35, h / 2, 30, frame, 1);
            v001(ctx, w * 0.7, h / 2, 25, frame, -1);
        },
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 15, max: 50, value: 30, label: 'Size' },
];
