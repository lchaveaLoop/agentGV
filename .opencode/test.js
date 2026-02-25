#!/usr/bin/env node

/**
 * AgentGV Test Suite
 *
 * Comprehensive tests for AgentGV system components:
 * - Status reporting
 * - Skill matching
 * - Model detection
 * - Configuration validation
 *
 * Usage: node test.js [--verbose]
 */

const { execSync } = require('child_process');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname);

// Test status indicators
const STATUS = {
  PASS: '[+]',
  FAIL: '[-]',
  SKIP: '[!]'
};

/**
 * Run a script and capture output
 */
function runScript(scriptPath, args = '') {
  try {
    const output = execSync(`node "${scriptPath}" ${args}`, {
      encoding: 'utf-8',
      timeout: 10000
    });
    return { success: true, output, error: null };
  } catch (error) {
    return {
      success: false,
      output: error.stdout || '',
      error: error.message,
      exitCode: error.status
    };
  }
}

/**
 * Test status.js script
 */
function testStatusScript(verbose = false) {
  console.log(`\n${STATUS.PASS} Testing status.js...`);

  const result = runScript(path.join(SCRIPTS_DIR, 'status.js'));

  if (result.success) {
    console.log(`   ${STATUS.PASS} Status script runs successfully`);

    // Check for expected sections in output
    const checks = [
      { name: 'Agent status', pattern: /AGENTS/ },
      { name: 'Model status', pattern: /MODELS/ },
      { name: 'Skill status', pattern: /SKILLS/ },
      { name: 'Overall health', pattern: /OVERALL HEALTH/ }
    ];

    for (const check of checks) {
      if (check.pattern.test(result.output)) {
        console.log(`   ${STATUS.PASS} ${check.name} section present`);
      } else {
        console.log(`   ${STATUS.FAIL} ${check.name} section missing`);
        if (verbose) {
          console.log(`      Output: ${result.output.slice(0, 200)}`);
        }
      }
    }

    return true;
  } else {
    console.log(`   ${STATUS.FAIL} Status script failed: ${result.error}`);
    if (verbose) {
      console.log(`   Output: ${result.output}`);
    }
    return false;
  }
}

/**
 * Test skill-matcher.js
 */
function testSkillMatcher(verbose = false) {
  console.log(`\n${STATUS.PASS} Testing skill-matcher.js...`);

  const testCases = [
    { input: '写一篇科幻小说', expected: 'fiction', description: 'Fiction writing' },
    { input: '用 Python 开发程序', expected: 'python', description: 'Python development' },
    { input: '调研 AI 市场', expected: 'market', description: 'Market research' },
    { input: '设计 PCB 电路板', expected: 'pcb', description: 'PCB design' }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    const result = runScript(path.join(SCRIPTS_DIR, 'skill-matcher.js'), `"${test.input}"`);

    if (result.success) {
      try {
        const output = JSON.parse(result.output);
        if (output.skill_id === test.expected) {
          console.log(`   ${STATUS.PASS} ${test.description}: matched ${output.skill_id}`);
          passed++;
        } else {
          console.log(
            `   ${STATUS.FAIL} ${test.description}: expected ${test.expected}, got ${output.skill_id}`
          );
          failed++;
        }
      } catch (e) {
        console.log(`   ${STATUS.FAIL} ${test.description}: invalid JSON output`);
        failed++;
      }
    } else {
      console.log(`   ${STATUS.FAIL} ${test.description}: script failed`);
      failed++;
    }
  }

  // Test error handling (no arguments)
  const noArgsResult = runScript(path.join(SCRIPTS_DIR, 'skill-matcher.js'));
  if (!noArgsResult.success && noArgsResult.exitCode === 1) {
    console.log(`   ${STATUS.PASS} Error handling: shows usage on no args`);
    passed++;
  } else {
    console.log(`   ${STATUS.FAIL} Error handling: should show usage on no args`);
    failed++;
  }

  console.log(`   Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Test configuration files
 */
function testConfigFiles(verbose = false) {
  console.log(`\n${STATUS.PASS} Testing configuration files...`);

  const fs = require('fs');

  const configFiles = [
    { path: path.join(SCRIPTS_DIR, 'models.json'), name: 'models.json' },
    { path: path.join(SCRIPTS_DIR, 'skills.json'), name: 'skills.json' },
    { path: path.join(__dirname, '..', 'opencode.json'), name: 'opencode.json' }
  ];

  let allValid = true;

  for (const config of configFiles) {
    if (!fs.existsSync(config.path)) {
      console.log(`   ${STATUS.FAIL} ${config.name}: not found`);
      allValid = false;
      continue;
    }

    try {
      const content = fs.readFileSync(config.path, 'utf-8');
      JSON.parse(content);
      console.log(`   ${STATUS.PASS} ${config.name}: valid JSON`);
    } catch (error) {
      console.log(`   ${STATUS.FAIL} ${config.name}: invalid JSON - ${error.message}`);
      allValid = false;
      if (verbose) {
        console.log(`      Error: ${error.message}`);
      }
    }
  }

  return allValid;
}

/**
 * Test required scripts exist
 */
function testRequiredScripts(verbose = false) {
  console.log(`\n${STATUS.PASS} Testing required scripts...`);

  const fs = require('fs');

  const requiredScripts = [
    'status.js',
    'skill-matcher.js',
    'detect-model.js',
    'auto-sync-model.js',
    'preference.js'
  ];

  let allPresent = true;

  for (const script of requiredScripts) {
    const scriptPath = path.join(SCRIPTS_DIR, script);
    if (fs.existsSync(scriptPath)) {
      console.log(`   ${STATUS.PASS} ${script}: present`);
    } else {
      console.log(`   ${STATUS.FAIL} ${script}: missing`);
      allPresent = false;
    }
  }

  return allPresent;
}

/**
 * Run all tests
 */
function runAllTests(verbose = false) {
  console.log('============================================================');
  console.log('         AgentGV Test Suite');
  console.log('============================================================');
  console.log(`  Date: ${new Date().toISOString()}`);
  console.log('============================================================');

  const results = {
    statusScript: testStatusScript(verbose),
    skillMatcher: testSkillMatcher(verbose),
    configFiles: testConfigFiles(verbose),
    requiredScripts: testRequiredScripts(verbose)
  };

  console.log('\n============================================================');
  console.log('  Test Summary');
  console.log('============================================================');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.values(results).length;

  if (passed === total) {
    console.log(`  ${STATUS.PASS} All ${total} tests passed!`);
    console.log('============================================================\n');
    return 0;
  } else {
    console.log(`  ${STATUS.FAIL} ${passed}/${total} tests passed`);
    console.log('============================================================\n');
    return 1;
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose') || args.includes('-v');

  const exitCode = runAllTests(verbose);
  process.exit(exitCode);
}

module.exports = { runAllTests, testStatusScript, testSkillMatcher, testConfigFiles };
