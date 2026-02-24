# AgentGV 模型路由指南

## 🎯 模型决策流程

### 1. 识别任务类型

根据用户输入中的关键词匹配任务类型：

| 任务类型 | 关键词 | 默认模型 |
|----------|--------|----------|
| architecture | 架构，设计，系统，技术方案，规划，蓝图 | qwen3-max-2026-01-23 |
| complex_research | 深度分析，复杂调研，全面研究 | qwen3-max-2026-01-23 |
| research | 调研，研究，分析，市场，竞品，情报 | qwen3.5-plus |
| complex_coding | 复杂功能，核心模块，关键代码，从零开发 | qwen3.5-plus |
| coding | 开发，实现，编码，功能，构建，创建 | qwen3-coder-plus |
| review | 测试，审查，检查，质量，审核，验证，bug | qwen3.5-plus |
| documentation | 文档，报告，说明，写作，记录 | qwen3.5-plus |
| coordination | 协调，管理，统筹，多部门，项目 | qwen3.5-plus |
| simple | 简单，快速，小，修改，调整 | qwen3-coder-next |

### 2. 评估复杂度

**高复杂度** (升级到 qwen3-max-2026-01-23):
- 包含：复杂，大型，完整，从零开始，核心，关键，全面，深度

**低复杂度** (可降级到 qwen3-coder-next):
- 包含：简单，快速，小，修改，微调

### 3. 应用用户偏好

| 偏好模式 | 说明 | 命令 |
|----------|------|------|
| quality_priority | 质量优先 - 复杂任务用最强模型 | `/preference quality` |
| balanced | 平衡模式 - 自动选择 | `/preference balanced` |
| cost_saving | 成本优先 - 优先经济模型 | `/preference cost` |

---

## 📊 用户命令

```bash
# 查看当前偏好
/preference

# 设置质量优先
/preference quality

# 设置平衡模式
/preference balanced

# 设置成本优先
/preference cost
```

---

## 🔄 决策示例

**用户**: "帮我深度分析一下 AI 助手市场，需要全面调研报告"

1. 关键词匹配 → "深度分析"，"全面调研" → complex_research
2. 复杂度评估 → 高（深度，全面）
3. 模型选择 → qwen3-max-2026-01-23
4. 温度设置 → 0.2
5. 路由到 → @intelligence

---

**用户**: "简单修改一下这个函数的 bug"

1. 关键词匹配 → "修改"，"bug" → review + simple
2. 复杂度评估 → 低（简单，修改）
3. 模型选择 → qwen3-coder-next
4. 温度设置 → 0.3
5. 路由到 → @quality 或 @operations
