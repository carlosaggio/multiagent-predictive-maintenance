/**
 * WAIO Integration Tests
 * 
 * Test suite for the WAIO Pit-to-Port Shift Optimiser demo extension.
 * Run with: npm test -- --testPathPattern=waio-integration
 */

// Import test utilities
import { describe, it, expect, beforeAll } from '@jest/globals';

// Import WAIO modules
import { DOMAIN_MODES, DOMAIN_MODE_IDS, getDomainConfig, isValidDomainMode } from '../domains/domainModes';
import { waioShift, waioGradeTargets, waioStockpiles, waioPitBlocks, waioTrains, waioScenarioContext, getWaioContextByTopic } from '../data/waio/waioScenarioContext';
import { waioNotifications, getNotificationsBySeverity, getCriticalNotifications } from '../data/waio/waioNotifications';
import { waioWorkflowQuestions, waioStageConfig, waioObjectiveWeights } from '../data/waio/waioWorkflowQuestions';
import { WAIO_AGENT_CONFIG, WAIO_CURATED_RESPONSES, WAIO_HUDDLE_LANES } from '../data/waio/waioAgents';
import { waioProcessFlowNodes, waioProcessFlowLinks, waioOverlays } from '../data/waio/waioProcessFlowData';

describe('Domain Mode Configuration', () => {
  it('should have both maintenance and WAIO modes defined', () => {
    expect(DOMAIN_MODES[DOMAIN_MODE_IDS.MAINTENANCE]).toBeDefined();
    expect(DOMAIN_MODES[DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER]).toBeDefined();
  });

  it('should return correct domain config for WAIO mode', () => {
    const config = getDomainConfig(DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER);
    expect(config.id).toBe(DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER);
    expect(config.label).toBe('Pit-to-Port (WAIO)');
    expect(config.headerTitle).toContain('WAIO');
  });

  it('should validate domain mode IDs', () => {
    expect(isValidDomainMode(DOMAIN_MODE_IDS.MAINTENANCE)).toBe(true);
    expect(isValidDomainMode(DOMAIN_MODE_IDS.WAIO_SHIFT_OPTIMISER)).toBe(true);
    expect(isValidDomainMode('invalid_mode')).toBe(false);
  });
});

describe('WAIO Scenario Context', () => {
  it('should have valid shift data', () => {
    expect(waioShift.shiftId).toBeDefined();
    expect(waioShift.kpis).toBeDefined();
    expect(waioShift.kpis.planCompliance).toBeGreaterThanOrEqual(0);
    expect(waioShift.kpis.planCompliance).toBeLessThanOrEqual(1);
    expect(waioShift.kpis.underSpecRisk).toBeGreaterThanOrEqual(0);
    expect(waioShift.kpis.underSpecRisk).toBeLessThanOrEqual(1);
  });

  it('should have valid grade targets', () => {
    expect(waioGradeTargets.spec.Fe.min).toBe(62.0);
    expect(waioGradeTargets.product).toBe('Iron Ore Fines');
    expect(waioGradeTargets.penaltyModel).toBeDefined();
  });

  it('should have stockpile data with grades and confidence', () => {
    expect(waioStockpiles.length).toBeGreaterThan(0);
    waioStockpiles.forEach(sp => {
      expect(sp.id).toBeDefined();
      expect(sp.grade).toBeDefined();
      expect(sp.grade.Fe).toBeGreaterThan(0);
      expect(sp.gradeConfidence).toBeGreaterThanOrEqual(0);
      expect(sp.gradeConfidence).toBeLessThanOrEqual(1);
    });
  });

  it('should have pit blocks with grade distributions', () => {
    expect(waioPitBlocks.length).toBeGreaterThan(0);
    waioPitBlocks.forEach(block => {
      expect(block.id).toBeDefined();
      expect(block.gradeDist).toBeDefined();
      expect(block.gradeDist.Fe.p50).toBeGreaterThan(0);
    });
  });

  it('should have train schedule with predicted grades', () => {
    expect(waioTrains.length).toBeGreaterThan(0);
    const scheduledTrains = waioTrains.filter(t => t.status === 'scheduled');
    scheduledTrains.forEach(train => {
      expect(train.predictedGrade).toBeDefined();
      expect(train.predictedRisk).toBeDefined();
    });
  });

  it('should route topics to correct agents', () => {
    const gradeContext = getWaioContextByTopic('grade compliance check');
    expect(gradeContext.agent).toBe('GC');
    
    const stockpileContext = getWaioContextByTopic('SP-3 stockpile status');
    expect(stockpileContext.agent).toBe('ST');
    
    const fleetContext = getWaioContextByTopic('truck availability');
    expect(fleetContext.agent).toBe('FR');
    
    const portContext = getWaioContextByTopic('port berth status');
    expect(portContext.agent).toBe('LP');
  });
});

describe('WAIO Notifications', () => {
  it('should have notifications with correct structure', () => {
    expect(waioNotifications.length).toBeGreaterThan(0);
    waioNotifications.forEach(notif => {
      expect(notif.id).toBeDefined();
      expect(notif.type).toBeDefined();
      expect(notif.severity).toMatch(/critical|warning|info/);
      expect(notif.title).toBeDefined();
    });
  });

  it('should filter notifications by severity', () => {
    const critical = getNotificationsBySeverity('critical');
    critical.forEach(n => expect(n.severity).toBe('critical'));
    
    const warning = getNotificationsBySeverity('warning');
    warning.forEach(n => expect(n.severity).toBe('warning'));
  });

  it('should have Train-07 under-spec alert', () => {
    const criticalNotifs = getCriticalNotifications();
    const train07Alert = criticalNotifs.find(n => n.entity === 'TRAIN-07');
    expect(train07Alert).toBeDefined();
    expect(train07Alert.type).toBe('grade_risk');
  });
});

describe('WAIO Workflow Questions', () => {
  it('should have all required questions (Q1-Q7)', () => {
    const requiredQuestions = ['waio_q1', 'waio_q2', 'waio_q3', 'waio_q4', 'waio_q5', 'waio_q6', 'waio_q7'];
    requiredQuestions.forEach(qId => {
      expect(waioWorkflowQuestions[qId]).toBeDefined();
      expect(waioWorkflowQuestions[qId].text).toBeDefined();
      expect(waioWorkflowQuestions[qId].options).toBeDefined();
      expect(waioWorkflowQuestions[qId].options.length).toBeGreaterThan(0);
    });
  });

  it('should have valid stage triggers', () => {
    // Q1 should trigger agent network
    expect(waioWorkflowQuestions.waio_q1.triggersOutput).toBe('waio_agent_network');
    
    // Q2 should trigger deviation trace
    expect(waioWorkflowQuestions.waio_q2.triggersOutput).toBe('waio_deviation_trace');
    
    // Q4 should trigger parallel huddle
    expect(waioWorkflowQuestions.waio_q4.triggersOutput).toBe('waio_parallel_huddle');
  });

  it('should have objective weights defined', () => {
    expect(waioObjectiveWeights.value).toBeDefined();
    expect(waioObjectiveWeights.tonnes).toBeDefined();
    expect(waioObjectiveWeights.balanced).toBeDefined();
    expect(waioObjectiveWeights.stability).toBeDefined();
    
    // Weights should sum to 1
    const valueWeights = waioObjectiveWeights.value;
    const sum = valueWeights.value + valueWeights.tonnes + valueWeights.compliance + valueWeights.risk;
    expect(sum).toBeCloseTo(1, 2);
  });

  it('should have stage configs for all stages', () => {
    const requiredStages = [
      'waio_agent_network',
      'waio_deviation_trace',
      'waio_parallel_huddle',
      'waio_plan_options',
      'waio_shift_plan',
      'waio_publish',
      'waio_monitor',
    ];
    requiredStages.forEach(stageId => {
      expect(waioStageConfig[stageId]).toBeDefined();
      expect(waioStageConfig[stageId].title).toBeDefined();
    });
  });
});

describe('WAIO Agent Configuration', () => {
  it('should have all 7 agents defined', () => {
    const requiredAgents = ['SO', 'GC', 'ST', 'FR', 'MP', 'LP', 'CM'];
    requiredAgents.forEach(agentId => {
      expect(WAIO_AGENT_CONFIG[agentId]).toBeDefined();
      expect(WAIO_AGENT_CONFIG[agentId].name).toBeDefined();
      expect(WAIO_AGENT_CONFIG[agentId].color).toBeDefined();
      expect(WAIO_AGENT_CONFIG[agentId].role).toBeDefined();
    });
  });

  it('should have curated responses for all agents', () => {
    Object.keys(WAIO_AGENT_CONFIG).forEach(agentId => {
      expect(WAIO_CURATED_RESPONSES[agentId]).toBeDefined();
      expect(WAIO_CURATED_RESPONSES[agentId].content).toBeDefined();
    });
  });

  it('should have 6 huddle lanes', () => {
    expect(WAIO_HUDDLE_LANES.length).toBe(6);
    WAIO_HUDDLE_LANES.forEach(lane => {
      expect(lane.id).toBeDefined();
      expect(lane.title).toBeDefined();
      expect(lane.agentId).toBeDefined();
      expect(lane.steps).toBeDefined();
      expect(lane.steps.length).toBeGreaterThan(0);
    });
  });

  it('should have orchestrator as SO agent', () => {
    expect(WAIO_AGENT_CONFIG.SO.lane).toBe('orchestrator');
    expect(WAIO_AGENT_CONFIG.SO.name).toBe('Shift Optimiser');
  });
});

describe('WAIO Process Flow Data', () => {
  it('should have nodes covering entire value chain', () => {
    const requiredSections = ['MINING', 'CRUSHING', 'STOCKYARD', 'RAIL_LOADING', 'RAIL_TRANSIT', 'PORT', 'CUSTOMER'];
    requiredSections.forEach(section => {
      const nodesInSection = waioProcessFlowNodes.filter(n => n.section === section);
      expect(nodesInSection.length).toBeGreaterThan(0);
    });
  });

  it('should have valid links between nodes', () => {
    const nodeIds = waioProcessFlowNodes.map(n => n.id);
    waioProcessFlowLinks.forEach(link => {
      expect(nodeIds).toContain(link.source);
      expect(nodeIds).toContain(link.target);
    });
  });

  it('should have overlay data for all required views', () => {
    expect(waioOverlays.gradeRisk).toBeDefined();
    expect(waioOverlays.planCompliance).toBeDefined();
    expect(waioOverlays.constraints).toBeDefined();
  });
});

describe('Data Consistency', () => {
  it('should have consistent train IDs across data sources', () => {
    // Train-07 should appear in trains, notifications, and deviation trace
    const train07 = waioTrains.find(t => t.trainId === 'TRAIN-07');
    expect(train07).toBeDefined();
    
    const train07Notif = waioNotifications.find(n => n.entity === 'TRAIN-07');
    expect(train07Notif).toBeDefined();
    
    const deviationTraceNode = waioScenarioContext.deviationTrace.traceNodes.find(n => n.id === 'TRAIN-07');
    expect(deviationTraceNode).toBeDefined();
  });

  it('should have consistent stockpile IDs', () => {
    const sp3InStockpiles = waioStockpiles.find(sp => sp.id === 'SP-3');
    expect(sp3InStockpiles).toBeDefined();
    
    const sp3InProcess = waioProcessFlowNodes.find(n => n.id === 'sp-3');
    expect(sp3InProcess).toBeDefined();
  });

  it('should have plan options with consistent KPI structure', () => {
    const planOptions = waioScenarioContext.planOptions;
    expect(planOptions.length).toBe(3);
    
    planOptions.forEach(option => {
      expect(option.predictedOutcome).toBeDefined();
      expect(option.predictedOutcome.trainGrades).toBeDefined();
      expect(option.predictedOutcome.totalTonnes).toBeDefined();
      expect(option.predictedOutcome.valueAtRisk).toBeDefined();
      expect(option.keyChanges).toBeDefined();
      expect(option.tradeoffs).toBeDefined();
    });
  });
});

// Manual validation helper (not automated)
describe('Manual Validation Checklist', () => {
  it('should pass manual validation criteria', () => {
    // This test documents what should be manually verified
    const checklist = {
      overviewScreen: {
        domainToggle: 'Toggle between Maintenance and WAIO modes',
        kpiStrip: 'WAIO KPI strip shows 4 KPIs',
        notifications: 'WAIO notifications appear with correct severity',
        digitalTwin: 'Process flow shows pit-to-port value chain',
      },
      analysisScreen: {
        q1: 'Q1 triggers agent network visualization',
        q2: 'Q2 triggers deviation trace',
        q3: 'Q3 objective selection works',
        q4: 'Q4 triggers parallel huddle',
        q5: 'Q5 shows plan options A/B/C',
        q6: 'Q6 publishes plan and shows brief',
        q7: 'Q7 enables monitoring mode',
      },
      visualizations: {
        sankey: 'Grade trace Sankey shows pit to ship flow',
        waterfall: 'Deviation waterfall shows grade impacts',
        laneBoard: 'Parallel lanes show all 6 agents',
        gantt: 'Shift plan Gantt shows 12h schedule',
        blendRecipe: 'Blend recipe shows source proportions',
      },
    };

    // Log checklist for manual reference
    console.log('\nManual Validation Checklist:');
    console.log(JSON.stringify(checklist, null, 2));

    // This test always passes - it's just documentation
    expect(true).toBe(true);
  });
});
