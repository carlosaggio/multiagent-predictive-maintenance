import { getCurrentMROScenarioVariant } from './mroScenarioVariants';

export const mroWorkflowQuestions = {
  mro_q1: {
    id: 'mro_q1',
    get text() { return getCurrentMROScenarioVariant().q1Text; },
    options: [
      { id: 'yes', label: 'Yes, activate operations intelligence' },
      { id: 'no', label: 'No, show status only' }
    ],
    nextOnYes: 'mro_q2',
    nextOnNo: null,
    triggersOutput: 'mro_agent_network',
  },
  mro_q2: {
    id: 'mro_q2',
    text: "Agent network activated. 7 specialised agents are online. Run initial triage across all affected systems — hangars, component pools, repair shops, and outstations?",
    options: [
      { id: 'yes', label: 'Yes, run full triage' },
      { id: 'detailed', label: 'Yes, with AIP Agent summary first' }
    ],
    nextOnYes: 'mro_q3',
    nextOnDetailed: 'mro_q3',
    triggersOutput: 'mro_control_tower',
  },
  mro_q3: {
    id: 'mro_q3',
    get text() {
      const v = getCurrentMROScenarioVariant();
      return `Operations Control Tower loaded. ${v.redPartsCount > 0 ? v.redPartsCount + ' red parts detected.' : ''} ${v.mbhExceptions > 0 ? v.mbhExceptions + ' MBH exceptions flagged.' : ''} Pool coverage at ${v.poolCoverage}%. The AIP Agent has summarised overnight changes. Proceed to alert triage?`;
    },
    options: [
      { id: 'yes', label: 'Proceed to alert triage' },
      { id: 'ask', label: 'Ask the AIP Agent a question first' }
    ],
    nextOnYes: 'mro_q4',
    nextOnAsk: 'mro_q4',
    triggersOutput: 'mro_aip_agent',
  },
  mro_q4: {
    id: 'mro_q4',
    get text() {
      const v = getCurrentMROScenarioVariant();
      return `Alert workbench loaded with 5 active alerts. The highest-severity alert targets ${v.workPackage} at ${v.hangarSite}. Select an alert to investigate in detail.`;
    },
    options: [
      { id: 'alert_primary', label: 'Investigate primary alert (Critical)' },
      { id: 'alert_secondary', label: 'Investigate secondary alert (High)' },
      { id: 'bulk_triage', label: 'Bulk-triage all open alerts' }
    ],
    isAlertSelection: true,
    nextOnSelect: 'mro_q5',
    triggersOutput: 'mro_alert_triage',
  },
  mro_q5: {
    id: 'mro_q5',
    get text() {
      const v = getCurrentMROScenarioVariant();
      return `Investigation complete for ${v.workPackage}. Root cause analysis shows ${v.redPartsCount > 0 ? 'vendor delay cascading through the supply chain' : v.mbhExceptions > 0 ? 'unreported utilisation changes affecting accrual model' : 'repair TAT slippage at component shop'}. The system has generated what-if scenarios with ${v.redPartsCount > 0 ? '4' : '3'} resolution options. Run simulation?`;
    },
    options: [
      { id: 'yes', label: 'Yes, simulate resolution options' },
      { id: 'explore', label: 'Explore causal graph first' }
    ],
    nextOnYes: 'mro_q6',
    nextOnExplore: 'mro_q6',
    triggersOutput: 'mro_alert_detail',
  },
  mro_q6: {
    id: 'mro_q6',
    text: "Scenario simulation complete. The system recommends Option B (best cost-to-risk ratio). Review all options and select a resolution strategy.",
    options: [
      { id: 'option_a', label: 'Option A: Expedite PO' },
      { id: 'option_b', label: 'Option B: Transfer + Reprioritise (Recommended)' },
      { id: 'option_c', label: 'Option C: Alternate Part Substitution' },
      { id: 'option_d', label: 'Option D: Combined Strategy' }
    ],
    isPlanSelection: true,
    nextOnSelect: 'mro_q7',
    triggersOutput: 'mro_scenario_builder',
  },
  mro_q7: {
    id: 'mro_q7',
    text: "Action pack built from selected strategy. 3 actions generated: 1 auto-approved (below threshold), 1 requiring Ops Lead approval, 1 parameter update (auto). SAP write-back preview ready. Submit for approval?",
    options: [
      { id: 'yes', label: 'Submit action pack for approval' },
      { id: 'modify', label: 'Modify actions first' }
    ],
    nextOnYes: 'mro_q8',
    nextOnModify: 'mro_q7',
    triggersOutput: 'mro_action_pack',
  },
  mro_q8: {
    id: 'mro_q8',
    text: "Action pack approved and executed. SAP transactions created successfully. Audit trail recorded. Would you like to switch to MBH Revenue Assurance view or review automation options?",
    options: [
      { id: 'mbh', label: 'Switch to MBH Revenue Assurance' },
      { id: 'automation', label: 'Review automation library' },
      { id: 'complete', label: 'Cycle complete — view summary' }
    ],
    nextOnMbh: 'mro_q9',
    nextOnAutomation: 'mro_q10',
    nextOnComplete: null,
    triggersOutput: 'mro_approval',
    triggersApprovalOnYes: true,
  },
  mro_q9: {
    id: 'mro_q9',
    get text() {
      const v = getCurrentMROScenarioVariant();
      return `MBH Revenue Assurance dashboard loaded. ${v.mbhExceptions} exceptions detected across contracts. Flying hours accrual shows $240K variance on Contract Beta. Investigate and resolve the revenue exception?`;
    },
    options: [
      { id: 'yes', label: 'Investigate revenue exception' },
      { id: 'overview', label: 'View full contract portfolio first' }
    ],
    nextOnYes: 'mro_q10',
    nextOnOverview: 'mro_q10',
    triggersOutput: 'mro_mbh_dashboard',
  },
  mro_q10: {
    id: 'mro_q10',
    text: "Revenue exception investigated. Root causes identified: 2 unreported aircraft utilisation changes and 1 component swap not captured. Resolution actions ready — adjust accrual ($180K), create billing correction ($60K), update contract parameters. Execute billing correction?",
    options: [
      { id: 'yes', label: 'Execute billing corrections' },
      { id: 'review', label: 'Review with finance team first' }
    ],
    nextOnYes: 'mro_q11',
    nextOnReview: 'mro_q11',
    triggersOutput: 'mro_mbh_resolve',
  },
  mro_q11: {
    id: 'mro_q11',
    text: "Billing corrections executed and audit trail recorded. Would you like to review the automation library to set up recurring monitors for these patterns?",
    options: [
      { id: 'yes', label: 'Review automation library' },
      { id: 'finalize', label: 'Finalize and close cycle' }
    ],
    nextOnYes: 'mro_q12',
    nextOnFinalize: null,
    triggersOutput: 'mro_automation',
  },
  mro_q12: {
    id: 'mro_q12',
    text: "Automation library loaded. 3 automation rules available: Auto-Expedite Critical Spares, Pool Rebalancing Alert, and MBH Accrual Variance Monitor. You can enable, configure thresholds, and simulate runs. Finalize session?",
    options: [
      { id: 'finalize', label: 'Finalize — all actions complete' },
      { id: 'simulate', label: 'Simulate an automation run first' }
    ],
    isFinal: true,
    triggersOutput: 'mro_automation_detail',
  },
};

export const mroStageConfig = {
  mro_agent_network: { id: 'mro_agent_network', title: 'MRO Agent Network', subtitle: 'Specialised operations intelligence agents activating...' },
  mro_control_tower: { id: 'mro_control_tower', title: 'Operations Control Tower', subtitle: 'Global view of hangars, component shops, and outstations' },
  mro_aip_agent: { id: 'mro_aip_agent', title: 'AIP Agent', subtitle: 'AI-powered operational change summary' },
  mro_alert_triage: { id: 'mro_alert_triage', title: 'Alerts Workbench', subtitle: 'Triage and prioritise operational alerts' },
  mro_alert_detail: { id: 'mro_alert_detail', title: 'Alert Investigation', subtitle: 'Root cause analysis with causal graph' },
  mro_scenario_builder: { id: 'mro_scenario_builder', title: 'Scenario Builder', subtitle: 'What-if simulation with resolution options' },
  mro_action_pack: { id: 'mro_action_pack', title: 'Action Pack', subtitle: 'Execute resolution with approvals and SAP write-back' },
  mro_approval: { id: 'mro_approval', title: 'Approval Queue', subtitle: 'Review and approve high-impact actions' },
  mro_mbh_dashboard: { id: 'mro_mbh_dashboard', title: 'MBH Revenue Assurance', subtitle: 'Flying hours, accruals, exceptions, billing readiness' },
  mro_mbh_resolve: { id: 'mro_mbh_resolve', title: 'Revenue Resolution', subtitle: 'Investigate and resolve billing exceptions' },
  mro_automation: { id: 'mro_automation', title: 'Automation Library', subtitle: 'Configure and monitor automated workflows' },
  mro_automation_detail: { id: 'mro_automation_detail', title: 'Automation Detail', subtitle: 'Simulation and threshold configuration' },
};

export default mroWorkflowQuestions;
