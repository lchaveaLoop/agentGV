#!/usr/bin/env node

/**
 * AgentGV Auto Model Sync Hook
 * Automatically syncs Agent models with OpenCode's current model before each Router execution
 * 
 * Usage: This script is called by Router before processing tasks
 */

const fs = require('fs');
const path = require('path');
const { detectCurrentModel } = require('./detect-model');

const CONFIG_PATH = path.join(process.env.USERPROFILE || '', '.opencode', 'config.json');
const SYNC_STATE_PATH = path.join(__dirname, '.model-sync-state.json');

const AGENTS = [
  'agentgv-router',
  'agentgv-planning',
  'agentgv-operations',
  'agentgv-quality',
  'agentgv-communications',
  'agentgv-administration'
];

// Models that support vision
const VISION_MODELS = [
  'qwen3.5-plus',
  'bailian-coding-plan/qwen3.5-plus'
];

function loadState() {
  try {
    if (fs.existsSync(SYNC_STATE_PATH)) {
      return JSON.parse(fs.readFileSync(SYNC_STATE_PATH, 'utf-8'));
    }
  } catch (e) {
    // Ignore errors
  }
  return { lastModel: null, lastSync: null };
}

function saveState(state) {
  try {
    fs.writeFileSync(SYNC_STATE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    // Ignore errors
  }
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4), 'utf-8');
}

function needsSync(currentModel) {
  const state = loadState();
  
  // Force sync if never synced before
  if (!state.lastModel) {
    return { needs: true, reason: 'First time sync' };
  }
  
  // Check if model changed
  if (state.lastModel !== currentModel) {
    return { needs: true, reason: 'Model changed', from: state.lastModel, to: currentModel };
  }
  
  // Check if config was modified recently (within 5 seconds)
  try {
    const mtime = fs.statSync(CONFIG_PATH).mtime;
    const now = new Date();
    const diffMs = now - mtime;
    
    if (diffMs < 5000) {
      return { needs: true, reason: 'Config recently modified' };
    }
  } catch (e) {
    // Ignore
  }
  
  return { needs: false, reason: 'Already synced' };
}

function syncAgents(targetModel) {
  const config = loadConfig();
  if (!config) {
    return { success: false, error: 'Config not found' };
  }
  
  let updated = 0;
  const updatedAgents = [];
  
  AGENTS.forEach(agent => {
    if (!config[agent]) {
      config[agent] = {};
    }
    
    // Only update if different
    if (config[agent].model !== targetModel) {
      config[agent].model = targetModel;
      updated++;
      updatedAgents.push(agent);
    }
  });
  
  if (updated > 0) {
    saveConfig(config);
  }
  
  return {
    success: true,
    updated,
    updatedAgents,
    model: targetModel
  };
}

function autoSync(force = false) {
  const detection = detectCurrentModel();
  
  if (!detection.detected) {
    return {
      synced: false,
      reason: detection.reason,
      detection
    };
  }
  
  const currentModel = detection.model;
  const syncCheck = needsSync(currentModel);
  
  // Skip sync if not needed (unless forced)
  if (!force && !syncCheck.needs) {
    return {
      synced: false,
      reason: syncCheck.reason,
      currentModel,
      detection
    };
  }
  
  // Perform sync
  const syncResult = syncAgents(currentModel);
  
  if (syncResult.success) {
    // Update state
    saveState({
      lastModel: currentModel,
      lastSync: new Date().toISOString(),
      syncCount: (loadState().syncCount || 0) + 1
    });
    
    return {
      synced: true,
      reason: syncCheck.reason,
      currentModel,
      syncResult,
      detection
    };
  }
  
  return {
    synced: false,
    reason: syncResult.error,
    currentModel,
    detection
  };
}

// Output for Router consumption
function outputResult(result) {
  if (result.synced) {
    console.log(`🔄 Auto-sync: ${result.currentModel}`);
    console.log(`   Reason: ${result.reason}`);
    console.log(`   Updated: ${result.syncResult.updated} agents`);
    if (result.syncResult.updatedAgents.length > 0) {
      console.log(`   Agents: ${result.syncResult.updatedAgents.join(', ')}`);
    }
  } else {
    console.log(`⏭️  Skip sync: ${result.reason}`);
    if (result.currentModel) {
      console.log(`   Current: ${result.currentModel}`);
    }
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  const json = args.includes('--json') || args.includes('-j');
  const quiet = args.includes('--quiet') || args.includes('-q');
  
  const result = autoSync(force);
  
  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (!quiet) {
    outputResult(result);
  }
  
  process.exit(result.synced ? 0 : 1);
}

module.exports = { autoSync, needsSync, syncAgents, detectCurrentModel };
