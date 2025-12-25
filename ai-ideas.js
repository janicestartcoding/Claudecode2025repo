// AI Ideas Showcase - Main Application Logic

class AIIdeasApp {
    constructor() {
        this.ideas = [];
        this.currentIdeaId = null;
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.renderIdeas();
        this.updateCategoryFilter();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Upload functionality
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.getElementById('upload-btn');

        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files[0]));

        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.name.endsWith('.csv')) {
                this.handleFileUpload(file);
            }
        });

        // Download template
        document.getElementById('download-template').addEventListener('click', () => {
            this.downloadTemplate();
        });

        // Export
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // Search and filter
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterIdeas(e.target.value, document.getElementById('category-filter').value);
        });
        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filterIdeas(document.getElementById('search-input').value, e.target.value);
        });

        // Modal
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });
        document.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal();
        });

        // Feedback
        document.getElementById('add-feedback').addEventListener('click', () => {
            this.addFeedback();
        });

        // Go to upload button
        document.getElementById('go-to-upload').addEventListener('click', () => {
            this.switchView('upload');
        });
    }

    switchView(view) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });

        const targetView = document.getElementById(`${view}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }
    }

    handleFileUpload(file) {
        if (!file) return;

        const statusEl = document.getElementById('upload-status');
        statusEl.textContent = 'Processing file...';
        statusEl.className = 'upload-status';

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const newIdeas = this.parseCSV(csv);

                // Merge with existing ideas, adding new ones
                newIdeas.forEach(newIdea => {
                    const existingIndex = this.ideas.findIndex(idea =>
                        idea.title === newIdea.title && idea.category === newIdea.category
                    );

                    if (existingIndex >= 0) {
                        // Update existing idea but preserve feedback
                        const existingFeedback = this.ideas[existingIndex].feedback || [];
                        this.ideas[existingIndex] = { ...newIdea, feedback: existingFeedback };
                    } else {
                        // Add new idea
                        this.ideas.push(newIdea);
                    }
                });

                this.saveToLocalStorage();
                this.renderIdeas();
                this.updateCategoryFilter();

                statusEl.textContent = `Successfully loaded ${newIdeas.length} ideas!`;
                statusEl.classList.add('success');

                setTimeout(() => {
                    this.switchView('explore');
                }, 1500);
            } catch (error) {
                statusEl.textContent = `Error: ${error.message}`;
                statusEl.classList.add('error');
            }
        };

        reader.onerror = () => {
            statusEl.textContent = 'Error reading file';
            statusEl.classList.add('error');
        };

        reader.readAsText(file);
    }

    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file is empty or invalid');
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const ideas = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);

            if (values.length === 0) continue;

            const idea = {
                id: Date.now() + i,
                title: '',
                description: '',
                category: 'General',
                impact: 'Medium',
                feasibility: 'Medium',
                owner: 'Unknown',
                feedback: []
            };

            headers.forEach((header, index) => {
                const value = values[index] ? values[index].trim() : '';

                if (header.includes('title')) idea.title = value;
                else if (header.includes('description') || header.includes('desc')) idea.description = value;
                else if (header.includes('category') || header.includes('cat')) idea.category = value || 'General';
                else if (header.includes('impact')) idea.impact = value || 'Medium';
                else if (header.includes('feasibility') || header.includes('feas')) idea.feasibility = value || 'Medium';
                else if (header.includes('owner')) idea.owner = value || 'Unknown';
            });

            if (idea.title) {
                ideas.push(idea);
            }
        }

        return ideas;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    }

    downloadTemplate() {
        const template = 'Title,Description,Category,Impact,Feasibility,Owner\n' +
            '"AI-Powered Customer Support","Implement chatbot for 24/7 customer service","Customer Service",High,High,"Jane Smith"\n' +
            '"Predictive Maintenance","Use ML to predict equipment failures","Operations",High,Medium,"John Doe"\n' +
            '"Personalized Marketing","AI-driven content personalization","Marketing",Medium,High,"Sarah Johnson"';

        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-ideas-template.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    exportToCSV() {
        if (this.ideas.length === 0) {
            alert('No ideas to export');
            return;
        }

        let csv = 'Title,Description,Category,Impact,Feasibility,Owner,Feedback Count,Latest Feedback\n';

        this.ideas.forEach(idea => {
            const feedbackCount = idea.feedback ? idea.feedback.length : 0;
            const latestFeedback = idea.feedback && idea.feedback.length > 0
                ? idea.feedback[idea.feedback.length - 1].text.replace(/"/g, '""')
                : '';

            csv += `"${idea.title.replace(/"/g, '""')}",` +
                   `"${idea.description.replace(/"/g, '""')}",` +
                   `"${idea.category}",` +
                   `"${idea.impact}",` +
                   `"${idea.feasibility}",` +
                   `"${idea.owner}",` +
                   `${feedbackCount},` +
                   `"${latestFeedback}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-ideas-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    renderIdeas(filteredIdeas = null) {
        const ideasToRender = filteredIdeas || this.ideas;
        const grid = document.getElementById('ideas-grid');
        const emptyState = document.getElementById('empty-state');

        if (ideasToRender.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.add('active');
            return;
        }

        emptyState.classList.remove('active');
        grid.innerHTML = ideasToRender.map(idea => this.createIdeaCard(idea)).join('');

        // Add click listeners to cards
        grid.querySelectorAll('.idea-card').forEach(card => {
            card.addEventListener('click', () => {
                this.openModal(parseInt(card.dataset.ideaId));
            });
        });
    }

    createIdeaCard(idea) {
        const feedbackCount = idea.feedback ? idea.feedback.length : 0;

        return `
            <div class="idea-card" data-idea-id="${idea.id}">
                ${feedbackCount > 0 ? `<div class="feedback-count">💬 ${feedbackCount}</div>` : ''}
                <div class="idea-category">${idea.category}</div>
                <h3 class="idea-title">${this.escapeHtml(idea.title)}</h3>
                <p class="idea-description">${this.escapeHtml(idea.description)}</p>
                <div class="idea-meta">
                    <div class="meta-item">
                        <span class="meta-label">Impact</span>
                        <span class="meta-value">${idea.impact}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Feasibility</span>
                        <span class="meta-value">${idea.feasibility}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Owner</span>
                        <span class="meta-value">${this.escapeHtml(idea.owner)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    openModal(ideaId) {
        const idea = this.ideas.find(i => i.id === ideaId);
        if (!idea) return;

        this.currentIdeaId = ideaId;

        document.getElementById('modal-category').textContent = idea.category;
        document.getElementById('modal-title').textContent = idea.title;
        document.getElementById('modal-description').textContent = idea.description;
        document.getElementById('modal-impact').textContent = idea.impact;
        document.getElementById('modal-feasibility').textContent = idea.feasibility;
        document.getElementById('modal-owner').textContent = idea.owner;

        this.renderFeedback();

        document.getElementById('idea-modal').classList.add('active');
    }

    closeModal() {
        document.getElementById('idea-modal').classList.remove('active');
        this.currentIdeaId = null;
        document.getElementById('feedback-input').value = '';
    }

    renderFeedback() {
        const idea = this.ideas.find(i => i.id === this.currentIdeaId);
        if (!idea) return;

        const feedbackList = document.getElementById('feedback-list');

        if (!idea.feedback || idea.feedback.length === 0) {
            feedbackList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No feedback yet. Be the first to share your thoughts!</p>';
            return;
        }

        feedbackList.innerHTML = idea.feedback.map((fb, index) => `
            <div class="feedback-item">
                <div class="feedback-header">
                    <span class="feedback-date">${new Date(fb.date).toLocaleString()}</span>
                    <button class="feedback-delete" data-index="${index}">Delete</button>
                </div>
                <p class="feedback-text">${this.escapeHtml(fb.text)}</p>
            </div>
        `).join('');

        // Add delete listeners
        feedbackList.querySelectorAll('.feedback-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteFeedback(parseInt(btn.dataset.index));
            });
        });
    }

    addFeedback() {
        const input = document.getElementById('feedback-input');
        const text = input.value.trim();

        if (!text) return;

        const idea = this.ideas.find(i => i.id === this.currentIdeaId);
        if (!idea) return;

        if (!idea.feedback) {
            idea.feedback = [];
        }

        idea.feedback.push({
            text: text,
            date: new Date().toISOString()
        });

        this.saveToLocalStorage();
        this.renderFeedback();
        this.renderIdeas(); // Update card feedback count
        input.value = '';
    }

    deleteFeedback(index) {
        const idea = this.ideas.find(i => i.id === this.currentIdeaId);
        if (!idea || !idea.feedback) return;

        idea.feedback.splice(index, 1);
        this.saveToLocalStorage();
        this.renderFeedback();
        this.renderIdeas(); // Update card feedback count
    }

    filterIdeas(searchTerm, category) {
        const filtered = this.ideas.filter(idea => {
            const matchesSearch = !searchTerm ||
                idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                idea.owner.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !category || idea.category === category;

            return matchesSearch && matchesCategory;
        });

        this.renderIdeas(filtered);
    }

    updateCategoryFilter() {
        const categories = [...new Set(this.ideas.map(idea => idea.category))];
        const select = document.getElementById('category-filter');

        const currentValue = select.value;
        select.innerHTML = '<option value="">All Categories</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

        if (categories.includes(currentValue)) {
            select.value = currentValue;
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('aiIdeas', JSON.stringify(this.ideas));
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('aiIdeas');
        if (stored) {
            try {
                this.ideas = JSON.parse(stored);
            } catch (error) {
                console.error('Error loading from localStorage:', error);
                this.ideas = [];
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AIIdeasApp();
});
