export const MRO_AGENT_CONFIG = {
  OO: {
    id: 'OO',
    name: 'Ops Orchestrator',
    fullName: 'Operations Orchestrator (Super Agent)',
    color: '#A100FF',
    lane: 'orchestrator',
    role: 'Coordinates all MRO agents, decomposes alerts, synthesises recommendations',
    icon: 'brain',
  },
  MP: {
    id: 'MP',
    name: 'Material Planner',
    fullName: 'Material Planning Agent',
    color: '#3B82F6',
    lane: 1,
    role: 'Critical spares readiness, PO management, expedite/hold decisions, safety stock optimization',
    icon: 'package',
  },
  CS: {
    id: 'CS',
    name: 'Component Services',
    fullName: 'Component Services Agent',
    color: '#10B981',
    lane: 2,
    role: 'Rotable pool health, repair prioritisation, serviceable/unserviceable balance, AOG prevention',
    icon: 'settings',
  },
  WE: {
    id: 'WE',
    name: 'Work Execution',
    fullName: 'Work Execution Agent',
    color: '#EF4444',
    lane: 3,
    role: 'Task card progress, TAT prediction, hangar slot optimization, redelivery risk assessment',
    icon: 'clipboard',
  },
  SC: {
    id: 'SC',
    name: 'Supply Chain Intel',
    fullName: 'Supply Chain Intelligence Agent',
    color: '#8B5CF6',
    lane: 4,
    role: 'Vendor lead times, logistics routing, expedite cost analysis, alternate sourcing',
    icon: 'truck',
  },
  RA: {
    id: 'RA',
    name: 'Revenue Assurance',
    fullName: 'Revenue Assurance Agent',
    color: '#F59E0B',
    lane: 5,
    role: 'MBH accrual reconciliation, flying hours validation, billing exception management',
    icon: 'dollar',
  },
  OR: {
    id: 'OR',
    name: 'Ops Research',
    fullName: 'Operations Research Agent',
    color: '#06B6D4',
    lane: 6,
    role: 'Multi-echelon inventory optimization, stochastic demand forecasting, network rebalancing',
    icon: 'chart',
  },
};

export const MRO_CURATED_RESPONSES = {
  OO: {
    content: "Analysis complete. Coordination across all 6 specialist agents finished. Primary alert: Critical spares gap on WP-55 with 3-day predicted redelivery delay. Secondary: Component pool coverage dropping at Hub East (61%). Revenue exception on Contract Beta ($240K variance). Recommending immediate triage of spares gap — highest operational impact.",
    isAI: true,
  },
  MP: {
    content: "Material availability analysis complete. 3 parts flagged red for WP-55: PN-7742 (hydraulic actuator) — PO-8837 delayed 5 days by vendor, lead time 18 days. PN-3391 (landing gear bushing) — stock at zero, nearest source: Pool East (2 units serviceable). PN-9108 (IDG bearing) — repair order RO-221 completed early, available in 24h. Recommend: expedite PO-8837, transfer PN-3391 from Pool East, release PN-9108 from repair shop. Net working capital impact: +$16,600.",
    isAI: true,
  },
  CS: {
    content: "Component pool assessment complete. Overall fleet coverage: 89%. Critical gap: IDG pool at Hub East — 1 serviceable vs 3 required (61% coverage). 2 units in repair: RO-445 (vendor ABC, TAT +8 days over SLA), RO-446 (in-house, on track). APU pool healthy (97%). LDG pool nominal (94%). Recommendation: reprioritise RO-445 to expedite lane, consider temporary lease for Hub East coverage. AOG probability: 34% within 72h without action.",
    isAI: true,
  },
  WE: {
    content: "Work execution status for Hangar Site 1: 3 aircraft in bay (AC-042 C-Check, AC-078 D-Check, AC-115 A-Check). AC-042 inducted 2 days early — task card progress at 42%, on track for revised schedule. Critical path: landing gear overhaul (72h) and hydraulic system test (48h). WP-55 has 127 task cards, 53 completed, 12 in progress, 62 pending. Predicted TAT: 18 days (target: 15 days). 3-day delay risk unless spares gap resolved within 48h.",
    isAI: true,
  },
  SC: {
    content: "Supply chain intelligence scan complete. PO-8837 (PN-7742): vendor Parts Corp reports manufacturing delay — earliest ship date in 5 days. Alternative vendor: AeroParts Inc can supply in 3 days at 15% premium ($12,400 vs $10,800). Expedite fee for Parts Corp: $4,200 (reduces delay to 2 days). Transfer from Pool East: zero cost (internal), 18h transit. Logistics: DHL Priority available for all options. Recommendation: Transfer + expedite as backup provides best cost-risk profile.",
    isAI: true,
  },
  RA: {
    content: "Revenue assurance scan complete. MBH Contract Beta (Operator Alpha, A320neo fleet): $240K variance detected. Breakdown — $180K from unreported utilisation change (2 aircraft redeployed to higher-cycle routes), $60K from component swap (APU SN-8891 replaced but not captured in billing system). Contract terms: $42/FH for airframe, $18/FH for components. Flying hours reported: 42,100 FH this quarter vs 44,800 FH expected. Action required before quarterly billing deadline (5 business days).",
    isAI: true,
  },
  OR: {
    content: "Operations research optimization complete. Multi-echelon model shows: current inventory positioning 12% below optimal for Hub East given demand distribution. Stochastic simulation (10,000 runs): transferring 2 IDG units from Pool West to Hub East reduces AOG probability from 34% to 8% over 90-day horizon. Recommended safety stock adjustment: Hub East IDG from 3 to 4 units, Pool West from 6 to 5 units. Net inventory cost: neutral. Service level improvement: +23% at Hub East.",
    isAI: true,
  },
};

export const MRO_HUDDLE_LANES = [
  {
    id: 'lane_material',
    title: 'Material Planning & Spares',
    agentId: 'MP',
    order: 1,
    steps: [
      { type: 'tool', name: 'check_parts_availability', params: 'workPackage=WP-55, horizon=21d' },
      { type: 'result', text: '3 parts red: PN-7742 (PO delayed), PN-3391 (zero stock), PN-9108 (repair complete)' },
      { type: 'tool', name: 'evaluate_expedite_options', params: 'parts=PN-7742,PN-3391' },
      { type: 'result', text: 'Expedite PO-8837: -3 days, $4,200 | Transfer PN-3391: 18h, $0 | Alt vendor: 3 days, $12,400' },
      { type: 'finding', text: 'Critical spares gap: 3 parts at risk for WP-55, recommend transfer + expedite backup | Net cost: $4,200-$16,600 | Confidence: 0.85' },
    ],
  },
  {
    id: 'lane_component',
    title: 'Component Pool & Rotables',
    agentId: 'CS',
    order: 2,
    steps: [
      { type: 'tool', name: 'assess_pool_coverage', params: 'poolFamily=IDG,APU,LDG, sites=all' },
      { type: 'result', text: 'IDG: 61% (Hub East critical) | APU: 97% | LDG: 94%' },
      { type: 'tool', name: 'check_repair_orders', params: 'status=in_progress, overdue=true' },
      { type: 'result', text: 'RO-445: +8d TAT slip (vendor ABC) | RO-446: on track' },
      { type: 'finding', text: 'AOG risk 34% at Hub East within 72h | Pool rebalancing needed | Confidence: 0.82' },
    ],
  },
  {
    id: 'lane_execution',
    title: 'Work Execution & TAT',
    agentId: 'WE',
    order: 3,
    steps: [
      { type: 'tool', name: 'calculate_tat_prediction', params: 'aircraft=AC-042, checkType=C-Check' },
      { type: 'result', text: 'Predicted TAT: 18d (target 15d) | Critical path: LDG overhaul 72h + hydraulic test 48h' },
      { type: 'tool', name: 'assess_redelivery_risk', params: 'workPackage=WP-55' },
      { type: 'result', text: 'Redelivery delay: 3d if spares not resolved in 48h | Customer penalty: $45K/day' },
      { type: 'finding', text: '3-day redelivery delay risk on AC-042 | $135K penalty exposure | Confidence: 0.78' },
    ],
  },
  {
    id: 'lane_supply',
    title: 'Supply Chain & Logistics',
    agentId: 'SC',
    order: 4,
    steps: [
      { type: 'tool', name: 'scan_vendor_status', params: 'openPOs=PO-8837,PO-8901,PO-8915' },
      { type: 'result', text: 'PO-8837: 5d delay (Parts Corp) | PO-8901: on track | PO-8915: 1d early' },
      { type: 'tool', name: 'evaluate_logistics_options', params: 'origin=PoolEast, dest=Hangar1, priority=critical' },
      { type: 'result', text: 'DHL Priority: 18h | Standard freight: 48h | Internal shuttle: 24h' },
      { type: 'finding', text: 'Transfer from Pool East is fastest (18h via DHL Priority) and lowest cost ($0 + $280 shipping) | Confidence: 0.91' },
    ],
  },
  {
    id: 'lane_revenue',
    title: 'Revenue Assurance & MBH',
    agentId: 'RA',
    order: 5,
    steps: [
      { type: 'tool', name: 'scan_contract_accruals', params: 'contracts=all, period=Q4-2024' },
      { type: 'result', text: 'Contract Beta: -$240K variance | Contract Alpha: OK | Contract Gamma: -$60K' },
      { type: 'tool', name: 'identify_exception_root_cause', params: 'contract=Beta, variance=$240K' },
      { type: 'result', text: '2 utilisation changes unreported ($180K) + 1 component swap not billed ($60K)' },
      { type: 'finding', text: '$240K MBH revenue exception on Contract Beta | Billing deadline: 5 business days | Confidence: 0.88' },
    ],
  },
  {
    id: 'lane_optimization',
    title: 'Operations Research & Optimization',
    agentId: 'OR',
    order: 6,
    steps: [
      { type: 'tool', name: 'run_inventory_optimization', params: 'model=multi_echelon, horizon=90d, simulations=10000' },
      { type: 'result', text: 'Current positioning 12% below optimal for Hub East | Safety stock gap: 1 IDG unit' },
      { type: 'tool', name: 'simulate_rebalancing', params: 'transfer=2_IDG_PoolWest_to_HubEast' },
      { type: 'result', text: 'AOG probability: 34% → 8% | Net inventory cost: neutral | Service level: +23%' },
      { type: 'finding', text: 'Rebalancing 2 IDG units eliminates 76% of AOG risk at Hub East | Zero net cost | Confidence: 0.86' },
    ],
  },
];

export default MRO_AGENT_CONFIG;
