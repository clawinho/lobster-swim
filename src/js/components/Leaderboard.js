/**
 * Leaderboard.js - Leaderboard Web Component
 * Displays top scores fetched from the API
 */

export class Leaderboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.apiUrl = '/api/scores';
        this.scores = [];
    }

    connectedCallback() {
        this.render();
        this.fetchScores();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: #001820;
                    border: 2px solid #ff4500;
                    padding: 10px;
                    min-width: 150px;
                    z-index: 50;
                    font-family: monospace;
                }

                .title {
                    color: #ff4500;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .scores {
                    color: #fff;
                    font-size: 12px;
                }

                .score-entry {
                    display: flex;
                    justify-content: space-between;
                    padding: 2px 0;
                }

                .score-entry .rank {
                    color: #888;
                    margin-right: 5px;
                }

                .score-entry .name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .score-entry .points {
                    color: #ffaa00;
                    margin-left: 10px;
                }

                .loading {
                    color: #666;
                    font-style: italic;
                }

                @media (max-width: 820px) {
                    :host {
                        font-size: 10px;
                        padding: 5px;
                        min-width: 100px;
                    }
                }
            </style>
            <div class="title">🏆 TOP SCORES</div>
            <div class="scores" id="scores-list">
                <div class="loading">Loading...</div>
            </div>
        `;
    }

    async fetchScores() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch');
            this.scores = await response.json();
            this.renderScores();
        } catch (err) {
            console.error('Leaderboard fetch error:', err);
            this.renderError();
        }
    }

    renderScores() {
        const container = this.shadowRoot.querySelector('#scores-list');
        const isMobile = window.innerWidth <= 820;
        const limit = isMobile ? 5 : 10;
        const topScores = this.scores.slice(0, limit);

        if (topScores.length === 0) {
            container.innerHTML = '<div class="loading">No scores yet!</div>';
            return;
        }

        container.innerHTML = topScores.map((score, i) => `
            <div class="score-entry">
                <span class="rank">${i + 1}.</span>
                <span class="name">${this.escapeHtml(score.name)}</span>
                <span class="points">${score.score}</span>
            </div>
        `).join('');
    }

    renderError() {
        const container = this.shadowRoot.querySelector('#scores-list');
        container.innerHTML = '<div class="loading">Could not load scores</div>';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    refresh() {
        this.fetchScores();
    }

    async submitScore(name, score) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, score })
            });
            if (response.ok) {
                this.fetchScores();
                return true;
            }
        } catch (err) {
            console.error('Score submit error:', err);
        }
        return false;
    }
}

customElements.define('leader-board', Leaderboard);
