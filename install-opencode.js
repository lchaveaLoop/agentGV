#!/usr/bin/env node

/**
 * AgentGV V5.0.0 OpenCode Installation Script
 * 
 * 自动安装和配置 AgentGV 到 OpenCode
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkOpenCode() {
  log('\n🔍 检查 OpenCode 安装...', 'cyan');
  try {
    execSync('opencode --version', { stdio: 'pipe' });
    log('✓ OpenCode 已安装', 'green');
    return true;
  } catch (error) {
    log('✗ OpenCode 未安装', 'red');
    log('\n请先安装 OpenCode:', 'yellow');
    log('  npm install -g opencode-ai\n', 'yellow');
    return false;
  }
}

function checkNodeModules() {
  log('\n🔍 检查 Node.js 依赖...', 'cyan');
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('✗ package.json 不存在', 'red');
    return false;
  }
  
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('⚠ node_modules 不存在，正在安装...', 'yellow');
    try {
      execSync('npm install', { stdio: 'inherit' });
      log('✓ 依赖安装完成', 'green');
      return true;
    } catch (error) {
      log('✗ 依赖安装失败', 'red');
      return false;
    }
  }
  
  log('✓ 依赖已安装', 'green');
  return true;
}

function validateConfig() {
  log('\n🔍 验证配置文件...', 'cyan');
  try {
    execSync('npm run validate', { stdio: 'inherit' });
    log('✓ 配置验证通过', 'green');
    return true;
  } catch (error) {
    log('✗ 配置验证失败', 'red');
    return false;
  }
}

function runTests() {
  log('\n🔍 运行测试套件...', 'cyan');
  try {
    execSync('npm test', { stdio: 'inherit' });
    log('✓ 所有测试通过', 'green');
    return true;
  } catch (error) {
    log('⚠ 部分测试失败（非阻塞）', 'yellow');
    return true; // 非阻塞性错误
  }
}

function checkLint() {
  log('\n🔍 检查代码质量...', 'cyan');
  try {
    execSync('npm run lint', { stdio: 'pipe' });
    log('✓ 代码质量检查通过', 'green');
    return true;
  } catch (error) {
    log('⚠ 代码质量警告（非阻塞）', 'yellow');
    return true; // 非阻塞性错误
  }
}

function displayUsage() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🎉 AgentGV V5.0.0 安装完成！', 'green');
  log('='.repeat(60), 'cyan');
  
  log('\n📚 使用指南:\n', 'blue');
  
  log('1. 打开 OpenCode Desktop', 'yellow');
  log('   File → Open Folder → 选择 E:\\Projects\\agentGV\n', 'white');
  
  log('2. 或直接在 CLI 中使用:', 'yellow');
  log('   opencode\n', 'white');
  
  log('3. 开始使用（任意输入）:', 'yellow');
  log('   • "帮我调研 AI 市场"', 'white');
  log('   • "用 Python 开发一个 Web 应用"', 'white');
  log('   • "写一篇科幻小说"', 'white');
  
  log('\n📖 更多文档:', 'yellow');
  log('   • AGENTS.md - Agent 知识库');
  log('   • CONTRIBUTING.md - 贡献指南');
  log('   • docs/user/ - 用户指南');
  log('   • docs/api/ - API 文档\n');
  
  log('🔧 常用命令:', 'yellow');
  log('   npm run validate    - 验证配置');
  log('   npm test            - 运行测试');
  log('   npm run lint        - 代码质量检查');
  log('   node .opencode/status.js - 系统状态检查\n');
  
  log('='.repeat(60), 'cyan');
}

function main() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🚀 AgentGV V5.0.0 OpenCode 安装程序', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const steps = [
    { name: '检查 OpenCode', fn: checkOpenCode, required: true },
    { name: '检查依赖', fn: checkNodeModules, required: true },
    { name: '验证配置', fn: validateConfig, required: true },
    { name: '运行测试', fn: runTests, required: false },
    { name: '代码质量', fn: checkLint, required: false }
  ];
  
  let allPassed = true;
  
  for (const step of steps) {
    const passed = step.fn();
    if (!passed && step.required) {
      allPassed = false;
      log(`\n✗ ${step.name} 失败，安装中止`, 'red');
      break;
    }
  }
  
  if (allPassed) {
    displayUsage();
    
    log('\n💡 提示：安装文档已保存到 INSTALL_OPENCODE.md\n', 'green');
    process.exit(0);
  } else {
    log('\n❌ 安装失败，请检查上述错误信息\n', 'red');
    process.exit(1);
  }
}

// 运行安装程序
main();
