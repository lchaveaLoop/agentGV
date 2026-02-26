# AgentGV - Installation Guide

## ✅ Installation Complete!

AgentGV has been successfully installed to your system.

---

## 🚀 Quick Start

### 1. Verify Installation

```bash
# Check system status
node .opencode/status.js

# Validate configuration
npm run validate

# Run tests
npm test
```

### 2. Start Using

Open your project in OpenCode and start chatting!

**Example tasks:**
```
Help me research the AI market
Develop a Python web application
Write a science fiction story
```

### 3. Set Preferences (Optional)

```bash
# Quality-first mode (best models for complex tasks)
node .opencode/preference.js set quality

# Balanced mode (default)
node .opencode/preference.js set balanced

# Cost-saving mode (economical models)
node .opencode/preference.js set cost
```

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

```bash
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
```

---

## 🔧 Troubleshooting

### Issue: Configuration validation fails

**Solution:**
```bash
npm install
npm run validate
```

### Issue: Agents not loading

**Solution:**
```bash
# Restart OpenCode
opencode reload

# Or reopen the project
```

### Issue: Models unavailable

**Solution:**
```bash
# Check available models
opencode models

# Switch to recommended model
node .opencode/preference.js set balanced
```

---

## 📊 System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Platform**: Windows/Linux/Mac

---

## 🎉 You're All Set!

Start using AgentGV by opening this project in OpenCode and typing any task!

**Example:**
```
Hello! Help me research the current AI assistant market
```

---

**Version**: 5.0.1  
**Install Date**: 2026-02-26  
**Status**: ✅ Production Ready
