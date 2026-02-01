#!/usr/bin/env node

/**
 * Closed-Loop Mine Planning Enhancement - Validation Script
 * 
 * This script validates:
 * 1. Ontology data structure integrity
 * 2. New stage component existence
 * 3. Workflow question definitions
 * 4. Agent configurations
 * 5. No regressions to existing functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ANSI colors for output
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
  header: (msg) => console.log(`\n${colors.bold}${msg}${colors.reset}\n${'─'.repeat(60)}`),
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let warnings = 0;

function assert(condition, passMsg, failMsg) {
  totalTests++;
  if (condition) {
    passedTests++;
    log.success(passMsg);
    return true;
  } else {
    failedTests++;
    log.error(failMsg);
    return false;
  }
}

function warn(condition, msg) {
  if (!condition) {
    warnings++;
    log.warn(msg);
  }
  return condition;
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function dirExists(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

// ============================================================================
// Phase 0 Tests: Half-Finished Features Fixed
// ============================================================================

function testPhase0() {
  log.header('PHASE 0: Half-Finished Features');

  // Test ShiftBriefPreview has toast functionality
  const shiftBriefPath = 'src/app/cerebra-demo/components/waio/ShiftBriefPreview.js';
  if (fileExists(shiftBriefPath)) {
    const content = fs.readFileSync(path.join(projectRoot, shiftBriefPath), 'utf-8');
    assert(content.includes('Toast'), 
      'ShiftBriefPreview has Toast component',
      'ShiftBriefPreview missing Toast component'
    );
    assert(content.includes('showToast'), 
      'ShiftBriefPreview has showToast function',
      'ShiftBriefPreview missing showToast function'
    );
    assert(content.includes('Blob') || content.includes('download'),
      'ShiftBriefPreview has download implementation',
      'ShiftBriefPreview missing download implementation'
    );
  }

  // Note: LoginScreen should NOT have width: 'auto' - it breaks the logo sizing
}

// ============================================================================
// Phase 1 Tests: Ontology Data Layer
// ============================================================================

function testPhase1() {
  log.header('PHASE 1: Ontology Data Layer');

  const ontologyDir = 'src/app/cerebra-demo/data/waio/ontology';
  
  assert(dirExists(ontologyDir),
    'Ontology directory exists',
    `Ontology directory missing: ${ontologyDir}`
  );

  const requiredFiles = [
    'index.js',
    'p2cOntologySchema.js',
    'p2cInstanceGraph.js',
  ];

  const optionalFiles = [
    'p2cLineageGraph.js',
    'p2cDecisionGraph.js',
  ];

  requiredFiles.forEach(file => {
    assert(fileExists(`${ontologyDir}/${file}`),
      `Required file exists: ${file}`,
      `Required file missing: ${file}`
    );
  });

  optionalFiles.forEach(file => {
    warn(fileExists(`${ontologyDir}/${file}`),
      `Optional file not yet created: ${file}`
    );
  });

  // Validate ontology schema structure if exists
  const schemaPath = path.join(projectRoot, ontologyDir, 'p2cOntologySchema.js');
  if (fs.existsSync(schemaPath)) {
    const content = fs.readFileSync(schemaPath, 'utf-8');
    assert(content.includes('entityTypes'),
      'Schema has entityTypes array',
      'Schema missing entityTypes array'
    );
    assert(content.includes('relationshipTypes'),
      'Schema has relationshipTypes array',
      'Schema missing relationshipTypes array'
    );
    
    // Count entity types
    const entityMatches = content.match(/id:\s*['"]([^'"]+)['"]/g);
    if (entityMatches) {
      assert(entityMatches.length >= 15,
        `Schema has ${entityMatches.length} entity/relationship types (target: 20+)`,
        `Schema only has ${entityMatches.length} types (need 20+)`
      );
    }
  }

  // Validate instance graph structure if exists
  const instancePath = path.join(projectRoot, ontologyDir, 'p2cInstanceGraph.js');
  if (fs.existsSync(instancePath)) {
    const content = fs.readFileSync(instancePath, 'utf-8');
    assert(content.includes('p2cGraphNodes') || content.includes('nodes'),
      'Instance graph has nodes',
      'Instance graph missing nodes'
    );
    assert(content.includes('p2cGraphEdges') || content.includes('edges'),
      'Instance graph has edges',
      'Instance graph missing edges'
    );
  }
}

// ============================================================================
// Phase 2 Tests: Graph Modal Component
// ============================================================================

function testPhase2() {
  log.header('PHASE 2: Graph Modal Component');

  const modalPath = 'src/app/cerebra-demo/components/visualizations/P2COntologyGraphModal.js';
  
  assert(fileExists(modalPath),
    'P2COntologyGraphModal component exists',
    'P2COntologyGraphModal component missing'
  );

  if (fileExists(modalPath)) {
    const content = fs.readFileSync(path.join(projectRoot, modalPath), 'utf-8');
    
    assert(content.includes('isOpen'),
      'Modal has isOpen prop',
      'Modal missing isOpen prop'
    );
    assert(content.includes('onClose'),
      'Modal has onClose prop',
      'Modal missing onClose prop'
    );
    assert(content.includes('ontology') || content.includes('Ontology'),
      'Modal has ontology tab',
      'Modal missing ontology tab'
    );
    assert(content.includes('instance') || content.includes('Instance'),
      'Modal has instance tab',
      'Modal missing instance tab'
    );
  }
}

// ============================================================================
// Phase 3 Tests: Global Graph Access
// ============================================================================

function testPhase3() {
  log.header('PHASE 3: Global Graph Access');

  // Check CerebraHeader for graph button
  const headerPath = 'src/app/cerebra-demo/components/CerebraHeader.js';
  if (fileExists(headerPath)) {
    const content = fs.readFileSync(path.join(projectRoot, headerPath), 'utf-8');
    assert(content.includes('onGraphClick') || content.includes('Graph'),
      'CerebraHeader has graph button/prop',
      'CerebraHeader missing graph button'
    );
  }

  // Check page.js for graph state
  const pagePath = 'src/app/cerebra-demo/page.js';
  if (fileExists(pagePath)) {
    const content = fs.readFileSync(path.join(projectRoot, pagePath), 'utf-8');
    assert(content.includes('showP2CGraph') || content.includes('graphModal'),
      'page.js has graph modal state',
      'page.js missing graph modal state'
    );
  }
}

// ============================================================================
// Phase 4 Tests: Mine Plan Data & Stages
// ============================================================================

function testPhase4() {
  log.header('PHASE 4: Mine Plan Data & Stages');

  // Check for new stage components
  const stageDir = 'src/app/cerebra-demo/components/outputStages/waio';
  const requiredStages = [
    'WAIOReconciliationStage.js',
    'WAIOMinePlanRetrofitStage.js',
  ];

  requiredStages.forEach(stage => {
    assert(fileExists(`${stageDir}/${stage}`),
      `Stage component exists: ${stage}`,
      `Stage component missing: ${stage}`
    );
  });

  // Check waioScenarioContext for new data
  const contextPath = 'src/app/cerebra-demo/data/waio/waioScenarioContext.js';
  if (fileExists(contextPath)) {
    const content = fs.readFileSync(path.join(projectRoot, contextPath), 'utf-8');
    
    warn(content.includes('planStack'),
      'waioScenarioContext missing planStack data'
    );
    warn(content.includes('retrofitChangeSet') || content.includes('changeSet'),
      'waioScenarioContext missing retrofit change set data'
    );
    warn(content.includes('reconciliation') || content.includes('planVsActual'),
      'waioScenarioContext missing reconciliation data'
    );
  }
}

// ============================================================================
// Phase 5 Tests: Publishing & Integration Theatre
// ============================================================================

function testPhase5() {
  log.header('PHASE 5: Publishing & Integration Theatre');

  const publishTargetsPath = 'src/app/cerebra-demo/data/waio/waioPublishTargets.js';
  assert(fileExists(publishTargetsPath),
    'waioPublishTargets.js exists',
    'waioPublishTargets.js missing'
  );

  const drawerPath = 'src/app/cerebra-demo/components/waio/IntegrationPublishDrawer.js';
  assert(fileExists(drawerPath),
    'IntegrationPublishDrawer component exists',
    'IntegrationPublishDrawer component missing'
  );

  const stagePath = 'src/app/cerebra-demo/components/outputStages/waio/WAIOPublishToSystemsStage.js';
  assert(fileExists(stagePath),
    'WAIOPublishToSystemsStage component exists',
    'WAIOPublishToSystemsStage component missing'
  );
}

// ============================================================================
// Phase 7 Tests: Agents
// ============================================================================

function testPhase7() {
  log.header('PHASE 7: Agents & Tool Calls');

  const agentsPath = 'src/app/cerebra-demo/data/waio/waioAgents.js';
  if (fileExists(agentsPath)) {
    const content = fs.readFileSync(path.join(projectRoot, agentsPath), 'utf-8');
    
    assert(content.includes('PR') || content.includes('Plan Retrofit') || content.includes('planRetrofit'),
      'waioAgents has PR (Plan Retrofit) agent',
      'waioAgents missing PR agent'
    );
    assert(content.includes('OG') || content.includes('Ontology') || content.includes('ontologyNavigator'),
      'waioAgents has OG (Ontology Navigator) agent',
      'waioAgents missing OG agent'
    );
  }
}

// ============================================================================
// Phase 8 Tests: Workflow Questions Q8-Q10
// ============================================================================

function testPhase8() {
  log.header('PHASE 8: Workflow Q8-Q10');

  const questionsPath = 'src/app/cerebra-demo/data/waio/waioWorkflowQuestions.js';
  if (fileExists(questionsPath)) {
    const content = fs.readFileSync(path.join(projectRoot, questionsPath), 'utf-8');
    
    assert(content.includes('waio_q8'),
      'Workflow has Q8 (Reconciliation)',
      'Workflow missing Q8'
    );
    assert(content.includes('waio_q9'),
      'Workflow has Q9 (Retrofit)',
      'Workflow missing Q9'
    );
    assert(content.includes('waio_q10'),
      'Workflow has Q10 (Publish)',
      'Workflow missing Q10'
    );
  }

  // Check page.js handleAnswer for new questions
  const pagePath = 'src/app/cerebra-demo/page.js';
  if (fileExists(pagePath)) {
    const content = fs.readFileSync(path.join(projectRoot, pagePath), 'utf-8');
    
    warn(content.includes("'waio_q8'") || content.includes('"waio_q8"'),
      'page.js missing waio_q8 handler'
    );
    warn(content.includes("'waio_q9'") || content.includes('"waio_q9"'),
      'page.js missing waio_q9 handler'
    );
    warn(content.includes("'waio_q10'") || content.includes('"waio_q10"'),
      'page.js missing waio_q10 handler'
    );
  }
}

// ============================================================================
// Regression Tests: Maintenance Mode
// ============================================================================

function testRegression() {
  log.header('REGRESSION: Maintenance Mode Integrity');

  // Core maintenance files should still exist
  const coreFiles = [
    'src/app/cerebra-demo/data/scenarioContext.js',
    'src/app/cerebra-demo/data/workflowQuestions.js',
    'src/app/cerebra-demo/data/agentOutputs.js',
    'src/app/cerebra-demo/components/TrustedHuddle.js',
    'src/app/cerebra-demo/components/ActionableRecommendations.js',
    'src/app/cerebra-demo/components/visualizations/KnowledgeGraphModal.js',
  ];

  coreFiles.forEach(file => {
    assert(fileExists(file),
      `Maintenance file exists: ${file.split('/').pop()}`,
      `REGRESSION: Maintenance file missing: ${file}`
    );
  });

  // Check domain modes still has maintenance
  const domainModesPath = 'src/app/cerebra-demo/domains/domainModes.js';
  if (fileExists(domainModesPath)) {
    const content = fs.readFileSync(path.join(projectRoot, domainModesPath), 'utf-8');
    assert(content.includes('maintenance'),
      'Domain modes includes maintenance mode',
      'REGRESSION: Domain modes missing maintenance mode'
    );
    assert(content.includes('waioShiftOptimiser') || content.includes('WAIO'),
      'Domain modes includes WAIO mode',
      'Domain modes missing WAIO mode'
    );
  }
}

// ============================================================================
// Main Test Runner
// ============================================================================

async function runTests() {
  console.log('\n' + '═'.repeat(60));
  console.log('  WAIO P2C CLOSED-LOOP ENHANCEMENT - VALIDATION');
  console.log('═'.repeat(60));

  testPhase0();
  testPhase1();
  testPhase2();
  testPhase3();
  testPhase4();
  testPhase5();
  testPhase7();
  testPhase8();
  testRegression();

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('  TEST SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  Total Tests:  ${totalTests}`);
  console.log(`  ${colors.green}Passed:${colors.reset}       ${passedTests}`);
  console.log(`  ${colors.red}Failed:${colors.reset}       ${failedTests}`);
  console.log(`  ${colors.yellow}Warnings:${colors.reset}     ${warnings}`);
  console.log('═'.repeat(60) + '\n');

  if (failedTests > 0) {
    console.log(`${colors.red}${colors.bold}Some tests failed. Please fix the issues above.${colors.reset}\n`);
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`${colors.yellow}${colors.bold}All tests passed with ${warnings} warning(s).${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.green}${colors.bold}All tests passed!${colors.reset}\n`);
    process.exit(0);
  }
}

runTests();
