// Knowledge Graph Data - Shows the reasoning chain from data to conclusions
// This explains HOW the AI agents arrived at their conclusions

export const knowledgeGraphData = {
  nodes: [
    // ============ CENTRAL ANALYSIS NODE ============
    { 
      id: 'analysis', 
      label: 'Efficiency Analysis', 
      sublabel: 'Primary Crusher',
      type: 'central', 
      size: 35,
      color: '#A100FF',
      details: {
        equipment: 'Primary Gyratory Crusher PC-001',
        location: 'Crushing Circuit - Stage 1',
        analysis_period: 'Last 18 months',
        data_points_analyzed: '8,640',
        agents_involved: 5,
        confidence_level: '85%',
        status: 'Analysis Complete'
      }
    },
    
    // ============ DATA SOURCES (Blue) ============
    { 
      id: 'sap_pm', 
      label: 'SAP PM Records', 
      sublabel: '24 work orders',
      type: 'data', 
      group: 'sources',
      color: '#3B82F6',
      details: {
        system: 'SAP S/4HANA PM Module',
        connection: 'Azure Data Factory',
        records_retrieved: 24,
        date_range: 'Jan 2023 - Nov 2024',
        work_order_types: ['Corrective', 'Preventive', 'Emergency'],
        key_fields: ['Order Date', 'Downtime Hours', 'Parts Used', 'Labor Cost'],
        total_downtime: '156 hours',
        average_mttr: '6.5 hours'
      }
    },
    { 
      id: 'timeseries', 
      label: 'Efficiency Timeseries', 
      sublabel: '720 data points',
      type: 'data', 
      group: 'sources',
      color: '#3B82F6',
      details: {
        source: 'OSIsoft PI Historian',
        tag: 'PC001.EFF.HOURLY',
        frequency: 'Hourly readings',
        data_points: 720,
        time_span: '30 days',
        average_efficiency: '82.3%',
        std_deviation: '4.2%',
        min_value: '71.8%',
        max_value: '89.1%'
      }
    },
    { 
      id: 'inspections', 
      label: 'Inspection Reports', 
      sublabel: '8 documents',
      type: 'data', 
      group: 'sources',
      color: '#3B82F6',
      details: {
        source: 'Azure Blob Storage',
        document_type: 'PDF/Scanned Reports',
        documents_analyzed: 8,
        inspection_types: ['Quarterly', 'Monthly', 'Unscheduled'],
        processing: 'Azure AI Document Intelligence',
        key_findings: ['Wear pattern documented', 'Thickness measurements', 'Photo evidence'],
        last_inspection: 'Oct 15, 2024'
      }
    },
    { 
      id: 'inventory', 
      label: 'Inventory System', 
      sublabel: '4 parts found',
      type: 'data', 
      group: 'sources',
      color: '#3B82F6',
      details: {
        system: 'SAP MM Module',
        warehouse: 'W001 - Main Warehouse',
        parts_checked: 12,
        parts_available: 4,
        part_number: 'CJ-8845-A',
        description: 'Crusher Jaw Liner Set',
        unit_cost: '$12,450',
        lead_time: '3-4 weeks (standard)'
      }
    },
    { 
      id: 'geology', 
      label: 'Geological Survey', 
      sublabel: 'Ore composition',
      type: 'data', 
      group: 'sources',
      color: '#3B82F6',
      details: {
        source: 'Mine Planning Database',
        survey_date: 'Q3 2024',
        ore_hardness: 'Bond Index 15.2 (Hard)',
        copper_grade: '0.82%',
        moisture_content: '12.3%',
        clay_content: '8.5%',
        abrasion_index: 'High',
        trend: 'Hardness increasing with depth'
      }
    },
    
    // ============ AGENT FINDINGS (Orange) ============
    { 
      id: 'ro_finding', 
      label: 'Liner replaced 8 months ago', 
      sublabel: 'RO Agent',
      type: 'finding', 
      agent: 'RO',
      color: '#F59E0B',
      details: {
        agent: 'Resource Orchestration Agent',
        tool_called: 'sap_pm_query',
        query_time: '1.2 seconds',
        finding: 'Last liner replacement was 8 months ago (May 2024)',
        work_order: 'WO-2024-0892',
        replacement_date: 'May 15, 2024',
        expected_life: '6 months',
        current_age: '8 months',
        utilization_factor: '1.33x (133% of expected lifecycle)',
        reasoning: 'Exceeded design lifecycle by 2 months, wear accelerated by hard ore'
      }
    },
    { 
      id: 'ta_finding', 
      label: 'Efficiency-Age correlation: 0.92', 
      sublabel: 'TA Agent',
      type: 'finding', 
      agent: 'TA',
      color: '#F59E0B',
      details: {
        agent: 'Timeseries Analysis Agent',
        tool_called: 'statistical_correlation',
        analysis_method: 'Pearson Correlation',
        correlation_coefficient: 0.92,
        p_value: '<0.001',
        interpretation: 'Strong negative correlation between liner age and efficiency',
        trend_direction: 'Declining',
        decline_rate: '-0.8% per week',
        projected_critical_date: 'Dec 15, 2024',
        confidence_interval: '95%'
      }
    },
    { 
      id: 'mi_finding', 
      label: 'Lifecycle: 133% of expected', 
      sublabel: 'MI Agent',
      type: 'finding', 
      agent: 'MI',
      color: '#F59E0B',
      details: {
        agent: 'Maintenance Intelligence Agent',
        tool_called: 'lifecycle_calculator',
        calculation_basis: 'Time-based lifecycle analysis',
        design_lifecycle: '6 months',
        actual_age: '8 months',
        exceedance: '133% (8mo vs 6mo expected)',
        lifecycle_status: 'EXCEEDED',
        weibull_beta: '2.1 (wear-out phase)',
        rpn: '432 (S:8, O:6, D:9)',
        recommended_action: 'Immediate replacement by Jan 20, 2025',
        risk_level: 'Critical'
      }
    },
    { 
      id: 'il_finding', 
      label: 'Parts in stock (7 units total)', 
      sublabel: 'IL Agent',
      type: 'finding', 
      agent: 'IL',
      color: '#F59E0B',
      details: {
        agent: 'Inventory & Logistics Agent',
        tool_called: 'inventory_check',
        parts_available: 'CJ-8845 Fixed Liner (4 units) + CJ-8846 Movable Liner (3 units)',
        warehouse_location: 'WH-02, Bins C47 & C48',
        total_units: 7,
        reorder_point: 2,
        unit_cost: '$12,450.00 per set',
        supplier: 'Metso Outotec',
        lead_time: '0 days (in stock)',
        backup_lead_time: '5 days if backup supplier needed',
        availability_status: 'IN STOCK - Ready for deployment'
      }
    },
    { 
      id: 'ld_finding', 
      label: 'Wear at 65% threshold', 
      sublabel: 'LD Agent',
      type: 'finding', 
      agent: 'LD',
      color: '#F59E0B',
      details: {
        agent: 'Liner Diagnostics Agent',
        tool_called: 'wear_pattern_analysis',
        measurement_method: 'Ultrasonic thickness gauge',
        original_thickness: '120mm',
        current_thickness: '42mm (avg)',
        wear_percentage: '65% remaining (35% worn)',
        critical_zone: 'Zone B - Feed Entry',
        zone_b_wear: '85% degradation (critical)',
        remaining_life: '5-7 days at current wear rate',
        wear_pattern: 'Asymmetric - higher on feed side',
        recommended_action: 'Schedule replacement by Jan 20, 2025'
      }
    },
    
    // ============ CONTRIBUTING FACTORS (Yellow) ============
    { 
      id: 'hard_ore', 
      label: 'Harder ore zone entered', 
      sublabel: 'Bond Index +15%',
      type: 'factor', 
      color: '#FBBF24',
      details: {
        factor_type: 'Geological',
        description: 'Mining has progressed into harder ore zone',
        bond_work_index: '15.2 kWh/t',
        baseline_index: '13.2 kWh/t',
        increase: '+15%',
        impact: 'Accelerated liner wear',
        source: 'Geological Survey Q3 2024',
        mitigation: 'Consider harder liner material grade'
      }
    },
    { 
      id: 'moisture', 
      label: 'Moisture content up 8%', 
      sublabel: 'Recent rainfall',
      type: 'factor', 
      color: '#FBBF24',
      details: {
        factor_type: 'Environmental',
        description: 'Increased moisture in feed material',
        current_moisture: '12.3%',
        baseline_moisture: '11.4%',
        increase: '+8%',
        cause: 'Seasonal rainfall - wet season',
        impact: 'Material sticking, uneven wear distribution',
        mitigation: 'Consider material handling adjustments'
      }
    },
    
    // ============ ROOT CAUSE (Green) ============
    { 
      id: 'root_cause', 
      label: 'ROOT CAUSE: Liner Wear', 
      sublabel: '85% confidence',
      type: 'conclusion', 
      size: 30,
      color: '#10B981',
      details: {
        conclusion: 'Excessive Crusher Liner Wear',
        confidence: '85%',
        primary_evidence: 'Wear measurement at 65% remaining (Zone B critical at 85% degradation)',
        supporting_evidence: [
          'Strong efficiency-age correlation (r=0.92)',
          'Lifecycle: 133% of expected (8mo vs 6mo)',
          'Last replacement: May 15, 2024 (8 months ago)',
          'Hard ore zone (Bond Index +15%)',
          'Remaining useful life: 5-7 days'
        ],
        failure_mode: 'Progressive mechanical wear',
        fmea_severity: 8,
        fmea_occurrence: 6,
        fmea_detection: 9,
        rpn: 432,
        risk_level: 'CRITICAL',
        estimated_impact: '$45,000/day if unplanned failure',
        probability_of_failure: '38% within 7 days',
        weibull_beta: 2.1
      }
    },
    
    // ============ RECOMMENDATIONS (Purple) ============
    { 
      id: 'rec_immediate', 
      label: 'Schedule liner replacement', 
      sublabel: 'Immediate action',
      type: 'recommendation',
      color: '#A100FF',
      details: {
        priority: 'IMMEDIATE',
        action: 'Schedule planned liner replacement',
        timeline: 'By January 20, 2025 (5-7 days)',
        scheduled_window: 'Jan 20, 06:00-14:00',
        estimated_duration: '8 hours',
        required_resources: ['Team A (4 fitters)', 'James Morrison (Lead)', 'Crane', 'Liner handling tools'],
        parts_required: 'CJ-8845 Fixed Liner + CJ-8846 Movable Liner',
        parts_status: 'In stock (4 units @ WH-02)',
        estimated_cost: '$18,500 (parts + labor)',
        production_impact: '8 hours planned downtime',
        vs_unplanned: 'Saves $36,500 vs unplanned failure',
        work_order: 'WO-4000000147 (Created)'
      }
    },
    { 
      id: 'rec_nearterm', 
      label: 'Order backup liners', 
      sublabel: 'Near-term',
      type: 'recommendation',
      color: '#A100FF',
      details: {
        priority: 'NEAR-TERM',
        action: 'Order additional liner sets',
        timeline: 'Within 30 days',
        quantity: '2 additional sets',
        part_number: 'CJ-8845-A',
        total_cost: '$24,900',
        supplier: 'Metso Outotec',
        lead_time: '21 business days',
        reasoning: 'Maintain safety stock given accelerated wear rate'
      }
    },
    { 
      id: 'rec_longterm', 
      label: 'Install wear sensors', 
      sublabel: 'Long-term',
      type: 'recommendation',
      color: '#A100FF',
      details: {
        priority: 'LONG-TERM',
        action: 'Install real-time liner wear monitoring',
        timeline: 'Next scheduled shutdown',
        technology: 'Ultrasonic wear sensors + IoT gateway',
        vendor: 'SKF / Azure IoT',
        estimated_cost: '$45,000 (one-time)',
        annual_savings: '$120,000 (reduced unplanned downtime)',
        roi_period: '4-5 months',
        benefits: ['Real-time wear tracking', 'Predictive alerts', 'Optimized replacement timing']
      }
    },
  ],
  
  links: [
    // ============ DATA TO ANALYSIS ============
    { source: 'sap_pm', target: 'analysis', label: 'retrieved', type: 'data' },
    { source: 'timeseries', target: 'analysis', label: 'queried', type: 'data' },
    { source: 'inspections', target: 'analysis', label: 'analyzed', type: 'data' },
    { source: 'inventory', target: 'analysis', label: 'checked', type: 'data' },
    { source: 'geology', target: 'analysis', label: 'reviewed', type: 'data' },
    
    // ============ ANALYSIS TO AGENT FINDINGS ============
    { source: 'analysis', target: 'ro_finding', label: 'RO discovered', type: 'agent' },
    { source: 'analysis', target: 'ta_finding', label: 'TA correlated', type: 'agent' },
    { source: 'analysis', target: 'mi_finding', label: 'MI calculated', type: 'agent' },
    { source: 'analysis', target: 'il_finding', label: 'IL verified', type: 'agent' },
    { source: 'analysis', target: 'ld_finding', label: 'LD diagnosed', type: 'agent' },
    
    // ============ ANALYSIS TO CONTRIBUTING FACTORS ============
    { source: 'analysis', target: 'hard_ore', label: 'identified', type: 'factor' },
    { source: 'analysis', target: 'moisture', label: 'detected', type: 'factor' },
    
    // ============ FINDINGS TO ROOT CAUSE ============
    { source: 'ro_finding', target: 'root_cause', label: 'supports', type: 'evidence' },
    { source: 'ta_finding', target: 'root_cause', label: 'confirms', type: 'evidence' },
    { source: 'mi_finding', target: 'root_cause', label: 'validates', type: 'evidence' },
    { source: 'ld_finding', target: 'root_cause', label: 'proves', type: 'evidence' },
    
    // ============ FACTORS CONTRIBUTING ============
    { source: 'hard_ore', target: 'root_cause', label: 'accelerates', type: 'contributes' },
    { source: 'moisture', target: 'root_cause', label: 'contributes', type: 'contributes' },
    
    // ============ ROOT CAUSE TO RECOMMENDATIONS ============
    { source: 'root_cause', target: 'rec_immediate', label: 'requires', type: 'action' },
    { source: 'root_cause', target: 'rec_nearterm', label: 'suggests', type: 'action' },
    { source: 'root_cause', target: 'rec_longterm', label: 'recommends', type: 'action' },
    
    // ============ INVENTORY TO RECOMMENDATIONS ============
    { source: 'il_finding', target: 'rec_immediate', label: 'enables', type: 'enables' },
  ],
};

// Node type descriptions for legend
export const nodeTypes = {
  central: { label: 'Analysis Focus', color: '#A100FF', description: 'Primary analysis subject' },
  data: { label: 'Data Sources', color: '#3B82F6', description: 'Information retrieved by agents' },
  finding: { label: 'Agent Findings', color: '#F59E0B', description: 'Discoveries made by AI agents' },
  factor: { label: 'Contributing Factors', color: '#FBBF24', description: 'External influences' },
  conclusion: { label: 'Root Cause', color: '#10B981', description: 'Primary identified cause' },
  recommendation: { label: 'Recommendations', color: '#A100FF', description: 'Suggested actions' },
};

// Agent descriptions
export const agentDescriptions = {
  RO: { name: 'Resource Orchestration', role: 'Maintenance history analysis' },
  TA: { name: 'Timeseries Analysis', role: 'Trend correlation' },
  MI: { name: 'Maintenance Intelligence', role: 'Lifecycle assessment' },
  IL: { name: 'Inventory & Logistics', role: 'Parts availability' },
  LD: { name: 'Liner Diagnostics', role: 'Wear pattern analysis' },
};

export default knowledgeGraphData;

