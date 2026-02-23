# AgentGV - Government-Style Agent Teams

多 Agent 协作系统，模拟政府部门架构。支持动态模型路由、质量优先模式、使用统计追踪。

## 🎯 核心特性

- **智能路由**: Router Agent 自动分发任务到对应部门
- **动态模型分配**: 根据任务类型和复杂度自动选择最优模型
- **质量优先模式**: 复杂任务自动使用最强模型 (Qwen3 Max)
- **使用统计**: 追踪各模型、Agent、任务类型的使用情况
- **用户偏好**: 支持质量优先/平衡/成本优先 3 种模式

---

## 🚀 快速开始

### 1. 安装

双击运行 `install.ps1`

### 2. 模型配置

安装时会自动检测可用模型并配置。

**指定模型安装：**
```powershell
$env:AGENTGV_MODEL = "bailian-coding-plan/qwen3.5-plus"
.\install.ps1
```

### 3. 使用

```
帮我调研 AI 市场  ← 自动路由到对应 Agent
```

无需 `@` 前缀，所有请求自动经过 Router 分发！

### 4. 设置偏好模式

直接告诉 Router 你的需求：

```
切换到质量优先模式    # 复杂任务使用 Qwen3 Max
切换到平衡模式        # 自动选择
切换到成本优先模式    # 优先使用经济模型
```

或使用 CLI 脚本：
```bash
node .opencode/preference.js set quality
node .opencode/preference.js set balanced
node .opencode/preference.js set cost
```

### 5. 查看统计

```bash
node .opencode/preference.js stats
```

---

## 🤖 Agents

### Router (路由器)
- **职责**: 智能路由，分析任务并分发到对应部门
- **模型**: bailian-coding-plan/qwen3.5-plus
- **模式**: primary

### Intelligence (情报部)
- **职责**: 调研分析，市场研究，竞品分析
- **模型**: bailian-coding-plan/qwen3.5-plus
- **温度**: 0.2

### Planning (规划局)
- **职责**: 架构设计，技术方案，系统规划
- **模型**: bailian-coding-plan/qwen3.5-plus (复杂任务→qwen3-max)
- **温度**: 0.2

### Operations (执行部)
- **职责**: 功能开发，编码实现
- **模型**: bailian-coding-plan/qwen3-coder-plus
- **温度**: 0.3

### Quality (质检部)
- **职责**: 代码审查，测试，质量验证
- **模型**: bailian-coding-plan/qwen3.5-plus
- **温度**: 0.1

### Communications (外交部)
- **职责**: 文档编写，报告撰写
- **模型**: bailian-coding-plan/qwen3.5-plus
- **温度**: 0.4

### Administration (内政部)
- **职责**: 项目协调，多部门协作管理
- **模型**: bailian-coding-plan/qwen3.5-plus
- **温度**: 0.3

---

## 📊 动态模型路由

### 任务类型与模型映射

| 任务类型 | 关键词 | 默认模型 | 温度 |
|----------|--------|----------|------|
| architecture | 架构，设计，系统，技术方案 | qwen3-max-2026-01-23 | 0.2 |
| complex_research | 深度分析，复杂调研，全面研究 | qwen3-max-2026-01-23 | 0.2 |
| research | 调研，研究，分析，市场 | qwen3.5-plus | 0.2 |
| complex_coding | 复杂功能，核心模块，关键代码 | qwen3.5-plus | 0.3 |
| coding | 开发，实现，编码，功能 | qwen3-coder-plus | 0.3 |
| review | 测试，审查，检查，质量，bug | qwen3.5-plus | 0.1 |
| documentation | 文档，报告，说明，写作 | qwen3.5-plus | 0.4 |
| coordination | 协调，管理，统筹，多部门 | qwen3.5-plus | 0.3 |
| simple | 简单，快速，小，修改 | qwen3-coder-next | 0.3 |

### 复杂度规则

**高复杂度** → 升级到 `qwen3-max-2026-01-23`
- 关键词：复杂，大型，完整，从零开始，核心，关键，全面，深度

**低复杂度** → 可降级到 `qwen3-coder-next`
- 关键词：简单，快速，小，修改，微调

### 用户偏好模式

| 模式 | 说明 | 默认模型 | 复杂升级 | 降级 |
|------|------|----------|----------|------|
| **quality_priority** | 质量优先 - 复杂任务用最强模型 | qwen3.5-plus | qwen3-max | ❌ |
| **balanced** | 平衡模式 - 自动选择 | qwen3.5-plus | qwen3-max | ✅ |
| **cost_saving** | 成本优先 - 优先经济模型 | qwen3-coder-plus | qwen3.5-plus | ✅ |

---

## 📈 使用统计

系统会自动追踪：
- 各模型使用次数
- 各 Agent 调用次数
- 各任务类型分布
- 各偏好模式使用情况

统计按月重置，查看方式：
```bash
node .opencode/preference.js stats
```

---

## 🛠️ 工程规范

### 代码提交

每个功能开发完成后自动执行：
1. 自测 + 集成测试
2. 路由到 @quality 审查
3. 修复问题
4. 提交代码并推送
5. 更新文档

提交格式遵循 Conventional Commits：
- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `refactor:` 重构
- `test:` 测试

### 测试流程

```
开发完成 → 自测 → 集成测试 → Quality 审查 → 修复 → 验证 → 提交 → 文档更新 → ✅
```

---

## 📖 文档

- `README.md` - 项目说明（本文档）
- `.opencode/MODEL_ROUTING.md` - 模型路由详细规则
- `.opencode/README_COMMANDS.md` - 命令使用说明
- `agents/*/AGENT.md` - Agent 详细角色定义
- `.opencode/agents/*.md` - OpenCode Agent 配置

---

**版本**: 2.5 | **日期**: 2026-02-23  
**License**: MIT | **Repository**: github.com/lchaveaLoop/agentGV
