#!/usr/bin/env node

/**
 * OpenCode Config Model Switcher
 * Updates all agent models in C:\Users\lc\.config\opencode\opencode.json
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  '.config',
  'opencode',
  'opencode.json'
);

const MODELS = {
  1: { id: 'bailian-coding-plan/qwen3.5-plus', name: 'Qwen3.5 Plus (推荐，支持视觉)' },
  2: { id: 'bailian-coding-plan/qwen3-max-2026-01-23', name: 'Qwen3 Max (最强，复杂任务)' },
  3: { id: 'bailian-coding-plan/qwen3-coder-plus', name: 'Qwen3 Coder Plus (代码优化)' },
  4: { id: 'bailian-coding-plan/qwen3-coder-next', name: 'Qwen3 Coder Next (快速)' },
  5: { id: 'minimax/MiniMax-M2.5', name: 'MiniMax M2.5 (当前)' }
};

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('❌ Config not found:', CONFIG_PATH);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

function setModel(modelId) {
  const config = loadConfig();

  // Update global model
  config.model = modelId;

  // Update all agent models
  let updated = 0;
  if (config.agent) {
    for (const [agentName, agentConfig] of Object.entries(config.agent)) {
      if (agentConfig.model) {
        agentConfig.model = modelId;
        updated++;
      }
    }
  }

  saveConfig(config);
  console.log(`✅ Updated config: ${modelId}`);
  console.log(`   Global model: ${modelId}`);
  console.log(`   Agents updated: ${updated}`);
  console.log(`   Config path: ${CONFIG_PATH}`);
}

function showCurrent() {
  const config = loadConfig();
  console.log('\n📋 Current Configuration:\n');
  console.log(`Global Model: ${config.model}`);
  console.log('\nAgent Models:');
  for (const [agentName, agentConfig] of Object.entries(config.agent || {})) {
    console.log(`  ${agentName.padEnd(20)} ${agentConfig.model || '(default)'}`);
  }
  console.log();
}

function showMenu() {
  console.log('\n🎯 OpenCode Model Switcher\n');
  console.log('Available models:');
  for (const [key, model] of Object.entries(MODELS)) {
    console.log(`  ${key}. ${model.name}`);
  }
  console.log('\nCommands:');
  console.log('  <1-5>  - Set all to selected model');
  console.log('  show   - Show current config');
  console.log('  q      - Quit\n');
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = prompt => new Promise(resolve => rl.question(prompt, resolve));

async function interactiveMode() {
  showMenu();
  showCurrent();

  while (true) {
    const input = await question('> ');
    const cmd = input.trim().toLowerCase();

    if (cmd === 'q' || cmd === 'quit' || cmd === 'exit') {
      break;
    }

    if (cmd === 'show') {
      showCurrent();
      continue;
    }

    if (MODELS[cmd]) {
      setModel(MODELS[cmd].id);
      console.log('\n✅ Model switched! Restart OpenCode for changes to take effect.\n');
    } else {
      console.log('❌ Invalid. Choose 1-5 or "show" or "q"');
    }
  }

  rl.close();
}

// CLI
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage:');
  console.log('  node switch-opencode-model.js              - Interactive mode');
  console.log('  node switch-opencode-model.js <model_id>   - Set model directly');
  console.log('  node switch-opencode-model.js --show       - Show current config');
  console.log('');
  for (const [key, model] of Object.entries(MODELS)) {
    console.log(`  ${key} - ${model.id}`);
  }
  process.exit(0);
}

if (args.includes('--show') || args.includes('-s')) {
  showCurrent();
  process.exit(0);
}

if (args.length === 1 && MODELS[args[0]]) {
  setModel(MODELS[args[0]].id);
  process.exit(0);
}

interactiveMode().catch(console.error);
