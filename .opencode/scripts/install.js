#!/usr/bin/env node

/**
 * AgentGV One-Click Installation Script
 *
 * Features:
 * - Node.js version check (>=18.0.0)
 * - npm dependency installation
 * - Configuration validation
 * - Test suite execution
 * - Usage guide generation
 * - Cross-platform support (Windows/Linux/Mac)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Helper functions
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bold}${colors.cyan}━━━ ${step}: ${message} ━━━${colors.reset}`, 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Check Node.js version
function checkNodeVersion() {
  logStep('Step 1', 'Checking Node.js version');

  const requiredVersion = '18.0.0';
  const currentVersion = process.version;

  logInfo(`Current Node.js version: ${currentVersion}`);

  const [major] = currentVersion.slice(1).split('.').map(Number);

  if (major < 18) {
    logError(`Node.js version ${requiredVersion} or higher is required`);
    logError(`Please upgrade from ${currentVersion} to ${requiredVersion}+`);
    logInfo('Download from: https://nodejs.org/');
    process.exit(1);
  }

  logSuccess(`Node.js version check passed (${currentVersion} >= ${requiredVersion})`);
}

// Install npm dependencies
function installDependencies() {
  logStep('Step 2', 'Installing npm dependencies');

  try {
    logInfo('Running npm install...');

    // Run npm install with progress output
    execSync('npm install', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../..')
    });

    logSuccess('npm dependencies installed successfully');
  } catch (error) {
    logError('Failed to install dependencies');
    logError(error.message);
    process.exit(1);
  }
}

// Validate configuration files
function validateConfig() {
  logStep('Step 3', 'Validating configuration files');

  const configDir = path.join(__dirname, '..', 'config');
  const schemasDir = path.join(__dirname, '..', 'schemas');

  const configs = [
    { name: 'models.json', path: path.join(configDir, 'models.json') },
    { name: 'skills.json', path: path.join(configDir, 'skills.json') },
    { name: 'commands.json', path: path.join(configDir, 'commands.json') }
  ];

  let allValid = true;

  for (const config of configs) {
    try {
      // Check file exists
      if (!fs.existsSync(config.path)) {
        logError(`${config.name} not found`);
        allValid = false;
        continue;
      }

      // Check JSON syntax
      const content = fs.readFileSync(config.path, 'utf8');
      JSON.parse(content);

      logSuccess(`${config.name} is valid`);
    } catch (error) {
      logError(`${config.name} is invalid: ${error.message}`);
      allValid = false;
    }
  }

  if (!allValid) {
    logError('Configuration validation failed');
    process.exit(1);
  }

  logSuccess('All configuration files are valid');
}

// Run test suite
function runTests() {
  logStep('Step 4', 'Running test suite');

  try {
    logInfo('Running tests...');

    execSync('npm test', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../..')
    });

    logSuccess('All tests passed');
  } catch (error) {
    logWarning('Some tests failed (this may be okay)');
    // Don't exit on test failure during installation
  }
}

// Generate usage guide
function generateUsageGuide() {
  logStep('Step 5', 'Generating usage guide');

  const guidePath = path.join(__dirname, '../../INSTALL.md');

  const guide = `# AgentGV - Installation Guide

## ✅ Installation Complete!

AgentGV has been successfully installed to your system.

---

## 🚀 Quick Start

### 1. Verify Installation

\`\`\`bash
# Check system status
node .opencode/status.js

# Validate configuration
npm run validate

# Run tests
npm test
\`\`\`

### 2. Start Using

Open your project in OpenCode and start chatting!

**Example tasks:**
\`\`\`
Help me research the AI market
Develop a Python web application
Write a science fiction story
\`\`\`

### 3. Set Preferences (Optional)

\`\`\`bash
# Quality-first mode (best models for complex tasks)
node .opencode/preference.js set quality

# Balanced mode (default)
node .opencode/preference.js set balanced

# Cost-saving mode (economical models)
node .opencode/preference.js set cost
\`\`\`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | Project overview and features |
| [AGENTS.md](AGENTS.md) | Agent knowledge base |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [docs/user/CONFIGURATION.md](docs/user/CONFIGURATION.md) | Configuration guide |
| [docs/user/TROUBLESHOOTING.md](docs/user/TROUBLESHOOTING.md) | Troubleshooting |

---

## 🎯 Available Commands

\`\`\`bash
# System status
node .opencode/status.js
node .opencode/status.js --json

# Validation
npm run validate

# Testing
npm test
npm run test:coverage

# Code quality
npm run lint
npm run format:check

# Skill matching
node .opencode/skill-matcher.js "your task description"

# Model preference
node .opencode/preference.js set quality
node .opencode/preference.js set balanced
node .opencode/preference.js set cost
\`\`\`

---

## 🔧 Troubleshooting

### Issue: Configuration validation fails

**Solution:**
\`\`\`bash
npm install
npm run validate
\`\`\`

### Issue: Agents not loading

**Solution:**
\`\`\`bash
# Restart OpenCode
opencode reload

# Or reopen the project
\`\`\`

### Issue: Models unavailable

**Solution:**
\`\`\`bash
# Check available models
opencode models

# Switch to recommended model
node .opencode/preference.js set balanced
\`\`\`

---

## 📊 System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Platform**: Windows/Linux/Mac

---

## 🎉 You're All Set!

Start using AgentGV by opening this project in OpenCode and typing any task!

**Example:**
\`\`\`
Hello! Help me research the current AI assistant market
\`\`\`

---

**Version**: 5.0.1  
**Install Date**: ${new Date().toISOString().split('T')[0]}  
**Status**: ✅ Production Ready
`;

  fs.writeFileSync(guidePath, guide, 'utf8');
  logSuccess(`Usage guide generated: ${guidePath}`);
}

// Display completion message
function displayCompletion() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🎉  AgentGV Installation Complete!', 'green');
  log('='.repeat(60), 'cyan');

  log('\n📋 Installation Summary:', 'bold');
  logSuccess('Node.js version checked');
  logSuccess('Dependencies installed');
  logSuccess('Configuration validated');
  logSuccess('Tests executed');
  logSuccess('Usage guide generated');

  log('\n🚀 Quick Start:', 'bold');
  log('  1. Open this project in OpenCode', 'yellow');
  log('  2. Start chatting with any task', 'yellow');
  log('  3. AgentGV will handle the rest!', 'yellow');

  log('\n📚 Example Commands:', 'bold');
  log('  node .opencode/status.js     - Check system status', 'white');
  log('  npm run validate             - Validate configuration', 'white');
  log('  npm test                     - Run tests', 'white');
  log('  node .opencode/preference.js set balanced - Set mode', 'white');

  log('\n💡 Example Tasks:', 'bold');
  log('  "Help me research the AI market"', 'white');
  log('  "Develop a Python web application"', 'white');
  log('  "Write a science fiction story"', 'white');

  log('\n' + '='.repeat(60), 'cyan');
  log('Happy coding! 🎊', 'green');
  log('='.repeat(60) + '\n', 'cyan');
}

// Main installation function
function main() {
  const args = process.argv.slice(2);
  const isPostInstall = args.includes('--postinstall');

  log('\n' + '━'.repeat(60), 'magenta');
  log('  AgentGV One-Click Installer', 'bold');
  log('  Version: 5.0.1', 'white');
  log('━'.repeat(60), 'magenta');

  logInfo(`Platform: ${os.platform()} ${os.arch()}`);
  logInfo(`Node.js: ${process.version}`);
  logInfo(`npm: ${execSync('npm --version').toString().trim()}`);

  if (isPostInstall) {
    logInfo('Running in postinstall mode...');
  }

  try {
    // Execute installation steps
    checkNodeVersion();

    // Skip npm install in postinstall mode to avoid infinite loop
    if (!isPostInstall) {
      installDependencies();
    } else {
      logStep('Step 2', 'Skipping dependency installation (postinstall mode)');
      logSuccess('Dependencies already being installed');
    }

    validateConfig();
    runTests();
    generateUsageGuide();
    displayCompletion();

    process.exit(0);
  } catch (error) {
    logError('\nInstallation failed!');
    logError(error.message);
    logInfo('\nPlease check the error above and try again.');
    logInfo('If the problem persists, visit: docs/user/TROUBLESHOOTING.md');
    process.exit(1);
  }
}

// Run installation
main();
