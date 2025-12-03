# Cerebra Demo - World-Class Redesign Plan

## Executive Summary

Complete redesign using enterprise-grade visualization libraries to create a pixel-perfect, interactive multi-agent demonstration that looks like a finished product (not a demo).

---

## PART 1: VISUALIZATION LIBRARY RESEARCH & SELECTION

### 1.1 Digital Twin / Process Flow Visualization

**Requirement:** Pixel-perfect industrial schematic for copper mine with real-time data overlay

**Option A: Use Provided Image with Data Overlay**
- **Library:** `react-image-mapper` or custom SVG overlay
- **Approach:** Use your Copper Mine Overview image as base
- **Overlay:** React components positioned absolutely with real-time metrics
- **Pros:** Looks exactly like reference, authentic industrial diagram
- **Cons:** Need to clean up image, define clickable regions
- **Recommendation:** ⭐⭐⭐⭐⭐ BEST for authenticity

**Option B: React Flow / Xyflow**
- **Library:** `@xyflow/react` (formerly ReactFlow)
- **Use Case:** Interactive node-based diagrams
- **Examples:** Process automation, data pipelines
- **Pros:** Interactive, zoom/pan, custom nodes
- **Cons:** Requires building all equipment nodes
- **Recommendation:** ⭐⭐⭐ Good for interactive editing, overkill for demo

**Option C: Mermaid.js for Flowcharts**
- **Library:** `react-mermaid2` or `mermaid`
- **Recommendation:** ⭐⭐ Too simplistic for industrial schematics

**SELECTED APPROACH:**
Use the actual Copper Mine Overview image with custom React overlay components for:
- KPI cards (positioned absolutely)
- Equipment status badges
- Alert indicators
- Clickable hotspots on equipment

### 1.2 Data Visualization (Charts/Graphs)

**Requirement:** NYT/McKinsey quality charts - professional, clean, beautiful

**Option A: Nivo Charts**
- **Library:** `@nivo/line`, `@nivo/bar`
- **Quality:** ⭐⭐⭐⭐⭐ Professional, customizable, responsive
- **Examples:** Used by enterprise dashboards
- **Features:**
  - Smooth animations
  - Clean defaults
  - Highly customizable
  - Accessibility built-in
- **Recommendation:** BEST for timeseries, bar charts

**Option B: Recharts**
- **Library:** `recharts`
- **Quality:** ⭐⭐⭐⭐ Good, but less polished than Nivo
- **Recommendation:** Backup option

**Option C: Victory Charts**
- **Library:** `victory`
- **Quality:** ⭐⭐⭐ Decent but older

**Option D: D3.js (raw)**
- **Quality:** ⭐⭐⭐⭐⭐ Ultimate control
- **Recommendation:** Too much work for demo timeline

**SELECTED:**
- **Primary:** Nivo Charts for all data visualization
- **Timeseries:** `@nivo/line` with custom theme
- **Bar charts:** `@nivo/bar` for comparisons
- **Heatmaps:** `@nivo/heatmap` for wear patterns

### 1.3 3D/Industrial Equipment Visualization

**Requirement:** High-quality crusher liner visualization (not ugly table)

**Option A: Three.js / React Three Fiber**
- **Library:** `@react-three/fiber`, `@react-three/drei`
- **Use Case:** 3D rendering of industrial equipment
- **Quality:** ⭐⭐⭐⭐⭐ Film-quality 3D
- **Pros:** Can show 3D crusher liner with wear patterns
- **Cons:** Learning curve, bundle size
- **Recommendation:** ⭐⭐⭐⭐ Excellent for "wow" factor

**Option B: Isometric SVG with Gradients**
- **Custom implementation**
- **Quality:** ⭐⭐⭐⭐ Professional if done right
- **Recommendation:** ⭐⭐⭐⭐ Faster implementation

**Option C: Canvas-based rendering**
- **Library:** `konva` or raw canvas
- **Recommendation:** ⭐⭐⭐ More complex than needed

**SELECTED:**
- **Crusher Liner:** Custom isometric SVG with gradients showing 3D depth
- **Wear Pattern:** Color-coded cross-section with thickness annotations
- **Style:** Industrial CAD drawing aesthetic

### 1.4 Knowledge Graph Visualization

**Requirement:** Azure Cosmos DB graph showing agent memory connections

**Option A: React Force Graph**
- **Library:** `react-force-graph-2d` or `react-force-graph-3d`
- **Quality:** ⭐⭐⭐⭐⭐ Beautiful, interactive
- **Features:**
  - Force-directed layout
  - Node clustering
  - Interactive exploration
  - Zoom/pan
- **Recommendation:** ⭐⭐⭐⭐⭐ BEST choice

**Option B: Cytoscape.js**
- **Library:** `cytoscape` with `react-cytoscapejs`
- **Quality:** ⭐⭐⭐⭐ Professional
- **Recommendation:** ⭐⭐⭐⭐ Good alternative

**Option C: vis.js Network**
- **Library:** `vis-network`
- **Quality:** ⭐⭐⭐ Older, less modern

**SELECTED:**
- **react-force-graph-2d** for knowledge graph
- Show nodes: Agents, Documents, Findings, Equipment
- Show edges: Relationships, Context Passing, Dependencies
- Color-coded by type

### 1.5 Fault Tree Analysis (FTA)

**Requirement:** Engineering-grade fault tree diagram

**Option A: Custom D3 Tree**
- **Implementation:** D3.js tree layout
- **Quality:** ⭐⭐⭐⭐⭐ Professional
- **Recommendation:** ⭐⭐⭐⭐⭐ Best control

**Option B: React D3 Tree**
- **Library:** `react-d3-tree`
- **Quality:** ⭐⭐⭐⭐
- **Recommendation:** ⭐⭐⭐⭐ Faster implementation

**SELECTED:**
- **react-d3-tree** for fault tree
- Show: Primary event → Contributing factors → Root causes
- Gates: AND/OR logic gates
- Probabilities on each branch

### 1.6 SAP Work Order PDF Generation

**Requirement:** Realistic SAP PM work order document

**Option A: React-PDF**
- **Library:** `@react-pdf/renderer`
- **Quality:** ⭐⭐⭐⭐⭐ Generates actual PDFs
- **Features:**
  - PDF generation in browser
  - Can preview before download
  - Styled components
- **Recommendation:** ⭐⭐⭐⭐⭐ BEST

**Option B: jsPDF**
- **Library:** `jspdf`
- **Quality:** ⭐⭐⭐ More manual
- **Recommendation:** ⭐⭐⭐ Backup

**SELECTED:**
- **@react-pdf/renderer** for work order generation
- Template: SAP PM Work Order format
- Fields: Order #, Equipment, Description, Parts, Labor, Schedule

---

## PART 2: REVISED WORKFLOW & INTERACTION MODEL

### 2.1 Workflow Architecture (Step-by-Step)

```
SCENE 1: LOGIN
  └─> User clicks "Login with Microsoft"

SCENE 2: MINING OVERVIEW
  └─> Shows Copper Mine digital twin (using actual image)
  └─> User clicks Primary Crusher (red alert box)

SCENE 3: INITIAL ANALYSIS
  ├─> Conversation Panel:
  │   └─> Q1: "Analyze efficiency drop 89% → 82%?"
  │       └─> User clicks "Yes" → Q1 locks
  │   
  └─> Output Console:
      └─> Shows: "Waiting for Question 2..."

  ├─> Conversation Panel:
  │   └─> Q2: "Do you want detailed RCA?"
  │       └─> User clicks "Yes" → Q2 locks
  │
  └─> Output Console:
      ├─> CA (Cerebra Agent) appears
      ├─> [THINKING] Performing initial fault analysis...
      ├─> [TOOL] fmea_analysis(equipment="primary_crusher")
      │   └─> Results: 4 probable failure modes identified
      ├─> [DISPLAY] Fault Tree Diagram appears
      │   └─> Shows: Efficiency Drop → 4 branches
      │       - Liner wear (probability: 85%)
      │       - Hard ore composition (probability: 75%)
      │       - Bearing degradation (probability: 60%)
      │       - Feed rate issues (probability: 35%)
      ├─> [STOP] Analysis paused
      └─> [MESSAGE] "Select a scenario to investigate..."

  ├─> Conversation Panel:
  │   └─> Q3: "Which scenario?" (DYNAMICALLY GENERATED)
  │       Options populated from fault tree:
  │       ○ Liner wear degradation (85% likely)
  │       ○ Hard ore feed composition (75% likely)
  │       ○ Bearing degradation (60% likely)
  │       ○ Feed rate overload (35% likely)
  │       └─> User selects "Liner wear" → Q3 locks
  │
  └─> Output Console:
      └─> [MESSAGE] "Initiating Trusted Huddle for deep dive analysis..."

SCENE 4: TRUSTED HUDDLE (COLLABORATIVE ANALYSIS)
  └─> Output Console:
      ├─> Huddle banner appears with 5 agent badges
      ├─> Agent 1 (RO) activates:
      │   ├─> [RETRIEVE] Accessing shared context about liner wear hypothesis
      │   ├─> [TOOL] sap_pm_query(equipment="CRUSHER_001", focus="liner")
      │   ├─> [DISPLAY] SAP maintenance history table
      │   ├─> [MEMORY] Storing liner maintenance intelligence
      │   └─> [COMPLETE] RO finished (8s)
      │
      ├─> Agent 2 (TA) activates:
      │   ├─> [RETRIEVE] Accessing RO findings
      │   ├─> [TOOL] query_timeseries(metric="efficiency", days=30)
      │   ├─> [DISPLAY] **NIVO LINE CHART** - Beautiful efficiency trend
      │   ├─> [ANALYSIS] Correlation with liner age: 0.92
      │   ├─> [MEMORY] Storing timeseries evidence
      │   └─> [COMPLETE] TA finished (10s)
      │
      ├─> Agent 3 (MI) activates:
      │   ├─> [RETRIEVE] Accessing TA correlation data
      │   ├─> [TOOL] query_inspection_reports()
      │   ├─> [DISPLAY] Inspection findings list
      │   ├─> [TOOL] calculate_lifecycle_analysis()
      │   ├─> [DISPLAY] Lifecycle comparison chart (expected vs actual)
      │   └─> [COMPLETE] MI finished (9s)
      │
      ├─> Agent 4 (IL) activates:
      │   ├─> [TOOL] query_inventory_system()
      │   ├─> [DISPLAY] Parts availability table
      │   ├─> [DISPLAY] **INTERACTIVE KNOWLEDGE GRAPH** button appears
      │   │   └─> Click to see: Parts → Suppliers → Lead Times graph
      │   └─> [COMPLETE] IL finished (7s)
      │
      └─> Agent 5 (LD) activates:
          ├─> [TOOL] analyze_liner_wear_pattern()
          ├─> [DISPLAY] **3D ISOMETRIC LINER VISUAL** with wear zones
          ├─> [TOOL] calculate_remaining_life()
          ├─> [DISPLAY] Remaining life gauge/chart
          ├─> [MEMORY] Final diagnostic complete
          └─> [COMPLETE] LD finished (10s)

  ├─> [PAUSE] Huddle complete
  └─> [INTERACTION POINT]

  ├─> Conversation Panel:
  │   └─> Q4: "Huddle complete. View detailed knowledge graph?"
  │       ○ Yes, show me the graph
  │       ○ No, proceed to recommendations
  │       └─> If "Yes":
  │           └─> Output Console: Shows full knowledge graph modal
  │               (Nodes: 5 agents, 12 documents, 8 findings, 1 equipment)
  │               (Edges: Retrieved, Analyzed, Stored, Referenced)
  │
  └─> If user clicks "No" or closes graph:

  ├─> Conversation Panel:
  │   └─> Q5: "Do you want short-term and long-term recommendations?"
  │       └─> User clicks "Yes"
  │
  └─> Output Console:
      ├─> AR (Actions Recommendation Agent) appears
      ├─> [THINKING] Synthesizing multi-agent findings...
      ├─> [ANALYSIS] Generating prioritized action plan
      ├─> [DISPLAY] Immediate/Near-Term/Long-Term actions
      │   (Clean bullets, no colored boxes)
      ├─> [STOP] Recommendations shown
      └─> [INTERACTION POINT]

  ├─> Conversation Panel:
  │   └─> Q6: "Create maintenance notification and pre-populate SAP work order?"
  │       └─> User clicks "Yes"
  │
  └─> Output Console:
      ├─> WO (Work Order Agent) appears
      ├─> [TOOL] sap_pm_create_notification()
      │   └─> Notification #: 10075234 created
      ├─> [TOOL] sap_pm_draft_work_order()
      │   └─> Work Order #: WO-2025-0147 drafted
      ├─> [DISPLAY] **SAP WORK ORDER PDF PREVIEW**
      │   ├─> Header: Equipment, Priority, Type
      │   ├─> Description: Liner replacement
      │   ├─> Parts list: CJ-8845 (4 units)
      │   ├─> Labor: James Morrison + crew
      │   ├─> Schedule: Start date, duration (8hrs)
      │   └─> [BUTTON] Download Work Order PDF
      └─> [COMPLETE] Work order ready for approval

END OF DEMO
```

### 2.2 Interaction Points Summary

| Step | Conversation Panel | Output Console | Wait for User? |
|------|-------------------|----------------|----------------|
| 1 | Q1: Analyze drop? | Empty | YES |
| 2 | Q2: Do RCA? | "Waiting..." | YES |
| 3 | (Q2 answered) | CA: Initial fault analysis, Fault Tree | NO (auto-show) |
| 4 | Q3: Which scenario? | Fault tree displayed, waiting | YES |
| 5 | (Q3 answered) | Trusted Huddle starts (5 agents, 44s) | NO (auto-play) |
| 6 | Q4: View knowledge graph? | Huddle complete | YES |
| 7 | (Q4 answered) | Knowledge graph modal (if Yes) | OPTIONAL |
| 8 | Q5: Want recommendations? | Waiting | YES |
| 9 | (Q5 answered) | AR Agent, recommendations display | NO (auto-show) |
| 10 | Q6: Create work order? | Recommendations shown | YES |
| 11 | (Q6 answered) | WO Agent, SAP PDF preview | NO (auto-show) |

**Total interaction points:** 6 user decisions
**Total demo time:** 90-120 seconds

---

## PART 3: DETAILED COMPONENT SPECIFICATIONS

### 3.1 Digital Twin with Image Overlay

**File:** `components/CopperMineDigitalTwin.js`

**Implementation:**
```javascript
import React from 'react';
import Image from 'next/image';

export default function CopperMineDigitalTwin({ onEquipmentClick }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      {/* Base image */}
      <Image
        src="/img/copper-mine-overview.jpg" // Your provided image
        alt="Copper Mine Process Flow"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
      
      {/* KPI Overlay Cards */}
      <KPIOverlay top="20px" left="20px" label="Run of Mine" value="124,500" change="-7.62%" />
      <KPIOverlay top="20px" left="200px" label="Ore Processed" value="107,700" change="-7.68%" />
      
      {/* Equipment Alert Badges */}
      <AlertBadge
        top="180px"
        left="250px"
        severity="critical"
        onClick={() => onEquipmentClick('primary_crusher')}
      >
        PRIMARY CRUSHER: 82% (-7%)
      </AlertBadge>
      
      {/* Clickable Hotspots */}
      <ClickableHotspot
        top="150px"
        left="220px"
        width="120px"
        height="100px"
        onClick={() => onEquipmentClick('primary_crusher')}
        isPulsing={true}
      />
    </div>
  );
}
```

### 3.2 Nivo Timeseries Chart

**File:** `components/charts/EfficiencyTrendChart.js`

**Library:** `@nivo/line`

```javascript
import { ResponsiveLine } from '@nivo/line';

const data = [{
  id: 'efficiency',
  data: [
    { x: 'Day 1', y: 89 },
    { x: 'Day 5', y: 89 },
    { x: 'Day 10', y: 88 },
    { x: 'Day 15', y: 87 },
    { x: 'Day 16', y: 84 }, // Anomaly
    { x: 'Day 20', y: 83 },
    { x: 'Day 25', y: 82 },
    { x: 'Day 30', y: 82 },
  ]
}];

export default function EfficiencyTrendChart() {
  return (
    <div style={{ height: '300px', background: 'white', padding: '20px' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 75, max: 95 }}
        axisBottom={{ legend: 'Time Period', legendOffset: 36 }}
        axisLeft={{ legend: 'Efficiency (%)', legendOffset: -50 }}
        colors={['#E67E22']}
        pointSize={8}
        pointColor="#E67E22"
        pointBorderWidth={2}
        pointBorderColor="#fff"
        enableGridX={false}
        enableGridY={true}
        gridYValues={[80, 85, 90]}
        theme={{
          axis: {
            ticks: { text: { fill: '#718096', fontSize: 11 } },
            legend: { text: { fill: '#4a5568', fontSize: 12, fontWeight: 600 } }
          },
          grid: { line: { stroke: '#e2e8f0' } }
        }}
        markers={[
          {
            axis: 'x',
            value: 'Day 16',
            lineStyle: { stroke: '#EF4444', strokeWidth: 2, strokeDasharray: '4 4' },
            legend: 'Anomaly Detected',
            legendPosition: 'top',
          }
        ]}
      />
    </div>
  );
}
```

**Visual Quality:** McKinsey/NYT level - clean, professional, data-first

### 3.3 3D Crusher Liner Visualization

**File:** `components/visualizations/CrusherLinerIsometric.js`

**Approach:** Isometric SVG with depth/shadows

```javascript
export default function CrusherLinerIsometric() {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
        Crusher Liner Wear Analysis
      </h4>
      
      <svg viewBox="0 0 500 400" style={{ width: '100%' }}>
        {/* Isometric 3D liner view */}
        {/* Front face */}
        <path
          d="M 100,100 L 400,100 L 400,300 L 100,300 Z"
          fill="url(#linerGradient)"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        
        {/* Top face (isometric) */}
        <path
          d="M 100,100 L 150,70 L 450,70 L 400,100 Z"
          fill="#cbd5e0"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        
        {/* Right face (isometric) */}
        <path
          d="M 400,100 L 450,70 L 450,270 L 400,300 Z"
          fill="#9ca3af"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        
        {/* Wear zones with gradients */}
        <defs>
          <linearGradient id="linerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCA5A5" /> {/* Critical - Red */}
            <stop offset="33%" stopColor="#FCD34D" /> {/* Moderate - Yellow */}
            <stop offset="100%" stopColor="#6EE7B7" /> {/* Good - Green */}
          </linearGradient>
        </defs>
        
        {/* Measurement annotations */}
        <line x1="100" y1="200" x2="80" y2="200" stroke="#4a5568" strokeWidth="1" />
        <text x="70" y="205" fontSize="11" textAnchor="end" fill="#4a5568">
          Feed Side: 65mm (65%)
        </text>
        
        <line x1="400" y1="200" x2="420" y2="200" stroke="#4a5568" strokeWidth="1" />
        <text x="430" y="205" fontSize="11" fill="#4a5568">
          Discharge: 95mm (95%)
        </text>
        
        {/* Legend */}
        <g transform="translate(100, 330)">
          <rect x="0" y="0" width="20" height="12" fill="#FCA5A5" />
          <text x="25" y="10" fontSize="10" fill="#1a1a1a">Critical (40-65%)</text>
          
          <rect x="140" y="0" width="20" height="12" fill="#FCD34D" />
          <text x="165" y="10" fontSize="10" fill="#1a1a1a">Moderate (66-80%)</text>
          
          <rect x="280" y="0" width="20" height="12" fill="#6EE7B7" />
          <text x="305" y="10" fontSize="10" fill="#1a1a1a">Good (81-100%)</text>
        </g>
      </svg>
      
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#4a5568', borderLeft: '3px solid #EF4444', paddingLeft: '12px' }}>
        <strong>Finding:</strong> Severe uneven wear pattern. Feed side at critical threshold (65%).
        Estimated remaining operational life: 5-7 days under current load.
      </div>
    </div>
  );
}
```

### 3.4 Knowledge Graph Modal

**File:** `components/visualizations/KnowledgeGraphModal.js`

**Library:** `react-force-graph-2d`

```javascript
import ForceGraph2D from 'react-force-graph-2d';

export default function KnowledgeGraphModal({ isOpen, onClose }) {
  const graphData = {
    nodes: [
      // Agents
      { id: 'RO', label: 'Resource Orchestration', type: 'agent', color: '#F59E0B' },
      { id: 'TA', label: 'Timeseries Analysis', type: 'agent', color: '#EF4444' },
      { id: 'MI', label: 'Maintenance Intelligence', type: 'agent', color: '#8B5CF6' },
      { id: 'IL', label: 'Inventory & Logistics', type: 'agent', color: '#10B981' },
      { id: 'LD', label: 'Liner Diagnostics', type: 'agent', color: '#3B82F6' },
      
      // Documents/Data
      { id: 'SAP_PM', label: 'SAP PM Records', type: 'data', color: '#0078D4' },
      { id: 'TIMESERIES', label: 'Efficiency Data', type: 'data', color: '#0078D4' },
      { id: 'INVENTORY', label: 'Parts Inventory', type: 'data', color: '#0078D4' },
      { id: 'MANUALS', label: 'OEM Manuals', type: 'data', color: '#0078D4' },
      
      // Findings
      { id: 'ROOT_CAUSE', label: 'Liner Wear (87%)', type: 'finding', color: '#10B981' },
      { id: 'EVIDENCE', label: 'Timeseries Evidence', type: 'finding', color: '#10B981' },
    ],
    links: [
      { source: 'RO', target: 'SAP_PM', label: 'queries' },
      { source: 'SAP_PM', target: 'ROOT_CAUSE', label: 'supports' },
      { source: 'TA', target: 'TIMESERIES', label: 'analyzes' },
      { source: 'TIMESERIES', target: 'EVIDENCE', label: 'provides' },
      { source: 'EVIDENCE', target: 'ROOT_CAUSE', label: 'validates' },
      { source: 'MI', target: 'SAP_PM', label: 'retrieves' },
      { source: 'MI', target: 'MANUALS', label: 'references' },
      { source: 'IL', target: 'INVENTORY', label: 'checks' },
      { source: 'LD', target: 'ROOT_CAUSE', label: 'confirms' },
    ]
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '900px',
        height: '600px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>
            Multi-Agent Knowledge Graph
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        
        <div style={{ fontSize: '12px', color: '#718096', marginBottom: '12px' }}>
          Azure Cosmos DB Graph Database - Agent Memory & Context
        </div>
        
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="label"
          nodeColor={(node) => node.color}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.1}
          linkLabel="label"
          width={850}
          height={480}
        />
      </div>
    </div>
  );
}
```

### 3.5 Fault Tree Diagram

**File:** `components/visualizations/FaultTreeDiagram.js`

**Library:** `react-d3-tree`

```javascript
import Tree from 'react-d3-tree';

const faultTreeData = {
  name: 'Primary Crusher\nEfficiency Drop\n(89% → 82%)',
  attributes: {
    probability: '100%',
    severity: 'HIGH'
  },
  children: [
    {
      name: 'Liner Wear\nDegradation',
      attributes: { probability: '85%', evidence: 'SAP PM, Inspections' },
      nodeSvgShape: { shape: 'circle', shapeProps: { r: 10, fill: '#EF4444' } }
    },
    {
      name: 'Hard Ore Feed\nComposition',
      attributes: { probability: '75%', evidence: 'Geological data' },
      nodeSvgShape: { shape: 'circle', shapeProps: { r: 10, fill: '#F59E0B' } }
    },
    {
      name: 'Bearing\nDegradation',
      attributes: { probability: '60%', evidence: 'Vibration analysis' },
      nodeSvgShape: { shape: 'circle', shapeProps: { r: 10, fill: '#FCD34D' } }
    },
    {
      name: 'Feed Rate\nOverload',
      attributes: { probability: '35%', evidence: 'Process data' },
      nodeSvgShape: { shape: 'circle', shapeProps: { r: 10, fill: '#6EE7B7' } }
    },
  ]
};

export default function FaultTreeDiagram() {
  return (
    <div style={{ height: '400px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
        Fault Tree Analysis (FMEA)
      </h4>
      <Tree
        data={faultTreeData}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: 250, y: 50 }}
        nodeSize={{ x: 150, y: 100 }}
        styles={{
          links: { stroke: '#cbd5e0', strokeWidth: 2 },
          nodes: { node: { name: { stroke: 'none', fill: '#1a1a1a', fontSize: 11 } } }
        }}
      />
    </div>
  );
}
```

### 3.6 SAP Work Order PDF

**File:** `components/documents/SAPWorkOrderPDF.js`

**Library:** `@react-pdf/renderer`

```javascript
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#1a1a1a' },
  section: { marginBottom: 15 },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#cbd5e0' },
  tableRow: { flexDirection: 'row' },
  tableCell: { padding: 5, borderRightWidth: 1, borderRightColor: '#cbd5e0' },
});

const WorkOrderDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>SAP PM Work Order</Text>
      
      <View style={styles.section}>
        <Text>Order Number: WO-2025-0147</Text>
        <Text>Equipment: Primary Crusher (CRUSHER_001)</Text>
        <Text>Priority: HIGH</Text>
        <Text>Type: Preventive Maintenance - Liner Replacement</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Description:</Text>
        <Text>Replace worn jaw liner due to efficiency degradation (89% → 82%).
        Root cause analysis indicates liner thickness at 65% (critical threshold).
        Exceeds expected 4-month lifecycle by 25%.</Text>
      </View>
      
      {/* Parts List Table */}
      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Parts Required:</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '40%' }]}>Part Number</Text>
            <Text style={[styles.tableCell, { width: '30%' }]}>Description</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>Qty</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>Location</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '40%' }]}>CJ-8845</Text>
            <Text style={[styles.tableCell, { width: '30%' }]}>Crusher Jaw Liner</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>1</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>WH-2</Text>
          </View>
          {/* More parts... */}
        </View>
      </View>
      
      {/* Labor Assignment */}
      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Labor Assignment:</Text>
        <Text>Lead: James Morrison (Crusher Specialist L2)</Text>
        <Text>Support: 2x Fitters, 1x Electrician</Text>
        <Text>Estimated Duration: 8 hours</Text>
      </View>
      
      {/* Schedule */}
      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Schedule:</Text>
        <Text>Planned Start: 16-Jan-2025 07:00 AWST</Text>
        <Text>Planned Finish: 16-Jan-2025 15:00 AWST</Text>
      </View>
    </Page>
  </Document>
);

export default function SAPWorkOrderPreview() {
  return (
    <div style={{ height: '600px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <PDFViewer width="100%" height="100%" showToolbar={false}>
        <WorkOrderDocument />
      </PDFViewer>
    </div>
  );
}
```

---

## PART 4: PACKAGE DEPENDENCIES TO ADD

```json
{
  "dependencies": {
    "@nivo/core": "^0.87.0",
    "@nivo/line": "^0.87.0",
    "@nivo/bar": "^0.87.0",
    "@nivo/heatmap": "^0.87.0",
    "react-force-graph-2d": "^1.25.4",
    "react-d3-tree": "^3.6.2",
    "@react-pdf/renderer": "^3.4.4",
    "react-image-mapper": "^1.1.0"
  }
}
```

**Why these libraries:**
- **Nivo:** Enterprise-grade charts, used by major companies, beautiful defaults
- **react-force-graph:** Best knowledge graph visualization
- **react-d3-tree:** Clean fault tree diagrams
- **@react-pdf/renderer:** Generate actual SAP work order PDFs
- **react-image-mapper:** Overlay hotspots on base image

---

## PART 5: IMPLEMENTATION ROADMAP

### Phase 1: Library Installation & Setup (15 min)
1. Install all visualization libraries
2. Test imports
3. Create wrapper components

### Phase 2: Digital Twin with Image (45 min)
1. Clean up Copper Mine Overview image (if needed)
2. Create overlay component
3. Position KPI cards
4. Add alert badges
5. Define clickable hotspots

### Phase 3: Workflow Redesign (60 min)
1. Add Q4, Q5, Q6 to conversation flow
2. Implement CA Agent initial fault analysis
3. Add Fault Tree Diagram
4. Dynamically generate Q3 options from fault tree
5. Move Trusted Huddle to happen AFTER Q3
6. Add interaction points between steps

### Phase 4: High-Quality Visualizations (90 min)
1. Replace simple timeseries with Nivo chart
2. Create 3D isometric liner visual
3. Add knowledge graph modal with button
4. Implement fault tree with react-d3-tree
5. Create SAP work order PDF component

### Phase 5: Detailed Tool Calls & SAP Integration (45 min)
1. Expand SAP queries with specific parameters
2. Show connection protocols
3. Add database/collection names to memory updates
4. Show context passing details

### Phase 6: Testing & Polish (60 min)
1. End-to-end workflow test
2. Verify all interaction points work
3. Check visual quality on large screen
4. Ensure no console errors
5. Verify timing feels natural
6. Test knowledge graph interactions

**Total estimated time:** 5.5 hours

---

## PART 6: TESTING PROTOCOL

### Pre-Launch Checklist

**Visual Quality Standards:**
- [ ] All charts look McKinsey/NYT quality
- [ ] No cheap-looking elements
- [ ] White backgrounds only
- [ ] Clean typography
- [ ] Professional spacing
- [ ] No colored boxes (only left-border accents)

**Interaction Flow:**
- [ ] User must answer Q1, Q2 before any output
- [ ] Fault tree appears, analysis pauses
- [ ] Q3 options generated from fault tree
- [ ] Huddle starts only after Q3 answered
- [ ] Q4 asks about knowledge graph
- [ ] Q5 asks about recommendations
- [ ] Q6 asks about work order
- [ ] Each step waits for user confirmation

**Visualizations:**
- [ ] Nivo charts render beautifully
- [ ] 3D liner visual looks professional
- [ ] Knowledge graph is interactive
- [ ] Fault tree is clear and readable
- [ ] SAP PDF looks authentic

**Performance:**
- [ ] No lag or stuttering
- [ ] Animations smooth
- [ ] No console errors
- [ ] Total demo: 90-120 seconds

---

## PART 7: LIBRARY SHOWCASE EXAMPLES

### Nivo Line Chart (Actual Output)
```
Efficiency Trend (Last 30 Days)
─────────────────────────────────────
90% ├─────────────┐
    │              ╲
85% │               ╲
    │                ●─── Anomaly (Day 16)
80% │                 ╲
    │                  ─────────
75% └─────────────────────────────→
    Day 1    Day 15    Day 30
```

### Knowledge Graph (Actual Output)
```
      [RO]────queries────>[SAP PM]
       │                     │
    shares                supports
       │                     │
       ↓                     ↓
      [TA]───analyzes───>[TIMESERIES]───provides───>[EVIDENCE]
       │                                                │
    validates                                      validates
       │                                                │
       └────────────────────>[ROOT CAUSE]<─────────────┘
```

### Fault Tree (Actual Output)
```
          [Efficiency Drop 89%→82%]
                    │
        ┌───────────┼───────────┬─────────┐
        │           │           │         │
    [Liner]    [Hard Ore]   [Bearing] [Feed Rate]
     85%         75%          60%       35%
```

---

## Next Steps

1. **Install libraries** → `npm install @nivo/line @nivo/core react-force-graph-2d react-d3-tree @react-pdf/renderer`
2. **Image preparation** → Clean Copper Mine Overview image, save to `/public/img/`
3. **Implement workflow** → Add Q4, Q5, Q6 and pause points
4. **Build visualizations** → Nivo charts, 3D liner, knowledge graph, fault tree
5. **SAP PDF** → Work order document generation
6. **Test thoroughly** → Full walkthrough with checklist

**Estimated completion:** 5-6 hours focused work

