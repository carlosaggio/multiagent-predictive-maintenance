/**
 * WAIO Publish Targets Configuration
 * 
 * Defines the target systems for plan publishing and their payload summaries.
 */

export const waioPublishTargets = [
  {
    id: 'DESWIK',
    name: 'Deswik',
    type: 'planning',
    category: 'Mine Planning',
    description: 'Mine scheduling and sequence updates',
    payloadType: 'plan_changeset',
    payloadSummary: {
      action: 'UPDATE plan_version',
      items: ['SHIFT sequence edits', 'Target adjustments', 'Constraint changes'],
      recordCount: 3,
    },
    estimatedTime: 2500,
    priority: 1,
    icon: 'calendar',
  },
  {
    id: 'VULCAN',
    name: 'Vulcan',
    type: 'geological',
    category: 'Block Model',
    description: 'Block model factor updates and reconciliation',
    payloadType: 'block_model_factor_set',
    payloadSummary: {
      action: 'UPDATE block_model_factors',
      items: ['Grade confidence updates', 'Bias factor adjustments', 'Uncertainty parameters'],
      recordCount: 2,
    },
    estimatedTime: 3000,
    priority: 2,
    icon: 'grid',
  },
  {
    id: 'MINESTAR',
    name: 'Minestar Dispatch',
    type: 'dispatch',
    category: 'Fleet Management',
    description: 'Fleet assignments and route instructions',
    payloadType: 'dispatch_instructions',
    payloadSummary: {
      action: 'PUSH assignments',
      items: ['Truck routes (12)', 'Shovel positions (3)', 'Priority sequences'],
      recordCount: 15,
    },
    estimatedTime: 1500,
    priority: 3,
    icon: 'truck',
  },
  {
    id: 'MODULAR',
    name: 'Modular Mining',
    type: 'dispatch',
    category: 'Fleet Management',
    description: 'Supplemental fleet management and tracking',
    payloadType: 'fleet_status',
    payloadSummary: {
      action: 'SYNC fleet_state',
      items: ['Equipment status', 'Location tracking', 'Cycle time targets'],
      recordCount: 8,
    },
    estimatedTime: 1200,
    priority: 4,
    icon: 'settings',
  },
  {
    id: 'SCADA',
    name: 'SCADA/PLC',
    type: 'plant',
    category: 'Plant Control',
    description: 'OHP, COS, crushers, conveyors control',
    payloadType: 'constraint_set',
    payloadSummary: {
      action: 'PUSH constraint_set',
      items: ['Throughput limits', 'Reclaim rates', 'Crusher setpoints'],
      recordCount: 6,
    },
    estimatedTime: 1800,
    priority: 5,
    icon: 'cpu',
  },
  {
    id: 'ORETRACKING',
    name: 'Ore Tracking',
    type: 'tracking',
    category: 'Material Tracking',
    description: 'Material parcel and movement tracking',
    payloadType: 'parcel_mapping',
    payloadSummary: {
      action: 'PUSH parcel_mapping',
      items: ['Parcel-stockpile links', 'Train loading map', 'Volume updates'],
      recordCount: 12,
    },
    estimatedTime: 1400,
    priority: 6,
    icon: 'package',
  },
  {
    id: 'LIMS',
    name: 'LIMS',
    type: 'laboratory',
    category: 'Quality Systems',
    description: 'Laboratory information management',
    payloadType: 'assay_priority_request',
    payloadSummary: {
      action: 'REQUEST priority_assays',
      items: ['Pit3 ZC samples (5)', 'SP-3 verification (2)', 'Fast-track flags'],
      recordCount: 7,
    },
    estimatedTime: 1000,
    priority: 7,
    icon: 'flask',
  },
  {
    id: 'RECONCILER',
    name: 'Reconciler',
    type: 'reconciliation',
    category: 'Quality Systems',
    description: 'Grade reconciliation and factor management',
    payloadType: 'reconciliation_factors',
    payloadSummary: {
      action: 'PUSH reconciliation_factors',
      items: ['Grade adjustment factors', 'Confidence updates', 'Variance records'],
      recordCount: 4,
    },
    estimatedTime: 1600,
    priority: 8,
    icon: 'check-circle',
  },
  {
    id: 'MTM_MTP',
    name: 'MTM/MTP/Snowden',
    type: 'planning',
    category: 'Planning Tools',
    description: 'Medium-term planning and reconciliation tools',
    payloadType: 'plan_delta_export',
    payloadSummary: {
      action: 'SYNC plan_deltas',
      items: ['KPI updates', 'Deviation reports', 'Compliance metrics'],
      recordCount: 9,
    },
    estimatedTime: 2000,
    priority: 9,
    icon: 'bar-chart',
  },
];

/**
 * Get publish target by ID
 */
export function getPublishTarget(id) {
  return waioPublishTargets.find(t => t.id === id);
}

/**
 * Get targets by category
 */
export function getTargetsByCategory(category) {
  return waioPublishTargets.filter(t => t.category === category);
}

/**
 * Get total estimated publish time
 */
export function getTotalPublishTime() {
  return waioPublishTargets.reduce((sum, t) => sum + t.estimatedTime, 0);
}

export default waioPublishTargets;
