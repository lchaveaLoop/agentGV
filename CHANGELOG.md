# Changelog

All notable changes to AgentGV will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned

- Enhanced multi-agent coordination
- Improved skill matching algorithm
- Support for custom skill templates
- Web dashboard for monitoring

---

### 🚧 规划中 (6.0.0)

#### 纯路由架构

- **Router 重构**: Router 只解析任务，实际执行由 Administration 负责
- **职责分离**: Router 专注于任务解析和路由，Administration 接管所有执行细节
- **目标**: 实现 >95% 自主闭环，减少人工干预

---

## [5.0.0] - 2026-02-25

### 🎉 Added

#### Community Documentation

- `CONTRIBUTING.md` - 完整的贡献者指南
- `CODE_OF_CONDUCT.md` - 社区行为准则
- `CLA.md` - 贡献者许可协议
- `README.zh-cn.md` - 中文 README
- Developer guides (`docs/dev/`)
  - `GETTING_STARTED.md` - 开发者快速开始
  - `ARCHITECTURE.md` - 架构设计文档
- User guides (`docs/user/`)
  - `CONFIGURATION.md` - 配置指南
  - `TROUBLESHOOTING.md` - 故障排查指南
- API documentation (`docs/api/`)
  - `ROUTER_API.md` - Router API 文档
  - `MODEL_API.md` - Model API 文档
  - `SKILL_API.md` - Skill API 文档

#### README Enhancements

- Project badges (Build Status, Coverage, Version)
- Enhanced quick start guide
- Architecture diagram (ASCII)
- Updated feature list
- Development status section
- Community links
- License information

#### Administration Agent

- New `Administration` agent for autonomous task execution
- Multi-step workflow coordination
- Progress tracking and reporting
- Autonomous decision-making capabilities

#### Visual Understanding

- Image analysis and Q&A support
- OCR text recognition
- Screenshot to code conversion
- Document parsing (PDF/scanned)
- Multi-image comparison analysis
- Chart/diagram analysis

#### Model Synchronization

- Real-time model sync with OpenCode Desktop
- 6 available models to choose from
- Interactive model selection script
- Automatic agent model updates

### 🔄 Changed

#### Architecture Optimization

- Merged Intelligence department into Planning
- Merged Communications department into Operations
- Merged Administration capabilities into Router
- Optimized from 7 agents to 4 departments

#### Skill System

- Expanded from 12 to 28 skills
- 5 major categories: Software, Hardware, Simulation, Creative, Research
- Improved skill matching algorithm
- Better keyword recognition

#### Model Routing

- Enhanced task type detection
- Improved complexity assessment
- Better temperature control per task type
- User preference modes (Quality/Balanced/Cost)

### 📦 Deprecated

- Standalone Intelligence Agent (merged to Planning)
- Standalone Communications Agent (merged to Operations)
- Old skill configuration format (v3.x)

### 🗑️ Removed

- Redundant agent definitions
- Deprecated skill templates
- Legacy configuration files

### 🐛 Fixed

- Model synchronization issues with OpenCode Desktop
- Skill matching edge cases
- Routing errors for complex tasks
- Documentation inconsistencies
- Configuration validation errors

### 🔒 Security

- Enhanced input validation for skill matcher
- Improved error handling in router
- Added configuration schema validation
- Secure credential handling

---

## [5.0.1] - 2026-02-25

### 🎉 Added

#### MiniMax Model Support

- Added **MiniMax M2.5** model to `models.json`
  - Low cost, fast response
  - Best for: daily coding, simple tasks, creative writing
- Added **MiniMax M1** model to `models.json`
  - Medium cost, balanced performance
  - Best for: research, documentation, medium complexity

#### New Routing Rules

- `minimax_coding` - Tasks using MiniMax for quick development
- `minimax_research` - Tasks using MiniMax for research and docs

#### User Preferences

- Added `minimax_optimized` mode
  - Prefers MiniMax models for all tasks
  - Auto-upgrades complex tasks to MiniMax M1
- Updated `cost_saving` mode to prefer MiniMax M2.5

#### Documentation

- `docs/user/MINIMAX_SUPPORT.md` - Complete MiniMax support guide
- `docs/user/MINIMAX_GUIDE.md` - MiniMax usage guide with examples
- Updated `README.md` with MiniMax info and V5.0.1 badge
- Added MiniMax model badge

### 🔧 Changed

- Updated `models.json` to include MiniMax models
- Enhanced `auto-sync-model.js` with MiniMax detection
- Updated complexity rules to handle MiniMax appropriately
- Updated agent model mappings for MiniMax support
- README.md enhanced with MiniMax section

---

## [4.3.2] - 2026-02-25

### 🎉 Added

- Visual understanding capabilities (qwen3.5-plus)
- Model synchronization script (`sync-agent-model.ps1`)
- Interactive model selection menu
- Support for 6 different models

### 🔄 Changed

- Updated README with visual features
- Improved model configuration display
- Enhanced skill matcher output

### 🐛 Fixed

- Fixed model sync issues
- Resolved routing conflicts
- Fixed documentation links

---

## [4.3.1] - 2026-02-25

### 🎉 Added

- Administration Agent for autonomous execution
- Enhanced task coordination
- Progress tracking system

### 🔄 Changed

- Optimized agent collaboration workflow
- Improved autonomous decision making

### 🐛 Fixed

- Fixed multi-agent coordination issues
- Resolved task delegation errors

---

## [4.3.0] - 2026-02-24

### 🎉 Added

- Cross-platform installation support
- Linux and macOS compatibility
- Unified installation script

### 🔄 Changed

- Updated installation process
- Improved platform detection

---

## [4.2.0] - 2026-02-24

### 🎉 Added

- Fiction writing skill template
- Creative writing capabilities
- Temperature control for creative tasks

### 🔄 Changed

- Enhanced skill matching for literature
- Improved model selection for creative tasks

---

## [4.1.0] - 2026-02-24

### 🎉 Added

- 4-department optimized architecture
- Department capability mapping
- Enhanced router coordination

### 🔄 Changed

- Merged Intelligence → Planning
- Merged Communications → Operations
- Merged Administration → Router

### 🗑️ Removed

- Standalone Intelligence department
- Standalone Communications department
- Standalone Administration department

---

## [4.0.0] - 2026-02-24

### 🎉 Added

- Skill template system (15 skills)
- Dynamic model routing
- Quality priority mode
- User preference system (3 modes)

### 🔄 Changed

- Complete architecture redesign
- Agent role optimization
- Improved task distribution

---

## [3.x] - Historical Versions

### [3.0.0] - 2026-02-20

- Introduced Skill template system
- Added 4+N architecture
- Enhanced extensibility

### [2.0.0] - 2026-02-15

- Simplified to 4 agents
- Improved routing logic
- Better task handling

### [1.0.0] - 2026-02-10

- Initial release
- 7-agent architecture
- Basic routing system

---

## Version History Summary

| Version | Date       | Key Changes                                           |
| ------- | ---------- | ----------------------------------------------------- |
| 5.0.0   | 2026-02-25 | Community docs, Administration agent, Visual features |
| 4.3.2   | 2026-02-25 | Visual understanding, Model sync                      |
| 4.3.1   | 2026-02-25 | Administration agent                                  |
| 4.3.0   | 2026-02-24 | Cross-platform support                                |
| 4.2.0   | 2026-02-24 | Fiction writing skill                                 |
| 4.1.0   | 2026-02-24 | 4-department optimization                             |
| 4.0.0   | 2026-02-24 | Skill template system                                 |
| 3.0.0   | 2026-02-20 | 4+N architecture                                      |
| 2.0.0   | 2026-02-15 | 4 agents                                              |
| 1.0.0   | 2026-02-10 | Initial release                                       |

---

## Release Notes

### V5.0.0 Migration Guide

If you're upgrading from V4.x to V5.0.0:

1. **Backup Configuration**

   ```bash
   cp .opencode/config/models.json .opencode/config/models.json.bak
   ```

2. **Update Dependencies**

   ```bash
   npm install
   ```

3. **Review New Documentation**
   - Read `CONTRIBUTING.md` for contribution guidelines
   - Check `docs/` for detailed guides

4. **Test Installation**
   ```bash
   node .opencode/test.js
   ```

### Breaking Changes in V5.0.0

- None - V5.0.0 is backward compatible with V4.x

---

**Legend**:

- 🎉 Added - New features
- 🔄 Changed - Modified existing functionality
- 📦 Deprecated - Soon to be removed
- 🗑️ Removed - Removed features
- 🐛 Fixed - Bug fixes
- 🔒 Security - Security improvements

**Last Updated**: 2026-02-25
