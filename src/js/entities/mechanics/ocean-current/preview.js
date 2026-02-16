import { render as v001 } from './render/OceanCurrent.v001.js';

export const manifest = {
    id: 'ocean-current',
    name: 'Ocean Current',
    description: 'Gentle currents that push the player.',
    category: 'mechanics',
    tags: [],
    configKey: 'oceanCurrent',
};

export const defaults = { baseStrength: 1, angle: 0 };

export const versions = [
    {
        meta: { version: '001', name: 'Flow Lines', current: true },
        preview: (ctx, w, h, frame, state) => v001(ctx, w, h, frame, state.baseStrength, state.angle),
    },
];
