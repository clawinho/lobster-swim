import { render as v001 } from './render/ClawsPowerup.v001.js';

export const manifest = {
    id: 'claws-powerup',
    name: 'Claws Powerup',
    description: 'Golden claws pickup — grants visual upgrade and defensive ability.',
    category: 'pickups',
    tags: ['powerup', 'progression'],
    configKey: null,
};

export const defaults = { size: 24, time: 0 };

export const versions = [
    {
        meta: { version: '001', name: 'Golden Claws', current: true },
        preview: (ctx, w, h, frame, state) => {
            state.time = frame;
            v001(ctx, w / 2, h / 2, state.size, state.time);
        },
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 10, max: 50, value: 24, label: 'Size' },
];
