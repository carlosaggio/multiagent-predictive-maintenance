/**
 * MRO (Maintenance, Repair & Overhaul) Ontology Data
 *
 * Comprehensive data model for Aviation MRO domain with 18 entity types,
 * instance graph nodes and edges, and relationship definitions.
 * Provides Palantir-style ontology drill-down capability.
 */

// ============================================================================
// ENTITY TYPE DEFINITIONS
// ============================================================================

export const MRO_ENTITY_TYPES = {
  Aircraft: {
    color: '#3B82F6',
    icon: 'plane',
    category: 'Fleet',
    label: 'Aircraft',
    fields: [
      { name: 'tailNumber', type: 'string', description: 'Aircraft tail number' },
      { name: 'manufacturer', type: 'string', description: 'Aircraft manufacturer' },
      { name: 'model', type: 'string', description: 'Aircraft model' },
      { name: 'serialNumber', type: 'string', description: 'Manufacturer serial number' },
      { name: 'flyingHours', type: 'number', description: 'Total flying hours' },
      { name: 'flightCycles', type: 'number', description: 'Total flight cycles' },
      { name: 'status', type: 'string', description: 'Operational status' },
    ],
  },
  CheckEvent: {
    color: '#A100FF',
    icon: 'calendar',
    category: 'Maintenance',
    label: 'Check Event',
    fields: [
      { name: 'checkType', type: 'string', description: 'Type of maintenance check (A/C/D)' },
      { name: 'eventDate', type: 'date', description: 'Scheduled check date' },
      { name: 'dueFlightHours', type: 'number', description: 'Due based on flying hours' },
      { name: 'dueCycles', type: 'number', description: 'Due based on flight cycles' },
      { name: 'status', type: 'string', description: 'Check status' },
    ],
  },
  WorkPackage: {
    color: '#8B5CF6',
    icon: 'package',
    category: 'Maintenance',
    label: 'Work Package',
    fields: [
      { name: 'wpId', type: 'string', description: 'Work package identifier' },
      { name: 'scope', type: 'string', description: 'Work scope description' },
      { name: 'estimatedHours', type: 'number', description: 'Estimated labor hours' },
      { name: 'status', type: 'string', description: 'Work package status' },
      { name: 'priority', type: 'string', description: 'Priority level' },
    ],
  },
  TaskCard: {
    color: '#7C3AED',
    icon: 'list',
    category: 'Maintenance',
    label: 'Task Card',
    fields: [
      { name: 'taskId', type: 'string', description: 'Task identifier' },
      { name: 'taskTitle', type: 'string', description: 'Task description' },
      { name: 'manhours', type: 'number', description: 'Estimated manhours' },
      { name: 'status', type: 'string', description: 'Task status' },
    ],
  },
  Part: {
    color: '#10B981',
    icon: 'component',
    category: 'Material',
    label: 'Part',
    fields: [
      { name: 'partNumber', type: 'string', description: 'Part number' },
      { name: 'partName', type: 'string', description: 'Part name' },
      { name: 'manufacturer', type: 'string', description: 'Part manufacturer' },
      { name: 'unitCost', type: 'number', description: 'Unit cost' },
      { name: 'leadTime', type: 'number', description: 'Lead time in days' },
      { name: 'category', type: 'string', description: 'Part category' },
    ],
  },
  PartDemand: {
    color: '#059669',
    icon: 'demand',
    category: 'Material',
    label: 'Part Demand',
    fields: [
      { name: 'demandId', type: 'string', description: 'Demand identifier' },
      { name: 'quantity', type: 'number', description: 'Quantity demanded' },
      { name: 'requiredDate', type: 'date', description: 'Required by date' },
      { name: 'priority', type: 'string', description: 'Demand priority' },
    ],
  },
  InventoryPosition: {
    color: '#14B8A6',
    icon: 'warehouse',
    category: 'Material',
    label: 'Inventory Position',
    fields: [
      { name: 'locationCode', type: 'string', description: 'Storage location' },
      { name: 'onHand', type: 'number', description: 'Quantity on hand' },
      { name: 'onOrder', type: 'number', description: 'Quantity on order' },
      { name: 'safetyStock', type: 'number', description: 'Safety stock level' },
    ],
  },
  RepairOrder: {
    color: '#F59E0B',
    icon: 'wrench',
    category: 'Repair',
    label: 'Repair Order',
    fields: [
      { name: 'roId', type: 'string', description: 'Repair order number' },
      { name: 'component', type: 'string', description: 'Component being repaired' },
      { name: 'vendor', type: 'string', description: 'Repair vendor' },
      { name: 'dueDate', type: 'date', description: 'Completion due date' },
      { name: 'cost', type: 'number', description: 'Repair cost estimate' },
    ],
  },
  PurchaseOrder: {
    color: '#EF4444',
    icon: 'cart',
    category: 'Procurement',
    label: 'Purchase Order',
    fields: [
      { name: 'poNumber', type: 'string', description: 'Purchase order number' },
      { name: 'supplier', type: 'string', description: 'Supplier name' },
      { name: 'totalValue', type: 'number', description: 'Total order value' },
      { name: 'deliveryDate', type: 'date', description: 'Expected delivery date' },
      { name: 'status', type: 'string', description: 'Order status' },
    ],
  },
  Shipment: {
    color: '#EC4899',
    icon: 'truck',
    category: 'Logistics',
    label: 'Shipment',
    fields: [
      { name: 'shipmentId', type: 'string', description: 'Shipment identifier' },
      { name: 'trackingNumber', type: 'string', description: 'Tracking number' },
      { name: 'origin', type: 'string', description: 'Shipment origin' },
      { name: 'destination', type: 'string', description: 'Shipment destination' },
      { name: 'eta', type: 'date', description: 'Estimated time of arrival' },
    ],
  },
  ComponentSerial: {
    color: '#6366F1',
    icon: 'serial',
    category: 'Material',
    label: 'Component Serial',
    fields: [
      { name: 'serialNumber', type: 'string', description: 'Component serial number' },
      { name: 'partNumber', type: 'string', description: 'Part number' },
      { name: 'status', type: 'string', description: 'Component status' },
      { name: 'location', type: 'string', description: 'Current location' },
      { name: 'flightHours', type: 'number', description: 'Component flight hours' },
    ],
  },
  ComponentPool: {
    color: '#06B6D4',
    icon: 'pool',
    category: 'Material',
    label: 'Component Pool',
    fields: [
      { name: 'poolId', type: 'string', description: 'Pool identifier' },
      { name: 'componentType', type: 'string', description: 'Component type' },
      { name: 'poolSize', type: 'number', description: 'Total pool size' },
      { name: 'available', type: 'number', description: 'Available components' },
    ],
  },
  ContractMBH: {
    color: '#F97316',
    icon: 'contract',
    category: 'Commercial',
    label: 'Contract MBH',
    fields: [
      { name: 'contractId', type: 'string', description: 'Contract identifier' },
      { name: 'aircraftType', type: 'string', description: 'Aircraft type covered' },
      { name: 'coverage', type: 'string', description: 'Coverage type' },
      { name: 'monthlyFee', type: 'number', description: 'Monthly fee' },
      { name: 'terms', type: 'string', description: 'Contract terms' },
    ],
  },
  FlyingHoursReport: {
    color: '#84CC16',
    icon: 'clock',
    category: 'Commercial',
    label: 'Flying Hours Report',
    fields: [
      { name: 'reportId', type: 'string', description: 'Report identifier' },
      { name: 'period', type: 'string', description: 'Reporting period' },
      { name: 'totalFlyingHours', type: 'number', description: 'Total flying hours' },
      { name: 'chargeableHours', type: 'number', description: 'Chargeable hours' },
      { name: 'status', type: 'string', description: 'Report status' },
    ],
  },
  BillingLine: {
    color: '#22C55E',
    icon: 'invoice',
    category: 'Commercial',
    label: 'Billing Line',
    fields: [
      { name: 'lineId', type: 'string', description: 'Billing line identifier' },
      { name: 'description', type: 'string', description: 'Service description' },
      { name: 'quantity', type: 'number', description: 'Quantity' },
      { name: 'unitPrice', type: 'number', description: 'Unit price' },
      { name: 'totalAmount', type: 'number', description: 'Total amount' },
    ],
  },
  Alert: {
    color: '#EF4444',
    icon: 'alert',
    category: 'Operations',
    label: 'Alert',
    fields: [
      { name: 'alertId', type: 'string', description: 'Alert identifier' },
      { name: 'severity', type: 'string', description: 'Alert severity' },
      { name: 'message', type: 'string', description: 'Alert message' },
      { name: 'timestamp', type: 'date', description: 'Alert timestamp' },
      { name: 'status', type: 'string', description: 'Alert status' },
    ],
  },
  Action: {
    color: '#A100FF',
    icon: 'action',
    category: 'Operations',
    label: 'Action',
    fields: [
      { name: 'actionId', type: 'string', description: 'Action identifier' },
      { name: 'actionType', type: 'string', description: 'Type of action' },
      { name: 'dueDate', type: 'date', description: 'Due date' },
      { name: 'owner', type: 'string', description: 'Action owner' },
      { name: 'status', type: 'string', description: 'Action status' },
    ],
  },
  ApprovalTask: {
    color: '#10B981',
    icon: 'approve',
    category: 'Governance',
    label: 'Approval Task',
    fields: [
      { name: 'taskId', type: 'string', description: 'Task identifier' },
      { name: 'approvalType', type: 'string', description: 'Type of approval' },
      { name: 'assignee', type: 'string', description: 'Assigned to' },
      { name: 'dueDate', type: 'date', description: 'Due date' },
      { name: 'status', type: 'string', description: 'Task status' },
    ],
  },
};

// ============================================================================
// ENTITY CATEGORIES
// ============================================================================

export const mroEntityCategories = {
  Fleet: ['Aircraft'],
  Maintenance: ['CheckEvent', 'WorkPackage', 'TaskCard'],
  Material: ['Part', 'PartDemand', 'InventoryPosition', 'ComponentSerial', 'ComponentPool'],
  Repair: ['RepairOrder'],
  Procurement: ['PurchaseOrder'],
  Logistics: ['Shipment'],
  Commercial: ['ContractMBH', 'FlyingHoursReport', 'BillingLine'],
  Operations: ['Alert', 'Action'],
  Governance: ['ApprovalTask'],
};

// ============================================================================
// GRAPH NODES (Instance Data)
// ============================================================================

export const mroGraphNodes = [
  // Aircraft nodes
  { id: 'AC-042', type: 'Aircraft', label: 'B737-800 (N42AC)', x: 100, y: 80, data: { tailNumber: 'N42AC', model: 'Boeing 737-800', flyingHours: 42150, status: 'In Maintenance' } },
  { id: 'AC-055', type: 'Aircraft', label: 'B787-9 (N55AC)', x: 150, y: 120, data: { tailNumber: 'N55AC', model: 'Boeing 787-9', flyingHours: 18340, status: 'Operational' } },
  { id: 'AC-063', type: 'Aircraft', label: 'A350-900 (N63AC)', x: 200, y: 90, data: { tailNumber: 'N63AC', model: 'Airbus A350-900', flyingHours: 12560, status: 'Scheduled Check' } },

  // Check Event nodes
  { id: 'CE-001', type: 'CheckEvent', label: 'C-Check AC-042', x: 120, y: 200, data: { checkType: 'C-Check', dueFlightHours: 42000, status: 'In Progress' } },
  { id: 'CE-002', type: 'CheckEvent', label: 'A-Check AC-055', x: 170, y: 220, data: { checkType: 'A-Check', dueFlightHours: 18000, status: 'Scheduled' } },
  { id: 'CE-003', type: 'CheckEvent', label: 'D-Check AC-063', x: 220, y: 210, data: { checkType: 'D-Check', dueFlightHours: 12500, status: 'Planning' } },

  // Work Package nodes
  { id: 'WP-55', type: 'WorkPackage', label: 'Engine Overhaul WP-55', x: 130, y: 320, data: { wpId: 'WP-55', scope: 'Full engine overhaul', estimatedHours: 480, priority: 'Critical' } },
  { id: 'WP-56', type: 'WorkPackage', label: 'Hydraulics WP-56', x: 180, y: 340, data: { wpId: 'WP-56', scope: 'Hydraulic system inspection', estimatedHours: 120, priority: 'High' } },
  { id: 'WP-57', type: 'WorkPackage', label: 'Structural WP-57', x: 230, y: 330, data: { wpId: 'WP-57', scope: 'Fuselage inspection', estimatedHours: 240, priority: 'High' } },

  // Task Card nodes
  { id: 'TC-441', type: 'TaskCard', label: 'Remove Engine #1', x: 110, y: 440, data: { taskId: 'TC-441', taskTitle: 'Engine removal and shipping', manhours: 80 } },
  { id: 'TC-442', type: 'TaskCard', label: 'Inspect Core', x: 160, y: 460, data: { taskId: 'TC-442', taskTitle: 'Core component inspection', manhours: 40 } },
  { id: 'TC-443', type: 'TaskCard', label: 'Hydraulic Flush', x: 210, y: 450, data: { taskId: 'TC-443', taskTitle: 'Complete hydraulic system flush', manhours: 20 } },

  // Part nodes
  { id: 'PN-8837', type: 'Part', label: 'Fuel Pump (CFM56)', x: 80, y: 560, data: { partNumber: 'PN-8837', partName: 'Fuel Pump Assembly', manufacturer: 'CFM International', unitCost: 45000 } },
  { id: 'PN-9142', type: 'Part', label: 'Bearing Set', x: 130, y: 580, data: { partNumber: 'PN-9142', partName: 'Roller Bearing Set', manufacturer: 'SKF', unitCost: 12500 } },
  { id: 'PN-7654', type: 'Part', label: 'Seal Kit', x: 180, y: 590, data: { partNumber: 'PN-7654', partName: 'High-temp seal kit', manufacturer: 'Parker Hannifin', unitCost: 3200 } },
  { id: 'PN-5521', type: 'Part', label: 'Hose Assembly', x: 230, y: 570, data: { partNumber: 'PN-5521', partName: 'Hydraulic hose assembly', manufacturer: 'Eaton', unitCost: 8400 } },

  // Component Serial nodes
  { id: 'SN-ENG-14521', type: 'ComponentSerial', label: 'Engine SN-14521', x: 100, y: 680, data: { serialNumber: 'SN-14521', partNumber: 'CFM56-5B4', status: 'Removed', flightHours: 42100 } },
  { id: 'SN-APU-22841', type: 'ComponentSerial', label: 'APU SN-22841', x: 160, y: 700, data: { serialNumber: 'SN-22841', partNumber: 'PW901A', status: 'In Pool', flightHours: 18200 } },
  { id: 'SN-HYD-33521', type: 'ComponentSerial', label: 'Pump SN-33521', x: 210, y: 690, data: { serialNumber: 'SN-33521', partNumber: 'PN-8837', status: 'Serviceable', flightHours: 12500 } },

  // Component Pool node
  { id: 'POOL-ENG', type: 'ComponentPool', label: 'Engine Pool', x: 80, y: 800, data: { poolId: 'POOL-ENG', componentType: 'Turbofan Engine', poolSize: 8, available: 3 } },
  { id: 'POOL-APU', type: 'ComponentPool', label: 'APU Pool', x: 160, y: 820, data: { poolId: 'POOL-APU', componentType: 'Auxiliary Power Unit', poolSize: 6, available: 4 } },

  // Part Demand node
  { id: 'PD-2284', type: 'PartDemand', label: 'Urgent Fuel Pump', x: 130, y: 900, data: { demandId: 'PD-2284', partNumber: 'PN-8837', quantity: 2, requiredDate: '2026-02-14', priority: 'Critical' } },

  // Inventory Position node
  { id: 'INV-DEN-ENG', type: 'InventoryPosition', label: 'Denver Engine Stock', x: 90, y: 1000, data: { locationCode: 'DEN-01', onHand: 3, onOrder: 2, safetyStock: 2 } },

  // Purchase Order node
  { id: 'PO-SAP-45821', type: 'PurchaseOrder', label: 'PO for CFM Parts', x: 150, y: 1050, data: { poNumber: 'PO-45821', supplier: 'CFM International', totalValue: 850000, status: 'In Transit' } },

  // Repair Order node
  { id: 'RO-MTU-1342', type: 'RepairOrder', label: 'MTU Engine Repair', x: 200, y: 1020, data: { roId: 'RO-1342', component: 'Engine SN-14521', vendor: 'MTU Maintenance', dueDate: '2026-03-15', cost: 280000 } },

  // Shipment node
  { id: 'SHP-FDX-4821', type: 'Shipment', label: 'FedEx Engine Shipment', x: 260, y: 1080, data: { shipmentId: 'SHP-4821', trackingNumber: 'FDX874521', origin: 'Denver', destination: 'MTU Frankfurt', eta: '2026-02-10' } },

  // Contract MBH node
  { id: 'CTR-ALPHA', type: 'ContractMBH', label: 'Alpha MBH Contract', x: 100, y: 1150, data: { contractId: 'CTR-ALPHA', aircraftType: 'B737-800', coverage: 'Thrust-based', monthlyFee: 185000 } },

  // Flying Hours Report node
  { id: 'FHR-JAN-2026', type: 'FlyingHoursReport', label: 'Jan 2026 FH Report', x: 160, y: 1180, data: { reportId: 'FHR-001', period: 'Jan 2026', totalFlyingHours: 4240, chargeableHours: 4200 } },

  // Billing Line node
  { id: 'BL-INV-8421', type: 'BillingLine', label: 'Monthly MBH Charge', x: 220, y: 1160, data: { lineId: 'BL-8421', description: 'Flying hours accrual Jan 2026', quantity: 4200, unitPrice: 44, totalAmount: 184800 } },

  // Alert node
  { id: 'ALT-ENG-WEAR', type: 'Alert', label: 'Engine Wear Alert', x: 80, y: 1280, data: { alertId: 'ALT-001', severity: 'Warning', message: 'Engine borescope shows minor hot section damage', status: 'Active' } },

  // Action node
  { id: 'ACT-INSPECT', type: 'Action', label: 'Engine Inspection', x: 150, y: 1300, data: { actionId: 'ACT-001', actionType: 'Borescope inspection', dueDate: '2026-02-15', owner: 'John Smith', status: 'In Progress' } },

  // Approval Task node
  { id: 'APR-RO-1342', type: 'ApprovalTask', label: 'Approve MTU RO', x: 220, y: 1320, data: { taskId: 'APR-001', approvalType: 'Repair Order', assignee: 'Mary Johnson', dueDate: '2026-02-08', status: 'Pending' } },
];

// ============================================================================
// GRAPH EDGES (Relationships)
// ============================================================================

export const mroGraphEdges = [
  // Aircraft to Check Events
  { id: 'e1', source: 'AC-042', target: 'CE-001', label: 'scheduled for', type: 'scheduling' },
  { id: 'e2', source: 'AC-055', target: 'CE-002', label: 'scheduled for', type: 'scheduling' },
  { id: 'e3', source: 'AC-063', target: 'CE-003', label: 'scheduled for', type: 'scheduling' },

  // Check Events to Work Packages
  { id: 'e4', source: 'CE-001', target: 'WP-55', label: 'defines', type: 'containment' },
  { id: 'e5', source: 'CE-001', target: 'WP-56', label: 'defines', type: 'containment' },
  { id: 'e6', source: 'CE-001', target: 'WP-57', label: 'defines', type: 'containment' },
  { id: 'e7', source: 'CE-002', target: 'WP-56', label: 'defines', type: 'containment' },
  { id: 'e8', source: 'CE-003', target: 'WP-57', label: 'defines', type: 'containment' },

  // Work Packages to Task Cards
  { id: 'e9', source: 'WP-55', target: 'TC-441', label: 'contains', type: 'containment' },
  { id: 'e10', source: 'WP-55', target: 'TC-442', label: 'contains', type: 'containment' },
  { id: 'e11', source: 'WP-56', target: 'TC-443', label: 'contains', type: 'containment' },

  // Task Cards to Parts
  { id: 'e12', source: 'TC-441', target: 'PN-8837', label: 'requires removal', type: 'material' },
  { id: 'e13', source: 'TC-442', target: 'PN-9142', label: 'inspects', type: 'material' },
  { id: 'e14', source: 'TC-443', target: 'PN-7654', label: 'replaces', type: 'material' },
  { id: 'e15', source: 'TC-443', target: 'PN-5521', label: 'flushes', type: 'material' },

  // Parts to Component Serials
  { id: 'e16', source: 'PN-8837', target: 'SN-ENG-14521', label: 'instance of', type: 'typing' },
  { id: 'e17', source: 'PN-9142', target: 'SN-APU-22841', label: 'instance of', type: 'typing' },
  { id: 'e18', source: 'PN-7654', target: 'SN-HYD-33521', label: 'instance of', type: 'typing' },

  // Component Serials to Pools
  { id: 'e19', source: 'SN-ENG-14521', target: 'POOL-ENG', label: 'moved to', type: 'location' },
  { id: 'e20', source: 'SN-APU-22841', target: 'POOL-APU', label: 'belongs to', type: 'location' },

  // Part Demands
  { id: 'e21', source: 'PD-2284', target: 'PN-8837', label: 'demands', type: 'material' },

  // Inventory
  { id: 'e22', source: 'INV-DEN-ENG', target: 'PN-8837', label: 'stocks', type: 'inventory' },

  // Purchase Orders
  { id: 'e23', source: 'PO-SAP-45821', target: 'PN-8837', label: 'orders', type: 'procurement' },
  { id: 'e24', source: 'PO-SAP-45821', target: 'PN-9142', label: 'orders', type: 'procurement' },

  // Repair Orders
  { id: 'e25', source: 'RO-MTU-1342', target: 'SN-ENG-14521', label: 'repairs', type: 'repair' },

  // Shipments
  { id: 'e26', source: 'SHP-FDX-4821', target: 'RO-MTU-1342', label: 'ships for', type: 'logistics' },
  { id: 'e27', source: 'SHP-FDX-4821', target: 'SN-ENG-14521', label: 'carries', type: 'logistics' },

  // Contracts
  { id: 'e28', source: 'CTR-ALPHA', target: 'AC-042', label: 'covers', type: 'commercial' },

  // Flying Hours
  { id: 'e29', source: 'FHR-JAN-2026', target: 'AC-042', label: 'reports for', type: 'commercial' },
  { id: 'e30', source: 'FHR-JAN-2026', target: 'CTR-ALPHA', label: 'accrues to', type: 'commercial' },

  // Billing
  { id: 'e31', source: 'BL-INV-8421', label: 'based on', target: 'FHR-JAN-2026', type: 'commercial' },
  { id: 'e32', source: 'BL-INV-8421', target: 'CTR-ALPHA', label: 'invoices', type: 'commercial' },

  // Alerts and Actions
  { id: 'e33', source: 'ALT-ENG-WEAR', target: 'SN-ENG-14521', label: 'identifies issue in', type: 'operations' },
  { id: 'e34', source: 'ACT-INSPECT', target: 'ALT-ENG-WEAR', label: 'responds to', type: 'operations' },
  { id: 'e35', source: 'ACT-INSPECT', target: 'TC-442', label: 'supports', type: 'operations' },

  // Approvals
  { id: 'e36', source: 'APR-RO-1342', target: 'RO-MTU-1342', label: 'approves', type: 'governance' },
  { id: 'e37', source: 'APR-RO-1342', target: 'WP-55', label: 'authorizes', type: 'governance' },

  // Cross-links
  { id: 'e38', source: 'WP-55', target: 'PO-SAP-45821', label: 'ordered parts for', type: 'procurement' },
  { id: 'e39', source: 'CE-001', target: 'CTR-ALPHA', label: 'billable under', type: 'commercial' },
  { id: 'e40', source: 'PD-2284', target: 'SHP-FDX-4821', label: 'fulfilled by', type: 'logistics' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a node by ID
 */
export function getMRONodeById(nodeId) {
  return mroGraphNodes.find(n => n.id === nodeId);
}

/**
 * Get edges connected to a node (both incoming and outgoing)
 */
export function getMROEdgesForNode(nodeId) {
  const outgoing = mroGraphEdges.filter(e => e.source === nodeId);
  const incoming = mroGraphEdges.filter(e => e.target === nodeId);
  return { outgoing, incoming };
}

/**
 * Search nodes by label, ID, or type
 */
export function searchMRONodes(query) {
  if (!query) return mroGraphNodes;

  const lowerQuery = query.toLowerCase();
  return mroGraphNodes.filter(node =>
    node.label.toLowerCase().includes(lowerQuery) ||
    node.id.toLowerCase().includes(lowerQuery) ||
    node.type.toLowerCase().includes(lowerQuery) ||
    (node.data && Object.values(node.data).some(
      v => String(v).toLowerCase().includes(lowerQuery)
    ))
  );
}

/**
 * Get all nodes of a specific type
 */
export function getMRONodesByType(type) {
  return mroGraphNodes.filter(n => n.type === type);
}

/**
 * Get all connected nodes (upstream and downstream)
 */
export function getMROConnectedNodes(nodeId) {
  const edges = getMROEdgesForNode(nodeId);
  const connected = new Set();

  edges.outgoing.forEach(e => connected.add(e.target));
  edges.incoming.forEach(e => connected.add(e.source));

  return Array.from(connected).map(id => getMRONodeById(id)).filter(Boolean);
}

/**
 * Get upstream nodes (transitive closure)
 */
export function getMROUpstreamNodes(nodeId, visited = new Set()) {
  if (visited.has(nodeId)) return [];
  visited.add(nodeId);

  const edges = getMROEdgesForNode(nodeId);
  const upstream = [];

  edges.incoming.forEach(e => {
    const node = getMRONodeById(e.source);
    if (node) {
      upstream.push(node);
      upstream.push(...getMROUpstreamNodes(e.source, visited));
    }
  });

  return Array.from(new Set(upstream)); // Deduplicate
}

/**
 * Get downstream nodes (transitive closure)
 */
export function getMRODownstreamNodes(nodeId, visited = new Set()) {
  if (visited.has(nodeId)) return [];
  visited.add(nodeId);

  const edges = getMROEdgesForNode(nodeId);
  const downstream = [];

  edges.outgoing.forEach(e => {
    const node = getMRONodeById(e.target);
    if (node) {
      downstream.push(node);
      downstream.push(...getMRODownstreamNodes(e.target, visited));
    }
  });

  return Array.from(new Set(downstream)); // Deduplicate
}

/**
 * Find paths between two nodes
 */
export function findMROPaths(fromId, toId, maxDepth = 4) {
  const paths = [];

  function dfs(currentId, targetId, path, depth, visited) {
    if (depth > maxDepth) return;
    if (currentId === targetId) {
      paths.push([...path, currentId]);
      return;
    }

    const edges = getMROEdgesForNode(currentId);
    const nextIds = [
      ...edges.outgoing.map(e => e.target),
      ...edges.incoming.map(e => e.source),
    ];

    nextIds.forEach(nextId => {
      if (!visited.has(nextId)) {
        visited.add(nextId);
        dfs(nextId, targetId, [...path, currentId], depth + 1, visited);
        visited.delete(nextId);
      }
    });
  }

  dfs(fromId, toId, [], 0, new Set([fromId]));
  return paths;
}

/**
 * Get entity type details
 */
export function getMROEntityType(entityTypeId) {
  return MRO_ENTITY_TYPES[entityTypeId];
}

/**
 * Get all entity types as an array
 */
export function getMROEntityTypes() {
  return Object.entries(MRO_ENTITY_TYPES).map(([id, config]) => ({
    id,
    ...config,
  }));
}

/**
 * Get entity type categories
 */
export function getMROCategories() {
  return mroEntityCategories;
}

/**
 * Export default data object
 */
export const mroOntologyData = {
  entityTypes: MRO_ENTITY_TYPES,
  categories: mroEntityCategories,
  nodes: mroGraphNodes,
  edges: mroGraphEdges,
  getMRONodeById,
  getMROEdgesForNode,
  searchMRONodes,
  getMRONodesByType,
  getMROConnectedNodes,
  getMROUpstreamNodes,
  getMRODownstreamNodes,
  findMROPaths,
  getMROEntityType,
  getMROEntityTypes,
  getMROCategories,
};

export default mroOntologyData;
