import { render as v001 } from './render/Nutrient.v001.js';

export const manifest = {
    id: 'nutrient',
    name: 'Nutrient',
    description: 'Glowing organic matter in the egg clutch. Absorb to grow.',
    category: 'pickups',
    tags: ['birth-level', 'growth', 'bioluminescent'],
    configKey: null,
};

export const defaults = { size: 8, frame: 0, type: 'green' };

export const versions = [
    {
        meta: { version: '001', name: 'Nutrient Particle', current: true },
        preview: (ctx, w, h, frame) => {
            v001(ctx, w * 0.3, h / 2, 8, frame, 'green');
            v001(ctx, w * 0.5, h / 2, 10, frame, 'gold');
            v001(ctx, w * 0.7, h / 2, 8, frame, 'blue');
        },
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 3, max: 15, value: 8, label: 'Size' },
];
