import { render } from './render/Difficulty.js';

export const manifest = {
    id: 'difficulty',
    name: 'Difficulty Scaling',
    description: 'Speed and enemy count scale with score.',
    category: 'mechanics',
    tags: ['progression'],
    configKey: null,
};

export const defaults = {};

export const versions = [
    {
        meta: { version: '001', name: 'Scaling Graph', current: true },
        preview: (ctx, w, h, frame, state) => render(ctx, w, h),
    },
];
