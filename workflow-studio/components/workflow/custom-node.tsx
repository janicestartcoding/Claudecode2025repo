'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { WorkflowNode } from '@/types';
import { Badge } from '@/components/ui/badge';
import { StickyNote, Bot, User } from 'lucide-react';

export const CustomNode = memo(({ data, selected }: NodeProps<WorkflowNode>) => {
  const hasOpportunities = (data.opportunityCount ?? 0) > 0;
  const hasAgents = (data.assignedAgents?.length ?? 0) > 0;
  const hasHumans = (data.assignedHumans?.length ?? 0) > 0;

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-white border-2 min-w-[200px] ${
        selected ? 'border-primary-500' : 'border-slate-300'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="font-semibold text-sm text-slate-900 flex-1">
            {data.label}
          </div>
          {hasOpportunities && (
            <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">
              <StickyNote className="w-3 h-3" />
              {data.opportunityCount}
            </div>
          )}
        </div>

        {data.description && (
          <div className="text-xs text-slate-500 line-clamp-2">
            {data.description}
          </div>
        )}

        {(hasAgents || hasHumans) && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.assignedAgents?.map((agentId, idx) => (
              <Badge key={idx} variant="info" className="text-xs px-1.5 py-0">
                <Bot className="w-3 h-3 mr-1" />
                AI
              </Badge>
            ))}
            {data.assignedHumans?.map((human, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">
                <User className="w-3 h-3 mr-1" />
                {human}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
