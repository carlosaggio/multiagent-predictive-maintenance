# Cerebra Demo - Complete Revamp Plan (Detailed)

## Critical Issues to Fix

### 1. CONVERSATION PANEL NOT DRIVING OUTPUT CONSOLE (CRITICAL)
**Problem:** Output console runs automatically, ignoring conversation selections
**Root Cause:** No proper state synchronization between panels
**Impact:** Demo feels disconnected, not interactive

### 2. VISUAL DESIGN TOO BUSY AND CHEAP-LOOKING
**Problems:**
- "Azure AI Connected" badge unnecessary
- "Reset Demo" button too prominent
- Colored highlight boxes look AI-generated and cheap
- Not matching the clean, professional AIIS screenshots

### 3. MISSING VISUAL ELEMENTS FROM REFERENCE SCREENSHOTS
**Missing:**
- Charts and graphs (timeseries, thermal images)
- Detailed process flow matching Copper Mine Overview
- RCA probability ranking table (seen in screenshots 3-4)
- PDF/Document generation visual
- SAP integration indicators
- Proper equipment diagrams

### 4. POOR MULTI-AGENT VISUALIZATION
**Problems:**
- No clear step-by-step progression
- Missing SAP tool calls
- Memory updates not specific enough
- Agent handoffs not visible enough

### 5. DUPLICATING QUESTIONS BUG
**Problem:** Same question appearing multiple times in conversation panel

---

## Detailed Implementation Plan

### PHASE 1: Fix Core Architecture (Conversation → Output Flow)

#### 1.1 Redesign State Management

**Current flow (WRONG):**
```
User clicks Primary Crusher → Agents start automatically
```

**Correct flow:**
```
User clicks Primary Crusher → Navigate to Analysis
Show Question 1 → User selects "Yes" → Question 1 gets timestamp, locked
Show Question 2 → User selects "Yes" → Question 2 locked → RD Agent starts in Output Console
Show Question 3 → User selects scenario → Question 3 locked → Continue analysis based on selection
```

**Files to modify:**
- `page.js` - Add proper state coordination
- `ConversationPanel.js` - Fix question duplication, add locking mechanism
- `OutputConsole.js` - Only show content AFTER corresponding question answered

**Implementation details:**
```javascript
// State in page.js
const [workflow, setWorkflow] = useState({
  question1Answered: false,
  question2Answered: false,
  question3Answered: false,
  selectedScenario: null,
  startRDAgent: false,
  startMainAnalysis: false,
});

// In ConversationPanel
- Question 1 appears immediately
- User must click Yes/No
- On "Yes": Lock Question 1, trigger Question 2
- Question 2 appears
- On "Yes": Lock Question 2, trigger RD Agent in Output Console
- Question 3 appears
- On selection: Lock Question 3, trigger full analysis

// In OutputConsole
- Show nothing until question2Answered = true
- Show RD Agent when question2Answered = true
- Show remaining agents when question3Answered = true
```

#### 1.2 Fix Question Duplication Bug

**Current issue:** Questions being added to array multiple times

**Fix:**
- Use question index as position, not push to array
- Lock questions after selection
- Prevent re-rendering of already answered questions

---

### PHASE 2: Clean Up Visual Design (Remove Demo-Looking Elements)

#### 2.1 Header Cleanup

**Remove:**
- "Azure AI Connected" badge
- "Reset Demo" button (or make it tiny icon in corner)

**Keep:**
- Accenture logo
- Page title
- Back button (styled subtly)
- User avatar

**New header style:**
```
[accenture>]  Primary Crusher Efficiency Analysis    [small back icon]  CA Carlos Aggio
```

#### 2.2 Remove Colored Highlight Boxes

**Current (BAD):**
```html
<div style={{ background: "#f0f9ff", border: "2px solid #10B981" }}>
  Analysis Complete
  Confidence: 90%
</div>
```

**New (CLEAN):**
```html
<div style={{ borderLeft: "3px solid #10B981", paddingLeft: "12px" }}>
  Analysis Complete
  Confidence: 90%
</div>
```

- No background colors
- Simple left border accent
- Clean typography
- Match AIIS screenshots exactly

#### 2.3 Typography and Spacing

**Reference from screenshots:**
- White background
- Black text (#1a1a1a)
- Purple headers for sections
- Agent badges with proper spacing
- No excessive padding/margins

---

### PHASE 3: Add Missing Visual Elements

#### 3.1 Charts and Visualizations

**Timeseries Chart (like screenshot 3):**
- Line chart showing crusher efficiency over time
- X-axis: Days (last 30 days)
- Y-axis: Efficiency percentage
- Highlight anomaly point at day 15
- Clean, minimal design

**Implementation:**
- Create `TimeseriesChart.js` component
- Use SVG for crisp rendering
- Show when TA Agent completes
- Data: [89, 88, 87, 86, 85, 83, 82, 82] (last 8 weeks)

**Thermal/Wear Pattern Image (like screenshot 4):**
- When LD Agent runs, show wear pattern visualization
- Could be: Color-coded diagram of liner showing wear areas
- Red = heavy wear, Yellow = medium, Green = normal

**RCA Probability Table (like screenshot 4):**
- Clean table with purple header
- Columns: Rank | Possible Root Cause | Likelihood (%) | Supporting Evidence
- Already have data, just needs better styling

**PDF Document Preview (like screenshot 5):**
- When Actions Recommendation Agent completes
- Show mock PDF preview: "Conclusion Docket"
- Shows final recommendations in document format

#### 3.2 Process Flow - Copper Mine Overview

**Reference:** Screenshot 6 - "Copper Mine Overview"

**Equipment to show (LEFT TO RIGHT, TOP TO BOTTOM):**

**Section 1: MINING**
- Loading & Hauling trucks
- ROM BIN & PRIMARY CRUSHER (highlighted in RED BOX - this is the problem!)
- Secondary Crusher
- Vibrating Screen
- Stockpile Conveyor

**Section 2: CONCENTRATING**
- Stockpile
- Stacker

**Section 3: ORE BENEFICIATION**
- SAG Mill
- Feed Conveyor for Flotation Cell
- Flotation Cell
- Concentrated Ore Conveyor
- Concentrated Ore Stockpile
- Stacker

**Section 4: ORE CONCENTRATE**
- Thickener

**Section 5: TAILINGS**
- Thickener
- Tailings Dam
- Tailings Fluid Transport
- Rejects Conveyor

**Section 6: PRODUCTS**
- Dispatch Feed Conveyor
- Load Out Bin
- Ship Stackers
- Filtering

**Visual style:**
- Blue/gray equipment illustrations (isometric 3D-ish)
- Connecting lines (conveyors/pipes) in light blue
- Labels below each equipment
- RED BOX around Primary Crusher with alert indicator
- Tabs at top: "Shift Performance" | "LPO Hotspots"
- KPI cards at top showing metrics

**Implementation:**
- Create `CopperMineProcessFlow.js` component
- Use SVG or canvas
- Click on Primary Crusher (red box) → Opens analysis

---

### PHASE 4: Multi-Agent Interaction Improvements

#### 4.1 More Specific Tool Calls

**Current (VAGUE):**
```
[TOOL] retrieve_work_orders(query="primary crusher")
```

**New (SPECIFIC):**
```
[TOOL] retrieve_work_orders
  Parameters:
    - query: "primary crusher liner wear efficiency degradation"
    - database: "SAP PM Work Orders"
    - time_range: "last_18_months"
  -> Retrieved 12 work orders
  -> Similarity scores: 0.89, 0.87, 0.85...
  -> Avg completion time: 8.2 hours
```

#### 4.2 SAP Integration Visualization

**Add SAP-specific calls:**
```
[TOOL] sap_pm_query
  Connecting to SAP PM system...
  -> Authentication: SUCCESS
  -> Query: Equipment ID CRUSHER_001
  -> Retrieved: Maintenance history (24 records)
  -> Last PM date: 15/07/2024
  -> Next PM due: 15/11/2024 (OVERDUE by 2 months)
```

#### 4.3 Memory Updates with Detail

**Current (VAGUE):**
```
[MEMORY] Storing findings...
```

**New (SPECIFIC):**
```
[MEMORY UPDATE] Writing to shared context
  Key: "rd_agent_root_cause"
  Value: {
    cause: "Liner wear degradation",
    confidence: 0.87,
    supporting_evidence: [...],
    timestamp: "2025-01-15T14:32:45Z"
  }
  -> Memory updated successfully
  -> Available to downstream agents: TA, MI, IL, LD
```

#### 4.4 Agent Handoff with Context Passing

**Show what's being passed:**
```
[HANDOFF] RD Agent → TA Agent
  Passing context:
    - Root cause hypothesis: Liner wear (87% confidence)
    - Contributing factors: [Hard ore, Deferred maintenance]
    - Recommended next analysis: Timeseries correlation
  TA Agent received context successfully
```

---

### PHASE 5: Visual Element Implementation Details

#### 5.1 Timeseries Chart Component

**File:** `components/TimeseriesChart.js`

**Props:**
- data: array of {date, value} objects
- title: "Crusher Efficiency Trend"
- highlight: day 15 (anomaly point)

**Visual design:**
- Width: 100% of container
- Height: 200px
- SVG-based line chart
- Grid lines: Light gray
- Line: Orange (#E67E22)
- Anomaly marker: Red circle with label
- Axes labels: Clean, minimal
- No background color

**When to show:** Appears when TA Agent completes analysis

#### 5.2 Wear Pattern Visualization

**File:** `components/WearPatternDiagram.js`

**Design:**
- Cross-section view of crusher liner
- Color-coded zones:
  - Red: 40-65% thickness (critical wear)
  - Yellow: 66-80% thickness (moderate wear)
  - Green: 81-100% thickness (good condition)
- Measurements labeled
- Scale indicator

**When to show:** Appears when LD Agent runs diagnostic

#### 5.3 RCA Table Styling

**Clean up current table:**
- Remove all background colors from cells
- Purple header only
- Simple borders
- Left-align text
- Right-align percentages
- Bold for high-likelihood items (>80%)

#### 5.4 Conclusion Docket (PDF Preview)

**File:** `components/ConclusionDocket.js`

**Design:**
- Mock PDF viewer appearance
- Header: "PetroCore Refinery" (adapt to "Australian Copper Mine")
- Sections:
  1. Problem Statement
  2. Data Analysis & Key Observations
  3. Root Cause Analysis (RCA)
  4. Recommended Actions
- Clean document styling
- Preview size: 400px wide

**When to show:** After all agents complete, before action buttons

---

### PHASE 6: Process Flow - Copper Mine Overview

#### 6.1 Equipment SVG Assets

**Create individual SVG components for each equipment type:**

1. **TruckHauler.js** - Mining truck SVG
2. **ROMBin.js** - Storage hopper SVG  
3. **PrimaryCrusher.js** - Jaw crusher SVG (with RED ALERT variant)
4. **SecondaryCrusher.js** - Cone crusher SVG
5. **Conveyor.js** - Belt conveyor SVG
6. **SAGMill.js** - Grinding mill SVG
7. **FlotationCell.js** - Flotation tank SVG
8. **Thickener.js** - Circular thickener tank SVG
9. **TailingsDam.js** - Dam structure SVG
10. **LoadOutBin.js** - Ship loading facility SVG

**Visual style reference:**
- Isometric 3D perspective (slight angle)
- Blue-gray color palette (#5B8FA3, #7BA5B8)
- Simple, clean lines
- Recognizable equipment shapes

#### 6.2 Process Flow Layout Component

**File:** `components/CopperMineProcessFlow.js`

**Grid layout (matching screenshot 6):**
```
|------------ MINING ------------|-- CONCENTRATING --|
| Truck → ROM Bin → Crushers     | Stockpile          |
| (with RED BOX on Primary)      | Stacker            |
|--------------------------------|-------------------|

|------- ORE BENEFICIATION ------|-- ORE CONCENTRATE -|-- TAILINGS --|-- PRODUCTS --|
| SAG Mill → Flotation → Conveyor| Thickener          | Thickener    | Dispatch     |
|                                |                    | Dam          | Load Out     |
|                                |                    |              | Ship Stackers|
```

**KPI Cards at top:**
- Run of Mine (ROM): 124,500 tonnes (down arrow 7.62%)
- Ore Processed: 107,700 tonnes (down arrow 7.68%)
- Copper Produced: 510 tonnes (down arrow 7.68%)
- Estimated Production Loss: 150 tonnes (up arrow 1.34%)

**Tabs:**
- "Shift Performance" (active)
- "LPO Hotspots"

**Interaction:**
- Hover over equipment: Show tooltip with metrics
- Click Primary Crusher (red box): Navigate to Analysis view

---

### PHASE 7: Step-by-Step Agent Workflow

#### 7.1 Detailed Agent Sequences

**RD Agent (Root Cause Diagnostics):**
```
[User selects "Yes" to Question 2]
  ↓
[RD Badge appears in Output Console]
  ↓
[THINKING] Initializing root cause diagnostics... (1.5s)
  ↓
[VECTOR SEARCH] Searching maintenance database...
  Query: "primary crusher liner wear efficiency"
  -> Searching 3,240 historical records
  -> Found 12 relevant documents (avg similarity: 0.89) (2s)
  ↓
[TOOL] sap_pm_query
  Parameters:
    - equipment_id: "CRUSHER_001"  
    - record_type: "maintenance_history"
    - months: 18
  -> Retrieved 24 maintenance records
  -> Last liner replacement: 15/07/2024 (5 months ago) (2s)
  ↓
[TOOL] retrieve_manual
  Parameters:
    - query: "crusher liner maintenance SOP"
    - manual_type: "OEM_procedures"
  -> Retrieved 3 procedure documents
  -> Expected lifecycle: 4 months (1.5s)
  ↓
[THINKING] Correlating efficiency degradation with maintenance patterns... (2.5s)
  ↓
[ANALYSIS] Pattern identified:
  - Efficiency drop: 7% over 30 days
  - Liner age: 5 months (25% over lifecycle)
  - Correlation coefficient: 0.92
  - Root cause: PRIMARY CRUSHER LINER WEAR
  - Severity: HIGH (1.2s)
  ↓
[MEMORY UPDATE] Storing analysis in shared context
  Collection: "agent_shared_memory"
  Document ID: "rd_analysis_20250115_143245"
  Fields written:
    - root_cause: "liner_wear_degradation"
    - confidence: 0.87
    - evidence: [...]
    - next_recommended_agent: "ta"
  -> Write successful (0.8s)
  ↓
[COMPLETE] RD Agent finished
  Confidence: 87% | Elapsed: 12.0s
```

**Total RD Agent time:** ~12 seconds

#### 7.2 Agent Handoff Protocol

**After RD completes:**
```
[HANDOFF ANIMATION] (1.5s)
  Visual: Purple arrow from RD → TA
  Message: "RD Agent completed. Sharing root cause hypothesis with TA Agent..."
  
  Context being transferred:
    ✓ Root cause: Liner wear degradation
    ✓ Confidence level: 87%
    ✓ Supporting evidence: 12 work orders analyzed
    ✓ Recommended action: Verify with timeseries correlation
```

**Then TA starts:**
```
[TA Badge appears]
[RETRIEVE] Accessing RD Agent findings from shared memory...
  -> Retrieved: root_cause = "liner_wear_degradation"
  -> Retrieved: confidence = 0.87
  -> Context loaded successfully (1s)
  ↓
[THINKING] Analyzing timeseries data to validate hypothesis... (1.8s)
  ↓
[TOOL] query_timeseries_db
  Parameters:
    - equipment: "primary_crusher"
    - metric: "efficiency_percentage"
    - range: "last_30_days"
    - granularity: "daily"
  -> Retrieved 720 data points
  -> Time range: 2024-12-15 to 2025-01-15 (2s)
  ↓
[THINKING] Identifying anomaly patterns and correlations... (2s)
  ↓
[DISPLAY] Timeseries Chart Rendering... (0.5s)
  [Chart appears showing efficiency drop]
  ↓
[ANALYSIS] Key findings:
  - Baseline efficiency: 89% (Days 1-15)
  - Sharp drop at Day 15: -3% sudden decline
  - Gradual decline Days 15-30: 85% → 82%
  - Vibration correlation: 0.85
  - VALIDATES RD hypothesis with 92% confidence (1.2s)
  ↓
[MEMORY UPDATE] Storing timeseries validation
  -> Updated shared context with temporal evidence
  -> Flagged: Day 15 anomaly for further investigation (0.8s)
  ↓
[COMPLETE] TA Agent finished
  Confidence: 92% | Elapsed: 10.3s
```

#### 7.3 Visual Displays for Each Agent

| Agent | Visual Element | Description |
|-------|---------------|-------------|
| RD | None (text only) | Focus on tool calls and SAP data |
| TA | Timeseries Chart | Line chart showing efficiency trend |
| MI | Inspection Table | 2 rows: inspection dates and findings |
| IL | Inventory Checklist | Parts list with [OK] checkmarks |
| LD | Wear Pattern Diagram | Color-coded liner cross-section |

---

### PHASE 8: Implement Copper Mine Process Flow

#### 8.1 Process Flow SVG Structure

**File:** `components/CopperMineProcessFlow.js`

**SVG Canvas:** 1400px × 600px

**Equipment Positioning:**
```
Mining Section (0-400px):
  - Truck (50, 100)
  - ROM Bin (150, 100)
  - Primary Crusher (250, 100) ← RED BOX, pulsing
  - Secondary Crusher (350, 150)
  - Vibrating Screen (280, 200)

Concentrating Section (400-600px):
  - Stockpile (450, 200)
  - Stacker (550, 250)

Ore Beneficiation (600-900px):
  - SAG Mill (650, 150)
  - Flotation Cell (750, 200)
  - Thickener (850, 250)

... (continue for all sections)
```

**KPI Cards at top:**
```html
<div style="position: absolute; top: 20px; display: flex; gap: 16px;">
  <KPICard title="Run of Mine (ROM)" value="124,500" unit="tonnes" change="-7.62%" />
  <KPICard title="Ore Processed" value="107,700" unit="tonnes" change="-7.68%" />
  <KPICard title="Copper Produced" value="510" unit="tonnes" change="-7.68%" />
  <KPICard title="Production Loss" value="150" unit="tonnes/day" change="+1.34%" />
</div>
```

**Tabs:**
```html
<div style="tabs">
  <button class="active">Shift Performance</button>
  <button>LPO Hotspots</button>
</div>
```

#### 8.2 Equipment SVG Implementation

**Example - Primary Crusher SVG:**
```javascript
export const PrimaryCrusherSVG = ({ isAlert = false }) => (
  <g id="primary-crusher">
    {/* Alert box if critical */}
    {isAlert && (
      <rect
        x="-10" y="-10" width="100" height="100"
        fill="none"
        stroke="#EF4444"
        strokeWidth="3"
        rx="4"
        style={{ animation: "pulseBorder 2s infinite" }}
      />
    )}
    
    {/* Crusher body - isometric view */}
    <path
      d="M 20,40 L 40,20 L 60,20 L 80,40 L 60,60 L 40,60 Z"
      fill="#5B8FA3"
      stroke="#3E6478"
      strokeWidth="2"
    />
    
    {/* Crushing chamber */}
    <circle cx="50" cy="40" r="8" fill="#2D4A5A" />
    
    {/* Feed hopper on top */}
    <path
      d="M 35,15 L 40,20 L 60,20 L 65,15 Z"
      fill="#7BA5B8"
    />
    
    {/* Label */}
    <text x="50" y="75" fontSize="10" textAnchor="middle" fill="#1a1a1a">
      PRIMARY
    </text>
    <text x="50" y="88" fontSize="10" textAnchor="middle" fill="#1a1a1a">
      CRUSHER
    </text>
    
    {isAlert && (
      <>
        <circle cx="75" cy="25" r="8" fill="#EF4444" />
        <text x="75" y="29" fontSize="11" fontWeight="bold" textAnchor="middle" fill="white">!</text>
      </>
    )}
  </g>
);
```

**Repeat for all 15+ equipment types**

---

### PHASE 9: Favicon Update

**Current:** Green generic favicon
**New:** Accenture purple chevron logo

**Files to create:**
- `public/favicon.ico` - Accenture logo (16×16, 32×32, 48×48)
- `public/favicon.svg` - Vector version

**Accenture logo design:**
```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#A100FF"/>
  <path d="M 8,16 L 16,8 L 24,16" fill="none" stroke="white" stroke-width="3"/>
</svg>
```

---

### PHASE 10: Implementation Order & Testing

#### 10.1 Implementation Sequence

**Priority 1 (Critical - breaks demo):**
1. Fix conversation → output console state coordination
2. Fix question duplication bug
3. Remove "Azure AI Connected" and "Reset Demo" clutter

**Priority 2 (Visual Impact):**
4. Implement Copper Mine Process Flow with all equipment
5. Add Timeseries Chart to TA Agent
6. Add Wear Pattern Diagram to LD Agent
7. Clean up all colored highlight boxes

**Priority 3 (Polish):**
8. Add detailed SAP tool call parameters
9. Improve memory update specificity
10. Add handoff context passing details
11. Update favicon to Accenture logo
12. Add Conclusion Docket PDF preview

#### 10.2 Testing Checklist

**Before marking complete, verify:**

1. **Login Flow:**
   - [ ] Login screen clean (no clutter)
   - [ ] Microsoft button works
   - [ ] Transitions to Mining Overview

2. **Mining Overview:**
   - [ ] Copper Mine process flow visible
   - [ ] All equipment rendered correctly
   - [ ] Primary Crusher has red alert box
   - [ ] KPI cards show correct values
   - [ ] Click Primary Crusher → Navigate to Analysis

3. **Conversation Panel:**
   - [ ] Question 1 appears alone
   - [ ] Radio buttons unselected
   - [ ] Click "Yes" → Question 1 locks, timestamp appears
   - [ ] Question 2 appears after 0.5s delay
   - [ ] Click "Yes" → Question 2 locks
   - [ ] Question 3 appears
   - [ ] NO DUPLICATES of any question
   - [ ] Select scenario → Question 3 locks

4. **Output Console Synchronization:**
   - [ ] Empty until Question 2 answered
   - [ ] RD Agent appears when Question 2 = "Yes"
   - [ ] Shows "Analyzing..." status
   - [ ] Tool calls appear progressively (1-2s each)
   - [ ] [THINKING], [TOOL], [MEMORY] icons correct
   - [ ] Tool parameters displayed
   - [ ] Tool results shown with -> arrow
   - [ ] Agent completes after ~12 seconds
   - [ ] Handoff message appears
   - [ ] TA Agent starts after handoff

5. **Agent Tool Calls:**
   - [ ] Each agent shows 5-8 tool calls
   - [ ] SAP PM queries visible
   - [ ] Vector search shows query and results
   - [ ] Memory updates show what's being stored
   - [ ] Timing feels natural (not too fast)

6. **Visual Elements:**
   - [ ] TA Agent shows timeseries chart
   - [ ] Chart animates in smoothly
   - [ ] LD Agent shows wear pattern diagram
   - [ ] RCA table appears with clean styling
   - [ ] No colored background boxes

7. **Trusted Huddle:**
   - [ ] Appears after main agents complete
   - [ ] 5 badges in huddle banner
   - [ ] Agents activate sequentially (not all at once)
   - [ ] Each huddle agent shows 3-5 tool calls
   - [ ] No blinking/glitching
   - [ ] Consensus message appears at end

8. **Action Recommendations:**
   - [ ] Appears after huddle complete
   - [ ] Clean layout (no colored boxes)
   - [ ] Immediate/Near-Term/Long-Term sections
   - [ ] Autonomous actions list with [OK] marks
   - [ ] Conclusion Docket preview (optional)
   - [ ] "Generate Work Order" button

9. **Header:**
   - [ ] No "Azure AI Connected" badge
   - [ ] No "Reset Demo" button
   - [ ] Clean Accenture logo
   - [ ] Subtle back button
   - [ ] User avatar

10. **Overall Polish:**
    - [ ] White backgrounds
    - [ ] Clean typography
    - [ ] No excessive colors
    - [ ] Matches AIIS screenshot aesthetic
    - [ ] Favicon shows Accenture logo
    - [ ] No console errors
    - [ ] Smooth animations
    - [ ] Total demo time: 60-90 seconds

---

## File Changes Required

| Priority | File | Action | Complexity |
|----------|------|--------|------------|
| 1 | `page.js` | Redesign state management for conversation→output sync | HIGH |
| 1 | `ConversationPanel.js` | Fix duplication, add question locking | MEDIUM |
| 1 | `OutputConsole.js` | Wait for question answers before showing content | MEDIUM |
| 1 | `CerebraHeader.js` | Remove Azure badge, remove/hide Reset button | LOW |
| 2 | `CopperMineProcessFlow.js` | CREATE - Full process flow matching screenshot 6 | HIGH |
| 2 | `PrimaryCrusherSVG.js` | CREATE - Equipment SVG component | MEDIUM |
| 2 | `TimeseriesChart.js` | CREATE - Line chart component | MEDIUM |
| 2 | `WearPatternDiagram.js` | CREATE - Liner wear visualization | MEDIUM |
| 2 | `agentToolCalls.js` | Add SAP-specific calls, more detail | MEDIUM |
| 2 | `OutputConsole.js` | Remove colored highlight boxes, clean styling | LOW |
| 3 | `ConclusionDocket.js` | CREATE - PDF preview component | LOW |
| 3 | `public/favicon.ico` | CREATE - Accenture logo favicon | LOW |
| 3 | `public/favicon.svg` | CREATE - Vector favicon | LOW |

---

## Success Criteria

**Demo must achieve:**
1. User-driven workflow (conversation selections drive output console)
2. No duplicate questions
3. Clean, professional UI (matches AIIS screenshots exactly)
4. Rich visualizations (charts, diagrams, process flow)
5. Realistic multi-agent collaboration (60-90 second demo)
6. Specific SAP/tool/memory operations visible
7. Copper Mine process flow with all equipment
8. No "demo" language or cheap-looking elements
9. Works end-to-end without errors
10. Ready for enterprise presentation

**Total estimated time:** 4-6 hours implementation
**Testing time:** 1 hour thorough walkthrough

