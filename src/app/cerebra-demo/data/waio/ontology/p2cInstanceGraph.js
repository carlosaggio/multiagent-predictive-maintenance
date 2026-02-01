/**
 * P2C Instance Graph Data
 * 
 * Contains the actual instances (nodes) and relationships (edges)
 * for the WAIO Pit-to-Port demo scenario.
 */

import { ENTITY_COLORS, ENTITY_ICONS } from './p2cOntologySchema';

/**
 * Graph nodes - actual instances in the scenario
 */
export const p2cGraphNodes = [
  // ============================================================================
  // PLAN NODES
  // ============================================================================
  {
    id: '90D_PLAN_v08',
    type: 'PlanVersion',
    label: '90-Day Plan v8',
    attrs: { horizon: '90D', version: 'v8', status: 'active', effectiveFrom: '2025-01-01' },
    position: { x: 50, y: 50 },
  },
  {
    id: '30D_PLAN_v15',
    type: 'PlanVersion',
    label: '30-Day Plan v15',
    attrs: { horizon: '30D', version: 'v15', status: 'active', effectiveFrom: '2025-01-15' },
    position: { x: 150, y: 50 },
  },
  {
    id: '7D_PLAN_v12',
    type: 'PlanVersion',
    label: '7-Day Plan v12',
    attrs: { horizon: '7D', version: 'v12', status: 'active', effectiveFrom: '2025-01-15' },
    position: { x: 250, y: 50 },
  },
  {
    id: 'SHIFT-2025-01-15-DAY',
    type: 'PlanVersion',
    label: 'Day Shift Plan',
    attrs: { horizon: 'SHIFT', version: 'v3', status: 'executing', effectiveFrom: '2025-01-15T06:00' },
    position: { x: 350, y: 50 },
  },
  {
    id: 'OBJECTIVE_WEIGHTS_01',
    type: 'ObjectiveWeightSet',
    label: 'Balanced Weights',
    attrs: { valueWeight: 0.35, tonnesWeight: 0.30, complianceWeight: 0.25, riskWeight: 0.10 },
    position: { x: 350, y: 120 },
  },

  // ============================================================================
  // CONSTRAINT NODES
  // ============================================================================
  {
    id: 'CONSTRAINT_7D_DEVIATION',
    type: 'Constraint',
    label: '7D Deviation Limit',
    attrs: { type: 'deviation', maxDeviation: '10%', penalty: 'high' },
    position: { x: 200, y: 120 },
  },
  {
    id: 'CONSTRAINT_CONTRACT_SPEC',
    type: 'Constraint',
    label: 'Contract Spec Min Fe',
    attrs: { type: 'quality', minFe: 62.0, penalty: '$250k' },
    position: { x: 200, y: 180 },
  },

  // ============================================================================
  // PIT/ZONE/BLOCK NODES
  // ============================================================================
  {
    id: 'PIT1',
    type: 'Pit',
    label: 'Pit 1',
    attrs: { status: 'active', totalTonnage: '45M', avgGrade: 62.8 },
    position: { x: 50, y: 250 },
  },
  {
    id: 'PIT2',
    type: 'Pit',
    label: 'Pit 2',
    attrs: { status: 'active', totalTonnage: '38M', avgGrade: 61.9 },
    position: { x: 150, y: 250 },
  },
  {
    id: 'PIT3',
    type: 'Pit',
    label: 'Pit 3',
    attrs: { status: 'active', totalTonnage: '52M', avgGrade: 61.5 },
    position: { x: 250, y: 250 },
  },
  {
    id: 'PIT3-ZA',
    type: 'Zone',
    label: 'Pit 3 Zone A',
    attrs: { pitId: 'PIT3', status: 'active', tonnageRemaining: '12M' },
    position: { x: 200, y: 320 },
  },
  {
    id: 'PIT3-ZB',
    type: 'Zone',
    label: 'Pit 3 Zone B',
    attrs: { pitId: 'PIT3', status: 'active', tonnageRemaining: '8M', gradeUncertainty: 'high' },
    position: { x: 270, y: 320 },
  },
  {
    id: 'PIT3-ZC',
    type: 'Zone',
    label: 'Pit 3 Zone C',
    attrs: { pitId: 'PIT3', status: 'active', tonnageRemaining: '15M' },
    position: { x: 340, y: 320 },
  },
  {
    id: 'PIT3-ZB-041',
    type: 'Block',
    label: 'Block PIT3-ZB-041',
    attrs: { pit: 'PIT3', zone: 'ZB', tonnage: 85000, gradeFe: 61.2, confidence: 0.68 },
    position: { x: 270, y: 390 },
  },
  {
    id: 'PIT3-ZB-042',
    type: 'Block',
    label: 'Block PIT3-ZB-042',
    attrs: { pit: 'PIT3', zone: 'ZB', tonnage: 72000, gradeFe: 60.8, confidence: 0.65 },
    position: { x: 340, y: 390 },
  },
  {
    id: 'PIT3-ZC-015',
    type: 'Block',
    label: 'Block PIT3-ZC-015',
    attrs: { pit: 'PIT3', zone: 'ZC', tonnage: 95000, gradeFe: 62.5, confidence: 0.82 },
    position: { x: 410, y: 390 },
  },

  // ============================================================================
  // STOCKPILE NODES
  // ============================================================================
  {
    id: 'SP-1',
    type: 'Stockpile',
    label: 'Stockpile SP-1',
    attrs: { volume_t: 185000, gradeFe: 63.1, confidence: 0.88, purpose: 'High-grade' },
    position: { x: 500, y: 250 },
  },
  {
    id: 'SP-2',
    type: 'Stockpile',
    label: 'Stockpile SP-2',
    attrs: { volume_t: 240000, gradeFe: 62.4, confidence: 0.85, purpose: 'Blending' },
    position: { x: 570, y: 250 },
  },
  {
    id: 'SP-3',
    type: 'Stockpile',
    label: 'Stockpile SP-3',
    attrs: { volume_t: 210000, gradeFe: 61.8, confidence: 0.72, purpose: 'Low-grade' },
    position: { x: 640, y: 250 },
  },
  {
    id: 'SP-3-SLICE-01',
    type: 'StockpileSlice',
    label: 'SP-3 Morning Slice',
    attrs: { stockpileId: 'SP-3', timestamp: '2025-01-15T08:00', tonnage: 45000, grade: 61.5 },
    position: { x: 640, y: 320 },
  },

  // ============================================================================
  // MATERIAL PARCEL NODES
  // ============================================================================
  {
    id: 'PARCEL_8821',
    type: 'MaterialParcel',
    label: 'Parcel #8821',
    attrs: { sourceBlock: 'PIT3-ZB-041', tonnage: 12000, grade: 61.3, currentLocation: 'SP-3' },
    position: { x: 450, y: 390 },
  },
  {
    id: 'PARCEL_8822',
    type: 'MaterialParcel',
    label: 'Parcel #8822',
    attrs: { sourceBlock: 'PIT3-ZC-015', tonnage: 15000, grade: 62.4, currentLocation: 'SP-2' },
    position: { x: 520, y: 390 },
  },

  // ============================================================================
  // EQUIPMENT NODES
  // ============================================================================
  {
    id: 'SH-01',
    type: 'Shovel',
    label: 'Shovel SH-01',
    attrs: { capacity: '45t', status: 'operating', currentLocation: 'PIT3-ZB' },
    position: { x: 50, y: 450 },
  },
  {
    id: 'SH-02',
    type: 'Shovel',
    label: 'Shovel SH-02',
    attrs: { capacity: '45t', status: 'operating', currentLocation: 'PIT3-ZC' },
    position: { x: 120, y: 450 },
  },
  {
    id: 'TRK-08',
    type: 'Truck',
    label: 'Truck TRK-08',
    attrs: { payload: '220t', status: 'operating', assignedRoute: 'RT-PIT3-SP3' },
    position: { x: 190, y: 450 },
  },
  {
    id: 'TRK-12',
    type: 'Truck',
    label: 'Truck TRK-12',
    attrs: { payload: '220t', status: 'breakdown', assignedRoute: null },
    position: { x: 260, y: 450 },
  },
  {
    id: 'RCL-01',
    type: 'Reclaimer',
    label: 'Reclaimer RCL-01',
    attrs: { capacity: '8000tph', status: 'operating', assignedStockpile: 'SP-2' },
    position: { x: 570, y: 320 },
  },
  {
    id: 'CRUSHER-01',
    type: 'Crusher',
    label: 'Primary Crusher',
    attrs: { capacity: '5000tph', status: 'operating', throughput: '4200tph', linerWear: '35%' },
    position: { x: 400, y: 450 },
  },

  // ============================================================================
  // ROUTE NODES
  // ============================================================================
  {
    id: 'RT-PIT3-SP3',
    type: 'Route',
    label: 'Pit3 to SP-3',
    attrs: { source: 'PIT3', destination: 'SP-3', distance: '4.2km', decline: '-8%' },
    position: { x: 420, y: 320 },
  },
  {
    id: 'RT-PIT3-SP2',
    type: 'Route',
    label: 'Pit3 to SP-2',
    attrs: { source: 'PIT3', destination: 'SP-2', distance: '3.8km', decline: '-6%' },
    position: { x: 490, y: 320 },
  },

  // ============================================================================
  // QUALITY NODES
  // ============================================================================
  {
    id: 'ASSAY-5521',
    type: 'AssaySample',
    label: 'Assay #5521',
    attrs: { source: 'SP-3-SLICE-01', collectedAt: '2025-01-15T06:30', gradeFe: 61.5, lagHours: 4 },
    position: { x: 710, y: 320 },
  },
  {
    id: 'GRADE_EST_SP3',
    type: 'GradeEstimate',
    label: 'SP-3 Grade Est',
    attrs: { entity: 'SP-3', gradeFe: 61.8, confidence: 0.72, timestamp: '2025-01-15T10:00' },
    position: { x: 710, y: 250 },
  },
  {
    id: 'GRADE_EST_TRAIN07',
    type: 'GradeEstimate',
    label: 'Train-07 Grade Est',
    attrs: { entity: 'TRAIN-07', gradeFe: 61.2, confidence: 0.68, timestamp: '2025-01-15T10:30' },
    position: { x: 780, y: 250 },
  },
  {
    id: 'RISK_TRAIN07_UNDERSPEC',
    type: 'RiskSignal',
    label: 'Train-07 Under-Spec Risk',
    attrs: { type: 'under_spec', probability: 0.62, severity: 'high', valueAtRisk: 740000 },
    position: { x: 850, y: 250 },
  },
  {
    id: 'SPEC_CONTRACT_A',
    type: 'Spec',
    label: 'Contract A Spec',
    attrs: { contractId: 'CONTRACT-A', minFe: 62.0, maxSiO2: 4.5, maxP: 0.08 },
    position: { x: 850, y: 320 },
  },

  // ============================================================================
  // LOGISTICS NODES
  // ============================================================================
  {
    id: 'TRAIN-07',
    type: 'Train',
    label: 'Train 07',
    attrs: { capacity_t: 28000, status: 'loading', etaLoadout: '12:40', targetGrade: 62.0 },
    position: { x: 780, y: 180 },
  },
  {
    id: 'TRAIN-08',
    type: 'Train',
    label: 'Train 08',
    attrs: { capacity_t: 28000, status: 'queued', etaLoadout: '15:20', targetGrade: 62.0 },
    position: { x: 850, y: 180 },
  },
  {
    id: 'VESSEL-CAPE-FORTUNE',
    type: 'Vessel',
    label: 'Cape Fortune',
    attrs: { capacity_t: 180000, contractId: 'CONTRACT-A', eta: '2025-01-16T14:00', status: 'approaching' },
    position: { x: 920, y: 180 },
  },

  // ============================================================================
  // CHANGESET NODES
  // ============================================================================
  {
    id: 'CHANGESET_001',
    type: 'ChangeSet',
    label: 'Retrofit Change Set #001',
    attrs: { 
      targetPlan: '7D_PLAN_v12', 
      changes: 3, 
      rationale: 'Grade drift mitigation',
      expectedComplianceGain: '+8%',
      confidence: 0.85
    },
    position: { x: 250, y: 180 },
  },

  // ============================================================================
  // SYSTEM NODES
  // ============================================================================
  {
    id: 'DESWIK',
    type: 'System',
    label: 'Deswik',
    attrs: { name: 'Deswik', type: 'planning', description: 'Mine planning & scheduling' },
    position: { x: 50, y: 550 },
  },
  {
    id: 'VULCAN',
    type: 'System',
    label: 'Vulcan',
    attrs: { name: 'Vulcan', type: 'geological', description: 'Block model & geology' },
    position: { x: 150, y: 550 },
  },
  {
    id: 'MINESTAR',
    type: 'System',
    label: 'Minestar',
    attrs: { name: 'Minestar', type: 'dispatch', description: 'Fleet dispatch' },
    position: { x: 250, y: 550 },
  },
  {
    id: 'MODULAR',
    type: 'System',
    label: 'Modular',
    attrs: { name: 'Modular', type: 'dispatch', description: 'Fleet management' },
    position: { x: 350, y: 550 },
  },
  {
    id: 'SCADA',
    type: 'System',
    label: 'SCADA',
    attrs: { name: 'SCADA', type: 'plant', description: 'Plant control (OHP/COS/Crushers)' },
    position: { x: 450, y: 550 },
  },
  {
    id: 'ORETRACKING',
    type: 'System',
    label: 'Ore Tracking',
    attrs: { name: 'Ore Tracking', type: 'tracking', description: 'Material tracking' },
    position: { x: 550, y: 550 },
  },
  {
    id: 'LIMS',
    type: 'System',
    label: 'LIMS',
    attrs: { name: 'LIMS', type: 'laboratory', description: 'Lab information management' },
    position: { x: 650, y: 550 },
  },
  {
    id: 'RECONCILER',
    type: 'System',
    label: 'Reconciler',
    attrs: { name: 'Reconciler', type: 'reconciliation', description: 'Grade reconciliation' },
    position: { x: 750, y: 550 },
  },
  {
    id: 'MTM',
    type: 'System',
    label: 'MTM',
    attrs: { name: 'MTM', type: 'planning', description: 'Medium-term mine planning' },
    position: { x: 850, y: 550 },
  },

  // ============================================================================
  // BLEND RECIPE NODES
  // ============================================================================
  {
    id: 'BLEND_TRAIN07',
    type: 'BlendRecipe',
    label: 'Train-07 Blend',
    attrs: { 
      targetGrade: 62.0, 
      sources: ['SP-2', 'SP-3', 'PIT3-ZC'],
      ratios: [0.55, 0.35, 0.10],
      confidence: 0.78
    },
    position: { x: 640, y: 180 },
  },

  // ============================================================================
  // DIG INSTRUCTION NODES
  // ============================================================================
  {
    id: 'DIG_INST_01',
    type: 'DigInstruction',
    label: 'Dig PIT3-ZC',
    attrs: { targetBlock: 'PIT3-ZC-015', startTime: '10:00', endTime: '14:00', tonnage: 25000 },
    position: { x: 380, y: 120 },
  },

  // ============================================================================
  // EVENT NODES
  // ============================================================================
  {
    id: 'EVENT_TRK12_BREAKDOWN',
    type: 'Event',
    label: 'TRK-12 Breakdown',
    attrs: { type: 'breakdown', severity: 'high', timestamp: '2025-01-15T08:45', equipment: 'TRK-12', resolved: false },
    position: { x: 260, y: 520 },
  },

  // ============================================================================
  // BLAST WINDOW NODES
  // ============================================================================
  {
    id: 'BLAST_WINDOW_01',
    type: 'BlastWindow',
    label: 'Blast Window (09:00-10:00)',
    attrs: { startTime: '09:00', endTime: '10:00', clearanceRequired: true },
    position: { x: 340, y: 250 },
  },
];

/**
 * Graph edges - relationships between instances
 */
export const p2cGraphEdges = [
  // ============================================================================
  // PLAN HIERARCHY EDGES
  // ============================================================================
  { id: 'e001', type: 'cascades_to', source: '90D_PLAN_v08', target: '30D_PLAN_v15', label: 'cascades to' },
  { id: 'e002', type: 'cascades_to', source: '30D_PLAN_v15', target: '7D_PLAN_v12', label: 'cascades to' },
  { id: 'e003', type: 'cascades_to', source: '7D_PLAN_v12', target: 'SHIFT-2025-01-15-DAY', label: 'cascades to' },
  { id: 'e004', type: 'constrained_by', source: 'SHIFT-2025-01-15-DAY', target: 'CONSTRAINT_7D_DEVIATION', label: 'constrained by' },
  { id: 'e005', type: 'constrained_by', source: 'SHIFT-2025-01-15-DAY', target: 'CONSTRAINT_CONTRACT_SPEC', label: 'constrained by' },
  { id: 'e006', type: 'uses_weights', source: 'SHIFT-2025-01-15-DAY', target: 'OBJECTIVE_WEIGHTS_01', label: 'uses weights' },
  { id: 'e007', type: 'contains', source: 'SHIFT-2025-01-15-DAY', target: 'DIG_INST_01', label: 'contains' },
  { id: 'e008', type: 'contains', source: 'SHIFT-2025-01-15-DAY', target: 'BLEND_TRAIN07', label: 'contains' },

  // ============================================================================
  // MINING HIERARCHY EDGES
  // ============================================================================
  { id: 'e010', type: 'contains_zone', source: 'PIT3', target: 'PIT3-ZA', label: 'contains' },
  { id: 'e011', type: 'contains_zone', source: 'PIT3', target: 'PIT3-ZB', label: 'contains' },
  { id: 'e012', type: 'contains_zone', source: 'PIT3', target: 'PIT3-ZC', label: 'contains' },
  { id: 'e013', type: 'contains_block', source: 'PIT3-ZB', target: 'PIT3-ZB-041', label: 'contains' },
  { id: 'e014', type: 'contains_block', source: 'PIT3-ZB', target: 'PIT3-ZB-042', label: 'contains' },
  { id: 'e015', type: 'contains_block', source: 'PIT3-ZC', target: 'PIT3-ZC-015', label: 'contains' },
  { id: 'e016', type: 'clears', source: 'BLAST_WINDOW_01', target: 'PIT3-ZC', label: 'clears' },

  // ============================================================================
  // DIG INSTRUCTION EDGES
  // ============================================================================
  { id: 'e020', type: 'targets', source: 'DIG_INST_01', target: 'PIT3-ZC-015', label: 'targets' },

  // ============================================================================
  // MATERIAL FLOW EDGES
  // ============================================================================
  { id: 'e030', type: 'originates_from', source: 'PARCEL_8821', target: 'PIT3-ZB-041', label: 'originates from' },
  { id: 'e031', type: 'dumped_to', source: 'PARCEL_8821', target: 'SP-3-SLICE-01', label: 'dumped to' },
  { id: 'e032', type: 'originates_from', source: 'PARCEL_8822', target: 'PIT3-ZC-015', label: 'originates from' },
  { id: 'e033', type: 'dumped_to', source: 'PARCEL_8822', target: 'SP-2', label: 'dumped to' },
  { id: 'e034', type: 'has_slice', source: 'SP-3', target: 'SP-3-SLICE-01', label: 'has slice' },
  { id: 'e035', type: 'contains_material', source: 'SP-3', target: 'PARCEL_8821', label: 'contains' },

  // ============================================================================
  // QUALITY EDGES
  // ============================================================================
  { id: 'e040', type: 'sampled_from', source: 'ASSAY-5521', target: 'SP-3-SLICE-01', label: 'sampled from' },
  { id: 'e041', type: 'updates_grade', source: 'ASSAY-5521', target: 'GRADE_EST_SP3', label: 'updates' },
  { id: 'e042', type: 'triggered_by', source: 'RISK_TRAIN07_UNDERSPEC', target: 'GRADE_EST_TRAIN07', label: 'triggered by' },
  { id: 'e043', type: 'affects', source: 'RISK_TRAIN07_UNDERSPEC', target: 'TRAIN-07', label: 'affects' },

  // ============================================================================
  // BLEND RECIPE EDGES
  // ============================================================================
  { id: 'e050', type: 'reclaims_from', source: 'BLEND_TRAIN07', target: 'SP-2', label: 'reclaims from' },
  { id: 'e051', type: 'reclaims_from', source: 'BLEND_TRAIN07', target: 'SP-3', label: 'reclaims from' },
  { id: 'e052', type: 'produces_grade', source: 'BLEND_TRAIN07', target: 'GRADE_EST_TRAIN07', label: 'produces' },
  { id: 'e053', type: 'loads', source: 'BLEND_TRAIN07', target: 'TRAIN-07', label: 'loads' },

  // ============================================================================
  // LOGISTICS EDGES
  // ============================================================================
  { id: 'e060', type: 'delivered_to', source: 'TRAIN-07', target: 'VESSEL-CAPE-FORTUNE', label: 'delivered to' },
  { id: 'e061', type: 'delivered_to', source: 'TRAIN-08', target: 'VESSEL-CAPE-FORTUNE', label: 'delivered to' },

  // ============================================================================
  // EQUIPMENT EDGES
  // ============================================================================
  { id: 'e070', type: 'operates_in', source: 'SH-01', target: 'PIT3-ZB', label: 'operates in' },
  { id: 'e071', type: 'operates_in', source: 'SH-02', target: 'PIT3-ZC', label: 'operates in' },
  { id: 'e072', type: 'assigned_to', source: 'TRK-08', target: 'RT-PIT3-SP3', label: 'assigned to' },
  { id: 'e073', type: 'services', source: 'RCL-01', target: 'SP-2', label: 'services' },
  { id: 'e074', type: 'impacted_by', source: 'TRK-12', target: 'EVENT_TRK12_BREAKDOWN', label: 'impacted by' },

  // ============================================================================
  // SYSTEM LINEAGE EDGES
  // ============================================================================
  { id: 'e080', type: 'published_to', source: '7D_PLAN_v12', target: 'DESWIK', label: 'published to' },
  { id: 'e081', type: 'published_to', source: 'SHIFT-2025-01-15-DAY', target: 'MINESTAR', label: 'published to' },
  { id: 'e082', type: 'published_to', source: 'SHIFT-2025-01-15-DAY', target: 'SCADA', label: 'published to' },
  { id: 'e083', type: 'stored_in', source: 'GRADE_EST_SP3', target: 'RECONCILER', label: 'stored in' },
  { id: 'e084', type: 'recorded_in', source: 'ASSAY-5521', target: 'LIMS', label: 'recorded in' },
  { id: 'e085', type: 'sent_to', source: 'TRK-08', target: 'MINESTAR', label: 'sent to' },
  { id: 'e086', type: 'extracts_from', source: 'RECONCILER', target: 'LIMS', label: 'extracts from' },
  { id: 'e087', type: 'writes_to', source: 'RECONCILER', target: 'VULCAN', label: 'writes to' },
  { id: 'e088', type: 'extracts_from', source: 'DESWIK', target: 'VULCAN', label: 'extracts from' },

  // ============================================================================
  // CHANGESET EDGES
  // ============================================================================
  { id: 'e090', type: 'updates', source: 'CHANGESET_001', target: '7D_PLAN_v12', label: 'updates' },
  { id: 'e091', type: 'produced_by', source: 'CHANGESET_001', target: 'DESWIK', label: 'produced by' },
];

/**
 * Pre-defined highlight paths for UX
 */
export const highlightPaths = {
  pitToShip: {
    label: 'Pit → Stockpile → Train → Ship',
    description: 'Material flow from extraction to export',
    nodeIds: ['PIT3-ZB-041', 'PARCEL_8821', 'SP-3', 'BLEND_TRAIN07', 'TRAIN-07', 'VESSEL-CAPE-FORTUNE'],
    edgeIds: ['e030', 'e031', 'e035', 'e051', 'e053', 'e060'],
    color: '#10B981',
  },
  planToDispatch: {
    label: 'Plan 7D → Shift → Dispatch',
    description: 'Planning cascade to execution',
    nodeIds: ['7D_PLAN_v12', 'SHIFT-2025-01-15-DAY', 'DIG_INST_01', 'MINESTAR'],
    edgeIds: ['e003', 'e007', 'e081'],
    color: '#A100FF',
  },
  assayToRisk: {
    label: 'Assay → Grade → Risk',
    description: 'Quality data flow to risk signals',
    nodeIds: ['ASSAY-5521', 'GRADE_EST_SP3', 'GRADE_EST_TRAIN07', 'RISK_TRAIN07_UNDERSPEC', 'TRAIN-07'],
    edgeIds: ['e041', 'e042', 'e043'],
    color: '#F59E0B',
  },
  retrofitFlow: {
    label: 'Changeset → Plan → Systems',
    description: 'Retrofit change propagation',
    nodeIds: ['CHANGESET_001', '7D_PLAN_v12', 'DESWIK', 'VULCAN', 'MINESTAR'],
    edgeIds: ['e090', 'e080', 'e088', 'e081'],
    color: '#EF4444',
  },
};

/**
 * Get a node by ID
 */
export function getNodeById(id) {
  return p2cGraphNodes.find(n => n.id === id);
}

/**
 * Get all edges for a node
 */
export function getEdgesForNode(nodeId) {
  return {
    outgoing: p2cGraphEdges.filter(e => e.source === nodeId),
    incoming: p2cGraphEdges.filter(e => e.target === nodeId),
  };
}

/**
 * Get nodes by type
 */
export function getNodesByType(type) {
  return p2cGraphNodes.filter(n => n.type === type);
}

/**
 * Get connected nodes (1 hop)
 */
export function getConnectedNodes(nodeId) {
  const edges = getEdgesForNode(nodeId);
  const connectedIds = new Set();
  
  edges.outgoing.forEach(e => connectedIds.add(e.target));
  edges.incoming.forEach(e => connectedIds.add(e.source));
  
  return p2cGraphNodes.filter(n => connectedIds.has(n.id));
}

/**
 * Search nodes by label or ID
 */
export function searchNodes(query) {
  const lowerQuery = query.toLowerCase();
  return p2cGraphNodes.filter(n => 
    n.id.toLowerCase().includes(lowerQuery) ||
    n.label.toLowerCase().includes(lowerQuery) ||
    n.type.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all upstream nodes (nodes that feed into this node)
 * Traverses incoming edges recursively
 */
export function getUpstreamNodes(nodeId, visited = new Set()) {
  if (visited.has(nodeId)) return new Set();
  visited.add(nodeId);
  
  const upstream = new Set();
  const edges = p2cGraphEdges.filter(e => e.target === nodeId);
  
  edges.forEach(edge => {
    upstream.add(edge.source);
    const deeper = getUpstreamNodes(edge.source, visited);
    deeper.forEach(id => upstream.add(id));
  });
  
  return upstream;
}

/**
 * Get all downstream nodes (nodes affected by this node)
 * Traverses outgoing edges recursively
 */
export function getDownstreamNodes(nodeId, visited = new Set()) {
  if (visited.has(nodeId)) return new Set();
  visited.add(nodeId);
  
  const downstream = new Set();
  const edges = p2cGraphEdges.filter(e => e.source === nodeId);
  
  edges.forEach(edge => {
    downstream.add(edge.target);
    const deeper = getDownstreamNodes(edge.target, visited);
    deeper.forEach(id => downstream.add(id));
  });
  
  return downstream;
}

/**
 * Find all paths between two nodes using BFS
 * Returns array of paths, each path is array of node IDs
 */
export function findPaths(startId, endId, maxDepth = 10) {
  const paths = [];
  const queue = [[startId]];
  
  while (queue.length > 0 && paths.length < 5) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (path.length > maxDepth) continue;
    
    if (current === endId) {
      paths.push(path);
      continue;
    }
    
    // Get outgoing edges
    const outEdges = p2cGraphEdges.filter(e => e.source === current);
    outEdges.forEach(edge => {
      if (!path.includes(edge.target)) {
        queue.push([...path, edge.target]);
      }
    });
    
    // Also check incoming edges for bidirectional traversal
    const inEdges = p2cGraphEdges.filter(e => e.target === current);
    inEdges.forEach(edge => {
      if (!path.includes(edge.source)) {
        queue.push([...path, edge.source]);
      }
    });
  }
  
  return paths;
}

/**
 * Get all unique node types in the graph
 */
export function getNodeTypes() {
  const types = new Set();
  p2cGraphNodes.forEach(n => types.add(n.type));
  return Array.from(types).sort();
}

/**
 * Get all unique relationship types in the graph
 */
export function getRelationshipTypes() {
  const types = new Set();
  p2cGraphEdges.forEach(e => types.add(e.type));
  return Array.from(types).sort();
}

export default {
  nodes: p2cGraphNodes,
  edges: p2cGraphEdges,
  highlightPaths,
  getNodeById,
  getEdgesForNode,
  getNodesByType,
  getConnectedNodes,
  searchNodes,
  getUpstreamNodes,
  getDownstreamNodes,
  findPaths,
  getNodeTypes,
  getRelationshipTypes,
};
