# Cerebra Demo - Component Inventory

> **Complete inventory of all components, hooks, and data files**

This document provides a detailed inventory of every component in the Cerebra Demo with their props, responsibilities, and dependencies.

---

## Table of Contents

1. [Page Components](#1-page-components)
2. [Layout Components](#2-layout-components)
3. [UI Components](#3-ui-components)
4. [Chart Components](#4-chart-components)
5. [Visualization Components](#5-visualization-components)
6. [Hooks](#6-hooks)
7. [Data Files](#7-data-files)
8. [API Routes](#8-api-routes)

---

## 1. Page Components

### `page.js`

**Location:** `src/app/cerebra-demo/page.js`  
**Lines:** ~350

**Purpose:** Main orchestrator for the Cerebra Demo, managing scenes and workflow state.

**State:**
```javascript
const [currentScene, setCurrentScene] = useState(SCENES.LOGIN);
const [showNotifications, setShowNotifications] = useState(false);
const [currentQuestionId, setCurrentQuestionId] = useState('q1');
const [answeredQuestions, setAnsweredQuestions] = useState([]);
const [isConversationLocked, setIsConversationLocked] = useState(false);
const [selectedScenario, setSelectedScenario] = useState(null);
const [outputStage, setOutputStage] = useState(null);
const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);
const [chatResponse, setChatResponse] = useState(null);
```

**Key Functions:**
- `handleLogin()` - Transition to overview
- `handleEquipmentClick(equipmentId)` - Handle digital twin interaction
- `handleNotificationClick(notification)` - Handle alert clicks
- `handleAnswer(questionId, optionId)` - Process Q&A workflow
- `handleStageComplete(stage)` - Handle output stage completion
- `handleSelectScenario(scenario)` - Handle fault tree selection
- `handleChatResponse(response)` - Handle chatbot responses

---

## 2. Layout Components

### `layout.js`

**Location:** `src/app/cerebra-demo/layout.js`  
**Lines:** ~10

**Purpose:** Standalone layout without the main navbar.

```javascript
export default function CerebraDemoLayout({ children }) {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      {children}
    </div>
  );
}
```

---

## 3. UI Components

### `LoginScreen.js`

**Location:** `src/app/cerebra-demo/components/LoginScreen.js`

**Props:**
```typescript
{
  onLogin: () => void  // Callback when user clicks login
}
```

**Purpose:** Microsoft SSO-style login screen with Accenture branding.

---

### `CerebraHeader.js`

**Location:** `src/app/cerebra-demo/components/CerebraHeader.js`

**Props:**
```typescript
{
  title: string                    // Page title
  showBackButton?: boolean         // Show back navigation
  onBack?: () => void             // Back button callback
  onNotificationClick?: () => void // Notification bell callback
  notificationCount?: number       // Badge count
}
```

**Purpose:** Navigation header with logo, title, notifications, and user avatar.

---

### `MiningProcessFlowDiagram.js`

**Location:** `src/app/cerebra-demo/components/MiningProcessFlowDiagram.js`  
**Lines:** ~1,050

**Props:**
```typescript
{
  onEquipmentClick?: (id: string) => void  // Equipment click handler
  highlightedIds?: string[]                // Equipment IDs to highlight
  highlightColor?: string                  // Highlight color (default: #dc2626)
  useDesignedImage?: boolean               // Use image vs SVG (default: true)
}
```

**Purpose:** Digital twin visualization with KPIs, toggle views, and equipment interaction.

**Sub-components:**
- `EquipmentBox` - Wrapper for equipment icons
- `EquipmentIcons` - SVG icons for each equipment type
- `SectionHeader` - Section labels
- `FlowArrow` - Connection arrows
- `KPICard` - KPI display card
- `ToggleButton` - View toggle button
- `ImageDigitalTwin` - Image-based view with clickable hotspots

---

### `ConversationPanel.js`

**Location:** `src/app/cerebra-demo/components/ConversationPanel.js`  
**Lines:** ~1,470

**Props:**
```typescript
{
  currentQuestion: QuestionObject       // Current question to display
  onAnswer: (qId, optId) => void       // Answer handler
  answeredQuestions: AnsweredQuestion[] // History
  isLocked: boolean                     // Lock interaction
  dynamicOptions?: Option[]             // Dynamic options for Q3
  enableChat?: boolean                  // Enable chatbot (default: true)
  onTriggerAgent?: (agentId, tool) => void  // Agent trigger callback
  onChatResponse?: (response) => void   // Chat response callback
}
```

**Purpose:** Left panel managing Q&A workflow and chatbot interface.

**Sub-components:**
- `QuestionGenerator` - LLM-style question generation animation
- `QuestionMessage` - Individual question display
- `ChatMessage` - Chat message display
- `ThinkingIndicator` - Processing animation
- `CachePrompt` - Cache usage prompt

**Features:**
- Response caching (localStorage)
- Thinking stage animations
- Tool call visualization
- Agent selection display

---

### `OutputConsole.js`

**Location:** `src/app/cerebra-demo/components/OutputConsole.js`  
**Lines:** ~1,350

**Props:**
```typescript
{
  currentStage: string | null           // Current output stage
  onStageComplete: (stage) => void      // Stage completion callback
  onSelectScenario: (scenario) => void  // Scenario selection callback
  selectedScenario: string | null       // Selected scenario ID
  showKnowledgeGraph: boolean           // Show knowledge graph modal
  setShowKnowledgeGraph: (v) => void    // Knowledge graph toggle
  dynamicAgentResponses?: object        // AI agent responses
  activeAgent?: string | null           // Currently active agent
  queryAgent?: (id) => Promise          // Agent query function
  runHuddleWorkflow?: () => Promise     // Run all agents
  chatResponse?: object | null          // Chatbot response
}
```

**Purpose:** Right panel displaying agent activities, visualizations, and results.

**Sub-components:**
- `AgentBadge` - Agent identification badge
- `MiniAgentBadge` - Compact agent badge for header
- `ToolIcon` - SVG icons for tool types
- `ToolCallDisplay` - Tool call visualization
- `ChatResponseCard` - Chatbot response display
- `TopicVisualization` - Topic-specific mini visualization

**Output Stages:**
- `agent_network` - Agent network display
- `initial_analysis` - Fault tree + root cause table
- `trusted_huddle` - Sequential agent execution
- `recommendations` - Action recommendations
- `work_order` - SAP work order preview
- `chat_response` - Chatbot response

---

### `HuddleBanner.js`

**Location:** `src/app/cerebra-demo/components/HuddleBanner.js`

**Props:**
```typescript
{
  agents: string[]                    // Agent IDs
  activeAgent?: string                // Currently active agent
  isComplete?: boolean                // Huddle completed
  activatedAgents?: string[]          // Already activated agents
  showOrchestrator?: boolean          // Show Super Agent
  orchestratorPhase?: string          // 'idle'|'activating'|'monitoring'|'complete'
  currentActivatingAgent?: string     // Agent being activated
}
```

**Purpose:** Visual banner showing agent orchestration status.

---

### `ActionableRecommendations.js`

**Location:** `src/app/cerebra-demo/components/ActionableRecommendations.js`

**Props:**
```typescript
{
  onCreateWorkOrder?: () => void        // Create WO callback
  onShowKnowledgeGraph?: () => void     // Show KG callback
  onSendEmail?: () => void              // Send email callback
}
```

**Purpose:** Display prioritized maintenance recommendations with action buttons.

---

### `RootCauseTable.js`

**Location:** `src/app/cerebra-demo/components/RootCauseTable.js`

**Purpose:** FMEA probability ranking table with evidence and severity.

---

### `NotificationPanel.js`

**Location:** `src/app/cerebra-demo/components/NotificationPanel.js`

**Props:**
```typescript
{
  isOpen: boolean                           // Panel visibility
  onClose: () => void                       // Close handler
  notifications: Notification[]             // Notification list
  onNotificationClick?: (n) => void         // Click handler
}
```

**Purpose:** Slide-out panel for system notifications and alerts.

---

### `AgentNetworkDisplay.js`

**Location:** `src/app/cerebra-demo/components/AgentNetworkDisplay.js`

**Props:**
```typescript
{
  isActive?: boolean  // Animation state
}
```

**Purpose:** Periodic table-style display of available specialist agents.

---

## 4. Chart Components

All chart components are in `src/app/cerebra-demo/components/charts/` and use **Nivo.rocks** library with dynamic imports for SSR compatibility.

### `EfficiencyTrendChart.js`

**Type:** Line Chart  
**Purpose:** 30-day efficiency trend visualization

---

### `EfficiencyStreamChart.js`

**Type:** Stream/Area Chart  
**Purpose:** Area-based efficiency visualization with multiple metrics

---

### `BulletChart.js`

**Type:** Bullet Chart  
**Purpose:** KPI comparison (actual vs target vs design)

---

### `WearHeatmap.js`

**Type:** Heatmap  
**Purpose:** Liner zone wear levels visualization (Zones A-D)

---

### `WeibullChart.js`

**Type:** Line Chart  
**Purpose:** Weibull failure probability distribution curve

---

### `FailureModeAreaBump.js`

**Type:** Area Bump Chart  
**Purpose:** FMEA ranking evolution over time

---

### `PersonnelSankeyChart.js`

**Type:** Sankey Diagram  
**Purpose:** Crew allocation flow (Skills → Teams → Jobs)

---

### `InventoryBarChart.js`

**Type:** Bar Chart  
**Purpose:** Parts availability and stock levels

---

### `HuddleSummaryChart.js`

**Type:** Radar/Pie Chart  
**Purpose:** Agent contribution summary after huddle

---

### `AgentContributionIcicle.js`

**Type:** Icicle/Partition Chart  
**Purpose:** Hierarchical view of agent outputs and findings

---

### `MaintenanceCalendar.js`

**Type:** Calendar Heatmap  
**Purpose:** Maintenance schedule visualization

---

## 5. Visualization Components

Located in `src/app/cerebra-demo/components/visualizations/`

### `FaultTreeDiagram.js`

**Props:**
```typescript
{
  onSelectScenario?: (scenario) => void  // Scenario selection callback
  isAnimating?: boolean                  // Enable animation (default: true)
}
```

**Purpose:** FMEA fault tree with probability nodes and interactive selection.

---

### `CrusherLinerVisualization.js`

**Purpose:** 3D cross-section visualization of liner wear patterns.

---

### `KnowledgeGraphModal.js`

**Props:**
```typescript
{
  isOpen: boolean           // Modal visibility
  onClose: () => void       // Close handler
}
```

**Purpose:** Modal showing agent collaboration knowledge graph.

---

### `SAPWorkOrderPreview.js`

**Purpose:** SAP PM work order document preview with status transitions.

---

## 6. Hooks

### `useDynamicAgents.js`

**Location:** `src/app/cerebra-demo/hooks/useDynamicAgents.js`  
**Lines:** ~145

**Returns:**
```typescript
{
  agentResponses: Record<string, AgentResponse[]>
  activeAgent: string | null
  isProcessing: boolean
  error: string | null
  queryAgent: (agentId: string) => Promise<AgentResponse>
  runHuddleWorkflow: (agents?: string[]) => Promise<AgentResponse[]>
  reset: () => void
  AGENT_CONFIG: AgentConfiguration
}
```

**Purpose:** Manages agent responses with curated, scenario-consistent data.

**Exports:**
- `AGENT_CONFIG` - Agent color and name configuration
- `CURATED_RESPONSES` - Pre-defined agent responses

---

### `useAgentChat.js`

**Location:** `src/app/cerebra-demo/hooks/useAgentChat.js`  
**Lines:** ~165

**Hook 1: `useAgentChat`**
```typescript
{
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (msg: string) => Promise<Message>
  clearMessages: () => void
}
```

**Hook 2: `useAgentQuery`**
```typescript
{
  isLoading: boolean
  error: string | null
  queryAgent: (agentId, query, options) => Promise<Response>
  clearCache: () => void
}
```

**Purpose:** Chat API interaction and agent-specific queries.

**Exports:**
- `AGENT_WORKFLOW_QUERIES` - Pre-defined queries for each agent

---

## 7. Data Files

### `workflowQuestions.js`

**Location:** `src/app/cerebra-demo/data/workflowQuestions.js`  
**Lines:** ~190

**Exports:**
- `workflowQuestions` - Q1-Q6 question definitions
- `faultTreeOptions` - Fault tree scenario options (4 items)
- `huddleAgents` - 5 agent configurations with steps
- `recommendations` - Immediate/Near-term/Long-term actions

---

### `scenarioContext.js`

**Location:** `src/app/cerebra-demo/data/scenarioContext.js`  
**Lines:** ~580

**Exports:**
- `scenarioContext` - Complete scenario data store
- `getContextByTopic(topic)` - Topic routing function

**Data Sections:**
- `currentScenario` - Basic scenario info
- `workOrder` - SAP work order details
- `equipment` - Equipment specifications
- `sensorData` - Live sensor readings
- `activeAlarms` - 5 active alarms
- `linerDetails` - Liner wear data
- `rootCauseAnalysis` - FMEA results
- `reliabilityMetrics` - Weibull, RPN, etc.
- `analysis` - Analysis results
- `agents` - Agent contribution data
- `parts` - Parts inventory
- `labor` - Crew assignment
- `maintenanceHistory` - Historical records
- `safety` - Safety requirements
- `operations` - Production context
- `recommendations` - Action items
- `keyDates` - Important dates
- `availableTools` - Tool definitions

---

### `faultTreeData.js`

**Location:** `src/app/cerebra-demo/data/faultTreeData.js`

**Exports:**
- `faultTreeData` - Hierarchical fault tree structure
- `getProbabilityColor(prob)` - Color mapping function
- `severityColors` - Severity color definitions

---

### `miningData.js`

**Location:** `src/app/cerebra-demo/data/miningData.js`

**Exports:**
- `equipmentData` - Equipment list with status
- `notifications` - Alert notifications
- `processFlowData` - Process flow configuration

---

### `knowledgeGraphData.js`

**Location:** `src/app/cerebra-demo/data/knowledgeGraphData.js`

**Exports:**
- `knowledgeGraphNodes` - Graph nodes
- `knowledgeGraphEdges` - Graph edges/relationships

---

### `workOrderData.js`

**Location:** `src/app/cerebra-demo/data/workOrderData.js`

**Exports:**
- `workOrderTemplate` - SAP work order template
- `workOrderOperations` - Work order operations list

---

### `agentOutputs.js`

**Location:** `src/app/cerebra-demo/data/agentOutputs.js`

**Exports:**
- Agent output templates and configurations

---

### `agentToolCalls.js`

**Location:** `src/app/cerebra-demo/data/agentToolCalls.js`

**Exports:**
- Tool call definitions and parameters

---

## 8. API Routes

### `/api/cerebra-agent`

**Location:** `src/app/api/cerebra-agent/route.js`  
**Lines:** ~235

**Methods:**

**POST** - Query an agent
```typescript
Request: {
  agentId: string
  query: string
  conversationHistory?: Message[]
  useCache?: boolean
}

Response: {
  agentId: string
  agentName: string
  content: string
  timestamp: string
  usage: TokenUsage
  cached?: boolean
}
```

**GET** - List available agents
```typescript
Response: {
  agents: { id: string, name: string }[]
  context: MiningContext
}
```

**Features:**
- Response caching (1hr TTL)
- Domain context injection
- GPT-4o-mini model

---

### `/api/cerebra-agent/chat`

**Location:** `src/app/api/cerebra-agent/chat/route.js`

**Methods:**

**POST** - Send chat message
```typescript
Request: {
  message: string
  sessionId: string
}

Response: {
  message: string
  timestamp: string
}
```

---

## Component Dependency Graph

```
page.js
├── LoginScreen
├── CerebraHeader
├── MiningProcessFlowDiagram
│   ├── EquipmentIcons
│   └── KPICard
├── ConversationPanel
│   ├── QuestionGenerator
│   ├── QuestionMessage
│   ├── ChatMessage
│   └── ThinkingIndicator
├── OutputConsole
│   ├── AgentBadge
│   ├── MiniAgentBadge
│   ├── ToolCallDisplay
│   ├── FaultTreeDiagram
│   ├── RootCauseTable
│   ├── HuddleBanner
│   ├── ActionableRecommendations
│   ├── SAPWorkOrderPreview
│   ├── KnowledgeGraphModal
│   └── Charts (11 components)
├── NotificationPanel
└── Hooks
    ├── useDynamicAgents
    └── useAgentChat
```

---

*Document created: January 2025*
