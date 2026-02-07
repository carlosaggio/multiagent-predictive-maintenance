import { getCurrentMROScenarioVariant } from './mroScenarioVariants';

export const mroScenarioContext = {
  get current() {
    return getCurrentMROScenarioVariant();
  },

  site: {
    name: 'MRO Operations Network',
    facilities: [
      { id: 'hangar_1', name: 'Hangar Site 1', type: 'hangar', bays: 3, location: 'Main Base', status: 'operational' },
      { id: 'hangar_2', name: 'Hangar Site 2', type: 'hangar', bays: 2, location: 'Secondary Base', status: 'operational' },
      { id: 'comp_shop', name: 'Component Shop', type: 'repair', capabilities: ['IDG', 'APU', 'LDG', 'Hydraulic', 'Pneumatic'], status: 'operational' },
      { id: 'warehouse', name: 'Central Parts Warehouse', type: 'warehouse', skuCount: 45000, status: 'operational' },
      { id: 'hub_east', name: 'Outstation Hub East', type: 'outstation', coverage: 'Regional', status: 'warning' },
      { id: 'hub_west', name: 'Outstation Hub West', type: 'outstation', coverage: 'Regional', status: 'operational' },
    ],
  },

  fleet: {
    totalAircraft: 48,
    operators: ['Operator Alpha', 'Operator Beta', 'Operator Gamma'],
    types: ['A320neo', 'A321neo', 'B737-800', 'B787-9'],
    activeChecks: 5,
    scheduledNext30Days: 8,
  },

  contracts: {
    mbhContracts: [
      { id: 'CONTRACT-ALPHA', operator: 'Operator Alpha', fleet: 'A320neo x 12', ratePerFH: 42, componentRate: 18, status: 'active' },
      { id: 'CONTRACT-BETA', operator: 'Operator Alpha', fleet: 'A320neo x 8', ratePerFH: 42, componentRate: 18, status: 'exception' },
      { id: 'CONTRACT-GAMMA', operator: 'Operator Beta', fleet: 'B737-800 x 15', ratePerFH: 38, componentRate: 15, status: 'active' },
    ],
  },

  kpis: {
    onTimeInduction: 0.91,
    onTimeRedelivery: 0.84,
    criticalPartAvailability: 0.78,
    expediteCount: 7,
    poHoldsCount: 3,
    workingCapitalImpact: 16600,
    meanTimeToResolveAlert: '4.2 hours',
    accrualVariance: -240000,
    revenueExceptionCycleTime: '2.1 days',
    rotableAvailabilityOutstations: 0.82,
    repairTATAdherence: 0.76,
    aogEventsThisMonth: 1,
  },
};

export default mroScenarioContext;
