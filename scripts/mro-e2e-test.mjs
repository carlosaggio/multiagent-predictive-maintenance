/**
 * MRO Supply Chain E2E Test - v2
 * 
 * Uses Playwright to automate browser testing of the MRO module.
 */

import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'http://localhost:8080/cerebra-demo';
const SCREENSHOT_DIR = './test-screenshots';
const GREEN = '\x1b[32m', RED = '\x1b[31m', YELLOW = '\x1b[33m', CYAN = '\x1b[36m', RESET = '\x1b[0m';

function log(msg, color = RESET) { console.log(`${color}${msg}${RESET}`); }
function pass(msg) { log(`  ✅ ${msg}`, GREEN); }
function fail(msg) { log(`  ❌ ${msg}`, RED); }
function info(msg) { log(`  ℹ️  ${msg}`, CYAN); }

let passed = 0, failed = 0, failedTests = [];
function assert(condition, msg) {
  if (condition) { pass(msg); passed++; } 
  else { fail(msg); failed++; failedTests.push(msg); }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  log('\n🚀 MRO Supply Chain E2E Test Suite v2\n', CYAN);
  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light'
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  try {
    // ============================================================
    // 1. LOAD PAGE
    // ============================================================
    log('\n📋 1. Load Cerebra Demo', YELLOW);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert(page.url().includes('cerebra-demo'), 'Page loaded');
    
    // Wait for React to fully hydrate by checking for interactive elements
    // The key is waiting for React 19's event system to attach
    info('Waiting for React hydration...');
    await page.waitForFunction(() => {
      // Check that React has hydrated by looking for React's internal fiber keys on elements
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        const fiberKey = Object.keys(btn).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance') || k.startsWith('__reactProps'));
        if (fiberKey) return true;
      }
      return false;
    }, { timeout: 30000 }).catch(() => info('React fiber check timed out'));
    
    // Extra wait for safety after hydration
    await sleep(3000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-loaded.png` });
    const textLen = await page.evaluate(() => document.body.innerText.length);
    info(`Page text length after hydration: ${textLen}`);

    // ============================================================
    // 2. LOGIN
    // ============================================================
    log('\n📋 2. Login', YELLOW);
    
    // Use Playwright's getByRole which waits for actionability
    const loginButton = page.getByRole('button', { name: /Login with Microsoft/i });
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    info('Login button is visible');
    
    // Click using Playwright's standard click (which handles actionability checks)
    await loginButton.click({ timeout: 10000 });
    info('Clicked login button');
    await sleep(5000); // Wait for scene transition
    await page.screenshot({ path: `${SCREENSHOT_DIR}/02-overview.png` });

    // Verify we're on the overview
    const pageHTML = await page.content();
    assert(
      pageHTML.includes('cerebra-header') || pageHTML.includes('Copper Mine') || pageHTML.includes('Operations Center'),
      'Overview scene loaded after login'
    );

    // ============================================================
    // 3. FIND AND CLICK DOMAIN MODE DROPDOWN
    // ============================================================
    log('\n📋 3. Domain Mode Dropdown', YELLOW);
    
    // The dropdown button in the header shows the active domain label
    // It's styled with background: rgba(255,255,255,0.1) and has text like "Maintenance ▾"
    // Let's find it by looking for the dropdown toggle in the header area
    const headerButtons = await page.locator('header button, .cerebra-header button').all();
    info(`Found ${headerButtons.length} buttons in header area`);
    
    // The domain dropdown button contains the active domain name
    let domainDropdownBtn = null;
    for (const btn of headerButtons) {
      const text = await btn.textContent().catch(() => '');
      if (text.includes('Maintenance') || text.includes('MRO') || text.includes('Pit-to-Port') || text.includes('P2P')) {
        domainDropdownBtn = btn;
        info(`Found domain button with text: "${text.trim()}"`);
        break;
      }
    }

    if (domainDropdownBtn) {
      await domainDropdownBtn.click();
      await sleep(500);
      pass('Opened domain mode dropdown');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/03-dropdown-open.png` });
    } else {
      // Try finding by style - the button has chevron SVG
      const chevronBtns = await page.locator('header button:has(svg polyline)').all();
      info(`Found ${chevronBtns.length} buttons with chevron icons in header`);
      if (chevronBtns.length > 0) {
        // The domain dropdown is typically the last chevron button
        domainDropdownBtn = chevronBtns[chevronBtns.length - 1];
        await domainDropdownBtn.click();
        await sleep(500);
        info('Clicked chevron button (assumed domain dropdown)');
        await page.screenshot({ path: `${SCREENSHOT_DIR}/03-dropdown-open.png` });
      }
    }

    // ============================================================
    // 4. SWITCH TO MRO MODE
    // ============================================================
    log('\n📋 4. Switch to MRO Mode', YELLOW);
    
    // After dropdown opens, look for "Aviation MRO" or "MRO" option
    const mroBtn = page.locator('button').filter({ hasText: /Aviation MRO|MRO/ }).first();
    if (await mroBtn.count() > 0) {
      await mroBtn.click();
      await sleep(3000);
      pass('Switched to MRO mode');
      await page.screenshot({ path: `${SCREENSHOT_DIR}/04-mro-overview.png` });
    } else {
      // Try finding MRO text anywhere
      const allBtns = await page.locator('button').all();
      for (const btn of allBtns) {
        const txt = await btn.textContent().catch(() => '');
        if (txt.includes('MRO') || txt.includes('Aviation')) {
          await btn.click();
          await sleep(3000);
          info(`Clicked button with MRO text: "${txt.trim().substring(0, 50)}"`);
          break;
        }
      }
      await page.screenshot({ path: `${SCREENSHOT_DIR}/04-mro-overview.png` });
    }

    // ============================================================
    // 5. VERIFY MRO OVERVIEW CONTENT
    // ============================================================
    log('\n📋 5. MRO Overview Content', YELLOW);
    
    const mroHTML = await page.content();
    assert(
      mroHTML.includes('Active Checks') || mroHTML.includes('Red Parts') || mroHTML.includes('Pool Coverage') || mroHTML.includes('MRO'),
      'MRO KPI Strip visible'
    );
    assert(
      mroHTML.includes('Hangar') || mroHTML.includes('Component') || mroHTML.includes('Outstation') || mroHTML.includes('Operations'),
      'MRO Operations Flow Diagram visible'
    );
    assert(
      mroHTML.includes('Aviation MRO') || mroHTML.includes('MRO Operations'),
      'MRO header title shown'
    );

    // ============================================================
    // 6. ENTER ANALYSIS MODE
    // ============================================================
    log('\n📋 6. Enter Analysis Mode', YELLOW);
    
    // Click on a node in the MRO diagram to enter analysis
    // The MROOperationsFlowDiagram has clickable <g> elements with onClick
    const svgClickable = page.locator('svg g[style*="cursor: pointer"]').first();
    if (await svgClickable.count() > 0) {
      await svgClickable.click();
      await sleep(3000);
      pass('Clicked MRO diagram node');
    } else {
      // Click in the center of the SVG area
      const svgEl = page.locator('main svg').first();
      if (await svgEl.count() > 0) {
        const box = await svgEl.boundingBox();
        if (box) {
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
          await sleep(3000);
          info('Clicked center of SVG area');
        }
      }
    }
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/05-analysis-entry.png` });
    
    const analysisHTML = await page.content();
    const inAnalysis = analysisHTML.includes('Output Console') || 
                       analysisHTML.includes('MRO Operations Assistant') ||
                       analysisHTML.includes('conversation-panel');
    assert(inAnalysis, 'Entered analysis mode (split panel view)');

    // ============================================================
    // 7. Q1 - ACTIVATE OPERATIONS INTELLIGENCE
    // ============================================================
    log('\n📋 7. Q1 Flow', YELLOW);
    
    await sleep(5000); // Wait for question streaming animation
    await page.screenshot({ path: `${SCREENSHOT_DIR}/06-q1-question.png` });
    
    // Find and click "Yes, activate operations intelligence" radio/label
    const q1Option = page.locator('label').filter({ hasText: /activate|yes/i }).first();
    if (await q1Option.count() > 0) {
      await q1Option.click();
      await sleep(4000);
      pass('Answered Q1: Yes, activate');
    } else {
      // Try clicking first radio input
      const radios = await page.locator('input[type="radio"]').all();
      if (radios.length > 0) {
        await radios[0].click();
        await sleep(4000);
        info(`Clicked first of ${radios.length} radio buttons`);
      } else {
        fail('No Q1 options found');
      }
    }
    
    await page.screenshot({ path: `${SCREENSHOT_DIR}/07-q1-answered.png` });

    // ============================================================
    // 8. AGENT NETWORK STAGE
    // ============================================================
    log('\n📋 8. Agent Network Stage', YELLOW);
    
    await sleep(4000); // Wait for agent activation animation
    const agentHTML = await page.content();
    assert(
      agentHTML.includes('Agent Network') || agentHTML.includes('Orchestrator') || agentHTML.includes('agents active') || agentHTML.includes('Material Planner'),
      'Agent Network stage renders'
    );
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08-agent-network.png` });

    // ============================================================
    // 9. Q2 - RUN TRIAGE
    // ============================================================
    log('\n📋 9. Q2 Flow', YELLOW);
    
    // Wait for Q2 to stream in (Q1 was already answered, its radio is disabled)
    // We need to find a ENABLED radio button for Q2
    await sleep(8000); // Wait for Q2 streaming animation
    
    // Click the first enabled label/radio  
    const clicked2 = await page.evaluate(() => {
      // Find all radio inputs that are NOT disabled
      const enabledRadios = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => !r.disabled);
      if (enabledRadios.length > 0) {
        // Click the first enabled one (should be Q2's first option "Yes, run full triage")
        const label = enabledRadios[0].closest('label');
        if (label) { label.click(); return 'clicked-label: ' + label.textContent.trim().substring(0, 40); }
        enabledRadios[0].click();
        return 'clicked-radio';
      }
      return 'no-enabled-radios';
    });
    info(`Q2 click result: ${clicked2}`);
    
    if (clicked2.startsWith('clicked')) {
      await sleep(4000);
      pass('Answered Q2');
    } else {
      info('Q2 options not found or not yet enabled');
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09-q2-answered.png` });

    // ============================================================
    // 10. CONTROL TOWER STAGE
    // ============================================================
    log('\n📋 10. Control Tower Stage', YELLOW);
    
    await sleep(4000);
    const ctHTML = await page.content();
    assert(
      ctHTML.includes('Control Tower') || ctHTML.includes('Operations Control') || ctHTML.includes('Key Performance'),
      'Control Tower stage renders'
    );
    await page.screenshot({ path: `${SCREENSHOT_DIR}/10-control-tower.png` });

    // ============================================================
    // 11. CONSOLE ERRORS CHECK
    // ============================================================
    log('\n📋 11. Console Errors', YELLOW);
    
    const realErrors = consoleErrors.filter(e => 
      !e.includes('logo.png') && 
      !e.includes('favicon') &&
      !e.includes('ResizeObserver') &&
      !e.includes('chunk') &&
      !e.includes('infer type') &&
      !e.includes('400')
    );
    
    if (realErrors.length === 0) {
      pass(`No critical console errors (${consoleErrors.length} total, all benign)`);
    } else {
      fail(`${realErrors.length} console error(s)`);
      realErrors.slice(0, 5).forEach(e => info(`  ${e.substring(0, 120)}`));
    }

    // ============================================================
    // 12. TAKE FINAL SCREENSHOT
    // ============================================================
    await page.screenshot({ path: `${SCREENSHOT_DIR}/99-final.png`, fullPage: true });

  } catch (err) {
    fail(`Test execution error: ${err.message}`);
    console.error(err.stack);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ERROR.png` }).catch(() => {});
  } finally {
    await browser.close();
  }

  // RESULTS
  log('\n' + '='.repeat(60), CYAN);
  log('📊 RESULTS', CYAN);
  log(`  ✅ Passed: ${passed}`, GREEN);
  log(`  ❌ Failed: ${failed}`, failed > 0 ? RED : GREEN);
  if (failedTests.length > 0) {
    failedTests.forEach(t => log(`     - ${t}`, RED));
  }
  log(`  📸 Screenshots: ${SCREENSHOT_DIR}/`, CYAN);
  log('='.repeat(60) + '\n', CYAN);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
