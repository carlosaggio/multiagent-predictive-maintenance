/**
 * WAIO Notifications
 * 
 * Alert notifications for the WAIO Pit-to-Port demo.
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
  },
  {
    id: 'WAIO-NOTIF-002',
    type: 'data_quality',
    severity: 'warning',
    title: 'Stockpile SP-3: Data confidence degraded',
    message: 'Assay stale (>4h) + possible unrecorded dozer rehandle; confidence 0.72',
    timestamp: '2025-01-15T09:45:00+08:00',
    source: 'Stockpile Traceability Agent',
    entity: 'SP-3',
    actionRequired: true,
    read: false,
  },
  {
    id: 'WAIO-NOTIF-003',
    type: 'grade_drift',
    severity: 'warning',
    title: 'Pit 3 Zone B: Ore type drift detected',
    message: 'Fe trending 0.5% below model; assay lag 6h; recommend sample verification',
    timestamp: '2025-01-15T08:30:00+08:00',
    source: 'Mine Planning Agent',
    entity: 'PIT3-ZB-041',
    actionRequired: true,
    read: false,
  },
  {
    id: 'WAIO-NOTIF-004',
    type: 'equipment_breakdown',
    severity: 'critical',
    title: 'Truck TRK-12: Breakdown',
    message: 'Transmission fault detected; estimated repair 2h; haul capacity reduced 8%',
    timestamp: '2025-01-15T10:30:00+08:00',
    source: 'Fleet & Resources Agent',
    entity: 'TRK-12',
    actionRequired: true,
    read: false,
  },
  {
    id: 'WAIO-NOTIF-005',
    type: 'logistics_risk',
    severity: 'warning',
    title: 'Rail: Slot compression risk',
    message: 'Train-07 delay >45min will impact Berth B2 schedule and increase demurrage risk',
    timestamp: '2025-01-15T10:20:00+08:00',
    source: 'Logistics Agent',
    entity: 'TRAIN-07',
    actionRequired: false,
    read: false,
  },
  {
    id: 'WAIO-NOTIF-006',
    type: 'port_risk',
    severity: 'info',
    title: 'Port: MV-Koyo-Maru arrival update',
    message: 'ETA revised to 14:00; berth B2 preparation on schedule',
    timestamp: '2025-01-15T09:00:00+08:00',
    source: 'Logistics Agent',
    entity: 'MV-Koyo-Maru',
    actionRequired: false,
    read: true,
  },
  {
    id: 'WAIO-NOTIF-007',
    type: 'plan_compliance',
    severity: 'warning',
    title: 'Plan compliance: Below target',
    message: 'Shift plan compliance at 84% (target 95%); 3 deviations identified',
    timestamp: '2025-01-15T10:00:00+08:00',
    source: 'Shift Optimiser',
    entity: null,
    actionRequired: true,
    read: false,
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
