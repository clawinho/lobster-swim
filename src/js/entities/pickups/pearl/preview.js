import { render as v001 } from './render/Pearl.v001.js';

export const manifest = {
    id: 'pearl',
    name: 'Pearl',
    description: 'Rare invincibility pickup in oyster shell.',
    category: 'pickups',
    tags: [],
    configKey: 'pearl',
};

export const defaults = { size: 20 };

export const versions = [
    {
        meta: { version: '001', name: 'Oyster Pearl', current: true },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2, frame, state.size),
    },
];
