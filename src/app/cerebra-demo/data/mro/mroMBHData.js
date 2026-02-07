export const mroMBHDashboard = {
  period: 'Q4 2024',
  totalFlyingHours: 42100,
  expectedFlyingHours: 44800,
  totalAccrual: 8400000,
  totalBilledReady: 7308000,
  billingReadiness: 0.87,

  contracts: [
    {
      id: 'CONTRACT-ALPHA',
      operator: 'Operator Alpha',
      fleet: 'A320neo x 12',
      ratePerFH: 42,
      componentRate: 18,
      flyingHours: { reported: 18200, expected: 18200, variance: 0 },
      accrual: { expected: 3200000, actual: 3200000, variance: 0 },
      exceptions: 0,
      status: 'on_track',
    },
    {
      id: 'CONTRACT-BETA',
      operator: 'Operator Alpha',
      fleet: 'A320neo x 8',
      ratePerFH: 42,
      componentRate: 18,
      flyingHours: { reported: 12400, expected: 14000, variance: -1600 },
      accrual: { expected: 2400000, actual: 2160000, variance: -240000 },
      exceptions: 2,
      status: 'exception',
      exceptionDetails: [
        {
          id: 'EXC-001',
          type: 'utilisation_change',
          description: '2 aircraft (AC-031, AC-032) redeployed to higher-cycle routes — utilisation change not reported by operator',
          amount: -180000,
          rootCause: 'Operator route change notification delay',
          resolution: 'Adjust accrual model, request updated utilisation report from operator',
        },
        {
          id: 'EXC-002',
          type: 'component_swap',
          description: 'APU SN-8891 replaced under warranty but swap not captured in billing system',
          amount: -60000,
          rootCause: 'Manual data entry gap between component shop and billing',
          resolution: 'Update component tracking, create billing correction for $60K',
        },
      ],
    },
    {
      id: 'CONTRACT-GAMMA',
      operator: 'Operator Beta',
      fleet: 'B737-800 x 15',
      ratePerFH: 38,
      componentRate: 15,
      flyingHours: { reported: 11500, expected: 12600, variance: -1100 },
      accrual: { expected: 2800000, actual: 2740000, variance: -60000 },
      exceptions: 1,
      status: 'minor_variance',
    },
  ],

  componentPoolHealth: [
    { family: 'APU', serviceable: 12, unserviceable: 3, total: 15, coverage: 0.97, avgRepairTAT: 18, tatTarget: 21 },
    { family: 'LDG', serviceable: 8, unserviceable: 2, total: 10, coverage: 0.94, avgRepairTAT: 12, tatTarget: 14 },
    { family: 'IDG', serviceable: 5, unserviceable: 4, total: 9, coverage: 0.61, avgRepairTAT: 25, tatTarget: 18 },
    { family: 'Hydraulic', serviceable: 18, unserviceable: 4, total: 22, coverage: 0.88, avgRepairTAT: 10, tatTarget: 12 },
    { family: 'Pneumatic', serviceable: 14, unserviceable: 2, total: 16, coverage: 0.92, avgRepairTAT: 8, tatTarget: 10 },
  ],

  billingActions: [
    { id: 'BA-001', contract: 'Beta', action: 'Adjust accrual model', amount: 180000, status: 'pending', dueDate: '2025-01-20' },
    { id: 'BA-002', contract: 'Beta', action: 'Create billing correction', amount: 60000, status: 'pending', dueDate: '2025-01-20' },
    { id: 'BA-003', contract: 'Beta', action: 'Request operator utilisation update', amount: 0, status: 'pending', dueDate: '2025-01-18' },
    { id: 'BA-004', contract: 'Gamma', action: 'Review FH variance with operator', amount: 60000, status: 'in_progress', dueDate: '2025-01-22' },
  ],
};

export default mroMBHDashboard;
