/**
 * WAIO Workflow Questions
 * 
 * Guided Q&A workflow for the WAIO Pit-to-Port Shift Optimiser demo.
 * Includes scenario variations for dynamic demo experiences.
 */

// ============================================================================
// SCENARIO VARIANTS - Rotate for different demo experiences
// ============================================================================

export const waioScenarioVariants = [
  {
    id: 'variant_a',
    name: 'Grade Under-Spec (Train-07)',
    q1Text: "I detected a risk that Train-07 will load under-spec within the next 6 hours. Fe is forecast at 61.2% against a spec of ≥62.0%, with a 62% probability of non-compliance. Do you want me to run an end-to-end diagnosis and propose an optimised shift plan?",
    trainId: 'Train-07',
    feGrade: 61.2,
    riskProbability: 62,
    riskType: 'grade',
    vessel: 'MV Coral Bay',
    pitSource: 'Pit3 Zone B',
    reconciliationCompliance: 78,
  },
  {
    id: 'variant_b',
    name: 'Silica Over-Spec (Train-04)',
    q1Text: "I detected a silica contamination risk on Train-04 loading in the next 4 hours. SiO2 is forecast at 4.8% against a spec of ≤4.5%, with a 71% probability of exceeding limit. Should I run a diagnosis and propose a corrective blend?",
    trainId: 'Train-04',
    feGrade: 62.3,
    sio2Grade: 4.8,
    riskProbability: 71,
    riskType: 'silica',
    vessel: 'MV Iron Duke',
    pitSource: 'Pit2 Zone A',
    reconciliationCompliance: 82,
  },
  {
    id: 'variant_c',
    name: 'Throughput Shortfall (Train-09)',
    q1Text: "I'm forecasting a throughput shortfall — Train-09 and Train-10 may miss their loading window due to reclaimer constraints. Current rate: 5,800 t/h vs target 6,500 t/h. Want me to optimise the loading sequence and propose recovery actions?",
    trainId: 'Train-09',
    feGrade: 62.1,
    riskProbability: 58,
    riskType: 'throughput',
    vessel: 'MV Pacific Star',
    pitSource: 'Pit1 Zone C',
    reconciliationCompliance: 85,
  },
  {
    id: 'variant_d',
    name: 'Multiple Constraints (Train-02)',
    q1Text: "Multiple risks detected for Train-02: Fe forecast at 61.5% (below spec), plus a truck allocation gap at Pit2. Combined probability of deviation: 74%. Recommend running full constraint analysis?",
    trainId: 'Train-02',
    feGrade: 61.5,
    riskProbability: 74,
    riskType: 'multiple',
    vessel: 'MV Cape Glory',
    pitSource: 'Pit2 Zone B',
    reconciliationCompliance: 76,
  },
];

// Get current scenario variant (rotates based on session or can be set manually)
let currentVariantIndex = 0;

export function getCurrentScenarioVariant() {
  return waioScenarioVariants[currentVariantIndex];
}

export function rotateScenarioVariant() {
  currentVariantIndex = (currentVariantIndex + 1) % waioScenarioVariants.length;
  return waioScenarioVariants[currentVariantIndex];
}

export function setScenarioVariant(index) {
  if (index >= 0 && index < waioScenarioVariants.length) {
    currentVariantIndex = index;
  }
  return waioScenarioVariants[currentVariantIndex];
}

export function getRandomScenarioVariant() {
  currentVariantIndex = Math.floor(Math.random() * waioScenarioVariants.length);
  return waioScenarioVariants[currentVariantIndex];
}

// Set scenario variant by ID (e.g., 'variant_a', 'variant_b', etc.)
export function setScenarioVariantById(variantId) {
  const index = waioScenarioVariants.findIndex(v => v.id === variantId);
  if (index >= 0) {
    currentVariantIndex = index;
    return waioScenarioVariants[currentVariantIndex];
  }
  // If not found, return current variant without changing
  return waioScenarioVariants[currentVariantIndex];
}

// ============================================================================
// WORKFLOW QUESTIONS (with dynamic text based on current variant)
// ============================================================================

export const waioWorkflowQuestions = {
  waio_q1: {
    id: 'waio_q1',
    // Use getter to allow dynamic text based on current scenario variant
    get text() {
      return getCurrentScenarioVariant().q1Text;
    },
    options: [
      { id: 'yes', label: 'Yes, run diagnosis' },
      { id: 'no', label: 'No, just show status' }
    ],
    nextOnYes: 'waio_q2',
    nextOnNo: null,
    triggersOutput: 'waio_agent_network',
  },
  
  waio_q2: {
    id: 'waio_q2',
    text: "Do you want to see where the grade deviation is being introduced across the value chain (pit → stockpile → train → port)?",
    options: [
      { id: 'yes', label: 'Yes, trace deviation' },
      { id: 'no', label: 'No, skip to planning' }
    ],
    nextOnYes: 'waio_q3',
    nextOnNo: 'waio_q3',
    triggersOutput: 'waio_deviation_trace',
  },
  
  waio_q3: {
    id: 'waio_q3',
    text: "Choose what to optimise for this shift. This will guide the constraint-clearing engine and plan generation.",
    options: [
      { id: 'value', label: 'Maximise value (avoid under-spec)', description: 'Prioritise grade compliance to minimise penalty exposure' },
      { id: 'tonnes', label: 'Maximise tonnes (throughput first)', description: 'Prioritise volume to meet tonnage targets' },
      { id: 'balanced', label: 'Balanced (value + tonnes)', description: 'Optimise for both grade and throughput equally' },
      { id: 'stability', label: 'Stability (minimise changes)', description: 'Minimise disruption to current operations' }
    ],
    isObjectiveSelection: true,
    nextOnSelect: 'waio_q4',
    triggersOutput: null, // No output until q4
  },
  
  waio_q4: {
    id: 'waio_q4',
    text: "I'll now run the parallel constraint-clearing engine across all value chain lanes (Grade, Stockpile, Fleet, Mine Plan, Logistics, Commercial) to generate optimised plan options. Proceed?",
    options: [
      { id: 'yes', label: 'Yes, run parallel huddle' },
      { id: 'no', label: 'No' }
    ],
    nextOnYes: 'waio_q5',
    nextOnNo: null,
    triggersOutput: 'waio_parallel_huddle',
  },
  
  waio_q5: {
    id: 'waio_q5',
    text: "Here are 3 feasible shift plans with different trade-offs. Which option should we implement?",
    options: [
      { id: 'plan_a', label: 'Option A: Compliance First', description: 'Maximise grade compliance; accept reduced throughput' },
      { id: 'plan_b', label: 'Option B: Balanced', description: 'Balance value optimisation with throughput targets' },
      { id: 'plan_c', label: 'Option C: Tonnes First', description: 'Maximise throughput; accept higher grade risk' }
    ],
    isPlanSelection: true,
    nextOnSelect: 'waio_q6',
    triggersOutput: 'waio_plan_options',
  },
  
  waio_q6: {
    id: 'waio_q6',
    text: "Ready to publish the selected shift plan. This will update dispatch, generate a shift brief, and create an action checklist for supervisors. Proceed?",
    options: [
      { id: 'yes', label: 'Yes, publish plan' },
      { id: 'no', label: 'No, review again' }
    ],
    nextOnYes: 'waio_q7',
    nextOnNo: 'waio_q5',
    triggersOutput: 'waio_shift_plan',
    triggersPublishOnYes: true,
  },
  
  waio_q7: {
    id: 'waio_q7',
    text: "Plan published successfully. Would you like me to monitor execution and auto-replan if disruptions occur (e.g., equipment breakdown, grade updates)?",
    options: [
      { id: 'yes', label: 'Yes, enable continuous monitoring' },
      { id: 'no', label: 'No, manual monitoring only' }
    ],
    nextOnYes: 'waio_q8',
    nextOnNo: 'waio_q8',
    triggersOutput: 'waio_publish',
    triggersMonitorOnYes: true,
  },
  
  // ============================================================================
  // CLOSED-LOOP MINE PLANNING QUESTIONS (Q8-Q10)
  // ============================================================================
  
  waio_q8: {
    id: 'waio_q8',
    get text() {
      const variant = getCurrentScenarioVariant();
      return `End of shift (18:00). Plan compliance was ${variant.reconciliationCompliance}% — ${variant.reconciliationCompliance < 80 ? 'below target' : 'near target'}. ${variant.trainId} met spec after intervention, but throughput was impacted. Want me to reconcile plan vs actual and identify repeat deviation patterns?`;
    },
    options: [
      { id: 'yes', label: 'Yes, run reconciliation' },
      { id: 'no', label: 'No, skip reconciliation' }
    ],
    nextOnYes: 'waio_q9',
    nextOnNo: null,
    triggersOutput: 'waio_reconciliation',
  },
  
  waio_q9: {
    id: 'waio_q9',
    get text() {
      const variant = getCurrentScenarioVariant();
      return `I found recurring drivers of grade drift and compliance loss — ${variant.pitSource} uncertainty appeared in 3 of last 5 shifts. Should I retrofit the 7-day plan to reduce grade volatility and cascade changes to 30/90 day plans?`;
    },
    options: [
      { id: 'yes', label: 'Yes, retrofit 7/30/90 day plans' },
      { id: 'no', label: 'No, keep current plans' }
    ],
    nextOnYes: 'waio_q10',
    nextOnNo: null,
    triggersOutput: 'waio_mine_plan_retrofit',
  },
  
  waio_q10: {
    id: 'waio_q10',
    text: "Plan change set ready. This will update Deswik schedules, Vulcan block model factors, and sync to dispatch/SCADA/tracking systems. Publish the approved changes?",
    options: [
      { id: 'yes', label: 'Yes, publish to all systems' },
      { id: 'no', label: 'No, save for review' }
    ],
    nextOnYes: 'waio_complete',
    nextOnNo: 'waio_complete',
    triggersOutput: 'waio_publish_to_systems',
    triggersPublishOnYes: true,
  },
  
  waio_complete: {
    id: 'waio_complete',
    text: "Closed-loop planning cycle complete. All plan changes have been published to downstream systems. The 7-day plan has been updated with learnings from this shift — AI will now prevent similar deviations in future shifts. You can ask me any questions about the scenario.",
    options: [],
    isFinal: true,
    isComplete: true,
  },
};

// Stage mapping for output console
export const waioStageConfig = {
  waio_agent_network: {
    id: 'waio_agent_network',
    title: 'WAIO Agent Network',
    subtitle: 'Parallel constraint-clearing engine: Grade, Stockpile, Fleet, Mine Plan, Logistics, Commercial',
  },
  waio_deviation_trace: {
    id: 'waio_deviation_trace',
    title: 'End-to-End Deviation Trace',
    subtitle: 'Identifying where grade deviation is introduced across the value chain',
  },
  waio_parallel_huddle: {
    id: 'waio_parallel_huddle',
    title: 'Parallel Constraint-Clearing Engine',
    subtitle: 'Running 6 lanes simultaneously to clear constraints and generate plan options',
  },
  waio_plan_options: {
    id: 'waio_plan_options',
    title: 'Shift Plan Options',
    subtitle: 'Three feasible plans with different trade-offs',
  },
  waio_shift_plan: {
    id: 'waio_shift_plan',
    title: 'Selected Shift Plan',
    subtitle: '12-hour operational plan with assignments and blend recipes',
  },
  waio_publish: {
    id: 'waio_publish',
    title: 'Plan Published',
    subtitle: 'Shift brief generated and dispatch updated',
  },
  waio_monitor: {
    id: 'waio_monitor',
    title: 'Continuous Monitoring',
    subtitle: 'Real-time plan vs actual tracking with auto-replan',
  },
  
  // Closed-loop stages (new)
  waio_reconciliation: {
    id: 'waio_reconciliation',
    title: 'Shift Reconciliation',
    subtitle: 'Plan vs actual analysis and deviation pattern identification',
  },
  waio_mine_plan_retrofit: {
    id: 'waio_mine_plan_retrofit',
    title: 'Mine Plan Retrofit',
    subtitle: '7/30/90-day plan adjustments based on shift learnings',
  },
  waio_publish_to_systems: {
    id: 'waio_publish_to_systems',
    title: 'Publish to Planning Systems',
    subtitle: 'Closing the loop: Deswik, Vulcan, Dispatch, and downstream systems',
  },
};

// Objective weights mapping
export const waioObjectiveWeights = {
  value: { value: 0.60, tonnes: 0.15, compliance: 0.20, risk: 0.05 },
  tonnes: { value: 0.15, tonnes: 0.60, compliance: 0.15, risk: 0.10 },
  balanced: { value: 0.35, tonnes: 0.30, compliance: 0.25, risk: 0.10 },
  stability: { value: 0.20, tonnes: 0.20, compliance: 0.20, risk: 0.40 },
};

export default waioWorkflowQuestions;
