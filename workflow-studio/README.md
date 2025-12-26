# Agent Workflow Studio

A production-ready web application for ideating useful AI agents against real business workflows.

## Features

### 1. Workflow Builder (Canvas)
- **React Flow** powered interactive canvas with drag-and-drop nodes
- Add, edit, and connect workflow steps
- Auto-layout functionality for organizing complex workflows
- Mini-map for navigation
- Save/load workflows with localStorage
- Import/export workflows as JSON

### 2. Ideation Mode (Opportunity Overlay)
- Toggle "Ideation Mode" to capture AI automation opportunities
- Click nodes (process steps) or edges (transitions) to add opportunity notes
- Structured note format:
  - **From** (current state) → **To** (desired state)
  - Hypothesis about the opportunity
  - Expected impact (low/medium/high)
  - Confidence level (low/medium/high)
  - Tags for categorization
- Visual indicators showing opportunity count on nodes/edges
- Filterable opportunity list panel

### 3. AI Agent Designer
- Create and manage AI agent definitions
- Required fields: name, role, tasks, capabilities
- AI-assisted fields (with "Generate Draft" button):
  - Suggested tools
  - Potential risks
  - Evaluation ideas
- Export/import agents as JSON
- Search and filter agent library

### 4. Assignment Mode (Agent-to-Workflow Matching)
- Assign AI agents to specific workflow steps
- Assign human roles to workflow steps
- Visual badges showing assignments on nodes
- Coverage summary showing:
  - % of steps assigned to AI vs human vs unassigned
  - List of nodes missing assignments
  - Per-agent assignment list

## Tech Stack

- **Next.js 16** (App Router) with TypeScript
- **React Flow** for workflow canvas
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **dagre** for auto-layout
- **localStorage** for persistence

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Usage Guide

### Creating Your First Workflow

1. Navigate to **Workflows** page
2. Click "New" to create a workflow
3. Click on the canvas to add nodes
4. Drag from one node's handle to another to create connections
5. Select a node to edit its properties in the inspector panel

### Capturing Opportunities

1. Select a workflow
2. Click the **Ideation** mode button
3. Click any node or edge on the canvas
4. Fill in the opportunity note form:
   - Describe the current state ("From")
   - Describe the desired AI-powered state ("To")
   - Write your hypothesis
   - Set impact and confidence levels
   - Add relevant tags
5. View all opportunities in the **Opportunities** page

### Designing AI Agents

1. Go to **Agent Designer** page
2. Click "Create Agent"
3. Fill in required fields:
   - Agent name and role
   - List of tasks the agent will perform
   - Required capabilities
4. Click "Generate Draft" for AI-suggested tools, risks, and evaluation ideas (stub function)
5. Save the agent

### Assigning Agents to Workflows

1. Select a workflow
2. Switch to **Assignment** mode
3. Click a node to open the inspector
4. Assign AI agents from your library
5. Add human roles as needed
6. Review coverage statistics

## Seed Data

The app includes sample data:
- **1 example workflow**: Customer Onboarding Process (8 steps)
- **2 example AI agents**: Lead Qualifier AI, Onboarding Coordinator AI
- **4 example opportunity notes**: Various automation opportunities

Seed data is automatically loaded on first use.

## Data Storage

All data is stored in browser localStorage:
- `agent-workflow-studio-workflows`: Workflow definitions
- `agent-workflow-studio-agents`: AI agent definitions
- `agent-workflow-studio-opportunities`: Opportunity notes

## Future Enhancements

Potential features for future versions:
- Backend persistence (SQLite/Prisma)
- Real LLM integration for "Generate Draft"
- Collaboration features with real-time sync
- Advanced analytics and reporting
- BPMN import/export
- Version control for workflows
- Cost/ROI estimation for AI agents

## License

ISC

---

Built with simplicity and usability in mind. Happy workflow ideation!
