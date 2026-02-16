/**
 * EntityOutliner.js - Dev mode entity outliner panel (left sidebar)
 * Read-only hierarchical tree view of all entities in the scene.
 * Usage: <entity-outliner></entity-outliner>
 */

import { ENTITY_CONFIG } from './EntityInspector.js';

const CATEGORIES = [
    { label: 'Hero', keys: ['player'] },
    { label: 'Enemies', keys: ['hooks', 'cages', 'nets', 'forks'] },
    { label: 'Pickups', keys: ['bubbles', 'fish', 'pearl'] },
    { label: 'Mechanics', keys: ['oceanCurrent'] },
    { label: 'Effects', keys: ['particles'] }
];

class EntityOutliner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._refreshInterval = null;
        this._collapsed = {};
        this._typeCollapsed = {};
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 260px;
                    height: 100vh;
                    background: #001020;
                    border-right: 2px solid #ff450033;
                    z-index: 102;
                    font-family: monospace;
                    font-size: 12px;
                    color: #ccc;
                    overflow-y: auto;
                    display: none;
                }
                :host(.visible) { display: block; }

                .header {
                    padding: 10px 12px;
                    color: #ff4500;
                    font-weight: bold;
                    font-size: 13px;
                    border-bottom: 1px solid #ff450033;
                    position: sticky;
                    top: 0;
                    background: #001020;
                }

                .category {
                    border-bottom: 1px solid #ff450022;
                }
                .category-header {
                    padding: 8px 12px;
                    color: #ff4500;
                    cursor: pointer;
                    user-select: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: bold;
                }
                .category-header:hover { background: #ff450011; }
                .category-header .arrow { transition: transform 0.15s; }
                .category-header .arrow.collapsed { transform: rotate(-90deg); }

                .category-body { padding: 0 0 4px; }
                .category-body.collapsed { display: none; }

                .type-row {
                    padding: 4px 12px 4px 24px;
                    cursor: pointer;
                    user-select: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .type-row:hover { background: #ff450008; }
                .type-row .arrow {
                    font-size: 10px;
                    transition: transform 0.15s;
                    margin-right: 4px;
                }
                .type-row .arrow.collapsed { transform: rotate(-90deg); }
                .type-label { color: #aaa; }
                .type-count { color: #666; font-size: 11px; }

                .instance-list { }
                .instance-list.collapsed { display: none; }

                .instance-row {
                    padding: 2px 12px 2px 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #888;
                    font-size: 11px;
                }
                .instance-row:hover { background: #ff450006; }
                .instance-name { color: #999; }
                .instance-coords { color: #555; }

                .singleton-row {
                    padding: 4px 12px 4px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .singleton-row .type-label { color: #aaa; }
                .singleton-coords { color: #555; font-size: 11px; }

                .not-spawned {
                    color: #444;
                    font-style: italic;
                    font-size: 11px;
                }

                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #001020; }
                ::-webkit-scrollbar-thumb { background: #ff450044; border-radius: 3px; }
            </style>
            <div class="header">ENTITY OUTLINER</div>
            <div id="content"></div>
        `;
    }

    show() {
        this.classList.add('visible');
        this._buildAll();
        this._refreshInterval = setInterval(() => this._refresh(), 100);
    }

    hide() {
        this.classList.remove('visible');
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
            this._refreshInterval = null;
        }
    }

    _buildAll() {
        const entities = window.gameDevGetEntities?.();
        if (!entities) return;

        const content = this.shadowRoot.getElementById('content');
        content.innerHTML = '';

        for (const category of CATEGORIES) {
            const catEl = document.createElement('div');
            catEl.className = 'category';
            const catKey = category.label;
            const catCollapsed = this._collapsed[catKey] ?? false;

            catEl.innerHTML = `
                <div class="category-header" data-cat="${catKey}">
                    <span>${category.label}</span>
                    <span class="arrow ${catCollapsed ? 'collapsed' : ''}">▼</span>
                </div>
                <div class="category-body ${catCollapsed ? 'collapsed' : ''}" data-cat-body="${catKey}"></div>
            `;

            const body = catEl.querySelector(`[data-cat-body="${catKey}"]`);
            this._buildCategoryItems(body, category.keys, entities);

            catEl.querySelector('.category-header').addEventListener('click', () => {
                this._collapsed[catKey] = !this._collapsed[catKey];
                const b = catEl.querySelector(`[data-cat-body="${catKey}"]`);
                const arrow = catEl.querySelector('.category-header .arrow');
                b.classList.toggle('collapsed');
                arrow.classList.toggle('collapsed');
            });

            content.appendChild(catEl);
        }
    }

    _buildCategoryItems(body, keys, entities) {
        for (const key of keys) {
            const config = ENTITY_CONFIG[key];
            const entity = entities[key];

            // Particles have no ENTITY_CONFIG entry — handle as special array
            if (!config) {
                const arr = entity || [];
                this._buildArrayType(body, key, this._labelFor(key), arr, false);
                continue;
            }

            if (config.singleton) {
                const row = document.createElement('div');
                row.className = 'singleton-row';
                if (config.nullable && entity == null) {
                    row.innerHTML = `
                        <span class="type-label">${config.label}</span>
                        <span class="not-spawned">not spawned</span>
                    `;
                } else if (entity) {
                    const coords = this._formatCoords(entity);
                    row.innerHTML = `
                        <span class="type-label">${config.label}</span>
                        <span class="singleton-coords" data-coords="${key}">${coords}</span>
                    `;
                } else {
                    row.innerHTML = `<span class="type-label">${config.label}</span>`;
                }
                body.appendChild(row);
            } else {
                const arr = entity || [];
                this._buildArrayType(body, key, config.label, arr, true);
            }
        }
    }

    _buildArrayType(body, key, label, arr, hasConfig) {
        const typeCollapsed = this._typeCollapsed[key] ?? (arr.length > 10);
        const hasInstances = arr.length > 0;

        const wrapper = document.createElement('div');

        const typeRow = document.createElement('div');
        typeRow.className = 'type-row';
        typeRow.innerHTML = `
            <span>
                ${hasInstances ? `<span class="arrow ${typeCollapsed ? 'collapsed' : ''}">▾</span>` : ''}
                <span class="type-label">${label}</span>
            </span>
            <span class="type-count" data-count="${key}">(${arr.length})</span>
        `;

        wrapper.appendChild(typeRow);

        if (hasInstances) {
            const instList = document.createElement('div');
            instList.className = `instance-list ${typeCollapsed ? 'collapsed' : ''}`;
            instList.setAttribute('data-instances', key);

            arr.forEach((inst, i) => {
                const instRow = document.createElement('div');
                instRow.className = 'instance-row';
                const coords = this._formatCoords(inst);
                instRow.innerHTML = `
                    <span class="instance-name">#${i + 1}</span>
                    <span class="instance-coords" data-inst-coords="${key}[${i}]">${coords}</span>
                `;
                instList.appendChild(instRow);
            });

            wrapper.appendChild(instList);

            typeRow.addEventListener('click', () => {
                this._typeCollapsed[key] = !this._typeCollapsed[key];
                const list = wrapper.querySelector(`[data-instances="${key}"]`);
                const arrow = typeRow.querySelector('.arrow');
                list?.classList.toggle('collapsed');
                arrow?.classList.toggle('collapsed');
            });
        }

        body.appendChild(wrapper);
    }

    _formatCoords(entity) {
        if (entity == null) return '';
        const x = entity.x;
        const y = entity.y;
        if (x === undefined && y === undefined) return '';
        const xStr = x !== undefined ? `x: ${Math.round(x)}` : '';
        const yStr = y !== undefined ? `y: ${Math.round(y)}` : '';
        if (xStr && yStr) return `${xStr}  ${yStr}`;
        return xStr || yStr;
    }

    _labelFor(key) {
        const labels = { particles: 'Particles' };
        return labels[key] || key;
    }

    _refresh() {
        const entities = window.gameDevGetEntities?.();
        if (!entities) return;

        let needsRebuild = false;

        // Check array length changes
        for (const category of CATEGORIES) {
            for (const key of category.keys) {
                const config = ENTITY_CONFIG[key];
                const entity = entities[key];

                if (config && config.singleton) {
                    if (config.nullable) {
                        const row = this.shadowRoot.querySelector(`[data-coords="${key}"]`);
                        const notSpawned = row === null;
                        if ((entity == null) !== notSpawned) {
                            // Check more carefully — if not spawned label exists vs coords
                            needsRebuild = true;
                            break;
                        }
                    }
                    // Update singleton coords
                    const coordsEl = this.shadowRoot.querySelector(`[data-coords="${key}"]`);
                    if (coordsEl && entity) {
                        coordsEl.textContent = this._formatCoords(entity);
                    }
                } else {
                    const arr = entity || [];
                    const countEl = this.shadowRoot.querySelector(`[data-count="${key}"]`);
                    if (countEl) {
                        const displayed = countEl.textContent;
                        const expected = `(${arr.length})`;
                        if (displayed !== expected) {
                            needsRebuild = true;
                            break;
                        }
                    }

                    // Update instance coords
                    arr.forEach((inst, i) => {
                        const el = this.shadowRoot.querySelector(`[data-inst-coords="${key}[${i}]"]`);
                        if (el) el.textContent = this._formatCoords(inst);
                    });
                }
            }
            if (needsRebuild) break;
        }

        if (needsRebuild) this._buildAll();
    }
}

customElements.define('entity-outliner', EntityOutliner);

export default EntityOutliner;
