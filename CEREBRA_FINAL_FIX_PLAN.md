# Cerebra AIIS - FINAL FIX PLAN (Detailed Step-by-Step)

## REFERENCE IMAGES ANALYSIS

### Image 1: Copper Value Chain Digital Twin
**EXACT Requirements from Screenshot:**
- **Header KPIs (4 cards):** Run of Mine (ROM) | Ore Processed | Copper Produced | Estimated Production Loss
- **Each KPI has:** Icon, Value, Unit (Tons pd), MoM % change (green up / red down)
- **Toggle buttons:** "Shift Performance" (outlined) | "LPO Hotspots" (filled orange)
- **6 Numbered Sections:**
  1. MINING - Loading & Hauling, ROM Bin & Primary Crusher
  2. CONCENTRATING - Secondary Crusher, Vibrating Screen, Stockpile Feed Conveyor, Stockpile, Stacker
  3. ORE BENEFICIATION - SAG Mill, Feed Conveyor for Floatation Cell, Floatation Cell
  4. ORE CONCENTRATE - Concentrated Ore Conveyor, Stacker, Thickener, Concentrated Ore Stockpile
  5. TAILINGS - Thickener, Rejects Conveyor, Tailing Dam, Tailing Fluid Transport
  6. PRODUCTS - Dispatch Feed Conveyor, Filtering, Load Out Bin, Ship Stackers
- **Visual Style:** 3D isometric blue-gray equipment renders, light gray background, connecting flow lines
- **Alert Indicator:** Red border around equipment with issues (ROM Bin & Primary Crusher, Stockpile Feed Conveyor)

### Images 2-4: AIIS Conversation + Output Console
**EXACT Layout Requirements:**
- **Left Panel (Conversation):**
  - Purple header "Conversation"
  - Orange bot avatar circles
  - Questions with radio button options
  - "Enter query here" input at bottom with send arrow
  - Timestamps on each question block
  - Clean white cards with subtle purple left border
  
- **Right Panel (Output Console):**
  - Header: "Output Console" | "Active Session: XXXXXX" | "Total Processing Time: X.XX hrs"
  - **Root Cause Table:** Purple header row (Rank | Possible Root Cause | Likelihood (%) | Supporting Reasons)
  - Agent analysis paragraph below table
  - "Huddle In-Progress" dark purple banner with colored agent badges (OA, MA, CB, DI, CM)
  - Individual agent outputs with checkmark icon and findings

- **PDF Preview Modal:**
  - Shows actual multi-page PDF document
  - Page thumbnails on left
  - Full-size preview on right
  - Download/print icons in toolbar

- **Notification Panel:**
  - Slides from right
  - Red/orange/yellow severity dots
  - Timestamp with timezone
  - Equipment identifiers

## CRITICAL ISSUES IDENTIFIED

| Issue # | Component | Problem | Priority |
|---------|-----------|---------|----------|
| 1 | **Digital Twin** | Current: crude SVG boxes. Required: 6-section copper value chain with 3D isometric equipment | **CRITICAL** |
| 2 | **Root Cause Table** | Missing. Need: Ranked table with Likelihood % and Supporting Reasons | **CRITICAL** |
| 3 | **PDF Generation** | Not working. Need: Multi-page SAP PM work order with preview and download | **CRITICAL** |
| 4 | **Knowledge Graph** | Shows random nodes. Need: Reasoning chain explaining HOW conclusions were reached | **HIGH** |
| 5 | **Fault Tree** | Too shallow. Need: FMEA-based structure with evidence | **HIGH** |
| 6 | **Agent Huddle** | Need: Rounded dark banner with colored badges matching reference | **HIGH** |
| 7 | **Overall Aesthetic** | Too many colors. Need: White backgrounds, purple accents only | **MEDIUM** |

---

## PHASE 1: DIGITAL TWIN - Complete Rebuild (MATCHING REFERENCE EXACTLY)

### Task 1.1: Build 6-Section Copper Value Chain SVG

**What:** Create a sophisticated SVG component that renders the exact copper value chain from the reference image

**File:** `src/app/cerebra-demo/components/CopperValueChain.js` (NEW FILE)

**Visual Structure (EXACTLY like reference):**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [KPI] Run of Mine  │ [KPI] Ore Processed │ [KPI] Copper Produced │ [KPI] Est. Loss│
│ 🏭 124,500 Tons    │ 🏭 107,700 Tons     │ 🏭 510 Tons           │ 🏭 150 Tons     │
│ ↑8.42% MoM        │ ↓7.52% MoM         │ ↓7.65% MoM           │ ↓1.34% MoM     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [Shift Performance]  [LPO Hotspots]                                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  (1) MINING                    (3) ORE BENEFICIATION           (5) TAILINGS     │
│  ┌──────────┐                  ┌──────────┐                    ┌──────────┐     │
│  │ Loading  │──→               │ SAG Mill │──→                 │Thickener │     │
│  │& Hauling │   ┌──────────┐   └──────────┘                    └──────────┘     │
│  └──────────┘   │ROM Bin & │       ↓         ┌──────────┐          ↓           │
│       ↓        │ Primary  │   ┌──────────┐   │Floatation│     ┌──────────┐     │
│  ┌──────────┐  │ Crusher  │   │  Feed    │   │  Cell    │     │ Rejects  │     │
│  │Secondary │   └──────────┘   │ Conveyor │   └──────────┘     │ Conveyor │     │
│  │ Crusher  │       ↓         └──────────┘                    └──────────┘     │
│  └──────────┘   ┌──────────┐                                       ↓           │
│       ↓        │Vibrating │   (4) ORE CONCENTRATE             ┌──────────┐     │
│  (2) CONCENTRATING│ Screen  │   ┌──────────┐                    │ Tailing  │     │
│  ┌──────────┐   └──────────┘   │Conc. Ore │   ┌──────────┐     │   Dam    │     │
│  │Stockpile │       ↓         │ Conveyor │──→│Thickener │     └──────────┘     │
│  │Feed Conv │   ┌──────────┐   └──────────┘   └──────────┘          ↓           │
│  └──────────┘   │Stockpile │       ↓              ↓            ┌──────────┐     │
│       ↓        └──────────┘   ┌──────────┐   ┌──────────┐     │ Tailing  │     │
│  ┌──────────┐       ↓         │ Stacker  │   │Conc. Ore │     │Fluid Trp │     │
│  │ Stacker  │   ┌──────────┐   └──────────┘   │Stockpile │     └──────────┘     │
│  └──────────┘   │ Stacker  │                  └──────────┘                      │
│                 └──────────┘                                   (6) PRODUCTS     │
│                                                               ┌──────────┐     │
│                                                               │ Dispatch │     │
│                                                               │Feed Conv │     │
│                                                               └──────────┘     │
│                                                                    ↓           │
│                                                               ┌──────────┐     │
│                                                               │Filtering │     │
│                                                               └──────────┘     │
│                                                                    ↓           │
│                                                               ┌──────────┐     │
│                                                               │Load Out  │     │
│                                                               │   Bin    │     │
│                                                               └──────────┘     │
│                                                                    ↓           │
│                                                               ┌──────────┐     │
│                                                               │  Ship    │     │
│                                                               │Stackers  │     │
│                                                               └──────────┘     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Task 1.2: Equipment Component with 3D Isometric Style

**File:** `src/app/cerebra-demo/components/Equipment3D.js` (NEW FILE)

**Each equipment piece rendered as SVG with:**
- 3D isometric projection (slight tilt)
- Blue-gray color scheme (#64748B base, #94A3B8 highlights)
- Equipment-specific silhouette (crusher, conveyor, mill, etc.)
- Label below equipment
- Red border when status = 'alert'

**Equipment Types to Render:**
```javascript
const equipmentTypes = {
  crusher: { /* Primary/Secondary crusher SVG */ },
  conveyor: { /* Belt conveyor SVG */ },
  mill: { /* SAG Mill SVG */ },
  screen: { /* Vibrating screen SVG */ },
  stockpile: { /* Pile shape SVG */ },
  thickener: { /* Circular tank SVG */ },
  floatationCell: { /* Cell SVG */ },
  stacker: { /* Radial stacker SVG */ },
  dam: { /* Dam shape SVG */ },
  ship: { /* Ship silhouette SVG */ },
  bin: { /* Storage bin SVG */ },
  truck: { /* Haul truck SVG */ }
};
```

### Task 1.3: KPI Header Cards (EXACTLY like reference)

**Design Spec:**
```
┌────────────────────────────┐
│ 🔧 Run of Mine (ROM)       │  ← Icon + Label in gray
│                            │
│   124,500                  │  ← Large value, black, bold
│   Tons pd  ↑8.42%          │  ← Unit + Change with arrow
│            MoM             │  ← "MoM" label under percentage
└────────────────────────────┘
```

**CSS:**
```css
.kpi-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 12px 20px;
  min-width: 180px;
}
.kpi-icon { width: 24px; height: 24px; opacity: 0.6; }
.kpi-label { font-size: 12px; color: #64748B; }
.kpi-value { font-size: 28px; font-weight: 600; color: #1a1a2e; }
.kpi-unit { font-size: 11px; color: #94A3B8; }
.kpi-change-up { color: #10B981; } /* Green */
.kpi-change-down { color: #EF4444; } /* Red */
```

### Task 1.4: Toggle Buttons (Shift Performance / LPO Hotspots)

**Design:**
```
[Shift Performance]  [LPO Hotspots]
     ↑ outlined         ↑ filled orange when active
```

**CSS:**
```css
.toggle-btn {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
.toggle-btn-outlined {
  background: transparent;
  border: 1px solid #E67E22;
  color: #E67E22;
}
.toggle-btn-filled {
  background: #E67E22;
  border: 1px solid #E67E22;
  color: white;
}
```

### Task 1.5: Section Labels (1-6 with Titles)

**Design:**
```
(1) MINING
 ↑ Orange circle with number
    ↑ Uppercase section title
```

**CSS:**
```css
.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E67E22;
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #4B5563;
  letter-spacing: 0.5px;
}
```

### Task 1.6: Alert Equipment Highlighting

**What:** Red border around equipment with issues

**CSS:**
```css
.equipment-alert {
  stroke: #EF4444;
  stroke-width: 3px;
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4));
}
```

**Pulsing Animation:**
```css
@keyframes alertPulse {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(239,68,68,0.4)); }
  50% { filter: drop-shadow(0 0 12px rgba(239,68,68,0.7)); }
}
.equipment-alert { animation: alertPulse 2s infinite; }
```

---

## PHASE 2: ROOT CAUSE TABLE + OUTPUT CONSOLE (MATCHING REFERENCE)

### Task 2.1: Root Cause Analysis Table Component

**File:** `src/app/cerebra-demo/components/RootCauseTable.js` (NEW FILE)

**EXACT Design from Reference:**
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Based on historical trends, failure modes, and corrosion analysis, here are      │
│ potential causes ranked by probability:                                          │
├───────┬─────────────────────────────┬──────────────┬─────────────────────────────┤
│ Rank  │ Possible Root Cause         │ Likelihood   │ Supporting Reasons          │
│       │                             │ (%)          │                             │
├───────┼─────────────────────────────┼──────────────┼─────────────────────────────┤
│   1   │ Liner wear degradation      │     85%      │ 4 months since replacement, │
│       │                             │              │ inspection shows 65% remain │
├───────┼─────────────────────────────┼──────────────┼─────────────────────────────┤
│   2   │ Hard ore feed composition   │     75%      │ Geological survey shows     │
│       │ (increased hardness)        │              │ harder ore zone entered     │
├───────┼─────────────────────────────┼──────────────┼─────────────────────────────┤
│   3   │ Bearing degradation         │     60%      │ Vibration analysis shows    │
│       │                             │              │ elevated readings           │
├───────┼─────────────────────────────┼──────────────┼─────────────────────────────┤
│   4   │ Feed rate overload          │     35%      │ Control system logs show    │
│       │                             │              │ +/-15% variation            │
└───────┴─────────────────────────────┴──────────────┴─────────────────────────────┘
```

**Table Styling (EXACTLY like reference):**
```css
.root-cause-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.root-cause-header {
  background: #A100FF; /* Purple */
  color: white;
  text-align: center;
  padding: 12px;
  font-weight: 600;
}
.root-cause-row:nth-child(even) {
  background: #F9FAFB;
}
.root-cause-cell {
  padding: 12px 16px;
  border-bottom: 1px solid #E2E8F0;
  vertical-align: top;
}
.rank-cell {
  text-align: center;
  font-weight: 600;
  width: 60px;
}
.likelihood-cell {
  text-align: center;
  font-weight: 600;
  width: 100px;
}
```

### Task 2.2: Agent Analysis Text Block

**Design:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│ 🟠 CA  Crusher Analysis Agent                                            │
│                                                                          │
│ "Liner wear has progressed to 65% of original thickness (critical       │
│ threshold). Combined with increased ore hardness from the new mining    │
│ zone, efficiency has dropped from 89% to 82% over 30 days. Recommend   │
│ immediate liner replacement and ore blend adjustment."                   │
│                                                                          │
│ CA Agent initiates a collaborative session with the specialized agents  │
└──────────────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.agent-analysis {
  margin: 16px 0;
  padding: 16px;
  background: white;
  border-radius: 8px;
}
.agent-analysis-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.agent-badge-inline {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #E67E22;
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.agent-name {
  font-weight: 600;
  color: #1A1A2E;
}
.agent-quote {
  font-style: italic;
  color: #4B5563;
  line-height: 1.6;
  margin-bottom: 16px;
}
.agent-initiates {
  font-weight: 600;
  color: #1A1A2E;
}
```

### Task 2.3: Huddle In-Progress Banner (EXACTLY like reference)

**Design:**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    Huddle In-Progress                            │
│                                                                  │
│       🟠 OA    🟡 MA    🔵 CB    🟣 DI    🟢 CM                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.huddle-banner {
  background: linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%);
  border-radius: 12px;
  padding: 20px 24px;
  text-align: center;
  margin: 20px 0;
}
.huddle-title {
  color: white;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}
.huddle-badges {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.huddle-agent-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
}
/* Agent badge colors */
.badge-RO { background: #F59E0B; } /* Orange - Resource Orchestration */
.badge-TA { background: #EF4444; } /* Red - Timeseries Analysis */
.badge-MI { background: #3B82F6; } /* Blue - Maintenance Intelligence */
.badge-IL { background: #8B5CF6; } /* Purple - Inventory & Logistics */
.badge-LD { background: #10B981; } /* Green - Liner Diagnostics */
```

### Task 2.4: Individual Agent Output Display

**Design (per agent):**
```
┌──────────────────────────────────────────────────────────────────┐
│ 🟠 RO  Resource Orchestration Agent                              │
│                                                                  │
│ ✓ Checking maintenance history and crew availability.           │
│ • Finds that liner last replaced 4 months ago, suggesting       │
│   accelerated wear beyond normal lifecycle.                      │
└──────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.agent-output {
  margin-bottom: 16px;
  padding: 14px 16px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid transparent;
}
.agent-output.active {
  border-left-color: #E67E22;
}
.agent-output-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.agent-finding {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}
.agent-finding-check {
  color: #10B981;
  margin-top: 2px;
}
.agent-finding-bullet {
  color: #9CA3AF;
}
.agent-finding-text {
  font-size: 13px;
  color: #4B5563;
  line-height: 1.5;
}
.agent-finding-text strong {
  color: #1A1A2E;
  font-weight: 600;
}
```

---

## PHASE 3: PDF GENERATION (SAP PM WORK ORDER)

### Task 3.1: Fix PDF Preview Modal

**File:** `src/app/cerebra-demo/components/visualizations/SAPWorkOrderPreview.js`

**EXACT Design from Reference (Multi-page PDF Preview):**
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ≡  CDU_Heater_Report_PDF.pdf    1 / 3    [−] 85% [+]  📄 ✏️  ↩ ↪  ⋮        [X] │
├──────────┬───────────────────────────────────────────────────────────────────────┤
│          │                                                                       │
│  ┌─────┐ │        Copper Mine Operations                                        │
│  │  1  │ │        Work Order: WO-2025-0147                                      │
│  └─────┘ │                                                                       │
│          │        1. Problem Statement                                           │
│  ┌─────┐ │        • Primary crusher efficiency dropped from 89% to 82%          │
│  │  2  │ │        • Estimated production loss: $47,500/day                       │
│  └─────┘ │                                                                       │
│          │        2. Root Cause Analysis                                         │
│  ┌─────┐ │        ┌────────────────────────────────────────────────────┐        │
│  │  3  │ │        │ Rank │ Cause           │ Likelihood │ Evidence    │        │
│  └─────┘ │        ├──────┼─────────────────┼────────────┼─────────────┤        │
│          │        │  1   │ Liner wear      │    85%     │ SAP PM data │        │
│          │        │  2   │ Hard ore        │    75%     │ Geology     │        │
│          │        └────────────────────────────────────────────────────┘        │
│          │                                                                       │
│          │        3. Recommended Actions                                         │
│          │        • Immediate: Schedule liner replacement                        │
│          │        • Near-term: Order backup parts (CJ-8845)                      │
│          │        • Long-term: Install wear monitoring sensors                   │
│          │                                                                       │
└──────────┴───────────────────────────────────────────────────────────────────────┘
```

### Task 3.2: SAP PM Work Order PDF Content Structure

**File:** `src/app/cerebra-demo/data/workOrderData.js` (NEW FILE)

**SAP PM Standard Fields:**
```javascript
export const workOrderData = {
  header: {
    workOrderNumber: 'WO-2025-0147',
    notificationNumber: '10075234',
    orderType: 'PM02', // Corrective Maintenance
    priority: '1 - Very High',
    systemStatus: 'CRTD', // Created
    plant: 'MINE-01',
    planningPlant: 'MINE-01',
    workCenter: 'CRUSH-WC',
    maintenanceActivityType: 'Corrective Repair',
    createdDate: '2025-01-15',
    createdBy: 'CEREBRA_AI',
    basicStartDate: '2025-01-20',
    basicFinishDate: '2025-01-20',
  },
  equipment: {
    functionalLocation: 'MINE-01-CRUSH-001',
    equipment: 'CRUSHER-001',
    description: 'Primary Crusher - Jaw Type',
    manufacturer: 'Metso',
    model: 'C160',
    serialNumber: 'MC-2019-45782',
  },
  operations: [
    {
      operationNumber: '0010',
      description: 'Isolate and lock out primary crusher',
      workCenter: 'CRUSH-WC',
      duration: 0.5,
      durationUnit: 'H',
      controlKey: 'PM01',
    },
    {
      operationNumber: '0020',
      description: 'Remove worn jaw liner plates',
      workCenter: 'CRUSH-WC',
      duration: 3.0,
      durationUnit: 'H',
      controlKey: 'PM01',
    },
    {
      operationNumber: '0030',
      description: 'Inspect crusher cavity and eccentric',
      workCenter: 'CRUSH-WC',
      duration: 1.0,
      durationUnit: 'H',
      controlKey: 'PM01',
    },
    {
      operationNumber: '0040',
      description: 'Install new jaw liner plates (CJ-8845)',
      workCenter: 'CRUSH-WC',
      duration: 2.5,
      durationUnit: 'H',
      controlKey: 'PM01',
    },
    {
      operationNumber: '0050',
      description: 'Perform CSS adjustment and alignment',
      workCenter: 'CRUSH-WC',
      duration: 0.5,
      durationUnit: 'H',
      controlKey: 'PM01',
    },
    {
      operationNumber: '0060',
      description: 'De-isolate and test run crusher',
      workCenter: 'CRUSH-WC',
      duration: 0.5,
      durationUnit: 'H',
      controlKey: 'PM01',
    },
  ],
  materials: [
    {
      itemNumber: '0010',
      materialNumber: 'CJ-8845',
      description: 'Jaw Liner Plate - Fixed',
      quantity: 2,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      reservationNumber: 'RES-4521',
    },
    {
      itemNumber: '0020',
      materialNumber: 'CJ-8846',
      description: 'Jaw Liner Plate - Movable',
      quantity: 2,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      reservationNumber: 'RES-4521',
    },
    {
      itemNumber: '0030',
      materialNumber: 'BT-M24X80',
      description: 'Bolt M24x80 Grade 10.9',
      quantity: 24,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      reservationNumber: 'RES-4522',
    },
  ],
  laborAssignment: {
    leadTechnician: 'James Morrison',
    crewSize: 4,
    trade: 'Mechanical Fitter',
    estimatedHours: 8,
    skillMatch: '95%',
  },
  schedule: {
    scheduledStart: '2025-01-20 06:00',
    scheduledFinish: '2025-01-20 14:00',
    actualStart: null,
    actualFinish: null,
    downtime: 8, // hours
  },
  costEstimate: {
    laborCost: 3200,
    materialCost: 12500,
    totalEstimate: 15700,
    currency: 'USD',
  },
};
```

### Task 3.3: Fix PDF Download Button

**Current Issue:** Clicking "Generate PDF" does nothing

**Fix Required:**
1. Use `@react-pdf/renderer` properly
2. Create PDF document component
3. Use `PDFDownloadLink` for download button
4. Show preview using `PDFViewer` or `Document` preview

**Implementation:**
```javascript
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Document Component
const WorkOrderPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>MAINTENANCE WORK ORDER</Text>
        <Text style={styles.woNumber}>{data.header.workOrderNumber}</Text>
      </View>
      {/* ... rest of PDF content */}
    </Page>
  </Document>
);

// Download Button
<PDFDownloadLink
  document={<WorkOrderPDF data={workOrderData} />}
  fileName={`WorkOrder_${workOrderData.header.workOrderNumber}.pdf`}
>
  {({ loading }) => (
    <button disabled={loading}>
      {loading ? 'Generating...' : 'Download PDF'}
    </button>
  )}
</PDFDownloadLink>
```

---

## PHASE 4: CONVERSATION PANEL (MATCHING REFERENCE)

### Task 4.1: Conversation Panel Header

**EXACT Design from Reference:**
```
┌─────────────────────────────────────┐
│ Conversation                        │  ← Purple color #A100FF, bold
└─────────────────────────────────────┘
```

**CSS:**
```css
.conversation-header {
  color: #A100FF;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
}
```

### Task 4.2: Question Card Layout

**EXACT Design from Reference:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🟠  Do you want to do the detailed RCA for this LPO?       │
│                                                             │
│     ○ Yes                                                   │
│     ○ No, I need something else                             │
│                                                             │
│                                                    16:09    │
└─────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.question-card {
  margin: 16px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #A100FF;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.question-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}
.bot-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E67E22;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.question-text {
  font-size: 14px;
  color: #1A1A2E;
  font-weight: 500;
  line-height: 1.5;
}
.question-options {
  margin-left: 44px; /* Align with text after avatar */
  margin-top: 12px;
}
.question-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  cursor: pointer;
}
.question-option input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: #A100FF;
}
.question-option label {
  font-size: 13px;
  color: #4B5563;
}
.question-timestamp {
  text-align: right;
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 12px;
}
```

### Task 4.3: Query Input at Bottom

**EXACT Design from Reference:**
```
┌─────────────────────────────────────────────────────────────┐
│ Enter query here                                        ➤  │
└─────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.query-input-container {
  padding: 16px;
  border-top: 1px solid #E2E8F0;
  background: white;
}
.query-input-wrapper {
  display: flex;
  align-items: center;
  background: #F9FAFB;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  padding: 10px 16px;
}
.query-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #4B5563;
  outline: none;
}
.query-input::placeholder {
  color: #9CA3AF;
}
.query-send-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #A100FF;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.query-send-btn svg {
  color: white;
  width: 16px;
  height: 16px;
}
```

### Task 4.4: Output Console Header

**EXACT Design from Reference:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Output Console                        Active Session: 898825            │
│                                       Total Processing Time: 0.33 hrs   │
└──────────────────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.output-console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #E2E8F0;
}
.output-console-title {
  color: #E67E22;
  font-size: 16px;
  font-weight: 600;
}
.output-console-session {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #9CA3AF;
}
.session-label {
  color: #4B5563;
}
.session-value {
  font-family: 'SF Mono', Monaco, monospace;
}
```

---

## PHASE 5: KNOWLEDGE GRAPH - Complete Redesign

### Task 5.1: Define Meaningful Graph Data

**What:** The knowledge graph must EXPLAIN the reasoning process, not just show random nodes

**Current Problem:** Shows generic nodes that don't tell a story

**Required Graph Structure:**

```
CENTRAL NODE: "Crusher Efficiency Analysis"
    │
    ├── DATA SOURCES (retrieved by agents)
    │   ├── SAP PM Work Orders (24 records)
    │   ├── Efficiency Timeseries (720 points)
    │   ├── Inspection Reports (8 documents)
    │   ├── Inventory System (4 parts found)
    │   └── Geological Analysis (ore composition)
    │
    ├── AGENT ANALYSIS
    │   ├── RO Agent → Found liner last replaced 4 months ago
    │   ├── TA Agent → Correlation: efficiency vs liner age = 0.92
    │   ├── MI Agent → Lifecycle exceeded by 25%
    │   ├── IL Agent → Parts CJ-8845 available (4 units)
    │   └── LD Agent → Wear at 65% (critical threshold)
    │
    ├── FINDINGS (derived)
    │   ├── Primary Finding: Liner wear is root cause (85% confidence)
    │   ├── Contributing: Ore hardness variance
    │   └── Correlation: Higher hardness → faster wear
    │
    └── RECOMMENDATIONS (generated)
        ├── Immediate: Schedule replacement
        ├── Near-term: Order backup liners
        └── Long-term: Install wear sensors
```

**File:** `src/app/cerebra-demo/data/knowledgeGraphData.js`

```javascript
export const knowledgeGraphData = {
  nodes: [
    // Central node
    { id: 'analysis', label: 'Crusher Efficiency Analysis', type: 'central', size: 30 },
    
    // Data sources (blue)
    { id: 'sap_pm', label: 'SAP PM Records', type: 'data', group: 'sources' },
    { id: 'timeseries', label: 'Efficiency Timeseries', type: 'data', group: 'sources' },
    { id: 'inspections', label: 'Inspection Reports', type: 'data', group: 'sources' },
    { id: 'inventory', label: 'Inventory System', type: 'data', group: 'sources' },
    
    // Agent findings (orange)
    { id: 'ro_finding', label: 'Liner replaced 4 months ago', type: 'finding', agent: 'RO' },
    { id: 'ta_finding', label: 'Efficiency-Age correlation: 0.92', type: 'finding', agent: 'TA' },
    { id: 'mi_finding', label: 'Lifecycle exceeded 25%', type: 'finding', agent: 'MI' },
    { id: 'ld_finding', label: 'Wear at 65% threshold', type: 'finding', agent: 'LD' },
    
    // Conclusions (green)
    { id: 'root_cause', label: 'ROOT CAUSE: Liner Wear (85%)', type: 'conclusion', size: 25 },
    { id: 'rec_immediate', label: 'Schedule replacement', type: 'recommendation' },
    { id: 'rec_longterm', label: 'Install wear sensors', type: 'recommendation' },
  ],
  links: [
    // Data to Analysis
    { source: 'sap_pm', target: 'analysis', label: 'retrieved' },
    { source: 'timeseries', target: 'analysis', label: 'queried' },
    { source: 'inspections', target: 'analysis', label: 'analyzed' },
    
    // Analysis to Findings
    { source: 'analysis', target: 'ro_finding', label: 'RO discovered' },
    { source: 'analysis', target: 'ta_finding', label: 'TA correlated' },
    { source: 'analysis', target: 'mi_finding', label: 'MI calculated' },
    { source: 'analysis', target: 'ld_finding', label: 'LD diagnosed' },
    
    // Findings to Conclusion
    { source: 'ro_finding', target: 'root_cause', label: 'supports' },
    { source: 'ta_finding', target: 'root_cause', label: 'confirms' },
    { source: 'mi_finding', target: 'root_cause', label: 'validates' },
    { source: 'ld_finding', target: 'root_cause', label: 'evidence' },
    
    // Conclusion to Recommendations
    { source: 'root_cause', target: 'rec_immediate', label: 'leads to' },
    { source: 'root_cause', target: 'rec_longterm', label: 'suggests' },
  ]
};
```

### Task 2.2: Redesign Knowledge Graph Modal

**File:** `src/app/cerebra-demo/components/visualizations/KnowledgeGraphModal.js`

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│ Knowledge Graph - Agent Reasoning Chain                   [X] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌──────────┐                                              │
│    │  SAP PM  │──────┐                                       │
│    └──────────┘      │                                       │
│                      ▼                                       │
│    ┌──────────┐   ┌────────────────────┐   ┌─────────────┐  │
│    │Timeseries│──▶│ EFFICIENCY ANALYSIS│──▶│ ROOT CAUSE  │  │
│    └──────────┘   └────────────────────┘   │ Liner Wear  │  │
│                      ▲                     └─────────────┘  │
│    ┌──────────┐      │                           │          │
│    │Inspections├─────┘                           ▼          │
│    └──────────┘                          ┌─────────────┐    │
│                                          │ RECOMMEND   │    │
│                                          │ Replacement │    │
│                                          └─────────────┘    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Legend:  ● Data Sources  ● Agent Findings  ● Conclusions    │
└──────────────────────────────────────────────────────────────┘
```

**Colors (matching reference palette):**
- Data sources: #3B82F6 (blue)
- Agent findings: #E67E22 (orange)
- Conclusions: #10B981 (green)
- Recommendations: #A100FF (purple)
- Links: #9CA3AF (gray)

---

## PHASE 3: FAULT TREE - Add Engineering Depth

### Task 3.1: Create Proper FMEA-Based Fault Tree Data

**What:** The fault tree must show engineering analysis structure

**Required Structure:**
```
                    ┌─────────────────────────────┐
                    │   EFFICIENCY DROP           │
                    │   (89% → 82%, -7%)          │
                    │   [Primary Event]           │
                    └─────────────────────────────┘
                                 │
                                AND
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
    ┌──────▼──────┐      ┌───────▼───────┐     ┌──────▼──────┐
    │ MECHANICAL  │      │   PROCESS     │     │  MATERIAL   │
    │   WEAR      │      │  CONDITIONS   │     │   INPUT     │
    │  [85%]      │      │    [45%]      │     │   [30%]     │
    └─────────────┘      └───────────────┘     └─────────────┘
           │                     │                     │
          OR                    OR                    OR
           │                     │                     │
    ┌──────┼──────┐       ┌──────┼──────┐      ┌──────┼──────┐
    │      │      │       │      │      │      │      │      │
   ┌▼┐   ┌▼┐   ┌▼┐      ┌▼┐   ┌▼┐   ┌▼┐     ┌▼┐   ┌▼┐   ┌▼┐
   │L│   │B│   │S│      │F│   │T│   │C│     │H│   │M│   │C│
   │i│   │e│   │h│      │e│   │e│   │S│     │a│   │o│   │o│
   │n│   │a│   │a│      │e│   │m│   │D│     │r│   │i│   │n│
   │e│   │r│   │f│      │d│   │p│   │ │     │d│   │s│   │t│
   │r│   │i│   │t│      │ │   │ │   │ │     │ │   │t│   │a│
   │ │   │n│   │ │      │R│   │ │   │ │     │O│   │u│   │m│
   │W│   │g│   │ │      │a│   │ │   │ │     │r│   │r│   │i│
   │e│   │s│   │ │      │t│   │ │   │ │     │e│   │e│   │n│
   │a│   │ │   │ │      │e│   │ │   │ │     │ │   │ │   │a│
   │r│   │ │   │ │      │ │   │ │   │ │     │ │   │ │   │n│
   └─┘   └─┘   └─┘      └─┘   └─┘   └─┘     └─┘   └─┘   └─┘
   85%   60%   25%      35%   20%   15%     75%   40%   20%
```

**File:** `src/app/cerebra-demo/data/faultTreeData.js`

```javascript
export const faultTreeData = {
  name: 'Efficiency Drop (89% → 82%)',
  type: 'event',
  probability: 100,
  gate: 'AND',
  children: [
    {
      name: 'Mechanical Wear',
      type: 'category',
      probability: 85,
      gate: 'OR',
      children: [
        {
          name: 'Liner Wear Degradation',
          type: 'basic',
          probability: 85,
          evidence: ['SAP PM: 4 months since last replacement', 'Inspection: 65% thickness remaining'],
          recommendation: 'Schedule immediate replacement'
        },
        {
          name: 'Bearing Degradation',
          type: 'basic',
          probability: 60,
          evidence: ['Vibration analysis: elevated readings'],
          recommendation: 'Monitor and schedule inspection'
        },
        {
          name: 'Shaft Alignment',
          type: 'basic',
          probability: 25,
          evidence: ['Last alignment check: 6 months ago'],
          recommendation: 'Include in next maintenance window'
        }
      ]
    },
    {
      name: 'Process Conditions',
      type: 'category',
      probability: 45,
      gate: 'OR',
      children: [
        {
          name: 'Feed Rate Variance',
          type: 'basic',
          probability: 35,
          evidence: ['Control system logs show +/-15% variation'],
          recommendation: 'Optimize feed control parameters'
        },
        {
          name: 'Temperature',
          type: 'basic',
          probability: 20,
          evidence: ['Operating within normal range'],
          recommendation: 'No action required'
        },
        {
          name: 'CSS Setting Drift',
          type: 'basic',
          probability: 15,
          evidence: ['CSS set at 150mm, measured 155mm'],
          recommendation: 'Adjust during next stop'
        }
      ]
    },
    {
      name: 'Material Input',
      type: 'category',
      probability: 30,
      gate: 'OR',
      children: [
        {
          name: 'Hard Ore Feed',
          type: 'basic',
          probability: 75,
          evidence: ['Geological survey: harder ore zone entered', 'Bond Work Index increased 15%'],
          recommendation: 'Adjust blasting patterns, blend ore sources'
        },
        {
          name: 'Moisture Content',
          type: 'basic',
          probability: 40,
          evidence: ['Recent rainfall, ore moisture up 8%'],
          recommendation: 'Monitor, consider stockpile drying'
        },
        {
          name: 'Contamination',
          type: 'basic',
          probability: 20,
          evidence: ['No unusual tramp metal detected'],
          recommendation: 'No action required'
        }
      ]
    }
  ]
};
```

### Task 3.2: Redesign Fault Tree Visual Component

**File:** `src/app/cerebra-demo/components/visualizations/FaultTreeDiagram.js`

**Requirements:**
1. Use react-d3-tree with custom node rendering
2. Show probability percentages on each node
3. Color-code by severity (red = high prob, yellow = medium, green = low)
4. Show AND/OR gates between levels
5. Clicking a leaf node shows evidence details

**Node Design:**
```
┌───────────────────────┐
│ Liner Wear            │ ← Name
│ ████████████░░░░ 85%  │ ← Probability bar
│ Evidence: SAP PM...   │ ← Evidence summary
└───────────────────────┘
```

---

## PHASE 4: ADVANCED CHARTS

### Task 4.1: Integrate WearHeatmap into Agent Flow

**What:** Show the heatmap during LD Agent's analysis (currently created but not displayed)

**File:** `src/app/cerebra-demo/data/workflowQuestions.js`

**Change:** Add display step to LD agent:
```javascript
{
  id: 'LD',
  name: 'Liner Diagnostics Agent',
  steps: [
    // ... existing steps ...
    { type: 'display', component: 'WearHeatmap' },  // ADD THIS
    { type: 'display', component: 'CrusherLinerVisualization' },
  ]
}
```

### Task 4.2: Integrate BulletChart for KPI Display

**What:** Show bullet chart during TA Agent's analysis

**Change:** Add to TA agent steps:
```javascript
{ type: 'display', component: 'BulletChart' }
```

### Task 4.3: Update OutputConsole to Render New Charts

**File:** `src/app/cerebra-demo/components/OutputConsole.js`

**Add imports:**
```javascript
import WearHeatmap from './charts/WearHeatmap';
import BulletChart from './charts/BulletChart';
```

**Add rendering cases:**
```javascript
if (step.component === 'WearHeatmap') {
  return <div key={uniqueKey}><WearHeatmap /></div>;
}
if (step.component === 'BulletChart') {
  return <div key={uniqueKey}><BulletChart /></div>;
}
```

---

## PHASE 5: AESTHETIC CLEANUP

### Task 5.1: Color Palette Enforcement

**What:** Remove all non-standard colors. Only use:

| Use Case | Color | Hex |
|----------|-------|-----|
| Primary brand | Cerebra Orange | #E67E22 |
| Secondary brand | Accenture Purple | #A100FF |
| Success/Normal | Green | #10B981 |
| Warning | Yellow | #F59E0B |
| Error/Critical | Red | #EF4444 |
| Azure accent | Blue | #0078D4 |
| Text primary | Near black | #1A1A2E |
| Text secondary | Gray | #4B5563 |
| Text muted | Light gray | #9CA3AF |
| Background | White/Light | #FFFFFF / #FAFAFA |
| Borders | Light gray | #E2E8F0 |

### Task 5.2: Remove Extra Icons

**Audit files for unnecessary icons:**
- CopperMineDigitalTwin.js - Remove sidebar icons if not matching reference
- OutputConsole.js - Keep only essential icons (agent badges, tool indicators)
- ConversationPanel.js - Keep only bot avatar icon

### Task 5.3: Match Reference Screen Layout

**From reference screenshots, ensure:**
1. Header: Dark background, "accenture>" with orange chevron, title, bell, avatar
2. Main: Clean white background, no colored boxes except for alerts
3. Cards: White background, subtle border, minimal shadow
4. Buttons: Orange background for primary actions
5. Text: Clean hierarchy with proper font weights

---

## IMPLEMENTATION ORDER (DETAILED STEP-BY-STEP)

### SPRINT 1: DIGITAL TWIN (1.5 hours)

| # | Task | Description | Files | Time |
|---|------|-------------|-------|------|
| 1.1 | Create CopperValueChain.js | New component with full 6-section SVG layout | `components/CopperValueChain.js` | 30m |
| 1.2 | Create Equipment3D.js | Isometric equipment SVG renders (crusher, conveyor, mill, etc.) | `components/Equipment3D.js` | 25m |
| 1.3 | Create KPIHeaderCard.js | 4 KPI cards with icons, values, MoM changes | `components/KPIHeaderCard.js` | 15m |
| 1.4 | Create Section Labels | Orange numbered circles with uppercase titles | Within CopperValueChain.js | 10m |
| 1.5 | Add Alert Highlighting | Red pulsing border on problem equipment | CSS + component | 10m |

### SPRINT 2: ROOT CAUSE TABLE + OUTPUT CONSOLE (1 hour)

| # | Task | Description | Files | Time |
|---|------|-------------|-------|------|
| 2.1 | Create RootCauseTable.js | Purple header table with Rank/Cause/Likelihood/Evidence columns | `components/RootCauseTable.js` | 20m |
| 2.2 | Create HuddleBanner.js | Dark rounded banner with colored agent badges | `components/HuddleBanner.js` | 15m |
| 2.3 | Update OutputConsole | Integrate new components, add session header | `components/OutputConsole.js` | 15m |
| 2.4 | Style Agent Outputs | Match reference with checkmarks and bullet points | CSS updates | 10m |

### SPRINT 3: PDF GENERATION FIX (1 hour)

| # | Task | Description | Files | Time |
|---|------|-------------|-------|------|
| 3.1 | Create workOrderData.js | Complete SAP PM work order data structure | `data/workOrderData.js` | 15m |
| 3.2 | Build WorkOrderPDF.js | @react-pdf/renderer PDF document component | `components/WorkOrderPDF.js` | 25m |
| 3.3 | Fix SAPWorkOrderPreview | Multi-page preview with thumbnails + working download | `visualizations/SAPWorkOrderPreview.js` | 20m |

### SPRINT 4: CONVERSATION PANEL (30 minutes)

| # | Task | Description | Files | Time |
|---|------|-------------|-------|------|
| 4.1 | Update ConversationPanel | Purple header, purple left border on cards, timestamps | `components/ConversationPanel.js` | 15m |
| 4.2 | Add Query Input | "Enter query here" with purple send button | Within ConversationPanel | 10m |
| 4.3 | Add Session Header | Active Session + Processing Time in Output Console | `components/OutputConsole.js` | 5m |

### SPRINT 5: KNOWLEDGE GRAPH (45 minutes)

| # | Task | Description | Files | Time |
|---|------|-------------|-------|------|
| 5.1 | Create knowledgeGraphData.js | Meaningful graph showing reasoning chain | `data/knowledgeGraphData.js` | 15m |
| 5.2 | Rebuild KnowledgeGraphModal | Color-coded by type, shows flow from data to conclusions | `visualizations/KnowledgeGraphModal.js` | 30m |

### SPRINT 6: FAULT TREE DEPTH (30 minutes)

| # | Task | Description | Files | Time |
|---|------|-------------|-------|------|
| 6.1 | Create faultTreeData.js | 3-level FMEA structure with evidence | `data/faultTreeData.js` | 10m |
| 6.2 | Update FaultTreeDiagram | Custom nodes with probability bars, evidence popover | `visualizations/FaultTreeDiagram.js` | 20m |

### SPRINT 7: FINAL POLISH (30 minutes)

| # | Task | Description | Files | Time |
|---|------|-------------|-------|------|
| 7.1 | CSS Cleanup | Apply color palette, remove extra colors/icons | `styles/cerebra.css` | 15m |
| 7.2 | Integration Test | Full workflow test, fix any bugs | All | 15m |

---

## TOTAL ESTIMATED TIME: 5.5 hours

---

## FILES TO CREATE (NEW)

1. `src/app/cerebra-demo/components/CopperValueChain.js` - 6-section SVG digital twin
2. `src/app/cerebra-demo/components/Equipment3D.js` - Isometric equipment renders
3. `src/app/cerebra-demo/components/KPIHeaderCard.js` - KPI card component
4. `src/app/cerebra-demo/components/RootCauseTable.js` - Purple header probability table
5. `src/app/cerebra-demo/components/HuddleBanner.js` - Dark banner with agent badges
6. `src/app/cerebra-demo/components/WorkOrderPDF.js` - PDF document for react-pdf
7. `src/app/cerebra-demo/data/workOrderData.js` - SAP PM work order data
8. `src/app/cerebra-demo/data/knowledgeGraphData.js` - Meaningful graph data
9. `src/app/cerebra-demo/data/faultTreeData.js` - FMEA-based fault tree data

## FILES TO MODIFY

1. `src/app/cerebra-demo/components/OutputConsole.js` - Add session header, integrate new components
2. `src/app/cerebra-demo/components/ConversationPanel.js` - Purple header, left border, query input
3. `src/app/cerebra-demo/components/visualizations/SAPWorkOrderPreview.js` - Fix PDF preview/download
4. `src/app/cerebra-demo/components/visualizations/KnowledgeGraphModal.js` - Meaningful reasoning chain
5. `src/app/cerebra-demo/components/visualizations/FaultTreeDiagram.js` - Custom nodes with evidence
6. `src/app/cerebra-demo/styles/cerebra.css` - All styling updates
7. `src/app/cerebra-demo/page.js` - Replace old digital twin with CopperValueChain

---

## SUCCESS CRITERIA (DETAILED)

### 1. Digital Twin (MUST match reference image exactly)
- [ ] **Layout:** 6 numbered sections (Mining, Concentrating, Ore Beneficiation, Ore Concentrate, Tailings, Products)
- [ ] **Equipment:** 3D isometric blue-gray renders for each piece (crusher, conveyor, mill, etc.)
- [ ] **Flow Lines:** Connecting arrows between equipment
- [ ] **KPIs:** 4 cards at top (Run of Mine, Ore Processed, Copper Produced, Est. Production Loss)
- [ ] **Toggle Buttons:** "Shift Performance" (outlined) | "LPO Hotspots" (filled orange)
- [ ] **Alerts:** Red pulsing border around problem equipment
- [ ] **Style:** Light gray background, clean white cards

### 2. Root Cause Table (MUST match reference)
- [ ] **Header:** Purple background (#A100FF), white text
- [ ] **Columns:** Rank | Possible Root Cause | Likelihood (%) | Supporting Reasons
- [ ] **Rows:** Alternating white/light gray backgrounds
- [ ] **Content:** 4 causes with percentages and evidence

### 3. Huddle Banner (MUST match reference)
- [ ] **Background:** Dark gradient (navy to charcoal)
- [ ] **Title:** "Huddle In-Progress" centered, white text
- [ ] **Badges:** 5 colored circles (OA orange, MA yellow, CB blue, DI purple, CM green)
- [ ] **Shape:** Rounded corners (12px)

### 4. PDF Generation (MUST WORK)
- [ ] **Preview:** Shows multi-page document with page thumbnails
- [ ] **Content:** SAP PM work order format (header, operations, materials, labor, schedule)
- [ ] **Download:** Clicking "Download PDF" generates and downloads actual PDF file

### 5. Conversation Panel (MUST match reference)
- [ ] **Header:** Purple "Conversation" title
- [ ] **Cards:** White background, purple left border, orange bot avatar
- [ ] **Options:** Radio buttons with purple accent color
- [ ] **Timestamps:** Right-aligned, gray text
- [ ] **Input:** "Enter query here" with purple send button at bottom

### 6. Output Console (MUST match reference)
- [ ] **Header:** Orange "Output Console" title + "Active Session: XXXXXX" + "Total Processing Time: X.XX hrs"
- [ ] **Agent Outputs:** Colored badges + checkmark findings + bullet points

### 7. Knowledge Graph (MUST explain reasoning)
- [ ] **Flow:** Data Sources → Analysis → Agent Findings → Root Cause → Recommendations
- [ ] **Colors:** Blue (data), Orange (findings), Green (conclusions), Purple (recommendations)
- [ ] **Interactive:** Click nodes for details

### 8. Fault Tree (MUST have depth)
- [ ] **Levels:** 3 deep (Primary Event → Categories → Basic Events)
- [ ] **Data:** Probabilities, evidence, recommendations on each node
- [ ] **Gates:** AND/OR logic visible

### 9. Overall Aesthetic
- [ ] **Colors:** White backgrounds, purple accents, orange for CTAs
- [ ] **NO:** Extra colored boxes, unnecessary icons, "AI slop" patterns
- [ ] **Typography:** Clean hierarchy, proper weights
- [ ] **Match:** Reference screenshots exactly

