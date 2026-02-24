# AgentGV 项目架构说明

## 📁 为什么有两个 agents 目录？

这是由 **OpenCode 平台的演进**和**向后兼容性**导致的。

---

## 两个 agents 目录的区别

### 1. `agents/` (旧格式 - OpenCode V1)

**位置**: `E:\Projects\agentGV\agents/`

**结构**:
```
agents/
├── agentgv-router/
│   └── AGENT.md          # 大写 AGENT.md
├── agentgv-planning/
│   └── AGENT.md
├── agentgv-operations/
│   └── AGENT.md
└── agentgv-quality/
    └── AGENT.md
```

**特点**:
- 每个 agent 是一个**独立目录**
- 定义文件名：`AGENT.md` (大写)
- OpenCode V1 格式的遗留结构
- **主要用于 Git 版本控制**
- 当前**不再被 OpenCode 直接加载**

**内容示例** (`agents/agentgv-router/AGENT.md`):
```markdown
---
name: agentgv-router
description: Intelligent task router...
version: 1.1.0
---

# AgentGV Router Agent

## Role
...
```

---

### 2. `.opencode/agents/` (新格式 - OpenCode V2)

**位置**: `E:\Projects\agentGV\.opencode\agents/`

**结构**:
```
.opencode/agents/
├── agentgv-router.md          # 小写 .md 文件
├── agentgv-administration.md  # ← V4.3.1 新增
├── agentgv-planning.md
├── agentgv-operations.md
└── agentgv-quality.md
```

**特点**:
- 每个 agent 是一个**独立的 .md 文件**
- 定义文件名：`{agent-name}.md` (小写)
- OpenCode V2 格式的**当前标准**
- **被 OpenCode 直接加载和使用**
- 支持更多配置选项

**内容示例** (`.opencode/agents/agentgv-router.md`):
```markdown
---
description: Intelligent task router...
mode: primary
model: bailian-coding-plan/qwen3.5-plus
temperature: 0.3
tools:
  read: true
  write: true
  ...
---

# AgentGV Router Agent

## Role
...
```

---

## 为什么同时存在？

### 历史原因

1. **OpenCode 平台升级**
   - V1: 使用 `agents/{name}/AGENT.md` 格式
   - V2: 使用 `.opencode/agents/{name}.md` 格式

2. **迁移过程中的兼容性**
   - 保留旧的 `agents/` 目录作为备份
   - 新的 `.opencode/agents/` 目录用于实际运行

3. **版本控制需要**
   - `agents/` 目录中的文件包含完整的 agent 定义历史
   - 便于追踪 agent 定义的演进

---

## 当前使用的目录

### ✅ 实际运行：`.opencode/agents/`

OpenCode 平台当前从这个目录加载 agent 定义：

```bash
# OpenCode 加载的 agent 文件
.opencode/agents/agentgv-router.md          # Primary Agent
.opencode/agents/agentgv-administration.md  # 新恢复
.opencode/agents/agentgv-planning.md
.opencode/agents/agentgv-operations.md
.opencode/agents/agentgv-quality.md
```

### 📦 备份/历史：`agents/`

这个目录**不再被 OpenCode 直接加载**，但保留了：
- 历史定义格式
- Git 提交历史
- 向后兼容的参考

---

## 配置验证

### opencode.json 配置

```json
{
  "agent": {
    "agentgv-router": {
      "mode": "primary",
      "model": "bailian-coding-plan/qwen3.5-plus",
      ...
    },
    "agentgv-administration": {
      "mode": "subagent",
      "hidden": false,
      ...
    }
  }
}
```

**说明**:
- 这里定义的是**运行时配置**（模型、工具、权限）
- agent **定义**在 `.opencode/agents/` 目录中
- agent **配置**在 `opencode.json` 中

---

## 目录关系图

```
E:\Projects\agentGV/
│
├── opencode.json                    # 运行时配置
│                                     # - 模型配置
│                                     # - 工具权限
│                                     # - 温度设置
│
├── .opencode/
│   └── agents/                      # ✅ 当前使用
│       ├── agentgv-router.md
│       ├── agentgv-administration.md
│       ├── agentgv-planning.md
│       ├── agentgv-operations.md
│       └── agentgv-quality.md
│
└── agents/                          # 📦 历史备份
    ├── agentgv-router/
    │   └── AGENT.md
    ├── agentgv-planning/
    │   └── AGENT.md
    ├── agentgv-operations/
    │   └── AGENT.md
    └── agentgv-quality/
        └── AGENT.md
```

---

## 最佳实践

### 开发时

1. **编辑 agent 定义** → 修改 `.opencode/agents/{name}.md`
2. **编辑 agent 配置** → 修改 `opencode.json`
3. **不要修改** `agents/` 目录（除非需要更新历史备份）

### 部署时

1. **OpenCode 加载** → 从 `.opencode/agents/` 读取
2. **配置应用** → 从 `opencode.json` 读取
3. **版本控制** → 两个目录都提交到 Git

### 维护时

1. **新增 agent** → 在 `.opencode/agents/` 创建 `{name}.md`
2. **删除 agent** → 从 `.opencode/agents/` 删除，保留 `agents/` 作为历史
3. **更新配置** → 同时更新 `opencode.json`

---

## 清理建议

### 选项 1: 保留两个目录（推荐）

**优点**:
- 保留历史记录
- 向后兼容
- 易于回滚

**缺点**:
- 目录结构稍复杂

### 选项 2: 删除旧的 `agents/` 目录

**前提**:
- 确认所有 agent 都已迁移到 `.opencode/agents/`
- Git 历史已保存

**操作**:
```bash
# 备份后删除
git mv agents agents-archive
git commit -m "archive: move old agents directory to archive"
```

---

## 文件对比

### 格式差异

| 特性 | `agents/AGENT.md` (旧) | `.opencode/agents/{name}.md` (新) |
|------|----------------------|----------------------------------|
| **位置** | `agents/{name}/AGENT.md` | `.opencode/agents/{name}.md` |
| **文件名** | 大写 `AGENT.md` | 小写 `{name}.md` |
| **目录结构** | 每个 agent 一个目录 | 扁平的 .md 文件列表 |
| **YAML 前缀** | 基础字段 | 完整配置字段 |
| **加载方式** | OpenCode V1 | OpenCode V2 |
| **当前状态** | 历史备份 | ✅ 正在使用 |

### 内容示例对比

**旧格式** (`agents/agentgv-router/AGENT.md`):
```markdown
---
name: agentgv-router
description: Intelligent task router...
version: 1.1.0
author: AgentGV Team
---

# AgentGV Router Agent
...
```

**新格式** (`.opencode/agents/agentgv-router.md`):
```markdown
---
description: Intelligent task router...
mode: primary
model: bailian-coding-plan/qwen3.5-plus
temperature: 0.3
tools:
  read: true
  write: true
  bash: true
permission:
  webfetch: allow
  bash: allow
---

# AgentGV Router Agent
...
```

---

## 快速参考

### 我需要修改 agent 定义

```bash
# 编辑 .opencode/agents/ 中的文件
code .opencode/agents/agentgv-router.md
```

### 我需要修改 agent 配置

```bash
# 编辑 opencode.json
code opencode.json
```

### 我想添加新 agent

```bash
# 1. 在新目录创建定义
code .opencode/agents/agentgv-new.md

# 2. 在 opencode.json 添加配置
# 3. 提交更改
git add .opencode/agents/agentgv-new.md opencode.json
git commit -m "feat: add new agent"
git push
```

### 我想查看历史定义

```bash
# 查看旧格式
cat agents/agentgv-router/AGENT.md
```

---

**版本**: V4.3.1  
**更新日期**: 2026-02-24  
**维护**: AgentGV Team
