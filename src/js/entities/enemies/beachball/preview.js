import { render as v001, meta as meta001 } from './render/BeachBall.v001.js';

export const manifest = {
    id: 'beachball',
    name: 'Beach Ball',
    description: 'Bouncing beach ball obstacle.',
    category: 'enemies',
    tags: [],
    configKey: 'beachBalls',
};

export const defaults = {
    radius: 35,
    colors: ['#ff4444', '#ffffff', '#ff4444', '#ffffff', '#ff4444', '#ffffff'],
};

export const versions = [
    {
        meta: meta001,
        preview: (ctx, w, h, frame, state) => {
            const rotation = frame * 0.03;
            v001(ctx, w / 2, h / 2, state.radius, rotation, state.colors);
        },
    },
];
