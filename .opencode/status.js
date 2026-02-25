#!/usr/bin/env node

/**
 * AgentGV System Status Reporter
 *
 * Provides comprehensive status reporting for the AgentGV system:
 * - Agent configuration status
 * - Model availability and sync status
 * - Skill matching system health
 * - Environment configuration
 * - Dependency checks
 *
 * Usage: node .opencode/status.js [--json] [--quiet]
 */

const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(__dirname);
const ROOT_DIR = path.join(__dirname, '..');

// Status indicators (use ASCII for cross-platform compatibility)
const STATUS = {
  OK: '[+]',
  WARNING: '[!]',
  ERROR: '[-]',
  INFO: '[i]'
};

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Read JSON file safely
 */
function readJsonFile(filePath) {
  try {
    if (!fileExists(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Check agent configuration status
 */
function checkAgentConfig() {
  const opencodeConfig = readJsonFile(path.join(ROOT_DIR, 'opencode.json'));
  const modelsConfig = readJsonFile(path.join(CONFIG_DIR, 'models.json'));
  const skillsConfig = readJsonFile(path.join(CONFIG_DIR, 'skills.json'));

  const agents = {
    router: opencodeConfig?.agent?.['agentgv-router'],
    planning: opencodeConfig?.agent?.['agentgv-planning'],
    operations: opencodeConfig?.agent?.['agentgv-operations'],
    quality: opencodeConfig?.agent?.['agentgv-quality']
  };

  const status = {
    config_files: {
      opencode_json: opencodeConfig ? STATUS.OK : STATUS.ERROR,
      models_json: modelsConfig ? STATUS.OK : STATUS.ERROR,
      skills_json: skillsConfig ? STATUS.OK : STATUS.ERROR
    },
    agents: {},
    total_agents: 0,
    active_agents: 0
  };

  for (const [name, agent] of Object.entries(agents)) {
    if (agent) {
      status.agents[name] = {
        status: STATUS.OK,
        model: agent.model || 'not configured',
        mode: agent.mode || 'unknown',
        temperature: agent.temperature
      };
      status.total_agents++;
      if (agent.mode === 'primary' || agent.mode === 'subagent') {
        status.active_agents++;
      }
    } else {
      status.agents[name] = {
        status: STATUS.ERROR,
        error: 'Not configured'
      };
    }
  }

  return status;
}

/**
 * Check model configuration
 */
function checkModelConfig() {
  const modelsConfig = readJsonFile(path.join(CONFIG_DIR, 'models.json'));

  if (!modelsConfig || modelsConfig.error) {
    return {
      status: STATUS.ERROR,
      error: 'models.json not found or invalid'
    };
  }

  const models = modelsConfig.models || [];
  const taskRules = modelsConfig.task_model_rules || [];
  const preferences = modelsConfig.user_preferences || {};

  return {
    status: STATUS.OK,
    total_models: models.length,
    active_models: models.filter(m => m.status === 'active').length,
    task_rules: taskRules.length,
    preference_modes: Object.keys(preferences).length,
    models: models.map(m => ({
      id: m.short_id || m.id,
      name: m.name,
      status: m.status,
      capabilities: m.capabilities || []
    }))
  };
}

/**
 * Check skill system
 */
function checkSkillSystem() {
  const skillsConfig = readJsonFile(path.join(CONFIG_DIR, 'skills.json'));

  if (!skillsConfig || skillsConfig.error) {
    return {
      status: STATUS.ERROR,
      error: 'skills.json not found or invalid'
    };
  }

  const categories = skillsConfig.skill_categories || {};
  const totalSkills = Object.values(categories).reduce(
    (sum, cat) => sum + (cat.skills?.length || 0),
    0
  );

  return {
    status: STATUS.OK,
    total_categories: Object.keys(categories).length,
    total_skills: totalSkills,
    categories: Object.keys(categories),
    skills_by_category: Object.fromEntries(
      Object.entries(categories).map(([name, cat]) => [name, cat.skills?.length || 0])
    )
  };
}

/**
 * Check environment and dependencies
 */
function checkEnvironment() {
  const pkgJson = readJsonFile(path.join(CONFIG_DIR, 'package.json'));
  const nodeVersion = process.version;

  // Check for required scripts
  const scripts = {
    'skill-matcher.js': fileExists(path.join(CONFIG_DIR, 'skill-matcher.js')),
    'detect-model.js': fileExists(path.join(CONFIG_DIR, 'detect-model.js')),
    'auto-sync-model.js': fileExists(path.join(CONFIG_DIR, 'auto-sync-model.js')),
    'preference.js': fileExists(path.join(CONFIG_DIR, 'preference.js'))
  };

  const allScriptsPresent = Object.values(scripts).every(Boolean);

  return {
    status: allScriptsPresent ? STATUS.OK : STATUS.WARNING,
    node_version: nodeVersion,
    has_package_json: !!pkgJson,
    scripts
  };
}

/**
 * Generate comprehensive status report
 */
function generateStatusReport() {
  const agentStatus = checkAgentConfig();
  const modelStatus = checkModelConfig();
  const skillStatus = checkSkillSystem();
  const envStatus = checkEnvironment();

  return {
    timestamp: new Date().toISOString(),
    system: 'AgentGV',
    version: 'V4.3.2',
    status: {
      agents: agentStatus,
      models: modelStatus,
      skills: skillStatus,
      environment: envStatus
    },
    summary: {
      overall_health: calculateOverallHealth(agentStatus, modelStatus, skillStatus, envStatus),
      recommendations: generateRecommendations(agentStatus, modelStatus, skillStatus, envStatus)
    }
  };
}

/**
 * Calculate overall system health
 */
function calculateOverallHealth(agents, models, skills, env) {
  const issues = [];

  if (agents.active_agents < agents.total_agents) {
    issues.push('Some agents not properly configured');
  }

  if (models.status === STATUS.ERROR) {
    issues.push('Model configuration missing or invalid');
  }

  if (skills.status === STATUS.ERROR) {
    issues.push('Skill system not configured');
  }

  if (env.status === STATUS.WARNING) {
    issues.push('Some required scripts missing');
  }

  if (issues.length === 0) {
    return { status: STATUS.OK, message: 'All systems operational' };
  } else if (issues.length <= 2) {
    return { status: STATUS.WARNING, message: 'Some issues detected', issues };
  } else {
    return { status: STATUS.ERROR, message: 'Multiple issues detected', issues };
  }
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(agents, models, skills, env) {
  const recommendations = [];

  if (agents.active_agents < agents.total_agents) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Configuration',
      message: 'Verify all agent configurations in opencode.json'
    });
  }

  if (models.status === STATUS.ERROR) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Configuration',
      message: 'Ensure models.json exists and is valid JSON'
    });
  }

  if (skills.total_skills < 10) {
    recommendations.push({
      priority: 'MEDIUM',
      category: 'Skills',
      message: 'Consider adding more skill templates for better task matching'
    });
  }

  if (!env.scripts['skill-matcher.js']) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Dependencies',
      message: 'skill-matcher.js is required for task routing'
    });
  }

  return recommendations;
}

/**
 * Print human-readable status report
 */
function printStatusReport(report) {
  console.log('\n' + '='.repeat(70));
  console.log('  [*] AgentGV System Status Report');
  console.log('='.repeat(70));
  console.log(`  Timestamp: ${report.timestamp}`);
  console.log(`  Version: ${report.version}`);
  console.log('='.repeat(70) + '\n');

  // Agent Status
  console.log('[ ] AGENTS');
  console.log('[ ] MODELS');
  console.log('[*] SKILLS');
  console.log('[ ] ENVIRONMENT');
  console.log('[*] OVERALL HEALTH');
  console.log('-'.repeat(70));
  const { status, message, issues } = report.summary.overall_health;
  console.log(`  ${status} ${message}`);
  if (issues?.length > 0) {
    console.log('  Issues:');
    issues.forEach(issue => console.log(`    - ${issue}`));
  }
  console.log();

  // Recommendations
  if (report.summary.recommendations.length > 0) {
    console.log('[i] RECOMMENDATIONS');
    console.log('-'.repeat(70));
    report.summary.recommendations.forEach(rec => {
      console.log(`  [${rec.priority}] ${rec.category}: ${rec.message}`);
    });
    console.log();
  }

  console.log('='.repeat(70) + '\n');
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json') || args.includes('-j');
  const quiet = args.includes('--quiet') || args.includes('-q');

  const report = generateStatusReport();

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
  } else if (quiet) {
    const health = report.summary.overall_health;
    if (health.status === STATUS.OK) {
      console.log('[+] AgentGV: All systems operational');
    } else {
      console.log(`${health.status} AgentGV: ${health.message}`);
      health.issues?.forEach(issue => console.log(`   - ${issue}`));
    }
  } else {
    printStatusReport(report);
  }

  // Exit with error code if issues detected
  if (report.summary.overall_health.status === STATUS.ERROR) {
    process.exit(1);
  }
}

module.exports = {
  generateStatusReport,
  checkAgentConfig,
  checkModelConfig,
  checkSkillSystem,
  checkEnvironment
};
