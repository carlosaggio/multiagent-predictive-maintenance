/**
 * P2C (Pit-to-Customer) Ontology Schema
 * 
 * Defines the semantic model underpinning all WAIO agents.
 * This schema represents the "single mental model" for the demo.
 */

// Entity type icons (for UI rendering)
export const ENTITY_ICONS = {
  // Planning
  Plan: 'calendar',
  PlanVersion: 'tag',
  PlanItem: 'list',
  DigInstruction: 'shovel',
  HaulInstruction: 'truck',
  BlendRecipe: 'flask',
  StockpileBuildPlan: 'layers-plus',
  StockpileReclaimPlan: 'layers-minus',
  TrainLoadingPlan: 'train',
  PortLoadingPlan: 'ship',
  Constraint: 'lock',
  ObjectiveWeightSet: 'sliders',
  CommercialRule: 'file-contract',
  ChangeSet: 'diff',
  
  // Mining & Materials
  Pit: 'pit',
  Zone: 'zone',
  Bench: 'bench',
  Block: 'grid',
  BlastPattern: 'blast',
  BlastWindow: 'clock',
  MaterialParcel: 'parcel',
  Stockpile: 'layers',
  StockpileSlice: 'layer',
  
  // Equipment
  Equipment: 'equipment',
  Shovel: 'shovel',
  Truck: 'truck',
  Dozer: 'dozer',
  Reclaimer: 'reclaimer',
  Stacker: 'stacker',
  Crusher: 'crusher',
  Conveyor: 'conveyor',
  Route: 'route',
  DispatchInstruction: 'dispatch',
  SCADAConstraintSet: 'settings',
  Event: 'alert',
  
  // Quality
  AssaySample: 'flask',
  GradeEstimate: 'chart',
  Spec: 'target',
  RiskSignal: 'warning',
  
  // Logistics
  Train: 'train',
  TrainSlot: 'clock',
  PortStockpile: 'port-layers',
  Vessel: 'ship',
  BerthSlot: 'anchor',
  
  // Systems
  System: 'database',
};

// Entity type colors (for UI rendering)
export const ENTITY_COLORS = {
  // Planning (Purple tones)
  Plan: '#A855F7',
  PlanVersion: '#9333EA',
  PlanItem: '#7C3AED',
  DigInstruction: '#6D28D9',
  HaulInstruction: '#5B21B6',
  BlendRecipe: '#4C1D95',
  StockpileBuildPlan: '#7C3AED',
  StockpileReclaimPlan: '#6D28D9',
  TrainLoadingPlan: '#5B21B6',
  PortLoadingPlan: '#4C1D95',
  Constraint: '#EF4444',
  ObjectiveWeightSet: '#F97316',
  CommercialRule: '#EAB308',
  ChangeSet: '#A100FF',
  
  // Mining & Materials (Brown/Earth tones)
  Pit: '#92400E',
  Zone: '#B45309',
  Bench: '#D97706',
  Block: '#F59E0B',
  BlastPattern: '#FF6B6B',
  BlastWindow: '#FF8787',
  MaterialParcel: '#FCD34D',
  Stockpile: '#84CC16',
  StockpileSlice: '#A3E635',
  
  // Equipment (Blue tones)
  Equipment: '#3B82F6',
  Shovel: '#2563EB',
  Truck: '#1D4ED8',
  Dozer: '#1E40AF',
  Reclaimer: '#1E3A8A',
  Stacker: '#1E40AF',
  Crusher: '#1D4ED8',
  Conveyor: '#2563EB',
  Route: '#60A5FA',
  DispatchInstruction: '#93C5FD',
  SCADAConstraintSet: '#BFDBFE',
  Event: '#EF4444',
  
  // Quality (Green tones)
  AssaySample: '#10B981',
  GradeEstimate: '#059669',
  Spec: '#047857',
  RiskSignal: '#F59E0B',
  
  // Logistics (Teal tones)
  Train: '#14B8A6',
  TrainSlot: '#0D9488',
  PortStockpile: '#0F766E',
  Vessel: '#115E59',
  BerthSlot: '#134E4A',
  
  // Systems (Gray tones)
  System: '#64748B',
};

/**
 * Core entity types for the P2C ontology
 */
export const entityTypes = [
  // ============================================================================
  // PLANNING ENTITIES
  // ============================================================================
  {
    id: 'Plan',
    label: 'Plan',
    category: 'planning',
    icon: ENTITY_ICONS.Plan,
    color: ENTITY_COLORS.Plan,
    description: 'A planning horizon (LoM, 90D, 30D, 7D, Day, Shift)',
    attributes: ['id', 'horizon', 'site', 'owner', 'createdAt', 'status'],
  },
  {
    id: 'PlanVersion',
    label: 'Plan Version',
    category: 'planning',
    icon: ENTITY_ICONS.PlanVersion,
    color: ENTITY_COLORS.PlanVersion,
    description: 'A specific version of a plan',
    attributes: ['id', 'version', 'createdAt', 'status', 'horizon', 'effectiveFrom', 'effectiveTo'],
  },
  {
    id: 'DigInstruction',
    label: 'Dig Instruction',
    category: 'planning',
    icon: ENTITY_ICONS.DigInstruction,
    color: ENTITY_COLORS.DigInstruction,
    description: 'Instruction to dig from a specific block or face',
    attributes: ['id', 'targetBlock', 'startTime', 'endTime', 'tonnage', 'priority'],
  },
  {
    id: 'HaulInstruction',
    label: 'Haul Instruction',
    category: 'planning',
    icon: ENTITY_ICONS.HaulInstruction,
    color: ENTITY_COLORS.HaulInstruction,
    description: 'Instruction for material movement',
    attributes: ['id', 'source', 'destination', 'tonnage', 'equipment', 'route'],
  },
  {
    id: 'BlendRecipe',
    label: 'Blend Recipe',
    category: 'planning',
    icon: ENTITY_ICONS.BlendRecipe,
    color: ENTITY_COLORS.BlendRecipe,
    description: 'Recipe for blending material from multiple sources',
    attributes: ['id', 'targetGrade', 'sources', 'ratios', 'confidence'],
  },
  {
    id: 'TrainLoadingPlan',
    label: 'Train Loading Plan',
    category: 'planning',
    icon: ENTITY_ICONS.TrainLoadingPlan,
    color: ENTITY_COLORS.TrainLoadingPlan,
    description: 'Plan for loading material onto a train',
    attributes: ['id', 'trainId', 'stockpiles', 'targetTonnage', 'targetGrade', 'scheduledTime'],
  },
  {
    id: 'Constraint',
    label: 'Constraint',
    category: 'planning',
    icon: ENTITY_ICONS.Constraint,
    color: ENTITY_COLORS.Constraint,
    description: 'Operational or commercial constraint',
    attributes: ['id', 'type', 'description', 'severity', 'effectiveFrom', 'effectiveTo'],
  },
  {
    id: 'ObjectiveWeightSet',
    label: 'Objective Weight Set',
    category: 'planning',
    icon: ENTITY_ICONS.ObjectiveWeightSet,
    color: ENTITY_COLORS.ObjectiveWeightSet,
    description: 'Coefficients for objective function optimisation',
    attributes: ['id', 'valueWeight', 'tonnesWeight', 'complianceWeight', 'riskWeight'],
  },
  {
    id: 'CommercialRule',
    label: 'Commercial Rule',
    category: 'planning',
    icon: ENTITY_ICONS.CommercialRule,
    color: ENTITY_COLORS.CommercialRule,
    description: 'Contract/spec/penalty rule',
    attributes: ['id', 'contractId', 'ruleType', 'threshold', 'penalty', 'description'],
  },
  {
    id: 'ChangeSet',
    label: 'Change Set',
    category: 'planning',
    icon: ENTITY_ICONS.ChangeSet,
    color: ENTITY_COLORS.ChangeSet,
    description: 'Proposed changes to a plan',
    attributes: ['id', 'targetPlan', 'changes', 'rationale', 'expectedImpact', 'confidence'],
  },

  // ============================================================================
  // MINING & MATERIALS ENTITIES
  // ============================================================================
  {
    id: 'Pit',
    label: 'Pit',
    category: 'mining',
    icon: ENTITY_ICONS.Pit,
    color: ENTITY_COLORS.Pit,
    description: 'Open pit mine',
    attributes: ['id', 'name', 'status', 'totalTonnage', 'avgGrade'],
  },
  {
    id: 'Zone',
    label: 'Zone',
    category: 'mining',
    icon: ENTITY_ICONS.Zone,
    color: ENTITY_COLORS.Zone,
    description: 'Zone within a pit',
    attributes: ['id', 'pitId', 'name', 'status', 'tonnageRemaining'],
  },
  {
    id: 'Block',
    label: 'Block',
    category: 'mining',
    icon: ENTITY_ICONS.Block,
    color: ENTITY_COLORS.Block,
    description: 'Mining block with known tonnage and grade',
    attributes: ['id', 'pit', 'zone', 'bench', 'tonnage', 'gradeFe', 'gradeSiO2', 'confidence'],
  },
  {
    id: 'BlastPattern',
    label: 'Blast Pattern',
    category: 'mining',
    icon: ENTITY_ICONS.BlastPattern,
    color: ENTITY_COLORS.BlastPattern,
    description: 'Planned blast pattern',
    attributes: ['id', 'blocks', 'scheduledTime', 'status'],
  },
  {
    id: 'BlastWindow',
    label: 'Blast Window',
    category: 'mining',
    icon: ENTITY_ICONS.BlastWindow,
    color: ENTITY_COLORS.BlastWindow,
    description: 'Time window for blasting operations',
    attributes: ['id', 'startTime', 'endTime', 'clearanceRequired'],
  },
  {
    id: 'MaterialParcel',
    label: 'Material Parcel',
    category: 'mining',
    icon: ENTITY_ICONS.MaterialParcel,
    color: ENTITY_COLORS.MaterialParcel,
    description: 'Tracked unit of ore material',
    attributes: ['id', 'sourceBlock', 'tonnage', 'grade', 'timestamp', 'currentLocation'],
  },
  {
    id: 'Stockpile',
    label: 'Stockpile',
    category: 'mining',
    icon: ENTITY_ICONS.Stockpile,
    color: ENTITY_COLORS.Stockpile,
    description: 'Material stockpile',
    attributes: ['id', 'name', 'volume_t', 'gradeFe', 'gradeSiO2', 'confidence', 'lastAssayTime'],
  },
  {
    id: 'StockpileSlice',
    label: 'Stockpile Slice',
    category: 'mining',
    icon: ENTITY_ICONS.StockpileSlice,
    color: ENTITY_COLORS.StockpileSlice,
    description: 'Time-based slice of a stockpile composition',
    attributes: ['id', 'stockpileId', 'timestamp', 'tonnage', 'grade', 'sources'],
  },

  // ============================================================================
  // EQUIPMENT ENTITIES
  // ============================================================================
  {
    id: 'Shovel',
    label: 'Shovel',
    category: 'equipment',
    icon: ENTITY_ICONS.Shovel,
    color: ENTITY_COLORS.Shovel,
    description: 'Excavation equipment',
    attributes: ['id', 'name', 'capacity', 'status', 'currentLocation', 'utilisation'],
  },
  {
    id: 'Truck',
    label: 'Truck',
    category: 'equipment',
    icon: ENTITY_ICONS.Truck,
    color: ENTITY_COLORS.Truck,
    description: 'Haul truck',
    attributes: ['id', 'name', 'payload', 'status', 'currentLocation', 'assignedRoute'],
  },
  {
    id: 'Dozer',
    label: 'Dozer',
    category: 'equipment',
    icon: ENTITY_ICONS.Dozer,
    color: ENTITY_COLORS.Dozer,
    description: 'Bulldozer for stockpile management',
    attributes: ['id', 'name', 'status', 'currentLocation'],
  },
  {
    id: 'Reclaimer',
    label: 'Reclaimer',
    category: 'equipment',
    icon: ENTITY_ICONS.Reclaimer,
    color: ENTITY_COLORS.Reclaimer,
    description: 'Stockpile reclaimer',
    attributes: ['id', 'name', 'capacity', 'status', 'assignedStockpile'],
  },
  {
    id: 'Crusher',
    label: 'Crusher',
    category: 'equipment',
    icon: ENTITY_ICONS.Crusher,
    color: ENTITY_COLORS.Crusher,
    description: 'Primary crusher',
    attributes: ['id', 'name', 'capacity', 'status', 'throughput', 'linerWear'],
  },
  {
    id: 'Route',
    label: 'Route',
    category: 'equipment',
    icon: ENTITY_ICONS.Route,
    color: ENTITY_COLORS.Route,
    description: 'Haul route',
    attributes: ['id', 'source', 'destination', 'distance', 'decline', 'speedLimit'],
  },
  {
    id: 'DispatchInstruction',
    label: 'Dispatch Instruction',
    category: 'equipment',
    icon: ENTITY_ICONS.DispatchInstruction,
    color: ENTITY_COLORS.DispatchInstruction,
    description: 'Equipment dispatch instruction',
    attributes: ['id', 'equipment', 'source', 'destination', 'payload', 'route', 'scheduledTime'],
  },
  {
    id: 'Event',
    label: 'Event',
    category: 'equipment',
    icon: ENTITY_ICONS.Event,
    color: ENTITY_COLORS.Event,
    description: 'Operational event (breakdown, delay, etc.)',
    attributes: ['id', 'type', 'severity', 'timestamp', 'equipment', 'description', 'resolved'],
  },

  // ============================================================================
  // QUALITY ENTITIES
  // ============================================================================
  {
    id: 'AssaySample',
    label: 'Assay Sample',
    category: 'quality',
    icon: ENTITY_ICONS.AssaySample,
    color: ENTITY_COLORS.AssaySample,
    description: 'Laboratory assay sample',
    attributes: ['id', 'source', 'collectedAt', 'processedAt', 'gradeFe', 'gradeSiO2', 'gradeAl2O3', 'gradeP'],
  },
  {
    id: 'GradeEstimate',
    label: 'Grade Estimate',
    category: 'quality',
    icon: ENTITY_ICONS.GradeEstimate,
    color: ENTITY_COLORS.GradeEstimate,
    description: 'Estimated grade with confidence',
    attributes: ['id', 'entity', 'gradeFe', 'gradeSiO2', 'confidence', 'timestamp', 'sources'],
  },
  {
    id: 'Spec',
    label: 'Specification',
    category: 'quality',
    icon: ENTITY_ICONS.Spec,
    color: ENTITY_COLORS.Spec,
    description: 'Product specification (Fe/SiO2/Al2O3/P)',
    attributes: ['id', 'contractId', 'minFe', 'maxSiO2', 'maxAl2O3', 'maxP'],
  },
  {
    id: 'RiskSignal',
    label: 'Risk Signal',
    category: 'quality',
    icon: ENTITY_ICONS.RiskSignal,
    color: ENTITY_COLORS.RiskSignal,
    description: 'Under-spec or compliance risk signal',
    attributes: ['id', 'type', 'probability', 'severity', 'timestamp', 'relatedEntities'],
  },

  // ============================================================================
  // LOGISTICS ENTITIES
  // ============================================================================
  {
    id: 'Train',
    label: 'Train',
    category: 'logistics',
    icon: ENTITY_ICONS.Train,
    color: ENTITY_COLORS.Train,
    description: 'Rail train for ore transport',
    attributes: ['id', 'name', 'capacity_t', 'status', 'etaLoadout', 'currentLocation'],
  },
  {
    id: 'TrainSlot',
    label: 'Train Slot',
    category: 'logistics',
    icon: ENTITY_ICONS.TrainSlot,
    color: ENTITY_COLORS.TrainSlot,
    description: 'Scheduled train loading slot',
    attributes: ['id', 'trainId', 'scheduledTime', 'duration', 'status'],
  },
  {
    id: 'Vessel',
    label: 'Vessel',
    category: 'logistics',
    icon: ENTITY_ICONS.Vessel,
    color: ENTITY_COLORS.Vessel,
    description: 'Shipping vessel',
    attributes: ['id', 'name', 'capacity_t', 'contractId', 'eta', 'status'],
  },
  {
    id: 'BerthSlot',
    label: 'Berth Slot',
    category: 'logistics',
    icon: ENTITY_ICONS.BerthSlot,
    color: ENTITY_COLORS.BerthSlot,
    description: 'Port berth slot',
    attributes: ['id', 'vesselId', 'berthId', 'scheduledTime', 'duration'],
  },

  // ============================================================================
  // SYSTEM ENTITIES
  // ============================================================================
  {
    id: 'System',
    label: 'System',
    category: 'systems',
    icon: ENTITY_ICONS.System,
    color: ENTITY_COLORS.System,
    description: 'External system (Deswik, Vulcan, SCADA, etc.)',
    attributes: ['id', 'name', 'type', 'description', 'integrationStatus'],
  },
];

/**
 * Relationship types for the P2C ontology
 */
export const relationshipTypes = [
  // ============================================================================
  // PLANNING RELATIONSHIPS
  // ============================================================================
  { id: 'has_version', from: 'Plan', to: 'PlanVersion', label: 'has version', category: 'planning' },
  { id: 'contains', from: 'PlanVersion', to: 'DigInstruction', label: 'contains', category: 'planning' },
  { id: 'contains_haul', from: 'PlanVersion', to: 'HaulInstruction', label: 'contains', category: 'planning' },
  { id: 'contains_blend', from: 'PlanVersion', to: 'BlendRecipe', label: 'contains', category: 'planning' },
  { id: 'contains_train', from: 'PlanVersion', to: 'TrainLoadingPlan', label: 'contains', category: 'planning' },
  { id: 'constrained_by', from: 'PlanVersion', to: 'Constraint', label: 'constrained by', category: 'planning' },
  { id: 'governed_by', from: 'PlanVersion', to: 'CommercialRule', label: 'governed by', category: 'planning' },
  { id: 'uses_weights', from: 'PlanVersion', to: 'ObjectiveWeightSet', label: 'uses weights', category: 'planning' },
  { id: 'updates', from: 'ChangeSet', to: 'PlanVersion', label: 'updates', category: 'planning' },
  { id: 'produced_by', from: 'ChangeSet', to: 'System', label: 'produced by', category: 'planning' },
  { id: 'cascades_to', from: 'PlanVersion', to: 'PlanVersion', label: 'cascades to', category: 'planning' },

  // ============================================================================
  // OPERATIONS RELATIONSHIPS
  // ============================================================================
  { id: 'targets', from: 'DigInstruction', to: 'Block', label: 'targets', category: 'operations' },
  { id: 'uses_route', from: 'HaulInstruction', to: 'Route', label: 'uses', category: 'operations' },
  { id: 'assigns', from: 'HaulInstruction', to: 'Truck', label: 'assigns', category: 'operations' },
  { id: 'consumes', from: 'BlendRecipe', to: 'MaterialParcel', label: 'consumes', category: 'operations' },
  { id: 'produces_grade', from: 'BlendRecipe', to: 'GradeEstimate', label: 'produces', category: 'operations' },
  { id: 'loads', from: 'TrainLoadingPlan', to: 'Train', label: 'loads', category: 'operations' },
  { id: 'reclaims_from', from: 'TrainLoadingPlan', to: 'Stockpile', label: 'reclaims from', category: 'operations' },

  // ============================================================================
  // MINING HIERARCHY RELATIONSHIPS
  // ============================================================================
  { id: 'contains_zone', from: 'Pit', to: 'Zone', label: 'contains', category: 'mining' },
  { id: 'contains_block', from: 'Zone', to: 'Block', label: 'contains', category: 'mining' },
  { id: 'blasts', from: 'BlastPattern', to: 'Block', label: 'blasts', category: 'mining' },
  { id: 'clears', from: 'BlastWindow', to: 'Zone', label: 'clears', category: 'mining' },

  // ============================================================================
  // QUALITY & TRACEABILITY RELATIONSHIPS
  // ============================================================================
  { id: 'sampled_from', from: 'AssaySample', to: 'StockpileSlice', label: 'sampled from', category: 'quality' },
  { id: 'sampled_from_block', from: 'AssaySample', to: 'Block', label: 'sampled from', category: 'quality' },
  { id: 'updates_grade', from: 'AssaySample', to: 'GradeEstimate', label: 'updates', category: 'quality' },
  { id: 'originates_from', from: 'MaterialParcel', to: 'Block', label: 'originates from', category: 'quality' },
  { id: 'dumped_to', from: 'MaterialParcel', to: 'StockpileSlice', label: 'dumped to', category: 'quality' },
  { id: 'loaded_to', from: 'MaterialParcel', to: 'Train', label: 'loaded to', category: 'quality' },
  { id: 'delivered_to', from: 'Train', to: 'Vessel', label: 'delivered to', category: 'quality' },
  { id: 'affects', from: 'RiskSignal', to: 'Train', label: 'affects', category: 'quality' },
  { id: 'triggered_by', from: 'RiskSignal', to: 'GradeEstimate', label: 'triggered by', category: 'quality' },

  // ============================================================================
  // STOCKPILE RELATIONSHIPS
  // ============================================================================
  { id: 'has_slice', from: 'Stockpile', to: 'StockpileSlice', label: 'has slice', category: 'stockpile' },
  { id: 'contains_material', from: 'Stockpile', to: 'MaterialParcel', label: 'contains', category: 'stockpile' },

  // ============================================================================
  // EQUIPMENT RELATIONSHIPS
  // ============================================================================
  { id: 'operates_in', from: 'Shovel', to: 'Pit', label: 'operates in', category: 'equipment' },
  { id: 'assigned_to', from: 'Truck', to: 'Route', label: 'assigned to', category: 'equipment' },
  { id: 'services', from: 'Reclaimer', to: 'Stockpile', label: 'services', category: 'equipment' },
  { id: 'impacted_by', from: 'DispatchInstruction', to: 'Event', label: 'impacted by', category: 'equipment' },

  // ============================================================================
  // SYSTEM LINEAGE RELATIONSHIPS
  // ============================================================================
  { id: 'published_to', from: 'PlanVersion', to: 'System', label: 'published to', category: 'lineage' },
  { id: 'stored_in', from: 'GradeEstimate', to: 'System', label: 'stored in', category: 'lineage' },
  { id: 'recorded_in', from: 'AssaySample', to: 'System', label: 'recorded in', category: 'lineage' },
  { id: 'sent_to', from: 'DispatchInstruction', to: 'System', label: 'sent to', category: 'lineage' },
  { id: 'extracts_from', from: 'System', to: 'System', label: 'extracts from', category: 'lineage' },
  { id: 'writes_to', from: 'System', to: 'System', label: 'writes to', category: 'lineage' },
];

/**
 * Get entity type by ID
 */
export function getEntityType(id) {
  return entityTypes.find(e => e.id === id);
}

/**
 * Get relationship type by ID
 */
export function getRelationshipType(id) {
  return relationshipTypes.find(r => r.id === id);
}

/**
 * Get all entity types in a category
 */
export function getEntityTypesByCategory(category) {
  return entityTypes.filter(e => e.category === category);
}

/**
 * Get relationships for an entity type
 */
export function getRelationshipsForEntity(entityTypeId) {
  return {
    outgoing: relationshipTypes.filter(r => r.from === entityTypeId),
    incoming: relationshipTypes.filter(r => r.to === entityTypeId),
  };
}

/**
 * Export the complete schema
 */
export const p2cOntologySchema = {
  entityTypes,
  relationshipTypes,
  colors: ENTITY_COLORS,
  icons: ENTITY_ICONS,
  getEntityType,
  getRelationshipType,
  getEntityTypesByCategory,
  getRelationshipsForEntity,
};

export default p2cOntologySchema;
