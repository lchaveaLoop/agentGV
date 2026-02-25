/**
 * AgentGV 配置诊断脚本
 *
 * 检查 opencode.json 配置是否正确
 */

const fs = require('fs');
const path = require('path');

// 颜色
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

function log(msg, color = 'RESET') {
  console.log(`${colors[color] || ''}${msg}${RESET}`);
}

const colors = { RED, GREEN, YELLOW, BLUE, RESET };

function checkConfig(filePath) {
  log(`\n🔍 检查配置文件: ${filePath}`, 'BLUE');
  log('='.repeat(50), 'BLUE');

  if (!fs.existsSync(filePath)) {
    log(`❌ 文件不存在: ${filePath}`, 'RED');
    return false;
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    log(`❌ JSON 解析失败: ${e.message}`, 'RED');
    return false;
  }

  const agents = config.agent || {};
  const agentNames = Object.keys(agents);

  log(`\n📋 发现 ${agentNames.length} 个 Agent:`, 'YELLOW');
  agentNames.forEach(name => {
    const agent = agents[name];
    const mode = agent.mode || 'unknown';
    const model = agent.model || 'unknown';
    const hasTask = agent.tools?.task ? '✅' : '❌';
    log(`  • ${name} [${mode}] ${hasTask} model: ${model}`, 'RESET');
  });

  // 检查 Router 配置
  const router = agents['agentgv-router'];
  if (!router) {
    log(`\n❌ 缺少 agentgv-router (primary agent)`, 'RED');
    return false;
  }

  log(`\n🔎 检查 agentgv-router 配置:`, 'YELLOW');

  // 检查 task 工具
  if (router.tools?.task !== true) {
    log(`  ❌ tools.task 未启用 - 无法调用 subagent!`, 'RED');
  } else {
    log(`  ✅ tools.task 已启用`, 'GREEN');
  }

  // 检查 description
  const desc = router.description || '';
  if (desc.includes('delegate') || desc.includes('委托')) {
    log(`  ✅ description 包含委托指令`, 'GREEN');
  } else {
    log(`  ⚠️  description 缺少委托指令，建议添加 "delegate" 关键词`, 'YELLOW');
  }

  // 检查 subagents
  const subagents = agentNames.filter(name => name !== 'agentgv-router');
  log(`\n📦 发现 ${subagents.length} 个 Subagent:`, 'YELLOW');

  if (subagents.length === 0) {
    log(`  ❌ 没有配置 subagent!`, 'RED');
  }

  subagents.forEach(name => {
    const agent = agents[name];
    const mode = agent.mode || 'unknown';
    const model = agent.model || 'unknown';
    const hidden = agent.hidden ? '🔴 (hidden)' : '🟢';
    log(`  • ${name} [${mode}] ${hidden}`, 'RESET');
    log(`    model: ${model}`, 'RESET');
  });

  // 总结
  log('\n' + '='.repeat(50), 'BLUE');

  const issues = [];

  if (!router.tools?.task) {
    issues.push('Router 缺少 task 工具');
  }

  if (!desc.includes('delegate') && !desc.includes('委托')) {
    issues.push('Router description 缺少委托指令');
  }

  if (subagents.length === 0) {
    issues.push('没有配置 subagent');
  }

  if (issues.length > 0) {
    log('❌ 配置存在问题:', 'RED');
    issues.forEach(issue => log(`  • ${issue}`, 'RED'));
    return false;
  } else {
    log('✅ 配置检查通过!', 'GREEN');
    return true;
  }
}

// 检查当前目录
const configPath = path.join(process.cwd(), 'opencode.json');
checkConfig(configPath);

log('\n💡 提示:', 'BLUE');
log('  • hidden: true 不会阻止通过 task 工具调用 subagent', 'RESET');
log('  • hidden 只是不在列表中显示', 'RESET');
log('  • 关键是 Router 必须有 tools.task: true', 'RESET');
log('  • Router description 必须包含 "delegate" 关键词', 'RESET');
