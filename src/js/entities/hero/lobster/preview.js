import { render as v001 } from './render/Lobster.v001.js';
import { render as v002 } from './render/Lobster.v002.js';
import { render as v003 } from './render/Lobster.v003.js';
import { render as v004 } from './render/Lobster.v004.js';
import { render as v005 } from './render/Lobster.v005.js';
import { render as v006 } from './render/Lobster.v006.js';
import { render as egg001 } from './render/LobsterEgg.v001.js';

export const manifest = {
    id: 'lobster',
    name: 'Lobster',
    description: 'Player character with tail physics. Use Stage slider to switch baby/adult forms.',
    category: 'hero',
    tags: [],
    configKey: 'player',
};

export const defaults = { size: 30, stage: 1, eggGrowth: 0.5 };

function fakeTail(x, y, size) {
    const segs = [];
    for (let i = 0; i < 3; i++) {
        segs.push({ x: x - size * (0.6 + i * 0.4), y, angle: 0 });
    }
    return segs;
}

export const versions = [
    {
        meta: { version: '001', name: 'Circle', current: false },
        preview: (ctx, w, h, frame, state) => v001(ctx, w / 2, h / 2, state.size),
    },
    {
        meta: { version: '002', name: 'Claws', current: false },
        preview: (ctx, w, h, frame, state) => v002(ctx, w / 2, h / 2, state.size),
    },
    {
        meta: { version: '003', name: 'Tail Physics', current: false },
        preview: (ctx, w, h, frame, state) => {
            const x = w / 2, y = h / 2;
            v003(ctx, x, y, state.size, 0, fakeTail(x, y, state.size), false, 0);
        },
    },
    {
        meta: { version: '004', name: 'Adult Lobster', current: false },
        preview: (ctx, w, h, frame, state) => {
            const x = w / 2, y = h / 2;
            v004(ctx, x, y, state.size, 0, fakeTail(x, y, state.size), false, 0);
        },
    },
    {
        meta: { version: '005', name: 'Baby/Adult (Stage)', current: false },
        preview: (ctx, w, h, frame, state) => {
            const x = w / 2, y = h / 2;
            v005(ctx, x, y, state.size, 0, fakeTail(x, y, state.size), false, 0, state.stage);
        },
    },
    {
        meta: { version: '006', name: 'With Legs (Stage)', current: true },
        preview: (ctx, w, h, frame, state) => {
            const x = w / 2, y = h / 2;
            v006(ctx, x, y, state.size, 0, fakeTail(x, y, state.size), false, 0, state.stage);
        },
    },
    {
        meta: { version: 'egg', name: 'Egg (Growth)', current: true },
        preview: (ctx, w, h, frame, state) => {
            egg001(ctx, w / 2, h / 2, state.size * 0.6, frame, state.eggGrowth);
        },
    },
];

export const renderControls = [
    { key: 'size', type: 'range', min: 10, max: 60, value: 30, label: 'Size' },
    { key: 'stage', type: 'range', min: 1, max: 3, value: 1, label: 'Stage (1=Baby, 2+=Adult)' },
    { key: 'eggGrowth', type: 'range', min: 0, max: 1, value: 0.5, step: 0.01, label: 'Egg Growth' },
];
