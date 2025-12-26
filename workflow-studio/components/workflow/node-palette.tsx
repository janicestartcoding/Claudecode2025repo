'use client';

import { Plus, Workflow as WorkflowIcon, FileJson, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Workflow } from '@/types';

interface NodePaletteProps {
  workflows: Workflow[];
  currentWorkflowId?: string;
  onSelectWorkflow: (workflow: Workflow) => void;
  onNewWorkflow: () => void;
  onDeleteWorkflow: (id: string) => void;
  onExportWorkflow: () => void;
  onImportWorkflow: () => void;
}

export function NodePalette({
  workflows,
  currentWorkflowId,
  onSelectWorkflow,
  onNewWorkflow,
  onDeleteWorkflow,
  onExportWorkflow,
  onImportWorkflow,
}: NodePaletteProps) {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Workflows</h2>
        <div className="flex gap-2">
          <Button onClick={onNewWorkflow} size="sm" className="flex-1">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
          <Button onClick={onExportWorkflow} variant="outline" size="sm">
            <FileJson className="w-4 h-4" />
          </Button>
          <Button onClick={onImportWorkflow} variant="outline" size="sm">
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {workflows.length === 0 ? (
          <div className="text-center py-8 px-4">
            <WorkflowIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">No workflows yet</p>
            <p className="text-xs text-slate-400 mt-1">Create your first workflow to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  workflow.id === currentWorkflowId
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
                onClick={() => onSelectWorkflow(workflow)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900 truncate">
                      {workflow.name}
                    </div>
                    {workflow.description && (
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {workflow.description}
                      </div>
                    )}
                    <div className="text-xs text-slate-400 mt-1">
                      {workflow.nodes.length} steps
                    </div>
                  </div>
                  {workflow.id === currentWorkflowId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this workflow?')) {
                          onDeleteWorkflow(workflow.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-600">
          <div className="font-medium mb-1">Quick Actions:</div>
          <ul className="space-y-1 text-slate-500">
            <li>• Click canvas to add nodes</li>
            <li>• Drag to connect nodes</li>
            <li>• Select & delete unwanted items</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
