# Cerebra Demo - Product Requirements Specification

> **Complete Technical Reference for Multi-Agent AI Command Center**
> Version 2.2.0 | January 2026

This document serves as the comprehensive technical specification for the Cerebra Demo platform, covering all implemented features, reusable patterns, and extension guidelines.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Design System & Brand Guidelines](#3-design-system--brand-guidelines)
4. [Domain Mode Framework](#4-domain-mode-framework)
5. [Multi-Agent System](#5-multi-agent-system)
6. [Workflow Engine](#6-workflow-engine)
7. [Visualization Library](#7-visualization-library)
8. [Ontology & Graph System](#8-ontology--graph-system)
9. [PDF Generation System](#9-pdf-generation-system)
10. [Component Inventory](#10-component-inventory)
11. [Data Architecture](#11-data-architecture)
12. [API Reference](#12-api-reference)
13. [Maintenance Mode Implementation](#13-maintenance-mode-implementation)
14. [Pit-to-Port Mode Implementation](#14-pit-to-port-mode-implementation)
15. [Extension Framework](#15-extension-framework)
16. [Reusable Patterns Catalog](#16-reusable-patterns-catalog)
17. [Testing Strategy](#17-testing-strategy)
18. [Appendices](#appendices)

---

## 1. Executive Summary

### 1.1 What is Cerebra?

Cerebra is a **Multi-Agent AI Command Center** demonstration platform that showcases intelligent decision orchestration across industrial operations. It demonstrates how specialized AI agents collaborate through a "Trusted Huddle" pattern to provide actionable insights and automated workflows.

### 1.2 Current Implementations

| Domain Mode | Industry | Primary Scenario | Status |
|-------------|----------|------------------|--------|
| **Maintenance** | Copper Mining | Predictive maintenance, equipment failure analysis | ✅ Complete |
| **Pit-to-Port** | Iron Ore Mining (WAIO) | Shift planning, grade optimization, closed-loop planning | ✅ Complete |

### 1.3 Key Capabilities

- **Digital Twin Visualization** - Real-time process flow with interactive equipment
- **Multi-Agent Collaboration** - 5-8 specialist AI agents per domain
- **Trusted Huddle Pattern** - Visual orchestration of agent collaboration
- **Ontology Graph Explorer** - Neo4j-style semantic model visualization
- **Branded PDF Generation** - Accenture-styled work orders and shift briefs
- **Closed-Loop Planning** - Feedback from execution to planning systems
- **Conversational AI** - Natural language follow-up queries

### 1.4 Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18 |
| **Visualizations** | Nivo.rocks (13+ chart types), Custom SVG |
| **PDF Generation** | @react-pdf/renderer |
| **Backend** | Next.js API Routes |
| **AI/LLM** | OpenAI GPT-4o-mini / Azure OpenAI |
| **Styling** | CSS Modules, Custom Design System |
| **State Management** | React useState, useCallback, useMemo |

---

## 2. Architecture Overview

### 2.1 Directory Structure

```
src/app/cerebra-demo/
├── page.js                              # Main orchestrator (~680 lines)
├── layout.js                            # Standalone layout
├── styles/
│   └── cerebra.css                      # Design system (~714 lines)
│
├── domains/
│   └── domainModes.js                   # Domain configuration
│
├── hooks/
│   ├── useDynamicAgents.js              # Agent response management
│   └── useAgentChat.js                  # Chat API interaction
│
├── components/
│   ├── LoginScreen.js                   # SSO-style login
│   ├── CerebraHeader.js                 # Navigation header
│   ├── MiningProcessFlowDiagram.js      # Digital twin (~1,050 lines)
│   ├── ConversationPanel.js             # Q&A workflow (~1,470 lines)
│   ├── OutputConsole.js                 # Agent outputs (~1,350 lines)
│   ├── HuddleBanner.js                  # Orchestration UI
│   ├── ActionableRecommendations.js     # Maintenance actions
│   ├── RootCauseTable.js                # FMEA ranking
│   ├── NotificationPanel.js             # Alerts panel
│   ├── WorkOrderPDF.js                  # SAP work order PDF
│   ├── ToolCallDisplay.js               # Tool call visualization
│   │
│   ├── waio/                            # WAIO-specific components
│   │   ├── ShiftBriefPDF.js             # Branded shift brief PDF
│   │   ├── ShiftBriefPreview.js         # Preview component
│   │   ├── ConstraintLaneBoard.js       # Parallel constraint engine
│   │   ├── IntegrationPublishDrawer.js  # Publishing theatre
│   │   ├── ShiftPlanGantt.js            # Gantt chart
│   │   ├── PlanOptionCards.js           # Plan selection
│   │   ├── BlendRecipePanel.js          # Blend visualization
│   │   ├── EventFeed.js                 # Real-time events
│   │   ├── EquipmentAssignmentTable.js  # Equipment table
│   │   ├── PlanDeltaSummary.js          # Plan changes
│   │   └── WAIOKPIStrip.js              # Iron ore KPIs
│   │
│   ├── outputStages/waio/               # WAIO workflow stages
│   │   ├── WAIOAgentNetworkStage.js
│   │   ├── WAIODeviationTraceStage.js
│   │   ├── WAIOParallelHuddleStage.js
│   │   ├── WAIOPlanOptionsStage.js
│   │   ├── WAIOShiftPlanStage.js
│   │   ├── WAIOPublishStage.js
│   │   ├── WAIOMonitorStage.js
│   │   ├── WAIOReconciliationStage.js
│   │   ├── WAIOMinePlanRetrofitStage.js
│   │   └── WAIOPublishToSystemsStage.js
│   │
│   ├── charts/                          # Nivo chart components
│   │   ├── EfficiencyTrendChart.js
│   │   ├── EfficiencyStreamChart.js
│   │   ├── BulletChart.js
│   │   ├── WearHeatmap.js
│   │   ├── WeibullChart.js
│   │   ├── FailureModeAreaBump.js
│   │   ├── PersonnelSankeyChart.js
│   │   ├── InventoryBarChart.js
│   │   ├── HuddleSummaryChart.js
│   │   ├── AgentContributionIcicle.js
│   │   ├── MaintenanceCalendar.js
│   │   ├── GradeTraceSankey.js
│   │   ├── ValueAtRiskBar.js
│   │   └── DeviationWaterfall.js
│   │
│   └── visualizations/                  # Custom visualizations
│       ├── FaultTreeDiagram.js
│       ├── CrusherLinerVisualization.js
│       ├── KnowledgeGraphModal.js
│       ├── SAPWorkOrderPreview.js
│       └── P2COntologyGraphModal.js     # Neo4j-style graph (~2,200 lines)
│
└── data/
    ├── workflowQuestions.js             # Maintenance workflow
    ├── scenarioContext.js               # Maintenance scenario data
    ├── faultTreeData.js                 # FMEA fault tree
    ├── miningData.js                    # Equipment & notifications
    ├── knowledgeGraphData.js            # Knowledge graph
    ├── workOrderData.js                 # SAP work order
    ├── agentOutputs.js                  # Agent templates
    ├── agentToolCalls.js                # Tool definitions
    │
    └── waio/                            # WAIO-specific data
        ├── waioWorkflowQuestions.js     # Q1-Q10 + complete stage
        ├── waioScenarioContext.js       # WAIO scenario data
        ├── waioAgents.js                # 9 agents configuration
        ├── waioNotifications.js         # WAIO alerts
        ├── waioPublishTargets.js        # Integration systems
        ├── waioProcessFlowData.js       # Process flow
        └── ontology/                    # P2C Ontology
            ├── index.js
            ├── p2cOntologySchema.js     # 30+ entity types
            ├── p2cInstanceGraph.js      # 50+ nodes, 80+ edges
            ├── p2cLineageGraph.js       # System lineage
            └── p2cDecisionGraph.js      # Agent decision traces
```

### 2.2 State Management Architecture

```javascript
// Main page.js state structure
{
  // Scene Control
  currentScene: 'login' | 'overview' | 'analysis',
  
  // Domain Mode
  domainMode: 'maintenance' | 'waioShiftOptimiser',
  
  // Workflow State
  currentQuestionId: string,
  answeredQuestions: Array<{ questionId, optionId, text }>,
  isConversationLocked: boolean,
  selectedScenario: string | null,
  
  // WAIO-specific
  selectedObjective: string | null,
  selectedPlan: string | null,
  
  // Output Console
  outputStage: string | null,
  isProcessingStage: boolean,
  showKnowledgeGraph: boolean,
  chatResponse: object | null,
  
  // Graph Modal
  showP2CGraph: boolean,
  graphFocusId: string | null,
  graphMode: 'instance' | 'ontology' | 'lineage' | 'decision',
}
```

### 2.3 Component Communication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           page.js (Orchestrator)                     │
│  - Manages all global state                                         │
│  - Routes events between components                                  │
│  - Coordinates workflow transitions                                  │
└─────────────────────────────────────────────────────────────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Conversation │    │   Output     │    │ Digital Twin │
│    Panel     │    │   Console    │    │ Diagram      │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ • Q&A Flow   │    │ • Agents     │    │ • KPIs       │
│ • Chatbot    │───►│ • Charts     │    │ • Equipment  │
│ • History    │    │ • Stages     │    │ • Alerts     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │   Modals     │
                    ├──────────────┤
                    │ • KG Modal   │
                    │ • P2C Graph  │
                    │ • PDF Preview│
                    └──────────────┘
```

---

## 3. Design System & Brand Guidelines

### 3.1 Color Palette

```css
:root {
  /* Primary Brand Colors */
  --cerebra-primary: #A100FF;      /* Accenture Purple */
  --accenture-purple: #A100FF;
  --azure-blue: #0078D4;           /* Microsoft Azure */
  
  /* Dark Theme */
  --dark-bg: #1a1a2e;
  --dark-secondary: #2d2d44;
  
  /* Semantic Colors */
  --success-green: #10B981;
  --warning-yellow: #F59E0B;
  --error-red: #EF4444;
  
  /* Text Colors */
  --text-primary: #1a1a2e;
  --text-secondary: #4b5563;
  --text-muted: #9ca3af;
  
  /* Borders & Backgrounds */
  --border-light: #e2e8f0;
  --bg-light: #fafafa;
}
```

### 3.2 Agent Color Standards

| Agent Category | Color | Hex |
|----------------|-------|-----|
| Orchestrator | Accenture Purple | `#A100FF` |
| Resource/Planning | Orange | `#F59E0B` |
| Timeseries/Analysis | Red | `#EF4444` |
| Reliability/Intelligence | Purple | `#8B5CF6` |
| Inventory/Logistics | Green | `#10B981` |
| Diagnostics/Quality | Blue | `#3B82F6` |
| Commercial/Market | Pink | `#EC4899` |
| Retrofit/Planning | Sky Blue | `#0EA5E9` |
| Ontology/Navigation | Teal | `#14B8A6` |

### 3.3 Typography

```css
/* Primary Font Stack */
font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace Font Stack */
font-family: 'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace;

/* Font Sizes */
--font-xs: 10px;    /* Badges, labels */
--font-sm: 11px;    /* Secondary text */
--font-base: 12px;  /* Body text */
--font-md: 13px;    /* Inputs, buttons */
--font-lg: 14px;    /* Section headers */
--font-xl: 16px;    /* Page headers */
--font-2xl: 20px;   /* Major titles */
```

### 3.4 Component Styling Patterns

#### Card Pattern
```javascript
{
  background: 'white',
  borderRadius: '8px',
  border: '1px solid var(--border-light)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
}
```

#### Purple Left Border Pattern
```javascript
{
  borderLeft: '3px solid var(--accenture-purple)',
  borderRadius: '0 8px 8px 0',
}
```

#### Status Badge Pattern
```javascript
{
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '10px',
  fontWeight: '600',
  background: statusColor,
  color: 'white',
}
```

### 3.5 Animation Standards

```css
/* Standard Transitions */
transition: all 0.15s ease;  /* Quick interactions */
transition: all 0.2s ease;   /* Standard interactions */
transition: all 0.3s ease;   /* Emphasized animations */

/* Keyframe Animations */
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeSlideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes alertPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); } }
```

---

## 4. Domain Mode Framework

### 4.1 Domain Configuration Structure

```javascript
// domains/domainModes.js
export const DOMAIN_MODES = {
  [DOMAIN_MODE_IDS.MAINTENANCE]: {
    id: 'maintenance',
    label: 'Maintenance',
    shortLabel: 'Maintenance',
    description: 'Predictive maintenance and equipment failure analysis',
    icon: 'wrench',
    headerTitle: 'Copper Mine Operations Center - Digital Twin',
    analysisTitle: 'Primary Crusher Efficiency Analysis',
    imports: {
      workflowQuestions: () => import('../data/workflowQuestions'),
      scenarioContext: () => import('../data/scenarioContext'),
      notifications: () => import('../data/miningData'),
      processFlowData: () => import('../data/miningData'),
      agentConfig: () => import('../hooks/useDynamicAgents'),
    },
  },
  [DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER]: {
    id: 'waioShiftOptimiser',
    label: 'Pit-to-Port',
    shortLabel: 'P2P',
    description: 'Pit-to-port shift planning and grade optimisation',
    icon: 'route',
    headerTitle: 'Pit-to-Port Command Center',
    analysisTitle: 'Shift Plan Optimisation',
    imports: {
      workflowQuestions: () => import('../data/waio/waioWorkflowQuestions'),
      scenarioContext: () => import('../data/waio/waioScenarioContext'),
      notifications: () => import('../data/waio/waioNotifications'),
      processFlowData: () => import('../data/waio/waioProcessFlowData'),
      agentConfig: () => import('../data/waio/waioAgents'),
    },
  },
};
```

### 4.2 Creating a New Domain Mode

To add a new domain, follow this pattern:

```javascript
// 1. Add domain ID constant
export const DOMAIN_MODE_IDS = {
  ...existing,
  NEW_DOMAIN: 'newDomain',
};

// 2. Define domain configuration
[DOMAIN_MODE_IDS.NEW_DOMAIN]: {
  id: 'newDomain',
  label: 'New Domain',
  shortLabel: 'ND',
  description: 'Description of new domain',
  icon: 'icon-name',
  headerTitle: 'Header title for new domain',
  analysisTitle: 'Analysis title for new domain',
  imports: {
    workflowQuestions: () => import('../data/newDomain/workflowQuestions'),
    scenarioContext: () => import('../data/newDomain/scenarioContext'),
    notifications: () => import('../data/newDomain/notifications'),
    agentConfig: () => import('../data/newDomain/agents'),
  },
},

// 3. Create data directory structure
// data/newDomain/
//   ├── workflowQuestions.js
//   ├── scenarioContext.js
//   ├── notifications.js
//   └── agents.js
```

### 4.3 Domain Mode Switching

```javascript
// In page.js
const handleDomainModeSwitch = useCallback((newMode) => {
  if (newMode === domainMode) return;
  
  setDomainMode(newMode);
  
  // Reset all state for new domain
  setCurrentQuestionId(getFirstQuestionId(newMode));
  setAnsweredQuestions([]);
  setIsConversationLocked(false);
  setSelectedScenario(null);
  setOutputStage(null);
  setChatResponse(null);
  resetAgents();
}, [domainMode, resetAgents]);
```

---

## 5. Multi-Agent System

### 5.1 Agent Architecture Pattern

```
                    ┌─────────────────────┐
                    │    Super Agent      │
                    │   (Orchestrator)    │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────┴───────┐     ┌────────┴────────┐    ┌───────┴───────┐
│  Domain       │     │   Analysis      │    │  Execution    │
│  Specialists  │     │   Specialists   │    │  Specialists  │
└───────────────┘     └─────────────────┘    └───────────────┘
```

### 5.2 Maintenance Mode Agents (5 Agents)

| ID | Name | Role | Color |
|----|------|------|-------|
| **RO** | Resource Orchestration | Crew & scheduling coordination | `#F59E0B` |
| **TA** | Timeseries Analysis | Sensor trend analysis | `#EF4444` |
| **MI** | Maintenance Intelligence | Reliability engineering | `#8B5CF6` |
| **IL** | Inventory & Logistics | Parts availability | `#10B981` |
| **LD** | Liner Diagnostics | Wear pattern analysis | `#3B82F6` |

### 5.3 Pit-to-Port Mode Agents (9 Agents)

| ID | Name | Role | Color |
|----|------|------|-------|
| **SO** | Shift Optimiser | Orchestrates huddle, creates plan options | `#A100FF` |
| **GC** | Grade & Compliance | Detect under-spec risk, penalties | `#EF4444` |
| **ST** | Stockpile Traceability | Parcel trace, data confidence | `#F59E0B` |
| **FR** | Fleet & Resources | Equipment availability, constraints | `#10B981` |
| **MP** | Mine Planning | Face selection, dig rates | `#6366F1` |
| **LP** | Logistics | Train slots, port constraints | `#8B5CF6` |
| **CM** | Commercial & Market | Penalties, contract priorities | `#EC4899` |
| **PR** | Plan Retrofit | 7/30/90-day plan adjustments | `#0EA5E9` |
| **OG** | Ontology Navigator | Graph queries, explainability | `#14B8A6` |

### 5.4 Agent Configuration Template

```javascript
export const AGENT_CONFIG = {
  AGENT_ID: {
    id: 'AGENT_ID',
    name: 'Agent Short Name',
    fullName: 'Agent Full Name',
    color: '#HEXCOLOR',
    lane: 1,  // For parallel huddle display
    role: 'Description of agent role',
    icon: 'icon-name',
    steps: [
      { type: 'tool', name: 'tool_name', params: 'param=value' },
      { type: 'result', text: 'Result description' },
      { type: 'display', component: 'ChartComponentName' },
      { type: 'finding', text: 'Key finding summary' },
    ],
  },
};
```

### 5.5 Curated Responses Pattern

```javascript
export const CURATED_RESPONSES = {
  AGENT_ID: {
    content: "Concise summary with specific numbers and findings",
    isAI: true,  // Indicates AI-generated content
  },
};
```

### 5.6 useDynamicAgents Hook

```javascript
const {
  agentResponses,        // Record<string, AgentResponse[]>
  activeAgent,           // string | null
  isProcessing,          // boolean
  error,                 // string | null
  queryAgent,            // (agentId: string) => Promise<AgentResponse>
  runHuddleWorkflow,     // (agents?: string[]) => Promise<AgentResponse[]>
  reset,                 // () => void
  AGENT_CONFIG,          // Agent configuration object
} = useDynamicAgents();
```

---

## 6. Workflow Engine

### 6.1 Workflow Question Structure

```javascript
export const workflowQuestions = {
  q1: {
    id: 'q1',
    text: 'Question text with context and data',
    options: [
      { id: 'yes', label: 'Affirmative action label' },
      { id: 'no', label: 'Alternative action label' }
    ],
    nextQuestion: { yes: 'q2', no: 'end' },
    triggersOutput: 'output_stage_name',  // Optional
    isDynamic: false,  // True if options loaded dynamically
    allowChat: false,  // True if chatbot enabled after this
  },
};
```

### 6.2 Maintenance Mode Workflow (Q1-Q6)

```
Q1: Efficiency Drop Detection
    └─ Yes → agent_network → Q2
    
Q2: Root Cause Analysis Request
    └─ Yes → initial_analysis (fault tree) → Q3
    
Q3: Scenario Selection (dynamic)
    └─ Select → trusted_huddle → Q4
    
Q4: Knowledge Graph View
    └─ Yes → Show KG → Q5
    
Q5: Recommendations Request
    └─ Yes → recommendations → Q6
    
Q6: Work Order Creation
    └─ Yes → work_order → End (Chat enabled)
```

### 6.3 Pit-to-Port Mode Workflow (Q1-Q10 + Complete)

```
waio_q1: Risk Detection
    └─ Yes → waio_agent_network → waio_q2
    
waio_q2: Deviation Trace
    └─ Yes → waio_deviation_trace → waio_q3
    
waio_q3: Objective Selection (dynamic)
    └─ Select → waio_parallel_huddle → waio_q4
    
waio_q4: Plan Options
    └─ View → waio_plan_options → waio_q5
    
waio_q5: Plan Selection (dynamic)
    └─ Select → waio_shift_plan → waio_q6
    
waio_q6: Plan Publish
    └─ Yes → waio_publish → waio_q7
    
waio_q7: Enable Monitoring
    └─ Yes → waio_monitor → waio_q8
    
waio_q8: Reconciliation (End of Shift)
    └─ Yes → waio_reconciliation → waio_q9
    
waio_q9: Mine Plan Retrofit
    └─ Yes → waio_mine_plan_retrofit → waio_q10
    
waio_q10: Publish to Planning Systems
    └─ Yes → waio_publish_to_planning_systems → waio_complete
    
waio_complete: Chat Interface
    └─ Enables free-form chatbot interaction
```

### 6.4 Stage Configuration Pattern

```javascript
export const stageConfig = {
  stage_name: {
    autoComplete: false,          // Auto-advance to next question
    completionDelay: 3000,        // Delay before completion
    requiresSelection: true,      // Requires user selection
    allowsChat: false,            // Enable chatbot
    component: 'StageComponent',  // React component name
    nextQuestion: 'next_q_id',    // Next question after completion
  },
};
```

---

## 7. Visualization Library

### 7.1 Chart Components (Nivo.rocks)

All charts use dynamic imports for SSR compatibility:

```javascript
import dynamic from 'next/dynamic';

const ResponsiveLine = dynamic(
  () => import('@nivo/line').then(m => m.ResponsiveLine),
  { ssr: false }
);
```

### 7.2 Available Chart Types

| Component | Type | Library | Purpose |
|-----------|------|---------|---------|
| `EfficiencyTrendChart` | Line | @nivo/line | Efficiency trends over time |
| `EfficiencyStreamChart` | Stream | @nivo/stream | Area-based efficiency |
| `BulletChart` | Bullet | @nivo/bullet | KPI vs target comparison |
| `WearHeatmap` | Heatmap | @nivo/heatmap | Wear patterns by zone |
| `WeibullChart` | Line | @nivo/line | Failure probability curves |
| `FailureModeAreaBump` | AreaBump | @nivo/bump | FMEA ranking evolution |
| `PersonnelSankeyChart` | Sankey | @nivo/sankey | Resource allocation flows |
| `InventoryBarChart` | Bar | @nivo/bar | Parts inventory levels |
| `HuddleSummaryChart` | Radar/Pie | @nivo/radar | Agent contributions |
| `AgentContributionIcicle` | Icicle | @nivo/icicle | Hierarchical agent outputs |
| `MaintenanceCalendar` | Calendar | @nivo/calendar | Schedule visualization |
| `GradeTraceSankey` | Sankey | @nivo/sankey | Material grade flows |
| `ValueAtRiskBar` | Bar | @nivo/bar | Risk value comparison |
| `DeviationWaterfall` | Custom | Custom SVG | Plan vs actual waterfall |

### 7.3 Chart Theme Standard

```javascript
const chartTheme = {
  fontSize: 10,
  textColor: '#6B7280',
  axis: {
    domain: { line: { stroke: '#E5E7EB', strokeWidth: 1 } },
    ticks: {
      text: { fontSize: 9, fill: '#6B7280' },
      line: { stroke: '#E5E7EB' },
    },
    legend: { text: { fontSize: 10, fill: '#374151', fontWeight: 500 } },
  },
  grid: {
    line: { stroke: '#F3F4F6', strokeWidth: 1 },
  },
  tooltip: {
    container: {
      background: '#1A1A2E',
      color: 'white',
      fontSize: 11,
      borderRadius: '6px',
      padding: '8px 12px',
    },
  },
};
```

### 7.4 Custom Visualizations

| Component | Purpose | Technology |
|-----------|---------|------------|
| `FaultTreeDiagram` | FMEA fault tree with probability nodes | Custom SVG |
| `CrusherLinerVisualization` | 3D liner wear cross-section | Custom SVG |
| `P2COntologyGraphModal` | Neo4j-style graph explorer | Custom SVG + React |
| `SAPWorkOrderPreview` | SAP PM work order document | React Components |
| `ConstraintLaneBoard` | Parallel constraint engine | React Components |

---

## 8. Ontology & Graph System

### 8.1 Ontology Schema Structure

The P2C (Pit-to-Customer) ontology provides a semantic model with:

- **30+ Entity Types** across 6 categories
- **40+ Relationship Types**
- **Color-coded by category**

#### Entity Categories

| Category | Examples | Color Range |
|----------|----------|-------------|
| Planning | Plan, PlanVersion, BlendRecipe, Constraint | Purple tones |
| Mining | Pit, Zone, Block, Stockpile | Brown/Earth tones |
| Equipment | Truck, Shovel, Reclaimer, Conveyor | Blue tones |
| Quality | AssaySample, GradeEstimate, RiskSignal | Green tones |
| Logistics | Train, Vessel, TrainSlot, BerthSlot | Teal tones |
| Systems | System, DataProduct, APIEndpoint | Gray tones |

### 8.2 Instance Graph Structure

```javascript
export const p2cGraphNodes = [
  {
    id: 'unique-node-id',
    type: 'EntityType',
    label: 'Display Label',
    attrs: {
      key: 'value',
      confidence: 0.85,  // Optional confidence score
    },
    position: { x: 100, y: 200 },  // Optional explicit position
  },
];

export const p2cGraphEdges = [
  {
    id: 'unique-edge-id',
    source: 'source-node-id',
    target: 'target-node-id',
    type: 'relationship_type',
    label: 'Display Label',
  },
];
```

### 8.3 Graph Modal Features

The `P2COntologyGraphModal` component provides:

#### Four Tabs
1. **Ontology** - Entity/relationship type definitions
2. **Instance Graph** - Interactive node/edge visualization
3. **System Lineage** - Data flow between systems
4. **Decision Trace** - Agent execution traces

#### Instance Graph Features
- **Impact Analysis Mode** - Upstream/downstream highlighting
- **Node Type Filters** - Toggle visibility by type
- **Relationship Type Filters** - Toggle edge visibility
- **Path Finder** - Find paths between two nodes
- **Context Menu** - Right-click quick actions
- **Confidence Indicators** - Visual quality rings
- **Pan & Zoom** - Interactive navigation
- **Node Detail Drawer** - Attributes and relationships

### 8.4 Graph Utility Functions

```javascript
// Get upstream nodes (recursive)
export function getUpstreamNodes(nodeId, visited = new Set());

// Get downstream nodes (recursive)
export function getDownstreamNodes(nodeId, visited = new Set());

// Find paths between two nodes
export function findPaths(startId, endId, maxDepth = 10);

// Get all unique node types
export function getNodeTypes();

// Get all unique relationship types
export function getRelationshipTypes();
```

---

## 9. PDF Generation System

### 9.1 Technology Stack

- **Library:** `@react-pdf/renderer`
- **Font:** Helvetica (built-in)
- **Brand Colors:** Accenture Purple (#A100FF)

### 9.2 PDF Template Structure

```javascript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#A100FF',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A100FF',
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#A100FF',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    textTransform: 'uppercase',
  },
});

const PDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with logo and title */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>ACCENTURE</Text>
          <Text style={styles.logoSubtext}>Mining Operations AI</Text>
        </View>
        <View>
          <Text style={styles.title}>DOCUMENT TITLE</Text>
          <Text style={styles.documentId}>{data.id}</Text>
        </View>
      </View>
      
      {/* Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section Title</Text>
        {/* Section content */}
      </View>
    </Page>
  </Document>
);
```

### 9.3 Maintenance Work Order PDF

**File:** `components/WorkOrderPDF.js`

**Sections:**
1. Header (Accenture logo, WO number, status badge)
2. Equipment Information
3. Work Description
4. Operations Table
5. Material Requirements
6. Labor Assignment
7. Safety Requirements
8. Approval Signatures

### 9.4 Shift Brief PDF

**File:** `components/waio/ShiftBriefPDF.js`

**Sections:**
1. Header (Accenture logo, Shift ID, Plan status)
2. Shift Overview (Date, time, crew, supervisor)
3. Primary Objective
4. Train Schedule (Table format)
5. Dig Sequence (Table format)
6. KPI Targets
7. Risk Mitigation
8. Crew Briefing Points
9. Approval Signatures

### 9.5 Using PDFs in Components

```javascript
import { PDFDownloadLink } from '@react-pdf/renderer';
import ShiftBriefPDF from './ShiftBriefPDF';

const DownloadButton = ({ data }) => (
  <PDFDownloadLink
    document={<ShiftBriefPDF data={data} />}
    fileName={`shift-brief-${data.shiftId}.pdf`}
  >
    {({ loading }) => (
      <button disabled={loading}>
        {loading ? 'Generating...' : 'Download PDF'}
      </button>
    )}
  </PDFDownloadLink>
);
```

---

## 10. Component Inventory

### 10.1 Core Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `page.js` | Root | Main orchestrator |
| `layout.js` | Root | Standalone layout |
| `LoginScreen.js` | components/ | SSO-style login |
| `CerebraHeader.js` | components/ | Navigation header |

### 10.2 Main Panel Components

| Component | Lines | Purpose |
|-----------|-------|---------|
| `ConversationPanel.js` | ~1,470 | Q&A workflow, chatbot |
| `OutputConsole.js` | ~1,350 | Agent outputs, visualizations |
| `MiningProcessFlowDiagram.js` | ~1,050 | Digital twin |

### 10.3 Shared UI Components

| Component | Purpose |
|-----------|---------|
| `HuddleBanner.js` | Agent orchestration status |
| `NotificationPanel.js` | Alert notifications |
| `AgentNetworkDisplay.js` | Periodic table of agents |
| `ActionableRecommendations.js` | Prioritized actions |
| `RootCauseTable.js` | FMEA ranking table |
| `ToolCallDisplay.js` | Tool call visualization |

### 10.4 WAIO-Specific Components

| Component | Purpose |
|-----------|---------|
| `WAIOKPIStrip.js` | Iron ore KPI header |
| `ShiftBriefPreview.js` | Shift brief preview |
| `ShiftBriefPDF.js` | PDF document |
| `ConstraintLaneBoard.js` | Parallel constraint engine |
| `IntegrationPublishDrawer.js` | Publishing theatre |
| `ShiftPlanGantt.js` | Gantt chart |
| `PlanOptionCards.js` | Plan selection cards |
| `BlendRecipePanel.js` | Blend visualization |
| `EventFeed.js` | Real-time events |
| `EquipmentAssignmentTable.js` | Equipment table |
| `PlanDeltaSummary.js` | Plan changes summary |

### 10.5 WAIO Output Stages

| Stage | File | Purpose |
|-------|------|---------|
| Agent Network | `WAIOAgentNetworkStage.js` | Display available agents |
| Deviation Trace | `WAIODeviationTraceStage.js` | Heatmap analysis |
| Parallel Huddle | `WAIOParallelHuddleStage.js` | Multi-lane agent execution |
| Plan Options | `WAIOPlanOptionsStage.js` | Option comparison |
| Shift Plan | `WAIOShiftPlanStage.js` | Final plan display |
| Publish | `WAIOPublishStage.js` | Shift plan publishing |
| Monitor | `WAIOMonitorStage.js` | Real-time monitoring |
| Reconciliation | `WAIOReconciliationStage.js` | End-of-shift analysis |
| Mine Plan Retrofit | `WAIOMinePlanRetrofitStage.js` | 7/30/90 day adjustments |
| Publish to Systems | `WAIOPublishToSystemsStage.js` | Integration publishing |

---

## 11. Data Architecture

### 11.1 Maintenance Mode Data Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `workflowQuestions.js` | Q1-Q6 definitions | `workflowQuestions`, `faultTreeOptions`, `huddleAgents` |
| `scenarioContext.js` | Master scenario data | `scenarioContext`, `getContextByTopic()` |
| `faultTreeData.js` | FMEA fault tree | `faultTreeData`, `getProbabilityColor()` |
| `miningData.js` | Equipment & notifications | `equipmentData`, `notifications` |
| `knowledgeGraphData.js` | Knowledge graph | `knowledgeGraphNodes`, `knowledgeGraphEdges` |
| `workOrderData.js` | SAP work order | `workOrderTemplate`, `workOrderOperations` |

### 11.2 WAIO Mode Data Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `waioWorkflowQuestions.js` | Q1-Q10 + complete | `waioWorkflowQuestions`, `waioStageConfig`, `waioObjectiveWeights`, scenario variant functions |
| `waioScenarioContext.js` | WAIO scenario data | `waioShift`, `waioEquipment`, `waioConstraints` |
| `waioAgents.js` | 9 agents | `WAIO_AGENT_CONFIG`, `WAIO_CURATED_RESPONSES`, `WAIO_HUDDLE_LANES` |
| `waioNotifications.js` | WAIO alerts | `waioNotifications` |
| `waioPublishTargets.js` | Integration systems | `publishTargets`, `publishPayloads` |

### 11.3 Ontology Data Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `p2cOntologySchema.js` | Entity/relationship types | `entityTypes`, `relationshipTypes`, `ENTITY_COLORS` |
| `p2cInstanceGraph.js` | Graph nodes/edges | `p2cGraphNodes`, `p2cGraphEdges`, `highlightPaths`, utility functions |
| `p2cLineageGraph.js` | System lineage | `lineageSystems`, `lineageEdges`, `lineagePaths` |
| `p2cDecisionGraph.js` | Decision traces | `agentRuns`, `toolCalls`, `recommendations` |

### 11.4 Scenario Data Structure

```javascript
export const scenarioContext = {
  currentScenario: { id, title, description, date },
  workOrder: { number, status, type, priority, scheduling },
  equipment: { id, name, specs, efficiency, status },
  sensorData: { current, historical, thresholds },
  activeAlarms: [{ id, severity, message, timestamp }],
  linerDetails: { thickness, zones, wearRate },
  rootCauseAnalysis: { modes, probabilities, evidence },
  reliabilityMetrics: { weibull, mtbf, mttr, rpn },
  analysis: { findings, recommendations },
  agents: { contributions, toolCalls },
  parts: { inventory, leadTimes },
  labor: { crews, assignments },
  maintenanceHistory: [{ date, type, duration }],
  safety: { requirements, permits },
  operations: { production, schedule },
  recommendations: { immediate, nearTerm, longTerm },
  keyDates: { important dates for timeline },
  availableTools: [{ id, name, description }],
};
```

---

## 12. API Reference

### 12.1 Agent Query API

**Endpoint:** `POST /api/cerebra-agent`

```typescript
// Request
{
  agentId: string;
  query: string;
  conversationHistory?: Message[];
  useCache?: boolean;
}

// Response
{
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  usage: { prompt_tokens: number; completion_tokens: number };
  cached?: boolean;
}
```

### 12.2 Agent List API

**Endpoint:** `GET /api/cerebra-agent`

```typescript
// Response
{
  agents: Array<{ id: string; name: string }>;
  context: MiningContext;
}
```

### 12.3 Chat API

**Endpoint:** `POST /api/cerebra-agent/chat`

```typescript
// Request
{
  message: string;
  sessionId: string;
}

// Response
{
  message: string;
  timestamp: string;
}
```

### 12.4 API Configuration

```javascript
// In route.js
const AGENT_PROMPTS = {
  AGENT_ID: {
    name: 'Agent Full Name',
    systemPrompt: `You are an expert ${domain} Agent...
      - Capability 1
      - Capability 2
      - Response format instructions`,
  },
};

// Response caching: 1 hour TTL
// Model: GPT-4o-mini
// Context injection: Domain-specific mining context
```

---

## 13. Maintenance Mode Implementation

### 13.1 Scenario Overview

**Domain:** Copper Mining  
**Equipment Focus:** Metso C160 Primary Jaw Crusher  
**Issue:** 7% efficiency drop (89% → 82%)  
**Root Cause:** Liner wear degradation

### 13.2 Key Data Points

| Metric | Value |
|--------|-------|
| Equipment ID | CRUSHER-101 |
| Current Efficiency | 82% |
| Target Efficiency | 89% |
| Operating Hours | 48,250 |
| Health Score | 68% |
| Production Loss | $47,500/day |
| Liner Remaining | 65% (Zone B critical) |
| Failure Probability (7 days) | 38% |
| RPN | 432 (S:8 × O:6 × D:9) |

### 13.3 Fault Tree Options

1. **Liner Wear Degradation** - 85% probability (Primary)
2. **Hard Ore Feed Composition** - 75% probability
3. **Pitman Bearing Degradation** - 60% probability
4. **Drive Motor Overload** - 40% probability

### 13.4 Work Order Output

| Field | Value |
|-------|-------|
| WO Number | 4000000147 |
| Status | REL (Released) |
| Type | PM02 - Corrective Maintenance |
| Priority | 1 - Very High |
| Scheduled Start | 2025-01-20 06:00 |
| Duration | 8 hours |
| Estimated Cost | $20,174.00 |

### 13.5 Maintenance Mode KPIs

- Run of Mine (ROM): ~145,000 t/day
- Ore Processed: ~125,000 t/day
- Copper Produced: ~625 t/day
- Production Loss: ~6,000 t/day (alert)

---

## 14. Pit-to-Port Mode Implementation

### 14.1 Scenario Overview

**Domain:** Western Australia Iron Ore (WAIO)  
**Focus:** Shift Planning & Grade Optimization  
**Issue:** Train-07 under-spec risk (Fe 61.2% vs spec ≥62.0%)  
**Impact:** $740k penalty exposure

### 14.2 Scenario Variants

The system supports rotating scenarios for varied demos:

| Variant | Train | Risk | Alert |
|---------|-------|------|-------|
| Variant A | Train-07 | Grade under-spec | train 07 exception |
| Variant B | Train-04 | Stockpile drift | train 4 departure issue |
| Default | Train-07 | Grade under-spec | train 07 exception |

### 14.3 Key Data Points

| Metric | Value |
|--------|-------|
| Shift | SHIFT-2025-01-15-DAY |
| Fe Forecast | 61.2% |
| Fe Spec | ≥62.0% |
| Under-spec Probability | 62% |
| Penalty Exposure | $740,000 |
| Data Confidence | 0.78 |
| Recommended Plan | Option B (Balanced) |
| Compliance Probability | 82% |

### 14.4 Plan Options

| Option | Compliance | Throughput | Risk |
|--------|------------|------------|------|
| Option A (Conservative) | 92% | 142kt | Low |
| Option B (Balanced) | 82% | 151kt | Medium |
| Option C (Aggressive) | 58% | 165kt | High |

### 14.5 Pit-to-Port Mode KPIs

- Fe Grade: ~61.2%
- Throughput: ~485,000 t/day
- Trains Today: 5
- Port Stock: 2.4 Mt

### 14.6 Closed-Loop Planning Flow

```
Shift Execution → End-of-Shift Reconciliation
                         ↓
               Plan vs Actual Analysis
                         ↓
              Pattern Detection (3/5 shifts)
                         ↓
            7/30/90-Day Plan Adjustments
                         ↓
       Publish to Deswik, Vulcan, Dispatch, SCADA, LIMS
                         ↓
              Closed-Loop Complete ✓
```

### 14.7 Integration Systems Simulated

| System | Purpose | Payload |
|--------|---------|---------|
| Deswik | Mine scheduling | 7-Day schedule XML |
| Vulcan | Block model | Grade adjustment factors |
| Minestar/Jigsaw | Dispatch | Truck assignments |
| SCADA (OSIsoft/Aveva) | Process control | Setpoint recommendations |
| LIMS | Laboratory | Sample priorities |
| Snowden/MTM | Reconciliation | Deviation tags |

---

## 15. Extension Framework

### 15.1 Creating a New Demo Scenario

Follow this checklist to add a new domain:

#### Step 1: Define Domain Mode

```javascript
// domains/domainModes.js
export const DOMAIN_MODE_IDS = {
  ...existing,
  NEW_DOMAIN: 'newDomain',
};

DOMAIN_MODES[DOMAIN_MODE_IDS.NEW_DOMAIN] = {
  id: 'newDomain',
  label: 'New Domain Name',
  shortLabel: 'ND',
  description: 'Description',
  icon: 'icon-name',
  headerTitle: 'Command Center Title',
  analysisTitle: 'Analysis Title',
  imports: { /* dynamic imports */ },
};
```

#### Step 2: Create Data Directory

```
data/newDomain/
├── workflowQuestions.js    # Q1-Qn definitions
├── scenarioContext.js      # Master data
├── agents.js               # Agent configurations
├── notifications.js        # Alert data
└── (optional) ontology/    # If graph required
```

#### Step 3: Define Agents

```javascript
// data/newDomain/agents.js
export const NEW_DOMAIN_AGENTS = {
  AG1: { id: 'AG1', name: 'Agent 1', color: '#HEX', role: '...', steps: [...] },
  AG2: { id: 'AG2', name: 'Agent 2', color: '#HEX', role: '...', steps: [...] },
};

export const CURATED_RESPONSES = {
  AG1: { content: '...', isAI: true },
  AG2: { content: '...', isAI: true },
};
```

#### Step 4: Define Workflow

```javascript
// data/newDomain/workflowQuestions.js
export const workflowQuestions = {
  nd_q1: { id: 'nd_q1', text: '...', options: [...], triggersOutput: '...' },
  nd_q2: { id: 'nd_q2', text: '...', options: [...], triggersOutput: '...' },
};

export const stageConfig = {
  stage_name: { autoComplete: false, component: 'StageComponent' },
};
```

#### Step 5: Create Output Stage Components

```
components/outputStages/newDomain/
├── index.js                 # Barrel export
├── NDStage1.js              # First stage
├── NDStage2.js              # Second stage
└── NDStageN.js              # Additional stages
```

#### Step 6: Create Domain-Specific Components

```
components/newDomain/
├── index.js                 # Barrel export
├── NDKPIStrip.js            # KPI header
├── NDPDFDocument.js         # PDF template
└── (other components)
```

#### Step 7: Update page.js

Add domain-specific logic to `handleAnswer()` and `handleStageComplete()` functions.

### 15.2 Reusing Existing Patterns

#### Trusted Huddle Pattern

```javascript
// Reuse HuddleBanner.js with domain-specific agents
<HuddleBanner
  agents={['AG1', 'AG2', 'AG3']}
  activeAgent={activeAgent}
  isComplete={isHuddleComplete}
  activatedAgents={activatedAgents}
  showOrchestrator={true}
  orchestratorPhase={orchestratorPhase}
/>
```

#### PDF Generation Pattern

```javascript
// Extend existing PDF template
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Reuse style patterns from WorkOrderPDF.js or ShiftBriefPDF.js
const styles = StyleSheet.create({
  // Copy core styles: page, header, logo, sectionTitle, row, label, value
  // Add domain-specific styles
});
```

#### Ontology Graph Pattern

```javascript
// Create domain ontology data
// data/newDomain/ontology/
//   ├── index.js
//   ├── schemaDefinition.js
//   ├── instanceGraph.js
//   └── lineageGraph.js

// Reuse P2COntologyGraphModal.js patterns
// Update imports and data sources
```

#### Chart Components Pattern

```javascript
// Reuse existing Nivo chart patterns
import dynamic from 'next/dynamic';

const ResponsiveBar = dynamic(
  () => import('@nivo/bar').then(m => m.ResponsiveBar),
  { ssr: false }
);

// Apply standard chartTheme
// Customize colors for domain
```

---

## 16. Reusable Patterns Catalog

### 16.1 Trusted Huddle Pattern

**Purpose:** Visual orchestration of multiple AI agents working in concert

**Key Files:**
- `components/HuddleBanner.js` - Status banner
- `hooks/useDynamicAgents.js` - Agent response management
- `data/*/agents.js` - Agent configurations

**Implementation:**
1. Define agent configurations with steps
2. Use `runHuddleWorkflow()` to execute sequentially
3. Display progress with HuddleBanner
4. Show tool calls and findings per agent

### 16.2 Parallel Constraint Engine Pattern

**Purpose:** Show multiple agents analyzing constraints in parallel lanes

**Key Files:**
- `components/waio/ConstraintLaneBoard.js`
- `components/outputStages/waio/WAIOParallelHuddleStage.js`

**Implementation:**
1. Define lanes with agent assignments
2. Render agents working simultaneously
3. Show progress indicators per lane
4. Consolidate findings into summary

### 16.3 Branded PDF Generation Pattern

**Purpose:** Generate professional, Accenture-branded documents

**Key Files:**
- `components/WorkOrderPDF.js`
- `components/waio/ShiftBriefPDF.js`

**Template Structure:**
1. Header with Accenture logo
2. Document ID and status badge
3. Sections with purple headers
4. Tables with alternating rows
5. Signature/approval footer

### 16.4 Ontology Graph Pattern

**Purpose:** Neo4j-style interactive graph exploration

**Key Files:**
- `components/visualizations/P2COntologyGraphModal.js`
- `data/waio/ontology/*.js`

**Features:**
- Multi-tab exploration (Ontology, Instance, Lineage, Decision)
- Impact analysis (upstream/downstream)
- Type and relationship filters
- Path finding between nodes
- Confidence indicators
- Pan and zoom navigation

### 16.5 Workflow Question Pattern

**Purpose:** Guided conversation flow with branching logic

**Key Files:**
- `data/workflowQuestions.js`
- `data/waio/waioWorkflowQuestions.js`
- `components/ConversationPanel.js`

**Question Structure:**
```javascript
{
  id: 'question_id',
  text: 'Question text',
  options: [{ id: 'opt1', label: 'Option label' }],
  nextQuestion: { opt1: 'next_q', opt2: 'end' },
  triggersOutput: 'stage_name',
  isDynamic: false,
  allowChat: false,
}
```

### 16.6 Processing Delay Pattern

**Purpose:** Simulate AI inference and data processing

**Implementation:**
```javascript
const setOutputStageWithDelay = useCallback((stage, delay = 800) => {
  setIsProcessingStage(true);
  setOutputStage(null);
  setTimeout(() => {
    setOutputStage(stage);
    setIsProcessingStage(false);
  }, delay + Math.random() * 400);
}, []);
```

### 16.7 Notification/Alert Pattern

**Purpose:** Display actionable alerts tied to workflow

**Key Files:**
- `components/NotificationPanel.js`
- `data/miningData.js` (notifications)
- `data/waio/waioNotifications.js`

**Alert Structure:**
```javascript
{
  id: 'alert-id',
  title: 'Alert Title',
  message: 'Alert description',
  severity: 'critical' | 'warning' | 'info',
  timestamp: 'ISO date string',
  equipment: 'EQUIPMENT-ID',
  actionable: true,
}
```

---

## 17. Testing Strategy

### 17.1 Static Validation

**Script:** `scripts/test-closed-loop.mjs`

**Tests:**
- Data integrity checks
- Import verification
- Component structure validation
- 38 automated tests

### 17.2 Integration Tests

**File:** `__tests__/waio-integration.test.js`

**Coverage:**
- Workflow transitions
- Agent response handling
- State management
- Output stage rendering

### 17.3 Manual Testing Checklist

- [ ] Login flow works
- [ ] Domain mode switching resets state
- [ ] All workflow questions display correctly
- [ ] Agent huddle executes in sequence
- [ ] Charts render without errors
- [ ] PDF generation works
- [ ] Graph modal opens and navigates
- [ ] Chatbot responds appropriately
- [ ] No console errors during demo flow

---

## Appendices

### Appendix A: File Line Counts

| File | Lines |
|------|-------|
| `page.js` | ~680 |
| `ConversationPanel.js` | ~1,470 |
| `OutputConsole.js` | ~1,350 |
| `MiningProcessFlowDiagram.js` | ~1,050 |
| `P2COntologyGraphModal.js` | ~2,200 |
| `cerebra.css` | ~714 |
| `scenarioContext.js` | ~580 |
| `waioWorkflowQuestions.js` | ~400 |
| `ShiftBriefPDF.js` | ~664 |
| `WorkOrderPDF.js` | ~497 |

### Appendix B: Demo Timing Guide

| Section | Maintenance | Pit-to-Port |
|---------|-------------|-------------|
| Login | 0:30 | 0:30 |
| Digital Twin Overview | 2:00 | 2:00 |
| Initial Analysis | 3:00 | 3:00 |
| Agent Huddle | 4:00 | 5:00 |
| Recommendations | 2:00 | 3:00 |
| Output Generation | 2:00 | 3:00 |
| Closed-Loop (P2P only) | - | 4:00 |
| Chatbot Demo | 2:00 | 2:00 |
| **Total** | **~15 min** | **~22 min** |

### Appendix C: Color Quick Reference

```
Accenture Purple:  #A100FF
Azure Blue:        #0078D4
Dark Background:   #1A1A2E
Success Green:     #10B981
Warning Yellow:    #F59E0B
Error Red:         #EF4444
Text Primary:      #1A1A2E
Text Secondary:    #4B5563
Text Muted:        #9CA3AF
Border Light:      #E2E8F0
Background Light:  #FAFAFA
```

### Appendix D: Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Esc` | Close modals |
| `Enter` | Submit chat message |
| `Scroll` | Zoom graph (when focused) |
| `Drag` | Pan graph (when focused) |
| `Right-click` | Context menu on graph nodes |

---

*Document Version: 2.2.0*  
*Last Updated: January 2026*  
*Cerebra Demo Platform - Accenture Mining Operations AI*
