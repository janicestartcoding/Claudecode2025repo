import { Workflow, AIAgent, OpportunityNote } from '@/types';

export const seedWorkflow: Workflow = {
  id: 'workflow-1',
  name: 'Customer Onboarding Process',
  description: 'End-to-end customer onboarding workflow from lead to activated customer',
  nodes: [
    {
      id: '1',
      type: 'default',
      position: { x: 250, y: 0 },
      data: {
        label: 'Lead Received',
        description: 'New lead enters the system from marketing',
        assignedAgents: [],
        assignedHumans: [],
        opportunityCount: 0
      },
    },
    {
      id: '2',
      type: 'default',
      position: { x: 250, y: 100 },
      data: {
        label: 'Initial Qualification',
        description: 'Assess lead fit and readiness',
        assignedAgents: [],
        assignedHumans: [],
        opportunityCount: 0
      },
    },
    {
      id: '3',
      type: 'default',
      position: { x: 250, y: 200 },
      data: {
        label: 'Schedule Demo',
        description: 'Coordinate demo meeting with prospect',
        assignedAgents: [],
        assignedHumans: [],
        opportunityCount: 0
      },
    },
    {
      id: '4',
      type: 'default',
      position: { x: 250, y: 300 },
      data: {
        label: 'Conduct Demo',
        description: 'Product demonstration and Q&A',
        assignedAgents: [],
        assignedHumans: [],
        opportunityCount: 0
      },
    },
    {
      id: '5',
      type: 'default',
      position: { x: 250, y: 400 },
      data: {
        label: 'Proposal & Negotiation',
        description: 'Send proposal and negotiate terms',
        assignedAgents: [],
        assignedHumans: [],
        opportunityCount: 0
      },
    },
    {
      id: '6',
      type: 'default',
      position: { x: 250, y: 500 },
      data: {
        label: 'Contract Signing',
        description: 'Execute legal agreements',
        assignedAgents: [],
        assignedHumans: [],
        opportunityCount: 0
      },
    },
    {
      id: '7',
      type: 'default',
      position: { x: 250, y: 600 },
      data: {
        label: 'Onboarding & Training',
        description: 'Technical setup and user training',
        assignedAgents: [],
        assignedHumans: [],
        opportunityCount: 0
      },
    },
    {
      id: '8',
      type: 'default',
      position: { x: 250, y: 700 },
      data: {
        label: 'Customer Activated',
        description: 'Customer is fully onboarded and using product',
        assignedAgents: [],
        assignedHumans: [],
        opportunityCount: 0
      },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', data: { opportunityCount: 0 } },
    { id: 'e2-3', source: '2', target: '3', data: { opportunityCount: 0 } },
    { id: 'e3-4', source: '3', target: '4', data: { opportunityCount: 0 } },
    { id: 'e4-5', source: '4', target: '5', data: { opportunityCount: 0 } },
    { id: 'e5-6', source: '5', target: '6', data: { opportunityCount: 0 } },
    { id: 'e6-7', source: '6', target: '7', data: { opportunityCount: 0 } },
    { id: 'e7-8', source: '7', target: '8', data: { opportunityCount: 0 } },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const seedAgents: AIAgent[] = [
  {
    id: 'agent-1',
    name: 'Lead Qualifier AI',
    role: 'Sales Development Representative',
    tasks: [
      'Review incoming lead data',
      'Research company and contact information',
      'Score leads based on ICP criteria',
      'Send personalized outreach emails',
      'Schedule initial qualification calls',
    ],
    capabilities: [
      'Natural language processing',
      'Web research and data enrichment',
      'Email composition and personalization',
      'Calendar management',
      'CRM integration',
    ],
    suggestedTools: [
      'LinkedIn API for company research',
      'Clearbit/ZoomInfo for enrichment',
      'GPT-4 for email personalization',
      'Calendar API integration',
      'Salesforce/HubSpot API',
    ],
    risks: [
      'May miss nuanced qualification criteria',
      'Could send impersonal-feeling outreach at scale',
      'Requires human oversight for high-value leads',
    ],
    evaluationIdeas: [
      'Track lead-to-qualified conversion rate',
      'Measure response rates to AI-generated emails',
      'Compare qualification accuracy vs human SDRs',
      'Monitor time saved per lead processed',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'agent-2',
    name: 'Onboarding Coordinator AI',
    role: 'Customer Success Manager',
    tasks: [
      'Create personalized onboarding plans',
      'Schedule training sessions',
      'Send onboarding checklists and reminders',
      'Answer common setup questions',
      'Track onboarding progress',
    ],
    capabilities: [
      'Project management',
      'Natural language Q&A',
      'Document generation',
      'Email automation',
      'Progress tracking and reporting',
    ],
    suggestedTools: [
      'Project management API (Asana/Monday)',
      'Knowledge base for Q&A (RAG system)',
      'Email automation platform',
      'Customer data platform integration',
      'Analytics dashboard',
    ],
    risks: [
      'May not handle complex technical questions',
      'Could miss emotional cues from frustrated customers',
      'Requires fallback to human for escalations',
    ],
    evaluationIdeas: [
      'Measure time-to-activation improvement',
      'Track customer satisfaction scores',
      'Monitor reduction in support tickets',
      'Measure completion rate of onboarding tasks',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const seedOpportunities: OpportunityNote[] = [
  {
    id: 'opp-1',
    workflowId: 'workflow-1',
    targetType: 'node',
    targetId: '2',
    from: 'Manual lead review by SDR',
    to: 'AI-powered lead scoring and enrichment',
    hypothesis: 'An AI agent can automatically enrich lead data, score against ICP, and flag high-priority leads for human follow-up',
    expectedImpact: 'high',
    confidence: 'high',
    tags: ['automation', 'lead-qualification', 'time-saving'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'opp-2',
    workflowId: 'workflow-1',
    targetType: 'edge',
    targetId: 'e2-3',
    from: 'Qualified lead waiting for manual scheduling',
    to: 'AI automatically proposes meeting times and sends calendar invites',
    hypothesis: 'Reduce scheduling friction by having AI propose optimal meeting times based on both calendars',
    expectedImpact: 'medium',
    confidence: 'high',
    tags: ['automation', 'scheduling', 'conversion-rate'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'opp-3',
    workflowId: 'workflow-1',
    targetType: 'node',
    targetId: '7',
    from: 'Generic onboarding checklist sent to all customers',
    to: 'AI-generated personalized onboarding plan based on customer profile and use case',
    hypothesis: 'Personalized onboarding plans will increase activation rate and reduce time-to-value',
    expectedImpact: 'high',
    confidence: 'medium',
    tags: ['personalization', 'onboarding', 'activation'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'opp-4',
    workflowId: 'workflow-1',
    targetType: 'node',
    targetId: '5',
    from: 'Sales rep manually drafts proposal',
    to: 'AI generates first draft of proposal based on demo notes and customer needs',
    hypothesis: 'AI can create proposal first drafts faster while maintaining personalization',
    expectedImpact: 'medium',
    confidence: 'medium',
    tags: ['automation', 'sales', 'efficiency'],
    createdAt: new Date().toISOString(),
  },
];
