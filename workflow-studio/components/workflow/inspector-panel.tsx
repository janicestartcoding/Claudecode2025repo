'use client';

import { useState, useEffect } from 'react';
import { WorkflowNode, AIAgent, ViewMode } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Bot, User, Plus } from 'lucide-react';

interface InspectorPanelProps {
  selectedNode: WorkflowNode | null;
  viewMode: ViewMode;
  agents: AIAgent[];
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode['data']>) => void;
  onClose: () => void;
}

export function InspectorPanel({
  selectedNode,
  viewMode,
  agents,
  onUpdateNode,
  onClose,
}: InspectorPanelProps) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [newHuman, setNewHuman] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label);
      setDescription(selectedNode.data.description || '');
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 flex items-center justify-center p-8">
        <div className="text-center text-slate-400">
          <p className="text-sm">Select a node to edit</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    onUpdateNode(selectedNode.id, { label, description });
  };

  const handleAddAgent = (agentId: string) => {
    const currentAgents = selectedNode.data.assignedAgents || [];
    if (!currentAgents.includes(agentId)) {
      onUpdateNode(selectedNode.id, {
        assignedAgents: [...currentAgents, agentId],
      });
    }
  };

  const handleRemoveAgent = (agentId: string) => {
    const currentAgents = selectedNode.data.assignedAgents || [];
    onUpdateNode(selectedNode.id, {
      assignedAgents: currentAgents.filter((id) => id !== agentId),
    });
  };

  const handleAddHuman = () => {
    if (!newHuman.trim()) return;
    const currentHumans = selectedNode.data.assignedHumans || [];
    if (!currentHumans.includes(newHuman.trim())) {
      onUpdateNode(selectedNode.id, {
        assignedHumans: [...currentHumans, newHuman.trim()],
      });
      setNewHuman('');
    }
  };

  const handleRemoveHuman = (human: string) => {
    const currentHumans = selectedNode.data.assignedHumans || [];
    onUpdateNode(selectedNode.id, {
      assignedHumans: currentHumans.filter((h) => h !== human),
    });
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Node Properties</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Node title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this step..."
            rows={4}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="flex-1">
            Save Changes
          </Button>
        </div>

        {viewMode === 'assignment' && (
          <>
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Bot className="w-4 h-4 inline mr-1" />
                Assigned AI Agents
              </label>

              <div className="space-y-2 mb-3">
                {(selectedNode.data.assignedAgents || []).map((agentId) => {
                  const agent = agents.find((a) => a.id === agentId);
                  return (
                    <div
                      key={agentId}
                      className="flex items-center justify-between p-2 bg-blue-50 rounded"
                    >
                      <span className="text-sm font-medium text-blue-900">
                        {agent?.name || agentId}
                      </span>
                      <button
                        onClick={() => handleRemoveAgent(agentId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1">
                {agents
                  .filter((a) => !(selectedNode.data.assignedAgents || []).includes(a.id))
                  .map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleAddAgent(agent.id)}
                      className="w-full text-left p-2 hover:bg-slate-50 rounded text-sm border border-slate-200"
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      {agent.name}
                    </button>
                  ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Assigned Human Roles
              </label>

              <div className="space-y-2 mb-3">
                {(selectedNode.data.assignedHumans || []).map((human) => (
                  <div
                    key={human}
                    className="flex items-center justify-between p-2 bg-slate-100 rounded"
                  >
                    <span className="text-sm font-medium text-slate-900">{human}</span>
                    <button
                      onClick={() => handleRemoveHuman(human)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newHuman}
                  onChange={(e) => setNewHuman(e.target.value)}
                  placeholder="Role name..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHuman()}
                />
                <Button onClick={handleAddHuman} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
