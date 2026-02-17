import { render as v001 } from './render/Eel.v001.js';

export const manifest = {
    id: 'eel',
    name: 'Electric Eel',
    description: 'Fast sinuous predator that swims across the screen in a sine-wave pattern. Electric sparks crackle along its body. Lethal on contact.',
    category: 'enemies',
    tags: ['lethal', 'fast', 'electric'],
    configKey: null,
};

export const defaults = { size: 8 };

export const versions = [
    {
        meta: { version: '001', name: 'Electric Spark', current: true },
        preview: (ctx, w, h, frame, state) => {
            const phase = frame * 0.05;
            v001(ctx, w / 2, h / 2, state.size, phase, 1, frame * 0.08);
        },
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 4, max: 16, value: 8, label: 'Body Size' },
];
