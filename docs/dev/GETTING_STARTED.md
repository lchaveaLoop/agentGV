# Getting Started for Developers

开发者快速开始指南，帮助您快速上手 AgentGV 开发。

---

## 📋 目录

- [前置要求](#前置要求)
- [环境搭建](#环境搭建)
- [项目结构](#项目结构)
- [开发工作流](#开发工作流)
- [调试技巧](#调试技巧)
- [测试指南](#测试指南)
- [下一步](#下一步)

---

## ✅ 前置要求

### 必需软件

| 软件 | 版本要求 | 下载链接 |
|------|----------|----------|
| Node.js | >= 18.0.0 | https://nodejs.org/ |
| Git | 最新稳定版 | https://git-scm.com/ |
| 代码编辑器 | 任意 | VS Code 推荐 |

### 验证安装

```bash
# 检查 Node.js 版本
node --version
# 应显示：v18.x.x 或更高

# 检查 npm 版本
npm --version
# 应显示：9.x.x 或更高

# 检查 Git 版本
git --version
# 应显示：git version 2.x.x
```

---

## 🛠️ 环境搭建

### 1. 克隆仓库

```bash
git clone https://github.com/lchaveaLoop/agentGV.git
cd agentGV
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置模型

编辑 `.opencode/config/models.json`：

```json
{
  "models": [
    {
      "id": "bailian-coding-plan/qwen3.5-plus",
      "name": "Qwen3.5 Plus",
      "enabled": true
    }
  ]
}
```

### 4. 验证配置

```bash
# 运行配置验证器
node .opencode/scripts/validators/config-validator.js

# 运行测试套件
node .opencode/test.js
```

### 5. 安装成功标志

看到以下输出表示安装成功：

```
✅ 所有配置验证通过
✅ 测试套件运行完成
```

---

## 📁 项目结构

```
agentGV/
├── .opencode/
│   ├── agents/              # Agent 定义文件
│   │   ├── agentgv-router.md
│   │   ├── agentgv-planning.md
│   │   ├── agentgv-operations.md
│   │   ├── agentgv-quality.md
│   │   └── agentgv-administration.md
│   ├── config/              # 配置文件
│   │   ├── models.json      # 模型配置
│   │   ├── skills.json      # Skill 配置
│   │   └── commands.json    # 命令配置
│   ├── schemas/             # JSON Schema 定义
│   │   ├── models.schema.json
│   │   ├── skills.schema.json
│   │   └── config.schema.json
│   ├── scripts/             # 工具脚本
│   │   └── validators/
│   │       └── config-validator.js
│   ├── skills/              # Skill 模板
│   │   ├── software/
│   │   ├── hardware/
│   │   ├── simulation/
│   │   ├── creative/
│   │   └── research/
│   ├── status.js            # 状态检查脚本
│   ├── test.js              # 测试套件
│   ├── skill-matcher.js     # Skill 匹配器
│   └── auto-sync-model.js   # 模型同步脚本
├── docs/                    # 文档目录
│   ├── dev/                 # 开发者文档
│   ├── user/                # 用户文档
│   └── api/                 # API 文档
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

### 关键目录说明

| 目录 | 用途 | 修改频率 |
|------|------|----------|
| `.opencode/agents/` | Agent 角色定义 | 低 |
| `.opencode/config/` | 系统配置 | 中 |
| `.opencode/skills/` | Skill 模板 | 中 |
| `.opencode/scripts/` | 工具脚本 | 低 |
| `docs/` | 文档 | 高 |

---

## 🔄 开发工作流

### 1. 创建功能分支

```bash
# 从 main 分支创建新分支
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. 开发功能

按照以下流程开发：

```
理解需求 → 设计方案 → 编写代码 → 运行测试 → 提交代码
```

### 3. 运行测试

```bash
# 运行完整测试
node .opencode/test.js

# 运行特定测试
node .opencode/test.js --file skill-matcher.test.js

# 详细输出
node .opencode/test.js --verbose
```

### 4. 验证配置

```bash
# 验证配置文件
node .opencode/scripts/validators/config-validator.js

# 检查系统状态
node .opencode/status.js
```

### 5. 提交代码

```bash
# 查看变更
git status
git diff

# 添加文件
git add .

# 提交（遵循 Conventional Commits）
git commit -m "feat(skill): add new feature"

# 推送
git push origin feature/your-feature-name
```

### 6. 创建 Pull Request

在 GitHub 上创建 PR，等待审查。

---

## 🐛 调试技巧

### 1. 启用调试模式

```bash
# 设置调试环境变量
$env:DEBUG = "agentgv:*"  # PowerShell
export DEBUG=agentgv:*    # Linux/Mac

# 运行脚本
node .opencode/skill-matcher.js "test query"
```

### 2. 使用日志

在代码中添加日志：

```javascript
const debug = require('debug')('agentgv:matcher');

function matchSkill(query) {
  debug('Matching query:', query);
  const result = doMatch(query);
  debug('Match result:', result);
  return result;
}
```

### 3. 单步调试

使用 VS Code 调试：

1. 在代码中设置断点
2. 按 F5 启动调试
3. 查看变量和调用栈

### 4. 检查配置

```bash
# 查看当前配置
node -e "console.log(require('./.opencode/config/models.json'))"
```

### 5. 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 配置验证失败 | JSON 格式错误 | 使用 JSON 验证器检查 |
| 测试失败 | 依赖未安装 | 运行 `npm install` |
| Skill 匹配失败 | 关键词不匹配 | 检查 skills.json |
| 模型不可用 | 配置错误 | 检查 models.json |

---

## 🧪 测试指南

### 测试类型

#### 单元测试

测试单个函数或模块：

```javascript
// test/skill-matcher.test.js
const assert = require('assert');
const { SkillMatcher } = require('../skill-matcher');

describe('SkillMatcher', () => {
  it('should match cpp skill', () => {
    const result = SkillMatcher.match('C++ 开发');
    assert.strictEqual(result.skill_id, 'cpp');
  });
});
```

#### 集成测试

测试模块间交互：

```javascript
// test/integration.test.js
describe('Router Integration', () => {
  it('should route to correct agent', async () => {
    const router = new Router();
    const result = await router.route('开发一个 C++ 程序');
    assert.strictEqual(result.agent, 'operations');
  });
});
```

#### 系统测试

测试完整流程：

```bash
# 运行系统测试
node .opencode/test.js --type system
```

### 测试覆盖率

```bash
# 生成覆盖率报告
npm test -- --coverage

# 查看覆盖率报告
# 打开 coverage/index.html
```

### 测试最佳实践

- ✅ 每个测试只验证一个行为
- ✅ 测试名称清晰描述预期
- ✅ 使用 Arrange-Act-Assert 模式
- ✅ 测试边界条件和错误情况
- ✅ 保持测试独立，不依赖顺序

---

## 📚 下一步

完成本指南后，您可以：

1. **阅读架构文档**
   - [ARCHITECTURE.md](ARCHITECTURE.md) - 了解系统架构

2. **查看 API 文档**
   - [ROUTER_API.md](../api/ROUTER_API.md) - Router API
   - [MODEL_API.md](../api/MODEL_API.md) - Model API
   - [SKILL_API.md](../api/SKILL_API.md) - Skill API

3. **学习配置**
   - [CONFIGURATION.md](../user/CONFIGURATION.md) - 配置指南

4. **开始贡献**
   - [CONTRIBUTING.md](../../CONTRIBUTING.md) - 贡献指南
   - 查找 [good first issues](https://github.com/lchaveaLoop/agentGV/issues?q=is%3Aissue+label%3A%22good+first+issue%22)

5. **加入社区**
   - GitHub Discussions
   - 开发者邮件列表

---

## 🆘 获取帮助

如遇到问题：

1. **查看文档**: [docs/](../)
2. **搜索 Issue**: https://github.com/lchaveaLoop/agentGV/issues
3. **提交 Issue**: 使用适当的模板
4. **联系维护者**: @lchaveaLoop

---

**最后更新**: 2026-02-25  
**版本**: V5.0.0  
**适用**: AgentGV 开发者
