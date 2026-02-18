import { render as v001 } from './render/SwimPowerup.v001.js';

export const manifest = {
    id: 'swim-powerup',
    name: 'Swim Powerup',
    description: 'Glowing wave pickup — collecting it unlocks swimming and transitions to Level 2.',
    category: 'pickups',
    tags: ['powerup', 'progression', 'level-transition'],
    configKey: null,
};

export const defaults = { size: 28, time: 0 };

export const versions = [
    {
        meta: { version: '001', name: 'Wave Glow', current: true },
        preview: (ctx, w, h, frame, state) => {
            state.time = frame;
            v001(ctx, w / 2, h / 2, state.size, state.time);
        },
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 10, max: 60, value: 28, label: 'Size' },
];
