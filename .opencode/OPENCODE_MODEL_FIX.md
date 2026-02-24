# OpenCode 模型配置修复指南

**问题**: OpenCode Desktop 显示 `qwen3.5-plus` 为文本模型，不支持推理，上下文上限为 0

**根本原因**: OpenCode 的 `opencode.json` 配置文件中所有 Agent 都使用 `minimax/MiniMax-M2.5`，而非 `bailian-coding-plan/qwen3.5-plus`

---

## ✅ 解决方案

### 方案 1: 使用自动切换脚本（推荐）

```bash
# 交互式切换
node .opencode/switch-opencode-model.js

# 直接切换到视觉模型
node .opencode/switch-opencode-model.js 1

# 查看当前配置
node .opencode/switch-opencode-model.js --show
```

### 方案 2: 手动编辑配置文件

**文件位置**: `C:\Users\lc\.config\opencode\opencode.json`

**修改前**:
```json
{
  "model": "minimax/MiniMax-M2.5",
  "agent": {
    "router": { "model": "minimax/MiniMax-M2.5" },
    "planning": { "model": "minimax/MiniMax-M2.5" },
    "operations": { "model": "minimax/MiniMax-M2.5" },
    ...
  }
}
```

**修改后**:
```json
{
  "model": "bailian-coding-plan/qwen3.5-plus",
  "agent": {
    "router": { "model": "bailian-coding-plan/qwen3.5-plus" },
    "planning": { "model": "bailian-coding-plan/qwen3.5-plus" },
    "operations": { "model": "bailian-coding-plan/qwen3.5-plus" },
    ...
  }
}
```

---

## 📊 可用模型

| 编号 | 模型 ID | 说明 | 视觉支持 | 上下文 |
|------|---------|------|----------|---------|
| **1** | `bailian-coding-plan/qwen3.5-plus` | **推荐** - 视觉、推理、代码 | ✅ | 1M |
| 2 | `bailian-coding-plan/qwen3-max-2026-01-23` | 最强推理 | ✅ | 262K |
| 3 | `bailian-coding-plan/qwen3-coder-plus` | 代码优化 | ❌ | 1M |
| 4 | `bailian-coding-plan/qwen3-coder-next` | 快速代码 | ❌ | 1M |
| 5 | `minimax/MiniMax-M2.5` | MiniMax（当前） | ❌ | - |

---

## 🎯 阿里云百炼模型配置详解

### bailian-coding-plan Provider 配置

```json
{
  "provider": {
    "bailian-coding-plan": {
      "name": "Model Studio Coding Plan",
      "npm": "@ai-sdk/anthropic",
      "options": {
        "apiKey": "sk-sp-xxx",
        "baseURL": "https://coding.dashscope.aliyuncs.com/apps/anthropic/v1"
      },
      "models": {
        "qwen3.5-plus": {
          "name": "Qwen3.5 Plus",
          "options": {
            "thinking": {
              "budgetTokens": 1024,
              "type": "enabled"
            }
          }
        },
        "qwen3-max-2026-01-23": {
          "name": "Qwen3 Max 2026-01-23",
          "options": {
            "thinking": {
              "budgetTokens": 1024,
              "type": "enabled"
            }
          }
        }
      }
    }
  }
}
```

### qwen3.5-plus 能力

| 能力 | 状态 | 说明 |
|------|------|------|
| **视觉理解** | ✅ | 图像、视频理解 |
| **推理能力** | ✅ | 思考模式已启用 |
| **上下文** | ✅ | 最高 1M tokens |
| **OCR** | ✅ | 文字识别 |
| **代码生成** | ✅ | 全栈开发 |
| **文档解析** | ✅ | PDF/Markdown |

---

## ✅ 验证步骤

### 1. 检查配置

```bash
node .opencode/switch-opencode-model.js --show
```

**预期输出**:
```
📋 Current Configuration:

Global Model: bailian-coding-plan/qwen3.5-plus

Agent Models:
  router               bailian-coding-plan/qwen3.5-plus
  intelligence         bailian-coding-plan/qwen3.5-plus
  planning             bailian-coding-plan/qwen3.5-plus
  operations           bailian-coding-plan/qwen3.5-plus
  quality              bailian-coding-plan/qwen3.5-plus
  communications       bailian-coding-plan/qwen3.5-plus
  administration       bailian-coding-plan/qwen3.5-plus
```

### 2. 重启 OpenCode Desktop

配置更改后需要**重启 OpenCode Desktop** 才能生效。

### 3. 测试视觉功能

1. 重启 OpenCode Desktop
2. 上传一张图片
3. 提问："分析这张图片的内容"

**预期**: 正常识别并分析图片

---

## 🔧 故障排查

### 问题 1: 配置不生效

**原因**: OpenCode Desktop 缓存了旧配置

**解决**:
1. 完全退出 OpenCode Desktop
2. 重新启动
3. 或者新建一个对话会话

### 问题 2: 仍然显示不支持视觉

**检查**:
1. 确认 `opencode.json` 中的 `model` 字段已更新
2. 确认所有 `agent.*.model` 都已更新
3. 确认 `bailian-coding-plan` provider 配置正确

### 问题 3: API Key 问题

**检查**:
```bash
# 查看配置中的 API Key
cat "C:\Users\lc\.config\opencode\opencode.json" | grep -A 5 bailian-coding-plan
```

**解决**: 确保 `sk-sp-` 开头的 API Key 有效

---

## 📝 配置文件详解

### 关键配置项

```json
{
  // 全局默认模型 - 影响所有未单独配置的 Agent
  "model": "bailian-coding-plan/qwen3.5-plus",
  
  // Provider 配置 - 定义可用模型
  "provider": {
    "bailian-coding-plan": {
      "models": {
        "qwen3.5-plus": { /* ... */ }
      }
    }
  },
  
  // Agent 配置 - 每个 Agent 的独立模型设置
  "agent": {
    "router": {
      "model": "bailian-coding-plan/qwen3.5-plus",
      "tools": {
        "understand_image": true  // 视觉工具已启用
      }
    }
  }
}
```

---

## 🚀 最佳实践

### 推荐配置

**日常开发**:
```json
{
  "model": "bailian-coding-plan/qwen3.5-plus",
  "agent": {
    "router": { "model": "bailian-coding-plan/qwen3.5-plus" },
    "operations": { "model": "bailian-coding-plan/qwen3-coder-plus" },
    "quality": { "model": "bailian-coding-plan/qwen3.5-plus" }
  }
}
```

**复杂任务**:
```json
{
  "model": "bailian-coding-plan/qwen3-max-2026-01-23"
}
```

**视觉任务**:
```json
{
  "model": "bailian-coding-plan/qwen3.5-plus"  // 必须使用这个
}
```

---

## 📖 参考文档

- [OpenCode 配置文档](https://opencode.ai/docs/config/)
- [阿里云百炼模型列表](https://help.aliyun.com/zh/model-studio/models)
- [qwen3.5-plus 视觉能力](https://help.aliyun.com/zh/model-studio/vision)

---

## ✅ 当前状态（已修复）

| 配置项 | 状态 | 值 |
|--------|------|-----|
| 全局模型 | ✅ | `bailian-coding-plan/qwen3.5-plus` |
| Router 模型 | ✅ | `bailian-coding-plan/qwen3.5-plus` |
| 所有 Agent | ✅ | 已同步更新 |
| 视觉能力 | ✅ | 支持 |
| 推理能力 | ✅ | 思考模式已启用 |
| 上下文窗口 | ✅ | 1M tokens |

---

**修复完成时间**: 2026-02-24  
**修复工具**: `switch-opencode-model.js`  
**配置文件**: `C:\Users\lc\.config\opencode\opencode.json`

现在可以正常使用视觉功能了！🎉
