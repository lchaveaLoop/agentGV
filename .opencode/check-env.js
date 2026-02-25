#!/usr/bin/env node

/**
 * AgentGV Environment Check
 * 
 * Cross-platform environment detection tool
 * Checks: Node.js, npm, OS, permissions, dependencies
 * 
 * Usage: node check-env.js [--json] [--verbose]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const REQUIRED_NODE_VERSION = '16.0.0';
const CHECKS = {
  node: 'Node.js runtime',
  npm: 'npm package manager',
  git: 'Git version control',
  permissions: 'File permissions',
  config: 'Configuration files',
  scripts: 'Core scripts',
  skills: 'Skills system'
};

/**
 * Get OS information
 */
function getOSInfo() {
  const platform = os.platform();
  const arch = os.arch();
  const release = os.release();
  
  let osName = platform;
  if (platform === 'win32') {
    osName = `Windows ${release}`;
  } else if (platform === 'darwin') {
    osName = `macOS ${release}`;
  } else if (platform === 'linux') {
    try {
      const osRelease = fs.readFileSync('/etc/os-release', 'utf-8');
      const match = osRelease.match(/^PRETTY_NAME="(.+)"$/m);
      if (match) {osName = match[1];}
    } catch {
      osName = `Linux ${release}`;
    }
  }
  
  return { osName, platform, arch };
}

/**
 * Check Node.js version
 */
function checkNode() {
  try {
    const version = execSync('node --version', { encoding: 'utf-8' }).trim();
    const versionNum = version.replace(/^v/, '');
    
    const required = REQUIRED_NODE_VERSION.split('.').map(Number);
    const actual = versionNum.split('.').map(Number);
    
    const meetsRequirement = 
      actual[0] > required[0] || 
      (actual[0] === required[0] && actual[1] >= required[1]);
    
    return {
      status: meetsRequirement ? 'pass' : 'warning',
      version: versionNum,
      required: REQUIRED_NODE_VERSION,
      message: meetsRequirement ? '✓ Node.js' : `⚠ Node.js (需要 >= ${REQUIRED_NODE_VERSION})`
    };
  } catch (error) {
    return {
      status: 'fail',
      message: '✗ Node.js not found',
      suggestion: 'Install Node.js from https://nodejs.org/'
    };
  }
}

/**
 * Check npm
 */
function checkNpm() {
  try {
    const version = execSync('npm --version', { encoding: 'utf-8' }).trim();
    return {
      status: 'pass',
      version,
      message: '✓ npm'
    };
  } catch (error) {
    return {
      status: 'warning',
      message: '⚠ npm not found',
      suggestion: 'npm is included with Node.js'
    };
  }
}

/**
 * Check git
 */
function checkGit() {
  try {
    const version = execSync('git --version', { encoding: 'utf-8' }).trim();
    return {
      status: 'pass',
      version,
      message: '✓ git'
    };
  } catch (error) {
    return {
      status: 'info',
      message: 'ℹ git not found (optional)',
      suggestion: 'Install from https://git-scm.com/'
    };
  }
}

/**
 * Check file permissions
 */
function checkPermissions() {
  const installDir = path.join(__dirname, '..');
  const testFile = path.join(installDir, '.permissions-test');
  
  try {
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return {
      status: 'pass',
      message: '✓ 文件权限正常'
    };
  } catch (error) {
    return {
      status: 'warning',
      message: '⚠ 文件写入权限受限',
      suggestion: '检查目录权限'
    };
  }
}

/**
 * Check configuration files
 */
function checkConfig() {
  const configDir = path.join(__dirname);
  const requiredFiles = [
    'models.json',
    'skills.json'
  ];
  
  const results = requiredFiles.map(file => {
    const filePath = path.join(configDir, file);
    const exists = fs.existsSync(filePath);
    
    if (!exists) {
      return { file, status: 'fail', message: `✗ ${file} 缺失` };
    }
    
    try {
      JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return { file, status: 'pass', message: `✓ ${file}` };
    } catch (error) {
      return { file, status: 'fail', message: `✗ ${file} 格式错误` };
    }
  });
  
  const allPass = results.every(r => r.status === 'pass');
  
  return {
    status: allPass ? 'pass' : 'fail',
    files: results,
    message: allPass ? '✓ 配置文件完整' : '⚠ 部分配置文件缺失或错误'
  };
}

/**
 * Check core scripts
 */
function checkScripts() {
  const scripts = [
    'status.js',
    'skill-matcher.js',
    'skill-scanner.js',
    'test.js'
  ];
  
  const results = scripts.map(script => {
    const scriptPath = path.join(__dirname, script);
    const exists = fs.existsSync(scriptPath);
    
    return {
      script,
      status: exists ? 'pass' : 'fail',
      message: exists ? `✓ ${script}` : `✗ ${script} 缺失`
    };
  });
  
  const allPass = results.every(r => r.status === 'pass');
  
  return {
    status: allPass ? 'pass' : 'fail',
    scripts: results,
    message: allPass ? '✓ 核心脚本完整' : '⚠ 部分脚本缺失'
  };
}

/**
 * Check skills system
 */
function checkSkills() {
  const skillsDir = path.join(__dirname, 'skills');
  
  if (!fs.existsSync(skillsDir)) {
    return {
      status: 'info',
      message: 'ℹ Skills 目录不存在（可选功能）'
    };
  }
  
  const skillFiles = fs.readdirSync(skillsDir, { recursive: true })
    .filter(f => f.endsWith('SKILL.md'));
  
  return {
    status: 'pass',
    count: skillFiles.length,
    message: `✓ Skills 系统 (${skillFiles.length} 个技能)`
  };
}

/**
 * Run all checks
 */
function runChecks() {
  const osInfo = getOSInfo();
  
  const checks = {
    os: osInfo,
    node: checkNode(),
    npm: checkNpm(),
    git: checkGit(),
    permissions: checkPermissions(),
    config: checkConfig(),
    scripts: checkScripts(),
    skills: checkSkills()
  };
  
  // Calculate overall status
  const statuses = Object.values(checks).map(c => c.status).flat();
  const hasFail = statuses.some(s => s === 'fail');
  const hasWarning = statuses.some(s => s === 'warning');
  
  const overall = hasFail ? 'fail' : (hasWarning ? 'warning' : 'pass');
  
  return {
    timestamp: new Date().toISOString(),
    overall,
    checks
  };
}

/**
 * Print human-readable report
 */
function printReport(results) {
  const { overall, checks } = results;
  
  console.log('\n═══════════════════════════════════════════════');
  console.log('  AgentGV 环境检测');
  console.log('═══════════════════════════════════════════════\n');
  
  // OS Info
  console.log(`🖥️  操作系统：${checks.os.osName} (${checks.os.arch})`);
  console.log(`📅 检测时间：${results.timestamp}\n`);
  
  // Checks
  const checkOrder = ['node', 'npm', 'git', 'permissions', 'config', 'scripts', 'skills'];
  for (const key of checkOrder) {
    const check = checks[key];
    console.log(check.message);
    
    if (check.files) {
      check.files.forEach(f => console.log(`    ${f.message}`));
    }
    if (check.scripts) {
      check.scripts.forEach(s => console.log(`    ${s.message}`));
    }
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════════');
  
  if (overall === 'pass') {
    console.log('✅ 环境检测通过 - 系统就绪\n');
  } else if (overall === 'warning') {
    console.log('⚠️  环境检测警告 - 部分功能可能受限\n');
  } else {
    console.log('❌ 环境检测失败 - 请先修复问题\n');
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json') || args.includes('-j');
  
  const results = runChecks();
  
  if (asJson) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printReport(results);
  }
  
  // Exit code
  process.exit(results.overall === 'fail' ? 1 : 0);
}

module.exports = { runChecks, getOSInfo };
