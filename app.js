// ============================================
// AI Ideation Platform - Main Application
// ============================================

class AIIdeationPlatform {
    constructor() {
        this.ideas = [];
        this.feedback = {};
        this.currentView = 'grid';
        this.currentIdeaId = null;
        this.currentSentiment = null;
        this.filters = {
            search: '',
            category: '',
            priority: '',
            status: ''
        };
        this.lastSaved = null;

        this.init();
    }

    // ========================================
    // Initialization
    // ========================================

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderIdeas();
        this.updateCategoryFilter();
        this.updateSaveIndicator();
        this.startAutoSaveTimer();
    }

    loadData() {
        // Load ideas from localStorage
        const storedIdeas = localStorage.getItem('ai_ideation_ideas');
        if (storedIdeas) {
            this.ideas = JSON.parse(storedIdeas);
        }

        // Load feedback from localStorage
        const storedFeedback = localStorage.getItem('ai_ideation_feedback');
        if (storedFeedback) {
            this.feedback = JSON.parse(storedFeedback);
        }

        // Load last saved timestamp
        const lastSaved = localStorage.getItem('ai_ideation_last_saved');
        if (lastSaved) {
            this.lastSaved = new Date(lastSaved);
        }
    }

    saveData() {
        localStorage.setItem('ai_ideation_ideas', JSON.stringify(this.ideas));
        localStorage.setItem('ai_ideation_feedback', JSON.stringify(this.feedback));
        this.lastSaved = new Date();
        localStorage.setItem('ai_ideation_last_saved', this.lastSaved.toISOString());
        this.updateSaveIndicator();
    }

    updateSaveIndicator() {
        const indicator = document.getElementById('save-status');
        if (this.lastSaved) {
            const now = new Date();
            const diffMs = now - this.lastSaved;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins === 0) {
                indicator.textContent = 'Just saved';
            } else if (diffMins === 1) {
                indicator.textContent = 'Last saved: 1 minute ago';
            } else if (diffMins < 60) {
                indicator.textContent = `Last saved: ${diffMins} minutes ago`;
            } else {
                indicator.textContent = `Last saved: ${this.formatDate(this.lastSaved)}`;
            }
        } else {
            indicator.textContent = 'All changes saved';
        }
    }

    startAutoSaveTimer() {
        // Update save indicator every minute
        setInterval(() => {
            this.updateSaveIndicator();
        }, 60000);
    }

    // ========================================
    // Event Listeners
    // ========================================

    setupEventListeners() {
        // View mode buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchView(btn.dataset.view);
            });
        });

        // Action buttons
        document.getElementById('add-idea-btn').addEventListener('click', () => {
            this.openIdeaModal();
        });

        document.getElementById('empty-add-btn').addEventListener('click', () => {
            this.openIdeaModal();
        });

        document.getElementById('upload-csv-btn').addEventListener('click', () => {
            this.openUploadModal();
        });

        document.getElementById('export-csv-btn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // Search and filters
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.renderIdeas();
        });

        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.renderIdeas();
        });

        document.getElementById('priority-filter').addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.renderIdeas();
        });

        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.renderIdeas();
        });

        // Idea form modal
        document.getElementById('close-idea-modal').addEventListener('click', () => {
            this.closeIdeaModal();
        });

        document.getElementById('cancel-idea-btn').addEventListener('click', () => {
            this.closeIdeaModal();
        });

        document.getElementById('idea-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveIdea();
        });

        // Detail modal
        document.getElementById('close-detail-modal').addEventListener('click', () => {
            this.closeDetailModal();
        });

        // Sentiment buttons
        document.querySelectorAll('.sentiment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleSentiment(btn.dataset.sentiment);
            });
        });

        // Add feedback button
        document.getElementById('add-feedback-btn').addEventListener('click', () => {
            this.addFeedback();
        });

        // Upload modal
        document.getElementById('close-upload-modal').addEventListener('click', () => {
            this.closeUploadModal();
        });

        document.getElementById('browse-btn').addEventListener('click', () => {
            document.getElementById('csv-file-input').click();
        });

        document.getElementById('csv-file-input').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Drag and drop
        const uploadZone = document.getElementById('upload-zone');

        uploadZone.addEventListener('click', () => {
            document.getElementById('csv-file-input').click();
        });

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.name.endsWith('.csv')) {
                this.handleFileSelect(file);
            }
        });

        // Modal overlay clicks
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAllModals();
                }
            });
        });
    }

    // ========================================
    // View Management
    // ========================================

    switchView(viewName) {
        this.currentView = viewName;

        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });

        // Update view modes
        document.querySelectorAll('.view-mode').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');

        // Re-render ideas for the new view
        this.renderIdeas();
    }

    // ========================================
    // Idea Rendering
    // ========================================

    renderIdeas() {
        const filteredIdeas = this.getFilteredIdeas();

        // Show/hide empty state
        const emptyState = document.getElementById('empty-state');
        if (this.ideas.length === 0) {
            emptyState.classList.add('show');
            return;
        } else {
            emptyState.classList.remove('show');
        }

        // Render based on current view
        switch (this.currentView) {
            case 'grid':
                this.renderGridView(filteredIdeas);
                break;
            case 'list':
                this.renderListView(filteredIdeas);
                break;
            case 'spotlight':
                this.renderSpotlightView(filteredIdeas);
                break;
        }
    }

    getFilteredIdeas() {
        return this.ideas.filter(idea => {
            // Search filter
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                const matchesSearch =
                    idea.title.toLowerCase().includes(searchLower) ||
                    idea.description.toLowerCase().includes(searchLower) ||
                    idea.category.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Category filter
            if (this.filters.category && idea.category !== this.filters.category) {
                return false;
            }

            // Priority filter
            if (this.filters.priority && idea.priority !== this.filters.priority) {
                return false;
            }

            // Status filter
            if (this.filters.status && idea.status !== this.filters.status) {
                return false;
            }

            return true;
        });
    }

    renderGridView(ideas) {
        const grid = document.getElementById('ideas-grid');
        grid.innerHTML = '';

        ideas.forEach(idea => {
            const card = this.createIdeaCard(idea);
            grid.appendChild(card);
        });
    }

    renderListView(ideas) {
        const list = document.getElementById('ideas-list');
        list.innerHTML = '';

        ideas.forEach(idea => {
            const item = this.createListItem(idea);
            list.appendChild(item);
        });
    }

    renderSpotlightView(ideas) {
        const spotlight = document.getElementById('ideas-spotlight');
        spotlight.innerHTML = '';

        ideas.forEach(idea => {
            const item = this.createSpotlightItem(idea);
            spotlight.appendChild(item);
        });
    }

    createIdeaCard(idea) {
        const card = document.createElement('div');
        card.className = 'idea-card';
        card.onclick = () => this.openDetailModal(idea.id);

        const feedbackCount = this.getFeedbackCount(idea.id);

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${this.escapeHtml(idea.title)}</h3>
                </div>
                <div class="card-badges">
                    <span class="priority-badge priority-${idea.priority}">${idea.priority}</span>
                    <span class="status-badge status-${idea.status}">${this.formatStatus(idea.status)}</span>
                </div>
            </div>
            <span class="card-category">
                <i data-lucide="tag"></i>
                ${this.escapeHtml(idea.category)}
            </span>
            <p class="card-description">${this.escapeHtml(idea.description)}</p>
            <div class="card-footer">
                <div class="feedback-count">
                    <i data-lucide="message-circle"></i>
                    <span>${feedbackCount} feedback</span>
                </div>
                <div class="card-actions">
                    <button class="icon-btn" onclick="event.stopPropagation(); app.editIdea('${idea.id}')" title="Edit">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="icon-btn" onclick="event.stopPropagation(); app.deleteIdea('${idea.id}')" title="Delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;

        // Initialize icons
        setTimeout(() => lucide.createIcons(), 0);

        return card;
    }

    createListItem(idea) {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.onclick = () => this.openDetailModal(idea.id);

        const feedbackCount = this.getFeedbackCount(idea.id);

        item.innerHTML = `
            <div class="list-content">
                <h3 class="list-title">${this.escapeHtml(idea.title)}</h3>
                <div class="list-meta">
                    <span class="card-category">
                        <i data-lucide="tag"></i>
                        ${this.escapeHtml(idea.category)}
                    </span>
                    <span class="priority-badge priority-${idea.priority}">${idea.priority}</span>
                    <span class="status-badge status-${idea.status}">${this.formatStatus(idea.status)}</span>
                    <div class="feedback-count">
                        <i data-lucide="message-circle"></i>
                        <span>${feedbackCount}</span>
                    </div>
                </div>
            </div>
            <div class="card-actions">
                <button class="icon-btn" onclick="event.stopPropagation(); app.editIdea('${idea.id}')" title="Edit">
                    <i data-lucide="edit-2"></i>
                </button>
                <button class="icon-btn" onclick="event.stopPropagation(); app.deleteIdea('${idea.id}')" title="Delete">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;

        setTimeout(() => lucide.createIcons(), 0);

        return item;
    }

    createSpotlightItem(idea) {
        const item = document.createElement('div');
        item.className = 'spotlight-item';
        item.onclick = () => this.openDetailModal(idea.id);

        const feedbackCount = this.getFeedbackCount(idea.id);

        item.innerHTML = `
            <h2 class="spotlight-title">${this.escapeHtml(idea.title)}</h2>
            <div class="spotlight-meta">
                <span class="card-category">
                    <i data-lucide="tag"></i>
                    ${this.escapeHtml(idea.category)}
                </span>
                <span class="priority-badge priority-${idea.priority}">${idea.priority}</span>
                <span class="status-badge status-${idea.status}">${this.formatStatus(idea.status)}</span>
                <div class="feedback-count">
                    <i data-lucide="message-circle"></i>
                    <span>${feedbackCount} feedback</span>
                </div>
            </div>
            <p class="spotlight-description">${this.escapeHtml(idea.description)}</p>
        `;

        setTimeout(() => lucide.createIcons(), 0);

        return item;
    }

    // ========================================
    // Idea Management
    // ========================================

    openIdeaModal(ideaId = null) {
        const modal = document.getElementById('idea-modal');
        const form = document.getElementById('idea-form');
        const title = document.getElementById('modal-title');

        if (ideaId) {
            // Edit mode
            const idea = this.ideas.find(i => i.id === ideaId);
            if (!idea) return;

            title.textContent = 'Edit Idea';
            document.getElementById('idea-title').value = idea.title;
            document.getElementById('idea-description').value = idea.description;
            document.getElementById('idea-category').value = idea.category;
            document.getElementById('idea-priority').value = idea.priority;
            document.getElementById('idea-status').value = idea.status;

            form.dataset.editId = ideaId;
        } else {
            // Add mode
            title.textContent = 'Add New Idea';
            form.reset();
            delete form.dataset.editId;
        }

        modal.classList.add('active');
        setTimeout(() => lucide.createIcons(), 0);
    }

    closeIdeaModal() {
        const modal = document.getElementById('idea-modal');
        modal.classList.remove('active');
        document.getElementById('idea-form').reset();
    }

    saveIdea() {
        const form = document.getElementById('idea-form');
        const editId = form.dataset.editId;

        const ideaData = {
            title: document.getElementById('idea-title').value.trim(),
            description: document.getElementById('idea-description').value.trim(),
            category: document.getElementById('idea-category').value.trim(),
            priority: document.getElementById('idea-priority').value,
            status: document.getElementById('idea-status').value
        };

        if (editId) {
            // Update existing idea
            const index = this.ideas.findIndex(i => i.id === editId);
            if (index !== -1) {
                this.ideas[index] = { ...this.ideas[index], ...ideaData };
            }
        } else {
            // Create new idea
            const newIdea = {
                id: this.generateId(),
                ...ideaData,
                createdAt: new Date().toISOString()
            };
            this.ideas.unshift(newIdea);
        }

        this.saveData();
        this.closeIdeaModal();
        this.renderIdeas();
        this.updateCategoryFilter();
    }

    editIdea(ideaId) {
        this.openIdeaModal(ideaId);
    }

    deleteIdea(ideaId) {
        if (!confirm('Are you sure you want to delete this idea?')) {
            return;
        }

        this.ideas = this.ideas.filter(i => i.id !== ideaId);
        delete this.feedback[ideaId];
        this.saveData();
        this.renderIdeas();
        this.updateCategoryFilter();
    }

    // ========================================
    // Detail Modal
    // ========================================

    openDetailModal(ideaId) {
        this.currentIdeaId = ideaId;
        const idea = this.ideas.find(i => i.id === ideaId);
        if (!idea) return;

        const modal = document.getElementById('detail-modal');
        const content = document.getElementById('detail-content');

        content.innerHTML = `
            <h1 class="detail-title">${this.escapeHtml(idea.title)}</h1>
            <div class="detail-meta">
                <span class="card-category">
                    <i data-lucide="tag"></i>
                    ${this.escapeHtml(idea.category)}
                </span>
                <span class="priority-badge priority-${idea.priority}">${idea.priority}</span>
                <span class="status-badge status-${idea.status}">${this.formatStatus(idea.status)}</span>
            </div>
            <p class="detail-description">${this.escapeHtml(idea.description)}</p>
        `;

        this.renderFeedbackList();
        modal.classList.add('active');
        setTimeout(() => lucide.createIcons(), 0);
    }

    closeDetailModal() {
        const modal = document.getElementById('detail-modal');
        modal.classList.remove('active');
        this.currentIdeaId = null;
        this.currentSentiment = null;
        document.getElementById('feedback-text').value = '';
        document.querySelectorAll('.sentiment-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // ========================================
    // Feedback System
    // ========================================

    toggleSentiment(sentiment) {
        const buttons = document.querySelectorAll('.sentiment-btn');

        if (this.currentSentiment === sentiment) {
            // Deselect
            this.currentSentiment = null;
            buttons.forEach(btn => btn.classList.remove('active'));
        } else {
            // Select
            this.currentSentiment = sentiment;
            buttons.forEach(btn => {
                if (btn.dataset.sentiment === sentiment) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    addFeedback() {
        const text = document.getElementById('feedback-text').value.trim();

        if (!text && !this.currentSentiment) {
            alert('Please enter feedback text or select a sentiment');
            return;
        }

        if (!this.currentIdeaId) return;

        const feedbackItem = {
            id: this.generateId(),
            text: text,
            sentiment: this.currentSentiment,
            timestamp: new Date().toISOString()
        };

        if (!this.feedback[this.currentIdeaId]) {
            this.feedback[this.currentIdeaId] = [];
        }

        this.feedback[this.currentIdeaId].unshift(feedbackItem);
        this.saveData();

        // Reset form
        document.getElementById('feedback-text').value = '';
        this.currentSentiment = null;
        document.querySelectorAll('.sentiment-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        this.renderFeedbackList();
        this.renderIdeas();
    }

    renderFeedbackList() {
        const list = document.getElementById('feedback-list');
        const ideaFeedback = this.feedback[this.currentIdeaId] || [];

        if (ideaFeedback.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 20px;">No feedback yet. Be the first to share your thoughts!</p>';
            return;
        }

        list.innerHTML = '';
        ideaFeedback.forEach(fb => {
            const item = document.createElement('div');
            item.className = 'feedback-item';

            const sentimentHtml = fb.sentiment ? `
                <span class="feedback-sentiment ${fb.sentiment}">
                    <i data-lucide="${this.getSentimentIcon(fb.sentiment)}"></i>
                    ${this.formatSentiment(fb.sentiment)}
                </span>
            ` : '';

            item.innerHTML = `
                <div class="feedback-header">
                    ${sentimentHtml}
                    <span class="feedback-timestamp">${this.formatDate(fb.timestamp)}</span>
                </div>
                ${fb.text ? `<p class="feedback-text">${this.escapeHtml(fb.text)}</p>` : ''}
            `;

            list.appendChild(item);
        });

        setTimeout(() => lucide.createIcons(), 0);
    }

    getFeedbackCount(ideaId) {
        return (this.feedback[ideaId] || []).length;
    }

    getSentimentIcon(sentiment) {
        const icons = {
            'like': 'thumbs-up',
            'dislike': 'thumbs-down',
            'idea': 'lightbulb'
        };
        return icons[sentiment] || 'message-circle';
    }

    formatSentiment(sentiment) {
        const labels = {
            'like': 'Positive',
            'dislike': 'Concern',
            'idea': 'Suggestion'
        };
        return labels[sentiment] || sentiment;
    }

    // ========================================
    // CSV Import/Export
    // ========================================

    openUploadModal() {
        const modal = document.getElementById('upload-modal');
        modal.classList.add('active');
        document.getElementById('upload-progress').classList.add('hidden');
        setTimeout(() => lucide.createIcons(), 0);
    }

    closeUploadModal() {
        const modal = document.getElementById('upload-modal');
        modal.classList.remove('active');
        document.getElementById('csv-file-input').value = '';
    }

    handleFileSelect(file) {
        if (!file || !file.name.endsWith('.csv')) {
            alert('Please select a valid CSV file');
            return;
        }

        const progressDiv = document.getElementById('upload-progress');
        progressDiv.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                this.parseCSV(csv);

                setTimeout(() => {
                    this.closeUploadModal();
                    alert(`Successfully imported ${this.ideas.length} ideas!`);
                }, 1000);
            } catch (error) {
                alert('Error parsing CSV file: ' + error.message);
                progressDiv.classList.add('hidden');
            }
        };

        reader.readAsText(file);
    }

    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file is empty or has no data rows');
        }

        // Parse header
        const headers = this.parseCSVLine(lines[0]);

        // Required columns
        const requiredCols = ['title', 'description', 'category'];
        const missingCols = requiredCols.filter(col =>
            !headers.some(h => h.toLowerCase() === col)
        );

        if (missingCols.length > 0) {
            throw new Error(`Missing required columns: ${missingCols.join(', ')}`);
        }

        // Create column index map
        const colMap = {};
        headers.forEach((header, index) => {
            colMap[header.toLowerCase().trim()] = index;
        });

        // Parse data rows
        const newIdeas = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);

            if (values.length === 0 || values.every(v => !v.trim())) {
                continue; // Skip empty rows
            }

            const idea = {
                id: this.generateId(),
                title: values[colMap['title']] || '',
                description: values[colMap['description']] || '',
                category: values[colMap['category']] || 'Uncategorized',
                priority: values[colMap['priority']]?.toLowerCase() || 'medium',
                status: values[colMap['status']]?.toLowerCase().replace(/\s+/g, '-') || 'proposed',
                createdAt: new Date().toISOString()
            };

            // Validate priority and status
            if (!['high', 'medium', 'low'].includes(idea.priority)) {
                idea.priority = 'medium';
            }

            if (!['proposed', 'in-review', 'approved', 'implemented', 'archived'].includes(idea.status)) {
                idea.status = 'proposed';
            }

            newIdeas.push(idea);
        }

        // Merge with existing ideas (prepend new ones)
        this.ideas = [...newIdeas, ...this.ideas];
        this.saveData();
        this.renderIdeas();
        this.updateCategoryFilter();
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    exportToCSV() {
        if (this.ideas.length === 0) {
            alert('No ideas to export!');
            return;
        }

        // Create CSV header
        let csv = 'title,description,category,priority,status,feedback_count,created_at\n';

        // Add data rows
        this.ideas.forEach(idea => {
            const feedbackCount = this.getFeedbackCount(idea.id);
            const row = [
                this.escapeCSV(idea.title),
                this.escapeCSV(idea.description),
                this.escapeCSV(idea.category),
                idea.priority,
                idea.status,
                feedbackCount,
                idea.createdAt
            ];
            csv += row.join(',') + '\n';
        });

        // Create download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-ideas-export-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        // Show success feedback
        this.showNotification('Data exported successfully!');
    }

    escapeCSV(str) {
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    // ========================================
    // Utility Functions
    // ========================================

    updateCategoryFilter() {
        const select = document.getElementById('category-filter');
        const currentValue = select.value;

        // Get unique categories
        const categories = new Set(this.ideas.map(idea => idea.category));

        // Rebuild options
        select.innerHTML = '<option value="">All Categories</option>';
        Array.from(categories).sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });

        // Restore selection
        select.value = currentValue;
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatStatus(status) {
        return status.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    showNotification(message) {
        const indicator = document.getElementById('save-status');
        const originalText = indicator.textContent;
        indicator.textContent = message;

        setTimeout(() => {
            this.updateSaveIndicator();
        }, 3000);
    }
}

// ========================================
// Initialize Application
// ========================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new AIIdeationPlatform();

    // Initialize Lucide icons
    lucide.createIcons();
});
