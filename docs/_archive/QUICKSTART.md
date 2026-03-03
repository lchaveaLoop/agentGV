# AgentGV 快速开始指南

欢迎使用 AgentGV！本指南将帮助你在 5 分钟内开始使用。

## 🚀 5 分钟快速开始

### 步骤 1: 验证安装

```bash
# 检查系统状态
node .opencode/status.js

# 应该看到：
# ✅ AgentGV: All systems operational
```

### 步骤 2: 使用 Agent

在 OpenCode 中，AgentGV 会自动加载。只需向 Router Agent 提问：

```
用户：帮我调研新能源汽车市场

Router 会自动:
1. 匹配 Skill: market-research
2. 选择部门：Planning
3. 调用：@agentgv-planning<market>
4. 返回调研报告
```

### 步骤 3: 使用 Skills

Skills 是预定义的任务模板，提升 Agent 专业性。

**查看可用 Skills**:
```bash
# 扫描 Skills
node .opencode/skill-scanner.js

# 查看 Skills 索引
cat .opencode/skills-index.json
```

**使用 Skill**:
```
用户：用 Python 开发技能写一个爬虫

Router 会:
1. 匹配 Skill: python-development
2. 选择部门：Operations
3. 调用：@agentgv-operations<python>
4. 生成 Python 爬虫代码
```

## 📚 核心概念

### Router（路由器）
- **作用**: 智能分析任务，路由到合适的部门
- **位置**: `.opencode/agents/agentgv-router.md`
- **模式**: primary（主 Agent）

### 4 个部门

| 部门 | 职责 | 示例任务 |
|------|------|----------|
| **Planning** | 架构设计、调研分析 | 市场调研、技术方案 |
| **Operations** | 功能开发、文档编写 | Python 开发、小说创作 |
| **Quality** | 测试、代码审查 | 单元测试、代码审查 |
| **Router** | 任务协调 | 多部门协作 |

### Skills（技能）

Skills 是专业任务模板，结构参考 Anthropic：

```
.opencode/skills/
├── creative/fiction/SKILL.md    # 小说创作
├── software/python/SKILL.md     # Python 开发
└── research/market/SKILL.md     # 市场调研
```

## 🎯 使用示例

### 示例 1: 文学创作

```
用户：写一篇科幻小说

Router 执行:
1. Skill 匹配 → fiction-writing
2. 部门选择 → Operations (creative category)
3. 调用 → @agentgv-operations<fiction>
4. 温度 → 0.7（高创意性）
```

### 示例 2: 软件开发

```
用户：用 Flask 写一个 REST API

Router 执行:
1. Skill 匹配 → python-development
2. 部门选择 → Operations (software category)
3. 调用 → @agentgv-operations<python>
4. 温度 → 0.3（代码确定性）
```

### 示例 3: 市场调研

```
用户：调研 AI 助手市场情况

Router 执行:
1. Skill 匹配 → market-research
2. 部门选择 → Planning (research category)
3. 调用 → @agentgv-planning<market>
4. 输出 → 市场调研报告
```

## 🛠️ 常用命令

### 系统检查

```bash
# 完整状态报告
node .opencode/status.js

# JSON 格式输出
node .opencode/status.js --json

# 快速检查
node .opencode/status.js --quiet
```

### Skills 管理

```bash
# 扫描 Skills
node .opencode/skill-scanner.js --index

# 查看索引
node .opencode/skill-scanner.js
```

### 测试

```bash
# 运行测试套件
node .opencode/test.js

# 详细输出
node .opencode/test.js --verbose
```

## 📖 进阶使用

### 自定义 Skill

创建新 Skill 只需一个文件夹：

```bash
# 创建 Skill 文件夹
mkdir -p .opencode/skills/custom/my-skill

# 创建 SKILL.md
cat > .opencode/skills/custom/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: 我的自定义技能
category: custom
model: bailian-coding-plan/qwen3.5-plus
temperature: 0.5
---

# My Custom Skill

## 能力
- 能力 1
- 能力 2

## 使用示例
用户：使用我的技能

## 指南
- 指南 1
- 指南 2
EOF
```

### 错误处理

AgentGV 提供分层错误系统：

```javascript
const { SkillNotFoundError, handleError } = require('./.opencode/error-hierarchy.js');

try {
  // 可能出错的代码
  throw new SkillNotFoundError('fiction');
} catch (error) {
  handleError(error);
  // 输出：
  // ❌ Skill not found: fiction
  // 💡 Suggestion: Check skill ID and ensure skill is installed
}
```

## 🔧 故障排查

### 问题 1: Skill 未匹配

**症状**: Router 无法匹配 Skill

**解决**:
```bash
# 检查 Skills 索引
node .opencode/skill-scanner.js

# 验证 Skill 文件
cat .opencode/skills/**/SKILL.md
```

### 问题 2: 系统状态异常

**症状**: `node .opencode/status.js` 显示错误

**解决**:
```bash
# 查看详细报告
node .opencode/status.js

# 检查配置文件
cat .opencode/models.json
cat .opencode/skills.json
```

### 问题 3: Agent 执行失败

**症状**: Agent 超时或执行错误

**解决**:
```bash
# 查看日志
ls -la logs/

# 检查模型配置
cat .opencode/models.json | grep status
```

## 📚 更多资源

- **完整文档**: `.opencode/agents/` 目录
- **Skill 示例**: `.opencode/skills/` 目录
- **错误代码**: `.opencode/error-hierarchy.js`
- **研究报告**: `docs/anthropic-research-report.md`

## 🆘 获取帮助

遇到问题？

1. 查看状态：`node .opencode/status.js`
2. 运行测试：`node .opencode/test.js`
3. 检查日志：`logs/` 目录
4. 查看文档：`docs/` 目录

---

**版本**: V4.2.0 | **更新时间**: 2026-02-24  
**下一步**: 阅读 `.opencode/agents/agentgv-router.md` 了解 Router 工作原理
