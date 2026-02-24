#!/usr/bin/env node

/**
 * OpenCode Model Detector
 * Detects the current model configured in OpenCode Desktop/CLI
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.env.USERPROFILE || process.env.HOME || '', '.opencode', 'config.json');

// Model aliases and detection rules
const MODEL_ALIASES = {
  // Qwen series
  'qwen3.5-plus': ['qwen3.5-plus', 'qwen3.5+', 'qwen3.5', 'qwen-plus'],
  'qwen3-max-2026-01-23': ['qwen3-max', 'qwen-max', 'qwen3-max-2026-01-23'],
  'qwen3-coder-plus': ['qwen3-coder-plus', 'qwen-coder-plus', 'coder-plus'],
  'qwen3-coder-next': ['qwen3-coder-next', 'qwen-coder-next', 'coder-next'],
  // MiniMax
  'minimax/m2.5': ['minimax/m2.5', 'minimax-m2.5', 'm2.5'],
  // GLM
  'opencode/glm-5-free': ['opencode/glm-5-free', 'glm-5-free', 'glm-5', 'glm5'],
  // Bailian prefix
  'bailian-coding-plan/qwen3.5-plus': ['bailian-coding-plan/qwen3.5-plus', 'bailian/qwen3.5-plus'],
};

// Vision-capable models
const VISION_MODELS = [
  'qwen3.5-plus',
  'bailian-coding-plan/qwen3.5-plus',
];

function detectCurrentModel() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return {
        detected: false,
        model: null,
        reason: 'Config file not found',
        path: CONFIG_PATH
      };
    }

    const configContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(configContent);

    // Try to find the active model
    let detectedModel = null;
    let modelSource = 'unknown';

    // Priority 1: Check if there's a global default model
    if (config.model) {
      detectedModel = config.model;
      modelSource = 'global default';
    }

    // Priority 2: Check current agent's model (if running as subagent)
    const currentAgent = process.env.OPENCODE_AGENT;
    if (currentAgent && config[currentAgent]?.model) {
      detectedModel = config[currentAgent].model;
      modelSource = `agent config (${currentAgent})`;
    }

    // Priority 3: Check router model (most common for AgentGV)
    if (config['agentgv-router']?.model) {
      detectedModel = config['agentgv-router'].model;
      modelSource = 'router config';
    }

    if (!detectedModel) {
      return {
        detected: false,
        model: null,
        reason: 'No model configured in config',
        path: CONFIG_PATH,
        availableAgents: Object.keys(config).filter(k => k.startsWith('agentgv-'))
      };
    }

    // Normalize model name
    const normalizedModel = normalizeModelName(detectedModel);

    return {
      detected: true,
      model: detectedModel,
      normalizedModel,
      source: modelSource,
      path: CONFIG_PATH,
      isVisionCapable: VISION_MODELS.includes(normalizedModel),
      lastModified: fs.statSync(CONFIG_PATH).mtime.toISOString()
    };

  } catch (error) {
    return {
      detected: false,
      model: null,
      reason: `Error reading config: ${error.message}`,
      path: CONFIG_PATH
    };
  }
}

function normalizeModelName(modelName) {
  if (!modelName) return null;

  // Check aliases
  for (const [canonical, aliases] of Object.entries(MODEL_ALIASES)) {
    if (aliases.some(alias => modelName.toLowerCase().includes(alias.toLowerCase()))) {
      return canonical;
    }
  }

  // Return as-is if no match
  return modelName;
}

function checkModelChange(lastKnownModel, lastKnownTime) {
  const current = detectCurrentModel();

  if (!current.detected) {
    return {
      changed: false,
      reason: current.reason,
      current: null
    };
  }

  // Check if model changed
  const modelChanged = current.model !== lastKnownModel;

  // Check if config file was modified
  const fileModified = lastKnownTime && new Date(current.lastModified) > new Date(lastKnownTime);

  return {
    changed: modelChanged || fileModified,
    reason: modelChanged ? 'Model changed' : fileModified ? 'Config updated' : 'No change',
    current,
    previous: lastKnownModel
  };
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
OpenCode Model Detector

Usage:
  node detect-model.js              - Detect current model
  node detect-model.js --watch      - Watch for model changes
  node detect-model.js --json       - Output as JSON
  node detect-model.js --check <last_model> <last_time> - Check if changed

Options:
  --help, -h     Show this help
  --watch, -w    Watch mode (check every 2 seconds)
  --json, -j     Output as JSON
  --check        Check if model changed since last known state
    `);
    process.exit(0);
  }

  if (args.includes('--watch') || args.includes('-w')) {
    console.log('👁️  Watching for model changes... (Ctrl+C to stop)\n');
    let lastModel = null;
    let lastTime = null;

    setInterval(() => {
      const result = checkModelChange(lastModel, lastTime);

      if (result.changed) {
        console.log(`\n🔄 Model changed detected!`);
        console.log(`   Previous: ${result.previous || 'none'}`);
        console.log(`   Current:  ${result.current?.model || 'none'}`);
        console.log(`   Source:   ${result.current?.source || 'unknown'}`);
        console.log(`   Time:     ${new Date().toISOString()}`);
        console.log('');

        lastModel = result.current?.model;
        lastTime = result.current?.lastModified;
      }
    }, 2000);

    // Keep process alive
    process.stdin.resume();
    return;
  }

  if (args.includes('--json') || args.includes('-j')) {
    const result = detectCurrentModel();
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.detected ? 0 : 1);
  }

  if (args.includes('--check') && args.length >= 3) {
    const lastModel = args[1];
    const lastTime = args[2];
    const result = checkModelChange(lastModel, lastTime);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.changed ? 0 : 1);
  }

  // Default: simple detection
  const result = detectCurrentModel();

  if (result.detected) {
    console.log('✅ Model detected:');
    console.log(`   Model:       ${result.model}`);
    console.log(`   Normalized:  ${result.normalizedModel}`);
    console.log(`   Source:      ${result.source}`);
    console.log(`   Vision:      ${result.isVisionCapable ? '✅ Yes' : '❌ No'}`);
    console.log(`   Last Update: ${result.lastModified}`);
    console.log(`   Config Path: ${result.path}`);
  } else {
    console.log('❌ Model detection failed:');
    console.log(`   Reason: ${result.reason}`);
    console.log(`   Path:   ${result.path}`);
  }

  process.exit(result.detected ? 0 : 1);
}

module.exports = { detectCurrentModel, checkModelChange, normalizeModelName };
