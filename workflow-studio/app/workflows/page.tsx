'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkflowCanvas } from '@/components/workflow/workflow-canvas';
import { NodePalette } from '@/components/workflow/node-palette';
import { InspectorPanel } from '@/components/workflow/inspector-panel';
import { OpportunityDrawer } from '@/components/workflow/opportunity-drawer';
import { Workflow, WorkflowNode, WorkflowEdge, OpportunityNote, AIAgent, ViewMode } from '@/types';
import {
  getWorkflows,
  saveWorkflow,
  deleteWorkflow,
  exportWorkflow,
  importWorkflow,
  getAgents,
  saveAgent,
  getOpportunitiesByWorkflow,
  getOpportunitiesByTarget,
  saveOpportunity,
} from '@/lib/storage';
import { seedWorkflow, seedAgents, seedOpportunities } from '@/lib/seed-data';
import { Button } from '@/components/ui/button';
import { Eye, StickyNote, Users, Plus } from 'lucide-react';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [showOpportunityDrawer, setShowOpportunityDrawer] = useState(false);
  const [opportunityTarget, setOpportunityTarget] = useState<{
    type: 'node' | 'edge';
    id: string;
  } | null>(null);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityNote[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const loadedWorkflows = getWorkflows();
    const loadedAgents = getAgents();

    // Seed data if nothing exists
    if (loadedWorkflows.length === 0) {
      saveWorkflow(seedWorkflow);
      seedAgents.forEach((agent) => saveAgent(agent));
      seedOpportunities.forEach((opp) => saveOpportunity(opp));
      setWorkflows([seedWorkflow]);
      setCurrentWorkflow(seedWorkflow);
      setAgents(seedAgents);
      setOpportunities(seedOpportunities);
    } else {
      setWorkflows(loadedWorkflows);
      setCurrentWorkflow(loadedWorkflows[0]);
      setAgents(loadedAgents);
      if (loadedWorkflows[0]) {
        setOpportunities(getOpportunitiesByWorkflow(loadedWorkflows[0].id));
      }
    }
  }, []);

  // Update opportunity counts on nodes and edges
  useEffect(() => {
    if (!currentWorkflow) return;

    const updatedNodes = currentWorkflow.nodes.map((node) => {
      const nodeOpps = getOpportunitiesByTarget(currentWorkflow.id, node.id);
      return {
        ...node,
        data: {
          ...node.data,
          opportunityCount: nodeOpps.length,
        },
      };
    });

    const updatedEdges = currentWorkflow.edges.map((edge) => {
      const edgeOpps = getOpportunitiesByTarget(currentWorkflow.id, edge.id);
      return {
        ...edge,
        data: {
          ...edge.data,
          opportunityCount: edgeOpps.length,
        },
      };
    });

    if (
      JSON.stringify(updatedNodes) !== JSON.stringify(currentWorkflow.nodes) ||
      JSON.stringify(updatedEdges) !== JSON.stringify(currentWorkflow.edges)
    ) {
      setCurrentWorkflow({
        ...currentWorkflow,
        nodes: updatedNodes,
        edges: updatedEdges,
      });
    }
  }, [opportunities, currentWorkflow?.id]);

  const handleSelectWorkflow = (workflow: Workflow) => {
    setCurrentWorkflow(workflow);
    setOpportunities(getOpportunitiesByWorkflow(workflow.id));
    setSelectedNode(null);
  };

  const handleNewWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      nodes: [
        {
          id: '1',
          type: 'default',
          position: { x: 250, y: 100 },
          data: { label: 'Start', assignedAgents: [], assignedHumans: [], opportunityCount: 0 },
        },
      ],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveWorkflow(newWorkflow);
    setWorkflows([...workflows, newWorkflow]);
    setCurrentWorkflow(newWorkflow);
  };

  const handleDeleteWorkflow = (id: string) => {
    deleteWorkflow(id);
    const updated = workflows.filter((w) => w.id !== id);
    setWorkflows(updated);
    if (currentWorkflow?.id === id) {
      setCurrentWorkflow(updated[0] || null);
    }
  };

  const handleNodesChange = useCallback(
    (nodes: WorkflowNode[]) => {
      if (!currentWorkflow) return;
      const updated = { ...currentWorkflow, nodes };
      setCurrentWorkflow(updated);
      saveWorkflow(updated);
      setWorkflows(workflows.map((w) => (w.id === updated.id ? updated : w)));
    },
    [currentWorkflow, workflows]
  );

  const handleEdgesChange = useCallback(
    (edges: WorkflowEdge[]) => {
      if (!currentWorkflow) return;
      const updated = { ...currentWorkflow, edges };
      setCurrentWorkflow(updated);
      saveWorkflow(updated);
      setWorkflows(workflows.map((w) => (w.id === updated.id ? updated : w)));
    },
    [currentWorkflow, workflows]
  );

  const handleUpdateNode = (nodeId: string, updates: Partial<WorkflowNode['data']>) => {
    if (!currentWorkflow) return;
    const updatedNodes = currentWorkflow.nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...updates } } : node
    );
    const updated = { ...currentWorkflow, nodes: updatedNodes };
    setCurrentWorkflow(updated);
    saveWorkflow(updated);
    setWorkflows(workflows.map((w) => (w.id === updated.id ? updated : w)));

    // Update selected node
    const updatedNode = updatedNodes.find((n) => n.id === nodeId);
    if (updatedNode) setSelectedNode(updatedNode);
  };

  const handleNodeClick = (node: WorkflowNode) => {
    if (viewMode === 'ideation') {
      setOpportunityTarget({ type: 'node', id: node.id });
      setShowOpportunityDrawer(true);
    } else if (viewMode === 'assignment') {
      setSelectedNode(node);
    } else {
      setSelectedNode(node);
    }
  };

  const handleEdgeClick = (edge: WorkflowEdge) => {
    if (viewMode === 'ideation') {
      setOpportunityTarget({ type: 'edge', id: edge.id });
      setShowOpportunityDrawer(true);
    }
  };

  const handleSaveOpportunity = (note: OpportunityNote) => {
    saveOpportunity(note);
    setOpportunities(getOpportunitiesByWorkflow(currentWorkflow!.id));
  };

  const handleExportWorkflow = () => {
    if (currentWorkflow) {
      exportWorkflow(currentWorkflow);
    }
  };

  const handleImportWorkflow = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const data = await importWorkflow(file);
        const newId = `workflow-${Date.now()}`;
        const imported = { ...data.workflow, id: newId };
        saveWorkflow(imported);
        data.opportunities.forEach((opp) => {
          saveOpportunity({ ...opp, id: `opp-${Date.now()}-${Math.random()}`, workflowId: newId });
        });
        setWorkflows([...workflows, imported]);
        setCurrentWorkflow(imported);
        alert('Workflow imported successfully!');
      } catch (error) {
        alert('Failed to import workflow');
      }
    };
    input.click();
  };

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Workflows Yet</h2>
          <p className="text-slate-600 mb-4">Create your first workflow to get started</p>
          <Button onClick={handleNewWorkflow}>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <NodePalette
        workflows={workflows}
        currentWorkflowId={currentWorkflow.id}
        onSelectWorkflow={handleSelectWorkflow}
        onNewWorkflow={handleNewWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
        onExportWorkflow={handleExportWorkflow}
        onImportWorkflow={handleImportWorkflow}
      />

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">{currentWorkflow.name}</h2>
            {currentWorkflow.description && (
              <p className="text-sm text-slate-500">{currentWorkflow.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setViewMode('edit')}
              variant={viewMode === 'edit' ? 'default' : 'outline'}
              size="sm"
            >
              <Eye className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              onClick={() => setViewMode('ideation')}
              variant={viewMode === 'ideation' ? 'default' : 'outline'}
              size="sm"
            >
              <StickyNote className="w-4 h-4 mr-1" />
              Ideation
            </Button>
            <Button
              onClick={() => setViewMode('assignment')}
              variant={viewMode === 'assignment' ? 'default' : 'outline'}
              size="sm"
            >
              <Users className="w-4 h-4 mr-1" />
              Assignment
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <WorkflowCanvas
            initialNodes={currentWorkflow.nodes}
            initialEdges={currentWorkflow.edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            viewMode={viewMode}
          />
        </div>
      </div>

      {(viewMode === 'edit' || viewMode === 'assignment') && (
        <InspectorPanel
          selectedNode={selectedNode}
          viewMode={viewMode}
          agents={agents}
          onUpdateNode={handleUpdateNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {showOpportunityDrawer && opportunityTarget && (
        <OpportunityDrawer
          workflowId={currentWorkflow.id}
          targetType={opportunityTarget.type}
          targetId={opportunityTarget.id}
          existingNote={opportunities.find(
            (o) => o.targetId === opportunityTarget.id && o.targetType === opportunityTarget.type
          )}
          onSave={handleSaveOpportunity}
          onClose={() => {
            setShowOpportunityDrawer(false);
            setOpportunityTarget(null);
          }}
        />
      )}
    </div>
  );
}
