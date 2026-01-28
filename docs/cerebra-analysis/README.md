# Cerebra Demo - Complete Implementation Analysis

> **Mining Operations AI Command Center**  
> Multi-Agent Orchestration for Predictive Maintenance

This document provides a comprehensive analysis of the Cerebra Demo implementation, covering architecture, components, data flows, and extension guidelines for the pit-to-customer domain.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Component Deep Dive](#3-component-deep-dive)
4. [Multi-Agent System](#4-multi-agent-system)
5. [Data Models & Scenario Context](#5-data-models--scenario-context)
6. [User Journey Walkthrough](#6-user-journey-walkthrough)
7. [API Reference](#7-api-reference)
8. [Visualization Components](#8-visualization-components)
9. [Extension Guidelines](#9-extension-guidelines)

---

## 1. Executive Summary

The Cerebra Demo is a **Multi-Agent AI Command Center** for mining operations that demonstrates intelligent maintenance orchestration using a "Super Agent" architecture. The demo showcases AI-driven root cause analysis, fault prediction, and work order generation for copper mining equipment.

### Key Capabilities

- **Digital Twin Visualization** - Real-time mining process flow from pit to port
- **Multi-Agent Collaboration** - 5 specialist AI agents working in concert
- **FMEA-Based Root Cause Analysis** - Probabilistic fault tree analysis
- **Trusted Huddle** - Visual orchestration of agent collaboration
- **SAP Integration** - Work order creation and management
- **Conversational AI** - Natural language follow-up queries

### Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18 |
| **Visualizations** | Nivo Charts (11 chart types) |
| **Backend** | Next.js API Routes |
| **AI/LLM** | OpenAI GPT-4o-mini / Azure OpenAI |
| **Database** | MongoDB Atlas (time series, vector search) |
| **Agent Framework** | LangGraph.js |
| **Styling** | CSS Modules, Tailwind-inspired utilities |

---

## 2. Architecture Overview

### 2.1 Directory Structure

```
src/app/cerebra-demo/
├── page.js                          # Main scene orchestrator
├── layout.js                        # Standalone layout (no main navbar)
├── styles/
│   └── cerebra.css                  # Custom styling
│
├── hooks/
│   ├── useDynamicAgents.js          # Agent response management
│   └── useAgentChat.js              # Chat API interaction
│
├── components/
│   ├── LoginScreen.js               # Microsoft SSO-style login
│   ├── CerebraHeader.js             # Navigation header
│   ├── MiningProcessFlowDiagram.js  # Digital Twin (SVG + Image)
│   ├── ConversationPanel.js         # Left panel - Q&A workflow
│   ├── OutputConsole.js             # Right panel - Agent outputs
│   ├── HuddleBanner.js              # Agent orchestration UI
│   ├── ActionableRecommendations.js # Maintenance actions
│   ├── RootCauseTable.js            # FMEA ranking table
│   ├── NotificationPanel.js         # Alert notifications
│   │
│   ├── charts/                      # Nivo visualization components
│   │   ├── AgentContributionIcicle.js
│   │   ├── BulletChart.js
│   │   ├── EfficiencyStreamChart.js
│   │   ├── EfficiencyTrendChart.js
│   │   ├── FailureModeAreaBump.js
│   │   ├── HuddleSummaryChart.js
│   │   ├── InventoryBarChart.js
│   │   ├── MaintenanceCalendar.js
│   │   ├── PersonnelSankeyChart.js
│   │   ├── WearHeatmap.js
│   │   └── WeibullChart.js
│   │
│   └── visualizations/              # Custom visualizations
│       ├── FaultTreeDiagram.js
│       ├── CrusherLinerVisualization.js
│       ├── KnowledgeGraphModal.js
│       └── SAPWorkOrderPreview.js
│
└── data/
    ├── workflowQuestions.js         # Q1-Q6 conversation flow
    ├── scenarioContext.js           # Master scenario data (~580 lines)
    ├── faultTreeData.js             # FMEA fault tree structure
    ├── miningData.js                # Equipment & notifications
    ├── agentOutputs.js              # Agent response templates
    ├── agentToolCalls.js            # Tool call definitions
    ├── knowledgeGraphData.js        # Knowledge graph nodes/edges
    └── workOrderData.js             # SAP work order templates
```

### 2.2 Scene Flow Architecture

The demo operates through three main scenes with a conversation-driven workflow:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SCENE STATES                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────┐    handleLogin()    ┌──────────┐    Click Crusher    │
│   │  LOGIN  │ ─────────────────► │ OVERVIEW │ ─────────────────►  │
│   └─────────┘                     └──────────┘                     │
│                                        │                            │
│                                        │                            │
│                              ┌─────────▼─────────┐                 │
│                              │     ANALYSIS      │                 │
│                              │  (Split Panel)    │                 │
│                              └───────────────────┘                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    ANALYSIS WORKFLOW STAGES                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Q1 "Yes"         Q2 "Yes"         Q3 Select        Q5 "Yes"      │
│      │                │                 │                │          │
│      ▼                ▼                 ▼                ▼          │
│ ┌─────────┐    ┌──────────┐    ┌─────────────┐    ┌─────────────┐ │
│ │ agent_  │    │ initial_ │    │  trusted_   │    │ recommend-  │ │
│ │ network │───►│ analysis │───►│   huddle    │───►│   ations    │ │
│ └─────────┘    └──────────┘    └─────────────┘    └─────────────┘ │
│                                                          │          │
│                                                    Q6 "Yes"        │
│                                                          │          │
│                                                          ▼          │
│                                                   ┌─────────────┐  │
│                                                   │ work_order  │  │
│                                                   └─────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 State Management

The main `page.js` manages global state for the demo:

```javascript
// Scene Control
const [currentScene, setCurrentScene] = useState(SCENES.LOGIN);

// Workflow State
const [currentQuestionId, setCurrentQuestionId] = useState('q1');
const [answeredQuestions, setAnsweredQuestions] = useState([]);
const [isConversationLocked, setIsConversationLocked] = useState(false);
const [selectedScenario, setSelectedScenario] = useState(null);

// Output Console State
const [outputStage, setOutputStage] = useState(null);
const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false);
const [chatResponse, setChatResponse] = useState(null);

// Dynamic Agents Hook
const {
  agentResponses,
  activeAgent,
  isProcessing,
  queryAgent,
  runHuddleWorkflow,
  reset: resetAgents,
} = useDynamicAgents();
```

---

## 3. Component Deep Dive

### 3.1 Main Page (`page.js`)

**Purpose:** Central orchestrator for all scenes and state transitions.

**Key Responsibilities:**
1. Manages scene transitions (LOGIN → OVERVIEW → ANALYSIS)
2. Handles conversation workflow (Q1-Q6)
3. Coordinates output console stages
4. Integrates dynamic agent responses

**Critical Event Handlers:**

| Handler | Trigger | Action |
|---------|---------|--------|
| `handleLogin()` | Login button click | Transition to OVERVIEW |
| `handleEquipmentClick()` | Click Primary Crusher | Transition to ANALYSIS |
| `handleAnswer()` | User selects option | Process Q1-Q6 flow |
| `handleStageComplete()` | Output stage finishes | Unlock conversation |
| `handleChatResponse()` | Chatbot response | Display in Output Console |

### 3.2 ConversationPanel (`ConversationPanel.js`)

**Purpose:** Left panel managing the guided Q&A workflow and chatbot interface.

**Features:**
- LLM-style question generation animation
- Staged thinking indicators
- Response caching with localStorage
- Tool call visualization
- Agent selection display

**Key Props:**

```javascript
{
  currentQuestion,      // Current question object
  onAnswer,            // Answer handler callback
  answeredQuestions,   // History of answered questions
  isLocked,            // Prevent interaction during processing
  dynamicOptions,      // Dynamic options for Q3 (fault tree)
  onChatResponse,      // Send chatbot responses to Output Console
}
```

**Question Flow Logic:**
```javascript
switch (questionId) {
  case 'q1': // Yes → Show agent network, move to Q2
  case 'q2': // Yes → Lock, trigger initial_analysis
  case 'q3': // Select scenario → Lock, trigger trusted_huddle
  case 'q4': // Yes → Show knowledge graph
  case 'q5': // Yes → Lock, trigger recommendations
  case 'q6': // Yes → Lock, trigger work_order
}
```

### 3.3 OutputConsole (`OutputConsole.js`)

**Purpose:** Right panel displaying agent activities, visualizations, and results.

**Output Stages:**

| Stage | Trigger | Content |
|-------|---------|---------|
| `agent_network` | Q1 "Yes" | Agent network periodic table |
| `initial_analysis` | Q2 "Yes" | Fault tree + Root cause table |
| `trusted_huddle` | Q3 Select | Sequential agent execution |
| `recommendations` | Q5 "Yes" | Action recommendations |
| `work_order` | Q6 "Yes" | SAP work order preview |
| `chat_response` | Chatbot query | Dynamic response card |

**Orchestrator Phases:**
```javascript
const [orchestratorPhase, setOrchestratorPhase] = useState('idle');
// 'idle' → 'activating' → 'monitoring' → 'complete'
```

### 3.4 MiningProcessFlowDiagram (`MiningProcessFlowDiagram.js`)

**Purpose:** Digital twin visualization of the complete mining value chain.

**Views:**
1. **Designed** - Static image-based view (`/images/mining-process-flow-designed.png`)
2. **Interactive** - SVG-based view with clickable equipment

**Sections (6 total):**
1. MINING - Loading, Hauling, Primary/Secondary Crushers
2. CONCENTRATING - Stockpile, Stacker
3. ORE BENEFICIATION - SAG Mill, Flotation Cell
4. ORE CONCENTRATE - Conveyors, Thickener, Stockpile
5. TAILINGS - Thickener, Dam, Transport
6. PRODUCTS - Filtering, Load Out, Ship Stackers

**KPI Cards:**
- Run of Mine (ROM): ~145,000 t/day
- Ore Processed: ~125,000 t/day
- Copper Produced: ~625 t/day
- Production Loss: ~6,000 t/day (alert)

---

## 4. Multi-Agent System

### 4.1 Agent Architecture

The demo uses a "Super Agent" pattern with 5 specialist agents orchestrated in a "Trusted Huddle":

```
                    ┌─────────────────┐
                    │   Super Agent   │
                    │  (Orchestrator) │
                    └────────┬────────┘
                             │
            ┌────────┬───────┼───────┬────────┐
            │        │       │       │        │
            ▼        ▼       ▼       ▼        ▼
        ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
        │  RO  │ │  TA  │ │  MI  │ │  IL  │ │  LD  │
        └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### 4.2 Agent Specifications

| Agent ID | Name | Role | Color | Data Sources |
|----------|------|------|-------|--------------|
| **RO** | Resource Orchestration | Crew & scheduling coordination | Orange `#F59E0B` | SAP PM, HR System, Scheduling |
| **TA** | Timeseries Analysis | Sensor trend analysis | Red `#EF4444` | PI Historian, SCADA, IoT |
| **MI** | Maintenance Intelligence | Reliability engineering | Purple `#8B5CF6` | CMMS, Weibull, FMEA |
| **IL** | Inventory & Logistics | Parts availability | Green `#10B981` | SAP MM, Warehouse |
| **LD** | Liner Diagnostics | Wear pattern analysis | Blue `#3B82F6` | Ultrasonic, Wear Models |

### 4.3 Agent Response Configuration

From `useDynamicAgents.js`:

```javascript
const CURATED_RESPONSES = {
  RO: {
    content: "Last replacement: May 15, 2024 (8 months ago) • Team A confirmed Jan 20, 06:00 • Lead: James Morrison (47 jobs, 95% match) • 4 fitters assigned • Est. duration: 8 hours",
    isAI: true,
  },
  TA: {
    content: "Efficiency: 89% → 82% over 30 days • Correlation (wear-efficiency): r=0.92 • Degradation rate: 0.23%/day • 80% threshold in ~9 days • Pitman vib +120%, Motor current +41%",
    isAI: true,
  },
  MI: {
    content: "Weibull β=2.1 (wear-out phase) • Lifecycle: 133% exceeded (8mo vs 6mo design) • RPN=432 (S:8 × O:6 × D:9) • P(Failure) in 7 days: 38%",
    isAI: true,
  },
  IL: {
    content: "CJ-8845 Fixed Liner: 4 units in stock @ WH-02 • CJ-8846 Movable: 3 units in stock • Total material: $16,494 • Lead time: 0 days (ready to issue)",
    isAI: true,
  },
  LD: {
    content: "Zone B (feed side): 65% remaining - CRITICAL • Asymmetric wear → jaw misalignment suspected • Wear rate: 8.75%/month • RUL: 5-7 days at current load",
    isAI: true,
  },
};
```

### 4.4 Agent Tool Calls

Each agent executes specific tool calls with visualizations:

```javascript
// Example: TA Agent Steps
{
  id: 'TA',
  steps: [
    { type: 'tool', name: 'query_historian', params: 'equipment=CRUSHER-101, days=30' },
    { type: 'result', text: '720 sensor readings analyzed • Strong wear correlation detected' },
    { type: 'display', component: 'EfficiencyStreamChart' },
    { type: 'display', component: 'BulletChart' },
    { type: 'finding', text: 'Efficiency 89%→82% (30 days) | Wear correlation r=0.92 | ...' }
  ],
}
```

---

## 5. Data Models & Scenario Context

### 5.1 Master Scenario Context

The `scenarioContext.js` file (~580 lines) serves as the single source of truth for all scenario data:

**Key Date References:**
```javascript
const DEMO_DATE = '2025-01-15';           // Current demo date
const LINER_LAST_REPLACED = '2024-05-15'; // 8 months ago
const ALERT_TRIGGERED = '2025-01-10';     // When AI detected issue
const SCHEDULED_REPAIR = '2025-01-20';    // Planned shutdown
```

### 5.2 Equipment Data

```javascript
equipment: {
  id: 'CRUSHER-101',
  name: 'Jaw Crusher 101',
  fullName: 'Metso C160 Primary Jaw Crusher',
  manufacturer: 'Metso Outotec',
  model: 'C160',
  currentEfficiency: '82%',
  targetEfficiency: '89%',
  operatingHours: 48250,
  activeAlarms: 5,
  healthScore: 68,
  productionLoss: '$47,500/day',
}
```

### 5.3 Work Order Data

```javascript
workOrder: {
  number: '4000000147',
  status: 'REL',
  statusText: 'Released',
  type: 'PM02 - Corrective Maintenance',
  priority: '1 - Very High',
  scheduledStart: '2025-01-20 06:00',
  estimatedDuration: '8 hours',
  estimatedCost: '$20,174.00',
  costBreakdown: {
    labor: '$3,200 (32 hours @ $100/hr)',
    materials: '$16,494',
    overhead: '$480',
  },
}
```

### 5.4 Reliability Metrics

```javascript
reliabilityMetrics: {
  weibull: {
    beta: 2.1,          // Wear-out failure mode
    eta: 2800,          // Characteristic life (hours)
    r2: 0.94,           // Model fit
  },
  failureProbability: '38%',
  mtbf: '2,450 hours',
  mttr: '8 hours',
  rpn: 432,             // Risk Priority Number
  rpnBreakdown: {
    severity: 8,
    occurrence: 6,
    detection: 9,
  },
  remainingUsefulLife: '5-7 days',
}
```

### 5.5 Liner Wear Data

```javascript
linerDetails: {
  currentThickness: '97.5mm (65% remaining)',
  criticalThreshold: '105mm (70% remaining)',
  wearRate: '2.1mm/week (accelerated)',
  zones: {
    A: { wear: 60, status: 'acceptable' },
    B: { wear: 85, status: 'critical' },     // Feed side - PRIMARY CONCERN
    C: { wear: 55, status: 'acceptable' },
    D: { wear: 70, status: 'warning' },
  },
}
```

### 5.6 Context Topic Routing

The `getContextByTopic()` function routes queries to appropriate data and agents:

```javascript
// Example routing
'work order' → { topic: 'Work Order', agent: 'RO', tool: 'sap_query' }
'liner wear' → { topic: 'Liner Diagnostics', agent: 'LD', tool: 'liner_diagnostics' }
'weibull'    → { topic: 'Reliability', agent: 'MI', tool: 'reliability_calc' }
'inventory'  → { topic: 'Inventory', agent: 'IL', tool: 'inventory_check' }
```

---

## 6. User Journey Walkthrough

### Step 1: Login (30 seconds)

**Screen:** Microsoft SSO-style login with Accenture branding

**Key Elements:**
- "Mining Operations - AI Control Tower" title
- "Login with Microsoft" button
- Professional, enterprise-ready appearance

### Step 2: Digital Twin Overview (2 minutes)

**Screen:** Full value chain visualization

**User Actions:**
1. View KPI cards (ROM, Ore Processed, Cu Produced, Loss)
2. Toggle between "Shift Performance" and "LPO Hotspots"
3. Notice red alert on Primary Crusher
4. Click on Primary Crusher to investigate

**Demo Points:**
- "This is your entire operation. Pit to port."
- "Green is good. Yellow needs attention. Red means AI flagged something."

### Step 3: Efficiency Analysis Initiation (3 minutes)

**Screen:** Split panel - Conversation (left) + Output Console (right)

**Q1:** "I detected a 7% efficiency drop in Jaw Crusher 101 (89% → 82%). Do you want to investigate?"
- User selects "Yes, analyze efficiency drop"
- Agent Network display appears showing available specialists

**Q2:** "Do you want to perform a detailed Root Cause Analysis (RCA)?"
- User selects "Yes, perform RCA"
- Initial analysis begins

### Step 4: Fault Tree Analysis (3 minutes)

**Screen:** FMEA-based fault tree with probability rankings

**Fault Modes Displayed:**
1. Liner Wear Degradation - 85% probability (SELECTED)
2. Hard Ore Feed Composition - 75% probability
3. Pitman Bearing Degradation - 60% probability
4. Drive Motor Overload - 40% probability

**Q3:** "Based on the Fault Mode Analysis, select a scenario to investigate:"
- User selects "Liner Wear Degradation"
- Trusted Huddle initiates

### Step 5: Trusted Huddle (4 minutes)

**Screen:** Sequential agent activation with tool calls and visualizations

**Agent Sequence:**
1. **RO** - SAP query, crew availability → PersonnelSankeyChart
2. **TA** - Historian query, correlation → EfficiencyStreamChart, BulletChart
3. **MI** - Reliability calc → WeibullChart, FailureModeAreaBump
4. **IL** - Parts check → InventoryBarChart
5. **LD** - Wear analysis → WearHeatmap, CrusherLinerVisualization

**Q4:** "Would you like to view the knowledge graph?"
**Q5:** "Do you want to receive prioritized recommendations?"

### Step 6: Recommendations & Work Order (2 minutes)

**Screen:** Action recommendations with SAP integration

**Recommendations Displayed:**
- **Immediate:** Schedule liner replacement Jan 20
- **Near-Term:** Inspect Pitman bearings
- **Long-Term:** Install predictive monitoring

**Q6:** "Would you like to create a SAP PM work order?"
- User selects "Yes, create work order"
- Work order WO-4000000147 created
- Status changes: CRTD → REL (Released)

---

## 7. API Reference

### 7.1 Agent Query API

**Endpoint:** `POST /api/cerebra-agent`

**Request:**
```json
{
  "agentId": "TA",
  "query": "Analyze efficiency trends for CRUSHER-001",
  "conversationHistory": [],
  "useCache": true
}
```

**Response:**
```json
{
  "agentId": "TA",
  "agentName": "Timeseries Analysis Agent",
  "content": "✓ [Analysis type]: [Finding with specific numbers]",
  "timestamp": "2025-01-15T14:32:45Z",
  "usage": { "prompt_tokens": 150, "completion_tokens": 80 },
  "cached": false
}
```

### 7.2 Chat API

**Endpoint:** `POST /api/cerebra-agent/chat`

**Request:**
```json
{
  "message": "What's the status of the work order?",
  "sessionId": "session-1234567890"
}
```

**Response:**
```json
{
  "message": "Work order 4000000147 is currently in REL (Released) status...",
  "timestamp": "2025-01-15T14:35:00Z"
}
```

### 7.3 Agent Prompts Configuration

From `/api/cerebra-agent/route.js`:

```javascript
const AGENT_PROMPTS = {
  RO: {
    name: 'Resource Orchestration Agent',
    systemPrompt: `You are an expert Resource Orchestration Agent...
      - Analyze crew availability and scheduling
      - Review maintenance history and work order backlogs
      - Coordinate resource allocation
      Format: "✓ [Action taken]: [Key finding with specific data]"`,
  },
  // ... other agents
};
```

---

## 8. Visualization Components

### 8.1 Chart Component Summary

All charts use **Nivo.rocks** library with dynamic imports for SSR compatibility:

| Component | Type | Purpose | Agent |
|-----------|------|---------|-------|
| `EfficiencyTrendChart` | Line | 30-day efficiency trend | TA |
| `EfficiencyStreamChart` | Stream | Area-based efficiency visualization | TA |
| `BulletChart` | Bullet | KPI comparison (actual vs target) | TA |
| `WearHeatmap` | Heatmap | Liner zone wear levels | LD |
| `WeibullChart` | Line | Failure probability distribution | MI |
| `FailureModeAreaBump` | AreaBump | FMEA ranking over time | MI |
| `PersonnelSankeyChart` | Sankey | Crew allocation flow | RO |
| `InventoryBarChart` | Bar | Parts availability | IL |
| `HuddleSummaryChart` | Radar/Pie | Agent contribution summary | All |
| `AgentContributionIcicle` | Icicle | Hierarchical agent outputs | All |
| `MaintenanceCalendar` | Calendar | Schedule visualization | RO |

### 8.2 Custom Visualizations

| Component | Purpose |
|-----------|---------|
| `FaultTreeDiagram` | FMEA fault tree with probability nodes |
| `CrusherLinerVisualization` | 3D liner wear cross-section |
| `KnowledgeGraphModal` | Agent collaboration graph |
| `SAPWorkOrderPreview` | SAP PM work order document |

---

## 9. Extension Guidelines

See [PIT-TO-CUSTOMER-EXTENSION.md](./PIT-TO-CUSTOMER-EXTENSION.md) for detailed guidelines on extending the demo to cover the complete pit-to-customer value chain.

---

## Appendix A: Key Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| `page.js` | Main scene orchestrator | ~350 |
| `ConversationPanel.js` | Q&A workflow component | ~1,470 |
| `OutputConsole.js` | Agent output display | ~1,350 |
| `scenarioContext.js` | Master data store | ~580 |
| `workflowQuestions.js` | Q1-Q6 + Agent definitions | ~190 |
| `useDynamicAgents.js` | Agent hook | ~145 |
| `MiningProcessFlowDiagram.js` | Digital twin | ~1,050 |

## Appendix B: Demo Timing Guide

| Section | Duration | Cumulative |
|---------|----------|------------|
| Login | 0:30 | 0:30 |
| Digital Twin Overview | 2:00 | 2:30 |
| Analysis Setup (Q1-Q2) | 3:00 | 5:30 |
| Fault Tree (Q3) | 3:00 | 8:30 |
| Trusted Huddle | 4:00 | 12:30 |
| Recommendations + Work Order | 2:00 | 14:30 |
| Chatbot Demo | 2:00 | 16:30 |
| **Total** | **~15-17 min** | |

---

*Document generated: January 2025*  
*Based on Cerebra Demo v2.1.0*
