import { Workflow, AIAgent, OpportunityNote } from '@/types';

const STORAGE_KEYS = {
  WORKFLOWS: 'agent-workflow-studio-workflows',
  AGENTS: 'agent-workflow-studio-agents',
  OPPORTUNITIES: 'agent-workflow-studio-opportunities',
};

// Workflows
export function getWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
  return data ? JSON.parse(data) : [];
}

export function saveWorkflow(workflow: Workflow): void {
  const workflows = getWorkflows();
  const index = workflows.findIndex(w => w.id === workflow.id);
  if (index !== -1) {
    workflows[index] = { ...workflow, updatedAt: new Date().toISOString() };
  } else {
    workflows.push(workflow);
  }
  localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));
}

export function deleteWorkflow(id: string): void {
  const workflows = getWorkflows().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(workflows));

  // Also delete associated opportunities
  const opportunities = getOpportunities().filter(o => o.workflowId !== id);
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
}

// AI Agents
export function getAgents(): AIAgent[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
  return data ? JSON.parse(data) : [];
}

export function saveAgent(agent: AIAgent): void {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === agent.id);
  if (index !== -1) {
    agents[index] = { ...agent, updatedAt: new Date().toISOString() };
  } else {
    agents.push(agent);
  }
  localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
}

export function deleteAgent(id: string): void {
  const agents = getAgents().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
}

// Opportunity Notes
export function getOpportunities(): OpportunityNote[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
  return data ? JSON.parse(data) : [];
}

export function saveOpportunity(opportunity: OpportunityNote): void {
  const opportunities = getOpportunities();
  const index = opportunities.findIndex(o => o.id === opportunity.id);
  if (index !== -1) {
    opportunities[index] = opportunity;
  } else {
    opportunities.push(opportunity);
  }
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
}

export function deleteOpportunity(id: string): void {
  const opportunities = getOpportunities().filter(o => o.id !== id);
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
}

export function getOpportunitiesByWorkflow(workflowId: string): OpportunityNote[] {
  return getOpportunities().filter(o => o.workflowId === workflowId);
}

export function getOpportunitiesByTarget(workflowId: string, targetId: string): OpportunityNote[] {
  return getOpportunities().filter(
    o => o.workflowId === workflowId && o.targetId === targetId
  );
}

// Import/Export
export function exportWorkflow(workflow: Workflow): void {
  const opportunities = getOpportunitiesByWorkflow(workflow.id);
  const data = {
    workflow,
    opportunities,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workflow-${workflow.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importWorkflow(file: File): Promise<{ workflow: Workflow; opportunities: OpportunityNote[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function exportAgent(agent: AIAgent): void {
  const blob = new Blob([JSON.stringify(agent, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agent-${agent.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAgent(file: File): Promise<AIAgent> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const agent = JSON.parse(e.target?.result as string);
        resolve(agent);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
