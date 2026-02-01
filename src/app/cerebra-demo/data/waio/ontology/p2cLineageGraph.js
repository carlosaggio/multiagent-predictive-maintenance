/**
 * P2C Lineage Graph Data
 * 
 * Represents system-to-system data flows and data product lineage.
 * This view helps explain where data comes from and how it transforms.
 */

/**
 * System nodes for lineage view
 */
export const lineageSystems = [
  {
    id: 'DESWIK',
    name: 'Deswik',
    type: 'planning',
    category: 'Planning Tools',
    description: 'Mine planning and scheduling',
    dataProducts: ['Mine Plan', 'Schedule', 'Sequence'],
    position: { x: 100, y: 50 },
  },
  {
    id: 'VULCAN',
    name: 'Vulcan',
    type: 'geological',
    category: 'Geological Tools',
    description: 'Block model and geology management',
    dataProducts: ['Block Model', 'Grade Distribution', 'Tonnage Factors'],
    position: { x: 250, y: 50 },
  },
  {
    id: 'MTM',
    name: 'MTM',
    type: 'planning',
    category: 'Planning Tools',
    description: 'Medium-term mine planning',
    dataProducts: ['Production Targets', 'Stockpile Strategy'],
    position: { x: 400, y: 50 },
  },
  {
    id: 'MINESTAR',
    name: 'Minestar',
    type: 'dispatch',
    category: 'Dispatch Systems',
    description: 'Fleet dispatch and tracking',
    dataProducts: ['Dispatch Instructions', 'Fleet Status', 'Cycle Times'],
    position: { x: 100, y: 200 },
  },
  {
    id: 'MODULAR',
    name: 'Modular',
    type: 'dispatch',
    category: 'Dispatch Systems',
    description: 'Fleet management system',
    dataProducts: ['Equipment Assignments', 'Route Optimisation'],
    position: { x: 250, y: 200 },
  },
  {
    id: 'SCADA',
    name: 'SCADA/PLC',
    type: 'plant',
    category: 'Plant Control',
    description: 'OHP, COS, Crushers, Conveyors',
    dataProducts: ['Throughput Rates', 'Equipment Status', 'Setpoints'],
    position: { x: 400, y: 200 },
  },
  {
    id: 'ORETRACKING',
    name: 'Ore Tracking',
    type: 'tracking',
    category: 'Material Tracking',
    description: 'Material movement tracking',
    dataProducts: ['Parcel Records', 'Stockpile Volumes', 'Movement History'],
    position: { x: 100, y: 350 },
  },
  {
    id: 'LIMS',
    name: 'LIMS',
    type: 'laboratory',
    category: 'Quality Systems',
    description: 'Laboratory information management',
    dataProducts: ['Assay Results', 'Sample Records', 'Quality Certificates'],
    position: { x: 250, y: 350 },
  },
  {
    id: 'RECONCILER',
    name: 'Reconciler',
    type: 'reconciliation',
    category: 'Quality Systems',
    description: 'Grade reconciliation system',
    dataProducts: ['Reconciliation Factors', 'Grade Adjustments', 'Confidence Scores'],
    position: { x: 400, y: 350 },
  },
  {
    id: 'CEREBRA',
    name: 'Cerebra AI',
    type: 'ai_platform',
    category: 'AI Platform',
    description: 'AI orchestration and decision support',
    dataProducts: ['Recommendations', 'Risk Signals', 'Optimised Plans'],
    position: { x: 250, y: 500 },
  },
];

/**
 * Data products (intermediate nodes in lineage)
 */
export const dataProducts = [
  {
    id: 'DP_BLOCK_MODEL',
    name: 'Block Model',
    sourceSystem: 'VULCAN',
    description: 'Geological block model with grades and tonnages',
    updateFrequency: 'Monthly',
    quality: 'High',
  },
  {
    id: 'DP_MINE_PLAN',
    name: 'Mine Plan',
    sourceSystem: 'DESWIK',
    description: '90/30/7-day mine plan',
    updateFrequency: 'Weekly',
    quality: 'High',
  },
  {
    id: 'DP_DISPATCH_INSTR',
    name: 'Dispatch Instructions',
    sourceSystem: 'MINESTAR',
    description: 'Real-time fleet assignments',
    updateFrequency: 'Real-time',
    quality: 'High',
  },
  {
    id: 'DP_STOCKPILE_STATE',
    name: 'Stockpile State',
    sourceSystem: 'ORETRACKING',
    description: 'Current stockpile volumes and compositions',
    updateFrequency: 'Hourly',
    quality: 'Medium',
  },
  {
    id: 'DP_ASSAY_RESULTS',
    name: 'Assay Results',
    sourceSystem: 'LIMS',
    description: 'Laboratory assay results',
    updateFrequency: '2-6 hours lag',
    quality: 'High',
  },
  {
    id: 'DP_RECON_FACTORS',
    name: 'Reconciliation Factors',
    sourceSystem: 'RECONCILER',
    description: 'Grade reconciliation adjustment factors',
    updateFrequency: 'Daily',
    quality: 'High',
  },
  {
    id: 'DP_GRADE_ESTIMATES',
    name: 'Grade Estimates',
    sourceSystem: 'CEREBRA',
    description: 'AI-enhanced grade estimates with confidence',
    updateFrequency: 'Real-time',
    quality: 'Medium-High',
  },
  {
    id: 'DP_RISK_SIGNALS',
    name: 'Risk Signals',
    sourceSystem: 'CEREBRA',
    description: 'Under-spec and compliance risk alerts',
    updateFrequency: 'Real-time',
    quality: 'High',
  },
];

/**
 * Lineage edges - data flow between systems
 */
export const lineageEdges = [
  // Vulcan flows
  { id: 'l001', source: 'VULCAN', target: 'DESWIK', type: 'extracts', label: 'Block Model' },
  { id: 'l002', source: 'VULCAN', target: 'RECONCILER', type: 'extracts', label: 'Grade Factors' },
  
  // Deswik flows
  { id: 'l003', source: 'DESWIK', target: 'MTM', type: 'feeds', label: 'Long-term Plan' },
  { id: 'l004', source: 'DESWIK', target: 'MINESTAR', type: 'pushes', label: 'Shift Plan' },
  { id: 'l005', source: 'DESWIK', target: 'CEREBRA', type: 'feeds', label: 'Plan Context' },
  
  // MTM flows
  { id: 'l006', source: 'MTM', target: 'DESWIK', type: 'constrains', label: 'Production Targets' },
  
  // Dispatch flows
  { id: 'l007', source: 'MINESTAR', target: 'ORETRACKING', type: 'triggers', label: 'Movement Events' },
  { id: 'l008', source: 'MINESTAR', target: 'CEREBRA', type: 'streams', label: 'Fleet Status' },
  { id: 'l009', source: 'MODULAR', target: 'MINESTAR', type: 'supplements', label: 'Route Data' },
  
  // Plant flows
  { id: 'l010', source: 'SCADA', target: 'ORETRACKING', type: 'reports', label: 'Throughput' },
  { id: 'l011', source: 'SCADA', target: 'CEREBRA', type: 'streams', label: 'Plant Status' },
  
  // Quality flows
  { id: 'l012', source: 'ORETRACKING', target: 'LIMS', type: 'triggers', label: 'Sample Requests' },
  { id: 'l013', source: 'LIMS', target: 'RECONCILER', type: 'feeds', label: 'Assay Results' },
  { id: 'l014', source: 'LIMS', target: 'CEREBRA', type: 'streams', label: 'Assay Data' },
  { id: 'l015', source: 'RECONCILER', target: 'VULCAN', type: 'updates', label: 'Recon Factors' },
  { id: 'l016', source: 'RECONCILER', target: 'CEREBRA', type: 'feeds', label: 'Confidence Scores' },
  
  // Cerebra outputs
  { id: 'l017', source: 'CEREBRA', target: 'DESWIK', type: 'recommends', label: 'Plan Changes' },
  { id: 'l018', source: 'CEREBRA', target: 'MINESTAR', type: 'optimises', label: 'Dispatch Opt' },
  { id: 'l019', source: 'CEREBRA', target: 'SCADA', type: 'suggests', label: 'Setpoint Adj' },
];

/**
 * Lineage path definitions for highlighting
 */
export const lineagePaths = {
  planningCycle: {
    name: 'Planning Cycle',
    description: 'Block model → Plan → Dispatch → Execution',
    systems: ['VULCAN', 'DESWIK', 'MINESTAR', 'ORETRACKING'],
    color: '#A100FF',
  },
  qualityCycle: {
    name: 'Quality Cycle',
    description: 'Samples → Lab → Reconciliation → Block Model Update',
    systems: ['ORETRACKING', 'LIMS', 'RECONCILER', 'VULCAN'],
    color: '#10B981',
  },
  aiLoop: {
    name: 'AI Decision Loop',
    description: 'All systems → Cerebra → Optimisation → Systems',
    systems: ['LIMS', 'MINESTAR', 'SCADA', 'CEREBRA', 'DESWIK'],
    color: '#F59E0B',
  },
};

/**
 * Get lineage for a specific system
 */
export function getSystemLineage(systemId) {
  return {
    inputs: lineageEdges.filter(e => e.target === systemId),
    outputs: lineageEdges.filter(e => e.source === systemId),
    dataProducts: dataProducts.filter(dp => dp.sourceSystem === systemId),
  };
}

/**
 * Get data product by ID
 */
export function getDataProduct(id) {
  return dataProducts.find(dp => dp.id === id);
}

export default {
  systems: lineageSystems,
  dataProducts,
  edges: lineageEdges,
  paths: lineagePaths,
  getSystemLineage,
  getDataProduct,
};
