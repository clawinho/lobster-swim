/**
 * GameOver.js - Game Over Modal Web Component
 * Shows final score and allows name entry for leaderboard
 */

export class GameOver extends HTMLElement {
    static DEATH_QUOTES = [
        "The void claims all eventually...",
        "Even the mightiest lobster falls...",
        "The kitchen always wins...",
        "Your shell wasn't thick enough...",
        "Butter and garlic await...",
        "The net catches all who swim too slow...",
        "Another one for the pot...",
        "The ocean forgets quickly...",
        "Claws up, game over...",
        "The hook gets everyone eventually..."
    ];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.score = 0;
        this.onSubmit = null;
        this.onSkip = null;
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
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #001820;
                    border: 2px solid #ff4500;
                    padding: 25px;
                    display: none;
                    text-align: center;
                    z-index: 100;
                    min-width: 280px;
                    font-family: monospace;
                }

                :host(.visible) {
                    display: block;
                    animation: popIn 0.3s ease-out;
                }

                @keyframes popIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }

                .icon {
                    font-size: 24px;
                    margin-bottom: 5px;
                }

                .title {
                    color: #ff4500;
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 8px;
                }

                .quote {
                    color: #888;
                    font-style: italic;
                    font-size: 12px;
                    margin-bottom: 15px;
                }

                .final-score {
                    color: #fff;
                    margin-bottom: 8px;
                    font-size: 16px;
                }

                .final-score span {
                    color: #ffaa00;
                    font-weight: bold;
                    font-size: 24px;
                }

                .input-label {
                    color: #ff4500;
                    margin-bottom: 10px;
                    font-size: 14px;
                }

                input {
                    background: #000;
                    color: #fff;
                    border: 1px solid #ff4500;
                    padding: 8px;
                    margin-bottom: 12px;
                    text-align: center;
                    width: 150px;
                    font-family: monospace;
                    font-size: 14px;
                }

                input:focus {
                    outline: none;
                    border-color: #ff6600;
                    box-shadow: 0 0 10px #ff450044;
                }

                .buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }

                button {
                    padding: 10px 20px;
                    cursor: pointer;
                    font-weight: bold;
                    font-family: monospace;
                    border: none;
                    transition: all 0.15s;
                }

                .submit-btn {
                    background: #ff4500;
                    color: #000;
                }

                .submit-btn:hover {
                    background: #ff6600;
                    transform: scale(1.05);
                }

                .skip-btn {
                    background: #333;
                    color: #fff;
                }

                .skip-btn:hover {
                    background: #444;
                }
            </style>
            <div class="icon">🦞💀</div>
            <div class="title">GAME OVER</div>
            <div class="quote" id="quote"></div>
            <div class="final-score">Final Score: <span id="score">0</span></div>
            <div class="input-label">Enter your name:</div>
            <input type="text" id="name" maxlength="15" placeholder="Your name">
            <div class="buttons">
                <button class="submit-btn">SUBMIT</button>
                <button class="skip-btn">SKIP</button>
            </div>
        `;
    }

    setupEvents() {
        const submitBtn = this.shadowRoot.querySelector('.submit-btn');
        const skipBtn = this.shadowRoot.querySelector('.skip-btn');
        const input = this.shadowRoot.querySelector('#name');

        submitBtn.addEventListener('click', () => this.handleSubmit());
        skipBtn.addEventListener('click', () => this.handleSkip());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSubmit();
        });
    }

    handleSubmit() {
        const input = this.shadowRoot.querySelector('#name');
        const name = input.value.trim() || 'Anonymous';
        if (this.onSubmit) this.onSubmit(name, this.score);
        this.hide();
    }

    handleSkip() {
        if (this.onSkip) this.onSkip();
        this.hide();
    }

    show(score) {
        this.score = score;

        // Update score display
        const scoreEl = this.shadowRoot.querySelector('#score');
        scoreEl.textContent = score;

        // Random death quote
        const quoteEl = this.shadowRoot.querySelector('#quote');
        const randomQuote = GameOver.DEATH_QUOTES[Math.floor(Math.random() * GameOver.DEATH_QUOTES.length)];
        quoteEl.textContent = `"${randomQuote}"`;

        // Clear and focus input
        const input = this.shadowRoot.querySelector('#name');
        input.value = localStorage.getItem('lobsterPlayerName') || '';
        
        this.classList.add('visible');
        setTimeout(() => input.focus(), 100);
    }

    hide() {
        // Save name for next time
        const input = this.shadowRoot.querySelector('#name');
        if (input.value.trim()) {
            localStorage.setItem('lobsterPlayerName', input.value.trim());
        }
        this.classList.remove('visible');
    }
}

customElements.define('game-over', GameOver);
