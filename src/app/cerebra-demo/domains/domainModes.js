/**
 * Domain Mode Configuration
 * 
 * Defines the available domain modes for the Cerebra Demo.
 * Each mode has its own workflow, agents, data, and visualizations.
 */

// Domain mode constants
export const DOMAIN_MODE_IDS = {
  MAINTENANCE: 'maintenance',
  WAIO_SHIFT_OPTIMISER: 'waioShiftOptimiser',
  MRO_SUPPLY_CHAIN: 'mroSupplyChain',
};

// Domain mode configurations
export const DOMAIN_MODES = {
  [DOMAIN_MODE_IDS.MAINTENANCE]: {
    id: DOMAIN_MODE_IDS.MAINTENANCE,
    label: 'Maintenance',
    shortLabel: 'Maintenance',
    description: 'Predictive maintenance and equipment failure analysis',
    icon: 'wrench',
    headerTitle: 'Copper Mine Operations Center - Digital Twin',
    analysisTitle: 'Primary Crusher Efficiency Analysis',
    // Dynamic imports will be resolved at runtime
    imports: {
      workflowQuestions: () => import('../data/workflowQuestions'),
      scenarioContext: () => import('../data/scenarioContext'),
      notifications: () => import('../data/miningData'),
      processFlowData: () => import('../data/miningData'),
      agentConfig: () => import('../hooks/useDynamicAgents'),
    },
  },
  [DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER]: {
    id: DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER,
    label: 'Pit-to-Port',
    shortLabel: 'P2P',
    description: 'Pit-to-port shift planning and grade optimisation',
    icon: 'route',
    headerTitle: 'Pit-to-Port Command Center',
    analysisTitle: 'Shift Plan Optimisation',
    // Dynamic imports will be resolved at runtime
    imports: {
      workflowQuestions: () => import('../data/waio/waioWorkflowQuestions'),
      scenarioContext: () => import('../data/waio/waioScenarioContext'),
      notifications: () => import('../data/waio/waioNotifications'),
      processFlowData: () => import('../data/waio/waioProcessFlowData'),
      agentConfig: () => import('../data/waio/waioAgents'),
    },
  },
  [DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN]: {
    id: DOMAIN_MODE_IDS.MRO_SUPPLY_CHAIN,
    label: 'Aviation MRO & Supply Chain',
    shortLabel: 'MRO',
    description: 'MRO operations intelligence, supply chain, and MBH revenue assurance',
    icon: 'plane',
    headerTitle: 'Aviation MRO Operations Center',
    analysisTitle: 'MRO Operations Intelligence',
    // Dynamic imports will be resolved at runtime
    imports: {
      workflowQuestions: () => import('../data/mro/mroWorkflowQuestions'),
      scenarioContext: () => import('../data/mro/mroScenarioContext'),
      notifications: () => import('../data/mro/mroNotifications'),
      processFlowData: () => import('../data/mro/mroProcessFlowData'),
      agentConfig: () => import('../data/mro/mroAgentConfig'),
    },
  },
};

// Default domain mode
export const DEFAULT_DOMAIN_MODE = DOMAIN_MODE_IDS.MAINTENANCE;

// Helper function to get domain configuration
export const getDomainConfig = (modeId) => {
  return DOMAIN_MODES[modeId] || DOMAIN_MODES[DEFAULT_DOMAIN_MODE];
};

// Helper to check if a mode is valid
export const isValidDomainMode = (modeId) => {
  return Object.values(DOMAIN_MODE_IDS).includes(modeId);
};

export default DOMAIN_MODES;
