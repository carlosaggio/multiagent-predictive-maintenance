/**
 * WAIO Notifications
 * 
 * Alert notifications for the WAIO Pit-to-Port demo.
 * Each critical/actionable notification maps to a specific scenario variant.
 */

export const waioNotifications = [
  {
    id: 'WAIO-NOTIF-001',
    type: 'grade_risk',
    severity: 'critical',
    title: 'Train-07: Under-spec risk HIGH',
    message: 'Fe forecast 61.2% vs spec ≥62.0% — 62% probability of under-spec shipment',
    timestamp: '2025-01-15T10:15:00+08:00',
    source: 'Grade & Compliance Agent',
    entity: 'TRAIN-07',
    actionRequired: true,
    read: false,
    // Maps to scenario variant_a (Train-07 grade under-spec)
    scenarioVariantId: 'variant_a',
  },
  {
    id: 'WAIO-NOTIF-002',
    type: 'silica_risk',
    severity: 'critical',
    title: 'Train-04: Silica contamination risk',
    message: 'SiO2 forecast 4.8% vs spec ≤4.5% — 71% probability of exceeding limit',
    timestamp: '2025-01-15T10:10:00+08:00',
    source: 'Grade & Compliance Agent',
    entity: 'TRAIN-04',
    actionRequired: true,
    read: false,
    // Maps to scenario variant_b (Train-04 silica over-spec)
    scenarioVariantId: 'variant_b',
  },
  {
    id: 'WAIO-NOTIF-003',
    type: 'throughput_risk',
    severity: 'critical',
    title: 'Train-09: Throughput shortfall',
    message: 'Loading rate 5,800 t/h vs target 6,500 t/h — may miss loading window',
    timestamp: '2025-01-15T10:05:00+08:00',
    source: 'Logistics Agent',
    entity: 'TRAIN-09',
    actionRequired: true,
    read: false,
    // Maps to scenario variant_c (Train-09 throughput shortfall)
    scenarioVariantId: 'variant_c',
  },
  {
    id: 'WAIO-NOTIF-004',
    type: 'multiple_risk',
    severity: 'critical',
    title: 'Train-02: Multiple constraints',
    message: 'Fe forecast 61.5% + truck allocation gap at Pit2 — 74% combined deviation risk',
    timestamp: '2025-01-15T10:00:00+08:00',
    source: 'Shift Optimiser',
    entity: 'TRAIN-02',
    actionRequired: true,
    read: false,
    // Maps to scenario variant_d (Train-02 multiple constraints)
    scenarioVariantId: 'variant_d',
  },
  {
    id: 'WAIO-NOTIF-005',
    type: 'data_quality',
    severity: 'warning',
    title: 'Stockpile SP-3: Data confidence degraded',
    message: 'Assay stale (>4h) + possible unrecorded dozer rehandle; confidence 0.72',
    timestamp: '2025-01-15T09:45:00+08:00',
    source: 'Stockpile Traceability Agent',
    entity: 'SP-3',
    actionRequired: true,
    read: false,
    scenarioVariantId: null, // Info only, doesn't trigger specific scenario
  },
  {
    id: 'WAIO-NOTIF-006',
    type: 'grade_drift',
    severity: 'warning',
    title: 'Pit 3 Zone B: Ore type drift detected',
    message: 'Fe trending 0.5% below model; assay lag 6h; recommend sample verification',
    timestamp: '2025-01-15T08:30:00+08:00',
    source: 'Mine Planning Agent',
    entity: 'PIT3-ZB-041',
    actionRequired: true,
    read: false,
    scenarioVariantId: null,
  },
  {
    id: 'WAIO-NOTIF-007',
    type: 'port_risk',
    severity: 'info',
    title: 'Port: MV-Koyo-Maru arrival update',
    message: 'ETA revised to 14:00; berth B2 preparation on schedule',
    timestamp: '2025-01-15T09:00:00+08:00',
    source: 'Logistics Agent',
    entity: 'MV-Koyo-Maru',
    actionRequired: false,
    read: true,
    scenarioVariantId: null,
  },
  {
    id: 'WAIO-NOTIF-008',
    type: 'commercial',
    severity: 'info',
    title: 'Contract K-JP-A: Premium shipment window',
    message: 'Next premium grade window opens in 48h; ensure SP-4 availability',
    timestamp: '2025-01-15T07:00:00+08:00',
    source: 'Commercial Agent',
    entity: 'CNT-KJP-A',
    actionRequired: false,
    read: true,
    scenarioVariantId: null,
  },
];

// Get notifications by severity
export const getNotificationsBySeverity = (severity) => {
  return waioNotifications.filter(n => n.severity === severity);
};

// Get unread notifications
export const getUnreadNotifications = () => {
  return waioNotifications.filter(n => !n.read);
};

// Get critical notifications
export const getCriticalNotifications = () => {
  return waioNotifications.filter(n => n.severity === 'critical');
};

// Get action required notifications
export const getActionRequiredNotifications = () => {
  return waioNotifications.filter(n => n.actionRequired && !n.read);
};

export default waioNotifications;
