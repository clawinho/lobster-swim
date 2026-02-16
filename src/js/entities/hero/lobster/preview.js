import { render as v001 } from './render/Lobster.v001.js';
import { render as v002 } from './render/Lobster.v002.js';
import { render as v003 } from './render/Lobster.v003.js';
import { render as v004 } from './render/Lobster.v004.js';

export const manifest = {
    id: 'lobster',
    name: 'Lobster',
    description: 'Player character with tail physics.',
    category: 'hero',
    tags: [],
    configKey: 'player',
};

export const defaults = { size: 30 };

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
        meta: { version: '004', name: 'Final', current: true },
        preview: (ctx, w, h, frame, state) => {
            const x = w / 2, y = h / 2;
            v004(ctx, x, y, state.size, 0, fakeTail(x, y, state.size), false, 0);
        },
    },
];
