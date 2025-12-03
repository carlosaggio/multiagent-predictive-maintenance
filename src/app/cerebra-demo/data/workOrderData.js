// SAP S/4HANA Plant Maintenance Work Order Data Structure
// Based on SAP S/4HANA PM Order (MaintenanceOrder API) fields
// Reference: SAP API Business Hub - Maintenance Order v1

export const workOrderData = {
  // Header Section (SAP S/4HANA MaintenanceOrder entity)
  header: {
    // Core identifiers
    workOrderNumber: '4000000147',  // S/4HANA uses numeric order IDs
    maintenanceOrder: '4000000147', // MaintenanceOrder field
    notificationNumber: '10075234', // MaintenanceNotification
    orderType: 'PM02',              // MaintOrdBasicStartDate
    orderCategory: '20',            // OrderCategory (20 = Internal Order)
    
    // Status fields (SAP standard)
    systemStatus: 'CRTD',           // I0001 CRTD=Created, I0002 REL=Released
    userStatus: 'PLAN',             // User-defined status profile
    systemStatusCode: 'I0001',      // SAP internal status code
    statusProfile: 'PMORDER',       // Status profile for PM orders
    
    // Priority and categorization
    priority: '1',                  // MaintenanceOrderPriority (1=Very High)
    priorityText: 'Very High',
    maintOrderProcessingPhase: '1', // 1=Outstanding, 2=In Process
    
    // Organizational data
    plant: 'MINE-01',               // Plant
    planningPlant: 'MINE-01',       // MaintenancePlanningPlant
    companyCode: '1000',            // CompanyCode
    businessArea: 'COPP',           // BusinessArea
    controllingArea: 'COPP',        // ControllingArea
    
    // Work center data
    workCenter: 'CRUSH-WC',         // MainWorkCenter
    mainWorkCenter: 'CRUSH-WC',     // MainWorkCenterPlant
    workCenterPlant: 'MINE-01',     // WorkCenterPlant
    
    // Maintenance activity
    maintenanceActivityType: '002', // MaintActivityType (002=Repair)
    maintenanceActivityTypeText: 'Corrective Repair',
    
    // Administrative data
    createdDate: '2025-01-15',      // CreationDate
    createdBy: 'CEREBRA_AI',        // CreatedByUser
    changedDate: '2025-01-15',      // LastChangeDate
    changedBy: 'CEREBRA_AI',        // LastChangedByUser
    
    // Scheduling
    basicStartDate: '2025-01-20',   // MaintOrdBasicStartDate
    basicFinishDate: '2025-01-20',  // MaintOrdBasicEndDate
    scheduledStartDate: '2025-01-20T06:00:00', // ScheduledStartDateTime
    scheduledFinishDate: '2025-01-20T14:00:00', // ScheduledEndDateTime
    
    // Reference data
    revision: 'REV-2025-W03',       // Revision
    wbsElement: 'MINE-01-MAINT-2025', // WBSElement
    
    // Settlement
    settlementRule: 'COST-CENTER',  // Settlement rule
    costCenter: 'CC-CRUSH-001',     // CostCenter
    settlementReceiver: 'CC-CRUSH-001',
    
    // S/4HANA specific
    businessPartner: '1000042',     // BusinessPartner (vendor if external)
    purchasingDocument: '',         // PurchasingDocument
    isBusinessPurposeCompleted: false,
  },
  
  // Equipment/Functional Location Section
  equipment: {
    functionalLocation: 'MINE-01-CRUSH-001',
    functionalLocationDesc: 'Primary Crushing Circuit',
    equipment: 'CRUSHER-001',
    equipmentDesc: 'Primary Crusher - Jaw Type',
    manufacturer: 'Metso',
    model: 'C160',
    serialNumber: 'MC-2019-45782',
    constructionYear: '2019',
    acquisitionDate: '2019-03-15',
    assetNumber: 'AST-2019-0042',
    technicalObjectType: 'CRUSHER',
    sortField: 'CRUSH-PRI-001',
    abcIndicator: 'A', // Critical equipment
    maintenancePlan: 'MP-CRUSH-001',
  },
  
  // Long Text / Description
  description: {
    shortText: 'Liner Replacement - Primary Crusher (Efficiency Drop)',
    longText: `PROBLEM STATEMENT:
Primary crusher efficiency has dropped from 89% to 82% over the past 30 days, resulting in an estimated production loss of $47,500/day.

ROOT CAUSE ANALYSIS:
- Liner wear degradation identified as primary cause (85% likelihood)
- Inspection shows 65% remaining thickness (critical threshold)
- Accelerated wear attributed to harder ore from new mining zone

AI ANALYSIS SUMMARY:
Cerebra AI agents performed collaborative analysis (Trusted Huddle) involving:
- Resource Orchestration Agent: SAP PM history review
- Timeseries Analysis Agent: Efficiency trend correlation
- Maintenance Intelligence Agent: Lifecycle assessment
- Inventory & Logistics Agent: Parts availability check
- Liner Diagnostics Agent: Wear pattern analysis

RECOMMENDED ACTION:
Immediate liner replacement with parts CJ-8845 (Fixed) and CJ-8846 (Movable).
Scheduled during next planned shutdown window.`,
  },
  
  // Operations (Task List)
  operations: [
    {
      operationNumber: '0010',
      subOperation: '',
      description: 'Isolate and lock out primary crusher per LOTO procedure',
      workCenter: 'CRUSH-WC',
      controlKey: 'PM01',
      duration: 0.5,
      durationUnit: 'H',
      work: 2.0,
      workUnit: 'H',
      numberOfCapacities: 4,
      activityType: 'MECH',
      purchasingGroup: '',
      purchasingOrg: '',
      systemCondition: 'Equipment Isolated',
    },
    {
      operationNumber: '0020',
      subOperation: '',
      description: 'Remove worn fixed jaw liner plates',
      workCenter: 'CRUSH-WC',
      controlKey: 'PM01',
      duration: 1.5,
      durationUnit: 'H',
      work: 6.0,
      workUnit: 'H',
      numberOfCapacities: 4,
      activityType: 'MECH',
      purchasingGroup: '',
      purchasingOrg: '',
      systemCondition: 'Equipment Isolated',
    },
    {
      operationNumber: '0030',
      subOperation: '',
      description: 'Remove worn movable jaw liner plates',
      workCenter: 'CRUSH-WC',
      controlKey: 'PM01',
      duration: 1.5,
      durationUnit: 'H',
      work: 6.0,
      workUnit: 'H',
      numberOfCapacities: 4,
      activityType: 'MECH',
      purchasingGroup: '',
      purchasingOrg: '',
      systemCondition: 'Equipment Isolated',
    },
    {
      operationNumber: '0040',
      subOperation: '',
      description: 'Inspect crusher cavity, eccentric shaft, and bearings',
      workCenter: 'CRUSH-WC',
      controlKey: 'PM01',
      duration: 1.0,
      durationUnit: 'H',
      work: 2.0,
      workUnit: 'H',
      numberOfCapacities: 2,
      activityType: 'INSP',
      purchasingGroup: '',
      purchasingOrg: '',
      systemCondition: 'Equipment Isolated',
    },
    {
      operationNumber: '0050',
      subOperation: '',
      description: 'Install new fixed jaw liner plates (CJ-8845)',
      workCenter: 'CRUSH-WC',
      controlKey: 'PM01',
      duration: 1.5,
      durationUnit: 'H',
      work: 6.0,
      workUnit: 'H',
      numberOfCapacities: 4,
      activityType: 'MECH',
      purchasingGroup: '',
      purchasingOrg: '',
      systemCondition: 'Equipment Isolated',
    },
    {
      operationNumber: '0060',
      subOperation: '',
      description: 'Install new movable jaw liner plates (CJ-8846)',
      workCenter: 'CRUSH-WC',
      controlKey: 'PM01',
      duration: 1.0,
      durationUnit: 'H',
      work: 4.0,
      workUnit: 'H',
      numberOfCapacities: 4,
      activityType: 'MECH',
      purchasingGroup: '',
      purchasingOrg: '',
      systemCondition: 'Equipment Isolated',
    },
    {
      operationNumber: '0070',
      subOperation: '',
      description: 'Perform CSS (Closed Side Setting) adjustment to 150mm',
      workCenter: 'CRUSH-WC',
      controlKey: 'PM01',
      duration: 0.5,
      durationUnit: 'H',
      work: 1.0,
      workUnit: 'H',
      numberOfCapacities: 2,
      activityType: 'MECH',
      purchasingGroup: '',
      purchasingOrg: '',
      systemCondition: 'Equipment Isolated',
    },
    {
      operationNumber: '0080',
      subOperation: '',
      description: 'De-isolate crusher and perform test run',
      workCenter: 'CRUSH-WC',
      controlKey: 'PM01',
      duration: 0.5,
      durationUnit: 'H',
      work: 2.0,
      workUnit: 'H',
      numberOfCapacities: 4,
      activityType: 'MECH',
      purchasingGroup: '',
      purchasingOrg: '',
      systemCondition: 'Equipment Operational',
    },
  ],
  
  // Components (Materials)
  materials: [
    {
      itemNumber: '0010',
      itemCategory: 'L', // Stock item
      materialNumber: 'CJ-8845',
      description: 'Jaw Liner Plate - Fixed (Metso C160)',
      quantity: 2,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      batch: '',
      reservationNumber: 'RES-4521',
      requirementDate: '2025-01-19',
      withdrawalDate: '',
      unitPrice: 4250.00,
      totalValue: 8500.00,
      currency: 'USD',
      availableStock: 4,
      status: 'Available',
    },
    {
      itemNumber: '0020',
      itemCategory: 'L', // Stock item
      materialNumber: 'CJ-8846',
      description: 'Jaw Liner Plate - Movable (Metso C160)',
      quantity: 2,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      batch: '',
      reservationNumber: 'RES-4521',
      requirementDate: '2025-01-19',
      withdrawalDate: '',
      unitPrice: 3800.00,
      totalValue: 7600.00,
      currency: 'USD',
      availableStock: 3,
      status: 'Available',
    },
    {
      itemNumber: '0030',
      itemCategory: 'L', // Stock item
      materialNumber: 'BT-M24X80',
      description: 'Bolt M24x80 Grade 10.9 Zinc Plated',
      quantity: 24,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      batch: '',
      reservationNumber: 'RES-4522',
      requirementDate: '2025-01-19',
      withdrawalDate: '',
      unitPrice: 8.50,
      totalValue: 204.00,
      currency: 'USD',
      availableStock: 120,
      status: 'Available',
    },
    {
      itemNumber: '0040',
      itemCategory: 'L', // Stock item
      materialNumber: 'NT-M24',
      description: 'Nut M24 Grade 10 Zinc Plated',
      quantity: 24,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      batch: '',
      reservationNumber: 'RES-4522',
      requirementDate: '2025-01-19',
      withdrawalDate: '',
      unitPrice: 2.50,
      totalValue: 60.00,
      currency: 'USD',
      availableStock: 200,
      status: 'Available',
    },
    {
      itemNumber: '0050',
      itemCategory: 'L', // Stock item
      materialNumber: 'WS-M24',
      description: 'Washer M24 Flat Zinc Plated',
      quantity: 48,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      batch: '',
      reservationNumber: 'RES-4522',
      requirementDate: '2025-01-19',
      withdrawalDate: '',
      unitPrice: 1.25,
      totalValue: 60.00,
      currency: 'USD',
      availableStock: 500,
      status: 'Available',
    },
    {
      itemNumber: '0060',
      itemCategory: 'L', // Stock item
      materialNumber: 'GR-ANTISEIZE',
      description: 'Anti-Seize Compound 500g',
      quantity: 2,
      unit: 'EA',
      plant: 'MINE-01',
      storageLocation: 'WH-02',
      batch: '',
      reservationNumber: 'RES-4522',
      requirementDate: '2025-01-19',
      withdrawalDate: '',
      unitPrice: 35.00,
      totalValue: 70.00,
      currency: 'USD',
      availableStock: 15,
      status: 'Available',
    },
  ],
  
  // Labor Assignment
  laborAssignment: {
    leadTechnician: 'James Morrison',
    employeeId: 'EMP-0042',
    trade: 'Mechanical Fitter',
    crewName: 'Crushing Maintenance Team A',
    crewSize: 4,
    crewMembers: [
      { name: 'James Morrison', role: 'Lead Technician', trade: 'Mechanical Fitter' },
      { name: 'Robert Chen', role: 'Technician', trade: 'Mechanical Fitter' },
      { name: 'Maria Santos', role: 'Technician', trade: 'Rigger' },
      { name: 'David Wilson', role: 'Apprentice', trade: 'Mechanical Fitter' },
    ],
    estimatedHours: 8,
    actualHours: 0,
    overtimeRequired: false,
    skillMatch: '95%',
    certifications: ['LOTO Certified', 'Confined Space', 'Working at Heights'],
  },
  
  // Schedule
  schedule: {
    scheduledStart: '2025-01-20 06:00',
    scheduledFinish: '2025-01-20 14:00',
    actualStart: null,
    actualFinish: null,
    plannedDowntime: 8, // hours
    actualDowntime: 0,
    productionImpact: 'Full circuit shutdown required',
    shiftPattern: 'Day Shift (06:00-18:00)',
    constraintType: 'Equipment Availability',
    constraintDate: '2025-01-20',
  },
  
  // Cost Estimate
  costEstimate: {
    laborCost: 3200.00,
    laborRate: 100.00,
    laborHours: 32,
    materialCost: 16494.00,
    externalServiceCost: 0.00,
    overheadCost: 480.00,
    totalEstimate: 20174.00,
    currency: 'USD',
    costCenter: 'CC-CRUSH-001',
    wbsElement: 'MINE-01-MAINT-2025',
    settlementRule: 'Cost Center',
    budgetAvailable: 50000.00,
    budgetConsumed: 12500.00,
    budgetRemaining: 37500.00,
  },
  
  // Safety Requirements
  safety: {
    permits: [
      { type: 'LOTO', number: 'LOTO-2025-0234', status: 'Required' },
      { type: 'Confined Space', number: '', status: 'Not Required' },
      { type: 'Hot Work', number: '', status: 'Not Required' },
      { type: 'Working at Heights', number: 'WAH-2025-0089', status: 'Required' },
    ],
    hazards: [
      'Heavy lifting (>25kg)',
      'Pinch points',
      'Falling objects',
      'Stored energy',
    ],
    ppe: [
      'Hard hat',
      'Safety glasses',
      'Steel-toed boots',
      'Hi-vis vest',
      'Cut-resistant gloves',
      'Hearing protection',
    ],
    jsaNumber: 'JSA-CRUSH-001',
    jsaStatus: 'Approved',
  },
  
  // AI Analysis Details
  aiAnalysis: {
    analysisId: 'CEREBRA-2025-0147',
    analysisDate: '2025-01-15 14:32:00',
    confidenceScore: 0.92,
    agentsInvolved: [
      'Resource Orchestration (RO)',
      'Timeseries Analysis (TA)',
      'Maintenance Intelligence (MI)',
      'Inventory & Logistics (IL)',
      'Liner Diagnostics (LD)',
    ],
    dataSourcesUsed: [
      'SAP PM Work Order History',
      'Efficiency Timeseries (30 days)',
      'Inspection Reports (6 months)',
      'Inventory Management System',
      'Geological Survey Data',
    ],
    keyFindings: [
      'Liner thickness at 65% of original (critical threshold: 70%)',
      'Efficiency-age correlation: 0.92',
      'Lifecycle exceeded by 25%',
      'Parts available in stock',
      'Ore hardness increased 15% (Bond Work Index)',
    ],
  },
};

export default workOrderData;


