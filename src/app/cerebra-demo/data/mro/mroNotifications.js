export const mroNotifications = [
  {
    id: 'MRO-NOTIF-001',
    type: 'spares_gap',
    severity: 'critical',
    title: 'Critical Spares Gap — WP-55 at Hangar 1',
    message: '3 parts flagged red for Work Package WP-55 (AC-042 C-Check). PO-8837 delayed 5 days. Predicted redelivery delay: 3 days.',
    timestamp: '2025-01-15T06:15:00+08:00',
    source: 'Material Planning Agent',
    entity: 'WP-55',
    actionRequired: true,
    read: false,
    scenarioVariantId: 'variant_a',
  },
  {
    id: 'MRO-NOTIF-002',
    type: 'pool_coverage',
    severity: 'critical',
    title: 'IDG Pool Coverage Critical — Hub East',
    message: 'IDG inventory at Hub East: 1 serviceable vs 3 required. AOG probability: 34% within 72h.',
    timestamp: '2025-01-15T05:45:00+08:00',
    source: 'Component Services Agent',
    entity: 'POOL-IDG-EAST',
    actionRequired: true,
    read: false,
    scenarioVariantId: 'variant_b',
  },
  {
    id: 'MRO-NOTIF-003',
    type: 'revenue_exception',
    severity: 'warning',
    title: 'MBH Revenue Exception — Contract Beta',
    message: '$240K accrual variance detected. 2 unreported utilisation changes + 1 unbilled component swap. Billing deadline: 5 days.',
    timestamp: '2025-01-15T07:00:00+08:00',
    source: 'Revenue Assurance Agent',
    entity: 'CONTRACT-BETA',
    actionRequired: true,
    read: false,
    scenarioVariantId: 'variant_c',
  },
  {
    id: 'MRO-NOTIF-004',
    type: 'repair_tat',
    severity: 'warning',
    title: 'Repair TAT Breach — RO-445 (IDG)',
    message: 'Repair order RO-445 at vendor ABC slipping 8 days beyond SLA. Component needed for Hub East pool.',
    timestamp: '2025-01-15T04:30:00+08:00',
    source: 'Component Services Agent',
    entity: 'RO-445',
    actionRequired: true,
    read: false,
    scenarioVariantId: null,
  },
  {
    id: 'MRO-NOTIF-005',
    type: 'repair_complete',
    severity: 'info',
    title: 'Repair Complete — RO-221 (Bearing PN-9108)',
    message: 'Repair order RO-221 completed ahead of schedule. PN-9108 available for release to WP-55.',
    timestamp: '2025-01-15T03:00:00+08:00',
    source: 'Component Services Agent',
    entity: 'RO-221',
    actionRequired: false,
    read: true,
    scenarioVariantId: null,
  },
];

export function getMROActionRequiredNotifications() {
  return mroNotifications.filter(n => n.actionRequired && !n.read);
}

export function getMRONotificationsByVariant(variantId) {
  return mroNotifications.filter(n => n.scenarioVariantId === variantId || n.scenarioVariantId === null);
}

export default mroNotifications;
