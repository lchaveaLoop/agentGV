# AgentGV 模型同步指南

**版本**: 1.0.0  
**日期**: 2026-02-24  

---

## 🎯 问题说明

默认情况下，AgentGV 的每个 Agent 在 `%USERPROFILE%\.opencode\config.json` 中有固定的模型配置。这意味着：

❌ **问题**: 在 OpenCode Desktop UI 中切换模型后，AgentGV 仍然使用旧模型  
✅ **解决**: 使用模型同步工具让 Agent 跟随当前对话模型

---

## 🚀 快速同步

### 方式 1: PowerShell 脚本（推荐）

```powershell
# 交互式模式（显示所有选项）
.\.opencode\sync-agent-model.ps1

# 直接设置模型
.\.opencode\sync-agent-model.ps1 -Model "bailian-coding-plan/qwen3.5-plus"

# 查看当前配置
.\.opencode\sync-agent-model.ps1 -Show
```

### 方式 2: Node.js 脚本

```bash
# 交互式模式
node .opencode/set-agent-model.js

# 直接设置模型（1-6）
node .opencode/set-agent-model.js 1

# 查看当前配置
node .opencode/set-agent-model.js --show
```

---

## 📋 可用模型

| 编号 | 模型 ID | 说明 |
|------|---------|------|
| 1 | `bailian-coding-plan/qwen3.5-plus` | **推荐** - 支持视觉、平衡性能和成本 |
| 2 | `bailian-coding-plan/qwen3-max-2026-01-23` | 最强 - 复杂任务、深度推理 |
| 3 | `bailian-coding-plan/qwen3-coder-plus` | 代码优化 - 编程任务 |
| 4 | `bailian-coding-plan/qwen3-coder-next` | 快速 - 简单任务 |
| 5 | `minimax/m2.5` | MiniMax 模型 |
| 6 | `opencode/glm-5-free` | 免费 - 无需 API Key |

---

## 💡 使用场景

### 场景 1: 切换到视觉模型

在 OpenCode Desktop 中切换到视觉模型后：

```powershell
# 同步所有 Agent
.\.opencode\sync-agent-model.ps1 -Model "bailian-coding-plan/qwen3.5-plus"
```

然后上传图片即可使用视觉功能！

### 场景 2: 复杂任务使用最强模型

```powershell
# 切换到 Qwen3 Max
.\.opencode\sync-agent-model.ps1 -Model "bailian-coding-plan/qwen3-max-2026-01-23"
```

### 场景 3: 代码开发使用专用模型

```powershell
# 切换到代码优化模型
.\.opencode\sync-agent-model.ps1 -Model "bailian-coding-plan/qwen3-coder-plus"
```

---

## 🔧 高级用法

### 单独设置某个 Agent 的模型

```bash
# Node.js 方式
node .opencode/set-agent-model.js router 1      # 只设置 Router
node .opencode/set-agent-model.js planning 2    # 只设置 Planning
node .opencode/set-agent-model.js operations 3  # 只设置 Operations

# PowerShell 方式（需要手动编辑 config.json）
```

### 查看当前配置

```powershell
# PowerShell
.\.opencode\sync-agent-model.ps1 -Show

# Node.js
node .opencode/set-agent-model.js --show
```

### 直接编辑配置文件

```powershell
# 使用记事本打开
notepad "$env:USERPROFILE\.opencode\config.json"

# 或使用 VS Code
code "$env:USERPROFILE\.opencode\config.json"
```

修改对应 Agent 的 `model` 字段：

```json
{
  "agentgv-router": {
    "model": "bailian-coding-plan/qwen3.5-plus",
    "temperature": 0.3
  }
}
```

---

## 🔄 自动同步（未来功能）

理想的自动同步流程：

```
OpenCode Desktop 切换模型
        ↓
检测到模型变化
        ↓
自动更新 AgentGV 配置
        ↓
AgentGV 使用新模型
```

目前需要手动运行同步脚本，未来可能会集成到 Router 中作为命令：

```
/agent-model sync    # 同步当前模型
/agent-model show    # 显示当前配置
/agent-model set <model>  # 设置模型
```

---

## ⚠️ 注意事项

### 1. 配置文件位置
```
%USERPROFILE%\.opencode\config.json
通常是：C:\Users\<你的用户名>\.opencode\config.json
```

### 2. 模型优先级
OpenCode 的模型配置优先级：
1. **Agent 单独配置** (config.json 中的 `agentgv-*`) - 最高优先级
2. **全局默认模型** (config.json 中的 `model`)
3. **Agent 定义文件** (.opencode/agents/*.md 中的 model 字段)

### 3. 视觉功能要求
使用视觉功能必须满足：
- ✅ 模型支持视觉（如 qwen3.5-plus）
- ✅ 配置了阿里云百炼 API Key
- ✅ Agent 配置中启用了 vision 能力

---

## 📖 相关文档

- [视觉理解能力指南](./VISION_CAPABILITIES.md) - 视觉功能详细说明
- [模型配置](./models.json) - AgentGV 内部模型路由规则
- [README](../README.md) - 项目主文档

---

## 🎯 最佳实践

### 推荐配置

| 使用场景 | 推荐模型 | 同步命令 |
|----------|---------|----------|
| 日常使用 | qwen3.5-plus | `-Model "bailian-coding-plan/qwen3.5-plus"` |
| 复杂任务 | qwen3-max | `-Model "bailian-coding-plan/qwen3-max-2026-01-23"` |
| 代码开发 | qwen3-coder-plus | `-Model "bailian-coding-plan/qwen3-coder-plus"` |
| 视觉任务 | qwen3.5-plus | `-Model "bailian-coding-plan/qwen3.5-plus"` |
| 快速测试 | qwen3-coder-next | `-Model "bailian-coding-plan/qwen3-coder-next"` |
| 免费使用 | glm-5-free | `-Model "opencode/glm-5-free"` |

### 工作流程

1. **在 OpenCode Desktop UI 中选择模型**
2. **运行同步脚本**（一次设置，持久生效）
3. **开始对话** - Agent 会使用新模型

---

**状态**: ✅ 已实现 | **同步方式**: 手动脚本 | **未来**: 自动检测
