// AI Agent Library Application
// A comprehensive tool for managing AI agents, tools, and workflows

class AIAgentLibrary {
  constructor() {
    this.data = {
      agents: [],
      teams: [],
      tools: [],
      workflows: []
    };

    this.currentAgent = null;
    this.currentTool = null;
    this.currentTeam = null;
    this.currentWorkflow = null;
    this.currentWorkflowSteps = [];
    this.currentAgentView = 'grid';

    this.init();
  }

  // ===========================================
  // INITIALIZATION
  // ===========================================

  init() {
    this.loadData();
    this.setupEventListeners();
    this.renderAll();

    // Add sample data if empty
    if (this.data.agents.length === 0 && this.data.tools.length === 0) {
      this.loadSampleData();
    }
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Agent View Toggles
    document.querySelectorAll('[data-agent-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-agent-view');
        this.switchAgentView(view);
      });
    });

    // Agent Actions
    document.getElementById('add-agent-btn').addEventListener('click', () => this.openAgentModal());
    document.getElementById('import-agents-btn').addEventListener('click', () => this.importCSV('agents'));
    document.getElementById('agent-search').addEventListener('input', (e) => this.filterAgents());
    document.getElementById('agent-status-filter').addEventListener('change', () => this.filterAgents());
    document.getElementById('agent-team-filter').addEventListener('change', () => this.filterAgents());

    // Tool Actions
    document.getElementById('add-tool-btn').addEventListener('click', () => this.openToolModal());
    document.getElementById('import-tools-btn').addEventListener('click', () => this.importCSV('tools'));
    document.getElementById('tool-search').addEventListener('input', () => this.filterTools());
    document.getElementById('tool-category-filter').addEventListener('change', () => this.filterTools());
    document.getElementById('tool-pricing-filter').addEventListener('change', () => this.filterTools());
    document.getElementById('tool-favorites-only').addEventListener('change', () => this.filterTools());

    // Workflow Actions
    document.getElementById('create-workflow-btn').addEventListener('click', () => this.openWorkflowModal());
    document.getElementById('import-workflows-btn').addEventListener('click', () => this.importCSV('workflows'));
    document.getElementById('workflow-search').addEventListener('input', () => this.filterWorkflows());
    document.getElementById('workflow-status-filter').addEventListener('change', () => this.filterWorkflows());
    document.getElementById('workflow-priority-filter').addEventListener('change', () => this.filterWorkflows());

    // Team Actions
    document.getElementById('add-team-btn').addEventListener('click', () => this.openTeamModal());

    // Export Data
    document.getElementById('export-data-btn').addEventListener('click', () => this.exportAllData());

    // CSV Import
    document.getElementById('csv-file-input').addEventListener('change', (e) => this.handleCSVUpload(e));

    // Modal Overlays - Close on background click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }

  // ===========================================
  // DATA MANAGEMENT (localStorage)
  // ===========================================

  loadData() {
    const saved = localStorage.getItem('aiAgentLibrary');
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      // Initialize with default teams
      this.data.teams = [
        { id: Date.now(), name: 'Research', color: '#4ECDC4' },
        { id: Date.now() + 1, name: 'Development', color: '#FF6B35' },
        { id: Date.now() + 2, name: 'Marketing', color: '#FF8B94' }
      ];
    }
  }

  saveData() {
    localStorage.setItem('aiAgentLibrary', JSON.stringify(this.data));
  }

  // ===========================================
  // VIEW MANAGEMENT
  // ===========================================

  switchView(viewName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      }
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');

    // Render appropriate content
    if (viewName === 'agents') this.renderAgents();
    if (viewName === 'tools') this.renderTools();
    if (viewName === 'workflows') this.renderWorkflows();
  }

  switchAgentView(viewName) {
    this.currentAgentView = viewName;

    // Update toggle buttons
    document.querySelectorAll('[data-agent-view]').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-agent-view') === viewName) {
        btn.classList.add('active');
      }
    });

    // Hide all views
    document.querySelectorAll('.agent-view-container').forEach(view => {
      view.classList.add('hidden');
    });

    // Show selected view
    if (viewName === 'grid') {
      document.getElementById('agent-grid-view').classList.remove('hidden');
      this.renderAgents();
    } else if (viewName === 'org-chart') {
      document.getElementById('agent-org-chart-view').classList.remove('hidden');
      this.renderOrgChart();
    } else if (viewName === 'teams') {
      document.getElementById('agent-teams-view').classList.remove('hidden');
      this.renderTeams();
    }
  }

  renderAll() {
    this.renderAgents();
    this.renderTools();
    this.renderWorkflows();
    this.updateTeamDropdowns();
  }

  // ===========================================
  // AGENT MANAGEMENT
  // ===========================================

  renderAgents() {
    const grid = document.getElementById('agents-grid');
    const empty = document.getElementById('agents-empty');

    const agents = this.getFilteredAgents();

    if (agents.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = agents.map(agent => this.createAgentCard(agent)).join('');
  }

  getFilteredAgents() {
    let agents = [...this.data.agents];

    const searchTerm = document.getElementById('agent-search').value.toLowerCase();
    const statusFilter = document.getElementById('agent-status-filter').value;
    const teamFilter = document.getElementById('agent-team-filter').value;

    if (searchTerm) {
      agents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.role.toLowerCase().includes(searchTerm) ||
        (agent.task && agent.task.toLowerCase().includes(searchTerm))
      );
    }

    if (statusFilter) {
      agents = agents.filter(agent => agent.status === statusFilter);
    }

    if (teamFilter) {
      agents = agents.filter(agent => agent.team === teamFilter);
    }

    return agents;
  }

  filterAgents() {
    this.renderAgents();
  }

  createAgentCard(agent) {
    const team = this.data.teams.find(t => t.id === agent.team);
    const teamName = team ? team.name : 'No Team';
    const teamColor = team ? team.color : '#6B7280';

    const capabilities = agent.capabilities || [];
    const initials = this.getInitials(agent.name);

    return `
      <div class="agent-card" data-id="${agent.id}">
        <div class="agent-status ${agent.status}"></div>
        <div class="agent-card-header">
          <div class="agent-avatar" style="background-color: ${agent.avatarColor || '#FF6B35'}">
            ${initials}
          </div>
          <div class="agent-info">
            <div class="agent-name">${this.escapeHtml(agent.name)}</div>
            <div class="agent-role">${this.escapeHtml(agent.role)}</div>
            ${team ? `<span class="agent-team-badge" style="background-color: ${teamColor}">${this.escapeHtml(teamName)}</span>` : ''}
          </div>
        </div>
        ${agent.task ? `<div class="agent-task">${this.escapeHtml(agent.task)}</div>` : ''}
        ${capabilities.length > 0 ? `
          <div class="agent-capabilities">
            ${capabilities.slice(0, 3).map(cap => `<span class="capability-tag">${this.escapeHtml(cap)}</span>`).join('')}
            ${capabilities.length > 3 ? `<span class="capability-tag">+${capabilities.length - 3}</span>` : ''}
          </div>
        ` : ''}
        <div class="agent-actions">
          <button class="btn btn-tertiary btn-small" onclick="app.editAgent(${agent.id})">✏️ Edit</button>
          <button class="btn btn-tertiary btn-small" onclick="app.deleteAgent(${agent.id})">🗑️ Delete</button>
        </div>
      </div>
    `;
  }

  openAgentModal(agentId = null) {
    this.currentAgent = agentId;
    const modal = document.getElementById('agent-modal');
    const title = document.getElementById('agent-modal-title');

    if (agentId) {
      const agent = this.data.agents.find(a => a.id === agentId);
      title.textContent = 'Edit Agent';
      document.getElementById('agent-name').value = agent.name;
      document.getElementById('agent-role').value = agent.role;
      document.getElementById('agent-task').value = agent.task || '';
      document.getElementById('agent-help').value = agent.help || '';
      document.getElementById('agent-capabilities').value = (agent.capabilities || []).join(', ');
      document.getElementById('agent-team').value = agent.team || '';
      document.getElementById('agent-status').value = agent.status;
      document.getElementById('agent-avatar-color').value = agent.avatarColor || '#FF6B35';
    } else {
      title.textContent = 'Add New Agent';
      document.getElementById('agent-form').reset();
    }

    this.updateTeamDropdowns();
    modal.classList.add('active');
  }

  closeAgentModal() {
    document.getElementById('agent-modal').classList.remove('active');
    this.currentAgent = null;
  }

  saveAgent() {
    const name = document.getElementById('agent-name').value.trim();
    const role = document.getElementById('agent-role').value.trim();

    if (!name || !role) {
      this.showToast('Please fill in required fields', 'error');
      return;
    }

    const agentData = {
      name,
      role,
      task: document.getElementById('agent-task').value.trim(),
      help: document.getElementById('agent-help').value.trim(),
      capabilities: document.getElementById('agent-capabilities').value
        .split(',')
        .map(c => c.trim())
        .filter(c => c),
      team: document.getElementById('agent-team').value || null,
      status: document.getElementById('agent-status').value,
      avatarColor: document.getElementById('agent-avatar-color').value,
      dateAdded: new Date().toISOString()
    };

    if (this.currentAgent) {
      // Edit existing
      const index = this.data.agents.findIndex(a => a.id === this.currentAgent);
      this.data.agents[index] = { ...this.data.agents[index], ...agentData };
      this.showToast('Agent updated successfully', 'success');
    } else {
      // Add new
      agentData.id = Date.now();
      this.data.agents.push(agentData);
      this.showToast('Agent added successfully', 'success');
    }

    this.saveData();
    this.renderAgents();
    this.closeAgentModal();
  }

  editAgent(id) {
    this.openAgentModal(id);
  }

  deleteAgent(id) {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    this.data.agents = this.data.agents.filter(a => a.id !== id);
    this.saveData();
    this.renderAgents();
    this.showToast('Agent deleted', 'info');
  }

  // ===========================================
  // ORG CHART
  // ===========================================

  renderOrgChart() {
    const container = document.getElementById('org-chart');
    const teams = this.data.teams;

    if (teams.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-text">No teams yet. Create a team to organize your agents.</div></div>';
      return;
    }

    container.innerHTML = teams.map(team => {
      const teamAgents = this.data.agents.filter(a => a.team === team.id);

      return `
        <div class="org-team-section">
          <div class="org-team-header" style="background: linear-gradient(135deg, ${team.color}, ${this.lightenColor(team.color)})">
            <div class="org-team-name">${this.escapeHtml(team.name)}</div>
            <div class="org-team-count">${teamAgents.length} member${teamAgents.length !== 1 ? 's' : ''}</div>
          </div>
          <div class="org-team-members">
            ${teamAgents.map(agent => {
              const initials = this.getInitials(agent.name);
              return `
                <div class="org-agent-node">
                  <div class="org-agent-avatar" style="background-color: ${agent.avatarColor || team.color}">
                    ${initials}
                  </div>
                  <div class="org-agent-name">${this.escapeHtml(agent.name)}</div>
                  <div class="org-agent-role">${this.escapeHtml(agent.role)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // ===========================================
  // TEAM MANAGEMENT
  // ===========================================

  renderTeams() {
    const grid = document.getElementById('teams-grid');
    const teams = this.data.teams;

    if (teams.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-text">No teams yet</div></div>';
      return;
    }

    grid.innerHTML = teams.map(team => {
      const memberCount = this.data.agents.filter(a => a.team === team.id).length;

      return `
        <div class="card" style="border-top: 4px solid ${team.color}">
          <div style="padding: 24px;">
            <h3 style="margin-bottom: 8px; color: ${team.color}">${this.escapeHtml(team.name)}</h3>
            <p style="color: #6B7280; font-size: 14px; margin-bottom: 16px;">
              ${memberCount} member${memberCount !== 1 ? 's' : ''}
            </p>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-tertiary btn-small" onclick="app.deleteTeam(${team.id})">🗑️ Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  openTeamModal() {
    const modal = document.getElementById('team-modal');
    document.getElementById('team-form').reset();
    modal.classList.add('active');
  }

  closeTeamModal() {
    document.getElementById('team-modal').classList.remove('active');
  }

  saveTeam() {
    const name = document.getElementById('team-name').value.trim();
    const color = document.getElementById('team-color').value;

    if (!name) {
      this.showToast('Please enter a team name', 'error');
      return;
    }

    const team = {
      id: Date.now(),
      name,
      color
    };

    this.data.teams.push(team);
    this.saveData();
    this.updateTeamDropdowns();
    this.renderTeams();
    this.closeTeamModal();
    this.showToast('Team created successfully', 'success');
  }

  deleteTeam(id) {
    if (!confirm('Are you sure? Agents in this team will become unassigned.')) return;

    // Unassign agents from this team
    this.data.agents.forEach(agent => {
      if (agent.team === id) agent.team = null;
    });

    this.data.teams = this.data.teams.filter(t => t.id !== id);
    this.saveData();
    this.updateTeamDropdowns();
    this.renderTeams();
    this.renderAgents();
    this.showToast('Team deleted', 'info');
  }

  updateTeamDropdowns() {
    const dropdowns = [
      document.getElementById('agent-team'),
      document.getElementById('agent-team-filter')
    ];

    dropdowns.forEach(dropdown => {
      if (!dropdown) return;

      const currentValue = dropdown.value;
      const isFilter = dropdown.id.includes('filter');

      dropdown.innerHTML = isFilter
        ? '<option value="">All Teams</option>'
        : '<option value="">No Team</option>';

      this.data.teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        dropdown.appendChild(option);
      });

      dropdown.value = currentValue;
    });
  }

  // ===========================================
  // TOOL MANAGEMENT
  // ===========================================

  renderTools() {
    const grid = document.getElementById('tools-grid');
    const empty = document.getElementById('tools-empty');

    const tools = this.getFilteredTools();

    if (tools.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = tools.map(tool => this.createToolCard(tool)).join('');
  }

  getFilteredTools() {
    let tools = [...this.data.tools];

    const searchTerm = document.getElementById('tool-search').value.toLowerCase();
    const categoryFilter = document.getElementById('tool-category-filter').value;
    const pricingFilter = document.getElementById('tool-pricing-filter').value;
    const favoritesOnly = document.getElementById('tool-favorites-only').checked;

    if (searchTerm) {
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm) ||
        (tool.description && tool.description.toLowerCase().includes(searchTerm))
      );
    }

    if (categoryFilter) {
      tools = tools.filter(tool => tool.category === categoryFilter);
    }

    if (pricingFilter) {
      tools = tools.filter(tool => tool.pricing === pricingFilter);
    }

    if (favoritesOnly) {
      tools = tools.filter(tool => tool.favorite);
    }

    return tools;
  }

  filterTools() {
    this.renderTools();
  }

  createToolCard(tool) {
    const categoryColors = {
      llm: '#4ECDC4',
      image: '#FF8B94',
      automation: '#95B46A',
      data: '#FFE66D',
      code: '#FF6B35',
      other: '#6B7280'
    };

    const categoryColor = categoryColors[tool.category] || categoryColors.other;
    const stars = this.renderStars(tool.rating || 3);
    const topUseCase = (tool.useCases && tool.useCases[0]) ? tool.useCases[0] : '';

    return `
      <div class="tool-card" data-id="${tool.id}">
        <span class="tool-favorite ${tool.favorite ? 'active' : ''}" onclick="app.toggleToolFavorite(${tool.id})">
          ${tool.favorite ? '❤️' : '🤍'}
        </span>
        <span class="tool-pricing-badge ${tool.pricing}">${this.capitalizeFirst(tool.pricing)}</span>

        <div class="tool-icon">${tool.icon || '🤖'}</div>

        <div class="tool-header">
          <div class="tool-name">${this.escapeHtml(tool.name)}</div>
          <span class="tool-category-badge" style="background-color: ${categoryColor}">
            ${this.capitalizeFirst(tool.category)}
          </span>
          <div class="tool-rating">${stars}</div>
        </div>

        ${tool.description ? `<div class="tool-description">${this.escapeHtml(tool.description)}</div>` : ''}
        ${topUseCase ? `<div class="tool-use-case">💡 ${this.escapeHtml(topUseCase)}</div>` : ''}

        <div class="tool-actions">
          <a href="${tool.website}" target="_blank" class="btn btn-tertiary btn-small">🔗 Visit</a>
          <button class="btn btn-tertiary btn-small" onclick="app.editTool(${tool.id})">✏️ Edit</button>
          <button class="btn btn-tertiary btn-small" onclick="app.deleteTool(${tool.id})">🗑️</button>
        </div>
      </div>
    `;
  }

  renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
    }
    return stars;
  }

  toggleToolFavorite(id) {
    const tool = this.data.tools.find(t => t.id === id);
    if (tool) {
      tool.favorite = !tool.favorite;
      this.saveData();
      this.renderTools();
    }
  }

  openToolModal(toolId = null) {
    this.currentTool = toolId;
    const modal = document.getElementById('tool-modal');
    const title = document.getElementById('tool-modal-title');

    if (toolId) {
      const tool = this.data.tools.find(t => t.id === toolId);
      title.textContent = 'Edit Tool';
      document.getElementById('tool-name').value = tool.name;
      document.getElementById('tool-website').value = tool.website;
      document.getElementById('tool-category').value = tool.category;
      document.getElementById('tool-pricing').value = tool.pricing || 'free';
      document.getElementById('tool-description').value = tool.description || '';
      document.getElementById('tool-how-to-use').value = tool.howToUse || '';
      document.getElementById('tool-use-cases').value = (tool.useCases || []).join(', ');
      document.getElementById('tool-features').value = (tool.features || []).join(', ');
      document.getElementById('tool-tips').value = tool.tips || '';
      document.getElementById('tool-rating').value = tool.rating || 5;
      document.getElementById('tool-icon').value = tool.icon || '';
    } else {
      title.textContent = 'Add New Tool';
      document.getElementById('tool-form').reset();
    }

    modal.classList.add('active');
  }

  closeToolModal() {
    document.getElementById('tool-modal').classList.remove('active');
    this.currentTool = null;
  }

  saveTool() {
    const name = document.getElementById('tool-name').value.trim();
    const website = document.getElementById('tool-website').value.trim();
    const category = document.getElementById('tool-category').value;

    if (!name || !website || !category) {
      this.showToast('Please fill in required fields', 'error');
      return;
    }

    const toolData = {
      name,
      website,
      category,
      pricing: document.getElementById('tool-pricing').value,
      description: document.getElementById('tool-description').value.trim(),
      howToUse: document.getElementById('tool-how-to-use').value.trim(),
      useCases: document.getElementById('tool-use-cases').value
        .split(',')
        .map(c => c.trim())
        .filter(c => c),
      features: document.getElementById('tool-features').value
        .split(',')
        .map(c => c.trim())
        .filter(c => c),
      tips: document.getElementById('tool-tips').value.trim(),
      rating: parseInt(document.getElementById('tool-rating').value),
      icon: document.getElementById('tool-icon').value.trim(),
      favorite: false,
      dateAdded: new Date().toISOString()
    };

    if (this.currentTool) {
      // Edit existing
      const index = this.data.tools.findIndex(t => t.id === this.currentTool);
      toolData.favorite = this.data.tools[index].favorite; // Preserve favorite status
      this.data.tools[index] = { ...this.data.tools[index], ...toolData };
      this.showToast('Tool updated successfully', 'success');
    } else {
      // Add new
      toolData.id = Date.now();
      this.data.tools.push(toolData);
      this.showToast('Tool added successfully', 'success');
    }

    this.saveData();
    this.renderTools();
    this.closeToolModal();
  }

  editTool(id) {
    this.openToolModal(id);
  }

  deleteTool(id) {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    this.data.tools = this.data.tools.filter(t => t.id !== id);
    this.saveData();
    this.renderTools();
    this.showToast('Tool deleted', 'info');
  }

  // ===========================================
  // WORKFLOW MANAGEMENT
  // ===========================================

  renderWorkflows() {
    const grid = document.getElementById('workflows-grid');
    const empty = document.getElementById('workflows-empty');

    const workflows = this.getFilteredWorkflows();

    if (workflows.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    grid.innerHTML = workflows.map(workflow => this.createWorkflowCard(workflow)).join('');
  }

  getFilteredWorkflows() {
    let workflows = [...this.data.workflows];

    const searchTerm = document.getElementById('workflow-search').value.toLowerCase();
    const statusFilter = document.getElementById('workflow-status-filter').value;
    const priorityFilter = document.getElementById('workflow-priority-filter').value;

    if (searchTerm) {
      workflows = workflows.filter(wf =>
        wf.name.toLowerCase().includes(searchTerm) ||
        (wf.description && wf.description.toLowerCase().includes(searchTerm))
      );
    }

    if (statusFilter) {
      workflows = workflows.filter(wf => wf.status === statusFilter);
    }

    if (priorityFilter) {
      workflows = workflows.filter(wf => wf.priority === priorityFilter);
    }

    return workflows;
  }

  filterWorkflows() {
    this.renderWorkflows();
  }

  createWorkflowCard(workflow) {
    const steps = workflow.steps || [];
    const completedSteps = steps.filter(s => s.completed).length;
    const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

    // Get unique agents from workflow steps
    const agentIds = [...new Set(steps.flatMap(s => s.agentIds || []))];
    const agents = agentIds.map(id => this.data.agents.find(a => a.id === id)).filter(Boolean);

    return `
      <div class="workflow-card" data-id="${workflow.id}" onclick="app.openWorkflowBuilder(${workflow.id})">
        <div class="workflow-card-header">
          <span class="workflow-icon">${workflow.icon || '📝'}</span>
          <div class="workflow-header-info">
            <div class="workflow-name">${this.escapeHtml(workflow.name)}</div>
            <span class="workflow-status-badge">${this.capitalizeFirst(workflow.status)}</span>
          </div>
        </div>
        <div class="workflow-card-body">
          <div class="workflow-progress">
            <div class="workflow-progress-label">
              <span>Progress</span>
              <span>${progress}%</span>
            </div>
            <div class="workflow-progress-bar">
              <div class="workflow-progress-fill" style="width: ${progress}%"></div>
            </div>
          </div>

          <div class="workflow-meta">
            <span class="workflow-meta-item">📋 ${steps.length} step${steps.length !== 1 ? 's' : ''}</span>
            <span class="workflow-priority ${workflow.priority}">
              ${workflow.priority === 'high' ? '🔴' : workflow.priority === 'medium' ? '🟡' : '🟢'}
              ${this.capitalizeFirst(workflow.priority)} Priority
            </span>
          </div>

          ${agents.length > 0 ? `
            <div class="workflow-agents">
              <span class="workflow-agents-label">Agents:</span>
              <div class="workflow-avatar-stack">
                ${agents.slice(0, 3).map(agent => {
                  const initials = this.getInitials(agent.name);
                  return `
                    <div class="workflow-avatar" style="background-color: ${agent.avatarColor || '#FF6B35'}" title="${this.escapeHtml(agent.name)}">
                      ${initials}
                    </div>
                  `;
                }).join('')}
                ${agents.length > 3 ? `<div class="workflow-avatar" style="background-color: #6B7280">+${agents.length - 3}</div>` : ''}
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: flex-end;" onclick="event.stopPropagation()">
            <button class="btn btn-tertiary btn-small" onclick="app.deleteWorkflow(${workflow.id})">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `;
  }

  openWorkflowModal(workflowId = null) {
    this.currentWorkflow = workflowId;
    const modal = document.getElementById('workflow-modal');
    const title = document.getElementById('workflow-modal-title');

    if (workflowId) {
      const workflow = this.data.workflows.find(w => w.id === workflowId);
      title.textContent = 'Edit Workflow';
      document.getElementById('workflow-name').value = workflow.name;
      document.getElementById('workflow-icon').value = workflow.icon || '';
      document.getElementById('workflow-description').value = workflow.description || '';
      document.getElementById('workflow-status').value = workflow.status;
      document.getElementById('workflow-priority').value = workflow.priority;
      document.getElementById('workflow-category').value = workflow.category || '';
    } else {
      title.textContent = 'Create New Workflow';
      document.getElementById('workflow-form').reset();
    }

    modal.classList.add('active');
  }

  closeWorkflowModal() {
    document.getElementById('workflow-modal').classList.remove('active');
    this.currentWorkflow = null;
  }

  saveWorkflow() {
    const name = document.getElementById('workflow-name').value.trim();

    if (!name) {
      this.showToast('Please enter a workflow name', 'error');
      return;
    }

    const workflowData = {
      name,
      icon: document.getElementById('workflow-icon').value.trim(),
      description: document.getElementById('workflow-description').value.trim(),
      status: document.getElementById('workflow-status').value,
      priority: document.getElementById('workflow-priority').value,
      category: document.getElementById('workflow-category').value.trim(),
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      steps: []
    };

    if (this.currentWorkflow) {
      // Edit existing
      const index = this.data.workflows.findIndex(w => w.id === this.currentWorkflow);
      const existingSteps = this.data.workflows[index].steps || [];
      this.data.workflows[index] = {
        ...this.data.workflows[index],
        ...workflowData,
        steps: existingSteps // Preserve steps
      };
      this.showToast('Workflow updated successfully', 'success');
      this.closeWorkflowModal();
      this.openWorkflowBuilder(this.currentWorkflow);
    } else {
      // Add new
      workflowData.id = Date.now();
      this.data.workflows.push(workflowData);
      this.showToast('Workflow created successfully', 'success');
      this.closeWorkflowModal();
      this.openWorkflowBuilder(workflowData.id);
    }

    this.saveData();
    this.renderWorkflows();
  }

  deleteWorkflow(id) {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    this.data.workflows = this.data.workflows.filter(w => w.id !== id);
    this.saveData();
    this.renderWorkflows();
    this.showToast('Workflow deleted', 'info');
  }

  // ===========================================
  // WORKFLOW BUILDER
  // ===========================================

  openWorkflowBuilder(workflowId) {
    this.currentWorkflow = workflowId;
    const workflow = this.data.workflows.find(w => w.id === workflowId);

    if (!workflow) return;

    this.currentWorkflowSteps = workflow.steps || [];

    const modal = document.getElementById('workflow-builder-modal');
    document.getElementById('workflow-builder-title').textContent = `Build: ${workflow.name}`;

    // Populate agent and tool lists
    this.renderWorkflowSidebars();
    this.renderWorkflowSteps();

    modal.classList.add('active');
  }

  closeWorkflowBuilder() {
    document.getElementById('workflow-builder-modal').classList.remove('active');
    this.currentWorkflow = null;
    this.currentWorkflowSteps = [];
  }

  renderWorkflowSidebars() {
    // Render agents sidebar
    const agentsList = document.getElementById('workflow-agents-list');
    agentsList.innerHTML = this.data.agents.map(agent => {
      const initials = this.getInitials(agent.name);
      return `
        <div class="sidebar-agent-card" data-agent-id="${agent.id}">
          <div class="sidebar-avatar" style="background-color: ${agent.avatarColor || '#FF6B35'}">
            ${initials}
          </div>
          <div class="sidebar-item-info">
            <div class="sidebar-item-name">${this.escapeHtml(agent.name)}</div>
            <div class="sidebar-item-role">${this.escapeHtml(agent.role)}</div>
          </div>
        </div>
      `;
    }).join('');

    // Render tools sidebar
    const toolsList = document.getElementById('workflow-tools-list');
    toolsList.innerHTML = this.data.tools.map(tool => {
      return `
        <div class="sidebar-tool-card" data-tool-id="${tool.id}">
          <div class="sidebar-tool-icon">${tool.icon || '🤖'}</div>
          <div class="sidebar-item-info">
            <div class="sidebar-item-name">${this.escapeHtml(tool.name)}</div>
            <div class="sidebar-item-role">${this.escapeHtml(tool.category)}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderWorkflowSteps() {
    const container = document.getElementById('workflow-steps-container');
    const empty = document.getElementById('workflow-steps-empty');

    if (this.currentWorkflowSteps.length === 0) {
      container.innerHTML = '';
      empty.style.display = 'flex';
      return;
    }

    empty.style.display = 'none';
    container.innerHTML = this.currentWorkflowSteps.map((step, index) => {
      const agents = (step.agentIds || []).map(id => this.data.agents.find(a => a.id === id)).filter(Boolean);
      const tools = (step.toolIds || []).map(id => this.data.tools.find(t => t.id === id)).filter(Boolean);

      return `
        <div class="workflow-step">
          <div class="workflow-step-number">${index + 1}</div>
          <div class="workflow-step-actions">
            <button class="btn btn-tertiary btn-small" onclick="app.deleteWorkflowStep(${index})">×</button>
          </div>
          <div class="workflow-step-content">
            <input type="text"
              class="form-input workflow-step-name"
              placeholder="Step name"
              value="${this.escapeHtml(step.name || '')}"
              onchange="app.updateStepName(${index}, this.value)">

            <textarea
              class="form-textarea workflow-step-desc"
              placeholder="Step description"
              onchange="app.updateStepDescription(${index}, this.value)"
              rows="2">${this.escapeHtml(step.description || '')}</textarea>

            <div class="workflow-step-meta">
              ${agents.length > 0 ? `
                <div>
                  <strong>Agents:</strong> ${agents.map(a => this.escapeHtml(a.name)).join(', ')}
                </div>
              ` : ''}
              ${tools.length > 0 ? `
                <div>
                  <strong>Tools:</strong> ${tools.map(t => this.escapeHtml(t.name)).join(', ')}
                </div>
              ` : ''}
              <label style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" ${step.completed ? 'checked' : ''} onchange="app.toggleStepComplete(${index}, this.checked)">
                <span>Completed</span>
              </label>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  addWorkflowStep() {
    this.currentWorkflowSteps.push({
      name: '',
      description: '',
      agentIds: [],
      toolIds: [],
      completed: false
    });
    this.renderWorkflowSteps();
  }

  deleteWorkflowStep(index) {
    this.currentWorkflowSteps.splice(index, 1);
    this.renderWorkflowSteps();
  }

  updateStepName(index, name) {
    this.currentWorkflowSteps[index].name = name;
  }

  updateStepDescription(index, description) {
    this.currentWorkflowSteps[index].description = description;
  }

  toggleStepComplete(index, completed) {
    this.currentWorkflowSteps[index].completed = completed;
  }

  saveWorkflowSteps() {
    const workflow = this.data.workflows.find(w => w.id === this.currentWorkflow);
    if (workflow) {
      workflow.steps = this.currentWorkflowSteps;
      workflow.dateModified = new Date().toISOString();
      this.saveData();
      this.renderWorkflows();
      this.closeWorkflowBuilder();
      this.showToast('Workflow saved successfully', 'success');
    }
  }

  // ===========================================
  // CSV IMPORT/EXPORT
  // ===========================================

  importCSV(type) {
    this.currentImportType = type;
    const input = document.getElementById('csv-file-input');
    input.click();
  }

  handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      this.parseAndImportCSV(csv, this.currentImportType);
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = '';
  }

  parseAndImportCSV(csv, type) {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      this.showToast('CSV file is empty or invalid', 'error');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      data.push(obj);
    }

    if (type === 'agents') {
      this.importAgents(data);
    } else if (type === 'tools') {
      this.importTools(data);
    } else if (type === 'workflows') {
      this.importWorkflows(data);
    }
  }

  parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  }

  importAgents(data) {
    let count = 0;
    data.forEach(row => {
      if (!row.Name || !row.Role) return;

      const agent = {
        id: Date.now() + count,
        name: row.Name,
        role: row.Role,
        task: row.Task || row['Primary Task'] || '',
        help: row['How It Can Help'] || '',
        capabilities: row.Capabilities ? row.Capabilities.split(';').map(c => c.trim()) : [],
        team: null,
        status: row.Status || 'active',
        avatarColor: '#FF6B35',
        dateAdded: new Date().toISOString()
      };

      this.data.agents.push(agent);
      count++;
    });

    this.saveData();
    this.renderAgents();
    this.showToast(`Imported ${count} agent${count !== 1 ? 's' : ''}`, 'success');
  }

  importTools(data) {
    let count = 0;
    data.forEach(row => {
      if (!row['Tool Name'] || !row.Website) return;

      const tool = {
        id: Date.now() + count,
        name: row['Tool Name'],
        website: row.Website,
        category: row.Category || 'other',
        pricing: row.Pricing || 'free',
        description: row.Description || '',
        howToUse: row['How to Use'] || '',
        useCases: row['Use Cases'] ? row['Use Cases'].split(';').map(c => c.trim()) : [],
        features: row.Features ? row.Features.split(';').map(c => c.trim()) : [],
        tips: row.Tips || '',
        rating: parseInt(row.Rating) || 3,
        icon: row.Icon || '🤖',
        favorite: row.Favorite === 'true',
        dateAdded: new Date().toISOString()
      };

      this.data.tools.push(tool);
      count++;
    });

    this.saveData();
    this.renderTools();
    this.showToast(`Imported ${count} tool${count !== 1 ? 's' : ''}`, 'success');
  }

  importWorkflows(data) {
    // Group rows by workflow name
    const workflowGroups = {};

    data.forEach(row => {
      if (!row['Workflow Name']) return;

      if (!workflowGroups[row['Workflow Name']]) {
        workflowGroups[row['Workflow Name']] = {
          name: row['Workflow Name'],
          description: row.Description || '',
          icon: row.Icon || '📝',
          status: row.Status || 'draft',
          priority: row.Priority || 'medium',
          category: row.Category || '',
          steps: []
        };
      }

      if (row['Step Name']) {
        workflowGroups[row['Workflow Name']].steps.push({
          name: row['Step Name'],
          description: row['Step Description'] || '',
          agentIds: [],
          toolIds: [],
          completed: false
        });
      }
    });

    let count = 0;
    Object.values(workflowGroups).forEach(workflow => {
      workflow.id = Date.now() + count;
      workflow.dateCreated = new Date().toISOString();
      workflow.dateModified = new Date().toISOString();
      this.data.workflows.push(workflow);
      count++;
    });

    this.saveData();
    this.renderWorkflows();
    this.showToast(`Imported ${count} workflow${count !== 1 ? 's' : ''}`, 'success');
  }

  exportAllData() {
    // Create a download menu
    const options = [
      { label: 'Export Agents as CSV', action: () => this.exportAgentsCSV() },
      { label: 'Export Tools as CSV', action: () => this.exportToolsCSV() },
      { label: 'Export Workflows as CSV', action: () => this.exportWorkflowsCSV() },
      { label: 'Export All Data (JSON)', action: () => this.exportAllJSON() }
    ];

    const menu = options.map(opt => opt.label).join('\n');
    const choice = prompt(`Choose export option:\n\n${options.map((o, i) => `${i + 1}. ${o.label}`).join('\n')}\n\nEnter number (1-${options.length}):`);

    const index = parseInt(choice) - 1;
    if (index >= 0 && index < options.length) {
      options[index].action();
    }
  }

  exportAgentsCSV() {
    const headers = ['Name', 'Role', 'Task', 'Capabilities', 'How It Can Help', 'Team', 'Status', 'Date Added'];
    const rows = this.data.agents.map(agent => {
      const team = this.data.teams.find(t => t.id === agent.team);
      return [
        agent.name,
        agent.role,
        agent.task || '',
        (agent.capabilities || []).join('; '),
        agent.help || '',
        team ? team.name : '',
        agent.status,
        agent.dateAdded
      ];
    });

    this.downloadCSV('agents.csv', headers, rows);
    this.showToast('Agents exported successfully', 'success');
  }

  exportToolsCSV() {
    const headers = ['Tool Name', 'Website', 'Category', 'Description', 'How to Use', 'Use Cases', 'Pricing', 'Features', 'Tips', 'Rating', 'Icon', 'Favorite'];
    const rows = this.data.tools.map(tool => [
      tool.name,
      tool.website,
      tool.category,
      tool.description || '',
      tool.howToUse || '',
      (tool.useCases || []).join('; '),
      tool.pricing,
      (tool.features || []).join('; '),
      tool.tips || '',
      tool.rating || 3,
      tool.icon || '',
      tool.favorite ? 'true' : 'false'
    ]);

    this.downloadCSV('tools.csv', headers, rows);
    this.showToast('Tools exported successfully', 'success');
  }

  exportWorkflowsCSV() {
    const headers = ['Workflow Name', 'Description', 'Icon', 'Status', 'Priority', 'Category', 'Step Number', 'Step Name', 'Step Description'];
    const rows = [];

    this.data.workflows.forEach(workflow => {
      if (workflow.steps && workflow.steps.length > 0) {
        workflow.steps.forEach((step, index) => {
          rows.push([
            workflow.name,
            workflow.description || '',
            workflow.icon || '',
            workflow.status,
            workflow.priority,
            workflow.category || '',
            index + 1,
            step.name,
            step.description || ''
          ]);
        });
      } else {
        rows.push([
          workflow.name,
          workflow.description || '',
          workflow.icon || '',
          workflow.status,
          workflow.priority,
          workflow.category || '',
          '',
          '',
          ''
        ]);
      }
    });

    this.downloadCSV('workflows.csv', headers, rows);
    this.showToast('Workflows exported successfully', 'success');
  }

  exportAllJSON() {
    const dataStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-agent-library-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('All data exported successfully', 'success');
  }

  downloadCSV(filename, headers, rows) {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ===========================================
  // SAMPLE DATA
  // ===========================================

  loadSampleData() {
    // Sample Agents
    this.data.agents = [
      {
        id: 1,
        name: 'Research Agent',
        role: 'Data Analyst',
        task: 'Analyze data and provide insights',
        help: 'Can process large datasets and identify trends',
        capabilities: ['Python', 'SQL', 'Statistics'],
        team: this.data.teams[0].id,
        status: 'active',
        avatarColor: '#4ECDC4',
        dateAdded: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Code Assistant',
        role: 'Software Developer',
        task: 'Write and review code',
        help: 'Helps with coding tasks and debugging',
        capabilities: ['JavaScript', 'Python', 'React'],
        team: this.data.teams[1].id,
        status: 'active',
        avatarColor: '#FF6B35',
        dateAdded: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Content Creator',
        role: 'Marketing Specialist',
        task: 'Generate marketing content',
        help: 'Creates engaging content for various platforms',
        capabilities: ['Writing', 'SEO', 'Social Media'],
        team: this.data.teams[2].id,
        status: 'active',
        avatarColor: '#FF8B94',
        dateAdded: new Date().toISOString()
      }
    ];

    // Sample Tools
    this.data.tools = [
      {
        id: 1,
        name: 'ChatGPT',
        website: 'https://chat.openai.com',
        category: 'llm',
        pricing: 'freemium',
        description: 'Advanced AI chatbot for conversations and tasks',
        useCases: ['Writing', 'Coding', 'Research'],
        features: ['Multi-modal', 'Fast responses', 'Context awareness'],
        tips: 'Great for brainstorming and quick tasks',
        rating: 5,
        icon: '🤖',
        favorite: true,
        dateAdded: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Midjourney',
        website: 'https://midjourney.com',
        category: 'image',
        pricing: 'paid',
        description: 'AI image generation from text prompts',
        useCases: ['Art creation', 'Design mockups', 'Illustrations'],
        features: ['High quality', 'Multiple styles', 'Upscaling'],
        tips: 'Use detailed prompts for best results',
        rating: 5,
        icon: '🎨',
        favorite: true,
        dateAdded: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Claude',
        website: 'https://claude.ai',
        category: 'llm',
        pricing: 'freemium',
        description: 'AI assistant for research and analysis',
        useCases: ['Research', 'Writing', 'Analysis'],
        features: ['Large context', 'Accurate', 'Helpful'],
        rating: 5,
        icon: '💬',
        favorite: false,
        dateAdded: new Date().toISOString()
      }
    ];

    // Sample Workflow
    this.data.workflows = [
      {
        id: 1,
        name: 'Blog Post Creation',
        icon: '📝',
        description: 'Complete workflow for creating a blog post',
        status: 'active',
        priority: 'high',
        category: 'Marketing',
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        steps: [
          {
            name: 'Research Topic',
            description: 'Gather information and references',
            agentIds: [1],
            toolIds: [1, 3],
            completed: true
          },
          {
            name: 'Write Draft',
            description: 'Create initial blog post content',
            agentIds: [3],
            toolIds: [1],
            completed: true
          },
          {
            name: 'Review and Edit',
            description: 'Polish content and check for errors',
            agentIds: [3],
            toolIds: [1],
            completed: false
          },
          {
            name: 'Create Images',
            description: 'Generate cover image and illustrations',
            agentIds: [],
            toolIds: [2],
            completed: false
          },
          {
            name: 'Publish',
            description: 'Upload to blog platform',
            agentIds: [3],
            toolIds: [],
            completed: false
          }
        ]
      }
    ];

    this.saveData();
    this.renderAll();
    this.showToast('Sample data loaded!', 'info');
  }

  // ===========================================
  // UTILITY FUNCTIONS
  // ===========================================

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getInitials(name) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  lightenColor(color) {
    // Simple color lightening
    const num = parseInt(color.replace('#', ''), 16);
    const amt = 30;
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 300ms ease-in-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize the application
const app = new AIAgentLibrary();
