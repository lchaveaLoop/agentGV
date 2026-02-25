#!/usr/bin/env node

/**
 * AgentGV Release Script
 * 
 * 自动化发布工具，用于创建和推送 Git 标签
 * 
 * 使用方法:
 *   node scripts/release.js              # 交互式发布
 *   node scripts/release.js 5.0.0        # 指定版本号
 *   node scripts/release.js --check      # 检查当前状态
 *   node scripts/release.js --help       # 显示帮助
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf-8', 
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options 
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

// 获取当前 Git 状态
function getCurrentState() {
  const status = exec('git status --porcelain').trim();
  const currentBranch = exec('git rev-parse --abbrev-ref HEAD').trim();
  const lastCommit = exec('git log -1 --oneline').trim();
  
  let currentVersion = 'unknown';
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));
    currentVersion = packageJson.version;
  } catch (e) {
    // Ignore
  }
  
  return {
    hasUncommittedChanges: status.length > 0,
    currentBranch,
    lastCommit,
    currentVersion,
    status
  };
}

// 检查 Git 标签是否存在
function tagExists(tag) {
  try {
    exec(`git rev-parse ${tag}`);
    return true;
  } catch (e) {
    return false;
  }
}

// 创建 Git 标签
function createTag(version, message) {
  const tagName = `v${version}`;
  
  if (tagExists(tagName)) {
    throw new Error(`Tag ${tagName} already exists!`);
  }
  
  log(`Creating tag ${tagName}...`, 'cyan');
  exec(`git tag -a ${tagName} -m "${message}"`);
  log(`✓ Tag ${tagName} created`, 'green');
}

// 推送标签到远程
function pushTag(version, remote = 'origin') {
  const tagName = `v${version}`;
  
  log(`Pushing tag ${tagName} to ${remote}...`, 'cyan');
  exec(`git push ${remote} ${tagName}`);
  log(`✓ Tag ${tagName} pushed to ${remote}`, 'green');
}

// 验证发布准备
function validateRelease(version) {
  log('\n🔍 Validating release preparation...', 'cyan');
  
  const issues = [];
  
  // 检查 package.json
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
    );
    if (packageJson.version !== version) {
      issues.push(`package.json version is ${packageJson.version}, expected ${version}`);
    }
  } catch (e) {
    issues.push('Cannot read package.json');
  }
  
  // 检查发布说明
  const releaseNotesPath = path.join(__dirname, '..', `RELEASE_V${version}.md`);
  if (!fs.existsSync(releaseNotesPath)) {
    issues.push(`Release notes not found: RELEASE_V${version}.md`);
  }
  
  // 检查未提交的变更
  const state = getCurrentState();
  if (state.hasUncommittedChanges) {
    issues.push('Uncommitted changes detected');
  }
  
  if (issues.length > 0) {
    log('\n⚠️  Validation issues:', 'yellow');
    issues.forEach(issue => log(`  - ${issue}`, 'yellow'));
    return false;
  }
  
  log('✓ All validations passed', 'green');
  return true;
}

// 生成发布摘要
function generateReleaseSummary(version) {
  const state = getCurrentState();
  
  log('\n' + '='.repeat(60), 'cyan');
  log('📦 AGENTGV RELEASE SUMMARY', 'magenta');
  log('='.repeat(60), 'cyan');
  log(`\nVersion: v${version}`, 'white');
  log(`Branch: ${state.currentBranch}`, 'white');
  log(`Last Commit: ${state.lastCommit}`, 'white');
  log(`Tag Status: ${tagExists(`v${version}`) ? 'Exists' : 'Will be created'}`, 'white');
  
  log('\n📋 Release Checklist:', 'cyan');
  log(`  ${fs.existsSync(path.join(__dirname, '..', 'package.json')) ? '✓' : '✗'} package.json updated`, 
    fs.existsSync(path.join(__dirname, '..', 'package.json')) ? 'green' : 'red');
  log(`  ${fs.existsSync(path.join(__dirname, '..', `RELEASE_V${version}.md`)) ? '✓' : '✗'} Release notes created`, 
    fs.existsSync(path.join(__dirname, '..', `RELEASE_V${version}.md`)) ? 'green' : 'red');
  log(`  ${!state.hasUncommittedChanges ? '✓' : '✗'} No uncommitted changes`, 
    !state.hasUncommittedChanges ? 'green' : 'yellow');
  
  log('\n' + '='.repeat(60), 'cyan');
}

// 显示帮助
function showHelp() {
  console.log(`
${colors.cyan}AgentGV Release Script${colors.reset}

${colors.yellow}Usage:${colors.reset}
  node scripts/release.js [version] [options]

${colors.yellow}Arguments:${colors.reset}
  version          Version number (e.g., 5.0.0)
  
${colors.yellow}Options:${colors.reset}
  --check          Check current release status
  --help           Show this help message
  --force          Skip validation (not recommended)

${colors.yellow}Examples:${colors.reset}
  node scripts/release.js              # Interactive mode
  node scripts/release.js 5.0.0        # Create v5.0.0 tag
  node scripts/release.js --check      # Check status
  node scripts/release.js --help       # Show help

${colors.yellow}Notes:${colors.reset}
  - Make sure to update package.json before running
  - Release notes should be in RELEASE_V{version}.md
  - All changes should be committed before tagging
`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  // 帮助
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  // 检查状态
  if (args.includes('--check')) {
    const state = getCurrentState();
    log('\n📊 Current Git Status:', 'cyan');
    log(`Branch: ${state.currentBranch}`, 'white');
    log(`Version: ${state.currentVersion}`, 'white');
    log(`Last Commit: ${state.lastCommit}`, 'white');
    log(`Uncommitted Changes: ${state.hasUncommittedChanges ? 'Yes' : 'No'}`, 
      state.hasUncommittedChanges ? 'yellow' : 'green');
    
    if (state.status) {
      log('\nChanged files:', 'cyan');
      log(state.status, 'white');
    }
    
    process.exit(0);
  }
  
  // 获取版本号
  let version = args.find(arg => !arg.startsWith('--'));
  
  if (!version) {
    // 交互式模式
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const state = getCurrentState();
    log(`\n📦 Current version: ${state.currentVersion}`, 'cyan');
    
    version = await new Promise(resolve => {
      rl.question('Enter release version: ', resolve);
    });
    
    rl.close();
  }
  
  if (!version) {
    log('Error: Version is required', 'red');
    process.exit(1);
  }
  
  // 验证
  const force = args.includes('--force');
  if (!force && !validateRelease(version)) {
    log('\n⚠️  Validation failed. Use --force to skip validation.', 'yellow');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question('Continue anyway? (y/N): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() !== 'y') {
      process.exit(1);
    }
  }
  
  // 创建标签
  const tagName = `v${version}`;
  
  if (tagExists(tagName)) {
    log(`\n⚠️  Tag ${tagName} already exists!`, 'yellow');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question('Delete and recreate? (y/N): ', resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() === 'y') {
      exec(`git tag -d ${tagName}`);
      exec(`git push origin :refs/tags/${tagName}`);
      log(`✓ Deleted existing tag ${tagName}`, 'green');
    } else {
      process.exit(0);
    }
  }
  
  const message = `Release V${version}: Complete oh-my-opencode enhancement`;
  
  try {
    createTag(version, message);
    pushTag(version);
    generateReleaseSummary(version);
    
    log('\n✅ Release completed successfully!', 'green');
    log(`\n📦 Published: ${tagName}`, 'cyan');
    log(`📝 Release Notes: RELEASE_V${version}.md`, 'cyan');
    log(`🔗 View on GitHub: https://github.com/lchaveaLoop/agentGV/releases/tag/${tagName}`, 'cyan');
    
  } catch (error) {
    log(`\n❌ Release failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 运行
main().catch(error => {
  log(`\n❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
