# Implementation Plan: Supply Chain & MRO Operations Intelligence Module

## Executive Summary

Build a new domain mode ("Aviation MRO & Supply Chain") inside the existing Cerebra demo application that replicates the depth and flow of the Palantir Foundry demo — combining AI-driven ontology, alert triage, scenario simulation, action packs, and MBH revenue assurance — while maintaining the exact look, feel, and branding of the current codebase. Zero regression risk: no existing files are modified except `domainModes.js` (one new entry) and `page.js` (additive switch cases).

---

## 1. Architecture: How It Fits Without Breaking Anything

### 1.1 Domain Mode System (Existing Pattern)

The app already supports multiple domains via `domainModes.js`. Each domain is fully self-contained:

```
DOMAIN_MODE_IDS = {
  MAINTENANCE: 'maintenance',           ← existing
  WAIO_SHIFT_OPTIMISER: 'waioShiftOptimiser',  ← existing
  MRO_SUPPLY_CHAIN: 'mroSupplyChain',  ← NEW
}
```

Adding the new domain requires **only additive changes**:
- **`domainModes.js`** — Add one new entry with 5 lazy imports (same shape as WAIO)
- **`page.js`** — Add `else if (domainMode === 'mroSupplyChain')` branches in `handleAnswer` and `handleStageComplete` (no changes to existing branches)
- **`OutputConsole.js`** — Add conditional renders for new stage IDs (additive `&&` blocks)
- **`CerebraHeader.js`** — Already renders all entries from `DOMAIN_MODES` dynamically

Everything else is **new files only** — zero risk of regression.

### 1.2 New File Structure

```
src/app/cerebra-demo/
├── data/mro/                              ← NEW FOLDER
│   ├── mroWorkflowQuestions.js            # 12-question workflow tree
│   ├── mroScenarioContext.js              # Background data for 3 scenarios
│   ├── mroScenarioVariants.js             # Variant rotation (like WAIO)
│   ├── mroNotifications.js                # Alert notifications
│   ├── mroProcessFlowData.js              # MRO operations overview data
│   ├── mroAgentConfig.js                  # Agent definitions (7 agents)
│   ├── mroOntologyData.js                 # Object types, relationships
│   ├── mroAlertData.js                    # Alert table rows
│   ├── mroKPIData.js                      # KPI definitions + values
│   ├── mroScenarioOptions.js              # What-if simulation options
│   ├── mroActionPackData.js               # Action pack templates
│   ├── mroAutomationData.js               # Automation rules
│   └── mroMBHData.js                      # MBH revenue assurance data
│
├── components/outputStages/mro/           ← NEW FOLDER
│   ├── MROControlTowerStage.js            # Step 1: Global ops view
│   ├── MROAIPAgentStage.js                # Step 2: Ask the AI agent
│   ├── MROAlertTriageStage.js             # Step 3: Alert workbench
│   ├── MROAlertDetailStage.js             # Step 4: Alert investigation
│   ├── MROScenarioBuilderStage.js         # Step 5: What-if simulator
│   ├── MROActionPackStage.js              # Step 6: Execute action pack
│   ├── MROApprovalStage.js                # Step 6b: Approval workflow
│   ├── MROMBHDashboardStage.js            # Step 7: MBH revenue view
│   ├── MROAutomationStage.js              # Step 7b: Automation library
│   ├── MROAgentNetworkStage.js            # Agent activation display
│   ├── MROOntologyExplorerStage.js        # Ontology drill-down
│   └── shared/                            # Shared sub-components
│       ├── AlertTable.js
│       ├── KPITileStrip.js
│       ├── TimelineChart.js
│       ├── CausalGraph.js
│       ├── ScenarioComparisonCards.js
│       ├── ActionPackBuilder.js
│       ├── ApprovalModal.js
│       ├── OntologyObjectCard.js
│       └── AutomationCard.js
│
├── components/MROOperationsFlowDiagram.js ← NEW (overview SVG)
├── components/MROKPIStrip.js              ← NEW (KPI strip)
└── components/MROOntologyGraphModal.js    ← NEW (ontology modal)
```

### 1.3 Files Modified (Additive Only)

| File | Change Type | Risk |
|------|-------------|------|
| `domainModes.js` | Add 1 entry to `DOMAIN_MODE_IDS` + `DOMAIN_MODES` | Zero — existing entries untouched |
| `page.js` | Add `else if` branches for new question IDs | Zero — falls through to existing logic |
| `OutputConsole.js` | Add conditional renders for `mro_*` stages | Zero — existing stages untouched |
| `ConversationPanel.js` | Add MRO generation stages constant | Zero — existing constants untouched |
| `CerebraHeader.js` | Already dynamic — no changes needed | Zero |

---

## 2. Scenarios & Narrative Flow

### 2.1 Three Core Scenarios (Rotated Like WAIO Variants)

**Scenario A: C-Check Critical Spares Replanning**
- Aircraft arrives early for heavy maintenance check
- 3 critical parts flagged as at-risk for need date
- Planner must decide: expedite PO, transfer from another pool, use alternate part, or borrow from rotable pool
- Actions go through approval workflow before SAP write-back

**Scenario B: Component Pool Rebalancing (AOG Prevention)**
- Outstation inventory below safety stock for high-demand rotable
- Repair TAT for 2 units slipping beyond SLA
- Risk of Aircraft-on-Ground event at regional hub
- System recommends: reprioritize repair shop queue, reposition serviceable from another site, expedite vendor repair

**Scenario C: MBH Revenue Exception & Contract Reconciliation**
- Flying hours reported by airline operator don't match accrual model
- Revenue exception flagged: $240K discrepancy in quarterly billing
- Investigation reveals: 2 aircraft utilisation change unreported + 1 component swap not captured
- Action: adjust accrual, create billing correction, update contract parameters

### 2.2 Generic Positioning (Not ST-branded)

All UI text will use generic industry terminology:
- "MRO Operations" not "ST Engineering"
- "Aviation MRO & Supply Chain" as domain label
- "Operations Intelligence Platform" as header
- Generic airline codes (e.g., "Operator Alpha", "Fleet-A320neo")
- Generic facility names (e.g., "Hangar Site 1", "Component Shop East")

---

## 3. Workflow Design (12 Questions, 10 Output Stages)

### 3.1 Question Flow Map

```
mro_q1: "Alert detected: [dynamic scenario text]. Activate operations intelligence?"
  → YES → mro_agent_network stage → mro_q2
  → NO → show status only

mro_q2: "Run initial triage across all affected systems?"
  → YES → mro_control_tower stage → mro_q3

mro_q3: "AIP Agent summary ready. Ask the agent a question or proceed to alert triage?"
  → "Proceed to alerts" → mro_aip_agent stage → mro_q4
  → "Ask agent: {freetext}" → agent response → mro_q4

mro_q4: "Triage alerts workbench loaded. Select an alert to investigate."
  → [Dynamic options: 3-5 alert rows] → mro_alert_triage stage → mro_q5

mro_q5: "Alert investigation complete. What-if scenarios are available. Run simulation?"
  → YES → mro_alert_detail stage → mro_q6

mro_q6: "Choose a resolution strategy:"
  → [3-4 option cards with metrics] → mro_scenario_builder stage → mro_q7

mro_q7: "Build action pack from selected option?"
  → YES → mro_action_pack stage → mro_q8

mro_q8: "Submit action pack for approval?"
  → YES → mro_approval stage → mro_q9
  → "Modify first" → back to mro_q7

mro_q9: "Action approved and executed. Switch to MBH Revenue Assurance view?"
  → YES → mro_mbh_dashboard stage → mro_q10
  → "View automation options" → mro_automation stage → mro_q10

mro_q10: "Revenue exception identified. Investigate and resolve?"
  → YES → mro_mbh_investigation → mro_q11

mro_q11: "Resolution actions ready. Execute billing correction?"
  → YES → mro_mbh_resolve stage → mro_q12

mro_q12: "Cycle complete. Would you like to review automations or finalize?"
  → "Review automations" → mro_automation stage
  → "Finalize" → completion summary
```

### 3.2 Output Stage Mapping

| Stage ID | Component | Palantir Equivalent |
|----------|-----------|-------------------|
| `mro_agent_network` | MROAgentNetworkStage | Agent activation |
| `mro_control_tower` | MROControlTowerStage | Global Control Tower |
| `mro_aip_agent` | MROAIPAgentStage | Ask the AIP Agent |
| `mro_alert_triage` | MROAlertTriageStage | Triage Alerts Workbench |
| `mro_alert_detail` | MROAlertDetailStage | Investigate One Alert |
| `mro_scenario_builder` | MROScenarioBuilderStage | Simulate Options |
| `mro_action_pack` | MROActionPackStage | Execute Action Pack |
| `mro_approval` | MROApprovalStage | Approval Queue |
| `mro_mbh_dashboard` | MROMBHDashboardStage | MBH Revenue View |
| `mro_automation` | MROAutomationStage | Automation Library |

---

## 4. Detailed Component Specifications

### 4.1 MROControlTowerStage — Global Operations View

**Visual Design:** Full-width dashboard matching existing output panel styling.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ▸ Operations Control Tower          [Filters ▾] │  ← Purple gradient header
├─────────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│ │ KPI │ │ KPI │ │ KPI │ │ KPI │ │ KPI │      │  ← KPI tile strip
│ │Act. │ │Red  │ │Delay│ │Pool │ │MBH  │      │
│ │Check│ │Parts│ │Risk │ │Covg │ │Excp │      │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘      │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌──── Hangar 1 ────┐  ┌── Comp Shop ──┐      │
│   │  ✈ A320 C-Check  │  │  🔧 Pool: 94% │      │  ← Network/map view
│   │  ✈ B737 D-Check  │  │  ⚠ 3 repairs  │      │    (hangars, shops,
│   └──────────────────┘  └──────────────┘      │     outstations)
│                    │                            │
│   ┌── Outstation ──┐   ┌── Outstation ──┐     │
│   │  ⚠ Low stock   │   │  ✓ Nominal     │     │
│   └──────────────┘   └──────────────┘     │
│                                                  │
├─────────────────────────────────────────────────┤
│ Top Alerts:                                      │
│ ▸ A-1023 | Critical spares gap | Hangar 1 | 🔴 │  ← Clickable alert rows
│ ▸ A-1024 | Repair TAT breach  | Comp Shop | 🟡 │
│ ▸ A-1025 | MBH billing gap    | Finance   | 🟡 │
└─────────────────────────────────────────────────┘
```

**Data:** Network of locations (hangars, component shops, outstations) with status indicators. KPIs: Active Checks (count), Red Parts (count), Predicted Delay Risk (%), Component Pool Coverage (%), MBH Exceptions (count).

**Interactions:** Click KPI → filter alerts. Click location → show drawer with active events. Click alert → advance to detail.

**Charts:** Nivo bar chart for KPIs, custom SVG for network topology (similar to MiningProcessFlowDiagram pattern).

---

### 4.2 MROAIPAgentStage — Ask the AI Agent

**Visual Design:** Chat-like interface with agent avatar and structured response.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ▸ AIP Agent                        🤖 Active    │
├─────────────────────────────────────────────────┤
│                                                  │
│  🤖 Agent:                                      │
│  ┌─────────────────────────────────────────┐    │
│  │ "Since yesterday, 3 changes detected:   │    │
│  │  • Aircraft AC-042 arrived 2 days early │    │
│  │  • PO-8837 delayed by vendor (5 days)   │    │
│  │  • Repair RO-221 completed ahead of TAT │    │
│  │                                          │    │
│  │ Net impact: 1 new critical alert on     │    │
│  │ Work Package WP-55, recommend immediate │    │
│  │ triage."                                │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  Impacted Objects:                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │AC-042│ │WP-55 │ │PO-887│ │RO-221│          │  ← Ontology object cards
│  │ ✈    │ │ 📋   │ │ 📦   │ │ 🔧   │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                  │
│  Quick Actions:                                  │
│  [View Alert A-1023] [Open WP-55] [Full Triage] │
└─────────────────────────────────────────────────┘
```

**Interaction:** Agent response streams in word-by-word (reuse QuestionGenerator streaming pattern). Object cards are clickable. Quick action buttons advance workflow.

---

### 4.3 MROAlertTriageStage — Alerts Workbench

**Visual Design:** Data table with faceted filters, matching existing table patterns.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ▸ Alerts Workbench            [Bulk Actions ▾]  │
├─────────────────────────────────────────────────┤
│ Filters: [Site ▾] [Fleet ▾] [Type ▾] [Status ▾]│
├────┬────────┬─────────┬────────┬────────┬───────┤
│ ID │ Type   │Severity │Location│ Impact │Status │
├────┼────────┼─────────┼────────┼────────┼───────┤
│1023│Spares  │ 🔴 Crit │Hangar 1│ 3d del │Open   │  ← Row click → detail
│1024│Repair  │ 🟡 High │Comp Sh │ TAT+5d │Open   │
│1025│Revenue │ 🟡 High │Finance │ $240K  │Open   │
│1026│Stock   │ 🟢 Med  │Outst-2 │ 2d buf │Ack'd  │
│1027│Spares  │ 🟢 Med  │Hangar 2│ 1d del │Ack'd  │
└────┴────────┴─────────┴────────┴────────┴───────┘
│ 5 alerts | 2 critical | 2 high | 1 medium        │
└─────────────────────────────────────────────────┘
```

**Data:** Array of alert objects with sortable columns. Severity uses existing color system (red/yellow/green).

**Interactions:** Row click selects alert and triggers detail view. Bulk actions: assign, acknowledge, create scenario. Filter changes re-render table.

---

### 4.4 MROAlertDetailStage — Alert Investigation

**Visual Design:** Multi-tab detail view, matching existing card + chart patterns.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ▸ Alert A-1023: Critical Spares Gap    [🔴 Open]│
│   Work Package WP-55 | Hangar 1 | A320neo       │
├──────────┬──────────┬──────────┬────────────────┤
│ Timeline │Explain   │ Objects  │ Actions        │  ← Tabs
├──────────┴──────────┴──────────┴────────────────┤
│                                                  │
│  [TIMELINE TAB]                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ Inventory Coverage vs Need Date          │    │
│  │  ▓▓▓▓▓▓▓▓░░░░░░░░  ← Safety Stock     │    │  ← Nivo line chart
│  │  ▓▓▓▓▓▓▓▓▓▓▓░░░░░  ← Projected Qty    │    │
│  │  ─────────┼──────── ← Need Date         │    │
│  │  Day 1    Day 7    Day 14    Day 21     │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  [EXPLANATION TAB]                               │
│  Causal Graph:                                   │
│  [Vendor Delay] → [PO-8837 Late] → [Part Gap]  │
│       │                                  ↓       │
│  [Long Lead Time]              [WP-55 Delay Risk]│
│                                                  │
│  [OBJECTS TAB]                                   │
│  Related: WorkPackage WP-55, PartDemand PD-103, │
│  PurchaseOrder PO-8837, Aircraft AC-042          │
│                                                  │
│  [ACTIONS TAB]                                   │
│  [Acknowledge] [Create Scenario] [Recommend]     │
└─────────────────────────────────────────────────┘
```

**Charts:** Nivo ResponsiveLine for inventory timeline. Custom SVG or react-force-graph-2d for causal graph. Ontology object cards for related objects.

---

### 4.5 MROScenarioBuilderStage — What-If Simulator

**Visual Design:** Stepper UI + comparison cards (matches WAIO PlanOptions pattern).

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ▸ Scenario Builder                               │
│   ● Begin  ─── ● Simulate  ─── ○ Execute       │  ← Stepper
├─────────────────────────────────────────────────┤
│                                                  │
│  Recommended Options for Alert A-1023:           │
│                                                  │
│  ┌─────────────────┐  ┌─────────────────┐       │
│  │ Option A         │  │ Option B ⭐      │       │
│  │ Expedite PO-8837│  │ Transfer from   │       │
│  │                  │  │ Pool East       │       │
│  │ Days saved: 4   │  │ Days saved: 6   │       │  ← Comparison cards
│  │ Cost: $12,400   │  │ Cost: $8,200    │       │
│  │ Risk: Medium    │  │ Risk: Low       │       │
│  │                  │  │                 │       │
│  │ [Select]        │  │ [Select] ⭐     │       │
│  └─────────────────┘  └─────────────────┘       │
│                                                  │
│  ┌─────────────────┐  ┌─────────────────┐       │
│  │ Option C         │  │ Option D         │       │
│  │ Alternate Part  │  │ Repair Repri-   │       │
│  │ (P/N Approved)  │  │ oritization     │       │
│  │ Days saved: 3   │  │ Days saved: 5   │       │
│  │ Cost: $6,100    │  │ Cost: $4,800    │       │
│  │ Risk: Low       │  │ Risk: Medium    │       │
│  │ [Select]        │  │ [Select]        │       │
│  └─────────────────┘  └─────────────────┘       │
│                                                  │
│  [Explain Recommendation] [Compare All]          │
└─────────────────────────────────────────────────┘
```

---

### 4.6 MROActionPackStage — Execute & Approve

**Visual Design:** Action list with approval indicators.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ▸ Action Pack AP-2024-089        [Draft → Ready]│
├─────────────────────────────────────────────────┤
│                                                  │
│  Actions (3):                                    │
│  ┌─────────────────────────────────────────┐    │
│  │ 1. Transfer Rotable SN-44821            │    │
│  │    From: Pool East → Hangar 1            │    │
│  │    ETA: 18 hours | Cost: $0 (internal)  │    │
│  │    Approval: Auto (< $10K threshold)    │    │  ← Action cards
│  │    Status: ✅ Pre-approved               │    │
│  ├─────────────────────────────────────────┤    │
│  │ 2. Expedite PO-8837 (backup)            │    │
│  │    Vendor: Parts Corp | New ETA: -3 days│    │
│  │    Cost: $4,200 expedite fee            │    │
│  │    Approval: Required (Ops Lead)        │    │
│  │    Status: 🟡 Pending approval          │    │
│  ├─────────────────────────────────────────┤    │
│  │ 3. Update MRP Safety Stock              │    │
│  │    Part: PN-7742 | New level: +15 units │    │
│  │    Approval: Auto (parameter change)    │    │
│  │    Status: ✅ Pre-approved               │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  SAP Write-back Preview:                         │
│  ┌──────────────────────────────────────┐       │
│  │ MM: Stock Transfer STO-2024-089      │       │
│  │ MM: PO Amendment PO-8837-REV2        │       │  ← Simulated SAP
│  │ PP: MRP Parameter Update PN-7742     │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  Audit Trail:                                    │
│  • 14:32 — System generated action pack         │
│  • 14:32 — Auto-approved: Transfer (threshold)  │
│  • 14:33 — Pending: Expedite (requires Ops Lead)│
│                                                  │
│  [Submit for Approval] [Modify Actions]          │
└─────────────────────────────────────────────────┘
```

---

### 4.7 MROMBHDashboardStage — Revenue Assurance

**Visual Design:** Dashboard with charts and exception table.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ▸ MBH Revenue Assurance            [Q4 2024 ▾] │
├─────────────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│ │FlyHr│ │Accrual││ Excpt│ │Bill │               │
│ │42.1K│ │$8.4M │ │ 3   │ │Ready│               │  ← KPI tiles
│ │ +2% │ │ -$240K│ │ ▲1  │ │ 87% │               │
│ └─────┘ └─────┘ └─────┘ └─────┘               │
├─────────────────────────────────────────────────┤
│  Contract Performance:                           │
│  ┌─────────────────────────────────────────┐    │
│  │ Accrual vs Expected by Contract          │    │
│  │  ▓▓▓▓▓▓▓▓▓  Contract Alpha  ($3.2M ok) │    │  ← Nivo grouped bar
│  │  ▓▓▓▓▓▓░░░  Contract Beta   (-$180K)   │    │
│  │  ▓▓▓▓▓▓▓▓░  Contract Gamma  (-$60K)    │    │
│  └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│  Revenue Exceptions:                             │
│  ┌────┬──────────┬─────────┬────────┬──────┐   │
│  │ ID │ Contract │ Amount  │ Reason │Status│   │
│  ├────┼──────────┼─────────┼────────┼──────┤   │
│  │E-01│ Beta     │ -$180K  │ FH gap │ Open │   │  ← Exception table
│  │E-02│ Gamma    │ -$60K   │ Swap   │ Open │   │
│  │E-03│ Beta     │ -$12K   │ Util.  │ Ack'd│   │
│  └────┴──────────┴─────────┴────────┴──────┘   │
│                                                  │
│  Component Pool Health:                          │
│  ┌─────────────────────────────────────────┐    │
│  │ Availability by Part Family              │    │
│  │ APU:  ████████░░ 82%  | TAT: 18d avg   │    │  ← Pool health bars
│  │ LDG:  ██████████ 97%  | TAT: 12d avg   │    │
│  │ IDG:  ██████░░░░ 61%  ⚠ | TAT: 25d     │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

### 4.8 MROAutomationStage — Automation Library

**Visual Design:** Toggle cards with run logs.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ▸ Automation Library                    [+ New] │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ 🤖 Auto-Expedite Critical Spares  [ON] │    │
│  │ Trigger: Part availability < 80% at    │    │
│  │          need date, lead time > 5 days │    │
│  │ Action: Create expedite PO if cost <$5K│    │
│  │ Approval: Auto if <$5K, manual if >    │    │
│  │ Last run: 2h ago | Actions: 12 this wk │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ 🤖 Pool Rebalancing Alert         [ON] │    │
│  │ Trigger: Coverage days < 3 at any site │    │
│  │ Action: Recommend transfer from nearest│    │
│  │ Approval: Always manual                │    │
│  │ Last run: 6h ago | Actions: 4 this wk  │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ┌─────────────────────────────────────────┐    │
│  │ 🤖 MBH Accrual Variance Monitor  [OFF]│    │
│  │ Trigger: Variance > 5% for any contract│    │
│  │ Action: Flag exception, notify billing │    │
│  │ Approval: Auto                         │    │
│  │ Last run: — | Status: Disabled         │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  Run Log:                                        │
│  • 14:20 — Auto-Expedite: PO-8901 created ✅   │
│  • 12:45 — Pool Rebal: Transfer rec'd → review │
│  • 08:00 — Auto-Expedite: PO-8899 approved ✅  │
│                                                  │
│  [Finalize Automation] [View Full Log]           │
└─────────────────────────────────────────────────┘
```

---

### 4.9 MROOperationsFlowDiagram — Overview Scene

**Visual Design:** Interactive SVG matching MiningProcessFlowDiagram pattern, but for aviation MRO operations.

**Layout:**
```
┌───────────────────────────────────────────────────────────┐
│                  Aviation MRO Operations                   │
│                                                            │
│   ┌─────────┐         ┌─────────┐        ┌─────────┐    │
│   │ Hangar  │─────────│Component│────────│Outstation│    │
│   │ Site 1  │         │  Shop   │        │  Hub A   │    │
│   │ ✈ ✈ ✈  │         │ 🔧🔧🔧  │        │   ⚠     │    │
│   │ 3 bays  │         │Pool:94% │        │Stock:Low │    │
│   └─────────┘         └─────────┘        └─────────┘    │
│        │                    │                  │          │
│        │              ┌─────────┐              │          │
│        └──────────────│  Parts  │──────────────┘          │
│                       │ Warehouse│                         │
│   ┌─────────┐         │ 📦📦📦  │        ┌─────────┐    │
│   │ Hangar  │─────────│Safety:OK│────────│Outstation│    │
│   │ Site 2  │         └─────────┘        │  Hub B   │    │
│   │ ✈ ✈    │              │              │   ✓     │    │
│   │ 2 bays  │         ┌─────────┐        └─────────┘    │
│   └─────────┘         │ Finance │                         │
│                       │  & MBH  │                         │
│                       │ $8.4M   │                         │
│                       └─────────┘                         │
│                                                            │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│  │Checks│ │Parts│ │Pool │ │MBH  │ │Alerts│  ← KPI Strip │
│  │  5   │ │ 3🔴 │ │ 89% │ │$8.4M│ │ 5⚠  │               │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘               │
└───────────────────────────────────────────────────────────┘
```

**Interactions:** Click any node → enter ANALYSIS scene with that context. Click KPI → jump to relevant alert view.

---

## 5. Agent Configuration (7 MRO Agents)

```javascript
const MRO_AGENT_CONFIG = {
  SO: { id: 'SO', name: 'Slot Orchestrator',       color: '#A100FF', role: 'Hangar slot planning and check scheduling' },
  MP: { id: 'MP', name: 'Material Planner',        color: '#3B82F6', role: 'Critical spares readiness and PO management' },
  CS: { id: 'CS', name: 'Component Services',      color: '#10B981', role: 'Rotable pool health and repair prioritization' },
  RA: { id: 'RA', name: 'Revenue Assurance',       color: '#F59E0B', role: 'MBH accrual reconciliation and billing' },
  WE: { id: 'WE', name: 'Work Execution',          color: '#EF4444', role: 'Task card progress and TAT prediction' },
  SC: { id: 'SC', name: 'Supply Chain Intel',       color: '#8B5CF6', role: 'Vendor lead times, expedite options, logistics' },
  OR: { id: 'OR', name: 'Operations Research',      color: '#06B6D4', role: 'Multi-echelon optimization and stochastic modeling' },
};
```

Each agent gets curated responses per scenario variant (same pattern as existing CURATED_RESPONSES).

---

## 6. Ontology Data Model

### 6.1 Core Object Types

| Object | Fields | Icon |
|--------|--------|------|
| Aircraft | tailNumber, type, operator, status, location | ✈ |
| CheckEvent | type (C/D), scheduledDate, inductionDate, redeliveryDate, status | 📅 |
| WorkPackage | wpNumber, aircraft, taskCards[], status, hangar | 📋 |
| TaskCard | taskNumber, description, estimatedHours, status, parts[] | 📝 |
| Part | partNumber, description, category, alternates[] | ⚙️ |
| PartDemand | partNumber, workPackage, needDate, quantity, status | 📊 |
| InventoryPosition | partNumber, site, onHand, safetyStock, inTransit | 📦 |
| RepairOrder | roNumber, partSerial, vendor, expectedTAT, status | 🔧 |
| PurchaseOrder | poNumber, vendor, parts[], expectedDate, status | 🛒 |
| Shipment | trackingId, origin, destination, ETA, status | 🚚 |
| ComponentSerial | serialNumber, partNumber, condition, location, cycles | 🔩 |
| ComponentPool | poolId, partFamily, serviceable, unserviceable, coverage | 🏊 |
| ContractMBH | contractId, operator, fleet, ratePerFH, term | 📃 |
| FlyingHoursReport | reportId, contract, period, hoursReported, hoursExpected | ⏱ |
| BillingLine | lineId, contract, amount, status, period | 💰 |
| Alert | alertId, type, severity, source, impact, status, owner | 🔔 |
| Action | actionId, type, alertId, details, approvalRule, status | ⚡ |
| ApprovalTask | taskId, action, approver, decision, timestamp, evidence | ✅ |

### 6.2 Relationships (Drill-Down)
```
Aircraft ──1:*──> CheckEvent ──1:*──> WorkPackage ──1:*──> TaskCard
                                                              │
                                                         1:*──> PartDemand
                                                              │
Part <──*:1── PartDemand ──*:1──> InventoryPosition
  │
  └──1:*──> ComponentSerial ──*:1──> ComponentPool
  └──1:*──> RepairOrder
  └──1:*──> PurchaseOrder ──1:*──> Shipment

ContractMBH ──1:*──> FlyingHoursReport ──1:*──> BillingLine

Alert ──1:*──> Action ──1:1──> ApprovalTask
```

---

## 7. Implementation Phases

### Phase 1: Data Layer & Domain Registration (Estimated: ~2 hours)

**Files to create:**
1. `src/app/cerebra-demo/data/mro/mroWorkflowQuestions.js`
2. `src/app/cerebra-demo/data/mro/mroScenarioVariants.js`
3. `src/app/cerebra-demo/data/mro/mroScenarioContext.js`
4. `src/app/cerebra-demo/data/mro/mroNotifications.js`
5. `src/app/cerebra-demo/data/mro/mroProcessFlowData.js`
6. `src/app/cerebra-demo/data/mro/mroAgentConfig.js`
7. `src/app/cerebra-demo/data/mro/mroOntologyData.js`
8. `src/app/cerebra-demo/data/mro/mroAlertData.js`
9. `src/app/cerebra-demo/data/mro/mroKPIData.js`
10. `src/app/cerebra-demo/data/mro/mroScenarioOptions.js`
11. `src/app/cerebra-demo/data/mro/mroActionPackData.js`
12. `src/app/cerebra-demo/data/mro/mroAutomationData.js`
13. `src/app/cerebra-demo/data/mro/mroMBHData.js`

**Files to modify (additive only):**
14. `src/app/cerebra-demo/domains/domainModes.js` — Add MRO_SUPPLY_CHAIN entry

### Phase 2: Overview Scene (Estimated: ~1.5 hours)

**Files to create:**
15. `src/app/cerebra-demo/components/MROOperationsFlowDiagram.js`
16. `src/app/cerebra-demo/components/MROKPIStrip.js`

### Phase 3: Core Output Stages — Control Tower, Agent, Triage, Detail (Estimated: ~3 hours)

**Files to create:**
17. `src/app/cerebra-demo/components/outputStages/mro/MROAgentNetworkStage.js`
18. `src/app/cerebra-demo/components/outputStages/mro/MROControlTowerStage.js`
19. `src/app/cerebra-demo/components/outputStages/mro/MROAIPAgentStage.js`
20. `src/app/cerebra-demo/components/outputStages/mro/MROAlertTriageStage.js`
21. `src/app/cerebra-demo/components/outputStages/mro/MROAlertDetailStage.js`

**Shared sub-components:**
22. `src/app/cerebra-demo/components/outputStages/mro/shared/AlertTable.js`
23. `src/app/cerebra-demo/components/outputStages/mro/shared/KPITileStrip.js`
24. `src/app/cerebra-demo/components/outputStages/mro/shared/TimelineChart.js`
25. `src/app/cerebra-demo/components/outputStages/mro/shared/CausalGraph.js`
26. `src/app/cerebra-demo/components/outputStages/mro/shared/OntologyObjectCard.js`

### Phase 4: Scenario Builder, Action Pack, Approvals (Estimated: ~2.5 hours)

**Files to create:**
27. `src/app/cerebra-demo/components/outputStages/mro/MROScenarioBuilderStage.js`
28. `src/app/cerebra-demo/components/outputStages/mro/MROActionPackStage.js`
29. `src/app/cerebra-demo/components/outputStages/mro/MROApprovalStage.js`
30. `src/app/cerebra-demo/components/outputStages/mro/shared/ScenarioComparisonCards.js`
31. `src/app/cerebra-demo/components/outputStages/mro/shared/ActionPackBuilder.js`
32. `src/app/cerebra-demo/components/outputStages/mro/shared/ApprovalModal.js`

### Phase 5: MBH Revenue & Automations (Estimated: ~2 hours)

**Files to create:**
33. `src/app/cerebra-demo/components/outputStages/mro/MROMBHDashboardStage.js`
34. `src/app/cerebra-demo/components/outputStages/mro/MROAutomationStage.js`
35. `src/app/cerebra-demo/components/outputStages/mro/shared/AutomationCard.js`

### Phase 6: Ontology Explorer (Estimated: ~1 hour)

**Files to create:**
36. `src/app/cerebra-demo/components/outputStages/mro/MROOntologyExplorerStage.js`
37. `src/app/cerebra-demo/components/MROOntologyGraphModal.js`

### Phase 7: Integration & Wiring (Estimated: ~2 hours)

**Files to modify (additive only):**
38. `src/app/cerebra-demo/page.js` — Add MRO branches in handleAnswer, handleStageComplete, getCurrentQuestion, and render logic
39. `src/app/cerebra-demo/components/OutputConsole.js` — Add conditional renders for all mro_* stages
40. `src/app/cerebra-demo/components/ConversationPanel.js` — Add MRO generation stages

### Phase 8: Testing & Polish (Estimated: ~2 hours)

- End-to-end walkthrough of all 3 scenarios
- Verify domain switching doesn't affect Maintenance or WAIO
- Check all animations, progressive reveals, loading states
- Verify responsive layout
- Confirm no console errors
- Ensure all ontology drill-downs work
- Test scenario variant rotation

---

## 8. Key Design Principles

### 8.1 Visual Consistency
- All new components use **inline styles** (matching WAIO pattern)
- Colors from existing CSS variables only
- Same animation keyframes (fadeIn, fadeSlideUp, scaleIn, pulse, spin)
- Same card border-radius (8px containers, 6px cards)
- Same shadow values (0 1px 3px subtle, 0 2px 8px medium)
- Purple gradient headers on all stage components
- Same font stack (Segoe UI, system fonts)

### 8.2 Interaction Patterns
- Progressive reveal with staggered loading (exact WAIO timing)
- Word-by-word question streaming
- Processing spinner between stages (800ms + random 400ms)
- Tab-based sub-navigation within stages
- Click-to-drill on ontology objects
- Bulk action support in table views

### 8.3 Data Patterns
- All data pre-curated (no real API calls — same as existing demo)
- Scenario variants rotate randomly (same as WAIO)
- Agent responses are deterministic (same as existing hook)
- useRef for single-completion tracking
- Same delay patterns for realistic demo feel

### 8.4 Zero Regression
- No modification to existing Maintenance or WAIO data files
- No modification to existing stage components
- Domain mode system ensures complete isolation
- All new code in new files/folders
- Only additive changes to shared infrastructure files
- Existing question IDs (q1-q6, waio_q1-waio_q10) never referenced by new code

---

## 9. Estimated Total Effort

| Phase | Scope | Est. Time |
|-------|-------|-----------|
| Phase 1 | Data layer + domain registration | ~2 hours |
| Phase 2 | Overview scene (flow diagram) | ~1.5 hours |
| Phase 3 | Core stages (control tower, triage, detail) | ~3 hours |
| Phase 4 | Scenario builder, action pack, approvals | ~2.5 hours |
| Phase 5 | MBH revenue + automations | ~2 hours |
| Phase 6 | Ontology explorer | ~1 hour |
| Phase 7 | Integration wiring | ~2 hours |
| Phase 8 | Testing & polish | ~2 hours |
| **Total** | **~40 new files, ~5 modified files** | **~16 hours** |

---

## 10. Summary of What Gets Built

A complete new domain mode that delivers:

1. **Operations Control Tower** — Global view of hangars, component shops, outstations with live KPIs
2. **AIP Agent** — Natural language agent summarizing changes and pointing to alerts
3. **Alerts Workbench** — Sortable, filterable table of operational alerts with severity indicators
4. **Alert Investigation** — Multi-tab detail view with timeline charts, causal graphs, and ontology drill-down
5. **Scenario Builder** — What-if simulation with 3-4 recommended options and metric comparison
6. **Action Pack Execution** — Build and submit multi-action packs with approval routing and SAP write-back preview
7. **MBH Revenue Assurance** — Flying hours, accrual variance, exception handling, billing readiness
8. **Automation Library** — Toggle automations with run logs and approval policies
9. **Ontology Explorer** — Full drill-down across 18 object types with relationships

All wrapped in the existing Cerebra demo shell, using the same purple/dark theme, same animation system, same progressive reveal patterns, and accessible via a single domain mode switch in the header dropdown.
