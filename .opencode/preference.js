#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MODELS_CONFIG = path.join(__dirname, 'models.json');

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
  case 'list':
    listModels();
    break;
  default:
    console.log('Usage: node preference.js <set|list> [arg]');
    console.log('  set <quality|balanced|cost> - Set preference mode');
    console.log('  list - List available models');
}
