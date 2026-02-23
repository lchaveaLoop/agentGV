#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MODELS_CONFIG = path.join(__dirname, 'models.json');
const STATS_FILE = path.join(__dirname, 'usage-stats.json');

function updatePreference(mode) {
  const config = JSON.parse(fs.readFileSync(MODELS_CONFIG, 'utf-8'));
  const validModes = ['quality_priority', 'balanced', 'cost_saving'];
  
  if (!validModes.includes(mode)) {
    console.error(`❌ Invalid mode. Valid options: ${validModes.join(', ')}`);
    process.exit(1);
  }
  
  config.current_preference = mode;
  fs.writeFileSync(MODELS_CONFIG, JSON.stringify(config, null, 2));
  console.log(`✅ Model preference set to: ${mode}`);
  
  const pref = config.user_preferences[mode];
  console.log(`   Description: ${pref.description}`);
  console.log(`   Default model: ${pref.default_model}`);
  console.log(`   Complex upgrade: ${pref.complex_upgrade}`);
}

function showStats(reset = false) {
  let stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
  
  if (reset) {
    stats = {
      period: new Date().toISOString().slice(0, 7),
      last_updated: new Date().toISOString().slice(0, 10),
      total_requests: 0,
      by_model: Object.keys(stats.by_model).reduce((acc, k) => ({...acc, [k]: {count: 0, tokens_used: 0}}), {}),
      by_agent: Object.keys(stats.by_agent).reduce((acc, k) => ({...acc, [k]: {count: 0}}), {}),
      by_task_type: Object.keys(stats.by_task_type).reduce((acc, k) => ({...acc, [k]: {count: 0}}), {}),
      by_preference: Object.keys(stats.by_preference).reduce((acc, k) => ({...acc, [k]: {count: 0}}), {})
    };
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    console.log('✅ Statistics reset for new period');
    return;
  }
  
  console.log(`📊 Usage Statistics (${stats.period})`);
  console.log(`Total Requests: ${stats.total_requests}`);
  console.log('\nBy Model:');
  for (const [model, data] of Object.entries(stats.by_model)) {
    if (data.count > 0) console.log(`  ${model}: ${data.count} requests`);
  }
  console.log('\nBy Agent:');
  for (const [agent, data] of Object.entries(stats.by_agent)) {
    if (data.count > 0) console.log(`  ${agent}: ${data.count}`);
  }
}

function listModels() {
  const config = JSON.parse(fs.readFileSync(MODELS_CONFIG, 'utf-8'));
  console.log('📋 Available Models:\n');
  config.models.forEach((m, i) => {
    console.log(`${i + 1}. ${m.name} (${m.short_id})`);
    console.log(`   Cost: ${m.cost_level}`);
    console.log(`   Best for: ${m.best_for.join(', ')}`);
  });
  console.log(`\nCurrent preference: ${config.current_preference || 'quality_priority'}`);
}

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'set':
    updatePreference(arg);
    break;
  case 'stats':
    showStats(arg === 'reset');
    break;
  case 'list':
    listModels();
    break;
  default:
    console.log('Usage: node preference.js <set|stats|list> [arg]');
    console.log('  set <quality|balanced|cost> - Set preference mode');
    console.log('  stats [reset] - Show or reset statistics');
    console.log('  list - List available models');
}
