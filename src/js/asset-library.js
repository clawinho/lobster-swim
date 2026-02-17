/**
 * asset-library.js - Auto-discovering asset library generator
 *
 * Uses static imports for preview.js files (no build tool required)
 * and generates the full asset library UI: nav, sections, cards, controls, animate loop.
 */

import { ENTITY_CONFIG } from './components/EntityInspector.js';

const CATEGORIES = [
    { id: 'hero', label: 'Characters', emoji: '🦞' },
    { id: 'enemies', label: 'Enemies', emoji: '💀' },
    { id: 'pickups', label: 'Pickups', emoji: '✨' },
    { id: 'environments', label: 'Environments', emoji: '🌊' },
    { id: 'mechanics', label: 'Mechanics', emoji: '⚙️' },
];

import * as mod_0 from './entities/effects/particle/preview.js';
import * as mod_1 from './entities/enemies/beachball/preview.js';
import * as mod_2 from './entities/enemies/cage/preview.js';
import * as mod_3 from './entities/enemies/eel/preview.js';
import * as mod_4 from './entities/enemies/fork/preview.js';
import * as mod_5 from './entities/enemies/hook/preview.js';
import * as mod_6 from './entities/enemies/net/preview.js';
import * as mod_7 from './entities/enemies/seagull/preview.js';
import * as mod_8 from './entities/environments/kitchen/preview.js';
import * as mod_9 from './entities/environments/ocean/preview.js';
import * as mod_10 from './entities/environments/tank/preview.js';
import * as mod_11 from './entities/hero/lobster/preview.js';
import * as mod_12 from './entities/mechanics/difficulty/preview.js';
import * as mod_13 from './entities/mechanics/invincibility/preview.js';
import * as mod_14 from './entities/mechanics/magnetism/preview.js';
import * as mod_15 from './entities/mechanics/ocean-current/preview.js';
import * as mod_16 from './entities/pickups/bubble/preview.js';
import * as mod_17 from './entities/pickups/goldfish/preview.js';
import * as mod_18 from './entities/pickups/pearl/preview.js';
import * as mod_19 from './entities/pickups/starfish/preview.js';
import * as mod_20 from './entities/enemies/jellyfish/preview.js';
import * as mod_21 from './entities/environments/sea/preview.js';
import * as mod_22 from './entities/environments/beach/preview.js';

const modules = Object.fromEntries([
  ['./entities/effects/particle/preview.js', mod_0],
  ['./entities/enemies/beachball/preview.js', mod_1],
  ['./entities/enemies/cage/preview.js', mod_2],
  ['./entities/enemies/eel/preview.js', mod_3],
  ['./entities/enemies/fork/preview.js', mod_4],
  ['./entities/enemies/hook/preview.js', mod_5],
  ['./entities/enemies/net/preview.js', mod_6],
  ['./entities/enemies/seagull/preview.js', mod_7],
  ['./entities/environments/kitchen/preview.js', mod_8],
  ['./entities/environments/ocean/preview.js', mod_9],
  ['./entities/environments/tank/preview.js', mod_10],
  ['./entities/hero/lobster/preview.js', mod_11],
  ['./entities/mechanics/difficulty/preview.js', mod_12],
  ['./entities/mechanics/invincibility/preview.js', mod_13],
  ['./entities/mechanics/magnetism/preview.js', mod_14],
  ['./entities/mechanics/ocean-current/preview.js', mod_15],
  ['./entities/pickups/bubble/preview.js', mod_16],
  ['./entities/pickups/goldfish/preview.js', mod_17],
  ['./entities/pickups/pearl/preview.js', mod_18],
  ['./entities/pickups/starfish/preview.js', mod_19],
  ['./entities/enemies/jellyfish/preview.js', mod_20],
  ['./entities/environments/sea/preview.js', mod_21],
  ['./entities/environments/beach/preview.js', mod_22],
]);

export function buildAssetLibrary(container) {
    const entities = [];
    for (const [, mod] of Object.entries(modules)) {
        const state = { ...mod.defaults };

        // Auto-populate missing actor props from ENTITY_CONFIG
        const configKey = mod.manifest.configKey;
        if (configKey && ENTITY_CONFIG[configKey]) {
            for (const prop of ENTITY_CONFIG[configKey].props) {
                if (!(prop.key in state)) {
                    if (prop.readOnly) {
                        state[prop.key] = '—';
                    } else {
                        state[prop.key] = prop.min;
                    }
                }
            }
        }

        const currentIdx = mod.versions.findIndex(v => v.meta.current);
        entities.push({
            manifest: mod.manifest,
            versions: mod.versions,
            renderControls: mod.renderControls || [],
            state,
            selectedVersion: currentIdx >= 0 ? currentIdx : 0,
            canvas: null,
        });
    }

    // Group by category
    const grouped = new Map();
    for (const cat of CATEGORIES) grouped.set(cat.id, []);
    for (const e of entities) {
        const arr = grouped.get(e.manifest.category);
        if (arr) arr.push(e);
    }

    // Header
    const header = document.createElement('header');
    header.innerHTML = '<h1>🦞 Asset Library</h1><p>Modular entity versions — use tabs to switch versions</p>';
    container.appendChild(header);

    // Nav
    const nav = document.createElement('nav');
    nav.className = 'nav';
    for (const cat of CATEGORIES) {
        const a = document.createElement('a');
        a.href = `#${cat.id}`;
        a.textContent = cat.label;
        if (cat.id === 'hero') a.classList.add('active');
        nav.appendChild(a);
    }
    const audioLink = document.createElement('a');
    audioLink.href = '#audio';
    audioLink.textContent = 'Audio';
    nav.appendChild(audioLink);
    container.appendChild(nav);

    // Sections
    for (const cat of CATEGORIES) {
        const section = document.createElement('section');
        section.className = 'section';
        section.id = cat.id;
        if (cat.id === 'hero') section.classList.add('active');

        const h2 = document.createElement('h2');
        h2.textContent = `${cat.emoji} ${cat.label}`;
        section.appendChild(h2);

        const grid = document.createElement('div');
        grid.className = 'asset-grid';
        for (const entity of grouped.get(cat.id)) {
            grid.appendChild(createCard(entity));
        }
        section.appendChild(grid);
        container.appendChild(section);
    }

    // Nav switching (handles generated sections + static audio)
    nav.addEventListener('click', e => {
        const a = e.target.closest('a');
        if (!a) return;
        e.preventDefault();
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(a.getAttribute('href').slice(1));
        if (target) target.classList.add('active');
        nav.querySelectorAll('a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
    });

    // Animate loop
    let frame = 0;
    function animate() {
        frame++;
        for (const entity of entities) {
            if (!entity.canvas) continue;
            const ver = entity.versions[entity.selectedVersion];
            const ctx = entity.canvas.getContext('2d');
            ctx.clearRect(0, 0, 200, 150);
            ver.preview(ctx, 200, 150, frame, entity.state);
        }
        requestAnimationFrame(animate);
    }
    animate();
}

function createCard(entity) {
    const card = document.createElement('div');
    card.className = 'asset-card';

    // Version tabs
    const tabs = document.createElement('div');
    tabs.className = 'version-tabs';
    entity.versions.forEach((ver, i) => {
        const tab = document.createElement('span');
        tab.className = 'version-tab';
        if (i === entity.selectedVersion) tab.classList.add('active');
        tab.textContent = `v${ver.meta.version}`;
        if (ver.meta.current) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = '★';
            tab.appendChild(star);
        }
        tab.addEventListener('click', () => {
            entity.selectedVersion = i;
            tabs.querySelectorAll('.version-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
        tabs.appendChild(tab);
    });
    card.appendChild(tabs);

    // Canvas preview
    const preview = document.createElement('div');
    preview.className = 'asset-preview';
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 150;
    entity.canvas = canvas;
    preview.appendChild(canvas);
    card.appendChild(preview);

    // Info
    const info = document.createElement('div');
    info.className = 'asset-info';

    const h3 = document.createElement('h3');
    h3.textContent = entity.manifest.name;
    info.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = entity.manifest.description;
    info.appendChild(p);

    // Controls
    const configKey = entity.manifest.configKey;
    const entityConfig = configKey ? ENTITY_CONFIG[configKey] : null;
    const hasActorControls = entityConfig && entityConfig.props.some(prop => prop.key in entity.state);
    const hasRenderControls = entity.renderControls.length > 0;

    if (hasActorControls || hasRenderControls) {
        const controls = document.createElement('div');
        controls.className = 'controls';

        // Always show Render | Actor tabs
        const defaultPane = hasActorControls ? 'actor' : 'render';

        const paramTabs = document.createElement('div');
        paramTabs.className = 'param-tabs';

        const renderTab = document.createElement('span');
        renderTab.className = 'param-tab' + (defaultPane === 'render' ? ' active' : '');
        renderTab.textContent = 'Render';
        renderTab.dataset.pane = 'render';
        paramTabs.appendChild(renderTab);

        const actorTab = document.createElement('span');
        actorTab.className = 'param-tab' + (defaultPane === 'actor' ? ' active' : '');
        actorTab.textContent = 'Actor';
        actorTab.dataset.pane = 'actor';
        paramTabs.appendChild(actorTab);

        controls.appendChild(paramTabs);

        const renderPane = createRenderPane(entity);
        renderPane.dataset.pane = 'render';
        if (defaultPane === 'render') renderPane.classList.add('active');
        controls.appendChild(renderPane);

        const actorPane = createActorPane(entity, entityConfig);
        actorPane.dataset.pane = 'actor';
        if (defaultPane === 'actor') actorPane.classList.add('active');
        controls.appendChild(actorPane);

        // Tab switching
        paramTabs.addEventListener('click', e => {
            const tab = e.target.closest('.param-tab');
            if (!tab) return;
            paramTabs.querySelectorAll('.param-tab').forEach(t => t.classList.remove('active'));
            controls.querySelectorAll('.param-pane').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const pane = controls.querySelector(`.param-pane[data-pane="${tab.dataset.pane}"]`);
            if (pane) pane.classList.add('active');
        });

        info.appendChild(controls);
    }

    // Tags
    if (entity.manifest.tags && entity.manifest.tags.length > 0) {
        const meta = document.createElement('div');
        meta.className = 'asset-meta';
        for (const tag of entity.manifest.tags) {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            meta.appendChild(span);
        }
        info.appendChild(meta);
    }

    card.appendChild(info);
    return card;
}

function createRenderPane(entity) {
    const pane = document.createElement('div');
    pane.className = 'param-pane';
    for (const ctrl of entity.renderControls) {
        if (ctrl.type === 'range') {
            pane.appendChild(createSlider(ctrl, entity.state));
        } else if (ctrl.type === 'buttons') {
            pane.appendChild(createButtonGroup(ctrl, entity.state));
        } else if (ctrl.type === 'select') {
            pane.appendChild(createSelect(ctrl, entity.state));
        }
    }
    return pane;
}

function createActorPane(entity, config) {
    const pane = document.createElement('div');
    pane.className = 'param-pane';
    if (!config) return pane;
    for (const prop of config.props) {
        if (!(prop.key in entity.state)) continue;
        const row = document.createElement('div');
        row.className = 'control-row';
        const val = entity.state[prop.key];

        if (prop.readOnly) {
            const label = document.createElement('label');
            label.textContent = prop.key;
            row.appendChild(label);
            const valSpan = document.createElement('span');
            valSpan.className = 'value';
            valSpan.style.cssText = 'flex:1; text-align:left; color:#666;';
            valSpan.textContent = val;
            row.appendChild(valSpan);
        } else {
            const label = document.createElement('label');
            label.textContent = prop.key;
            row.appendChild(label);

            const input = document.createElement('input');
            input.type = 'range';
            input.min = prop.min;
            input.max = prop.max;
            input.step = prop.step;
            input.value = val;
            row.appendChild(input);

            const valSpan = document.createElement('span');
            valSpan.className = 'value';
            valSpan.textContent = parseFloat(prop.step) < 1 ? parseFloat(val).toFixed(2) : val;
            row.appendChild(valSpan);

            input.addEventListener('input', () => {
                const v = parseFloat(input.value);
                entity.state[prop.key] = v;
                valSpan.textContent = parseFloat(prop.step) < 1 ? v.toFixed(2) : input.value;
            });
        }
        pane.appendChild(row);
    }
    return pane;
}

function createSlider(ctrl, state) {
    const row = document.createElement('div');
    row.className = 'control-row';

    const label = document.createElement('label');
    label.textContent = ctrl.label;
    row.appendChild(label);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = ctrl.min;
    input.max = ctrl.max;
    if (ctrl.step) input.step = ctrl.step;
    input.value = state[ctrl.key];
    row.appendChild(input);

    const valSpan = document.createElement('span');
    valSpan.className = 'value';
    valSpan.textContent = ctrl.format ? ctrl.format(state[ctrl.key]) : state[ctrl.key];
    row.appendChild(valSpan);

    input.addEventListener('input', () => {
        state[ctrl.key] = +input.value;
        valSpan.textContent = ctrl.format ? ctrl.format(state[ctrl.key]) : input.value;
    });

    return row;
}

function createButtonGroup(ctrl, state) {
    const row = document.createElement('div');
    row.className = 'control-row';

    const label = document.createElement('label');
    label.textContent = ctrl.label;
    row.appendChild(label);

    const buttons = document.createElement('div');
    buttons.className = 'anim-buttons';
    for (const opt of ctrl.options) {
        const btn = document.createElement('button');
        btn.className = 'anim-btn';
        if (state[ctrl.key] === opt) btn.classList.add('active');
        btn.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
        btn.addEventListener('click', () => {
            state[ctrl.key] = opt;
            buttons.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        buttons.appendChild(btn);
    }
    row.appendChild(buttons);
    return row;
}

function createSelect(ctrl, state) {
    const row = document.createElement('div');
    row.className = 'control-row';

    const label = document.createElement('label');
    label.textContent = ctrl.label;
    row.appendChild(label);

    const select = document.createElement('select');
    select.style.cssText = 'flex:1; background:#001020; color:#fff; border:1px solid #ff450044; padding:4px;';
    for (const opt of ctrl.options) {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (state[ctrl.key] === opt.value) option.selected = true;
        select.appendChild(option);
    }
    select.addEventListener('change', () => {
        state[ctrl.key] = select.value;
    });

    row.appendChild(select);
    return row;
}
