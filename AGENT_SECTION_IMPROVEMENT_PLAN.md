# Agent Section Improvement Plan - Cerebra Demo

## Executive Summary
This plan addresses comprehensive improvements to the agent section including visual enhancements, chart integrations, and chatbot capabilities.

---

## SECTION 1: First Question Response - Agentic Network Display

### Problem
When Q1 is answered ("Yes, analyze efficiency drop"), the Output Console shows "Waiting for your input..." with no content.

### Solution
Display an **"Available Agent Network"** visualization showing all agents ready to assist.

### Implementation

**File:** `src/app/cerebra-demo/components/OutputConsole.js`

**New Component:** `AgentNetworkDisplay.js`

```
┌─────────────────────────────────────────────────────────────────┐
│                    🧠 CEREBRA AGENT NETWORK                      │
│                    Available to Support Analysis                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│         ┌─────┐                                                  │
│         │ CA  │ ← Cerebra Orchestrator                          │
│         └──┬──┘                                                  │
│      ┌─────┼─────┬─────┬─────┬─────┐                           │
│      ▼     ▼     ▼     ▼     ▼     ▼                           │
│   ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐                        │
│   │ RD ││ TA ││ MI ││ IL ││ LD ││ RO │                        │
│   └────┘└────┘└────┘└────┘└────┘└────┘                        │
│                                                                  │
│   RD - Root Cause Diagnostics    IL - Inventory & Logistics     │
│   TA - Timeseries Analysis       LD - Liner Diagnostics         │
│   MI - Maintenance Intelligence  RO - Resource Orchestration    │
│                                                                  │
│   Status: STANDBY │ Awaiting analysis parameters                 │
└─────────────────────────────────────────────────────────────────┘
```

**Visual Treatment:**
- Animated connection lines (pulsing)
- Each agent badge shows: initials, name, specialty
- Status indicators (gray = standby, green = active)
- Appears after Q1 is answered with "Yes"

**Tasks:**
- [ ] Create `AgentNetworkDisplay.js` component
- [ ] Add SVG-based network visualization with animation
- [ ] Integrate into OutputConsole for `stage === 'agent_network'`
- [ ] Trigger display when Q1 answer is "yes"

---

## SECTION 2: Huddle Agent Improvements

### 2a. Resource Orchestration Agent (RO)

**Current Issues:**
- Light blue box filling on AI-Enhanced Analysis
- Text-heavy output

**Solutions:**

1. **Remove blue background** from AI-Enhanced Analysis boxes
2. **Add NIVO TimeRange Chart** for:
   - Last liner replacement date (4 months ago)
   - Crew availability windows
   - Scheduled maintenance shutdown

**Chart Implementation:**
```javascript
// TimeRange or Calendar showing:
// - Historical: Last replacement event
// - Current: Today marker
// - Future: Crew availability + scheduled shutdown
```

**Alternative: NIVO Sankey for Personnel Flow**
```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│ Available    │────▶│ Team A      │────▶│ Primary      │
│ Technicians  │     │ (4 fitters) │     │ Crusher Job  │
└──────────────┘     └─────────────┘     └──────────────┘
       │             ┌─────────────┐
       └────────────▶│ Team B      │────▶ Other Jobs
                     │ (Reserved)  │
                     └─────────────┘
```

**Tasks:**
- [ ] Remove `background: 'rgba(219, 234, 254, 0.3)'` from AI-Enhanced boxes
- [ ] Create `PersonnelSankeyChart.js` using @nivo/sankey
- [ ] Create `MaintenanceTimeRange.js` using @nivo/calendar or custom timeline
- [ ] Structure data: technicians → teams → job assignments

---

### 2b. Timeseries Analysis Agent (TA)

**Current Issues:**
- Long text in AI-Enhanced Analysis
- Blue box filling
- Could benefit from Stream chart

**Solutions:**

1. **Add NIVO Stream Chart** showing:
   - Efficiency trends over time
   - Multiple metrics stacked (vibration, temperature, efficiency)
   
2. **Shorten text** - bullet points, not paragraphs

**Stream Chart Data Structure:**
```javascript
const streamData = [
  { period: "Week 1", efficiency: 89, vibration: 12, temperature: 45 },
  { period: "Week 2", efficiency: 87, vibration: 15, temperature: 48 },
  { period: "Week 3", efficiency: 85, vibration: 18, temperature: 52 },
  { period: "Week 4", efficiency: 82, vibration: 22, temperature: 58 },
];
```

**Text Restructure:**
```
BEFORE: "The efficiency trend shows a consistent decline from 89% to 82% 
over the past 4 weeks, with acceleration in the degradation rate during 
the final week suggesting liner wear approaching critical threshold."

AFTER:
• 7% efficiency decline over 4 weeks
• Degradation accelerating in week 4
• Liner wear approaching critical threshold
```

**Tasks:**
- [ ] Create `EfficiencyStreamChart.js` using @nivo/stream
- [ ] Remove blue background from AI boxes
- [ ] Restructure text to bullet points (max 3-4 bullets)
- [ ] Add chart above text insights

---

### 2c. Maintenance Intelligence Agent (MI)

**Current Issues:**
- Text-heavy output
- No reliability engineering visualizations

**Solutions:**

1. **Add Weibull Analysis Chart** (reliability curve)
   - Shows failure probability over time
   - Indicates current position on curve
   
2. **Add NIVO AreaBump Chart** for:
   - Ranking of failure modes over time
   - Shows which issues are trending up/down

**Weibull Chart Concept:**
```
Failure Probability
     │
 1.0 │                    ╭────────
     │                 ╭──╯
     │              ╭──╯
     │           ╭──╯
     │        ╭──╯
 0.5 │     ╭──╯
     │   ╭─╯ ← Current Position (β=2.1, η=6mo)
     │  ╱
     │ ╱
 0.0 │╱
     └────────────────────────────▶ Time (months)
```

**AreaBump for Failure Mode Ranking:**
```javascript
const failureModeData = [
  { id: "Liner Wear", data: [
    { x: "Jan", y: 3 }, { x: "Feb", y: 2 }, { x: "Mar", y: 1 }, { x: "Apr", y: 1 }
  ]},
  { id: "Bearing Fault", data: [...] },
  { id: "Motor Issues", data: [...] },
];
```

**Tasks:**
- [ ] Create `WeibullChart.js` - custom SVG or use @nivo/line with custom styling
- [ ] Create `FailureModeAreaBump.js` using @nivo/bump
- [ ] Shorten and restructure AI-Enhanced text
- [ ] Remove blue background

---

### 2d. Inventory & Logistics Agent (IL)

**Current Issues:**
- Text-heavy
- No visualization

**Solutions:**

1. **Add Inventory Visualization** - could be:
   - NIVO Bar chart showing stock levels by part
   - Custom "warehouse location" visual
   - Parts availability timeline

**Inventory Bar Chart Concept:**
```
Part Availability
┌────────────────────────────────────────┐
│ Liner Segment A  ████████████ 12 units │
│ Liner Segment B  ████████     8 units  │
│ Wear Plate       ██████       6 units  │
│ Bolts M24        ████████████████ 150  │
│ Hydraulic Seal   ████         4 units  │
└────────────────────────────────────────┘
        Required ◆  Available ■
```

**Tasks:**
- [ ] Create `InventoryBarChart.js` using @nivo/bar
- [ ] Show required vs available quantities
- [ ] Add warehouse location indicator
- [ ] Restructure text to bullet points
- [ ] Remove blue background

---

### 2e. Liner Diagnostics Agent (LD)

**Current Issues:**
- AI-Enhanced Analysis formatting needs update

**Solutions:**
- Remove blue background
- Restructure text to bullets
- Keep existing WearHeatmap (already good)

**Tasks:**
- [ ] Remove blue background from AI boxes
- [ ] Shorten text to bullet format

---

### 2f. Root Cause Analysis Summary

**Current Issues:**
- "Consensus Reached" box is misleading (agents are specialized, not voting)
- "Agent Contribution Analysis" is irrelevant
- Missing proper probabilistic metrics

**Solutions:**

1. **Remove "Consensus Reached"** messaging
2. **Replace with NIVO Icicle Chart** showing:
   - Top level: Cerebra Orchestrator
   - Second level: All agents
   - Third level: Specific contributions from each agent

3. **Add proper probabilistic metrics:**
   - Confidence intervals
   - RPN (Risk Priority Number)
   - Probability of failure
   - Time to failure estimate

**Icicle Chart Structure:**
```
┌─────────────────────────────────────────────────────────────────┐
│                     CEREBRA ORCHESTRATOR                         │
├────────────┬────────────┬────────────┬────────────┬─────────────┤
│     RD     │     TA     │     MI     │     IL     │     LD      │
├────────────┼────────────┼────────────┼────────────┼─────────────┤
│ Root Cause │ Efficiency │ Weibull    │ Parts      │ Wear        │
│ Analysis   │ Trends     │ Analysis   │ Inventory  │ Assessment  │
│ 87% conf.  │ -7% trend  │ β=2.1      │ 12 avail   │ 85% Zone B  │
└────────────┴────────────┴────────────┴────────────┴─────────────┘
```

**Tasks:**
- [ ] Remove "Consensus Reached" UI element
- [ ] Remove "Agent Contribution Analysis" section
- [ ] Create `AgentContributionIcicle.js` using @nivo/icicle
- [ ] Add probabilistic summary section with RPN, confidence, TTF

---

## SECTION 3: Outside Huddle Improvements

### 3a. Work Order Agent - Status Lifecycle

**Current Issues:**
- Instant generation, no feedback
- Status remains "Draft"

**Solutions:**

1. **Add 2-second processing delay** with animation
2. **Show status transition:**
   - CRTD (Created) → Initial
   - REL (Released) → After generation confirmed
3. **Confirm WO number** with visual feedback

**SAP PM Work Order Status Lifecycle (Standard):**
```
CRTD ──▶ REL ──▶ PCNF ──▶ CNF ──▶ TECO ──▶ CLSD
(Created) (Released) (Partial) (Confirmed) (Tech Complete) (Closed)
```

**UI Flow:**
```
[Generate Work Order] 
         │
         ▼ (2 sec delay with spinner)
┌─────────────────────────────────────┐
│ ✓ Work Order Generated              │
│                                      │
│   WO Number: 4000012847              │
│   Status: CRTD → REL (Released)     │
│   Equipment: CRUSHER-001             │
│   Priority: 1 - Emergency            │
│   Scheduled: 2024-12-09 06:00        │
└─────────────────────────────────────┘
```

**Tasks:**
- [ ] Add loading state with 2-second delay
- [ ] Show status transition animation (CRTD → REL)
- [ ] Display confirmed WO number prominently
- [ ] Add visual confirmation badge

---

### 3b. SAP PM Work Order - S/4HANA Standard Fields

**Research Results - SAP S/4HANA PM Standard Fields:**

**Header Data:**
| Field | SAP Field Name | Example Value |
|-------|---------------|---------------|
| Order Number | AUFNR | 4000012847 |
| Order Type | AUART | PM01 (Corrective) |
| Description | KTEXT | Liner Replacement - Primary Crusher |
| Priority | PRIOK | 1 (Emergency) |
| System Status | SSTAT | REL (Released) |
| User Status | ASTNR | APPR (Approved) |

**Organizational Data:**
| Field | SAP Field Name | Example Value |
|-------|---------------|---------------|
| Planning Plant | IWERK | 1000 |
| Work Center | ARBPL | MECH-01 |
| Business Area | GSBER | 1000 |
| Cost Center | KOSTL | CC-MAINT-01 |

**Object Data:**
| Field | SAP Field Name | Example Value |
|-------|---------------|---------------|
| Functional Location | TPLNR | MINE-CRUSH-PRI-001 |
| Equipment | EQUNR | CRUSHER-001 |
| Assembly | BAUGRUPPE | CRU-LINER-ASM |

**Dates:**
| Field | SAP Field Name | Example Value |
|-------|---------------|---------------|
| Basic Start Date | GSTRP | 2024-12-09 |
| Basic Finish Date | GLTRP | 2024-12-10 |
| Scheduled Start | SSAVD | 2024-12-09 06:00 |
| Scheduled Finish | SSEDD | 2024-12-10 18:00 |

**Operations (AFVC):**
| Operation | Work Center | Duration | Description |
|-----------|-------------|----------|-------------|
| 0010 | MECH-01 | 2.0 HR | Isolate & LOTO |
| 0020 | MECH-01 | 4.0 HR | Remove worn liners |
| 0030 | MECH-01 | 6.0 HR | Install new liners |
| 0040 | MECH-01 | 2.0 HR | Torque & alignment |
| 0050 | ELEC-01 | 1.0 HR | Test & commission |

**Components (RESB):**
| Item | Material | Qty | Unit | Storage |
|------|----------|-----|------|---------|
| 0010 | MAT-LIN-001 | 12 | EA | W001-C47 |
| 0020 | MAT-BLT-024 | 48 | EA | W001-B12 |
| 0030 | MAT-HYD-SL | 4 | EA | W002-H08 |

**Tasks:**
- [ ] Update `workOrderData.js` with SAP S/4HANA field names
- [ ] Update `WorkOrderPDF.js` to match SAP PM01 format
- [ ] Add SAP standard status codes
- [ ] Include Settlement Rule section
- [ ] Add Notification link field

---

## SECTION 4: Chatbot Enhancement

### Current Issues
- No context from demo
- Cannot invoke agents
- Cannot show tool calls
- No access to scenario knowledge

### Solution Architecture

**New Components:**
1. `EnhancedChatbot.js` - Main chatbot with tool invocation
2. `ChatToolCall.js` - Visual display of tool calls (like Claude)
3. `chatbotContext.js` - Scenario knowledge store

**Context Store Structure:**
```javascript
const scenarioContext = {
  equipment: {
    id: "CRUSHER-001",
    name: "Primary Crusher",
    currentEfficiency: 82,
    targetEfficiency: 89,
  },
  analysis: {
    rootCause: "Liner wear degradation Zone B",
    confidence: 87,
    riskPriority: 432,
  },
  workOrder: {
    number: "4000012847",
    status: "REL",
    scheduledDate: "2024-12-09",
    technician: "James Morrison",
  },
  agents: {
    available: ["RD", "TA", "MI", "IL", "LD", "RO"],
    lastActive: "RD",
  },
  inventory: {
    linerSegments: 12,
    bolts: 150,
    location: "W001-BIN-C47",
  }
};
```

**Tool Call Display (Claude-style):**
```
┌─────────────────────────────────────────────────────────────┐
│ 🔧 Invoking Tool: sap_pm_query                              │
│    Parameters:                                              │
│    • equipment: CRUSHER-001                                 │
│    • query_type: work_order_status                          │
├─────────────────────────────────────────────────────────────┤
│ ✓ Result:                                                   │
│   Work Order: 4000012847                                    │
│   Status: REL (Released)                                    │
│   Scheduled: 2024-12-09 06:00                               │
└─────────────────────────────────────────────────────────────┘
```

**Agent Invocation Display:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 Invoking Agent: Timeseries Analysis Agent                │
│    Request: Get latest efficiency trends                     │
├─────────────────────────────────────────────────────────────┤
│ Agent Response:                                             │
│ [Efficiency chart updates in Output Console]                │
└─────────────────────────────────────────────────────────────┘
```

**Chatbot Capabilities:**
1. **Knowledge Queries:**
   - "What's the work order number?" → Returns 4000012847
   - "Who is assigned?" → Returns James Morrison
   - "What's the root cause?" → Returns liner wear analysis

2. **Agent Invocation:**
   - "Check latest timeseries" → Invokes TA agent, updates Output Console
   - "Verify inventory" → Invokes IL agent
   - "Get crew availability" → Invokes RO agent

3. **Tool Calls:**
   - "Query SAP for work order status" → Shows tool call UI
   - "Check maintenance history" → Shows sap_pm_query execution

**Tasks:**
- [ ] Create `scenarioContext.js` - Central knowledge store
- [ ] Create `ChatToolCall.js` - Tool call display component
- [ ] Enhance `ConversationPanel.js` with:
  - Context awareness
  - Tool call rendering
  - Agent invocation capability
- [ ] Create `chatbotActions.js` - Action handlers for queries
- [ ] Connect chatbot to Output Console for live updates
- [ ] Add typing indicators and processing states

---

## Implementation Priority Order

### Phase 1: Quick Wins (2-3 hours)
1. Remove blue backgrounds from all AI-Enhanced Analysis boxes
2. Restructure text to bullet points across all agents
3. Add Agent Network Display for Q1

### Phase 2: Charts Integration (4-5 hours)
1. NIVO Stream chart for TA agent
2. Weibull/AreaBump for MI agent
3. Sankey for RO agent (personnel flow)
4. Inventory Bar chart for IL agent
5. Icicle chart for RCA Summary

### Phase 3: Work Order Enhancement (2 hours)
1. Update SAP field names to S/4HANA standard
2. Add status lifecycle (CRTD → REL)
3. Add 2-second delay with confirmation

### Phase 4: Chatbot Enhancement (4-5 hours)
1. Create context store
2. Add tool call display
3. Implement agent invocation
4. Connect to Output Console

---

## Files to Create/Modify

### New Files:
```
src/app/cerebra-demo/components/
├── AgentNetworkDisplay.js          # Q1 response visualization
├── charts/
│   ├── PersonnelSankeyChart.js     # RO agent
│   ├── EfficiencyStreamChart.js    # TA agent  
│   ├── WeibullChart.js             # MI agent
│   ├── FailureModeAreaBump.js      # MI agent
│   ├── InventoryBarChart.js        # IL agent
│   └── AgentContributionIcicle.js  # RCA Summary
├── ChatToolCall.js                 # Chatbot tool display
└── data/
    └── scenarioContext.js          # Chatbot knowledge store
```

### Modified Files:
```
src/app/cerebra-demo/components/
├── OutputConsole.js                # Integrate new charts, remove blue boxes
├── ConversationPanel.js            # Enhanced chatbot
├── WorkOrderPDF.js                 # SAP S/4HANA fields
└── data/
    └── workOrderData.js            # Updated field names
```

---

## Success Criteria

- [ ] Q1 answer shows agent network visualization
- [ ] All AI-Enhanced Analysis boxes have no blue background
- [ ] All agent text is bullet-point format (max 4 bullets)
- [ ] RO agent has Sankey or TimeRange chart
- [ ] TA agent has Stream chart
- [ ] MI agent has Weibull + AreaBump charts
- [ ] IL agent has Inventory bar chart
- [ ] RCA Summary has Icicle chart (no "consensus" messaging)
- [ ] Work order shows CRTD → REL status transition
- [ ] SAP fields match S/4HANA standard
- [ ] Chatbot can answer context questions
- [ ] Chatbot shows tool calls visually
- [ ] Chatbot can invoke agents and update Output Console

