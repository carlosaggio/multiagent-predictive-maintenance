// Comprehensive Scenario Context Store for Cerebra Demo
// Deep maintenance knowledge base accessible by the chatbot
// Based on Jaw Crusher 101 real-time dashboard data

// MASTER DATE REFERENCE - All dates should be relative to this
const DEMO_DATE = '2025-01-15'; // Current demo date
const LINER_LAST_REPLACED = '2024-05-15'; // 8 months ago
const LAST_MAJOR_MAINTENANCE = '2024-08-04'; // Last PM complete
const ALERT_TRIGGERED = '2025-01-10'; // When AI detected issue
const SCHEDULED_REPAIR = '2025-01-20'; // Planned shutdown

export const scenarioContext = {
  // Current scenario state
  currentScenario: {
    id: 'LPO-2025-001',
    name: 'Liner Plate Optimization',
    equipment: 'Jaw Crusher 101',
    equipmentId: 'CRUSHER-101',
    issue: 'Efficiency drop from 89% to 82%',
    rootCause: 'Liner wear degradation (85% likelihood)',
    status: 'Analysis Complete - Work Order Released',
    alertTriggeredDate: ALERT_TRIGGERED,
    analysisCompletedDate: DEMO_DATE,
    demoDate: DEMO_DATE,
  },
  
  // Work Order Information
  workOrder: {
    number: '4000000147',
    sapId: 'WO-2025-0147',
    notificationNumber: '10075234',
    status: 'REL',
    statusText: 'Released',
    type: 'PM02 - Corrective Maintenance',
    priority: '1 - Very High',
    scheduledStart: `${SCHEDULED_REPAIR} 06:00`,
    scheduledFinish: `${SCHEDULED_REPAIR} 14:00`,
    estimatedDuration: '8 hours',
    estimatedCost: '$20,174.00',
    costBreakdown: {
      labor: '$3,200 (32 hours @ $100/hr)',
      materials: '$16,494',
      overhead: '$480',
    },
    approvalStatus: 'Submitted for scheduling approval',
    createdBy: 'CEREBRA_AI',
    createdDate: DEMO_DATE,
  },
  
  // Equipment Details - Deep technical info from dashboard
  equipment: {
    id: 'CRUSHER-101',
    name: 'Jaw Crusher 101',
    fullName: 'Metso C160 Primary Jaw Crusher',
    manufacturer: 'Metso Outotec',
    model: 'C160',
    serialNumber: 'MC-2019-45782',
    installDate: '2019-03-15',
    location: 'MINE-01-CRUSH-001',
    functionalLocation: 'Primary Crushing Circuit - Stage 1',
    criticality: 'A - Critical',
    abcClass: 'A',
    
    // Current Performance Metrics
    currentEfficiency: '82%',
    targetEfficiency: '89%',
    designEfficiency: '92%',
    efficiencyDrop: '7%',
    
    // Real-time Status from Dashboard
    operatingState: 'Steady',
    connectivity: 'Connected',
    activeAlarms: 5,
    healthScore: 68,
    healthTrend: 'Declining',
    
    // Hours and Maintenance
    operatingHours: 48250,
    hoursSinceLastPM: 639,
    lastMajorOverhaul: LAST_MAJOR_MAINTENANCE,
    nextScheduledOverhaul: '2025-06-15',
    
    // Production Impact
    productionLoss: '$47,500/day',
    monthlyProductionImpact: '$1.4M potential',
    
    specifications: {
      feedOpening: '1600 x 1200 mm',
      closedSideSetting: '150-300 mm',
      capacity: '1,400-2,100 t/h',
      motorPower: '400 kW',
      weight: '175,000 kg',
      rpm: '200-220',
    },
  },
  
  // Live Sensor Data from Dashboard
  sensorData: {
    timestamp: `${DEMO_DATE} 14:32:00`,
    
    // Hydraulic Oil Pump
    hydraulicOilPump: {
      bearingDE_Vib: { value: 0.55, unit: 'mm/s', status: 'normal', threshold: 2.0 },
      bearingNDE_Vib: { value: 0.40, unit: 'mm/s', status: 'normal', threshold: 2.0 },
      dischargePressure: { value: 21, unit: 'Barg', status: 'normal', threshold: 25 },
      motorWindingTemp: { value: 110, unit: '°C', status: 'normal', threshold: 130 },
      oilFilterDP: { value: 15, unit: 'psi', status: 'normal', threshold: 25 },
    },
    
    // Lube Oil Pump
    lubeOilPump: {
      bearingDE_Vib: { value: 0.65, unit: 'mm/s', status: 'normal', threshold: 2.0 },
      bearingNDE_Vib: { value: 1.20, unit: 'mm/s', status: 'warning', threshold: 2.0 },
      dischargePressure: { value: 21, unit: 'Barg', status: 'normal', threshold: 25 },
    },
    
    // Pitman Assembly - CRITICAL ALERTS
    pitmanAssembly: {
      nde_BearingTemp: { value: 108, unit: '°C', status: 'alarm', threshold: 85, alert: true },
      de_BearingVib: { value: 55, unit: 'mm/s', status: 'alarm', threshold: 25, alert: true },
      de_BearingTemp: { value: 45, unit: '°C', status: 'normal', threshold: 85 },
      nde_BearingVib: { value: 1.55, unit: 'mm/s', status: 'warning', threshold: 2.0 },
    },
    
    // Drive Motor
    driveMotor: {
      phaseAB_Voltage: { value: 718, unit: 'V', status: 'normal', nominal: 720 },
      phaseBC_Voltage: { value: 718, unit: 'V', status: 'normal', nominal: 720 },
      phaseCA_Voltage: { value: 718, unit: 'V', status: 'normal', nominal: 720 },
      phaseA_Current: { value: 120, unit: 'A', status: 'alarm', threshold: 100, alert: true },
      phaseB_Current: { value: 110, unit: 'A', status: 'alarm', threshold: 100, alert: true },
      phaseC_Current: { value: 98, unit: 'A', status: 'warning', threshold: 100 },
      speed: { value: 3000, unit: 'RPM', status: 'normal', nominal: 3000 },
    },
    
    // Crusher Output
    crusherOutput: {
      dischargeOreSize: { value: 185, unit: 'mm', status: 'warning', target: 150 },
    },
  },
  
  // Active Alarms (5 total from dashboard)
  activeAlarms: [
    { id: 'ALM-001', component: 'Pitman Assembly', parameter: 'NDE Bearing Temp', value: '108°C', severity: 'critical', threshold: '85°C', time: `${DEMO_DATE} 14:15` },
    { id: 'ALM-002', component: 'Pitman Assembly', parameter: 'DE Bearing Vib', value: '55 mm/s', severity: 'critical', threshold: '25 mm/s', time: `${DEMO_DATE} 14:18` },
    { id: 'ALM-003', component: 'Drive Motor', parameter: 'Phase A Current', value: '120 A', severity: 'high', threshold: '100 A', time: `${DEMO_DATE} 13:45` },
    { id: 'ALM-004', component: 'Drive Motor', parameter: 'Phase B Current', value: '110 A', severity: 'high', threshold: '100 A', time: `${DEMO_DATE} 13:47` },
    { id: 'ALM-005', component: 'Efficiency', parameter: 'Throughput Efficiency', value: '82%', severity: 'warning', threshold: '85%', time: ALERT_TRIGGERED },
  ],
  
  // Liner Component Details
  linerDetails: {
    component: 'Jaw Liner Plates',
    partNumbers: {
      fixed: 'CJ-8845',
      movable: 'CJ-8846',
    },
    material: 'High Manganese Steel (Mn14)',
    originalThickness: '150mm',
    currentThickness: '97.5mm (65% remaining)',
    criticalThreshold: '105mm (70% remaining)',
    wearRate: '2.1mm/week (accelerated)',
    normalWearRate: '1.5mm/week',
    lastReplacement: LINER_LAST_REPLACED,
    monthsSinceReplacement: 8,
    expectedLifecycle: '6 months',
    actualLifecycle: '8 months (overrun)',
    lifecycleOverrun: '133%',
    wearPattern: 'Asymmetric - Zone B showing 85% degradation',
    zones: {
      A: { wear: 60, thickness: '60mm', status: 'acceptable', color: '#F59E0B' },
      B: { wear: 85, thickness: '22.5mm', status: 'critical', color: '#EF4444' },
      C: { wear: 55, thickness: '67.5mm', status: 'acceptable', color: '#10B981' },
      D: { wear: 70, thickness: '45mm', status: 'warning', color: '#F59E0B' },
    },
  },
  
  // Root Cause Analysis - Full FMEA
  rootCauseAnalysis: {
    primaryCause: 'Liner wear degradation',
    likelihood: '85%',
    methodology: 'FMEA (Failure Mode and Effects Analysis)',
    rankedCauses: [
      {
        rank: 1,
        cause: 'Liner wear degradation',
        probability: 85,
        severity: 'Critical',
        rpn: 720,
        evidence: [
          '65% thickness remaining (below 70% threshold)',
          `8 months since replacement (${LINER_LAST_REPLACED})`,
          'Asymmetric wear pattern - Zone B critical',
          'Pitman bearing vibration elevated (55 mm/s)',
        ],
        recommendation: 'Immediate liner replacement',
      },
      {
        rank: 2,
        cause: 'Hard ore feed composition',
        probability: 75,
        severity: 'High',
        rpn: 540,
        evidence: [
          'Bond Work Index +15% (harder ore zone)',
          'Silica content +8%',
          'Motor current elevated (120A vs 85A normal)',
        ],
        recommendation: 'Adjust blasting patterns, blend ore sources',
      },
      {
        rank: 3,
        cause: 'Bearing degradation (Pitman)',
        probability: 60,
        severity: 'High',
        rpn: 480,
        evidence: [
          'NDE Bearing Temp: 108°C (threshold: 85°C)',
          'DE Bearing Vib: 55 mm/s (threshold: 25 mm/s)',
          'Correlated with liner wear pattern',
        ],
        recommendation: 'Inspect bearings during liner replacement',
      },
      {
        rank: 4,
        cause: 'Feed rate overload',
        probability: 35,
        severity: 'Medium',
        rpn: 280,
        evidence: [
          '+/-15% feed rate variation in control logs',
          'Surge loading patterns detected',
        ],
        recommendation: 'Optimize PID parameters',
      },
    ],
  },
  
  // Reliability Engineering Metrics
  reliabilityMetrics: {
    weibull: {
      beta: 2.1,
      eta: 2800,
      interpretation: 'Wear-out failure mode (β > 1)',
      r2: 0.94,
    },
    failureProbability: '38%',
    mtbf: '2,450 hours',
    mttr: '8 hours',
    availability: '99.67%',
    rpn: 432,
    rpnBreakdown: {
      severity: 8,
      occurrence: 6,
      detection: 9,
    },
    remainingUsefulLife: '5-7 days',
    confidenceInterval: '90%',
    timeToFailure: {
      p10: '3 days',
      p50: '6 days',
      p90: '12 days',
    },
    healthScore: 68,
    healthScoreBaseline: 85,
    healthScoreDrop: 17,
  },
  
  // Analysis Results
  analysis: {
    confidenceScore: 0.92,
    dataPointsAnalyzed: 720,
    correlationWithWear: 0.92,
    analysisDate: `${DEMO_DATE} 14:32:00`,
    timeseriesFindings: {
      trendDirection: 'Declining',
      degradationRate: 'Accelerating',
      anomaliesDetected: 3,
      lastAnomalyDate: ALERT_TRIGGERED,
    },
    sensorCorrelations: {
      efficiencyVsLinerWear: 0.92,
      vibrationVsWear: 0.87,
      temperatureVsLoad: 0.78,
      currentVsHardness: 0.85,
    },
    linerCondition: {
      currentThickness: '65%',
      criticalThreshold: '70%',
      remainingLife: '5-7 days',
      wearRate: 'Accelerated (40% above normal)',
    },
    contributingFactors: [
      `Liner exceeded expected 6-month lifecycle by 2 months (installed ${LINER_LAST_REPLACED})`,
      'Harder ore from Pit 3 Zone B (Bond Work Index +15%)',
      'Asymmetric wear pattern indicates alignment issue',
      'Recent rainfall increased ore moisture 8%',
      'Pitman bearing stress from worn liners (55 mm/s vibration)',
    ],
  },
  
  // Agent Contributions - What each agent found
  agents: {
    RO: {
      name: 'Resource Orchestration Agent',
      role: 'Crew & scheduling coordination',
      dataSourcesQueried: ['SAP PM', 'HR System', 'Scheduling System'],
      findings: [
        `Retrieved 24 work orders for CRUSHER-101 (18-month history)`,
        `Last liner replacement: ${LINER_LAST_REPLACED} (WO-2024-0892)`,
        `Last PM complete: ${LAST_MAJOR_MAINTENANCE} (639 hrs ago)`,
        'Lead technician: James Morrison (95% skill match)',
        `Team A (4 fitters) available for ${SCHEDULED_REPAIR}`,
        'No conflicts with other critical jobs',
      ],
      recommendations: [
        'Assign Team A for primary execution',
        'Schedule backup technician from Team B',
        'Coordinate with production for shutdown window',
      ],
    },
    TA: {
      name: 'Timeseries Analysis Agent',
      role: 'Sensor data trend analysis',
      dataSourcesQueried: ['PI Historian', 'SCADA', 'IoT Sensors'],
      findings: [
        '720 readings analyzed over 30 days',
        'Efficiency-liner wear correlation: r=0.92 (strong)',
        `7% efficiency decline since ${ALERT_TRIGGERED}`,
        'Degradation rate accelerating (2.1mm/week vs 1.5mm normal)',
        'Pitman bearing vibration: 55 mm/s (120% above threshold)',
        'Drive motor current: 120A (41% above normal 85A)',
      ],
      metrics: {
        efficiencyCorrelation: 0.92,
        vibrationIncrease: '120%',
        currentIncrease: '41%',
        temperatureIncrease: '27%',
        dataPoints: 720,
      },
    },
    MI: {
      name: 'Maintenance Intelligence Agent',
      role: 'Reliability engineering analysis',
      dataSourcesQueried: ['CMMS', 'Inspection Reports', 'Failure Database'],
      findings: [
        'RPN (Risk Priority Number): 432',
        'Probability of failure: 38% (next 7 days)',
        'Weibull analysis: β=2.1 (wear-out phase)',
        `Lifecycle exceeded by 133% (8 months vs 6 month expected)`,
        'Health Score: 68 (baseline 85, -17 points)',
        'Similar failure pattern in June 2023 (WO-2023-0456)',
      ],
      metrics: {
        rpn: 432,
        failureProbability: '38%',
        weibullBeta: 2.1,
        lifecycleOverrun: '133%',
        healthScore: 68,
      },
    },
    IL: {
      name: 'Inventory & Logistics Agent',
      role: 'Parts availability check',
      dataSourcesQueried: ['SAP MM', 'Supplier Portal', 'Warehouse System'],
      findings: [
        'CJ-8845 (Fixed liner): 4 units @ $4,250 each - WH-02',
        'CJ-8846 (Movable liner): 3 units @ $3,800 each - WH-02',
        'All fasteners (BT-M24X80, NT-M24, WS-M24) in stock',
        'Location: WH-02, Bin C47',
        'No procurement delays expected',
        'Backup supplier (Metso direct): 5-day lead time',
      ],
      partsStatus: {
        allAvailable: true,
        location: 'WH-02, Bin C47',
        backupLeadTime: '5 days',
        totalMaterialCost: '$16,494',
      },
    },
    LD: {
      name: 'Liner Diagnostics Agent',
      role: 'Specialized liner wear analysis',
      dataSourcesQueried: ['Ultrasonic Thickness Data', 'Visual Inspection DB', 'Wear Models'],
      findings: [
        'Zone B: 85% wear degradation (22.5mm remaining) - CRITICAL',
        'Zone D: 70% wear (45mm remaining) - WARNING',
        'Zone A: 60% wear (60mm remaining) - Acceptable',
        'Zone C: 55% wear (67.5mm remaining) - Best condition',
        'Asymmetric pattern suggests jaw misalignment',
        'Estimated remaining life: 5-7 days at current wear rate',
      ],
      diagnosticDetails: {
        measurementMethod: 'Ultrasonic thickness gauge',
        lastInspection: '2024-11-30',
        inspectionFindings: '65% average remaining thickness',
        criticalZone: 'Zone B',
        wearRateAcceleration: '40%',
      },
    },
  },
  
  // Parts Information
  parts: [
    { id: 'CJ-8845', name: 'Jaw Liner Plate - Fixed (Metso C160)', qty: 2, unitPrice: 4250, price: '$8,500', available: 4, location: 'WH-02', bin: 'C47' },
    { id: 'CJ-8846', name: 'Jaw Liner Plate - Movable (Metso C160)', qty: 2, unitPrice: 3800, price: '$7,600', available: 3, location: 'WH-02', bin: 'C47' },
    { id: 'BT-M24X80', name: 'Bolt M24x80 Grade 10.9', qty: 24, unitPrice: 8.50, price: '$204', available: 120, location: 'WH-02', bin: 'F12' },
    { id: 'NT-M24', name: 'Nut M24 Grade 10', qty: 24, unitPrice: 2.50, price: '$60', available: 200, location: 'WH-02', bin: 'F12' },
    { id: 'WS-M24', name: 'Washer M24 Flat', qty: 48, unitPrice: 1.25, price: '$60', available: 500, location: 'WH-02', bin: 'F13' },
    { id: 'GR-ANTISEIZE', name: 'Anti-Seize Compound 500g', qty: 2, unitPrice: 35, price: '$70', available: 15, location: 'WH-02', bin: 'L08' },
  ],
  
  // Labor Assignment
  labor: {
    lead: 'James Morrison',
    leadId: 'EMP-0042',
    leadRole: 'Senior Mechanical Fitter',
    leadCertifications: ['LOTO Certified', 'Confined Space', 'Working at Heights', 'Crusher Specialist'],
    skillMatch: '95%',
    yearsExperience: 12,
    crusherJobsCompleted: 47,
    crewName: 'Crushing Maintenance Team A',
    crewSize: 4,
    members: [
      { name: 'James Morrison', role: 'Lead Technician', trade: 'Mechanical Fitter', experience: '12 years' },
      { name: 'Robert Chen', role: 'Technician', trade: 'Mechanical Fitter', experience: '8 years' },
      { name: 'Maria Santos', role: 'Technician', trade: 'Rigger', experience: '6 years' },
      { name: 'David Wilson', role: 'Apprentice', trade: 'Mechanical Fitter', experience: '2 years' },
    ],
    estimatedHours: 8,
    laborRate: '$100/hr',
    totalLaborCost: '$3,200',
    shift: 'Day Shift (06:00-18:00)',
    scheduledDate: SCHEDULED_REPAIR,
  },
  
  // Maintenance History (chronological)
  maintenanceHistory: [
    { date: '2024-05-15', type: 'Corrective', wo: 'WO-2024-0892', description: 'Liner replacement', cost: '$16,100', outcome: 'Success', technician: 'J. Morrison' },
    { date: '2024-07-20', type: 'Inspection', wo: 'INS-2024-0156', description: 'Thickness check - 78% remaining', cost: '$450', outcome: 'Normal wear' },
    { date: '2024-08-04', type: 'Preventive', wo: 'WO-2024-1123', description: 'Scheduled PM - oil change, bearing inspection', cost: '$2,400', outcome: 'Complete' },
    { date: '2024-10-15', type: 'Inspection', wo: 'INS-2024-0287', description: 'Vibration analysis - minor elevation noted', cost: '$600', outcome: 'Monitor' },
    { date: '2024-11-30', type: 'Inspection', wo: 'INS-2024-0342', description: 'Thickness check - 65% remaining', cost: '$450', outcome: 'Wear accelerating' },
    { date: '2025-01-10', type: 'Alert', wo: 'N/A', description: 'AI detected efficiency drop from 89% to 82%', cost: 'N/A', outcome: 'RCA initiated' },
    { date: '2025-01-15', type: 'Analysis', wo: 'N/A', description: 'Super Agent RCA completed - liner wear confirmed', cost: 'N/A', outcome: 'WO created' },
  ],
  
  // Safety Requirements
  safety: {
    permits: [
      { type: 'LOTO', status: 'Required', number: 'LOTO-2025-0234', expiry: SCHEDULED_REPAIR },
      { type: 'Working at Heights', status: 'Required', number: 'WAH-2025-0089', expiry: SCHEDULED_REPAIR },
      { type: 'Confined Space', status: 'Not Required' },
      { type: 'Hot Work', status: 'Not Required' },
    ],
    hazards: ['Heavy lifting (>25kg)', 'Pinch points', 'Falling objects', 'Stored energy', 'High temperature surfaces'],
    ppe: ['Hard hat', 'Safety glasses', 'Steel-toed boots', 'Hi-vis vest', 'Cut-resistant gloves', 'Hearing protection', 'Face shield (during removal)'],
    jsaNumber: 'JSA-CRUSH-001',
    jsaStatus: 'Approved',
    toolboxTalkRequired: true,
    toolboxTalkTopic: 'Jaw Crusher Liner Replacement - Energy Isolation Procedures',
  },
  
  // Operations Context
  operations: {
    currentShift: 'Day Shift',
    plantStatus: 'Running',
    throughput: '1,850 t/h (88% of capacity)',
    normalThroughput: '2,100 t/h',
    throughputLoss: '250 t/h',
    dailyProductionLoss: '6,000 tonnes',
    oreSource: 'Pit 3 - Zone B (harder ore zone)',
    bondWorkIndex: '15.2 kWh/t (+15% from baseline)',
    moistureContent: '8% (+2% from rainfall)',
    shutdownWindow: `${SCHEDULED_REPAIR}, 06:00 - 14:00`,
    productionImpact: 'Full circuit shutdown required (8 hours)',
    downtimeCost: '$47,500/day (lost production)',
  },
  
  // Recommendations
  recommendations: [
    { priority: 1, action: 'Replace jaw liner plates (fixed & movable)', timeline: 'Within 5 days', impact: 'Restore efficiency to 89%', cost: '$16,100', status: 'WO Created' },
    { priority: 2, action: 'Inspect Pitman bearings during shutdown', timeline: 'During liner replacement', impact: 'Prevent secondary failure', cost: 'Included in WO' },
    { priority: 3, action: 'Check jaw alignment and adjust CSS to 150mm', timeline: 'Post-replacement', impact: 'Optimize product size, even wear', cost: '$200' },
    { priority: 4, action: 'Review drive motor current draw', timeline: '24 hours', impact: 'Prevent motor overload', cost: '$0' },
    { priority: 5, action: 'Implement predictive liner wear monitoring', timeline: '30 days', impact: 'Prevent future unplanned downtime', cost: '$15,000' },
  ],
  
  // Key Dates Summary
  keyDates: {
    demoDate: DEMO_DATE,
    alertTriggered: ALERT_TRIGGERED,
    linerLastReplaced: LINER_LAST_REPLACED,
    lastMajorMaintenance: LAST_MAJOR_MAINTENANCE,
    scheduledRepair: SCHEDULED_REPAIR,
    nextScheduledPM: '2025-03-15',
    linerMonthsInService: 8,
    linerExpectedLifecycle: 6,
  },
  
  // Available Tools for chatbot
  availableTools: [
    { id: 'sap_query', name: 'SAP PM Query', description: 'Query work orders, equipment, history' },
    { id: 'timeseries_query', name: 'Timeseries Analysis', description: 'Analyze sensor trends from PI/Historian' },
    { id: 'reliability_calc', name: 'Reliability Calculator', description: 'Weibull, MTBF, RUL calculations' },
    { id: 'inventory_check', name: 'Inventory Check', description: 'Parts availability in SAP MM' },
    { id: 'liner_diagnostics', name: 'Liner Diagnostics', description: 'Wear pattern analysis' },
    { id: 'crew_scheduler', name: 'Crew Scheduler', description: 'Team assignments and availability' },
    { id: 'cost_estimator', name: 'Cost Estimator', description: 'Job costing breakdown' },
    { id: 'alarm_query', name: 'Alarm Query', description: 'Active alarms and history' },
  ],
};

// Helper function to get context by topic
export const getContextByTopic = (topic) => {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('work order') || topicLower.includes('wo') || topicLower.includes('sap') || topicLower.includes('4000')) {
    return { topic: 'Work Order', data: scenarioContext.workOrder, toolToInvoke: 'sap_query', agent: 'RO' };
  }
  if (topicLower.includes('equipment') || topicLower.includes('crusher') || topicLower.includes('metso') || topicLower.includes('c160') || topicLower.includes('jaw')) {
    return { topic: 'Equipment', data: scenarioContext.equipment, toolToInvoke: null, agent: null };
  }
  if (topicLower.includes('sensor') || topicLower.includes('temperature') || topicLower.includes('vibration') || topicLower.includes('current') || topicLower.includes('voltage')) {
    return { topic: 'Sensor Data', data: scenarioContext.sensorData, toolToInvoke: 'timeseries_query', agent: 'TA' };
  }
  if (topicLower.includes('alarm') || topicLower.includes('alert')) {
    return { topic: 'Alarms', data: scenarioContext.activeAlarms, toolToInvoke: 'alarm_query', agent: 'TA' };
  }
  if (topicLower.includes('timeseries') || topicLower.includes('efficiency') || topicLower.includes('trend')) {
    return { topic: 'Timeseries', data: scenarioContext.analysis, toolToInvoke: 'timeseries_query', agent: 'TA' };
  }
  if (topicLower.includes('part') || topicLower.includes('inventory') || topicLower.includes('stock') || topicLower.includes('cj-')) {
    return { topic: 'Inventory', data: scenarioContext.parts, toolToInvoke: 'inventory_check', agent: 'IL' };
  }
  if (topicLower.includes('liner') || topicLower.includes('wear') || topicLower.includes('diagnostic') || topicLower.includes('thickness') || topicLower.includes('zone')) {
    return { topic: 'Liner Diagnostics', data: scenarioContext.linerDetails, toolToInvoke: 'liner_diagnostics', agent: 'LD' };
  }
  if (topicLower.includes('reliability') || topicLower.includes('weibull') || topicLower.includes('rpn') || topicLower.includes('mtbf') || topicLower.includes('failure') || topicLower.includes('health')) {
    return { topic: 'Reliability', data: scenarioContext.reliabilityMetrics, toolToInvoke: 'reliability_calc', agent: 'MI' };
  }
  if (topicLower.includes('labor') || topicLower.includes('crew') || topicLower.includes('technician') || topicLower.includes('james') || topicLower.includes('team') || topicLower.includes('morrison')) {
    return { topic: 'Labor', data: scenarioContext.labor, toolToInvoke: 'crew_scheduler', agent: 'RO' };
  }
  if (topicLower.includes('root cause') || topicLower.includes('rca') || topicLower.includes('fmea') || topicLower.includes('why')) {
    return { topic: 'Root Cause', data: scenarioContext.rootCauseAnalysis, toolToInvoke: null, agent: null };
  }
  if (topicLower.includes('cost') || topicLower.includes('budget') || topicLower.includes('price') || topicLower.includes('$')) {
    return { topic: 'Cost', data: scenarioContext.workOrder.costBreakdown, toolToInvoke: 'cost_estimator', agent: null };
  }
  if (topicLower.includes('safety') || topicLower.includes('permit') || topicLower.includes('loto') || topicLower.includes('hazard') || topicLower.includes('ppe')) {
    return { topic: 'Safety', data: scenarioContext.safety, toolToInvoke: null, agent: null };
  }
  if (topicLower.includes('history') || topicLower.includes('previous') || topicLower.includes('past') || topicLower.includes('last')) {
    return { topic: 'History', data: scenarioContext.maintenanceHistory, toolToInvoke: 'sap_query', agent: 'RO' };
  }
  if (topicLower.includes('schedule') || topicLower.includes('when') || topicLower.includes('date') || topicLower.includes('time') || topicLower.includes('january') || topicLower.includes('20th')) {
    return { topic: 'Schedule', data: scenarioContext.keyDates, toolToInvoke: null, agent: null };
  }
  if (topicLower.includes('operation') || topicLower.includes('production') || topicLower.includes('throughput') || topicLower.includes('ore') || topicLower.includes('pit')) {
    return { topic: 'Operations', data: scenarioContext.operations, toolToInvoke: null, agent: null };
  }
  if (topicLower.includes('recommend') || topicLower.includes('action') || topicLower.includes('what should') || topicLower.includes('next step')) {
    return { topic: 'Recommendations', data: scenarioContext.recommendations, toolToInvoke: null, agent: null };
  }
  if (topicLower.includes('agent') || topicLower.includes('huddle') || topicLower.includes('analysis')) {
    return { topic: 'Agents', data: scenarioContext.agents, toolToInvoke: null, agent: null };
  }
  if (topicLower.includes('pitman') || topicLower.includes('bearing')) {
    return { topic: 'Pitman Assembly', data: scenarioContext.sensorData.pitmanAssembly, toolToInvoke: 'timeseries_query', agent: 'TA' };
  }
  if (topicLower.includes('motor') || topicLower.includes('drive')) {
    return { topic: 'Drive Motor', data: scenarioContext.sensorData.driveMotor, toolToInvoke: 'timeseries_query', agent: 'TA' };
  }
  
  return { topic: 'General', data: scenarioContext.currentScenario, toolToInvoke: null, agent: null };
};

export default scenarioContext;
