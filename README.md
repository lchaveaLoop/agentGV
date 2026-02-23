# AgentGV - Government-Style Agent Teams

多 Agent 协作系统，模拟政府部门架构。

## 🚀 快速开始

### 1. 安装

双击运行 `install.ps1`

### 2. 配置

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

### 3. 使用

```
帮我调研 AI 市场  ← 自动路由到对应 Agent
```

无需 `@` 前缀，所有请求自动经过 Router 分发！

## 📋 Agents

| Agent | 职责 | 模型 |
|-------|------|------|
| **agentgv-router** | 智能路由 | Claude Haiku (快速) |
| **agentgv-intelligence** | 调研分析 | Claude Opus (强推理) |
| **agentgv-planning** | 架构设计 | Claude Opus (强推理) |
| **agentgv-operations** | 功能开发 | Claude Sonnet (代码) |
| **agentgv-quality** | 代码审查 | Claude Sonnet (精准) |
| **agentgv-communications** | 文档编写 | Claude Sonnet (平衡) |
| **agentgv-administration** | 项目协调 | Claude Haiku (快速) |

> 💡 每个 Agent 都配置了最适合其职责的模型，安装时自动应用。

## 📖 文档

- `INSTALLATION_COMPLETE.md` - 安装验证报告
- `agents/*/AGENT.md` - Agent 详细文档
- `.opencode/agents/*.md` - OpenCode Agent 配置

---

**版本**: 2.2 | **日期**: 2026-02-23
