/**
 * Regression Test Script
 * 
 * Run with: node scripts/regression-test.mjs
 * 
 * This script validates that the existing maintenance mode functionality
 * remains intact after adding the WAIO Pit-to-Port extension.
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
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}▶ ${msg}${colors.reset}`),
};

let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    log.success(name);
    passed++;
  } else {
    log.error(name);
    failed++;
  }
}

async function validateMaintenanceModeFiles() {
  log.header('Validating Maintenance Mode Files Still Exist');
  
  const requiredFiles = [
    'src/app/cerebra-demo/data/workflowQuestions.js',
    'src/app/cerebra-demo/data/scenarioContext.js',
    'src/app/cerebra-demo/data/miningData.js',
    'src/app/cerebra-demo/hooks/useDynamicAgents.js',
    'src/app/cerebra-demo/components/MiningProcessFlowDiagram.js',
    'src/app/cerebra-demo/components/ConversationPanel.js',
    'src/app/cerebra-demo/components/OutputConsole.js',
    'src/app/cerebra-demo/components/NotificationPanel.js',
    'src/app/cerebra-demo/components/LoginScreen.js',
    'src/app/cerebra-demo/components/CerebraHeader.js',
    'src/app/cerebra-demo/components/visualizations/FaultTreeDiagram.js',
    'src/app/cerebra-demo/components/visualizations/CrusherLinerVisualization.js',
    'src/app/cerebra-demo/components/visualizations/KnowledgeGraphModal.js',
    'src/app/cerebra-demo/components/visualizations/SAPWorkOrderPreview.js',
    'src/app/cerebra-demo/components/AgentNetworkDisplay.js',
    'src/app/cerebra-demo/components/HuddleBanner.js',
    'src/app/cerebra-demo/components/ActionableRecommendations.js',
  ];

  const rootDir = path.resolve(__dirname, '..');
  
  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file);
    const exists = fs.existsSync(fullPath);
    test(`File exists: ${file}`, exists);
  }
}

async function validateMaintenanceDataIntegrity() {
  log.header('Validating Maintenance Data Still Intact');
  
  const rootDir = path.resolve(__dirname, '..');
  
  // Check workflowQuestions.js
  const workflowPath = path.join(rootDir, 'src/app/cerebra-demo/data/workflowQuestions.js');
  const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
  
  test('Q1-Q6 questions exist', 
    workflowContent.includes('q1:') && 
    workflowContent.includes('q2:') && 
    workflowContent.includes('q3:') && 
    workflowContent.includes('q4:') && 
    workflowContent.includes('q5:') && 
    workflowContent.includes('q6:')
  );
  test('faultTreeOptions exported', workflowContent.includes('export const faultTreeOptions'));
  test('huddleAgents exported', workflowContent.includes('export const huddleAgents'));
  test('recommendations exported', workflowContent.includes('export const recommendations'));
  
  // Check scenarioContext.js
  const scenarioPath = path.join(rootDir, 'src/app/cerebra-demo/data/scenarioContext.js');
  const scenarioContent = fs.readFileSync(scenarioPath, 'utf-8');
  
  test('scenarioContext exported', scenarioContent.includes('export const scenarioContext'));
  test('getContextByTopic exported', scenarioContent.includes('export const getContextByTopic'));
  test('Equipment data exists', scenarioContent.includes('equipment'));
  test('Work order data exists', scenarioContent.includes('workOrder'));
  
  // Check miningData.js
  const miningPath = path.join(rootDir, 'src/app/cerebra-demo/data/miningData.js');
  const miningContent = fs.readFileSync(miningPath, 'utf-8');
  
  test('notifications exported', miningContent.includes('export const notifications'));
}

async function validatePageIntegration() {
  log.header('Validating Page.js Integration');
  
  const rootDir = path.resolve(__dirname, '..');
  const pagePath = path.join(rootDir, 'src/app/cerebra-demo/page.js');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  
  // Maintenance mode imports
  test('workflowQuestions imported', pageContent.includes("from './data/workflowQuestions'") || pageContent.includes('from "./data/workflowQuestions"'));
  test('notifications imported from miningData', pageContent.includes("from './data/miningData'") || pageContent.includes('from "./data/miningData"'));
  test('useDynamicAgents imported', pageContent.includes("from './hooks/useDynamicAgents'") || pageContent.includes('from "./hooks/useDynamicAgents"'));
  
  // Scene states
  test('LOGIN scene defined', pageContent.includes('LOGIN'));
  test('OVERVIEW scene defined', pageContent.includes('OVERVIEW'));
  test('ANALYSIS scene defined', pageContent.includes('ANALYSIS'));
  
  // Maintenance workflow handling
  test('handleEquipmentClick defined', pageContent.includes('handleEquipmentClick'));
  test('handleNotificationClick defined', pageContent.includes('handleNotificationClick'));
  test('handleAnswer function defined', pageContent.includes('handleAnswer'));
  test('handleStageComplete function defined', pageContent.includes('handleStageComplete'));
  
  // Maintenance question handling
  test('Maintenance Q1 handling present', pageContent.includes("case 'q1':"));
  test('Maintenance Q2 handling present', pageContent.includes("case 'q2':"));
  test('Maintenance Q3 handling present', pageContent.includes("case 'q3':"));
  test('Maintenance Q4 handling present', pageContent.includes("case 'q4':"));
  test('Maintenance Q5 handling present', pageContent.includes("case 'q5':"));
  test('Maintenance Q6 handling present', pageContent.includes("case 'q6':"));
  
  // Domain mode default
  test('Default domain mode is maintenance', pageContent.includes('DEFAULT_DOMAIN_MODE'));
}

async function validateOutputConsoleIntegration() {
  log.header('Validating OutputConsole Maintenance Support');
  
  const rootDir = path.resolve(__dirname, '..');
  const outputPath = path.join(rootDir, 'src/app/cerebra-demo/components/OutputConsole.js');
  const outputContent = fs.readFileSync(outputPath, 'utf-8');
  
  // Maintenance imports
  test('FaultTreeDiagram imported', outputContent.includes('FaultTreeDiagram'));
  test('CrusherLinerVisualization imported', outputContent.includes('CrusherLinerVisualization'));
  test('KnowledgeGraphModal imported', outputContent.includes('KnowledgeGraphModal'));
  test('SAPWorkOrderPreview imported', outputContent.includes('SAPWorkOrderPreview'));
  test('HuddleBanner imported', outputContent.includes('HuddleBanner'));
  test('ActionableRecommendations imported', outputContent.includes('ActionableRecommendations'));
  test('AgentNetworkDisplay imported', outputContent.includes('AgentNetworkDisplay'));
  test('huddleAgents imported', outputContent.includes('huddleAgents'));
  
  // Maintenance stage handling
  test('agent_network stage handled', outputContent.includes("agent_network"));
  test('initial_analysis stage handled', outputContent.includes("initial_analysis"));
  test('trusted_huddle stage handled', outputContent.includes("trusted_huddle"));
  test('recommendations stage handled', outputContent.includes("recommendations"));
  test('work_order stage handled', outputContent.includes("work_order"));
  
  // Non-WAIO condition for maintenance stages
  test('!isWAIOMode condition for maintenance', outputContent.includes('!isWAIOMode'));
}

async function validateConversationPanel() {
  log.header('Validating ConversationPanel Compatibility');
  
  const rootDir = path.resolve(__dirname, '..');
  const convPath = path.join(rootDir, 'src/app/cerebra-demo/components/ConversationPanel.js');
  const convContent = fs.readFileSync(convPath, 'utf-8');
  
  test('scenarioContext imported', convContent.includes('scenarioContext'));
  test('getContextByTopic imported', convContent.includes('getContextByTopic'));
  test('currentQuestion prop handled', convContent.includes('currentQuestion'));
  test('onAnswer prop handled', convContent.includes('onAnswer'));
  test('answeredQuestions prop handled', convContent.includes('answeredQuestions'));
  test('isLocked prop handled', convContent.includes('isLocked'));
  test('dynamicOptions prop handled', convContent.includes('dynamicOptions'));
  test('handleOptionSelect defined', convContent.includes('handleOptionSelect'));
  test('getOptions function defined', convContent.includes('getOptions'));
}

async function main() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        Maintenance Mode Regression Test Suite              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  try {
    await validateMaintenanceModeFiles();
    await validateMaintenanceDataIntegrity();
    await validatePageIntegration();
    await validateOutputConsoleIntegration();
    await validateConversationPanel();
    
    console.log('\n' + colors.bold + '═'.repeat(60) + colors.reset);
    console.log(`\n${colors.bold}Regression Test Summary:${colors.reset}`);
    console.log(`  ${colors.green}Passed:${colors.reset} ${passed}`);
    console.log(`  ${colors.red}Failed:${colors.reset} ${failed}`);
    
    if (failed === 0) {
      console.log(`\n${colors.green}${colors.bold}✓ All regression tests passed!${colors.reset}`);
      console.log('\nMaintenance mode functionality is intact.');
      process.exit(0);
    } else {
      console.log(`\n${colors.red}${colors.bold}✗ Some regression tests failed. Please investigate.${colors.reset}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n${colors.red}Regression test error:${colors.reset}`, error.message);
    process.exit(1);
  }
}

main();
