export const mroAutomations = [
  {
    id: 'AUTO-001',
    name: 'Auto-Expedite Critical Spares',
    description: 'Automatically creates expedite PO when part availability drops below threshold at need date',
    enabled: true,
    trigger: {
      condition: 'Part availability < 80% at need date AND lead time > 5 days',
      frequency: 'Continuous (event-driven)',
      lastCheck: '2025-01-15T10:00:00+08:00',
    },
    action: {
      template: 'Create expedite PO if cost < $5,000',
      approvalPolicy: 'Auto if < $5K, manual approval if > $5K',
    },
    stats: {
      lastRun: '2025-01-15T08:20:00+08:00',
      actionsThisWeek: 12,
      actionsThisMonth: 34,
      avgCostPerAction: 3200,
      successRate: 0.94,
    },
    runLog: [
      { timestamp: '2025-01-15T08:20:00+08:00', action: 'PO-8901 expedited ($3,800)', result: 'success', approved: true },
      { timestamp: '2025-01-14T14:15:00+08:00', action: 'PO-8899 expedited ($4,500)', result: 'success', approved: true },
      { timestamp: '2025-01-14T09:00:00+08:00', action: 'PO-8895 flagged ($7,200 > threshold)', result: 'escalated', approved: false },
    ],
  },
  {
    id: 'AUTO-002',
    name: 'Pool Rebalancing Alert',
    description: 'Alerts when component pool coverage drops below 3 days at any outstation',
    enabled: true,
    trigger: {
      condition: 'Coverage days < 3 at any site AND demand forecast > 0',
      frequency: 'Every 4 hours',
      lastCheck: '2025-01-15T08:00:00+08:00',
    },
    action: {
      template: 'Recommend transfer from nearest site with surplus',
      approvalPolicy: 'Always requires manual approval',
    },
    stats: {
      lastRun: '2025-01-15T08:00:00+08:00',
      actionsThisWeek: 4,
      actionsThisMonth: 11,
      avgCostPerAction: 450,
      successRate: 0.88,
    },
    runLog: [
      { timestamp: '2025-01-15T08:00:00+08:00', action: 'IDG transfer recommended (Pool West → Hub East)', result: 'pending_review', approved: false },
      { timestamp: '2025-01-13T12:00:00+08:00', action: 'LDG transfer executed (Hangar 2 → Hub West)', result: 'success', approved: true },
    ],
  },
  {
    id: 'AUTO-003',
    name: 'MBH Accrual Variance Monitor',
    description: 'Flags revenue exceptions when accrual variance exceeds 5% for any contract',
    enabled: false,
    trigger: {
      condition: 'Accrual variance > 5% for any active MBH contract',
      frequency: 'Daily at 06:00',
      lastCheck: null,
    },
    action: {
      template: 'Flag exception, notify billing team, create investigation task',
      approvalPolicy: 'Auto-flag, manual resolution',
    },
    stats: {
      lastRun: null,
      actionsThisWeek: 0,
      actionsThisMonth: 0,
      avgCostPerAction: 0,
      successRate: 0,
    },
    runLog: [],
  },
];

export default mroAutomations;
