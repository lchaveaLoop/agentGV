# AgentGV - Government-Style Agent Teams

多 Agent 协作系统，模拟政府部门架构。

## 🚀 快速开始

### 1. 安装

双击运行 `install.ps1`

### 2. 模型配置

安装时会自动检测可用模型：

| 优先级 | 来源 | 说明 |
|--------|------|------|
| 1 | 环境变量 `AGENTGV_MODEL` | 最高优先级 |
| 2 | 用户 config model 字段 | 中优先级 |
| 3 | 交互式选择 | 如果未配置，提示选择 |

**交互式选择：**
```
No model configured. Available options:
  1. minimax/m2.5        - MiniMax M2.5 (推荐)
  2. minimax/m2.5-free  - MiniMax M2.5 免费版
  3. opencode/glm-5-free - GLM-5 免费版 (无需 API Key)
  4. opencode/qwen3-coder - Qwen3 Coder
```

**指定模型安装：**
```powershell
$env:AGENTGV_MODEL = "minimax/m2.5"
.\install.ps1
```

### 3. 使用

```
帮我调研 AI 市场  ← 自动路由到对应 Agent
```

无需 `@` 前缀，所有请求自动经过 Router 分发！

### 4. 配置

安装脚本会自动配置 `~/.opencode/config.json`，设置 `agentgv-router` 为默认 Agent。

如需手动配置：
```json
{
  "agent": {
    "default": "agentgv-router"
  },
  "agents": {
    "enabled": [
      "agentgv-router",
      "agentgv-intelligence",
      "agentgv-planning",
      "agentgv-operations",
      "agentgv-quality",
      "agentgv-communications",
      "agentgv-administration"
    ]
  }
}
```

## 📋 Agents

| Agent | 职责 | 模型 |
|-------|------|------|
| **agentgv-router** | 智能路由 | MiniMax M2.5 |
| **agentgv-intelligence** | 调研分析 | MiniMax M2.5 |
| **agentgv-planning** | 架构设计 | MiniMax M2.5 |
| **agentgv-operations** | 功能开发 | MiniMax M2.5 |
| **agentgv-quality** | 代码审查 | MiniMax M2.5 |
| **agentgv-communications** | 文档编写 | MiniMax M2.5 |
| **agentgv-administration** | 项目协调 | MiniMax M2.5 |

> 💡 所有 Agent 统一使用 MiniMax M2.5 模型，安装时自动应用。

## 📖 文档

- `INSTALLATION_COMPLETE.md` - 安装验证报告
- `agents/*/AGENT.md` - Agent 详细文档
- `.opencode/agents/*.md` - OpenCode Agent 配置

---

**版本**: 2.4 | **日期**: 2026-02-23
