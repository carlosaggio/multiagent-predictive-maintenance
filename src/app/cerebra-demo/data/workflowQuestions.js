// Workflow Questions for the Cerebra Demo
// Each question is shown sequentially based on user interaction
// Equipment: Jaw Crusher 101 (Metso C160)

export const workflowQuestions = {
  q1: {
    id: 'q1',
    text: 'Hi Carlos, I detected a 7% efficiency drop in Jaw Crusher 101 (89% → 82%) since January 10. Health Score is now 68 with 5 active alarms. Do you want to investigate?',
    options: [
      { id: 'yes', label: 'Yes, analyze efficiency drop' },
      { id: 'no', label: 'No, I need something else' }
    ],
    nextOnYes: 'q2',
    triggersOutput: 'agent_network'
  },
  q2: {
    id: 'q2',
    text: 'Do you want to perform a detailed Root Cause Analysis (RCA) for this Loss Profit Opportunity? Current production loss is 250 t/h ($47,500/day).',
    options: [
      { id: 'yes', label: 'Yes, perform RCA' },
      { id: 'no', label: 'No, just summary' }
    ],
    nextOnYes: null,
    triggersOutput: 'initial_analysis'
  },
  q3: {
    id: 'q3',
    text: 'Based on the Fault Mode Analysis, select a scenario to investigate further:',
    options: [],
    isDynamic: true,
    nextOnSelect: null,
    triggersOutput: 'trusted_huddle'
  },
  q4: {
    id: 'q4',
    text: 'The Trusted Huddle analysis is complete. Would you like to view the knowledge graph showing how agents collaborated to reach these conclusions?',
    options: [
      { id: 'yes', label: 'Yes, show knowledge graph' },
      { id: 'no', label: 'No, proceed to recommendations' }
    ],
    triggersOutput: 'knowledge_graph',
    nextOnYes: 'show_graph',
    nextOnNo: 'q5'
  },
  q5: {
    id: 'q5',
    text: 'Do you want to receive prioritized action recommendations for Jaw Crusher 101?',
    options: [
      { id: 'yes', label: 'Yes, show recommendations' },
      { id: 'no', label: 'No, end analysis' }
    ],
    triggersOutput: 'recommendations',
    nextOnYes: 'q6'
  },
  q6: {
    id: 'q6',
    text: 'Would you like to create a SAP PM work order for the liner replacement? Scheduled window: January 20, 06:00-14:00.',
    options: [
      { id: 'yes', label: 'Yes, create work order' },
      { id: 'no', label: 'No, end here' }
    ],
    triggersOutput: 'work_order',
    isFinal: true
  }
};

// Fault tree options for Q3 - populated after initial analysis
// Top 4 causes ranked by probability
export const faultTreeOptions = [
  { 
    id: 'liner_wear', 
    label: 'Liner Wear Degradation', 
    probability: 85,
    evidence: 'Last replaced May 15, 2024 (8 months) • Zone B at 85% wear',
    color: '#EF4444'
  },
  { 
    id: 'hard_ore', 
    label: 'Hard Ore Feed Composition', 
    probability: 75,
    evidence: 'Bond Work Index +15% • Pit 3 Zone B harder ore',
    color: '#F59E0B'
  },
  { 
    id: 'bearing_degradation', 
    label: 'Pitman Bearing Degradation', 
    probability: 60,
    evidence: 'NDE Temp: 108°C (>85°C) • DE Vib: 55 mm/s (>25 mm/s)',
    color: '#FBBF24'
  },
  { 
    id: 'motor_overload', 
    label: 'Drive Motor Overload', 
    probability: 40,
    evidence: 'Phase currents 98-120A (threshold: 100A)',
    color: '#6B7280'  // Gray for lower probability
  }
];

// Agent data for trusted huddle
// CRITICAL: Each agent has ONE unique finding - no repetition, consistent with scenario
// Source of truth: Liner replaced May 15, 2024 (8 months), 65% remaining, RUL 5-7 days, RPN 432
// Colors aligned with HuddleBanner: RO=Orange, TA=Red, MI=Purple, IL=Green, LD=Blue
export const huddleAgents = [
  {
    id: 'RO',
    name: 'Resource Orchestration Agent',
    color: '#F59E0B', // Orange
    role: 'Coordinates crew and resources',
    steps: [
      { type: 'tool', name: 'sap_pm_query', params: 'equipment=CRUSHER-101, history=18mo' },
      { type: 'result', text: 'Retrieved 24 work orders • Last liner: May 15, 2024 (8mo ago)' },
      { type: 'display', component: 'PersonnelSankeyChart' },
      { type: 'finding', text: 'Jan 20 shutdown confirmed | Lead: J. Morrison (47 jobs) | Team A: 4 fitters | 8hr duration' }
    ],
    duration: 8000
  },
  {
    id: 'TA',
    name: 'Timeseries Analysis Agent',
    color: '#EF4444', // Red
    role: 'Analyzes sensor data trends',
    steps: [
      { type: 'tool', name: 'query_historian', params: 'equipment=CRUSHER-101, days=30' },
      { type: 'result', text: '720 sensor readings analyzed • Strong wear correlation detected' },
      { type: 'display', component: 'EfficiencyStreamChart' },
      { type: 'display', component: 'BulletChart' },
      { type: 'finding', text: 'Efficiency 89%→82% (30 days) | Wear correlation r=0.92 | Degradation 0.23%/day | Pitman vib +120%' }
    ],
    duration: 10000
  },
  {
    id: 'MI',
    name: 'Maintenance Intelligence Agent',
    color: '#8B5CF6', // Purple
    role: 'Reliability engineering analysis',
    steps: [
      { type: 'tool', name: 'calculate_reliability', params: 'component=jaw_liner, last_replacement=2024-05-15' },
      { type: 'display', component: 'WeibullChart' },
      { type: 'display', component: 'FailureModeAreaBump' },
      { type: 'finding', text: 'Weibull β=2.1 (wear-out) | 8mo = 133% of 6mo lifecycle | RPN=432 | P(F) 7-day: 38%' }
    ],
    duration: 9000
  },
  {
    id: 'IL',
    name: 'Inventory & Logistics Agent',
    color: '#10B981', // Green
    role: 'Parts availability check',
    steps: [
      { type: 'tool', name: 'query_sap_mm', params: 'parts=CJ-8845,CJ-8846, warehouse=WH-02' },
      { type: 'display', component: 'InventoryBarChart' },
      { type: 'finding', text: 'CJ-8845 Fixed: 4 units | CJ-8846 Movable: 3 units | $16,494 total | Lead time: 0 days' }
    ],
    duration: 7000
  },
  {
    id: 'LD',
    name: 'Liner Diagnostics Agent',
    color: '#3B82F6', // Blue
    role: 'Specialized liner analysis',
    steps: [
      { type: 'tool', name: 'analyze_liner_wear', params: 'equipment=CRUSHER-101, inspection=2024-11-30' },
      { type: 'display', component: 'WearHeatmap' },
      { type: 'display', component: 'CrusherLinerVisualization' },
      { type: 'finding', text: 'Zone B (feed): 65% → CRITICAL | Asymmetric wear = misalignment | RUL: 5-7 days' }
    ],
    duration: 10000
  }
];

// Recommendations data - aligned with scenario
export const recommendations = {
  immediate: [
    'Schedule liner replacement during Jan 20 shutdown window (WO-4000000147 created)',
    'Reduce crusher feed rate by 10% to extend liner life until replacement',
    'Assign James Morrison as lead technician - 47 crusher jobs completed, 95% skill match'
  ],
  nearTerm: [
    'Inspect Pitman bearings during liner replacement (NDE Temp 108°C is 27% above threshold)',
    'Check jaw alignment - asymmetric wear pattern indicates 2-3mm drift',
    'Review motor protection settings - Phase A current 20% above threshold'
  ],
  longTerm: [
    'Install predictive liner wear monitoring (ultrasonic thickness sensors)',
    'Adjust maintenance intervals based on 133% lifecycle overrun finding',
    'Evaluate ore blending strategy for harder Pit 3 Zone B material'
  ]
};
