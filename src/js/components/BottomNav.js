/**
 * BottomNav.js - Reusable bottom navigation component
 * Usage: <bottom-nav version="1.0.4"></bottom-nav>
 */

class BottomNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        const version = this.getAttribute('version') || '1.0.0';
        const currentPath = window.location.pathname;
        
        // Determine active page
        const isGame = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/src/');
        const isCommits = currentPath.includes('commits');
        const isAssets = currentPath.includes('assets');
        const isRoadmap = currentPath.includes('roadmap');
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 10px;
                    right: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: monospace;
                    z-index: 1000;
                }
                
                .version {
                    cursor: pointer;
                    font-size: 10px;
                    color: #ff4500aa;
                    transition: all 0.2s;
                }
                
                .version:hover {
                    transform: scale(1.1);
                    color: #ff4500;
                }
                
                .nav-links {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                
                .nav-links a {
                    text-decoration: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 13px;
                    transition: all 0.2s;
                }
                
                .nav-links a.game {
                    color: #ff4500;
                    background: #ff450011;
                    border: 1px solid #ff450044;
                }
                
                .nav-links a.game:hover,
                .nav-links a.game.active {
                    background: #ff450033;
                    border-color: #ff4500;
                }
                
                .nav-links a.commits {
                    color: #4488ff;
                    background: #4488ff11;
                    border: 1px solid #4488ff44;
                }
                
                .nav-links a.commits:hover,
                .nav-links a.commits.active {
                    background: #4488ff33;
                    border-color: #4488ff;
                }
                
                .nav-links a.assets {
                    color: #ffaa00;
                    background: #ffaa0011;
                    border: 1px solid #ffaa0044;
                }
                
                .nav-links a.assets:hover,
                .nav-links a.assets.active {
                    background: #ffaa0033;
                    border-color: #ffaa00;
                }
                
                .nav-links a.roadmap {
                    color: #88ff88;
                    background: #88ff8811;
                    border: 1px solid #88ff8844;
                }
                
                .nav-links a.roadmap:hover,
                .nav-links a.roadmap.active {
                    background: #88ff8833;
                    border-color: #88ff88;
                }
                
                /* Mobile */
                @media (max-width: 600px) {
                    :host {
                        flex-direction: column;
                        align-items: flex-end;
                        gap: 8px;
                    }
                    
                    .nav-links {
                        flex-direction: column;
                        gap: 8px;
                        align-items: flex-end;
                    }
                }
                
                /* Large screens */
                @media (min-width: 1400px) {
                    :host {
                        font-size: 14px;
                        padding: 8px 12px;
                        background: #001820aa;
                        border: 1px solid #ff450044;
                        border-radius: 4px;
                    }
                    
                    .version { font-size: 14px; }
                }
                
                @media (min-width: 2000px) {
                    :host {
                        font-size: 18px;
                        padding: 12px 20px;
                        gap: 15px;
                    }
                    
                    .version { font-size: 16px; }
                    .nav-links a { font-size: 16px; padding: 8px 16px; }
                }
            </style>
            
            <div class="version">v${version}</div>
            <div class="nav-links">
                <a href="/" class="game ${isGame ? 'active' : ''}">🦞 play</a>
                <a href="/pages/commits.html" class="commits ${isCommits ? 'active' : ''}">commits</a>
                <a href="/pages/assets.html" class="assets ${isAssets ? 'active' : ''}">assets</a>
                <a href="/pages/roadmap.html" class="roadmap ${isRoadmap ? 'active' : ''}">roadmap</a>
            </div>
        `;
    }
}

customElements.define('bottom-nav', BottomNav);

export default BottomNav;
