'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  NodeTypes,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './custom-node';
import { WorkflowNode, WorkflowEdge, ViewMode } from '@/types';
import { Button } from '@/components/ui/button';
import { Layout, Trash2, StickyNote } from 'lucide-react';
import { getLayoutedElements } from '@/lib/layout';

interface WorkflowCanvasProps {
  initialNodes: WorkflowNode[];
  initialEdges: WorkflowEdge[];
  onNodesChange?: (nodes: WorkflowNode[]) => void;
  onEdgesChange?: (edges: WorkflowEdge[]) => void;
  onNodeClick?: (node: WorkflowNode) => void;
  onEdgeClick?: (edge: WorkflowEdge) => void;
  viewMode: ViewMode;
}

export function WorkflowCanvas({
  initialNodes,
  initialEdges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onEdgeClick,
  viewMode,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  const nodeTypes: NodeTypes = useMemo(() => ({ default: CustomNode }), []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
      if (onEdgesChange) {
        onEdgesChange(addEdge(connection, edges) as WorkflowEdge[]);
      }
    },
    [setEdges, onEdgesChange, edges]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChangeInternal(changes);
      if (onNodesChange) {
        // Use setTimeout to get the updated nodes after state change
        setTimeout(() => {
          setNodes((currentNodes) => {
            onNodesChange(currentNodes as WorkflowNode[]);
            return currentNodes;
          });
        }, 0);
      }
    },
    [onNodesChangeInternal, onNodesChange, setNodes]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChangeInternal(changes);
      if (onEdgesChange) {
        setTimeout(() => {
          setEdges((currentEdges) => {
            onEdgesChange(currentEdges as WorkflowEdge[]);
            return currentEdges;
          });
        }, 0);
      }
    },
    [onEdgesChangeInternal, onEdgesChange, setEdges]
  );

  const onNodeClickInternal = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (viewMode === 'ideation' && onNodeClick) {
        onNodeClick(node as WorkflowNode);
      }
    },
    [onNodeClick, viewMode]
  );

  const onEdgeClickInternal = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      if (viewMode === 'ideation' && onEdgeClick) {
        onEdgeClick(edge as WorkflowEdge);
      }
    },
    [onEdgeClick, viewMode]
  );

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      'TB'
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    if (onNodesChange) onNodesChange(layoutedNodes as WorkflowNode[]);
    if (onEdgesChange) onEdgesChange(layoutedEdges as WorkflowEdge[]);
  }, [nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange]);

  const onDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    setTimeout(() => {
      if (onNodesChange) {
        setNodes((currentNodes) => {
          onNodesChange(currentNodes as WorkflowNode[]);
          return currentNodes;
        });
      }
      if (onEdgesChange) {
        setEdges((currentEdges) => {
          onEdgesChange(currentEdges as WorkflowEdge[]);
          return currentEdges;
        });
      }
    }, 0);
  }, [setNodes, setEdges, onNodesChange, onEdgesChange]);

  // Customize edge style based on view mode
  const edgeOptions = useMemo(() => {
    if (viewMode === 'ideation') {
      return {
        style: { stroke: '#f97316', strokeWidth: 2, cursor: 'pointer' },
      };
    }
    return {};
  }, [viewMode]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClickInternal}
        onEdgeClick={onEdgeClickInternal}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
        className="bg-slate-50"
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const workflowNode = node as WorkflowNode;
            if ((workflowNode.data.assignedAgents?.length ?? 0) > 0) return '#3b82f6';
            if ((workflowNode.data.opportunityCount ?? 0) > 0) return '#f59e0b';
            return '#94a3b8';
          }}
        />
        <Panel position="top-right" className="flex gap-2">
          {viewMode === 'ideation' && (
            <div className="bg-amber-50 border border-amber-200 px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium text-amber-900">
              <StickyNote className="w-4 h-4" />
              Ideation Mode: Click nodes/edges to add notes
            </div>
          )}
          <Button onClick={onLayout} variant="outline" size="sm">
            <Layout className="w-4 h-4 mr-2" />
            Auto Layout
          </Button>
          <Button onClick={onDeleteSelected} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
