# AgentGV - Government-Style Agent Teams

多 Agent 协作系统，模拟政府部门架构。

## 🚀 快速开始

### 1. 安装

双击运行 `install.ps1`

### 2. 配置

编辑 `~/.opencode/config.json`：

```json
{
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
@agentgv-router 帮我调研 AI 市场
```

## 📋 Agents

| Agent | 职责 |
|-------|------|
| **agentgv-router** | 智能路由 |
| **agentgv-intelligence** | 调研分析 |
| **agentgv-planning** | 架构设计 |
| **agentgv-operations** | 功能开发 |
| **agentgv-quality** | 代码审查 |
| **agentgv-communications** | 文档编写 |
| **agentgv-administration** | 项目协调 |

## 📖 文档

- `INSTALLATION_COMPLETE.md` - 安装验证报告
- `agents/*/AGENT.md` - Agent 详细文档

---

**版本**: 2.0 | **日期**: 2026-02-23
