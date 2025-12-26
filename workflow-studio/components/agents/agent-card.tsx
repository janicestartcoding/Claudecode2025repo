'use client';

import { AIAgent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Edit, Trash2, Download } from 'lucide-react';

interface AgentCardProps {
  agent: AIAgent;
  onEdit: (agent: AIAgent) => void;
  onDelete: (id: string) => void;
  onExport: (agent: AIAgent) => void;
}

export function AgentCard({ agent, onEdit, onDelete, onExport }: AgentCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{agent.name}</h3>
            <p className="text-xs text-slate-500">{agent.role}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button onClick={() => onExport(agent)} variant="ghost" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button onClick={() => onEdit(agent)} variant="ghost" size="icon">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              if (confirm('Delete this agent?')) onDelete(agent.id);
            }}
            variant="ghost"
            size="icon"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-xs font-medium text-slate-700 mb-1">Tasks</div>
          <ul className="text-xs text-slate-600 space-y-0.5">
            {agent.tasks.slice(0, 3).map((task, idx) => (
              <li key={idx}>• {task}</li>
            ))}
            {agent.tasks.length > 3 && (
              <li className="text-slate-400">+ {agent.tasks.length - 3} more...</li>
            )}
          </ul>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-700 mb-1">Capabilities</div>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 4).map((cap, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {cap}
              </Badge>
            ))}
            {agent.capabilities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{agent.capabilities.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
