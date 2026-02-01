/**
 * WAIO Scenario Context
 * 
 * Complete data store for the WAIO Pit-to-Port Shift Optimiser demo.
 * All values are synthetic placeholders for demo purposes.
 */

// Master date references
const DEMO_DATE = '2025-01-15';
const SHIFT_START = '2025-01-15T06:00:00+08:00';
const SHIFT_END = '2025-01-15T18:00:00+08:00';

// Shift context
export const waioShift = {
  shiftId: 'SHIFT-2025-01-15-DAY',
  site: 'WAIO',
  start: SHIFT_START,
  end: SHIFT_END,
  crew: 'Day Shift A',
  supervisor: 'Sarah Mitchell',
  objectiveWeights: { value: 0.45, tonnes: 0.25, compliance: 0.25, risk: 0.05 },
  kpis: {
    planCompliance: 0.84,
    planComplianceTrend: [-0.02, -0.01, 0.01, -0.03, -0.02, 0.00, -0.01, -0.02],
    underSpecRisk: 0.38,
    tonnesLoaded: 145327,
    tonnesTarget: 155000,
    valueAtRiskUSD: 1800000,
    trainsCompleted: 4,
    trainsRemaining: 3,
  },
  assumptions: [
    { id: 'A1', text: 'Assay lag ~6h on Pit 3 Zone B', confidence: 0.7, impact: 'medium' },
    { id: 'A2', text: 'Unrecorded dozer rehandle likely in SP-3', confidence: 0.6, impact: 'high' },
    { id: 'A3', text: 'Weather: Clear, no rain expected', confidence: 0.95, impact: 'low' },
  ],
};

// Grade model (iron ore)
export const waioGradeTargets = {
  product: 'Iron Ore Fines',
  productCode: 'IOF-PB',
  spec: {
    Fe: { min: 62.0, target: 62.4, max: null, unit: '%', critical: true },
    SiO2: { min: null, target: 4.2, max: 4.5, unit: '%', critical: true },
    Al2O3: { min: null, target: 2.0, max: 2.2, unit: '%', critical: false },
    P: { min: null, target: 0.07, max: 0.08, unit: '%', critical: false },
    LOI: { min: null, target: 4.0, max: 5.0, unit: '%', critical: false },
    Moisture: { min: null, target: 8.0, max: 10.0, unit: '%', critical: false },
  },
  penaltyModel: {
    underSpecFe: { per0_1pctUSD: 120000, description: 'Fe below 62.0%' },
    overSpecSiO2: { per0_1pctUSD: 90000, description: 'SiO2 above 4.5%' },
    overSpecAl2O3: { per0_1pctUSD: 45000, description: 'Al2O3 above 2.2%' },
    overSpecP: { per0_1pctUSD: 60000, description: 'P above 0.08%' },
  },
};

// Stockpiles
export const waioStockpiles = [
  {
    id: 'SP-1',
    name: 'SP-1 (Low Grade Buffer)',
    volume_t: 85000,
    grade: { Fe: 61.5, SiO2: 4.65, Al2O3: 2.18, P: 0.078 },
    gradeConfidence: 0.82,
    assayTimestamp: '2025-01-15T03:45:00+08:00',
    reclaimRateMax_tph: 5500,
    constraints: [],
    riskFlags: [{ type: 'grade', severity: 'warning', text: 'Fe below target' }],
    status: 'available',
  },
  {
    id: 'SP-2',
    name: 'SP-2 (High Fe)',
    volume_t: 120000,
    grade: { Fe: 62.9, SiO2: 4.10, Al2O3: 1.95, P: 0.068 },
    gradeConfidence: 0.86,
    assayTimestamp: '2025-01-15T04:30:00+08:00',
    reclaimRateMax_tph: 6000,
    constraints: [],
    riskFlags: [],
    status: 'available',
  },
  {
    id: 'SP-3',
    name: 'SP-3 (Blended)',
    volume_t: 210000,
    grade: { Fe: 62.1, SiO2: 4.35, Al2O3: 2.05, P: 0.072 },
    gradeConfidence: 0.72,
    assayTimestamp: '2025-01-15T02:10:00+08:00',
    reclaimRateMax_tph: 7000,
    constraints: ['moistureHigh'],
    riskFlags: [
      { type: 'data', severity: 'warning', text: 'Possible unrecorded rehandle' },
      { type: 'assay', severity: 'info', text: 'Assay data stale (>4h)' },
    ],
    status: 'available',
  },
  {
    id: 'SP-4',
    name: 'SP-4 (Premium)',
    volume_t: 65000,
    grade: { Fe: 63.2, SiO2: 3.95, Al2O3: 1.88, P: 0.065 },
    gradeConfidence: 0.91,
    assayTimestamp: '2025-01-15T05:15:00+08:00',
    reclaimRateMax_tph: 5000,
    constraints: ['reservedForContract_KJP'],
    riskFlags: [],
    status: 'reserved',
  },
];

// Pit blocks
export const waioPitBlocks = [
  {
    id: 'PIT1-ZA-012',
    pit: 'Pit 1',
    zone: 'Zone A',
    bench: 'Bench 12',
    oreType: 'BIF-Soft',
    gradeDist: {
      Fe: { p10: 62.2, p50: 62.6, p90: 63.0 },
      SiO2: { p10: 3.9, p50: 4.2, p90: 4.5 },
    },
    tonnageAvailable_t: 120000,
    digRate_tph: 6500,
    confidence: 0.85,
    constraints: [],
    status: 'active',
    assignedEquipment: ['SH-01', 'SH-02'],
  },
  {
    id: 'PIT2-ZA-008',
    pit: 'Pit 2',
    zone: 'Zone A',
    bench: 'Bench 8',
    oreType: 'BIF-Medium',
    gradeDist: {
      Fe: { p10: 62.4, p50: 62.8, p90: 63.2 },
      SiO2: { p10: 4.0, p50: 4.3, p90: 4.6 },
    },
    tonnageAvailable_t: 95000,
    digRate_tph: 5800,
    confidence: 0.82,
    constraints: ['blastWindow_14:00'],
    status: 'available',
    assignedEquipment: [],
  },
  {
    id: 'PIT3-ZB-041',
    pit: 'Pit 3',
    zone: 'Zone B',
    bench: 'Bench 41',
    oreType: 'BIF-Hard',
    gradeDist: {
      Fe: { p10: 61.4, p50: 61.9, p90: 62.3 },
      SiO2: { p10: 4.1, p50: 4.4, p90: 4.8 },
    },
    tonnageAvailable_t: 85000,
    digRate_tph: 5200,
    confidence: 0.68,
    constraints: ['accessNarrow', 'blastWindow_10:00'],
    riskFlags: [
      { type: 'grade', severity: 'warning', text: 'Lower Fe zone detected' },
      { type: 'data', severity: 'warning', text: 'Assay lag 6h' },
    ],
    status: 'active',
    assignedEquipment: ['SH-03'],
  },
  {
    id: 'PIT3-ZC-039',
    pit: 'Pit 3',
    zone: 'Zone C',
    bench: 'Bench 39',
    oreType: 'BIF-Medium',
    gradeDist: {
      Fe: { p10: 62.0, p50: 62.4, p90: 62.8 },
      SiO2: { p10: 4.2, p50: 4.4, p90: 4.7 },
    },
    tonnageAvailable_t: 72000,
    digRate_tph: 5500,
    confidence: 0.78,
    constraints: [],
    status: 'available',
    assignedEquipment: [],
  },
];

// Fleet
export const waioFleet = {
  shovels: [
    { id: 'SH-01', type: 'P&H 4100', capacity_tph: 3500, status: 'operating', location: 'PIT1-ZA', utilisation: 0.88 },
    { id: 'SH-02', type: 'P&H 4100', capacity_tph: 3500, status: 'operating', location: 'PIT1-ZA', utilisation: 0.85 },
    { id: 'SH-03', type: 'Liebherr R9800', capacity_tph: 3200, status: 'operating', location: 'PIT3-ZB', utilisation: 0.82 },
    { id: 'SH-04', type: 'Liebherr R9800', capacity_tph: 3200, status: 'maintenance', location: 'Workshop', utilisation: 0 },
  ],
  trucks: [
    { id: 'TRK-01', type: 'CAT 793F', capacity_t: 230, status: 'operating', cycleTime_min: 22, utilisation: 0.91 },
    { id: 'TRK-02', type: 'CAT 793F', capacity_t: 230, status: 'operating', cycleTime_min: 24, utilisation: 0.88 },
    { id: 'TRK-03', type: 'CAT 793F', capacity_t: 230, status: 'operating', cycleTime_min: 21, utilisation: 0.92 },
    { id: 'TRK-04', type: 'CAT 793F', capacity_t: 230, status: 'operating', cycleTime_min: 23, utilisation: 0.89 },
    { id: 'TRK-05', type: 'CAT 793F', capacity_t: 230, status: 'operating', cycleTime_min: 25, utilisation: 0.85 },
    { id: 'TRK-06', type: 'CAT 793F', capacity_t: 230, status: 'operating', cycleTime_min: 22, utilisation: 0.90 },
    { id: 'TRK-07', type: 'CAT 793F', capacity_t: 230, status: 'operating', cycleTime_min: 24, utilisation: 0.87 },
    { id: 'TRK-08', type: 'CAT 793F', capacity_t: 230, status: 'standby', cycleTime_min: null, utilisation: 0 },
    { id: 'TRK-09', type: 'Komatsu 930E', capacity_t: 290, status: 'operating', cycleTime_min: 26, utilisation: 0.86 },
    { id: 'TRK-10', type: 'Komatsu 930E', capacity_t: 290, status: 'operating', cycleTime_min: 27, utilisation: 0.84 },
    { id: 'TRK-11', type: 'Komatsu 930E', capacity_t: 290, status: 'operating', cycleTime_min: 25, utilisation: 0.88 },
    { id: 'TRK-12', type: 'Komatsu 930E', capacity_t: 290, status: 'breakdown', cycleTime_min: null, utilisation: 0, breakdownReason: 'Transmission fault' },
  ],
  dozers: [
    { id: 'DZ-01', type: 'CAT D11', status: 'operating', location: 'SP-3', task: 'rehandle' },
    { id: 'DZ-02', type: 'CAT D11', status: 'operating', location: 'PIT1-ZA', task: 'bench_prep' },
    { id: 'DZ-03', type: 'CAT D10', status: 'operating', location: 'SP-2', task: 'stockpile_mgmt' },
    { id: 'DZ-04', type: 'CAT D10', status: 'standby', location: 'Workshop', task: null },
  ],
  reclaimers: [
    { id: 'RC-01', type: 'Bucket Wheel', capacity_tph: 8000, status: 'operating', location: 'SP-3' },
    { id: 'RC-02', type: 'Bucket Wheel', capacity_tph: 7500, status: 'operating', location: 'SP-2' },
  ],
  stackers: [
    { id: 'ST-01', type: 'Travelling Stacker', capacity_tph: 10000, status: 'operating', location: 'Stockyard' },
    { id: 'ST-02', type: 'Travelling Stacker', capacity_tph: 10000, status: 'standby', location: 'Stockyard' },
  ],
};

// Train plan
export const waioTrains = [
  {
    trainId: 'TRAIN-05',
    status: 'loaded',
    etaLoadout: '2025-01-15T06:20:00+08:00',
    departureTime: '2025-01-15T08:45:00+08:00',
    capacity_t: 28000,
    actualLoad_t: 27850,
    targetSpec: 'Iron Ore Fines',
    actualGrade: { Fe: 62.3, SiO2: 4.28, Al2O3: 2.02, P: 0.071 },
    specCompliance: 'met',
  },
  {
    trainId: 'TRAIN-06',
    status: 'loading',
    etaLoadout: '2025-01-15T09:30:00+08:00',
    departureTime: null,
    capacity_t: 28000,
    currentLoad_t: 18500,
    targetSpec: 'Iron Ore Fines',
    predictedGrade: { Fe: 62.1, SiO2: 4.38, Al2O3: 2.08, P: 0.073 },
    predictedRisk: { underSpec: 0.22, reason: 'Blend within tolerance' },
  },
  {
    trainId: 'TRAIN-07',
    status: 'scheduled',
    etaLoadout: '2025-01-15T12:40:00+08:00',
    departureTime: null,
    capacity_t: 28000,
    targetSpec: 'Iron Ore Fines',
    predictedGrade: { Fe: 61.2, SiO2: 4.55, Al2O3: 2.15, P: 0.075 },
    predictedRisk: { underSpec: 0.62, reason: 'SP-3 blend + assay lag + Pit3 ZB low Fe' },
    riskFlags: [
      { type: 'grade', severity: 'critical', text: 'Fe forecast below spec (61.2% vs ≥62.0%)' },
    ],
  },
  {
    trainId: 'TRAIN-08',
    status: 'scheduled',
    etaLoadout: '2025-01-15T16:20:00+08:00',
    departureTime: null,
    capacity_t: 28000,
    targetSpec: 'Iron Ore Fines',
    predictedGrade: { Fe: 62.2, SiO2: 4.30, Al2O3: 2.05, P: 0.071 },
    predictedRisk: { underSpec: 0.28, reason: 'Blend stable if corrective action taken' },
  },
];

// Port and vessel
export const waioPort = {
  berths: [
    {
      id: 'B1',
      name: 'Berth 1',
      status: 'loading',
      vessel: 'MV-Pacific-Star',
      loadingRate_tph: 9500,
      progress: 0.72,
      eta_completion: '2025-01-15T14:00:00+08:00',
    },
    {
      id: 'B2',
      name: 'Berth 2',
      status: 'scheduled',
      vessel: 'MV-Koyo-Maru',
      scheduledStart: '2025-01-15T16:00:00+08:00',
      demurrageRisk: 0.35,
      demurrageCostPerHour: 15000,
    },
    {
      id: 'B3',
      name: 'Berth 3',
      status: 'available',
      vessel: null,
    },
  ],
  vessels: [
    {
      id: 'MV-Pacific-Star',
      customer: 'Pacific Steel',
      contract: 'CNT-PS-2025',
      capacity_t: 180000,
      currentLoad_t: 129600,
      targetGrade: { Fe: 62.0 },
      eta_departure: '2025-01-15T18:00:00+08:00',
    },
    {
      id: 'MV-Koyo-Maru',
      customer: 'Koyo Steel',
      contract: 'CNT-KS-2025',
      capacity_t: 200000,
      currentLoad_t: 0,
      targetGrade: { Fe: 62.4 },
      scheduledArrival: '2025-01-15T14:00:00+08:00',
    },
  ],
  railTransit: {
    inTransit: 2,
    avgTransitTime_h: 4.5,
    trainsAtPort: 1,
  },
};

// Contracts
export const waioContracts = [
  {
    id: 'CNT-KJP-A',
    customer: 'Japan Premium Steel',
    product: 'Iron Ore Fines Premium',
    volume_tpa: 12000000,
    ytdShipped_t: 5800000,
    priceFormula: 'LME Fe 62% Index + $8.50',
    qualitySpec: { Fe: { min: 62.4 }, SiO2: { max: 4.2 } },
    penaltyMultiplier: 1.5,
    priority: 1,
    status: 'active',
  },
  {
    id: 'CNT-PS-2025',
    customer: 'Pacific Steel',
    product: 'Iron Ore Fines Standard',
    volume_tpa: 8000000,
    ytdShipped_t: 4200000,
    priceFormula: 'LME Fe 62% Index + $2.00',
    qualitySpec: { Fe: { min: 62.0 }, SiO2: { max: 4.5 } },
    penaltyMultiplier: 1.0,
    priority: 2,
    status: 'active',
  },
  {
    id: 'CNT-KS-2025',
    customer: 'Koyo Steel',
    product: 'Iron Ore Fines Standard',
    volume_tpa: 6000000,
    ytdShipped_t: 2900000,
    priceFormula: 'LME Fe 62% Index',
    qualitySpec: { Fe: { min: 62.0 }, SiO2: { max: 4.5 } },
    penaltyMultiplier: 1.0,
    priority: 3,
    status: 'active',
  },
];

// Market data
export const waioMarket = {
  lmeFe62: {
    price: 108.50,
    unit: 'USD/dmt',
    trend: 'up',
    change24h: 1.25,
    change7d: 3.80,
  },
  freightRate: {
    auToChina: 12.50,
    auToJapan: 14.20,
    unit: 'USD/t',
  },
  fxRate: {
    audUsd: 0.65,
  },
  demurrageCost: {
    standard: 12000,
    peak: 18000,
    unit: 'USD/day',
  },
};

// Events (for monitoring/replanning)
export const waioEvents = [
  {
    id: 'EVT-001',
    timestamp: '2025-01-15T07:15:00+08:00',
    type: 'assay_update',
    severity: 'info',
    title: 'Assay update received',
    description: 'SP-2 assay refreshed: Fe 62.9%, confidence 0.91',
    impact: 'positive',
    resolved: true,
  },
  {
    id: 'EVT-002',
    timestamp: '2025-01-15T08:30:00+08:00',
    type: 'grade_drift',
    severity: 'warning',
    title: 'Pit 3 Zone B grade drift detected',
    description: 'Fe trending below model prediction; recommend sample verification',
    impact: 'negative',
    resolved: false,
  },
  {
    id: 'EVT-003',
    timestamp: '2025-01-15T09:45:00+08:00',
    type: 'data_quality',
    severity: 'warning',
    title: 'Unrecorded dozer movement suspected',
    description: 'SP-3 volume reconciliation shows -2,400t unexplained; possible rehandle',
    impact: 'negative',
    resolved: false,
  },
  {
    id: 'EVT-004',
    timestamp: '2025-01-15T10:30:00+08:00',
    type: 'equipment_breakdown',
    severity: 'critical',
    title: 'Truck TRK-12 breakdown',
    description: 'Transmission fault; estimated repair 2h',
    impact: 'negative',
    resolved: false,
    estimatedResolution: '2025-01-15T12:30:00+08:00',
  },
];

// Deviation trace data
export const waioDeviationTrace = {
  targetGrade: 62.4,
  predictedGrade: 61.2,
  deviationSources: [
    {
      id: 'DEV-01',
      location: 'Pit 3 Zone B',
      type: 'ore_source',
      impact: -0.5,
      confidence: 0.75,
      evidence: 'Lower Fe pocket in BIF-Hard zone',
      recommendation: 'Shift dig face to Zone C for 90min',
    },
    {
      id: 'DEV-02',
      location: 'SP-3 Reclaim',
      type: 'blend_drift',
      impact: -0.4,
      confidence: 0.68,
      evidence: 'Unrecorded dozer rehandle mixed grades',
      recommendation: 'Increase SP-2 reclaim rate by 15%',
    },
    {
      id: 'DEV-03',
      location: 'Assay System',
      type: 'data_lag',
      impact: -0.3,
      confidence: 0.82,
      evidence: '6h assay lag on Pit 3 Zone B samples',
      recommendation: 'Fast-track sample analysis',
    },
  ],
  traceNodes: [
    { id: 'PIT3-ZB', type: 'pit', label: 'Pit 3 Zone B', grade: 61.9, confidence: 0.68, risk: 'high' },
    { id: 'PIT1-ZA', type: 'pit', label: 'Pit 1 Zone A', grade: 62.6, confidence: 0.85, risk: 'low' },
    { id: 'SP-3', type: 'stockpile', label: 'SP-3 (Blended)', grade: 62.1, confidence: 0.72, risk: 'medium' },
    { id: 'SP-2', type: 'stockpile', label: 'SP-2 (High Fe)', grade: 62.9, confidence: 0.86, risk: 'low' },
    { id: 'TRAIN-07', type: 'train', label: 'Train 07', grade: 61.2, confidence: 0.65, risk: 'high' },
    { id: 'SHIP-PKS', type: 'ship', label: 'MV Pacific Star', grade: 62.1, confidence: 0.80, risk: 'low' },
  ],
  traceLinks: [
    { source: 'PIT3-ZB', target: 'SP-3', value: 45000, gradeImpact: -0.3 },
    { source: 'PIT1-ZA', target: 'SP-3', value: 35000, gradeImpact: 0.1 },
    { source: 'PIT1-ZA', target: 'SP-2', value: 40000, gradeImpact: 0 },
    { source: 'SP-3', target: 'TRAIN-07', value: 18000, gradeImpact: -0.4 },
    { source: 'SP-2', target: 'TRAIN-07', value: 10000, gradeImpact: 0.2 },
    { source: 'TRAIN-07', target: 'SHIP-PKS', value: 28000, gradeImpact: 0 },
  ],
};

// Plan options (generated after huddle)
export const waioPlanOptions = [
  {
    id: 'PLAN-A',
    name: 'Option A: Compliance First',
    description: 'Maximise grade compliance; accept reduced throughput',
    predictedOutcome: {
      trainGrades: {
        'TRAIN-07': { Fe: 62.25, risk: 0.18 },
        'TRAIN-08': { Fe: 62.35, risk: 0.12 },
      },
      totalTonnes: 142000,
      tonnesVsTarget: -13000,
      valueAtRisk: 320000,
      stabilityIndex: 0.65,
      complianceProbability: 0.92,
    },
    keyChanges: [
      'Increase SP-2 reclaim to 70% blend',
      'Reduce Pit 3 Zone B contribution by 40%',
      'Delay Train-08 by 30min for blend adjustment',
    ],
    tradeoffs: {
      pros: ['High spec compliance', 'Reduced penalty risk'],
      cons: ['Lower throughput', 'Stockpile SP-2 depletion'],
    },
  },
  {
    id: 'PLAN-B',
    name: 'Option B: Balanced',
    description: 'Balance value optimisation with throughput targets',
    predictedOutcome: {
      trainGrades: {
        'TRAIN-07': { Fe: 62.05, risk: 0.28 },
        'TRAIN-08': { Fe: 62.20, risk: 0.22 },
      },
      totalTonnes: 151000,
      tonnesVsTarget: -4000,
      valueAtRisk: 580000,
      stabilityIndex: 0.78,
      complianceProbability: 0.82,
    },
    keyChanges: [
      'Increase SP-2 reclaim to 55% blend',
      'Shift Pit 3 dig face to Zone C',
      'Accelerate SP-4 release if needed',
    ],
    tradeoffs: {
      pros: ['Good throughput', 'Moderate compliance', 'Flexible'],
      cons: ['Some grade risk remains'],
    },
  },
  {
    id: 'PLAN-C',
    name: 'Option C: Tonnes First',
    description: 'Maximise throughput; accept higher grade risk',
    predictedOutcome: {
      trainGrades: {
        'TRAIN-07': { Fe: 61.75, risk: 0.48 },
        'TRAIN-08': { Fe: 62.00, risk: 0.35 },
      },
      totalTonnes: 158000,
      tonnesVsTarget: 3000,
      valueAtRisk: 1450000,
      stabilityIndex: 0.88,
      complianceProbability: 0.58,
    },
    keyChanges: [
      'Maintain current blend ratios',
      'Maximise all reclaim rates',
      'Accept under-spec risk on Train-07',
    ],
    tradeoffs: {
      pros: ['Exceeds throughput target', 'Minimal operational disruption'],
      cons: ['High under-spec risk', 'Significant penalty exposure'],
    },
  },
];

// Selected shift plan (after option selection)
export const waioShiftPlan = {
  planId: 'PLAN-B',
  planName: 'Option B: Balanced',
  generatedAt: '2025-01-15T10:45:00+08:00',
  validUntil: '2025-01-15T18:00:00+08:00',
  status: 'draft',
  ganttTasks: [
    { id: 'T1', resource: 'SH-01', task: 'Dig PIT1-ZA-012', start: '06:00', end: '14:00', type: 'dig' },
    { id: 'T2', resource: 'SH-02', task: 'Dig PIT1-ZA-012', start: '06:00', end: '14:00', type: 'dig' },
    { id: 'T3', resource: 'SH-03', task: 'Dig PIT3-ZC-039', start: '10:00', end: '18:00', type: 'dig' },
    { id: 'T4', resource: 'RC-01', task: 'Reclaim SP-3', start: '06:00', end: '12:00', type: 'reclaim' },
    { id: 'T5', resource: 'RC-02', task: 'Reclaim SP-2', start: '06:00', end: '18:00', type: 'reclaim' },
    { id: 'T6', resource: 'TL-01', task: 'Load TRAIN-06', start: '06:00', end: '10:30', type: 'load' },
    { id: 'T7', resource: 'TL-01', task: 'Load TRAIN-07', start: '12:00', end: '15:30', type: 'load' },
    { id: 'T8', resource: 'TL-01', task: 'Load TRAIN-08', start: '16:00', end: '18:00', type: 'load' },
    { id: 'T9', resource: 'DZ-01', task: 'Stockpile mgmt SP-3', start: '06:00', end: '14:00', type: 'dozer' },
    { id: 'T10', resource: 'DZ-03', task: 'Stockpile mgmt SP-2', start: '06:00', end: '18:00', type: 'dozer' },
  ],
  blendRecipe: {
    'TRAIN-07': {
      sources: [
        { stockpile: 'SP-2', proportion: 0.55, rate_tph: 3500 },
        { stockpile: 'SP-3', proportion: 0.35, rate_tph: 2200 },
        { pit: 'PIT3-ZC', proportion: 0.10, rate_tph: 650 },
      ],
      predictedGrade: { Fe: 62.05, SiO2: 4.32 },
      confidence: 0.78,
    },
    'TRAIN-08': {
      sources: [
        { stockpile: 'SP-2', proportion: 0.50, rate_tph: 3200 },
        { stockpile: 'SP-3', proportion: 0.30, rate_tph: 1900 },
        { pit: 'PIT1-ZA', proportion: 0.20, rate_tph: 1300 },
      ],
      predictedGrade: { Fe: 62.20, SiO2: 4.28 },
      confidence: 0.82,
    },
  },
  equipmentAssignments: [
    { asset: 'SH-01', operator: 'Mike Chen', assignment: 'PIT1-ZA Dig Face 1', utilisation: 0.88, constraint: null },
    { asset: 'SH-02', operator: 'David Lee', assignment: 'PIT1-ZA Dig Face 2', utilisation: 0.85, constraint: null },
    { asset: 'SH-03', operator: 'Sarah Wong', assignment: 'PIT3-ZC Dig Face 1', utilisation: 0.80, constraint: 'Starts 10:00 (blast window)' },
    { asset: 'RC-01', operator: 'Auto', assignment: 'SP-3 Reclaim', utilisation: 0.75, constraint: 'Rate limited' },
    { asset: 'RC-02', operator: 'Auto', assignment: 'SP-2 Reclaim', utilisation: 0.90, constraint: null },
  ],
  actions: [
    { id: 'ACT-01', owner: 'Pit Supervisor', action: 'Verify sample from PIT3-ZC before dig start', due: '09:30', status: 'pending' },
    { id: 'ACT-02', owner: 'Stockyard', action: 'Confirm SP-3 rehandle logged in system', due: '08:00', status: 'pending' },
    { id: 'ACT-03', owner: 'Lab', action: 'Fast-track Pit 3 samples', due: '10:00', status: 'pending' },
    { id: 'ACT-04', owner: 'Dispatch', action: 'Update truck routes for PIT3-ZC access', due: '09:45', status: 'pending' },
  ],
  predictedKPIs: {
    planCompliance: 0.91,
    underSpecRisk: 0.25,
    tonnesLoaded: 151000,
    valueAtRisk: 580000,
  },
};

// Published plan (after publish action)
export const waioPublishedPlan = {
  ...waioShiftPlan,
  status: 'published',
  publishedAt: '2025-01-15T11:00:00+08:00',
  publishedBy: 'Carlos Aggio',
  dispatchConfirmed: true,
  briefGenerated: true,
  briefId: 'BRIEF-2025-01-15-DAY-001',
};

// ============================================================================
// CLOSED-LOOP MINE PLANNING DATA (New Enhancement)
// ============================================================================

// Plan Stack - Multi-horizon planning hierarchy
export const waioPlanStack = {
  '90D': {
    id: '90D_PLAN_v08',
    horizon: '90 Day',
    version: 'v8',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-03-31',
    status: 'active',
    owner: 'Strategic Planning',
    kpis: {
      targetTonnage: 14500000,
      actualTonnage: 5800000,
      progress: 0.40,
      complianceTarget: 0.92,
      actualCompliance: 0.88,
    },
    topConstraints: ['Vessel scheduling', 'Quarterly contract volumes', 'Major shutdown window'],
    deviationSignal: 'amber', // green/amber/red
    deviationReason: 'Throughput 4% below trajectory due to weather events',
  },
  '30D': {
    id: '30D_PLAN_v15',
    horizon: '30 Day',
    version: 'v15',
    effectiveFrom: '2025-01-15',
    effectiveTo: '2025-02-14',
    status: 'active',
    owner: 'Mine Planning',
    kpis: {
      targetTonnage: 4800000,
      actualTonnage: 2100000,
      progress: 0.44,
      complianceTarget: 0.90,
      actualCompliance: 0.85,
    },
    topConstraints: ['Blast schedule', 'Stockpile capacity', 'Rail maintenance window'],
    deviationSignal: 'amber',
    deviationReason: 'Grade drift in Pit 3 Zone B affecting blend quality',
  },
  '7D': {
    id: '7D_PLAN_v12',
    horizon: '7 Day',
    version: 'v12',
    effectiveFrom: '2025-01-15',
    effectiveTo: '2025-01-22',
    status: 'active',
    owner: 'Short-term Planning',
    kpis: {
      targetTonnage: 1085000,
      actualTonnage: 445000,
      progress: 0.41,
      complianceTarget: 0.88,
      actualCompliance: 0.82,
    },
    topConstraints: ['TRK-12 breakdown', 'Assay lag Pit 3 ZB', 'SP-3 confidence'],
    deviationSignal: 'red',
    deviationReason: 'Multiple equipment/quality issues driving compliance below target',
  },
  'DAY': {
    id: 'DAY_PLAN_2025-01-15',
    horizon: 'Day',
    version: 'v3',
    effectiveFrom: '2025-01-15T00:00',
    effectiveTo: '2025-01-16T00:00',
    status: 'active',
    owner: 'Shift Coordinator',
    kpis: {
      targetTonnage: 155000,
      actualTonnage: 98000,
      progress: 0.63,
      complianceTarget: 0.85,
      actualCompliance: 0.78,
    },
    topConstraints: ['Train-07 grade risk', 'Haul road A closure'],
    deviationSignal: 'red',
    deviationReason: 'Train-07 forecast under-spec; corrective blend in progress',
  },
  'SHIFT': {
    id: 'SHIFT-2025-01-15-DAY',
    horizon: 'Shift',
    version: 'v3',
    effectiveFrom: '2025-01-15T06:00',
    effectiveTo: '2025-01-15T18:00',
    status: 'executing',
    owner: 'Carlos Aggio',
    kpis: {
      targetTonnage: 78000,
      actualTonnage: 52000,
      progress: 0.67,
      complianceTarget: 0.84,
      actualCompliance: 0.78,
    },
    topConstraints: ['Active replan for Train-07'],
    deviationSignal: 'amber',
    deviationReason: 'Corrective actions in progress; monitoring closely',
  },
};

// Reconciliation data - Plan vs Actual analysis
export const waioReconciliation = {
  shiftId: 'SHIFT-2025-01-15-DAY',
  reconciliationTime: '2025-01-15T18:00:00+08:00',
  summary: {
    planCompliance: 0.78,
    complianceTarget: 0.85,
    gap: -0.07,
    tonnageActual: 145327,
    tonnageTarget: 155000,
    tonnageVariance: -9673,
    gradeActualFe: 62.05,
    gradeTargetFe: 62.4,
    gradeVariance: -0.35,
    valueProtected: 560000,
    valueAtRiskOriginal: 740000,
    valueAtRiskFinal: 180000,
  },
  planVsActual: [
    { metric: 'Tonnes Loaded', planned: 155000, actual: 145327, variance: -6.2, unit: 't', status: 'warning' },
    { metric: 'Train-07 Fe Grade', planned: 62.05, actual: 62.08, variance: 0.05, unit: '%', status: 'good' },
    { metric: 'Train-08 Fe Grade', planned: 62.20, actual: 62.15, variance: -0.08, unit: '%', status: 'good' },
    { metric: 'Compliance Rate', planned: 0.84, actual: 0.78, variance: -7.1, unit: '%', status: 'warning' },
    { metric: 'Under-Spec Trains', planned: 0, actual: 0, variance: 0, unit: 'count', status: 'good' },
    { metric: 'Unplanned Delays', planned: 0, actual: 2, variance: 2, unit: 'count', status: 'warning' },
  ],
  deviationHeatmap: {
    boundaryPoints: ['Pit', 'ROM', 'Stockpile', 'Loadout', 'Port'],
    causeCategories: ['Grade Drift', 'Data Lag', 'Unrecorded Mvmt', 'Equipment', 'Weather'],
    data: [
      // [Pit row]
      [3, 2, 0, 1, 0],
      // [ROM row]
      [1, 1, 1, 0, 0],
      // [Stockpile row]
      [2, 3, 4, 0, 0],
      // [Loadout row]
      [1, 2, 1, 2, 0],
      // [Port row]
      [0, 0, 0, 1, 1],
    ],
    legend: { 0: 'None', 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Critical' },
  },
  repeatDrivers: [
    {
      id: 'RD-01',
      pattern: 'Pit 3 Zone B grade uncertainty',
      frequency: '3 of last 5 shifts',
      impact: 'High',
      rootCause: 'Assay lag (6h) + geological variability',
      recommendation: 'Increase sampling frequency; add blast hole assays',
    },
    {
      id: 'RD-02',
      pattern: 'SP-3 confidence drops',
      frequency: '4 of last 7 days',
      impact: 'Medium',
      rootCause: 'Unrecorded dozer movements during night shift',
      recommendation: 'Mandatory GPS logging for all stockpile dozers',
    },
    {
      id: 'RD-03',
      pattern: 'Haul road A closures',
      frequency: '2 of last 3 days',
      impact: 'Medium',
      rootCause: 'Weather + maintenance scheduling conflicts',
      recommendation: 'Pre-position alternate routes; align maintenance windows',
    },
  ],
  insights: [
    'Under-spec risk avoided on Train-07 (+$560k penalty avoided)',
    'Plan compliance loss driven by: haul road A closure (35%), dozer rehandle gap (25%), assay latency (20%), fleet downtime (20%)',
    'Repeat pattern: Pit3 ZoneB uncertainty spikes in 3 of last 5 shifts',
    'Recommendation: Retrofit 7-day plan to reduce ZB dependence during high uncertainty windows',
  ],
};

// Retrofit Change Set - Proposed plan adjustments
export const waioRetrofitChangeSet = {
  id: 'CHANGESET_001',
  createdAt: '2025-01-15T18:15:00+08:00',
  createdBy: 'Plan Retrofit Agent',
  targetPlan: '7D_PLAN_v12',
  rationale: 'Recurring grade drift and compliance loss pattern detected. Retrofit to prevent repeat deviations.',
  status: 'proposed',
  changes: [
    {
      id: 'CHG-01',
      type: 'sequence_edit',
      title: 'Shift 18kt from Pit3-ZB to Pit2-ZA on Days 2-4',
      description: 'Reduce dependence on Zone B during high uncertainty windows until sampling regime improved.',
      affectedEntities: ['PIT3-ZB', 'PIT2-ZA', '7D_PLAN_v12'],
      expectedComplianceGain: 0.05,
      expectedRiskReduction: 0.15,
      confidence: 0.82,
      graphLink: 'PIT3-ZB',
    },
    {
      id: 'CHG-02',
      type: 'buffer_policy',
      title: 'Increase SP-2 minimum buffer to 95kt',
      description: 'Maintain higher high-Fe stockpile reserve to enable rapid blend correction.',
      affectedEntities: ['SP-2', 'CONSTRAINT_STOCKPILE_BUFFER'],
      expectedComplianceGain: 0.03,
      expectedRiskReduction: 0.10,
      confidence: 0.88,
      graphLink: 'SP-2',
    },
    {
      id: 'CHG-03',
      type: 'blast_timing',
      title: 'Adjust blast timing to open Face C 12h earlier',
      description: 'Accelerate access to higher-confidence Zone C material.',
      affectedEntities: ['BLAST_WINDOW_01', 'PIT3-ZC'],
      expectedComplianceGain: 0.02,
      expectedRiskReduction: 0.08,
      confidence: 0.75,
      graphLink: 'BLAST_WINDOW_01',
    },
  ],
  expectedImpacts: {
    compliance7D: { current: 0.82, projected: 0.90, change: '+8%' },
    underSpecRisk: { current: 0.38, projected: 0.25, change: '-34%' },
    contractRisk: { current: 'Medium', projected: 'Low', change: 'Improved' },
    tonnageImpact: { change: '-2%', note: 'Minor throughput trade-off for quality' },
  },
  blockModelUpdates: [
    { blockId: 'PIT3-ZB-041', field: 'gradeConfidence', oldValue: 0.68, newValue: 0.72, reason: 'Updated with shift reconciliation' },
    { blockId: 'PIT3-ZB-042', field: 'gradeBias', oldValue: 0, newValue: -0.3, reason: 'Detected systematic under-estimation' },
  ],
  deswikScheduleDelta: {
    sequenceEdits: 3,
    targetAdjustments: 2,
    constraintChanges: 1,
    estimatedReplanTime: '15 minutes',
  },
};

// Combined scenario context export
export const waioScenarioContext = {
  shift: waioShift,
  gradeTargets: waioGradeTargets,
  stockpiles: waioStockpiles,
  pitBlocks: waioPitBlocks,
  fleet: waioFleet,
  trains: waioTrains,
  port: waioPort,
  contracts: waioContracts,
  market: waioMarket,
  events: waioEvents,
  deviationTrace: waioDeviationTrace,
  planOptions: waioPlanOptions,
  shiftPlan: waioShiftPlan,
  publishedPlan: waioPublishedPlan,
  // New closed-loop data
  planStack: waioPlanStack,
  reconciliation: waioReconciliation,
  retrofitChangeSet: waioRetrofitChangeSet,
};

// Topic routing for chatbot
export const getWaioContextByTopic = (topic) => {
  const topicLower = topic.toLowerCase();

  if (topicLower.includes('train') || topicLower.includes('loadout')) {
    return { topic: 'Train Schedule', data: waioTrains, agent: 'LP', tool: 'query_train_schedule' };
  }
  if (topicLower.includes('grade') || topicLower.includes('fe') || topicLower.includes('spec') || topicLower.includes('quality')) {
    return { topic: 'Grade & Compliance', data: waioGradeTargets, agent: 'GC', tool: 'analyze_grade_risk' };
  }
  if (topicLower.includes('stockpile') || topicLower.includes('sp-') || topicLower.includes('reclaim')) {
    return { topic: 'Stockpiles', data: waioStockpiles, agent: 'ST', tool: 'query_stockpile' };
  }
  if (topicLower.includes('pit') || topicLower.includes('dig') || topicLower.includes('face') || topicLower.includes('ore')) {
    return { topic: 'Pit Blocks', data: waioPitBlocks, agent: 'MP', tool: 'query_mine_plan' };
  }
  if (topicLower.includes('fleet') || topicLower.includes('truck') || topicLower.includes('shovel') || topicLower.includes('equipment')) {
    return { topic: 'Fleet', data: waioFleet, agent: 'FR', tool: 'query_fleet_status' };
  }
  if (topicLower.includes('port') || topicLower.includes('berth') || topicLower.includes('vessel') || topicLower.includes('ship')) {
    return { topic: 'Port Operations', data: waioPort, agent: 'LP', tool: 'query_port_status' };
  }
  if (topicLower.includes('contract') || topicLower.includes('customer') || topicLower.includes('penalty')) {
    return { topic: 'Commercial', data: waioContracts, agent: 'CM', tool: 'query_contracts' };
  }
  if (topicLower.includes('plan') || topicLower.includes('shift') || topicLower.includes('schedule')) {
    return { topic: 'Shift Plan', data: waioShiftPlan, agent: 'SO', tool: 'get_shift_plan' };
  }
  if (topicLower.includes('deviation') || topicLower.includes('trace') || topicLower.includes('where')) {
    return { topic: 'Deviation Trace', data: waioDeviationTrace, agent: 'ST', tool: 'trace_deviation' };
  }
  if (topicLower.includes('market') || topicLower.includes('price') || topicLower.includes('lme')) {
    return { topic: 'Market', data: waioMarket, agent: 'CM', tool: 'query_market' };
  }
  if (topicLower.includes('kpi') || topicLower.includes('compliance') || topicLower.includes('risk')) {
    return { topic: 'KPIs', data: waioShift.kpis, agent: 'SO', tool: 'get_kpis' };
  }

  return { topic: 'General', data: waioShift, agent: 'SO', tool: null };
};

export default waioScenarioContext;
