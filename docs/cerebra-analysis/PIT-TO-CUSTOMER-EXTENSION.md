# Pit-to-Customer Extension Strategy

> **Extending the Cerebra Demo for End-to-End Mining Value Chain**

This document outlines the strategy for extending the current Cerebra Demo (focused on equipment maintenance) to cover the complete **pit-to-customer** value chain in mining operations.

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Pit-to-Customer Value Chain Overview](#2-pit-to-customer-value-chain-overview)
3. [New Domain Areas](#3-new-domain-areas)
4. [Proposed Agent Architecture](#4-proposed-agent-architecture)
5. [Scenario Context Extensions](#5-scenario-context-extensions)
6. [Workflow Extensions](#6-workflow-extensions)
7. [Visualization Requirements](#7-visualization-requirements)
8. [Implementation Roadmap](#8-implementation-roadmap)
9. [Data Integration Points](#9-data-integration-points)

---

## 1. Current State Analysis

### 1.1 What the Current Demo Covers

The existing Cerebra Demo focuses on **predictive maintenance** within the crushing circuit:

| Domain | Coverage | Components |
|--------|----------|------------|
| **Equipment Monitoring** | Primary focus | Digital twin, sensor data, alarms |
| **Failure Analysis** | Comprehensive | FMEA, fault tree, root cause |
| **Maintenance Planning** | Full workflow | Crew scheduling, parts inventory |
| **Work Order Management** | SAP integration | Creation, release, tracking |

### 1.2 Current Agent Capabilities

| Agent | Current Scope | Pit-to-Customer Relevance |
|-------|---------------|---------------------------|
| RO | Maintenance crew coordination | Extendable to operations crew |
| TA | Equipment sensor analysis | Extendable to process sensors |
| MI | Reliability engineering | Applicable across all assets |
| IL | Maintenance parts inventory | Extendable to product inventory |
| LD | Liner-specific diagnostics | Template for domain specialists |

### 1.3 Architecture Strengths to Leverage

1. **Modular Agent Design** - Easy to add new specialist agents
2. **Scenario Context Pattern** - Centralized data store scalable to new domains
3. **Workflow Questions** - Extensible conversation flow framework
4. **Visualization Library** - Nivo charts adaptable to new data types
5. **API Structure** - Clean separation for new endpoints

---

## 2. Pit-to-Customer Value Chain Overview

### 2.1 Complete Mining Value Chain

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        PIT-TO-CUSTOMER VALUE CHAIN                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐          │
│  │   PIT   │──►│ PROCESS │──►│  RAIL/  │──►│  PORT   │──►│CUSTOMER │          │
│  │         │   │  PLANT  │   │  ROAD   │   │         │   │         │          │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘          │
│       │             │             │             │             │                 │
│       ▼             ▼             ▼             ▼             ▼                 │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐          │
│  │ Mining  │   │ Milling │   │Transport│   │Stockpile│   │ Sales   │          │
│  │ Ops     │   │ Flotation│  │ Logistics│  │ Loading │   │ Delivery│          │
│  │ Grade   │   │ Recovery│   │ Scheduling│ │ Quality │   │ Contract│          │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘          │
│                                                                                 │
│  Current Demo Focus: ▓▓▓▓▓▓▓▓▓▓                                               │
│  Extension Target:   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Performance Indicators Across Chain

| Stage | Primary KPIs | Secondary KPIs |
|-------|--------------|----------------|
| **Pit** | Ore extraction (t/day), Grade (% Cu), Strip ratio | Blast efficiency, Truck utilization |
| **Process** | Recovery rate (%), Throughput (t/h), Grade | Energy consumption, Water usage |
| **Transport** | On-time delivery (%), Capacity utilization | Transit time, Cost per tonne |
| **Port** | Ship loading rate (t/h), Stockpile turnover | Demurrage cost, Quality variance |
| **Customer** | Contract compliance (%), Customer satisfaction | Payment days, Repeat orders |

---

## 3. New Domain Areas

### 3.1 Pit Operations

**Scenarios to Address:**

1. **Ore Grade Optimization**
   - Detecting grade variability in ore feed
   - Optimizing blast patterns for grade consistency
   - Ore blending recommendations

2. **Haul Truck Dispatch**
   - Real-time fleet optimization
   - Route optimization based on conditions
   - Queue management at crushers

3. **Pit Geotechnics**
   - Slope stability monitoring
   - Ground movement alerts
   - Dewatering optimization

**Example Workflow Question:**
```javascript
{
  id: 'pit_q1',
  text: 'I detected a 12% grade variance in the ROM feed from Pit 3 Zone B over the last shift. The Bond Work Index is 15% above baseline. Do you want to investigate the ore source and blending strategy?',
  options: [
    { id: 'yes', label: 'Yes, analyze grade variance' },
    { id: 'no', label: 'No, continue current operations' }
  ],
  triggersOutput: 'pit_grade_analysis'
}
```

### 3.2 Processing Plant

**Scenarios to Address:**

1. **Mill Throughput Optimization**
   - SAG mill power draw correlation
   - Ball charge optimization
   - Feed size distribution impact

2. **Flotation Performance**
   - Recovery rate prediction
   - Reagent dosing optimization
   - Cell performance monitoring

3. **Energy Management**
   - Peak demand management
   - Load shifting opportunities
   - Energy cost optimization

**Example Scenario Context:**
```javascript
processingPlant: {
  sagMill: {
    id: 'SAG-001',
    currentThroughput: '2,150 t/h',
    targetThroughput: '2,400 t/h',
    powerDraw: '18.5 MW',
    ballCharge: '28%',
    efficiency: '89.5%',
  },
  flotation: {
    recoveryRate: '91.2%',
    targetRecovery: '93.0%',
    copperGrade: '28.5%',
    tailingsGrade: '0.12%',
  },
}
```

### 3.3 Logistics & Transport

**Scenarios to Address:**

1. **Rail/Road Scheduling**
   - Load scheduling optimization
   - Maintenance window coordination
   - Weather impact management

2. **Stockpile Management**
   - Grade segregation tracking
   - Inventory optimization
   - FIFO/LIFO management

3. **Port Operations**
   - Ship loading optimization
   - Berth scheduling
   - Demurrage risk management

**Example Data Model:**
```javascript
logistics: {
  railFleet: {
    totalTrains: 12,
    availableToday: 10,
    inMaintenance: 2,
    avgTransitTime: '18 hours',
    capacityPerTrain: '8,500 tonnes',
  },
  stockpiles: [
    { id: 'SP-001', grade: '1.8% Cu', volume: '125,000 t', age: '3 days' },
    { id: 'SP-002', grade: '2.1% Cu', volume: '85,000 t', age: '7 days' },
  ],
  vessels: {
    currentAtBerth: 'MV Pacific Trader',
    loadingProgress: '45%',
    etd: '2025-01-18 14:00',
    nextArrival: 'MV Ocean Fortune',
    eta: '2025-01-19 06:00',
  },
}
```

### 3.4 Commercial & Customer

**Scenarios to Address:**

1. **Contract Compliance**
   - Quality specification tracking
   - Volume commitment monitoring
   - Penalty risk alerts

2. **Customer Delivery**
   - Delivery schedule optimization
   - Quality assurance tracking
   - Documentation management

3. **Pricing & Market**
   - Price optimization
   - Hedging recommendations
   - Market trend analysis

**Example Workflow:**
```javascript
commercial: {
  contracts: [
    {
      id: 'CNT-2025-001',
      customer: 'Shandong Smelter',
      volume: '500,000 t/year',
      priceFormula: 'LME - $50/t',
      qualitySpec: { minCu: '26%', maxAs: '0.5%' },
      deliverySchedule: 'Monthly',
      currentCompliance: '98.5%',
    },
  ],
  marketData: {
    lmeCopper: '$8,450/t',
    trend: 'up 2.3% this week',
    forecast: '$8,600/t (30-day)',
  },
}
```

---

## 4. Proposed Agent Architecture

### 4.1 Extended Agent Network

```
                         ┌─────────────────────┐
                         │    Super Agent      │
                         │   (Orchestrator)    │
                         └──────────┬──────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
┌───────┴───────┐          ┌────────┴────────┐         ┌───────┴───────┐
│  Maintenance  │          │   Operations    │         │  Commercial   │
│    Agents     │          │     Agents      │         │    Agents     │
└───────┬───────┘          └────────┬────────┘         └───────┬───────┘
        │                           │                           │
   ┌────┼────┐              ┌───────┼───────┐            ┌─────┼─────┐
   │    │    │              │       │       │            │     │     │
  RO   MI   LD             PO      PP      LO           CO    QA    CA
  TA   IL                  GO      EM      PM           CM    DA
```

### 4.2 New Agent Specifications

#### Pit Operations Agents

| Agent ID | Name | Role | Data Sources |
|----------|------|------|--------------|
| **PO** | Pit Operations | Mine planning & extraction | Mine planning system, GPS fleet |
| **GO** | Grade Optimization | Ore grade management | Assay database, Blast patterns |

#### Processing Agents

| Agent ID | Name | Role | Data Sources |
|----------|------|------|--------------|
| **PP** | Process Plant | Mill & flotation optimization | DCS, PI Historian |
| **EM** | Energy Management | Power optimization | SCADA, Energy meters |

#### Logistics Agents

| Agent ID | Name | Role | Data Sources |
|----------|------|------|--------------|
| **LO** | Logistics Orchestration | Transport scheduling | TMS, Rail systems |
| **PM** | Port Management | Ship loading & stockpiles | Port TOS, Vessel AIS |

#### Commercial Agents

| Agent ID | Name | Role | Data Sources |
|----------|------|------|--------------|
| **CO** | Contract Operations | Contract compliance | SAP SD, CRM |
| **QA** | Quality Assurance | Quality tracking | LIMS, Lab systems |
| **CM** | Commercial Management | Pricing & market | Market feeds, ERP |
| **CA** | Customer Analytics | Customer insights | CRM, Delivery data |
| **DA** | Demand Analytics | Demand forecasting | Historical, Market |

### 4.3 Agent Configuration Template

```javascript
// New agent definition template
const NEW_AGENT_CONFIG = {
  PO: {
    id: 'PO',
    name: 'Pit Operations Agent',
    color: '#6366F1', // Indigo
    role: 'Mine planning and extraction optimization',
    systemPrompt: `You are an expert Pit Operations Agent for mining operations. Your role is to:
- Analyze mine planning efficiency and extraction rates
- Optimize haul truck dispatch and routing
- Monitor pit conditions and safety parameters
- Coordinate with processing plant on feed requirements

You have access to mine planning systems, fleet management, and geological databases.
Keep responses concise (2-3 sentences) and actionable.
Format findings as: "✓ [Action]: [Finding with specific data]"`,
    steps: [
      { type: 'tool', name: 'query_mine_plan', params: 'date=today' },
      { type: 'tool', name: 'analyze_fleet_efficiency', params: 'shift=current' },
      { type: 'display', component: 'FleetUtilizationChart' },
      { type: 'finding', text: '' }
    ],
  },
  // Additional agents...
};
```

---

## 5. Scenario Context Extensions

### 5.1 Extended Data Structure

```javascript
// Extended scenarioContext.js structure
export const extendedScenarioContext = {
  // Existing maintenance context
  ...scenarioContext,
  
  // New pit operations context
  pitOperations: {
    currentPit: 'Pit 3',
    currentZone: 'Zone B',
    extractionRate: '145,000 t/day',
    oreGrade: {
      copper: '1.85%',
      target: '1.95%',
      variance: '-5.1%',
    },
    blastingSchedule: {
      nextBlast: '2025-01-16 06:00',
      pattern: 'BP-2025-0042',
      expectedYield: '85,000 tonnes',
    },
    fleetStatus: {
      trucksOperational: 18,
      trucksInMaintenance: 2,
      avgCycleTime: '22 minutes',
      utilization: '87%',
    },
  },
  
  // New processing context
  processingPlant: {
    sagMill: {
      id: 'SAG-001',
      currentThroughput: '2,150 t/h',
      targetThroughput: '2,400 t/h',
      powerDraw: '18.5 MW',
      efficiency: '89.5%',
    },
    flotation: {
      cells: 8,
      recoveryRate: '91.2%',
      targetRecovery: '93.0%',
      copperGrade: '28.5%',
    },
    dailyProduction: {
      concentrate: '625 tonnes',
      copperContent: '178 tonnes',
    },
  },
  
  // New logistics context
  logistics: {
    railTransport: {
      activeTrains: 10,
      avgTransitTime: '18 hours',
      dailyCapacity: '85,000 tonnes',
      currentLoad: '72,000 tonnes',
    },
    stockpiles: [
      { id: 'SP-001', grade: '28.5%', volume: '125,000 t' },
      { id: 'SP-002', grade: '29.1%', volume: '85,000 t' },
    ],
    portOperations: {
      currentVessel: 'MV Pacific Trader',
      loadingRate: '4,500 t/h',
      progress: '45%',
      eta_completion: '2025-01-18 14:00',
    },
  },
  
  // New commercial context
  commercial: {
    activeContracts: 4,
    ytdShipments: '1.2M tonnes',
    ytdRevenue: '$2.4B',
    currentPricing: {
      lmeCopper: '$8,450/t',
      treatmentCharge: '$75/t',
      netPrice: '$8,375/t',
    },
    customerSatisfaction: '94%',
    contractCompliance: '98.5%',
  },
};
```

### 5.2 Topic Routing Extension

```javascript
// Extended getContextByTopic function
export const getExtendedContextByTopic = (topic) => {
  const topicLower = topic.toLowerCase();
  
  // Existing maintenance routing...
  
  // New pit operations routing
  if (topicLower.includes('pit') || topicLower.includes('extraction') || topicLower.includes('mining')) {
    return { topic: 'Pit Operations', data: extendedScenarioContext.pitOperations, agent: 'PO', tool: 'mine_ops_query' };
  }
  if (topicLower.includes('grade') || topicLower.includes('ore quality') || topicLower.includes('assay')) {
    return { topic: 'Grade Control', data: extendedScenarioContext.pitOperations.oreGrade, agent: 'GO', tool: 'grade_analysis' };
  }
  if (topicLower.includes('truck') || topicLower.includes('fleet') || topicLower.includes('haul')) {
    return { topic: 'Fleet Management', data: extendedScenarioContext.pitOperations.fleetStatus, agent: 'PO', tool: 'fleet_query' };
  }
  
  // New processing routing
  if (topicLower.includes('mill') || topicLower.includes('sag') || topicLower.includes('grinding')) {
    return { topic: 'Mill Operations', data: extendedScenarioContext.processingPlant.sagMill, agent: 'PP', tool: 'mill_analysis' };
  }
  if (topicLower.includes('flotation') || topicLower.includes('recovery') || topicLower.includes('concentrate')) {
    return { topic: 'Flotation', data: extendedScenarioContext.processingPlant.flotation, agent: 'PP', tool: 'flotation_analysis' };
  }
  
  // New logistics routing
  if (topicLower.includes('rail') || topicLower.includes('transport') || topicLower.includes('train')) {
    return { topic: 'Rail Transport', data: extendedScenarioContext.logistics.railTransport, agent: 'LO', tool: 'transport_query' };
  }
  if (topicLower.includes('stockpile') || topicLower.includes('inventory')) {
    return { topic: 'Stockpiles', data: extendedScenarioContext.logistics.stockpiles, agent: 'PM', tool: 'stockpile_query' };
  }
  if (topicLower.includes('ship') || topicLower.includes('vessel') || topicLower.includes('port') || topicLower.includes('loading')) {
    return { topic: 'Port Operations', data: extendedScenarioContext.logistics.portOperations, agent: 'PM', tool: 'port_query' };
  }
  
  // New commercial routing
  if (topicLower.includes('contract') || topicLower.includes('customer') || topicLower.includes('delivery')) {
    return { topic: 'Commercial', data: extendedScenarioContext.commercial, agent: 'CO', tool: 'contract_query' };
  }
  if (topicLower.includes('price') || topicLower.includes('lme') || topicLower.includes('market')) {
    return { topic: 'Pricing', data: extendedScenarioContext.commercial.currentPricing, agent: 'CM', tool: 'market_query' };
  }
  
  return { topic: 'General', data: extendedScenarioContext.currentScenario, agent: null, tool: null };
};
```

---

## 6. Workflow Extensions

### 6.1 New Workflow Scenarios

#### Scenario: Grade Variance Investigation

```javascript
export const gradeWorkflowQuestions = {
  grade_q1: {
    id: 'grade_q1',
    text: 'I detected a 12% grade variance in the ROM feed from Pit 3 Zone B. Current Cu grade is 1.65% against a target of 1.85%. This could impact recovery rates downstream. Do you want to investigate?',
    options: [
      { id: 'yes', label: 'Yes, analyze grade variance' },
      { id: 'no', label: 'No, continue monitoring' }
    ],
    triggersOutput: 'grade_agent_network'
  },
  grade_q2: {
    id: 'grade_q2',
    text: 'Should I perform a comprehensive analysis including ore source, blasting patterns, and downstream impact assessment?',
    options: [
      { id: 'yes', label: 'Yes, full analysis' },
      { id: 'no', label: 'Just ore source analysis' }
    ],
    triggersOutput: 'grade_analysis'
  },
  grade_q3: {
    id: 'grade_q3',
    text: 'Based on the analysis, select a remediation strategy:',
    isDynamic: true,
    options: [], // Populated dynamically
    triggersOutput: 'grade_huddle'
  },
};

export const gradeScenarioOptions = [
  { 
    id: 'ore_blending', 
    label: 'Ore Blending Adjustment', 
    probability: 75,
    evidence: 'Blend ratio 70:30 from Pit3:Pit2 recommended',
    color: '#10B981'
  },
  { 
    id: 'blast_pattern', 
    label: 'Blast Pattern Modification', 
    probability: 60,
    evidence: 'Reduce burden by 10% for better fragmentation',
    color: '#F59E0B'
  },
  { 
    id: 'zone_change', 
    label: 'Extraction Zone Change', 
    probability: 50,
    evidence: 'Move to Zone C with 2.1% Cu grade',
    color: '#3B82F6'
  },
];
```

#### Scenario: Ship Loading Optimization

```javascript
export const portWorkflowQuestions = {
  port_q1: {
    id: 'port_q1',
    text: 'MV Pacific Trader loading is running 8% below target rate (4,140 t/h vs 4,500 t/h target). At this rate, we risk a 6-hour delay and potential demurrage of $45,000. Do you want to investigate?',
    options: [
      { id: 'yes', label: 'Yes, analyze loading performance' },
      { id: 'no', label: 'No, accept current rate' }
    ],
    triggersOutput: 'port_agent_network'
  },
  port_q2: {
    id: 'port_q2',
    text: 'Should I coordinate with logistics and stockpile management to optimize the loading plan?',
    options: [
      { id: 'yes', label: 'Yes, full coordination' },
      { id: 'no', label: 'Just loading analysis' }
    ],
    triggersOutput: 'port_analysis'
  },
};
```

### 6.2 Extended Agent Huddle Configuration

```javascript
export const pitToCustomerHuddleAgents = [
  // Pit Operations
  {
    id: 'PO',
    name: 'Pit Operations Agent',
    color: '#6366F1',
    role: 'Mine planning and extraction',
    steps: [
      { type: 'tool', name: 'query_mine_plan', params: 'pit=3, zone=B' },
      { type: 'result', text: 'Retrieved extraction data • Grade variance confirmed' },
      { type: 'display', component: 'GradeDistributionChart' },
      { type: 'finding', text: 'Zone B grade: 1.65% Cu | Target: 1.85% | Variance: -10.8%' }
    ],
  },
  // Processing
  {
    id: 'PP',
    name: 'Process Plant Agent',
    color: '#EC4899',
    role: 'Mill and flotation optimization',
    steps: [
      { type: 'tool', name: 'analyze_recovery_impact', params: 'grade=1.65' },
      { type: 'result', text: 'Recovery impact calculated • Downstream effects identified' },
      { type: 'display', component: 'RecoveryImpactChart' },
      { type: 'finding', text: 'Est. recovery drop: 1.2% | Daily loss: 8.5t Cu | $72,000/day' }
    ],
  },
  // Logistics
  {
    id: 'LO',
    name: 'Logistics Agent',
    color: '#14B8A6',
    role: 'Transport scheduling',
    steps: [
      { type: 'tool', name: 'check_transport_schedule', params: 'date=today' },
      { type: 'display', component: 'TransportScheduleGantt' },
      { type: 'finding', text: 'Train capacity: 85,000t | Available: 72,000t | Buffer: 15.3%' }
    ],
  },
  // Commercial
  {
    id: 'CO',
    name: 'Commercial Agent',
    color: '#F97316',
    role: 'Contract compliance',
    steps: [
      { type: 'tool', name: 'check_contract_compliance', params: 'contract=CNT-2025-001' },
      { type: 'display', component: 'ContractComplianceChart' },
      { type: 'finding', text: 'MTD compliance: 97.2% | Quality spec: Met | Volume: On track' }
    ],
  },
];
```

---

## 7. Visualization Requirements

### 7.1 New Chart Components Needed

| Component | Chart Type | Purpose | Domain |
|-----------|------------|---------|--------|
| `GradeDistributionChart` | Histogram | Ore grade distribution | Pit Ops |
| `FleetUtilizationChart` | Gauge + Bar | Truck fleet status | Pit Ops |
| `RecoveryTrendChart` | Line | Recovery rate over time | Processing |
| `EnergyConsumptionChart` | Area | Power usage trends | Processing |
| `TransportScheduleGantt` | Gantt | Train/truck scheduling | Logistics |
| `StockpileLevelChart` | Bar + Line | Stockpile volumes & grades | Logistics |
| `VesselLoadingProgress` | Progress | Ship loading status | Port |
| `ContractComplianceChart` | Bullet | Contract KPIs | Commercial |
| `MarketPriceChart` | Candlestick | LME price trends | Commercial |
| `CustomerDeliveryMap` | Geo | Shipment locations | Commercial |

### 7.2 Extended Digital Twin

The mining process flow diagram should be extended to show:

1. **Pit Level Detail**
   - Pit benches and zones
   - Active extraction areas
   - Haul routes

2. **Processing Detail**
   - SAG/Ball mill status
   - Flotation cell banks
   - Thickener levels

3. **Logistics Detail**
   - Rail loading facility
   - Stockpile locations
   - Port berths

4. **Live Indicators**
   - Grade color coding
   - Flow rate indicators
   - Alert markers

---

## 8. Implementation Roadmap

### Phase 1: Foundation (2-3 weeks)

**Objective:** Establish the extended data model and agent framework

- [ ] Extend `scenarioContext.js` with pit/processing/logistics/commercial data
- [ ] Create new agent configurations for PO, PP, LO, CO agents
- [ ] Update topic routing in `getContextByTopic()`
- [ ] Add new API endpoints for extended agents

### Phase 2: Pit Operations (2-3 weeks)

**Objective:** Implement pit operations monitoring and analysis

- [ ] Create grade variance workflow questions
- [ ] Build `GradeDistributionChart` component
- [ ] Build `FleetUtilizationChart` component
- [ ] Implement PO and GO agent logic
- [ ] Add pit-specific fault tree scenarios

### Phase 3: Processing Integration (2-3 weeks)

**Objective:** Add mill and flotation performance tracking

- [ ] Create processing workflow questions
- [ ] Build `RecoveryTrendChart` component
- [ ] Build `EnergyConsumptionChart` component
- [ ] Implement PP and EM agent logic
- [ ] Link processing data to pit operations

### Phase 4: Logistics & Port (2-3 weeks)

**Objective:** Implement transport and port operations

- [ ] Create logistics workflow questions
- [ ] Build `TransportScheduleGantt` component
- [ ] Build `VesselLoadingProgress` component
- [ ] Implement LO and PM agent logic
- [ ] Add demurrage risk alerts

### Phase 5: Commercial (2-3 weeks)

**Objective:** Add contract and customer management

- [ ] Create commercial workflow questions
- [ ] Build `ContractComplianceChart` component
- [ ] Build `MarketPriceChart` component
- [ ] Implement CO, QA, CM agents
- [ ] Add customer delivery tracking

### Phase 6: Integration & Polish (2 weeks)

**Objective:** End-to-end integration and demo polish

- [ ] Integrate all domains in unified workflow
- [ ] Create cross-domain huddle scenarios
- [ ] Update digital twin visualization
- [ ] Performance optimization
- [ ] Demo script and documentation

---

## 9. Data Integration Points

### 9.1 External System Connections

| System | Data | Integration Method |
|--------|------|-------------------|
| **Mine Planning** | Extraction schedules, blast patterns | API / Flat file |
| **Fleet Management** | Truck GPS, dispatch, cycle times | Real-time API |
| **DCS/SCADA** | Mill parameters, flotation data | OPC-UA / Historian |
| **LIMS** | Assay results, quality data | API / Database |
| **TMS** | Transport schedules, tracking | API |
| **Port TOS** | Vessel schedule, loading data | API |
| **SAP ERP** | Contracts, invoices, inventory | RFC / API |
| **Market Feeds** | LME prices, exchange rates | API |

### 9.2 MongoDB Collections Extension

```javascript
// New collections for pit-to-customer
const extendedCollections = [
  {
    collection: 'pit_operations',
    documents: ['extraction_plans', 'blast_patterns', 'grade_data'],
    indexes: ['pit_id', 'zone', 'date'],
  },
  {
    collection: 'fleet_telemetry',
    documents: ['truck_positions', 'cycle_times', 'fuel_consumption'],
    indexes: ['truck_id', 'timestamp'],
    timeSeries: true,
  },
  {
    collection: 'processing_data',
    documents: ['mill_parameters', 'flotation_data', 'recovery_rates'],
    indexes: ['equipment_id', 'timestamp'],
    timeSeries: true,
  },
  {
    collection: 'logistics',
    documents: ['transport_schedules', 'stockpile_inventory', 'vessel_tracking'],
    indexes: ['shipment_id', 'date'],
  },
  {
    collection: 'commercial',
    documents: ['contracts', 'shipments', 'invoices'],
    indexes: ['contract_id', 'customer_id', 'date'],
  },
];
```

---

## Summary

The pit-to-customer extension follows the proven patterns established in the current Cerebra Demo:

1. **Modular Agent Design** - Add new specialist agents for each domain
2. **Scenario Context Pattern** - Extend the centralized data store
3. **Workflow Questions** - Create domain-specific conversation flows
4. **Visualization Components** - Build charts appropriate to each domain
5. **API Structure** - Add new endpoints for extended capabilities

By following this strategy, the demo can be progressively enhanced to show end-to-end value chain optimization while maintaining the clean architecture and user experience of the current implementation.

---

*Document created: January 2025*  
*For: Cerebra Demo Extension Planning*
