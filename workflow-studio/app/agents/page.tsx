'use client';

import { useState, useEffect } from 'react';
import { AIAgent } from '@/types';
import { getAgents, saveAgent, deleteAgent, exportAgent, importAgent } from '@/lib/storage';
import { AgentCard } from '@/components/agents/agent-card';
import { AgentEditor } from '@/components/agents/agent-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Bot, Search } from 'lucide-react';

export default function AgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setAgents(getAgents());
  }, []);

  const handleSaveAgent = (agent: AIAgent) => {
    saveAgent(agent);
    setAgents(getAgents());
  };

  const handleDeleteAgent = (id: string) => {
    deleteAgent(id);
    setAgents(getAgents());
  };

  const handleExportAgent = (agent: AIAgent) => {
    exportAgent(agent);
  };

  const handleImportAgent = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const agent = await importAgent(file);
        const newId = `agent-${Date.now()}`;
        saveAgent({ ...agent, id: newId });
        setAgents(getAgents());
        alert('Agent imported successfully!');
      } catch (error) {
        alert('Failed to import agent');
      }
    };
    input.click();
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tasks.some((task) => task.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI Agent Designer</h1>
              <p className="text-slate-600 mt-1">
                Define and manage AI agents for your workflows
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleImportAgent} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                onClick={() => {
                  setEditingAgent(null);
                  setShowEditor(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Agent
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="pl-9 max-w-md"
            />
          </div>
        </div>

        {agents.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-16 text-center">
            <Bot className="w-20 h-20 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">No AI Agents Yet</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create your first AI agent to start ideating on workflow automation opportunities
            </p>
            <div className="space-y-4 max-w-lg mx-auto text-left bg-slate-50 rounded-lg p-6">
              <h3 className="font-semibold text-slate-900">Getting Started:</h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li>1. Click "Create Agent" to define a new AI agent</li>
                <li>2. Specify the agent's role, tasks, and capabilities</li>
                <li>3. Use "Generate Draft" to get AI-assisted suggestions</li>
                <li>4. Assign agents to workflow steps in Assignment Mode</li>
              </ol>
            </div>
            <Button
              onClick={() => {
                setEditingAgent(null);
                setShowEditor(true);
              }}
              className="mt-6"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Agent
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onEdit={(agent) => {
                  setEditingAgent(agent);
                  setShowEditor(true);
                }}
                onDelete={handleDeleteAgent}
                onExport={handleExportAgent}
              />
            ))}
          </div>
        )}

        {filteredAgents.length === 0 && agents.length > 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No agents match your search</p>
          </div>
        )}
      </div>

      {showEditor && (
        <AgentEditor
          agent={editingAgent}
          onSave={handleSaveAgent}
          onClose={() => {
            setShowEditor(false);
            setEditingAgent(null);
          }}
        />
      )}
    </div>
  );
}
