// Pre-written agent responses for streaming simulation

export const agentConfigs = [
  {
    id: "rd",
    name: "Root Cause Diagnostics Agent",
    badge: "RD",
    color: "#E67E22",
    azureService: "Azure OpenAI GPT-4o",
    delay: 0,
    duration: 5000,
  },
  {
    id: "ta",
    name: "Timeseries Analysis Agent",
    badge: "TA",
    color: "#EF4444",
    azureService: "Azure Synapse Analytics",
    delay: 500,
    duration: 4000,
  },
  {
    id: "mi",
    name: "Maintenance Intelligence Agent",
    badge: "MI",
    color: "#8B5CF6",
    azureService: "Azure Cosmos DB",
    delay: 1000,
    duration: 3500,
  },
  {
    id: "il",
    name: "Inventory & Logistics Agent",
    badge: "IL",
    color: "#10B981",
    azureService: "Azure Cosmos DB",
    delay: 1500,
    duration: 2500,
  },
  {
    id: "ld",
    name: "Liner Diagnostics Agent",
    badge: "LD",
    color: "#3B82F6",
    azureService: "Azure AI Vision",
    delay: 2000,
    duration: 3000,
  },
];

export const huddleAgents = [
  { id: "ro", name: "Resource Orchestration", badge: "RO", color: "#F59E0B" },
  { id: "po", name: "Production Optimization", badge: "PO", color: "#EC4899" },
  { id: "ma", name: "Maintenance Advisor", badge: "MA", color: "#14B8A6" },
  { id: "sc", name: "Scheduling Coordinator", badge: "SC", color: "#6366F1" },
  { id: "ra", name: "Risk Assessment", badge: "RA", color: "#F472B6" },
];

export const agentOutputs = {
  rd: {
    status: "Analyzing 18-month crusher performance dataset...",
    content: [
      "Pattern identified: Efficiency degradation correlates with hard ore feed composition",
      "",
      "Contributing factors:",
      "* Eccentric speed reduced: 320 RPM -> 280 RPM",
      "* Hard ore causing accelerated liner wear",
      "* Feed rate exceeding design capacity during peak hours",
      "",
      "Root cause determination: PRIMARY CRUSHER LINER WEAR",
      "Severity: HIGH",
    ],
    confidence: 87,
    elapsed: "5.2s",
  },
  ta: {
    status: "Analyzing OT Process Data for Primary Crusher...",
    content: [
      "Crusher efficiency trend analysis complete",
      "",
      "Key findings:",
      "* Efficiency dropped from 89% to 82% over 30 days",
      "* Anomaly detected at day 15 - sudden 3% efficiency drop",
      "* Vibration correlation: 0.85 with efficiency decline",
      "* Temperature stability: Within normal range",
    ],
    confidence: 92,
    elapsed: "4.1s",
    hasChart: true,
  },
  mi: {
    status: "Querying SAP PM maintenance records...",
    content: [
      "Last liner replacement: May 15, 2024 (8 months ago)",
      "Expected lifecycle: 6 months (EXCEEDED by 133%)",
      "",
      "Inspection reports retrieved:",
      "* Nov 30, 2024: Liner thickness at 65% (critical)",
      "* Oct 18, 2024: Excessive vibration noted",
      "",
      "Weibull analysis: β=2.1 (wear-out phase)",
      "RPN=432 (Severity:8 × Occurrence:6 × Detection:9)",
      "",
      "Finding: LIFECYCLE EXCEEDED - IMMEDIATE REPLACEMENT",
    ],
    confidence: 94,
    elapsed: "3.1s",
  },
  il: {
    status: "Checking inventory across 3 warehouses...",
    content: [
      "Required parts for liner replacement:",
      "",
      "Crusher Jaw Liner (P/N: CJ-8845)",
      "[OK] Available: 4 units | Warehouse 2 | Lead time: 0 days",
      "",
      "ASTM A193 B7 Bolts (72x required)",
      "[OK] Available: 85 units | Warehouse 1 | Lead time: 0 days",
      "",
      "Lubricating Oil (SAE 90)",
      "[OK] Available: 12L | Warehouse 2 | Lead time: 0 days",
      "",
      "STATUS: ALL PARTS IN STOCK",
      "Parts reserved (48-hour hold)",
    ],
    confidence: 99,
    elapsed: "2.0s",
  },
  ld: {
    status: "Analyzing wear patterns and thickness measurements...",
    content: [
      "Liner wear pattern analysis complete",
      "",
      "Current state:",
      "* Liner thickness: 65% of original",
      "* Wear pattern: Uneven - heavier on feed side",
      "* Estimated remaining life: 5-7 days under current load",
      "",
      "Recommendation: IMMEDIATE REPLACEMENT REQUIRED",
    ],
    confidence: 88,
    elapsed: "3.2s",
    hasImage: true,
  },
};

export const huddleOutputs = {
  ro: {
    title: "Resource Orchestration Agent",
    status: "Checking the control valve settings and crew availability...",
    findings: [
      "Optimal crew identified: James Morrison (Crusher Specialist L2, 95% skill match)",
      "Support team: 2x Fitters, 1x Electrician - all available",
      "Equipment reserved: 20-ton crane (Bay 3), welding machine, torque wrench set",
    ],
  },
  po: {
    title: "Production Optimization Agent",
    status: "Calculating optimal intervention timing...",
    findings: [
      "Optimal window: Next 48 hours during planned slowdown",
      "Secondary crusher can absorb 60% of load during maintenance",
      "Production impact during repair: Minimal (4% vs current 7.55%)",
    ],
  },
  ma: {
    title: "Maintenance Advisor Agent",
    status: "Verifying maintenance requirements...",
    findings: [
      "Confirms liner replacement required based on condition data",
      "Estimated duration: 8 hours",
      "Additional recommendation: Inspect eccentric bearings during downtime",
    ],
  },
  sc: {
    title: "Scheduling Coordinator Agent",
    status: "Coordinating with production schedule...",
    findings: [
      "Best slot identified: Day shift, starting 07:00",
      "Crew pre-briefing scheduled: 06:30",
      "Production team notified of maintenance window",
    ],
  },
  ra: {
    title: "Risk Assessment Agent",
    status: "Evaluating failure probability scenarios...",
    findings: [
      "If deferred 7 days: 34% catastrophic failure probability",
      "If deferred 14 days: 61% catastrophic failure probability",
      "Current state: Stable but degrading - IMMEDIATE ACTION RECOMMENDED",
    ],
  },
};

export const actionRecommendations = {
  immediate: [
    { action: "Replace crusher jaw liner (P/N: CJ-8845)", detail: "Estimated 8-hour job" },
    { action: "Inspect and replace eccentric bearings if needed", detail: "During liner replacement" },
    { action: "Recalibrate crushing chamber settings", detail: "Post-replacement optimization" },
  ],
  nearTerm: [
    { action: "Adjust ROM feed strategy", detail: "Reduce oversized ore in feed stream (target: <15% oversized)" },
    { action: "Coordinate with blasting team", detail: "Improve fragmentation specifications" },
    { action: "Implement real-time feed monitoring", detail: "Sensor-based feed optimization" },
  ],
  longTerm: [
    { action: "Install vibration and wear sensors", detail: "Condition-based monitoring" },
    { action: "Schedule liner replacements at 6-month intervals", detail: "Align with design lifecycle" },
    { action: "Eliminate production-driven maintenance deferrals", detail: "Policy update required" },
  ],
  autonomousActions: [
    "Crusher jaw liner parts reserved (Warehouse 2, 48-hour hold)",
    "Lead technician James Morrison notified and confirmed available",
    "Support crew assigned (2x Fitters, 1x Electrician)",
    "Equipment reserved: 20-ton crane (Bay 3), welding machine, torque wrench set",
    "Work order drafted in SAP PM (Order #: WO-2025-0147) [PENDING APPROVAL]",
    "Production team alerted to 48-hour optimal intervention window",
    "Secondary crusher team notified to prepare for load absorption",
  ],
};

export const conversationFlow = [
  {
    id: 1,
    type: "question",
    text: "Hi Carlos, Do you wish to analyze the efficiency drop in Primary Crusher from 89% to 82%?",
    options: [
      { id: "yes", label: "Yes", selected: true },
      { id: "no", label: "No, I need something else" },
    ],
    timestamp: "14:32",
  },
  {
    id: 2,
    type: "question",
    text: "Do you want to do the detailed RCA for this LPO?",
    options: [
      { id: "yes", label: "Yes", selected: true },
      { id: "no", label: "No, I need something else" },
    ],
    timestamp: "14:32",
  },
  {
    id: 3,
    type: "question",
    text: "Which scenario do you want to analyze?",
    options: [
      { id: "liner", label: "Liner wear degradation", selected: true },
      { id: "ore", label: "Hard ore feed composition" },
      { id: "bearing", label: "Eccentric bearing issues" },
      { id: "feed", label: "Feed rate overload" },
    ],
    timestamp: "14:33",
  },
];

