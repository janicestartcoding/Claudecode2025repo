'use client';

import { useState, useEffect } from 'react';
import { AIAgent } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Sparkles } from 'lucide-react';

interface AgentEditorProps {
  agent: AIAgent | null;
  onSave: (agent: AIAgent) => void;
  onClose: () => void;
}

export function AgentEditor({ agent, onSave, onClose }: AgentEditorProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [newCapability, setNewCapability] = useState('');
  const [suggestedTools, setSuggestedTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const [risks, setRisks] = useState<string[]>([]);
  const [newRisk, setNewRisk] = useState('');
  const [evaluationIdeas, setEvaluationIdeas] = useState<string[]>([]);
  const [newEvalIdea, setNewEvalIdea] = useState('');

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setRole(agent.role);
      setTasks(agent.tasks);
      setCapabilities(agent.capabilities);
      setSuggestedTools(agent.suggestedTools || []);
      setRisks(agent.risks || []);
      setEvaluationIdeas(agent.evaluationIdeas || []);
    } else {
      // Reset form
      setName('');
      setRole('');
      setTasks([]);
      setCapabilities([]);
      setSuggestedTools([]);
      setRisks([]);
      setEvaluationIdeas([]);
    }
  }, [agent]);

  const handleSave = () => {
    const savedAgent: AIAgent = {
      id: agent?.id || `agent-${Date.now()}`,
      name,
      role,
      tasks,
      capabilities,
      suggestedTools,
      risks,
      evaluationIdeas,
      createdAt: agent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(savedAgent);
    onClose();
  };

  const handleGenerateDraft = () => {
    // Stub function for AI generation
    alert(
      'AI Draft Generation (Coming Soon):\n\n' +
        'This would call an LLM to:\n' +
        '- Suggest tools based on role and tasks\n' +
        '- Identify potential risks\n' +
        '- Recommend evaluation metrics\n\n' +
        'For now, you can manually fill these fields.'
    );

    // Add placeholder suggestions
    if (!suggestedTools.length) {
      setSuggestedTools(['API Integration', 'GPT-4 for NLP', 'Database Access']);
    }
    if (!risks.length) {
      setRisks(['May require human oversight', 'Limited context understanding']);
    }
    if (!evaluationIdeas.length) {
      setEvaluationIdeas(['Track task completion rate', 'Measure accuracy vs baseline']);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {agent ? 'Edit Agent' : 'Create New Agent'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Agent Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Lead Qualifier AI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role *
                </label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Sales Development Representative"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tasks *</label>
              <div className="space-y-2 mb-2">
                {tasks.map((task, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input value={task} readOnly className="flex-1" />
                    <Button
                      onClick={() => setTasks(tasks.filter((_, i) => i !== idx))}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a task..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTask.trim()) {
                      setTasks([...tasks, newTask.trim()]);
                      setNewTask('');
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newTask.trim()) {
                      setTasks([...tasks, newTask.trim()]);
                      setNewTask('');
                    }
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Capabilities *
              </label>
              <div className="flex flex-wrap gap-1 mb-2">
                {capabilities.map((cap, idx) => (
                  <Badge key={idx} variant="secondary">
                    {cap}
                    <button
                      onClick={() => setCapabilities(capabilities.filter((_, i) => i !== idx))}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  placeholder="Add a capability..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newCapability.trim()) {
                      setCapabilities([...capabilities, newCapability.trim()]);
                      setNewCapability('');
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newCapability.trim()) {
                      setCapabilities([...capabilities, newCapability.trim()]);
                      setNewCapability('');
                    }
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">AI-Assisted Fields</h3>
                <Button onClick={handleGenerateDraft} variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Generate Draft
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Suggested Tools
                  </label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {suggestedTools.map((tool, idx) => (
                      <Badge key={idx} variant="info">
                        {tool}
                        <button
                          onClick={() =>
                            setSuggestedTools(suggestedTools.filter((_, i) => i !== idx))
                          }
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      placeholder="Add a tool..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newTool.trim()) {
                          setSuggestedTools([...suggestedTools, newTool.trim()]);
                          setNewTool('');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (newTool.trim()) {
                          setSuggestedTools([...suggestedTools, newTool.trim()]);
                          setNewTool('');
                        }
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Risks</label>
                  <div className="space-y-1 mb-2">
                    {risks.map((risk, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <span className="flex-1 text-slate-600">• {risk}</span>
                        <button
                          onClick={() => setRisks(risks.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newRisk}
                      onChange={(e) => setNewRisk(e.target.value)}
                      placeholder="Add a risk..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newRisk.trim()) {
                          setRisks([...risks, newRisk.trim()]);
                          setNewRisk('');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (newRisk.trim()) {
                          setRisks([...risks, newRisk.trim()]);
                          setNewRisk('');
                        }
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Evaluation Ideas
                  </label>
                  <div className="space-y-1 mb-2">
                    {evaluationIdeas.map((idea, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        <span className="flex-1 text-slate-600">• {idea}</span>
                        <button
                          onClick={() =>
                            setEvaluationIdeas(evaluationIdeas.filter((_, i) => i !== idx))
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newEvalIdea}
                      onChange={(e) => setNewEvalIdea(e.target.value)}
                      placeholder="Add an evaluation idea..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newEvalIdea.trim()) {
                          setEvaluationIdeas([...evaluationIdeas, newEvalIdea.trim()]);
                          setNewEvalIdea('');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (newEvalIdea.trim()) {
                          setEvaluationIdeas([...evaluationIdeas, newEvalIdea.trim()]);
                          setNewEvalIdea('');
                        }
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 flex gap-3 justify-end">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name || !role || tasks.length === 0 || capabilities.length === 0}
          >
            {agent ? 'Save Changes' : 'Create Agent'}
          </Button>
        </div>
      </div>
    </div>
  );
}
