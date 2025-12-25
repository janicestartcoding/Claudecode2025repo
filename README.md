# AI Agent Library

A comprehensive web application for managing AI agents, tools, and workflows with a beautiful, detail-rich interface featuring Century Gothic typography and a vibrant orange color palette.

## Features

### 🤖 AI Agent Gallery
- **Grid View**: Visual card-based display of all your AI agents
- **Org Chart View**: Hierarchical team-based organization chart
- **Team Management**: Create and manage teams with custom colors
- **Agent Cards**: Rich cards showing avatars, roles, capabilities, status, and team assignments
- **Search & Filter**: Real-time search and filtering by status, team, and keywords
- **CSV Import/Export**: Bulk import and export agents via CSV files

### 🛠️ AI Toolbox
- **Tool Catalog**: Comprehensive database of AI tools and services
- **Detailed Tool Cards**: Show icon, category, rating, pricing, description, and use cases
- **Favorites System**: Mark important tools as favorites with a heart icon
- **Advanced Filtering**: Filter by category, pricing model, and favorites
- **Tool Ratings**: 5-star rating system to track your preferences
- **CSV Import/Export**: Bulk import and export tools

### 🎯 MyAI Workflows
- **Workflow Builder**: Visual workflow creation with step-by-step process
- **Progress Tracking**: Visual progress bars showing completion percentage
- **Agent Assignment**: Assign agents from your gallery to specific workflow steps
- **Tool Integration**: Tag required tools for each workflow step
- **Priority Levels**: High, Medium, and Low priority indicators
- **Status Management**: Draft, Active, Completed, and Archived statuses
- **CSV Import/Export**: Import and export complete workflows

## Design System

### Color Palette
- **Primary Orange**: #FF6B35 (vibrant, energetic)
- **Complementary Colors**:
  - Teal: #4ECDC4 (info, badges)
  - Navy Blue: #1A535C (headings, professional)
  - Yellow: #FFE66D (warnings, highlights)
  - Coral Pink: #FF8B94 (tags, accents)
  - Sage Green: #95B46A (success, completion)

### Typography
- **Font Family**: Century Gothic (with fallbacks)
- **Sizes**: 32px (h1), 24px (h2), 20px (h3), 16px (body), 14px (small), 12px (tiny)
- **Weights**: Regular (400), Medium (500), Bold (700)

### Visual Elements
- **Shadows**: Layered orange-tinted shadows for depth
- **Border Radius**: 12px (cards), 8px (buttons), 6px (inputs)
- **Animations**: 300ms smooth transitions throughout
- **Icons**: Emoji-based for universal compatibility

## Getting Started

### Installation
1. Clone this repository
2. Open `index.html` in your web browser
3. That's it! No build process required.

### First Time Use
The application will automatically load sample data on first run, including:
- 3 sample AI agents (Research Agent, Code Assistant, Content Creator)
- 3 default teams (Research, Development, Marketing)
- 3 sample tools (ChatGPT, Midjourney, Claude)
- 1 sample workflow (Blog Post Creation)

## Usage Guide

### Managing Agents
1. Click **"+ Add Agent"** to create a new agent
2. Fill in required fields (Name, Role)
3. Optional: Add capabilities, assign to team, choose avatar color
4. Edit agents by clicking the **✏️ Edit** button on any card
5. Delete agents with the **🗑️ Delete** button

### Creating Teams
1. Switch to **"Teams"** view in the Agent Gallery
2. Click **"+ Add Team"**
3. Choose a name and color for your team
4. Agents can then be assigned to this team

### Adding Tools
1. Navigate to **AI Toolbox**
2. Click **"+ Add Tool"**
3. Enter tool name, website, and category
4. Add description, use cases, features, and tips
5. Rate the tool (1-5 stars)
6. Mark as favorite with the ❤️ icon

### Building Workflows
1. Go to **MyAI Workflows**
2. Click **"+ Create Workflow"**
3. Set workflow name, icon, priority, and status
4. Click **"Save & Build Workflow"** to open the workflow builder
5. Click **"+ Add Step"** to add workflow steps
6. Name each step and add description
7. Assign agents and tools from the sidebars (future enhancement)
8. Mark steps as completed with checkboxes
9. Click **"Save Workflow"** when done

## Data Management

### Local Storage
All data is stored in your browser's localStorage under the key `aiAgentLibrary`. This means:
- ✅ No server required
- ✅ Data persists between sessions
- ✅ Works offline
- ⚠️ Data is browser-specific
- ⚠️ Clearing browser data will remove all information

### CSV Import
1. Click **"Import CSV"** button in any section
2. Select a properly formatted CSV file
3. Data will be automatically imported and merged

### CSV Export
1. Click **"📥 Export Data"** in the top navigation
2. Choose export format:
   - Export Agents as CSV
   - Export Tools as CSV
   - Export Workflows as CSV
   - Export All Data (JSON)

### CSV Format Examples

**Agents CSV:**
```csv
Name,Role,Task,Capabilities,How It Can Help,Team,Status,Date Added
Research Agent,Analyst,Data Analysis,Python;SQL;Statistics,Analyzes datasets,Data Team,active,2024-01-15
```

**Tools CSV:**
```csv
Tool Name,Website,Category,Description,How to Use,Use Cases,Pricing,Features,Tips,Rating,Icon,Favorite
ChatGPT,https://chat.openai.com,llm,AI chatbot,Sign up and chat,Writing;Coding,freemium,Multi-modal;Fast,Great tool,5,🤖,true
```

**Workflows CSV:**
```csv
Workflow Name,Description,Icon,Status,Priority,Category,Step Number,Step Name,Step Description
Blog Creation,Create blogs,📝,active,high,Marketing,1,Research,Gather info
Blog Creation,Create blogs,📝,active,high,Marketing,2,Write,Draft content
```

## Features Breakdown

### Phase 1 (MVP) ✅
- ✅ React-like vanilla JS application structure
- ✅ Complete design system with Century Gothic and orange palette
- ✅ localStorage data persistence
- ✅ Agent Gallery with grid view
- ✅ Basic CRUD operations for agents
- ✅ CSV import/export for agents

### Phase 2 ✅
- ✅ AI Toolbox with detailed tool cards
- ✅ Search and filter across all features
- ✅ Org Chart view for agents
- ✅ Team management system

### Phase 3 ✅
- ✅ MyAI Workflow Builder
- ✅ Workflow step management
- ✅ Visual progress tracking
- ✅ Agent and tool references in workflows

### Phase 4 (Polish) ✅
- ✅ Smooth animations and transitions
- ✅ Toast notifications
- ✅ Empty states with helpful prompts
- ✅ Responsive design
- ✅ Modal-based forms with validation

## Technical Details

### Architecture
- **Single-page application** (SPA) with vanilla JavaScript
- **Class-based structure** with AIAgentLibrary main class
- **Event-driven** interaction model
- **Component-based** rendering with template strings
- **No dependencies** - fully self-contained

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any modern browser with ES6+ support

### File Structure
```
ai-agent-library/
├── index.html          # Main HTML structure
├── styles.css          # Complete design system
├── app.js              # Application logic
└── README.md           # This file
```

## Keyboard Shortcuts (Future Enhancement)
- `Cmd/Ctrl + K`: Global search
- `Cmd/Ctrl + N`: New item (context-aware)
- `Cmd/Ctrl + E`: Export current view
- `Cmd/Ctrl + /`: Show shortcuts help

## Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --color-orange-main: #FF6B35;
  --color-teal: #4ECDC4;
  /* etc. */
}
```

### Adding New Features
The modular architecture makes it easy to extend:
1. Add new data structures in `constructor()`
2. Create rendering methods (e.g., `renderNewFeature()`)
3. Add event listeners in `setupEventListeners()`
4. Update `saveData()` and `loadData()` as needed

## Best Practices

### Data Entry
- Use consistent naming conventions for agents and tools
- Assign agents to teams for better organization
- Add detailed descriptions to make searching easier
- Use capabilities/features fields for better filtering

### Workflow Organization
- Break complex processes into clear steps
- Use descriptive step names
- Mark steps as completed to track progress
- Assign appropriate priority levels

### Backup
- Regularly export your data as JSON
- Store exported CSV files in a safe location
- Consider using browser sync features to maintain data across devices

## Troubleshooting

### Data Not Saving
- Ensure localStorage is enabled in your browser
- Check browser storage quota (usually 5-10 MB)
- Try clearing old data and re-importing

### CSV Import Issues
- Verify CSV format matches the examples above
- Ensure proper encoding (UTF-8)
- Check for missing required fields

### Display Issues
- Clear browser cache
- Ensure JavaScript is enabled
- Try a different modern browser

## Future Enhancements

Potential features for future versions:
- 🎨 Dark mode toggle
- 🔄 Real drag-and-drop for workflow builder
- 📊 Analytics dashboard
- 🎭 Custom agent avatars (image upload)
- 🔗 Share workflows via links
- 📱 Progressive Web App (PWA) support
- ☁️ Cloud sync (optional)
- 🔍 Advanced search with boolean operators
- 📋 Workflow templates library
- 🔔 Browser notifications
- ⌨️ Full keyboard navigation
- 🌐 Multi-language support

## Credits

Built with:
- **Design**: Custom design system with Century Gothic and vibrant orange palette
- **Icons**: Emoji for universal compatibility
- **Storage**: Browser localStorage API
- **No external dependencies**: Pure vanilla JavaScript

## License

This project is open source and available for personal and commercial use.

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

---

**Version**: 1.0.0
**Last Updated**: December 2025
**Built with**: ❤️ and ☕
