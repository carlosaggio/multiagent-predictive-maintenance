/**
 * P2C Decision Graph Data
 * 
 * Represents agent runs, tool calls, and their connections to entities.
 * This view provides explainability for AI decisions.
 */

/**
 * Agent run nodes - represent agent execution sessions
 */
export const agentRuns = [
  {
    id: 'AGENT_RUN_001',
    agentId: 'GR',
    agentName: 'Grade Agent',
    startTime: '2025-01-15T10:00:00',
    endTime: '2025-01-15T10:00:45',
    status: 'completed',
    trigger: 'Under-spec risk detected on Train-07',
    summary: 'Analyzed grade deviation sources and identified SP-3 as primary contributor',
    entitiesAccessed: ['SP-3', 'GRADE_EST_SP3', 'ASSAY-5521', 'PIT3-ZB-041'],
  },
  {
    id: 'AGENT_RUN_002',
    agentId: 'SP',
    agentName: 'Stockpile Agent',
    startTime: '2025-01-15T10:00:45',
    endTime: '2025-01-15T10:01:30',
    status: 'completed',
    trigger: 'Grade agent identified SP-3 confidence issue',
    summary: 'Assessed stockpile inventory and recommended increased SP-2 ratio in blend',
    entitiesAccessed: ['SP-2', 'SP-3', 'RCL-01'],
  },
  {
    id: 'AGENT_RUN_003',
    agentId: 'FL',
    agentName: 'Fleet Agent',
    startTime: '2025-01-15T10:01:30',
    endTime: '2025-01-15T10:02:15',
    status: 'completed',
    trigger: 'Blend recipe change requires fleet reallocation',
    summary: 'Identified TRK-12 breakdown impact and activated TRK-08 from standby',
    entitiesAccessed: ['TRK-12', 'TRK-08', 'RT-PIT3-SP3', 'EVENT_TRK12_BREAKDOWN'],
  },
  {
    id: 'AGENT_RUN_004',
    agentId: 'MP',
    agentName: 'Mine Plan Agent',
    startTime: '2025-01-15T10:02:15',
    endTime: '2025-01-15T10:03:00',
    status: 'completed',
    trigger: 'Shift plan adjustment needed',
    summary: 'Shifted dig operations from Zone B to Zone C to recover Fe grade',
    entitiesAccessed: ['PIT3-ZB', 'PIT3-ZC', 'DIG_INST_01', 'SHIFT-2025-01-15-DAY'],
  },
  {
    id: 'AGENT_RUN_005',
    agentId: 'LG',
    agentName: 'Logistics Agent',
    startTime: '2025-01-15T10:03:00',
    endTime: '2025-01-15T10:03:30',
    status: 'completed',
    trigger: 'Validate train loading plan feasibility',
    summary: 'Confirmed Train-07 loading schedule compatible with revised blend',
    entitiesAccessed: ['TRAIN-07', 'VESSEL-CAPE-FORTUNE', 'BLEND_TRAIN07'],
  },
  {
    id: 'AGENT_RUN_006',
    agentId: 'CM',
    agentName: 'Commercial Agent',
    startTime: '2025-01-15T10:03:30',
    endTime: '2025-01-15T10:04:00',
    status: 'completed',
    trigger: 'Assess commercial risk impact',
    summary: 'Calculated value at risk reduction from $740k to $180k with revised plan',
    entitiesAccessed: ['SPEC_CONTRACT_A', 'VESSEL-CAPE-FORTUNE', 'RISK_TRAIN07_UNDERSPEC'],
  },
  {
    id: 'AGENT_RUN_007',
    agentId: 'PR',
    agentName: 'Plan Retrofit Agent',
    startTime: '2025-01-15T18:00:00',
    endTime: '2025-01-15T18:02:00',
    status: 'completed',
    trigger: 'End of shift reconciliation',
    summary: 'Generated 7D plan retrofit proposal to prevent recurring grade drift',
    entitiesAccessed: ['7D_PLAN_v12', 'CHANGESET_001', 'PIT3-ZB', 'SP-3'],
  },
  {
    id: 'AGENT_RUN_008',
    agentId: 'OG',
    agentName: 'Ontology Navigator',
    startTime: '2025-01-15T10:04:00',
    endTime: '2025-01-15T10:04:15',
    status: 'completed',
    trigger: 'User query: "Why is Train-07 at risk?"',
    summary: 'Traced risk signal through grade estimates to assay lag and stockpile confidence',
    entitiesAccessed: ['RISK_TRAIN07_UNDERSPEC', 'GRADE_EST_TRAIN07', 'GRADE_EST_SP3', 'ASSAY-5521'],
  },
];

/**
 * Tool call nodes - represent specific agent tool invocations
 */
export const toolCalls = [
  // Grade Agent tool calls
  {
    id: 'TC_001',
    agentRunId: 'AGENT_RUN_001',
    tool: 'graph_query',
    args: { entityType: 'GradeEstimate', filters: { entity: 'SP-3' } },
    result: 'Found grade estimate: 61.8% Fe, confidence 72%',
    duration: '120ms',
    entitiesAccessed: ['GRADE_EST_SP3'],
  },
  {
    id: 'TC_002',
    agentRunId: 'AGENT_RUN_001',
    tool: 'graph_traverse',
    args: { startId: 'GRADE_EST_SP3', relationship: 'updates_grade', depth: 2 },
    result: 'Traced to ASSAY-5521, 4-hour lag identified',
    duration: '85ms',
    entitiesAccessed: ['GRADE_EST_SP3', 'ASSAY-5521', 'SP-3-SLICE-01'],
  },
  {
    id: 'TC_003',
    agentRunId: 'AGENT_RUN_001',
    tool: 'calculate_grade_deviation',
    args: { target: 'TRAIN-07', sources: ['SP-2', 'SP-3'] },
    result: 'Deviation: -1.2% Fe from spec, primary source: SP-3',
    duration: '200ms',
    entitiesAccessed: ['TRAIN-07', 'SP-2', 'SP-3', 'GRADE_EST_TRAIN07'],
  },

  // Stockpile Agent tool calls
  {
    id: 'TC_004',
    agentRunId: 'AGENT_RUN_002',
    tool: 'get_stockpile_inventory',
    args: { stockpiles: ['SP-1', 'SP-2', 'SP-3'] },
    result: 'SP-1: 185kt (63.1%), SP-2: 240kt (62.4%), SP-3: 210kt (61.8%)',
    duration: '150ms',
    entitiesAccessed: ['SP-1', 'SP-2', 'SP-3'],
  },
  {
    id: 'TC_005',
    agentRunId: 'AGENT_RUN_002',
    tool: 'optimize_blend_recipe',
    args: { target: 62.0, available: ['SP-2', 'SP-3', 'PIT3-ZC'], tonnage: 28000 },
    result: 'Optimal blend: 55% SP-2, 35% SP-3, 10% PIT3-ZC → 62.05% Fe',
    duration: '350ms',
    entitiesAccessed: ['SP-2', 'SP-3', 'PIT3-ZC-015', 'BLEND_TRAIN07'],
  },

  // Fleet Agent tool calls
  {
    id: 'TC_006',
    agentRunId: 'AGENT_RUN_003',
    tool: 'get_fleet_status',
    args: { equipmentTypes: ['Truck'] },
    result: '12 trucks active, 1 breakdown (TRK-12), 2 standby',
    duration: '100ms',
    entitiesAccessed: ['TRK-08', 'TRK-12'],
  },
  {
    id: 'TC_007',
    agentRunId: 'AGENT_RUN_003',
    tool: 'activate_standby_equipment',
    args: { equipmentId: 'TRK-08', assignRoute: 'RT-PIT3-SP2' },
    result: 'TRK-08 activated and assigned to PIT3→SP-2 route',
    duration: '80ms',
    entitiesAccessed: ['TRK-08', 'RT-PIT3-SP2'],
  },

  // Mine Plan Agent tool calls
  {
    id: 'TC_008',
    agentRunId: 'AGENT_RUN_004',
    tool: 'evaluate_dig_alternatives',
    args: { currentZone: 'PIT3-ZB', alternatives: ['PIT3-ZA', 'PIT3-ZC'] },
    result: 'PIT3-ZC preferred: higher grade (62.5%), better confidence (82%)',
    duration: '280ms',
    entitiesAccessed: ['PIT3-ZB', 'PIT3-ZA', 'PIT3-ZC', 'PIT3-ZC-015'],
  },
  {
    id: 'TC_009',
    agentRunId: 'AGENT_RUN_004',
    tool: 'update_shift_plan',
    args: { planId: 'SHIFT-2025-01-15-DAY', changes: [{ type: 'dig_redirect', from: 'PIT3-ZB', to: 'PIT3-ZC' }] },
    result: 'Shift plan updated: dig redirected to Zone C starting 10:00',
    duration: '150ms',
    entitiesAccessed: ['SHIFT-2025-01-15-DAY', 'DIG_INST_01'],
  },

  // Commercial Agent tool calls
  {
    id: 'TC_010',
    agentRunId: 'AGENT_RUN_006',
    tool: 'calculate_value_at_risk',
    args: { train: 'TRAIN-07', contract: 'CONTRACT-A' },
    result: 'Original VAR: $740k, Revised VAR: $180k (penalty avoidance)',
    duration: '220ms',
    entitiesAccessed: ['TRAIN-07', 'SPEC_CONTRACT_A', 'VESSEL-CAPE-FORTUNE'],
  },

  // Plan Retrofit Agent tool calls
  {
    id: 'TC_011',
    agentRunId: 'AGENT_RUN_007',
    tool: 'reconcile_plan_vs_actual',
    args: { horizon: 'SHIFT', metrics: ['tonnage', 'grade', 'compliance'] },
    result: 'Compliance: 78%, Grade drift: -0.3%, Repeat pattern: ZB uncertainty',
    duration: '400ms',
    entitiesAccessed: ['SHIFT-2025-01-15-DAY', 'PIT3-ZB', 'SP-3'],
  },
  {
    id: 'TC_012',
    agentRunId: 'AGENT_RUN_007',
    tool: 'generate_plan_changeset',
    args: { horizon: '7D', constraints: ['grade_stability'], weights: { compliance: 0.4, risk: 0.3 } },
    result: 'Generated 3 changes: reduce ZB dependence, increase SP-2 buffer, expedite ZC access',
    duration: '600ms',
    entitiesAccessed: ['7D_PLAN_v12', 'CHANGESET_001'],
  },

  // Ontology Navigator tool calls
  {
    id: 'TC_013',
    agentRunId: 'AGENT_RUN_008',
    tool: 'graph_traverse',
    args: { startId: 'RISK_TRAIN07_UNDERSPEC', relationship: 'triggered_by', depth: 3 },
    result: 'Path: Risk → Grade Est → Assay → SP-3 Slice → Low confidence (72%)',
    duration: '95ms',
    entitiesAccessed: ['RISK_TRAIN07_UNDERSPEC', 'GRADE_EST_TRAIN07', 'GRADE_EST_SP3', 'ASSAY-5521'],
  },
  {
    id: 'TC_014',
    agentRunId: 'AGENT_RUN_008',
    tool: 'explain_entity',
    args: { entityId: 'SP-3', includeRelationships: true },
    result: 'SP-3: 210kt stockpile, 61.8% Fe, confidence 72% (below threshold due to 4h assay lag)',
    duration: '60ms',
    entitiesAccessed: ['SP-3'],
  },
];

/**
 * Recommendation nodes - represent agent recommendations
 */
export const recommendations = [
  {
    id: 'REC_001',
    agentRunId: 'AGENT_RUN_001',
    type: 'insight',
    priority: 'high',
    title: 'Grade Deviation Root Cause',
    summary: 'SP-3 contributing -0.8% Fe deviation due to assay lag and dozer rehandle',
    confidence: 0.85,
    evidence: ['ASSAY-5521', 'GRADE_EST_SP3'],
    linkedEntities: ['SP-3', 'PIT3-ZB-041'],
  },
  {
    id: 'REC_002',
    agentRunId: 'AGENT_RUN_002',
    type: 'action',
    priority: 'high',
    title: 'Adjust Blend Recipe',
    summary: 'Increase SP-2 ratio from 45% to 55%, reduce SP-3 from 45% to 35%',
    confidence: 0.78,
    expectedImpact: '+0.25% Fe',
    linkedEntities: ['BLEND_TRAIN07', 'SP-2', 'SP-3'],
  },
  {
    id: 'REC_003',
    agentRunId: 'AGENT_RUN_003',
    type: 'action',
    priority: 'medium',
    title: 'Activate Standby Truck',
    summary: 'Activate TRK-08 to compensate for TRK-12 breakdown',
    confidence: 0.92,
    expectedImpact: 'Restore haul capacity',
    linkedEntities: ['TRK-08', 'TRK-12'],
  },
  {
    id: 'REC_004',
    agentRunId: 'AGENT_RUN_004',
    type: 'action',
    priority: 'high',
    title: 'Redirect Dig Operations',
    summary: 'Shift dig from Zone B to Zone C after blast window (10:00)',
    confidence: 0.82,
    expectedImpact: '+0.5% Fe from fresher source',
    linkedEntities: ['PIT3-ZB', 'PIT3-ZC', 'DIG_INST_01'],
  },
  {
    id: 'REC_005',
    agentRunId: 'AGENT_RUN_006',
    type: 'insight',
    priority: 'high',
    title: 'Value at Risk Reduction',
    summary: 'Revised plan reduces penalty exposure from $740k to $180k',
    confidence: 0.88,
    expectedImpact: '$560k penalty avoided',
    linkedEntities: ['SPEC_CONTRACT_A', 'TRAIN-07'],
  },
  {
    id: 'REC_006',
    agentRunId: 'AGENT_RUN_007',
    type: 'action',
    priority: 'high',
    title: '7-Day Plan Retrofit',
    summary: 'Reduce Zone B dependence, increase SP-2 buffer, expedite Zone C blast',
    confidence: 0.85,
    expectedImpact: '+8% compliance, -30% under-spec risk',
    linkedEntities: ['CHANGESET_001', '7D_PLAN_v12'],
  },
];

/**
 * Get all tool calls for an agent run
 */
export function getToolCallsForRun(agentRunId) {
  return toolCalls.filter(tc => tc.agentRunId === agentRunId);
}

/**
 * Get recommendations for an agent run
 */
export function getRecommendationsForRun(agentRunId) {
  return recommendations.filter(r => r.agentRunId === agentRunId);
}

/**
 * Get entities accessed by a tool call
 */
export function getEntitiesAccessedByToolCall(toolCallId) {
  const tc = toolCalls.find(t => t.id === toolCallId);
  return tc ? tc.entitiesAccessed : [];
}

/**
 * Build decision trace for an entity
 */
export function getDecisionTraceForEntity(entityId) {
  // Find all tool calls that accessed this entity
  const relevantToolCalls = toolCalls.filter(tc => 
    tc.entitiesAccessed.includes(entityId)
  );
  
  // Get agent runs for those tool calls
  const relevantRunIds = [...new Set(relevantToolCalls.map(tc => tc.agentRunId))];
  const relevantRuns = agentRuns.filter(ar => relevantRunIds.includes(ar.id));
  
  // Get recommendations involving this entity
  const relevantRecs = recommendations.filter(r => 
    r.linkedEntities?.includes(entityId)
  );
  
  return {
    toolCalls: relevantToolCalls,
    agentRuns: relevantRuns,
    recommendations: relevantRecs,
  };
}

export default {
  agentRuns,
  toolCalls,
  recommendations,
  getToolCallsForRun,
  getRecommendationsForRun,
  getEntitiesAccessedByToolCall,
  getDecisionTraceForEntity,
};
