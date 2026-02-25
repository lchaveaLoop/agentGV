#!/usr/bin/env node

/**
 * AgentGV Model Switcher
 * Sync Agent models with current OpenCode Desktop model
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CONFIG_PATH = path.join(process.env.USERPROFILE, '.opencode', 'config.json');

// Available models
const MODELS = {
  '1': { id: 'bailian-coding-plan/qwen3.5-plus', name: 'Qwen3.5 Plus (推荐，支持视觉)' },
  '2': { id: 'bailian-coding-plan/qwen3-max-2026-01-23', name: 'Qwen3 Max (最强，复杂任务)' },
  '3': { id: 'bailian-coding-plan/qwen3-coder-plus', name: 'Qwen3 Coder Plus (代码优化)' },
  '4': { id: 'bailian-coding-plan/qwen3-coder-next', name: 'Qwen3 Coder Next (快速)' },
  '5': { id: 'minimax/m2.5', name: 'MiniMax M2.5' },
  '6': { id: 'opencode/glm-5-free', name: 'GLM-5 Free (免费)' }
};

const AGENTS = [
  'agentgv-router',
  'agentgv-planning',
  'agentgv-operations',
  'agentgv-quality',
  'agentgv-communications',
  'agentgv-administration'
];

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return { agent: {}, agents: {} };
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), 'utf-8');
}

function setModel(modelId, agentName = null) {
  const config = loadConfig();
  
  if (agentName) {
    // Set specific agent
    if (!config[agentName]) {
      config[agentName] = {};
    }
    config[agentName].model = modelId;
    console.log(`✅ ${agentName} model set to: ${modelId}`);
  } else {
    // Set all agents
    let updated = 0;
    AGENTS.forEach(agent => {
      if (config[agent]) {
        config[agent].model = modelId;
        updated++;
      }
    });
    console.log(`✅ Updated ${updated} agents to: ${modelId}`);
  }
  
  saveConfig(config);
}

function showCurrentModels() {
  const config = loadConfig();
  console.log('\n📋 Current Agent Models:\n');
  
  AGENTS.forEach(agent => {
    const model = config[agent]?.model || '(default)';
    console.log(`  ${agent.padEnd(30)} ${model}`);
  });
  console.log();
}

function showMenu() {
  console.log('\n🎯 AgentGV Model Switcher\n');
  console.log('Available models:');
  
  for (const [key, model] of Object.entries(MODELS)) {
    console.log(`  ${key}. ${model.name}`);
  }
  
  console.log('\nCommands:');
  console.log('  <1-6>        - Set all agents to selected model');
  console.log('  <agent> <n>  - Set specific agent (e.g., "router 1")');
  console.log('  show         - Show current models');
  console.log('  q            - Quit\n');
}

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
  
  showMenu();
  showCurrentModels();
  
  while (true) {
    const input = await question('> ');
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    
    if (cmd === 'q' || cmd === 'quit' || cmd === 'exit') {
      break;
    }
    
    if (cmd === 'show') {
      showCurrentModels();
      continue;
    }
    
    if (parts.length === 2) {
      // Specific agent: "router 1"
      const agentName = `agentgv-${parts[0]}`;
      const modelKey = parts[1];
      
      if (AGENTS.includes(agentName) && MODELS[modelKey]) {
        setModel(MODELS[modelKey].id, agentName);
      } else {
        console.log('❌ Invalid agent or model');
      }
      continue;
    }
    
    if (MODELS[cmd]) {
      setModel(MODELS[cmd].id);
    } else {
      console.log('❌ Invalid command. Type a number (1-6) or "show" or "q"');
    }
  }
  
  rl.close();
}

// CLI
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage:');
  console.log('  node set-agent-model.js              - Interactive mode');
  console.log('  node set-agent-model.js <model_id>   - Set all agents');
  console.log('  node set-agent-model.js --show       - Show current models');
  console.log('');
  console.log('Models:');
  for (const [key, model] of Object.entries(MODELS)) {
    console.log(`  ${key} - ${model.id}`);
  }
  process.exit(0);
}

if (args.includes('--show') || args.includes('-s')) {
  showCurrentModels();
  process.exit(0);
}

if (args.length === 1 && MODELS[args[0]]) {
  setModel(MODELS[args[0]].id);
  process.exit(0);
}

// Default: interactive mode
interactiveMode().catch(console.error);
