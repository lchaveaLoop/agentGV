# Contributing to AgentGV

首先，感谢您考虑为 AgentGV 做出贡献！您的参与让我们的社区更加强大。

本指南将帮助您了解如何参与 AgentGV 的开发。

---

## 📋 目录

- [如何贡献代码](#如何贡献代码)
- [开发环境搭建](#开发环境搭建)
- [代码提交流程](#代码提交流程)
- [代码风格要求](#代码风格要求)
- [测试要求](#测试要求)
- [提交信息规范](#提交信息规范)
- [Issue 提交指南](#issue-提交指南)

---

## 🚀 如何贡献代码

### 1. Fork 项目

在 GitHub 上 Fork 本仓库到您的账户：

```
https://github.com/lchaveaLoop/agentGV/fork
```

### 2. Clone 仓库

```bash
git clone https://github.com/YOUR_USERNAME/agentGV.git
cd agentGV
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/issue-123
```

分支命名规范：
- `feature/xxx` - 新功能
- `fix/xxx` - Bug 修复
- `docs/xxx` - 文档更新
- `refactor/xxx` - 代码重构
- `test/xxx` - 测试相关

### 4. 开发并提交

按照 [代码风格要求](#代码风格要求) 编写代码，完成开发后提交。

### 5. 提交 Pull Request

在 GitHub 上创建 Pull Request 到 `main` 分支。

---

## 🛠️ 开发环境搭建

### 系统要求

- Node.js >= 18.0.0
- Git
- Windows PowerShell (Windows 用户) 或 Bash (Linux/Mac 用户)

### 安装步骤

1. **安装依赖**

```bash
npm install
```

2. **配置模型**

编辑 `.opencode/config/models.json` 配置可用模型。

3. **运行测试**

```bash
node .opencode/test.js
```

4. **验证配置**

```bash
node .opencode/scripts/validators/config-validator.js
```

### IDE 推荐

- **Visual Studio Code** - 推荐
- **WebStorm**
- 其他支持 JavaScript/TypeScript 的编辑器

### 推荐 VS Code 扩展

- ESLint
- Prettier
- GitLens
- Markdown All in One

---

## 📝 代码提交流程 (Pull Request)

### PR 流程

```
1. Fork 仓库
    ↓
2. 创建功能分支
    ↓
3. 开发功能
    ↓
4. 本地测试
    ↓
5. 提交代码
    ↓
6. 推送到远程
    ↓
7. 创建 Pull Request
    ↓
8. Code Review
    ↓
9. 合并到 main
```

### PR 检查清单

在创建 PR 前，请确保：

- [ ] 代码通过所有测试
- [ ] 遵循代码风格规范
- [ ] 添加了必要的测试用例
- [ ] 更新了相关文档
- [ ] 提交信息符合规范
- [ ] PR 描述清晰说明变更内容

### PR 模板

```markdown
## 🎯 变更目的

[说明此 PR 的目的]

## 📝 变更内容

- [变更 1]
- [变更 2]

## ✅ 测试验证

- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试完成

## 📋 相关 Issue

Fixes #123
```

---

## 📐 代码风格要求

### JavaScript/Node.js 规范

#### 1. 命名规范

```javascript
// 变量和函数 - 驼峰命名
const userName = 'John';
function getUserInfo() { }

// 类 - 大驼峰命名
class UserService { }

// 常量 - 大写 + 下划线
const MAX_RETRY_COUNT = 3;

// 文件命名 - 小写 + 连字符
// user-service.js
```

#### 2. 代码格式

```javascript
// 使用 2 空格缩进
function example() {
  const value = doSomething();
  return value;
}

// 操作符两侧留空格
const result = a + b;

// 行尾不加分号（可选，保持项目一致）
const item = getValue()

// 最大行长 100 字符
```

#### 3. 注释规范

```javascript
/**
 * 用户服务类
 * 处理用户相关的业务逻辑
 */
class UserService {
  /**
   * 获取用户信息
   * @param {string} userId - 用户 ID
   * @returns {Promise<Object>} 用户信息对象
   */
  async getUserInfo(userId) {
    // 单行注释说明复杂逻辑
    const cache = await this.getCache();
    return cache[userId];
  }
}
```

#### 4. 错误处理

```javascript
// 使用 try-catch 处理异步错误
async function fetchData() {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    if (error instanceof NetworkError) {
      throw new ServiceUnavailableError('Network error');
    }
    throw error;
  }
}

// 自定义错误类
class AgentGVError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AgentGVError';
    this.code = code;
  }
}
```

### Markdown 文档规范

```markdown
# 一级标题

## 二级标题

### 三级标题

- 列表项使用短横线
- 保持列表项对齐

**粗体** 用于强调
`行内代码` 使用反引号

[链接文本](url)
```

---

## 🧪 测试要求

### 测试类型

1. **单元测试** - 测试单个函数/模块
2. **集成测试** - 测试模块间交互
3. **系统测试** - 测试完整流程

### 测试覆盖要求

关键模块测试覆盖率应达到：
- 核心功能：≥ 80%
- 工具函数：≥ 70%
- 配置验证：≥ 90%

### 编写测试

```javascript
// 测试文件命名：*.test.js
// 位置：与源码同级或 tests/ 目录

const assert = require('assert');
const { SkillMatcher } = require('../skill-matcher');

describe('SkillMatcher', () => {
  describe('match()', () => {
    it('should match cpp skill for C++ related tasks', () => {
      const result = SkillMatcher.match('开发一个 C++ 程序');
      assert.strictEqual(result.skill_id, 'cpp');
    });

    it('should throw error for empty input', () => {
      assert.throws(() => SkillMatcher.match(''));
    });
  });
});
```

### 运行测试

```bash
# 运行所有测试
node .opencode/test.js

# 运行单个测试文件
node .opencode/test.js --file skill-matcher.test.js

# 详细输出
node .opencode/test.js --verbose
```

---

## 📋 提交信息规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(router): add skill matcher` |
| `fix` | Bug 修复 | `fix(agent): resolve routing issue` |
| `docs` | 文档更新 | `docs(readme): update installation guide` |
| `style` | 代码格式 | `style(eslint): fix linting errors` |
| `refactor` | 代码重构 | `refactor(core): improve performance` |
| `test` | 测试相关 | `test(matcher): add edge cases` |
| `chore` | 构建/工具 | `chore(deps): update dependencies` |
| `perf` | 性能优化 | `perf(router): reduce latency` |
| `ci` | CI/CD | `ci(github): add workflow` |

### Scope 范围

| Scope | 说明 |
|-------|------|
| `router` | Router Agent 相关 |
| `planning` | Planning Agent 相关 |
| `operations` | Operations Agent 相关 |
| `quality` | Quality Agent 相关 |
| `skill` | Skill 系统相关 |
| `model` | 模型配置相关 |
| `config` | 配置文件相关 |
| `docs` | 文档相关 |

### Subject 规范

- 使用现在时态（"add" 而非 "added"）
- 首字母小写
- 不以句号结尾
- 清晰简洁描述变更

### 完整示例

```
feat(skill): add new cpp skill template

- Add C++ development skill configuration
- Add keyword matching for Qt, STL, CMake
- Set default model to qwen3-coder-plus

Fixes #45
```

```
fix(router): resolve model sync issue

The model synchronization was failing when switching
models in OpenCode Desktop.

- Fix async/await handling in sync-agent-model.js
- Add error handling for network failures
- Add unit tests for sync functionality

Closes #78
```

---

## 🐛 Issue 提交指南

### 提交 Issue 前

1. 搜索现有 Issue，避免重复
2. 检查文档是否已解答
3. 准备复现步骤（Bug 类）

### Bug Report 模板

```markdown
## Bug 描述

[清晰简洁地描述问题]

## 复现步骤

1. 执行步骤 1
2. 执行步骤 2
3. 观察错误

## 期望行为

[说明应该发生什么]

## 实际行为

[说明实际发生了什么]

## 环境信息

- OS: [e.g. Windows 11]
- Node.js: [e.g. 18.17.0]
- AgentGV Version: [e.g. V4.3.2]

## 日志/截图

[如有，附上相关日志或截图]

## 可能原因

[如知道，说明可能的原因]
```

### Feature Request 模板

```markdown
## 功能描述

[描述期望的功能]

## 使用场景

[说明为什么需要此功能]

## 实现建议

[如有，提供实现思路]

## 替代方案

[如考虑过其他方案，请说明]

## 额外信息

[其他相关信息]
```

---

## 🏷️ 标签说明

| 标签 | 说明 |
|------|------|
| `bug` | 错误修复 |
| `enhancement` | 功能增强 |
| `documentation` | 文档相关 |
| `good first issue` | 适合新手 |
| `help wanted` | 需要帮助 |
| `question` | 问题咨询 |
| `wontfix` | 不会修复 |
| `duplicate` | 重复 Issue |

---

## 📞 联系方式

如有问题，请通过以下方式联系：

- **GitHub Issues**: https://github.com/lchaveaLoop/agentGV/issues
- **Email**: [项目邮箱]

---

## 🙏 致谢

感谢所有为 AgentGV 做出贡献的开发者！

您的每一次贡献都让这个项目变得更好。

---

**最后更新**: 2026-02-25  
**版本**: V4.3.2
