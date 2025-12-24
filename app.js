// Insight Tracker Application

class InsightTracker {
    constructor() {
        this.insights = this.loadInsights();
        this.currentMeetingInsights = [];
        this.currentInsightIndex = 0;
        this.ideas = this.loadIdeas();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderInsightsRepository();
        this.updateTagFilter();
        this.renderMeetingInsightsList();
    }

    // Local Storage Management
    loadInsights() {
        const stored = localStorage.getItem('insights');
        return stored ? JSON.parse(stored) : [];
    }

    saveInsights() {
        localStorage.setItem('insights', JSON.stringify(this.insights));
    }

    loadIdeas() {
        const stored = localStorage.getItem('brainstormingIdeas');
        return stored ? JSON.parse(stored) : [];
    }

    saveIdeas() {
        localStorage.setItem('brainstormingIdeas', JSON.stringify(this.ideas));
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Insight Form
        document.getElementById('insight-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addInsight();
        });

        // Search and Filter
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterInsights(e.target.value, document.getElementById('tag-filter').value);
        });

        document.getElementById('tag-filter').addEventListener('change', (e) => {
            this.filterInsights(document.getElementById('search-input').value, e.target.value);
        });

        // Meeting Mode
        document.getElementById('start-presentation').addEventListener('click', () => {
            this.startPresentation();
        });

        document.getElementById('prev-insight').addEventListener('click', () => {
            this.navigatePresentation(-1);
        });

        document.getElementById('next-insight').addEventListener('click', () => {
            this.navigatePresentation(1);
        });

        document.getElementById('toggle-ideas-panel').addEventListener('click', () => {
            this.toggleIdeasPanel();
        });

        // Ideas
        document.getElementById('add-idea').addEventListener('click', () => {
            this.addIdea();
        });

        document.getElementById('export-ideas').addEventListener('click', () => {
            this.exportIdeas();
        });
    }

    // View Management
    switchView(viewName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');

        // Refresh content if needed
        if (viewName === 'meeting') {
            this.renderMeetingInsightsList();
            this.renderIdeasList();
        }
    }

    // Insight Management
    addInsight() {
        const url = document.getElementById('insight-url').value.trim();
        const title = document.getElementById('insight-title').value.trim();
        const description = document.getElementById('insight-description').value.trim();
        const tagsInput = document.getElementById('insight-tags').value.trim();
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        const insight = {
            id: Date.now(),
            url,
            title,
            description,
            tags,
            createdAt: new Date().toISOString()
        };

        this.insights.unshift(insight);
        this.saveInsights();
        this.renderInsightsRepository();
        this.updateTagFilter();

        // Reset form and show success
        document.getElementById('insight-form').reset();
        alert('Insight saved successfully!');
        this.switchView('repository');
    }

    deleteInsight(id) {
        if (confirm('Are you sure you want to delete this insight?')) {
            this.insights = this.insights.filter(insight => insight.id !== id);
            this.saveInsights();
            this.renderInsightsRepository();
            this.updateTagFilter();
            this.renderMeetingInsightsList();
        }
    }

    // Repository View
    renderInsightsRepository(filteredInsights = null) {
        const grid = document.getElementById('insights-grid');
        const emptyState = document.getElementById('empty-state');
        const insightsToRender = filteredInsights !== null ? filteredInsights : this.insights;

        if (insightsToRender.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        grid.innerHTML = '';

        insightsToRender.forEach(insight => {
            const card = document.createElement('div');
            card.className = 'insight-card';
            card.innerHTML = `
                <h3>${this.escapeHtml(insight.title)}</h3>
                <p>${this.escapeHtml(insight.description) || 'No description provided'}</p>
                <a href="${this.escapeHtml(insight.url)}" target="_blank" class="url" rel="noopener noreferrer">
                    ${this.escapeHtml(insight.url)}
                </a>
                ${insight.tags.length > 0 ? `
                    <div class="insight-tags">
                        ${insight.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="insight-actions">
                    <button class="btn-small btn-delete" onclick="app.deleteInsight(${insight.id})">Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    filterInsights(searchTerm, selectedTag) {
        const filtered = this.insights.filter(insight => {
            const matchesSearch = searchTerm === '' ||
                insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                insight.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                insight.url.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTag = selectedTag === '' || insight.tags.includes(selectedTag);

            return matchesSearch && matchesTag;
        });

        this.renderInsightsRepository(filtered);
    }

    updateTagFilter() {
        const tagFilter = document.getElementById('tag-filter');
        const allTags = new Set();

        this.insights.forEach(insight => {
            insight.tags.forEach(tag => allTags.add(tag));
        });

        const currentValue = tagFilter.value;
        tagFilter.innerHTML = '<option value="">All Tags</option>';

        Array.from(allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            tagFilter.appendChild(option);
        });

        tagFilter.value = currentValue;
    }

    // Meeting Mode
    renderMeetingInsightsList() {
        const list = document.getElementById('meeting-insights-list');

        if (this.insights.length === 0) {
            list.innerHTML = '<p style="color: #999; padding: 10px;">No insights available. Add some insights first!</p>';
            return;
        }

        list.innerHTML = '';
        this.insights.forEach(insight => {
            const div = document.createElement('div');
            div.className = 'insight-checkbox';
            div.innerHTML = `
                <input type="checkbox" id="insight-${insight.id}" value="${insight.id}">
                <label for="insight-${insight.id}">${this.escapeHtml(insight.title)}</label>
            `;
            list.appendChild(div);
        });
    }

    startPresentation() {
        const checkedBoxes = document.querySelectorAll('#meeting-insights-list input[type="checkbox"]:checked');

        if (checkedBoxes.length === 0) {
            alert('Please select at least one insight to present!');
            return;
        }

        const selectedIds = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
        this.currentMeetingInsights = this.insights.filter(insight => selectedIds.includes(insight.id));
        this.currentInsightIndex = 0;

        this.displayCurrentInsight();
        this.updatePresentationControls();
    }

    displayCurrentInsight() {
        const display = document.getElementById('current-insight-display');

        if (this.currentMeetingInsights.length === 0) {
            display.innerHTML = '<p class="placeholder">Select insights and click "Start Presentation"</p>';
            return;
        }

        const insight = this.currentMeetingInsights[this.currentInsightIndex];
        display.innerHTML = `
            <h2>${this.escapeHtml(insight.title)}</h2>
            <a href="${this.escapeHtml(insight.url)}" target="_blank" class="insight-url" rel="noopener noreferrer">
                🔗 ${this.escapeHtml(insight.url)}
            </a>
            <div class="insight-description">
                ${this.escapeHtml(insight.description) || '<em>No description provided</em>'}
            </div>
            ${insight.tags.length > 0 ? `
                <div class="insight-tags">
                    ${insight.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
        `;
    }

    navigatePresentation(direction) {
        this.currentInsightIndex += direction;
        this.displayCurrentInsight();
        this.updatePresentationControls();
    }

    updatePresentationControls() {
        const prevBtn = document.getElementById('prev-insight');
        const nextBtn = document.getElementById('next-insight');
        const counter = document.getElementById('insight-counter');

        if (this.currentMeetingInsights.length === 0) {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            counter.textContent = '';
            return;
        }

        prevBtn.disabled = this.currentInsightIndex === 0;
        nextBtn.disabled = this.currentInsightIndex === this.currentMeetingInsights.length - 1;
        counter.textContent = `${this.currentInsightIndex + 1} / ${this.currentMeetingInsights.length}`;
    }

    toggleIdeasPanel() {
        const panel = document.getElementById('ideas-panel');
        const btn = document.getElementById('toggle-ideas-panel');

        panel.classList.toggle('show');
        btn.textContent = panel.classList.contains('show') ? 'Hide Ideas Panel' : 'Show Ideas Panel';
    }

    // Ideas Management
    addIdea() {
        const input = document.getElementById('idea-input');
        const content = input.value.trim();

        if (!content) {
            alert('Please enter an idea first!');
            return;
        }

        const idea = {
            id: Date.now(),
            content,
            timestamp: new Date().toISOString()
        };

        this.ideas.unshift(idea);
        this.saveIdeas();
        this.renderIdeasList();
        input.value = '';
    }

    deleteIdea(id) {
        this.ideas = this.ideas.filter(idea => idea.id !== id);
        this.saveIdeas();
        this.renderIdeasList();
    }

    renderIdeasList() {
        const list = document.getElementById('ideas-list');

        if (this.ideas.length === 0) {
            list.innerHTML = '<p style="color: #999; padding: 10px; text-align: center;">No ideas yet</p>';
            return;
        }

        list.innerHTML = '';
        this.ideas.forEach(idea => {
            const div = document.createElement('div');
            div.className = 'idea-item';
            div.innerHTML = `
                <div>
                    <div class="idea-content">${this.escapeHtml(idea.content)}</div>
                    <div class="idea-timestamp">${this.formatDate(idea.timestamp)}</div>
                </div>
                <button class="btn-delete-idea" onclick="app.deleteIdea(${idea.id})">✕</button>
            `;
            list.appendChild(div);
        });
    }

    exportIdeas() {
        if (this.ideas.length === 0) {
            alert('No ideas to export!');
            return;
        }

        let text = '=== BRAINSTORMING IDEAS ===\n\n';
        this.ideas.forEach((idea, index) => {
            text += `${index + 1}. ${idea.content}\n`;
            text += `   [${this.formatDate(idea.timestamp)}]\n\n`;
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `brainstorming-ideas-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize the app
const app = new InsightTracker();
