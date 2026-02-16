/**
 * EntityInspector.js - Dev mode entity inspector panel
 * Usage: <entity-inspector></entity-inspector>
 */

export const ENTITY_CONFIG = {
    player: {
        label: 'Lobster',
        singleton: true,
        props: [
            { key: 'x', min: 0, max: 800, step: 1 },
            { key: 'y', min: 0, max: 600, step: 1 },
            { key: 'size', min: 5, max: 100, step: 1 },
            { key: 'speed', min: 0.5, max: 20, step: 0.5 },
            { key: 'angle', readOnly: true }
        ]
    },
    hooks: {
        label: 'Hooks',
        singleton: false,
        props: [
            { key: 'x', min: 0, max: 800, step: 1 },
            { key: 'lineLength', min: 20, max: 400, step: 5 },
            { key: 'swingSpeed', min: 0.001, max: 0.1, step: 0.001 },
            { key: 'dropping', readOnly: true }
        ]
    },
    cages: {
        label: 'Cages',
        singleton: false,
        props: [
            { key: 'x', min: 0, max: 800, step: 1 },
            { key: 'y', min: 0, max: 600, step: 1 },
            { key: 'size', min: 10, max: 150, step: 1 },
            { key: 'baseDx', min: -3, max: 3, step: 0.05 },
            { key: 'baseDy', min: -3, max: 3, step: 0.05 }
        ]
    },
    nets: {
        label: 'Nets',
        singleton: false,
        props: [
            { key: 'x', min: 0, max: 800, step: 1 },
            { key: 'y', min: 0, max: 600, step: 1 },
            { key: 'width', min: 20, max: 400, step: 5 },
            { key: 'height', min: 20, max: 400, step: 5 },
            { key: 'speed', min: 0.1, max: 10, step: 0.1 }
        ]
    },
    forks: {
        label: 'Forks',
        singleton: false,
        props: [
            { key: 'x', min: 0, max: 800, step: 1 },
            { key: 'y', min: 0, max: 600, step: 1 },
            { key: 'fallSpeed', min: 0.5, max: 15, step: 0.5 },
            { key: 'wobble', min: 0, max: 6.28, step: 0.01 },
            { key: 'wobbleSpeed', min: 0.01, max: 0.2, step: 0.01 },
            { key: 'canvasHeight', min: 100, max: 1200, step: 10 }
        ]
    },
    bubbles: {
        label: 'Bubbles',
        singleton: false,
        props: [
            { key: 'x', min: 0, max: 800, step: 1 },
            { key: 'y', min: 0, max: 600, step: 1 },
            { key: 'size', min: 5, max: 80, step: 1 },
            { key: 'phase', min: 0, max: 6.28, step: 0.01 }
        ]
    },
    fish: {
        label: 'Golden Fish',
        singleton: true,
        nullable: true,
        props: [
            { key: 'x', min: 0, max: 800, step: 1 },
            { key: 'y', min: 0, max: 600, step: 1 },
            { key: 'size', min: 5, max: 50, step: 1 },
            { key: 'speed', min: 0.5, max: 10, step: 0.5 },
            { key: 'direction', readOnly: true },
            { key: 'wobble', min: 0, max: 6.28, step: 0.01 },
            { key: 'animTime', min: 0, max: 1000, step: 1 }
        ]
    },
    pearl: {
        label: 'Pearl',
        singleton: true,
        nullable: true,
        props: [
            { key: 'x', min: 0, max: 800, step: 1 },
            { key: 'y', min: 0, max: 600, step: 1 },
            { key: 'size', min: 5, max: 60, step: 1 },
            { key: 'active', readOnly: true }
        ]
    },
    oceanCurrent: {
        label: 'Ocean Current',
        singleton: true,
        props: [
            { key: 'baseStrength', min: 0, max: 3, step: 0.1 },
            { key: 'angle', min: 0, max: 6.28, step: 0.1 }
        ]
    }
};

class EntityInspector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._refreshInterval = null;
        this._collapsed = {};
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 320px;
                    height: 100vh;
                    background: #001020;
                    border-left: 2px solid #ff450033;
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

                .section {
                    border-bottom: 1px solid #ff450022;
                }
                .section-header {
                    padding: 8px 12px;
                    color: #ff4500;
                    cursor: pointer;
                    user-select: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .section-header:hover { background: #ff450011; }
                .section-header .arrow { transition: transform 0.15s; }
                .section-header .arrow.collapsed { transform: rotate(-90deg); }

                .section-body { padding: 0 12px 8px; }
                .section-body.collapsed { display: none; }

                .instance-label {
                    color: #666;
                    font-size: 11px;
                    margin: 6px 0 2px;
                }

                .prop-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    height: 22px;
                }
                .prop-label {
                    width: 80px;
                    color: #666;
                    flex-shrink: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .prop-row input[type="range"] {
                    flex: 1;
                    accent-color: #ff4500;
                    height: 4px;
                }
                .prop-value {
                    width: 50px;
                    text-align: right;
                    flex-shrink: 0;
                    color: #aaa;
                    font-size: 11px;
                }
                .prop-value.readonly { color: #666; }

                .not-spawned {
                    color: #444;
                    padding: 4px 0;
                    font-style: italic;
                }

                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #001020; }
                ::-webkit-scrollbar-thumb { background: #ff450044; border-radius: 3px; }
            </style>
            <div class="header">ENTITY INSPECTOR</div>
            <div id="content"></div>
        `;
    }

    show() {
        this.classList.add('visible');
        this._buildAll();
        this._refreshInterval = setInterval(() => this._refreshValues(), 100);
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
        this._sliderRefs = [];

        for (const [key, config] of Object.entries(ENTITY_CONFIG)) {
            const entity = entities[key];
            const section = document.createElement('div');
            section.className = 'section';

            const isCollapsed = this._collapsed[key] ?? false;

            if (config.singleton) {
                const isNull = config.nullable && entity == null;
                section.innerHTML = `
                    <div class="section-header" data-key="${key}">
                        <span>${config.label}</span>
                        <span class="arrow ${isCollapsed ? 'collapsed' : ''}">▼</span>
                    </div>
                    <div class="section-body ${isCollapsed ? 'collapsed' : ''}" data-section="${key}">
                        ${isNull ? '<div class="not-spawned">Not spawned</div>' : ''}
                    </div>
                `;
                content.appendChild(section);

                if (!isNull) {
                    const body = section.querySelector(`[data-section="${key}"]`);
                    this._buildProps(body, key, entity, config.props);
                }
            } else {
                const arr = entity || [];
                section.innerHTML = `
                    <div class="section-header" data-key="${key}">
                        <span>${config.label} (${arr.length})</span>
                        <span class="arrow ${isCollapsed ? 'collapsed' : ''}">▼</span>
                    </div>
                    <div class="section-body ${isCollapsed ? 'collapsed' : ''}" data-section="${key}"></div>
                `;
                content.appendChild(section);

                const body = section.querySelector(`[data-section="${key}"]`);
                arr.forEach((inst, i) => {
                    const label = document.createElement('div');
                    label.className = 'instance-label';
                    label.textContent = `#${i + 1}`;
                    body.appendChild(label);
                    this._buildProps(body, `${key}[${i}]`, inst, config.props);
                });
            }

            // Toggle collapse
            section.querySelector('.section-header').addEventListener('click', () => {
                this._collapsed[key] = !this._collapsed[key];
                const body = section.querySelector(`[data-section="${key}"]`);
                const arrow = section.querySelector('.arrow');
                body.classList.toggle('collapsed');
                arrow.classList.toggle('collapsed');
            });
        }
    }

    _buildProps(container, refPrefix, entity, props) {
        for (const prop of props) {
            const row = document.createElement('div');
            row.className = 'prop-row';

            const val = entity[prop.key];
            const display = typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : String(val ?? '');

            if (prop.readOnly) {
                row.innerHTML = `
                    <span class="prop-label">${prop.key}</span>
                    <span class="prop-value readonly" data-ref="${refPrefix}.${prop.key}">${display}</span>
                `;
            } else {
                row.innerHTML = `
                    <span class="prop-label">${prop.key}</span>
                    <input type="range" min="${prop.min}" max="${prop.max}" step="${prop.step}" value="${val}">
                    <span class="prop-value" data-ref="${refPrefix}.${prop.key}">${display}</span>
                `;
                const slider = row.querySelector('input');
                slider.addEventListener('input', () => {
                    entity[prop.key] = parseFloat(slider.value);
                });
                this._sliderRefs.push({ slider, entity, prop });
            }

            container.appendChild(row);
        }
    }

    _refreshValues() {
        const entities = window.gameDevGetEntities?.();
        if (!entities) return;

        // Refresh all value displays
        const allValues = this.shadowRoot.querySelectorAll('[data-ref]');
        for (const span of allValues) {
            const ref = span.getAttribute('data-ref');
            const val = this._resolveRef(ref, entities);
            if (val !== undefined) {
                span.textContent = typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : String(val ?? '');
            }
        }

        // Sync slider positions for non-focused sliders
        for (const { slider, entity, prop } of this._sliderRefs) {
            if (document.activeElement === slider || this.shadowRoot.activeElement === slider) continue;
            const current = entity[prop.key];
            if (current !== undefined) slider.value = current;
        }

        // Rebuild if array lengths or nullable states changed
        let needsRebuild = false;
        for (const [key, config] of Object.entries(ENTITY_CONFIG)) {
            const entity = entities[key];
            const sectionHeader = this.shadowRoot.querySelector(`[data-key="${key}"] span`);
            if (!sectionHeader) continue;

            if (!config.singleton) {
                const arr = entity || [];
                const displayed = sectionHeader.textContent;
                const expected = `${config.label} (${arr.length})`;
                if (displayed !== expected) { needsRebuild = true; break; }
            } else if (config.nullable) {
                const body = this.shadowRoot.querySelector(`[data-section="${key}"]`);
                const hasNotSpawned = body?.querySelector('.not-spawned');
                if ((entity == null) !== !!hasNotSpawned) { needsRebuild = true; break; }
            }
        }

        if (needsRebuild) this._buildAll();
    }

    _resolveRef(ref, entities) {
        // Parse refs like "player.x" or "hooks[0].x"
        const arrayMatch = ref.match(/^(\w+)\[(\d+)\]\.(\w+)$/);
        if (arrayMatch) {
            const [, key, idx, prop] = arrayMatch;
            const arr = entities[key];
            return arr?.[parseInt(idx)]?.[prop];
        }
        const dotMatch = ref.match(/^(\w+)\.(\w+)$/);
        if (dotMatch) {
            const [, key, prop] = dotMatch;
            return entities[key]?.[prop];
        }
        return undefined;
    }
}

customElements.define('entity-inspector', EntityInspector);

export default EntityInspector;
