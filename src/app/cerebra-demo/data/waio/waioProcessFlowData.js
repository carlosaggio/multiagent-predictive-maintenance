/**
 * WAIO Process Flow Data
 * 
 * Data for the WAIO digital twin / process flow visualization.
 */

// Process flow nodes
export const waioProcessFlowNodes = [
  // Pit Operations
  {
    id: 'pit-1',
    type: 'pit',
    label: 'Pit 1',
    sublabel: 'Zone A Active',
    section: 'MINING',
    status: 'operating',
    metrics: {
      digRate: 6500,
      grade: 62.6,
      confidence: 0.85,
    },
    position: { x: 50, y: 100 },
  },
  {
    id: 'pit-2',
    type: 'pit',
    label: 'Pit 2',
    sublabel: 'Zone A Available',
    section: 'MINING',
    status: 'standby',
    metrics: {
      digRate: 0,
      grade: 62.8,
      confidence: 0.82,
    },
    position: { x: 50, y: 200 },
  },
  {
    id: 'pit-3',
    type: 'pit',
    label: 'Pit 3',
    sublabel: 'Zone B/C Active',
    section: 'MINING',
    status: 'warning',
    riskLevel: 'high',
    metrics: {
      digRate: 5200,
      grade: 61.9,
      confidence: 0.68,
    },
    position: { x: 50, y: 300 },
    alert: true,
  },
  
  // Crushing
  {
    id: 'crusher-1',
    type: 'crusher',
    label: 'Primary Crusher',
    sublabel: 'OHP-01',
    section: 'CRUSHING',
    status: 'operating',
    metrics: {
      throughput: 12500,
      utilisation: 0.88,
    },
    position: { x: 200, y: 200 },
  },
  
  // Stockyard
  {
    id: 'sp-1',
    type: 'stockpile',
    label: 'SP-1',
    sublabel: 'Low Grade Buffer',
    section: 'STOCKYARD',
    status: 'available',
    metrics: {
      volume: 85000,
      grade: 61.5,
      confidence: 0.82,
    },
    position: { x: 350, y: 100 },
  },
  {
    id: 'sp-2',
    type: 'stockpile',
    label: 'SP-2',
    sublabel: 'High Fe',
    section: 'STOCKYARD',
    status: 'operating',
    metrics: {
      volume: 120000,
      grade: 62.9,
      confidence: 0.86,
    },
    position: { x: 350, y: 200 },
  },
  {
    id: 'sp-3',
    type: 'stockpile',
    label: 'SP-3',
    sublabel: 'Blended',
    section: 'STOCKYARD',
    status: 'warning',
    riskLevel: 'medium',
    metrics: {
      volume: 210000,
      grade: 62.1,
      confidence: 0.72,
    },
    position: { x: 350, y: 300 },
    alert: true,
  },
  {
    id: 'sp-4',
    type: 'stockpile',
    label: 'SP-4',
    sublabel: 'Premium (Reserved)',
    section: 'STOCKYARD',
    status: 'reserved',
    metrics: {
      volume: 65000,
      grade: 63.2,
      confidence: 0.91,
    },
    position: { x: 350, y: 400 },
  },
  
  // Rail Loading
  {
    id: 'train-loadout',
    type: 'loadout',
    label: 'Train Loadout',
    sublabel: 'TLO-01',
    section: 'RAIL_LOADING',
    status: 'operating',
    metrics: {
      loadRate: 7200,
      currentTrain: 'TRAIN-06',
    },
    position: { x: 500, y: 200 },
  },
  
  // Rail Transit
  {
    id: 'rail-network',
    type: 'rail',
    label: 'Rail Network',
    sublabel: '2 trains in transit',
    section: 'RAIL_TRANSIT',
    status: 'operating',
    metrics: {
      inTransit: 2,
      avgTransitTime: 4.5,
    },
    position: { x: 650, y: 200 },
  },
  
  // Port
  {
    id: 'berth-1',
    type: 'berth',
    label: 'Berth 1',
    sublabel: 'MV Pacific Star',
    section: 'PORT',
    status: 'loading',
    metrics: {
      progress: 0.72,
      loadRate: 9500,
    },
    position: { x: 800, y: 150 },
  },
  {
    id: 'berth-2',
    type: 'berth',
    label: 'Berth 2',
    sublabel: 'MV Koyo Maru (14:00)',
    section: 'PORT',
    status: 'scheduled',
    riskLevel: 'low',
    metrics: {
      demurrageRisk: 0.35,
    },
    position: { x: 800, y: 250 },
  },
  
  // Customer / Ship
  {
    id: 'customer',
    type: 'customer',
    label: 'Customer',
    sublabel: 'Spec: Fe ≥62.0%',
    section: 'CUSTOMER',
    status: 'ok',
    metrics: {
      compliance: 0.98,
    },
    position: { x: 950, y: 200 },
  },
];

// Process flow links (arrows between nodes)
export const waioProcessFlowLinks = [
  // Pits to Crusher
  { source: 'pit-1', target: 'crusher-1', value: 6500, type: 'haul' },
  { source: 'pit-2', target: 'crusher-1', value: 0, type: 'haul', inactive: true },
  { source: 'pit-3', target: 'crusher-1', value: 5200, type: 'haul' },
  
  // Crusher to Stockpiles
  { source: 'crusher-1', target: 'sp-1', value: 2000, type: 'conveyor' },
  { source: 'crusher-1', target: 'sp-2', value: 4500, type: 'conveyor' },
  { source: 'crusher-1', target: 'sp-3', value: 5000, type: 'conveyor' },
  
  // Stockpiles to Train Loadout
  { source: 'sp-1', target: 'train-loadout', value: 0, type: 'reclaim', inactive: true },
  { source: 'sp-2', target: 'train-loadout', value: 3500, type: 'reclaim' },
  { source: 'sp-3', target: 'train-loadout', value: 3700, type: 'reclaim' },
  
  // Train Loadout to Rail
  { source: 'train-loadout', target: 'rail-network', value: 7200, type: 'rail' },
  
  // Rail to Port
  { source: 'rail-network', target: 'berth-1', value: 4500, type: 'rail' },
  { source: 'rail-network', target: 'berth-2', value: 0, type: 'rail', inactive: true },
  
  // Port to Customer
  { source: 'berth-1', target: 'customer', value: 9500, type: 'ship' },
];

// Section definitions for grouping
export const waioProcessFlowSections = [
  { id: 'MINING', label: 'Mining', order: 1, color: '#6366F1' },
  { id: 'CRUSHING', label: 'Crushing', order: 2, color: '#8B5CF6' },
  { id: 'STOCKYARD', label: 'Stockyard', order: 3, color: '#A855F7' },
  { id: 'RAIL_LOADING', label: 'Rail Loading', order: 4, color: '#D946EF' },
  { id: 'RAIL_TRANSIT', label: 'Rail Transit', order: 5, color: '#EC4899' },
  { id: 'PORT', label: 'Port', order: 6, color: '#F43F5E' },
  { id: 'CUSTOMER', label: 'Customer', order: 7, color: '#10B981' },
];

// Overlay data for different views
export const waioOverlays = {
  gradeRisk: {
    id: 'grade_risk',
    label: 'Grade Risk',
    description: 'Shows grade deviation risk by node',
    nodeValues: {
      'pit-1': { value: 0.15, status: 'ok' },
      'pit-2': { value: 0.18, status: 'ok' },
      'pit-3': { value: 0.65, status: 'critical' },
      'sp-1': { value: 0.45, status: 'warning' },
      'sp-2': { value: 0.12, status: 'ok' },
      'sp-3': { value: 0.52, status: 'warning' },
      'sp-4': { value: 0.08, status: 'ok' },
      'train-loadout': { value: 0.38, status: 'warning' },
      'berth-1': { value: 0.15, status: 'ok' },
      'berth-2': { value: 0.35, status: 'warning' },
    },
  },
  planCompliance: {
    id: 'plan_compliance',
    label: 'Plan Compliance',
    description: 'Shows deviation from planned operations',
    nodeValues: {
      'pit-1': { value: 0.92, status: 'ok' },
      'pit-2': { value: 1.0, status: 'ok' },
      'pit-3': { value: 0.78, status: 'warning' },
      'sp-1': { value: 0.95, status: 'ok' },
      'sp-2': { value: 0.98, status: 'ok' },
      'sp-3': { value: 0.72, status: 'warning' },
      'sp-4': { value: 1.0, status: 'ok' },
      'train-loadout': { value: 0.85, status: 'ok' },
      'rail-network': { value: 0.88, status: 'ok' },
      'berth-1': { value: 0.94, status: 'ok' },
    },
  },
  constraints: {
    id: 'constraints',
    label: 'Constraint Heatmap',
    description: 'Shows operational constraints',
    nodeValues: {
      'pit-1': { value: 0.1, constraints: [] },
      'pit-2': { value: 0.3, constraints: ['blast_window'] },
      'pit-3': { value: 0.6, constraints: ['access_narrow', 'blast_window', 'assay_lag'] },
      'sp-1': { value: 0.2, constraints: [] },
      'sp-2': { value: 0.15, constraints: [] },
      'sp-3': { value: 0.5, constraints: ['moisture_high', 'data_quality'] },
      'sp-4': { value: 0.4, constraints: ['reserved'] },
      'train-loadout': { value: 0.25, constraints: [] },
      'berth-2': { value: 0.35, constraints: ['demurrage_risk'] },
    },
  },
};

// Equipment positions for interactive view
export const waioEquipmentPositions = {
  shovels: [
    { id: 'SH-01', position: { x: 80, y: 120 }, status: 'operating' },
    { id: 'SH-02', position: { x: 80, y: 140 }, status: 'operating' },
    { id: 'SH-03', position: { x: 80, y: 320 }, status: 'operating' },
  ],
  trucks: [
    { id: 'TRK-01', position: { x: 120, y: 150 }, status: 'operating' },
    { id: 'TRK-02', position: { x: 140, y: 180 }, status: 'operating' },
    { id: 'TRK-12', position: { x: 100, y: 350 }, status: 'breakdown' },
  ],
  trains: [
    { id: 'TRAIN-06', position: { x: 520, y: 200 }, status: 'loading' },
    { id: 'TRAIN-05', position: { x: 680, y: 200 }, status: 'transit' },
  ],
};

export default {
  nodes: waioProcessFlowNodes,
  links: waioProcessFlowLinks,
  sections: waioProcessFlowSections,
  overlays: waioOverlays,
  equipment: waioEquipmentPositions,
};
