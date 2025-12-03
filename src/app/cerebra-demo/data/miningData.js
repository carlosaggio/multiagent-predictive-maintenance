// Static Mining Scenario Data for Cerebra Demo

export const processNodes = [
  {
    id: "rom-bin",
    name: "ROM Bin",
    currentValue: 82,
    targetValue: 85,
    unit: "% Utilization",
    status: "normal",
  },
  {
    id: "primary-crusher",
    name: "Primary Crusher",
    currentValue: 82,
    targetValue: 89,
    unit: "% Efficiency",
    status: "critical", // This is the problem node
    lpoHours: 3240,
    lpoPercentage: 45,
    valueLost: 15200000,
  },
  {
    id: "secondary-crusher",
    name: "Secondary Crusher",
    currentValue: 88,
    targetValue: 90,
    unit: "% Efficiency",
    status: "normal",
  },
  {
    id: "tertiary-crusher",
    name: "Tertiary Crusher",
    currentValue: 90,
    targetValue: 92,
    unit: "% Efficiency",
    status: "normal",
  },
  {
    id: "final-product",
    name: "Final Product",
    currentValue: 510,
    targetValue: 550,
    unit: "t/hr",
    status: "normal",
  },
];

export const kpiData = {
  oreProcessed: {
    value: "107,700",
    unit: "TONNES/HR",
    change: -7.55,
    changeType: "negative",
  },
  copperProduced: {
    value: "510",
    unit: "TONNES/HR",
    change: -7.68,
    changeType: "negative",
  },
  productionLoss: {
    value: "150",
    unit: "TONNES/DAY",
    change: 1.34,
    changeType: "negative",
  },
};

export const lpoHotspots = [
  { equipment: "Primary Crusher", lpoHours: "3,240", percentage: "45%", valueLost: "$15.2M", isHighlight: true },
  { equipment: "Haul Truck Fleet", lpoHours: "1,580", percentage: "22%", valueLost: "$7.4M" },
  { equipment: "ROM Bin", lpoHours: "890", percentage: "12%", valueLost: "$4.2M" },
  { equipment: "Secondary Crusher", lpoHours: "620", percentage: "9%", valueLost: "$2.9M" },
  { equipment: "Conveyor System", lpoHours: "440", percentage: "6%", valueLost: "$2.1M" },
  { equipment: "Tertiary Crusher", lpoHours: "290", percentage: "4%", valueLost: "$1.4M" },
  { equipment: "Other Equipment", lpoHours: "140", percentage: "2%", valueLost: "$0.7M" },
];

export const notifications = [
  {
    id: 1,
    severity: "critical",
    title: "Primary Crusher - Efficiency Drop",
    description: "LPO Agent identified crusher efficiency degradation. Estimated 45% LPO impact with potential production loss.",
    timestamp: "2025-01-15 14:32:28 (AWST)",
  },
  {
    id: 2,
    severity: "critical",
    title: "Primary Crusher - Liner Wear",
    description: "Maintenance Agent: Liner thickness at 65% (critical threshold). Last replaced May 2024 - exceeded 6-month design lifecycle by 2 months.",
    timestamp: "2025-01-14 09:15:33 (AWST)",
  },
  {
    id: 3,
    severity: "warning",
    title: "ROM Bin - Feed Rate Alert",
    description: "Feed rate exceeding design capacity during peak hours. Consider adjusting ROM feed strategy.",
    timestamp: "2025-01-13 16:45:12 (AWST)",
  },
  {
    id: 4,
    severity: "warning",
    title: "Secondary Crusher - Vibration",
    description: "Elevated vibration levels detected. Frame vibration within acceptable range.",
    timestamp: "2025-01-12 11:22:47 (AWST)",
  },
  {
    id: 5,
    severity: "info",
    title: "Haul Truck Fleet - Maintenance Due",
    description: "Scheduled maintenance due for Truck #7 and #12 within next 48 hours.",
    timestamp: "2025-01-11 08:30:00 (AWST)",
  },
];

export const maintenanceHistory = {
  lastLinerReplacement: "May 15, 2024",
  monthsSinceReplacement: 8,
  expectedLifecycle: 6,
  lifecycleExceeded: "133%",
  inspectionReports: [
    { date: "Nov 30, 2024", finding: "Liner thickness at 65% (critical)" },
    { date: "Oct 18, 2024", finding: "Excessive vibration noted (+120%)" },
  ],
};

export const inventoryData = {
  partsAvailable: true,
  parts: [
    { name: "Crusher Jaw Liner", partNumber: "CJ-8845", available: 4, warehouse: "Warehouse 2", leadTime: 0 },
    { name: "ASTM A193 B7 Bolts", partNumber: "BLT-1872", available: 85, required: 72, warehouse: "Warehouse 1", leadTime: 0 },
    { name: "Lubricating Oil (SAE 90)", partNumber: "OIL-SAE90", available: "12L", warehouse: "Warehouse 2", leadTime: 0 },
  ],
};

export const crewData = {
  leadTechnician: {
    name: "James Morrison",
    certification: "Crusher Mechanical Specialist (Level 2)",
    experience: 8,
    skillMatch: 95,
    availability: "Available (Day 1, 07:00-19:00)",
  },
  supportCrew: [
    { role: "Fitter", quantity: 2, available: true },
    { role: "Electrician", quantity: 1, available: true },
  ],
  equipment: [
    { name: "Overhead Crane (20-ton)", location: "Bay 3", reserved: true },
    { name: "Welding Machine", reserved: true },
    { name: "Torque Wrench Set", available: true },
  ],
};

export const rcaResults = [
  { rank: 1, cause: "Liner wear degradation", likelihood: 85, reason: "8 months since replacement (6mo design lifecycle), Zone B at 85% degradation" },
  { rank: 2, cause: "Hard ore feed composition", likelihood: 75, reason: "Pit 3 Zone B harder ore, Bond Index +15%" },
  { rank: 3, cause: "Pitman bearing degradation", likelihood: 60, reason: "NDE Temp 108°C (>85°C), DE Vib 55mm/s (>25mm/s)" },
  { rank: 4, cause: "Drive motor overload", likelihood: 40, reason: "Phase currents 98-120A (threshold: 100A)" },
];

export const productionImpact = {
  currentThroughputLoss: 7.55,
  dailyRevenueLoss: 72000,
  cumulativeLoss30Day: 2160000,
  failureRisk7Days: 34,
  failureRisk14Days: 61,
  optimalWindow: "Next 48 hours during planned slowdown",
  estimatedDowntime: 8,
  repairCost: 12500,
  annualValueRecovery: 15200000,
  roi: 1216,
};

export const actionRecommendations = {
  immediate: [
    { action: "Replace crusher jaw liner", detail: "P/N: CJ-8845, 8-hour estimated job" },
    { action: "Inspect eccentric bearings", detail: "During liner replacement downtime" },
    { action: "Recalibrate crushing chamber", detail: "Post-replacement optimization" },
  ],
  nearTerm: [
    { action: "Adjust ROM feed strategy", detail: "Reduce oversized ore (target: <15%)" },
    { action: "Coordinate with blasting team", detail: "Improve fragmentation specifications" },
    { action: "Implement real-time feed monitoring", detail: "Sensor-based optimization" },
  ],
  longTerm: [
    { action: "Install vibration and wear sensors", detail: "Condition-based monitoring" },
    { action: "6-month proactive liner replacement", detail: "Align with design lifecycle" },
    { action: "Update maintenance deferral policy", detail: "Prevent production-driven delays" },
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


