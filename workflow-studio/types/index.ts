import { Node, Edge } from '@xyflow/react';

export interface WorkflowNode extends Node {
  data: {
    label: string;
    description?: string;
    assignedAgents?: string[];
    assignedHumans?: string[];
    opportunityCount?: number;
  };
}

export interface WorkflowEdge extends Edge {
  data?: {
    opportunityCount?: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityNote {
  id: string;
  workflowId: string;
  targetType: 'node' | 'edge';
  targetId: string;
  from: string;
  to: string;
  hypothesis: string;
  expectedImpact: 'low' | 'medium' | 'high';
  confidence: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  tasks: string[];
  capabilities: string[];
  suggestedTools?: string[];
  risks?: string[];
  evaluationIdeas?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'edit' | 'ideation' | 'assignment';
