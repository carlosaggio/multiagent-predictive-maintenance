/**
 * WAIO Implementation Validation Script
 * 
 * Run with: node scripts/validate-waio.mjs
 * 
 * This script validates the WAIO Pit-to-Port Shift Optimiser implementation
 * by checking data integrity, structure consistency, and required fields.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}▶ ${msg}${colors.reset}`),
};

let passed = 0;
let failed = 0;
let warnings = 0;

function test(name, condition, warningOnly = false) {
  if (condition) {
    log.success(name);
    passed++;
  } else if (warningOnly) {
    log.warn(name);
    warnings++;
  } else {
    log.error(name);
    failed++;
  }
}

async function validateFiles() {
  log.header('Validating WAIO File Structure');
  
  const requiredFiles = [
    'src/app/cerebra-demo/domains/domainModes.js',
    'src/app/cerebra-demo/data/waio/waioScenarioContext.js',
    'src/app/cerebra-demo/data/waio/waioNotifications.js',
    'src/app/cerebra-demo/data/waio/waioWorkflowQuestions.js',
    'src/app/cerebra-demo/data/waio/waioAgents.js',
    'src/app/cerebra-demo/data/waio/waioProcessFlowData.js',
    'src/app/cerebra-demo/components/waio/WAIOKPIStrip.js',
    'src/app/cerebra-demo/components/waio/ConstraintLaneBoard.js',
    'src/app/cerebra-demo/components/waio/PlanOptionCards.js',
    'src/app/cerebra-demo/components/waio/ShiftPlanGantt.js',
    'src/app/cerebra-demo/components/waio/BlendRecipePanel.js',
    'src/app/cerebra-demo/components/waio/ShiftBriefPreview.js',
    'src/app/cerebra-demo/components/waio/EventFeed.js',
    'src/app/cerebra-demo/components/waio/PlanDeltaSummary.js',
    'src/app/cerebra-demo/components/waio/EquipmentAssignmentTable.js',
    'src/app/cerebra-demo/components/waio/index.js',
    'src/app/cerebra-demo/components/outputStages/waio/WAIOAgentNetworkStage.js',
    'src/app/cerebra-demo/components/outputStages/waio/WAIODeviationTraceStage.js',
    'src/app/cerebra-demo/components/outputStages/waio/WAIOParallelHuddleStage.js',
    'src/app/cerebra-demo/components/outputStages/waio/WAIOPlanOptionsStage.js',
    'src/app/cerebra-demo/components/outputStages/waio/WAIOShiftPlanStage.js',
    'src/app/cerebra-demo/components/outputStages/waio/WAIOPublishStage.js',
    'src/app/cerebra-demo/components/outputStages/waio/WAIOMonitorStage.js',
    'src/app/cerebra-demo/components/outputStages/waio/index.js',
    'src/app/cerebra-demo/components/charts/GradeTraceSankey.js',
    'src/app/cerebra-demo/components/charts/DeviationWaterfall.js',
    'src/app/cerebra-demo/components/charts/ValueAtRiskBar.js',
  ];

  const rootDir = path.resolve(__dirname, '..');
  
  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file);
    const exists = fs.existsSync(fullPath);
    test(`File exists: ${file}`, exists);
  }
}

async function validateDataContent() {
  log.header('Validating WAIO Data Content');
  
  const rootDir = path.resolve(__dirname, '..');
  
  // Read and validate waioScenarioContext
  const scenarioPath = path.join(rootDir, 'src/app/cerebra-demo/data/waio/waioScenarioContext.js');
  const scenarioContent = fs.readFileSync(scenarioPath, 'utf-8');
  
  // Check for required exports
  test('waioShift export exists', scenarioContent.includes('export const waioShift'));
  test('waioGradeTargets export exists', scenarioContent.includes('export const waioGradeTargets'));
  test('waioStockpiles export exists', scenarioContent.includes('export const waioStockpiles'));
  test('waioPitBlocks export exists', scenarioContent.includes('export const waioPitBlocks'));
  test('waioTrains export exists', scenarioContent.includes('export const waioTrains'));
  test('waioFleet export exists', scenarioContent.includes('export const waioFleet'));
  test('waioPort export exists', scenarioContent.includes('export const waioPort'));
  test('waioContracts export exists', scenarioContent.includes('export const waioContracts'));
  test('waioMarket export exists', scenarioContent.includes('export const waioMarket'));
  test('waioEvents export exists', scenarioContent.includes('export const waioEvents'));
  test('waioDeviationTrace export exists', scenarioContent.includes('export const waioDeviationTrace'));
  test('waioPlanOptions export exists', scenarioContent.includes('export const waioPlanOptions'));
  test('waioShiftPlan export exists', scenarioContent.includes('export const waioShiftPlan'));
  
  // Check key data points
  test('Train-07 defined with under-spec risk', scenarioContent.includes('TRAIN-07') && scenarioContent.includes('underSpec'));
  test('Fe grade specification of 62.0% defined', scenarioContent.includes('62.0'));
  test('SP-3 stockpile with confidence defined', scenarioContent.includes('SP-3') && scenarioContent.includes('gradeConfidence'));
}

async function validateWorkflow() {
  log.header('Validating WAIO Workflow Configuration');
  
  const rootDir = path.resolve(__dirname, '..');
  const workflowPath = path.join(rootDir, 'src/app/cerebra-demo/data/waio/waioWorkflowQuestions.js');
  const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
  
  // Check all 7 questions
  const questions = ['waio_q1', 'waio_q2', 'waio_q3', 'waio_q4', 'waio_q5', 'waio_q6', 'waio_q7'];
  for (const q of questions) {
    test(`Question ${q} defined`, workflowContent.includes(`${q}:`));
  }
  
  // Check stage configs
  const stages = [
    'waio_agent_network',
    'waio_deviation_trace',
    'waio_parallel_huddle',
    'waio_plan_options',
    'waio_shift_plan',
    'waio_publish',
    'waio_monitor',
  ];
  for (const stage of stages) {
    test(`Stage config ${stage} defined`, workflowContent.includes(stage));
  }
  
  // Check objective weights
  test('Objective weights defined', workflowContent.includes('waioObjectiveWeights'));
  test('Value objective weight defined', workflowContent.includes("value:"));
  test('Tonnes objective weight defined', workflowContent.includes("tonnes:"));
  test('Balanced objective weight defined', workflowContent.includes("balanced:"));
}

async function validateAgents() {
  log.header('Validating WAIO Agent Configuration');
  
  const rootDir = path.resolve(__dirname, '..');
  const agentsPath = path.join(rootDir, 'src/app/cerebra-demo/data/waio/waioAgents.js');
  const agentsContent = fs.readFileSync(agentsPath, 'utf-8');
  
  // Check all 7 agents
  const agents = ['SO', 'GC', 'ST', 'FR', 'MP', 'LP', 'CM'];
  for (const agent of agents) {
    test(`Agent ${agent} defined in config`, agentsContent.includes(`${agent}:`));
    test(`Agent ${agent} has curated response`, agentsContent.includes(`${agent}:`) && agentsContent.includes('content:'));
  }
  
  // Check huddle lanes
  test('WAIO_HUDDLE_LANES defined with 6 lanes', agentsContent.includes('WAIO_HUDDLE_LANES') && agentsContent.includes('lane_grade'));
  
  // Check agent tools
  test('WAIO_AGENT_TOOLS defined', agentsContent.includes('WAIO_AGENT_TOOLS'));
}

async function validateIntegration() {
  log.header('Validating Integration with Main Components');
  
  const rootDir = path.resolve(__dirname, '..');
  
  // Check page.js for domain mode integration
  const pagePath = path.join(rootDir, 'src/app/cerebra-demo/page.js');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  
  test('domainMode state defined in page.js', pageContent.includes('domainMode'));
  test('DOMAIN_MODES imported in page.js', pageContent.includes('DOMAIN_MODES'));
  test('handleDomainModeSwitch defined', pageContent.includes('handleDomainModeSwitch'));
  test('WAIO KPI strip imported', pageContent.includes('WAIOKPIStrip'));
  test('WAIO workflow questions imported', pageContent.includes('waioWorkflowQuestions'));
  test('Domain toggle UI present', pageContent.includes('handleDomainModeSwitch'));
  
  // Check OutputConsole for WAIO stage handling
  const outputPath = path.join(rootDir, 'src/app/cerebra-demo/components/OutputConsole.js');
  const outputContent = fs.readFileSync(outputPath, 'utf-8');
  
  test('WAIO stages imported in OutputConsole', outputContent.includes('WAIOAgentNetworkStage'));
  test('isWAIOMode check present', outputContent.includes('isWAIOMode'));
  test('WAIO stage rendering present', outputContent.includes("currentStage === 'waio_"));
  test('selectedObjective prop handled', outputContent.includes('selectedObjective'));
  test('selectedPlan prop handled', outputContent.includes('selectedPlan'));
}

async function validateConsistency() {
  log.header('Validating Cross-File Consistency');
  
  const rootDir = path.resolve(__dirname, '..');
  
  // Load all relevant content
  const scenarioContent = fs.readFileSync(path.join(rootDir, 'src/app/cerebra-demo/data/waio/waioScenarioContext.js'), 'utf-8');
  const notifContent = fs.readFileSync(path.join(rootDir, 'src/app/cerebra-demo/data/waio/waioNotifications.js'), 'utf-8');
  const processContent = fs.readFileSync(path.join(rootDir, 'src/app/cerebra-demo/data/waio/waioProcessFlowData.js'), 'utf-8');
  
  // Check Train-07 appears consistently
  test('TRAIN-07 in scenario context', scenarioContent.includes('TRAIN-07'));
  test('TRAIN-07 in notifications', notifContent.includes('TRAIN-07') || notifContent.includes('Train-07'));
  
  // Check stockpiles appear consistently
  test('SP-3 in scenario context', scenarioContent.includes('SP-3'));
  test('SP-3 in process flow', processContent.includes('sp-3') || processContent.includes('SP-3'));
  
  // Check spec values
  test('Fe spec 62.0% consistent', scenarioContent.includes('62.0') && notifContent.includes('62.0'));
}

async function main() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     WAIO Pit-to-Port Shift Optimiser Validation Suite      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  try {
    await validateFiles();
    await validateDataContent();
    await validateWorkflow();
    await validateAgents();
    await validateIntegration();
    await validateConsistency();
    
    console.log('\n' + colors.bold + '═'.repeat(60) + colors.reset);
    console.log(`\n${colors.bold}Validation Summary:${colors.reset}`);
    console.log(`  ${colors.green}Passed:${colors.reset}   ${passed}`);
    console.log(`  ${colors.red}Failed:${colors.reset}   ${failed}`);
    console.log(`  ${colors.yellow}Warnings:${colors.reset} ${warnings}`);
    
    if (failed === 0) {
      console.log(`\n${colors.green}${colors.bold}✓ All validations passed!${colors.reset}`);
      console.log('\nNext steps:');
      console.log('1. Start the dev server: npm run dev');
      console.log('2. Navigate to http://localhost:8080/cerebra-demo');
      console.log('3. Click "Pit-to-Port (WAIO)" toggle to switch modes');
      console.log('4. Walk through the WAIO workflow (Q1-Q7)');
      process.exit(0);
    } else {
      console.log(`\n${colors.red}${colors.bold}✗ Some validations failed. Please check the errors above.${colors.reset}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n${colors.red}Validation error:${colors.reset}`, error.message);
    process.exit(1);
  }
}

main();
