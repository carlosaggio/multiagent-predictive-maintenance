// Detailed tool call sequences for each agent to demonstrate multi-agent collaboration

export const agentToolCalls = {
  rd: [
    { 
      type: "thinking", 
      text: "Initializing root cause diagnostics...", 
      duration: 1500 
    },
    { 
      type: "vector_search", 
      text: "Searching maintenance database...",
      query: "primary crusher liner wear efficiency degradation",
      results: "Searching 3,240 historical maintenance records -> Found 12 relevant documents (avg similarity: 0.89)",
      duration: 2500 
    },
    { 
      type: "tool", 
      name: "sap_pm_query", 
      params: { 
        equipment_id: "CRUSHER_001", 
        record_type: "maintenance_history",
        time_range: "last_18_months" 
      }, 
      duration: 2000 
    },
    { 
      type: "tool_result", 
      data: "SAP PM Connection: SUCCESS -> Retrieved 24 maintenance records -> Last liner replacement: May 15, 2024 (8 months ago)", 
      duration: 1000 
    },
    { 
      type: "tool", 
      name: "retrieve_manual", 
      params: { 
        query: "crusher liner maintenance SOP",
        manual_type: "OEM_procedures" 
      }, 
      duration: 1500 
    },
    { 
      type: "tool_result", 
      data: "Retrieved 3 OEM procedure documents -> Expected liner lifecycle: 6 months (Currently EXCEEDED by 133%)", 
      duration: 900 
    },
    { 
      type: "thinking", 
      text: "Correlating efficiency degradation patterns with maintenance lifecycle...", 
      duration: 2500 
    },
    { 
      type: "analysis", 
      text: "ROOT CAUSE IDENTIFIED: Liner wear degradation (Correlation: 0.92, Confidence: 87%)", 
      duration: 1200 
    },
    { 
      type: "memory", 
      text: "Writing to shared context -> Collection: agent_shared_memory -> Document ID: rd_analysis_20250115_143245 -> Fields: {root_cause, confidence, evidence, next_agent}", 
      duration: 1000 
    },
  ],
  
  ta: [
    { 
      type: "retrieve", 
      text: "Accessing findings from RD Agent...", 
      duration: 1000 
    },
    { 
      type: "tool_result", 
      data: "Retrieved root cause hypothesis: Liner wear", 
      duration: 600 
    },
    { 
      type: "thinking", 
      text: "Analyzing timeseries data for Primary Crusher...", 
      duration: 1800 
    },
    { 
      type: "tool", 
      name: "query_timeseries", 
      params: { equipment: "primary_crusher", days: 30 }, 
      duration: 2000 
    },
    { 
      type: "tool_result", 
      data: "Retrieved 720 data points across 30 days", 
      duration: 800 
    },
    { 
      type: "thinking", 
      text: "Identifying anomaly patterns...", 
      duration: 2000 
    },
    { 
      type: "analysis", 
      text: "Anomaly detected at day 15 - sudden 3% efficiency drop", 
      duration: 1200 
    },
    { 
      type: "memory", 
      text: "Updating shared context with timeseries findings", 
      duration: 800 
    },
  ],
  
  mi: [
    { 
      type: "retrieve", 
      text: "Accessing shared context from RD and TA agents...",
      duration: 1200 
    },
    { 
      type: "tool_result", 
      data: "Retrieved -> RD hypothesis: Liner wear (87%) -> TA validation: Confirmed via timeseries (92%)", 
      duration: 700 
    },
    { 
      type: "thinking", 
      text: "Connecting to SAP PM system for detailed maintenance intelligence...", 
      duration: 1500 
    },
    { 
      type: "tool", 
      name: "sap_pm_detailed_query", 
      params: { 
        system: "SAP_PM_PROD",
        equipment_id: "CRUSHER_001", 
        query_type: ["maintenance_history", "inspection_reports", "PM_schedule"],
        months: 6 
      }, 
      duration: 2200 
    },
    { 
      type: "tool_result", 
      data: "SAP PM Query Results -> Maintenance records: 24 entries -> Last liner: May 15, 2024 (8 months) -> Next PM due: Nov 15, 2024 (OVERDUE) -> Lifecycle exceeded 133%", 
      duration: 1000 
    },
    { 
      type: "vector_search", 
      text: "Searching inspection reports database...",
      query: "primary crusher liner thickness inspection 2024",
      results: "Searching inspection_reports collection -> Found 2 relevant reports (similarity: 0.91, 0.88)",
      duration: 2000 
    },
    { 
      type: "tool_result", 
      data: "Inspection 1: 12/11/2024 - Excessive vibration noted -> Inspection 2: 18/10/2024 - Liner thickness at 65% (WARNING threshold)", 
      duration: 900 
    },
    { 
      type: "thinking", 
      text: "Cross-referencing inspection data with lifecycle expectations and deferral patterns...", 
      duration: 1800 
    },
    { 
      type: "analysis", 
      text: "CRITICAL FINDING: Liner lifecycle exceeded (Expected: 6mo, Actual: 8mo, Overage: +133%) -> Immediate replacement required", 
      duration: 1300 
    },
    { 
      type: "memory", 
      text: "Updating shared context -> Key: mi_maintenance_intel -> Fields: {lifecycle_exceeded, deferral_count, inspection_findings} -> Available to: IL, LD, Huddle agents", 
      duration: 900 
    },
  ],
  
  il: [
    { 
      type: "thinking", 
      text: "Checking inventory across warehouses...", 
      duration: 1200 
    },
    { 
      type: "tool", 
      name: "query_inventory", 
      params: { part_number: "CJ-8845" }, 
      duration: 1500 
    },
    { 
      type: "tool_result", 
      data: "Crusher Jaw Liner (CJ-8845): 4 units available, Warehouse 2", 
      duration: 700 
    },
    { 
      type: "tool", 
      name: "query_inventory", 
      params: { part_number: "BLT-1872" }, 
      duration: 1200 
    },
    { 
      type: "tool_result", 
      data: "ASTM A193 B7 Bolts: 85 units available (72 required)", 
      duration: 700 
    },
    { 
      type: "thinking", 
      text: "Verifying lead times and availability...", 
      duration: 1500 
    },
    { 
      type: "analysis", 
      text: "ALL PARTS IN STOCK - Zero lead time", 
      duration: 1000 
    },
    { 
      type: "tool", 
      name: "reserve_parts", 
      params: { hold_duration: "48h" }, 
      duration: 1200 
    },
    { 
      type: "tool_result", 
      data: "Parts reserved successfully (48-hour hold)", 
      duration: 600 
    },
  ],
  
  ld: [
    { 
      type: "retrieve", 
      text: "Accessing liner wear data from RD Agent findings...", 
      duration: 1000 
    },
    { 
      type: "thinking", 
      text: "Analyzing wear patterns and thickness measurements...", 
      duration: 1800 
    },
    { 
      type: "tool", 
      name: "analyze_wear_pattern", 
      params: { component: "jaw_liner" }, 
      duration: 2000 
    },
    { 
      type: "tool_result", 
      data: "Wear pattern: Uneven - 65% thickness remaining, heavier on feed side", 
      duration: 800 
    },
    { 
      type: "thinking", 
      text: "Calculating remaining operational life...", 
      duration: 1500 
    },
    { 
      type: "analysis", 
      text: "Estimated remaining life: 5-7 days under current load", 
      duration: 1200 
    },
    { 
      type: "memory", 
      text: "Storing liner diagnostics in shared context", 
      duration: 700 
    },
  ],
};

// Huddle agent tool calls (for the trusted huddle phase)
export const huddleToolCalls = {
  ro: [
    { type: "thinking", text: "Analyzing crew availability and skill requirements...", duration: 1500 },
    { type: "tool", name: "query_staff_database", params: { certification: "Crusher Specialist L2" }, duration: 1800 },
    { type: "tool_result", data: "Found James Morrison (95% skill match, 8 similar jobs completed)", duration: 800 },
    { type: "tool", name: "reserve_equipment", params: { equipment: ["crane_20ton", "welding_machine"] }, duration: 1200 },
    { type: "tool_result", data: "Equipment reserved: Bay 3 crane, welding machine, torque wrench set", duration: 700 },
    { type: "memory", text: "Storing crew assignment in shared memory", duration: 600 },
  ],
  
  po: [
    { type: "retrieve", text: "Accessing production schedule and RO findings...", duration: 1000 },
    { type: "thinking", text: "Calculating optimal intervention timing...", duration: 1800 },
    { type: "tool", name: "analyze_production_schedule", params: { window_hours: 48 }, duration: 2000 },
    { type: "tool_result", data: "Optimal window identified: Next 48 hours during planned slowdown", duration: 800 },
    { type: "thinking", text: "Assessing production impact scenarios...", duration: 1500 },
    { type: "analysis", text: "Secondary crusher can absorb 60% of load - minimal impact (4% vs 7.55%)", duration: 1200 },
    { type: "memory", text: "Storing optimal window in shared context", duration: 600 },
  ],
  
  ma: [
    { type: "retrieve", text: "Accessing MI Agent maintenance intelligence...", duration: 1000 },
    { type: "thinking", text: "Cross-referencing with maintenance procedures...", duration: 1500 },
    { type: "analysis", text: "Confirms liner replacement required - 8 hour estimated duration", duration: 1200 },
    { type: "tool", name: "check_additional_maintenance", params: { component: "eccentric_bearing" }, duration: 1800 },
    { type: "tool_result", data: "Recommendation: Inspect eccentric bearings during liner downtime", duration: 700 },
  ],
  
  sc: [
    { type: "retrieve", text: "Accessing RO crew assignment and PO optimal window...", duration: 1000 },
    { type: "thinking", text: "Coordinating with production schedule...", duration: 1500 },
    { type: "tool", name: "schedule_maintenance", params: { start_time: "07:00", date: "tomorrow" }, duration: 1800 },
    { type: "tool_result", data: "Best slot identified: Day shift starting 07:00", duration: 700 },
    { type: "tool", name: "notify_production_team", params: { notification: "maintenance_window" }, duration: 1200 },
    { type: "tool_result", data: "Production team notified of maintenance window", duration: 600 },
  ],
  
  ra: [
    { type: "retrieve", text: "Accessing all agent findings for risk assessment...", duration: 1200 },
    { type: "thinking", text: "Calculating failure probability scenarios...", duration: 2000 },
    { type: "tool", name: "calculate_failure_risk", params: { deferral_days: [7, 14] }, duration: 2000 },
    { type: "tool_result", data: "If deferred 7 days: 34% failure risk | 14 days: 61% failure risk", duration: 900 },
    { type: "analysis", text: "RECOMMENDATION: IMMEDIATE ACTION - Risk increases exponentially", duration: 1200 },
    { type: "memory", text: "Finalizing risk assessment in shared context", duration: 700 },
  ],
};

// Agent handoff messages
export const agentHandoffs = [
  { from: "rd", to: "ta", message: "RD Agent completed. Sharing context with TA Agent..." },
  { from: "ta", to: "mi", message: "TA Agent completed. Passing timeseries findings to MI Agent..." },
  { from: "mi", to: "il", message: "MI Agent completed. Transferring maintenance intel to IL Agent..." },
  { from: "il", to: "ld", message: "IL Agent completed. Passing inventory status to LD Agent..." },
  { from: "ld", to: "huddle", message: "Primary analysis complete. Initiating Trusted Huddle..." },
];

