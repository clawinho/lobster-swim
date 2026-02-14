/**
 * TitleScreen.js - Title screen Web Component
 * Animated intro with play button and high score display
 */

export class TitleScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.onPlay = null;
    }

    connectedCallback() {
        this.render();
        this.setupEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(180deg, #000810 0%, #001830 50%, #002040 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    transition: opacity 0.5s, visibility 0.5s;
                    font-family: monospace;
                }

                :host(.hidden) {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                }

                .content {
                    text-align: center;
                    animation: fadeIn 1s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .lobster {
                    font-size: 120px;
                    animation: bob 2s ease-in-out infinite;
                    text-shadow: 0 0 50px #ff450066;
                }

                @keyframes bob {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }

                h1 {
                    font-size: 3.5em;
                    color: #ff4500;
                    margin: 10px 0;
                    text-shadow: 0 0 30px #ff450066, 0 4px 0 #aa2200;
                    letter-spacing: 4px;
                }

                .tagline {
                    color: #668;
                    font-style: italic;
                    margin-bottom: 30px;
                    font-size: 1.1em;
                }

                .highscore {
                    color: #888;
                    margin-bottom: 30px;
                    font-size: 1em;
                }

                .highscore span {
                    color: #ffaa00;
                    font-weight: bold;
                }

                .play-btn {
                    background: linear-gradient(180deg, #ff5500 0%, #cc3300 100%);
                    border: none;
                    color: #fff;
                    font-size: 1.8em;
                    padding: 18px 60px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: bold;
                    letter-spacing: 3px;
                    box-shadow: 0 6px 0 #881100, 0 10px 30px #00000088;
                    transition: all 0.15s;
                    font-family: monospace;
                }

                .play-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 9px 0 #881100, 0 15px 40px #00000088;
                }

                .play-btn:active {
                    transform: translateY(3px);
                    box-shadow: 0 3px 0 #881100, 0 5px 20px #00000088;
                }

                .hint {
                    color: #446;
                    margin-top: 25px;
                    font-size: 0.85em;
                }
            </style>
            <div class="content">
                <div class="lobster">🦞</div>
                <h1>LOBSTER SWIM</h1>
                <p class="tagline">Escape the kitchen. Survive the void.</p>
                <div class="highscore">High Score: <span id="hs">0</span></div>
                <button class="play-btn">▶ PLAY</button>
                <p class="hint">🎵 Arrow keys or touch to swim</p>
            </div>
        `;
    }

    setupEvents() {
        const btn = this.shadowRoot.querySelector('.play-btn');
        btn.addEventListener('click', () => {
            if (this.onPlay) this.onPlay();
        });
    }

    setHighScore(score) {
        const hs = this.shadowRoot.querySelector('#hs');
        if (hs) hs.textContent = score;
    }

    show() {
        this.classList.remove('hidden');
    }

    hide() {
        this.classList.add('hidden');
    }
}

customElements.define('title-screen', TitleScreen);
