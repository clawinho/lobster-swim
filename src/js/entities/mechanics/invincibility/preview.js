import { render } from './render/Invincibility.js';

export const manifest = {
    id: 'invincibility',
    name: 'Invincibility',
    description: 'Golden shield + flash on spawn/damage.',
    category: 'mechanics',
    tags: ['defensive'],
    configKey: null,
};

export const defaults = { duration: 120 };

export const renderControls = [
    {
        key: 'duration', type: 'range', min: 30, max: 180, value: 120, label: 'Duration',
        format: v => (v / 60).toFixed(1) + 's',
    },
];

export const versions = [
    {
        meta: { version: '001', name: 'Shield', current: true },
        preview: (ctx, w, h, frame, state) => render(ctx, w, h, frame, state.duration),
    },
];
