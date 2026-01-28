/**
 * WAIO Workflow Questions
 * 
 * Guided Q&A workflow for the WAIO Pit-to-Port Shift Optimiser demo.
 */

export const waioWorkflowQuestions = {
  waio_q1: {
    id: 'waio_q1',
    text: "I detected a risk that Train-07 will load under-spec within the next 6 hours. Fe is forecast at 61.2% against a spec of ≥62.0%, with a 62% probability of non-compliance. Do you want me to run an end-to-end diagnosis and propose an optimised shift plan?",
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
    isFinal: true,
    triggersOutput: 'waio_publish',
    triggersMonitorOnYes: true,
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
};

// Objective weights mapping
export const waioObjectiveWeights = {
  value: { value: 0.60, tonnes: 0.15, compliance: 0.20, risk: 0.05 },
  tonnes: { value: 0.15, tonnes: 0.60, compliance: 0.15, risk: 0.10 },
  balanced: { value: 0.35, tonnes: 0.30, compliance: 0.25, risk: 0.10 },
  stability: { value: 0.20, tonnes: 0.20, compliance: 0.20, risk: 0.40 },
};

export default waioWorkflowQuestions;
