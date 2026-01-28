/**
 * WAIO Agents Configuration
 * 
 * Agent definitions for the WAIO Pit-to-Port Shift Optimiser demo.
 */

// WAIO Agent configurations
export const WAIO_AGENT_CONFIG = {
  SO: {
    id: 'SO',
    name: 'Shift Optimiser',
    fullName: 'Shift Optimiser (Super Agent)',
    color: '#A100FF', // Accenture purple
    lane: 'orchestrator',
    role: 'Orchestrates huddle, consolidates findings, creates plan options',
    icon: 'brain',
  },
  GC: {
    id: 'GC',
    name: 'Grade & Compliance',
    fullName: 'Grade & Compliance Agent',
    color: '#EF4444', // Red
    lane: 1,
    role: 'Detect under-spec risk; compute value-at-risk and penalties',
    icon: 'chart',
  },
  ST: {
    id: 'ST',
    name: 'Stockpile Traceability',
    fullName: 'Stockpile Traceability Agent',
    color: '#F59E0B', // Amber
    lane: 2,
    role: 'Parcel/stockpile trace; data confidence; unrecorded movements',
    icon: 'layers',
  },
  FR: {
    id: 'FR',
    name: 'Fleet & Resources',
    fullName: 'Fleet & Resources Agent',
    color: '#10B981', // Green
    lane: 3,
    role: 'Equipment availability, cycle times, capacity constraints',
    icon: 'truck',
  },
  MP: {
    id: 'MP',
    name: 'Mine Planning',
    fullName: 'Mine Planning Agent',
    color: '#6366F1', // Indigo
    lane: 4,
    role: 'Face selection, blast windows, dig rates, short-term targets',
    icon: 'pickaxe',
  },
  LP: {
    id: 'LP',
    name: 'Logistics (Rail/Port)',
    fullName: 'Logistics Agent',
    color: '#8B5CF6', // Purple
    lane: 5,
    role: 'Train slots, port berth constraints, demurrage risk',
    icon: 'train',
  },
  CM: {
    id: 'CM',
    name: 'Commercial & Market',
    fullName: 'Commercial & Market Agent',
    color: '#EC4899', // Pink
    lane: 6,
    role: 'Penalties, contract priorities, price signals, value optimisation',
    icon: 'dollar',
  },
};

// Curated agent responses (topline summaries)
export const WAIO_CURATED_RESPONSES = {
  SO: {
    content: "Analysis complete. Train-07 under-spec risk 62% with $740k penalty exposure. 3 plan options generated with compliance probabilities 92%, 82%, and 58% respectively. Recommended: Option B (Balanced) with 82% compliance and 151kt throughput.",
    isAI: true,
  },
  GC: {
    content: "Train-07 Fe forecast 61.2% (spec ≥62.0%) → 62% under-spec probability. Est. penalty exposure $740k. Root cause: SP-3 blend drift + Pit3 ZB low-Fe pocket. Confidence: 0.78.",
    isAI: true,
  },
  ST: {
    content: "Deviation introduced at SP-3 reclaim: assay lag 6h + unrecorded dozer rehandle detected. Volume reconciliation shows -2,400t unexplained. Data confidence: 0.72. Recommend: verify SP-3 grade, increase SP-2 blend ratio.",
    isAI: true,
  },
  FR: {
    content: "Fleet constraint: TRK-12 down (transmission fault, 2h repair). Haul capacity reduced 8%. Cycle time impact +11% on Pit 3 routes. Mitigation: reallocate TRK-08 from standby. Reclaim capacity stable at 13,500 tph.",
    isAI: true,
  },
  MP: {
    content: "Pit 3 Zone B showing low-Fe pocket (61.9% vs expected 62.4%). Recommend: shift to Pit 3 Zone C for 90min to recover Fe while Zone B blast window (10:00) clears. Pit 1 Zone A stable at 62.6% Fe.",
    isAI: true,
  },
  LP: {
    content: "Train-07 slot fixed 12:40. Delay >45min triggers Berth B2 knock-on risk. MV-Koyo-Maru ETA 14:00, demurrage rate $15k/h. Rail transit: 2 trains in network, avg 4.5h transit time. Constraint status: TIGHT.",
    isAI: true,
  },
  CM: {
    content: "Customer priority: Contract K-JP-A (Japan Premium) has 1.5x penalty multiplier. Current value-at-risk: $1.8M. Recommend: weight compliance ≥0.30. LME Fe62 at $108.50/dmt (+1.25 24h). Premium shipment window in 48h.",
    isAI: true,
  },
};

// Huddle lanes configuration
export const WAIO_HUDDLE_LANES = [
  {
    id: 'lane_grade',
    title: 'Grade & Compliance',
    agentId: 'GC',
    order: 1,
    steps: [
      { type: 'tool', name: 'analyze_grade_risk', params: 'train=TRAIN-07, horizon=6h' },
      { type: 'result', text: 'Fe forecast 61.2% | Spec ≥62.0% | Under-spec probability 62%' },
      { type: 'tool', name: 'calculate_penalty_exposure', params: 'grade=61.2, spec=62.0' },
      { type: 'result', text: 'Penalty exposure: $740k (Fe penalty $120k per 0.1%)' },
      { type: 'finding', text: 'Train-07 under-spec risk HIGH | $740k penalty exposure | Confidence: 0.78' },
    ],
    exhibits: [
      { title: 'Grade Risk Distribution', component: 'GradeRiskChart' },
    ],
  },
  {
    id: 'lane_stockpile',
    title: 'Stockpile Traceability',
    agentId: 'ST',
    order: 2,
    steps: [
      { type: 'tool', name: 'trace_parcels', params: 'stockpile=SP-3, hours=24' },
      { type: 'result', text: 'Volume reconciliation: -2,400t unexplained movement' },
      { type: 'tool', name: 'check_data_confidence', params: 'stockpile=SP-3' },
      { type: 'result', text: 'Assay timestamp: 02:10 (6h lag) | Confidence: 0.72' },
      { type: 'finding', text: 'Deviation at SP-3 reclaim: assay lag 6h + unrecorded rehandle | Confidence: 0.72' },
    ],
    exhibits: [
      { title: 'Stockpile Confidence Map', component: 'StockpileConfidenceChart' },
    ],
  },
  {
    id: 'lane_fleet',
    title: 'Fleet & Resources',
    agentId: 'FR',
    order: 3,
    steps: [
      { type: 'tool', name: 'query_fleet_status', params: 'asset_type=all' },
      { type: 'result', text: 'TRK-12 down (transmission) | Est. repair 2h | Haul capacity -8%' },
      { type: 'tool', name: 'calculate_cycle_impact', params: 'excluded=TRK-12' },
      { type: 'result', text: 'Cycle time impact: +11% on Pit 3 routes' },
      { type: 'finding', text: 'TRK-12 breakdown impact: haul -8%, cycle +11% | Mitigation: activate TRK-08' },
    ],
    exhibits: [
      { title: 'Fleet Utilisation', component: 'FleetUtilisationChart' },
    ],
  },
  {
    id: 'lane_mine',
    title: 'Mine Planning',
    agentId: 'MP',
    order: 4,
    steps: [
      { type: 'tool', name: 'query_mine_plan', params: 'pits=all, shift=current' },
      { type: 'result', text: 'Pit 3 Zone B: Fe 61.9% (expected 62.4%) | Zone C available' },
      { type: 'tool', name: 'check_blast_windows', params: 'pit=3' },
      { type: 'result', text: 'Zone B blast window: 10:00 | Zone C clear' },
      { type: 'finding', text: 'Pit 3 ZB low-Fe pocket | Shift to Zone C for 90min | Pit 1 ZA stable' },
    ],
    exhibits: [
      { title: 'Dig Face Schedule', component: 'DigFaceScheduleChart' },
    ],
  },
  {
    id: 'lane_logistics',
    title: 'Logistics (Rail/Port)',
    agentId: 'LP',
    order: 5,
    steps: [
      { type: 'tool', name: 'query_train_schedule', params: 'shift=current' },
      { type: 'result', text: 'TRAIN-07 slot: 12:40 fixed | TRAIN-08 slot: 16:20' },
      { type: 'tool', name: 'calculate_berth_impact', params: 'delay_scenarios=[30,45,60]' },
      { type: 'result', text: 'Delay >45min triggers Berth B2 knock-on | Demurrage: $15k/h' },
      { type: 'finding', text: 'Train-07 slot 12:40 fixed | >45min delay = port knock-on | Demurrage risk' },
    ],
    exhibits: [
      { title: 'Train & Port Schedule', component: 'TrainScheduleGantt' },
    ],
  },
  {
    id: 'lane_commercial',
    title: 'Commercial & Market',
    agentId: 'CM',
    order: 6,
    steps: [
      { type: 'tool', name: 'query_contracts', params: 'active=true, affected=TRAIN-07' },
      { type: 'result', text: 'Contract K-JP-A: 1.5x penalty multiplier | Priority 1' },
      { type: 'tool', name: 'query_market', params: 'indices=[LME_FE62]' },
      { type: 'result', text: 'LME Fe62: $108.50/dmt (+1.25 24h) | Premium window 48h' },
      { type: 'finding', text: 'K-JP-A high penalty exposure | Value-at-risk $1.8M | Recommend compliance ≥0.30' },
    ],
    exhibits: [
      { title: 'Value at Risk Analysis', component: 'ValueAtRiskChart' },
    ],
  },
];

// Agent tool definitions
export const WAIO_AGENT_TOOLS = {
  analyze_grade_risk: {
    name: 'analyze_grade_risk',
    description: 'Analyze grade risk for upcoming train loads',
    agent: 'GC',
  },
  calculate_penalty_exposure: {
    name: 'calculate_penalty_exposure',
    description: 'Calculate penalty exposure based on predicted grade vs spec',
    agent: 'GC',
  },
  trace_parcels: {
    name: 'trace_parcels',
    description: 'Trace ore parcels through the value chain',
    agent: 'ST',
  },
  check_data_confidence: {
    name: 'check_data_confidence',
    description: 'Check data quality and confidence for stockpiles',
    agent: 'ST',
  },
  query_fleet_status: {
    name: 'query_fleet_status',
    description: 'Query current fleet availability and status',
    agent: 'FR',
  },
  calculate_cycle_impact: {
    name: 'calculate_cycle_impact',
    description: 'Calculate impact of fleet changes on cycle times',
    agent: 'FR',
  },
  query_mine_plan: {
    name: 'query_mine_plan',
    description: 'Query current mine plan and dig face assignments',
    agent: 'MP',
  },
  check_blast_windows: {
    name: 'check_blast_windows',
    description: 'Check blast window constraints for pits',
    agent: 'MP',
  },
  query_train_schedule: {
    name: 'query_train_schedule',
    description: 'Query train schedule and slot availability',
    agent: 'LP',
  },
  calculate_berth_impact: {
    name: 'calculate_berth_impact',
    description: 'Calculate port berth impact from delays',
    agent: 'LP',
  },
  query_contracts: {
    name: 'query_contracts',
    description: 'Query active contracts and compliance status',
    agent: 'CM',
  },
  query_market: {
    name: 'query_market',
    description: 'Query market prices and indices',
    agent: 'CM',
  },
  optimise_blend: {
    name: 'optimise_blend',
    description: 'Optimise blend recipe for target grade',
    agent: 'SO',
  },
  generate_shift_plan: {
    name: 'generate_shift_plan',
    description: 'Generate optimised shift plan',
    agent: 'SO',
  },
};

export default {
  WAIO_AGENT_CONFIG,
  WAIO_CURATED_RESPONSES,
  WAIO_HUDDLE_LANES,
  WAIO_AGENT_TOOLS,
};
