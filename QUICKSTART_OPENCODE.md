# AgentGV V5.0.0 - OpenCode 快速上手指南

## 🎉 安装完成！

AgentGV V5.0.0 已经成功安装到您的 OpenCode！

---

## ✅ 验证安装

所有检查已通过：

```
✓ OpenCode 已安装
✓ Node.js 依赖已安装
✓ 配置验证通过
✓ 所有测试通过 (18/18)
✓ 代码质量检查通过
```

---

## 🚀 立即开始使用

### 方式 1: OpenCode Desktop（推荐）

1. **打开 OpenCode Desktop**

2. **打开项目文件夹**
   ```
   File → Open Folder → E:\Projects\agentGV
   ```

3. **开始对话**
   
   在聊天窗口输入任何任务，例如：
   ```
   帮我调研 AI 市场
   ```

### 方式 2: OpenCode CLI

1. **在项目目录打开终端**

2. **启动 OpenCode**
   ```bash
   opencode
   ```

3. **输入任务**
   ```
   用 Python 开发一个 Web 应用
   ```

---

## 💡 使用示例

### 1. 软件开发

```
用 C++ Qt 开发一个串口调试助手
```

```
用 Python 写一个数据分析脚本
```

```
开发一个 React 前端页面
```

### 2. 创意写作

```
写一篇科幻小说，关于 AI 觉醒的故事
```

```
帮我写一个产品宣传文案
```

### 3. 市场调研

```
调研新能源汽车市场，包括主要玩家和技术趋势
```

```
分析竞品 AI 编程工具的优势劣势
```

### 4. 视觉任务（上传图片）

```
[上传架构图] 分析这个系统架构
```

```
[上传网页截图] 把这个设计转成 HTML/CSS 代码
```

### 5. 复杂项目

```
开发一个完整的用户管理系统，包含前后端，需要测试和文档
```

---

## 🎯 AgentGV 会自动做什么？

当您输入任务后，AgentGV 会自动：

1. **分析任务** - 理解您要做什么
2. **匹配 Skill** - 找到最合适的专业技能
3. **选择 Agent** - 路由到对应的部门
4. **自主执行** - 完成任务并交付结果

**无需手动指定 Agent！** 所有路由自动完成！

---

## 🔧 常用命令

### 验证配置
```bash
npm run validate
```

### 运行测试
```bash
npm test
npm run test:coverage
```

### 代码质量检查
```bash
npm run lint
npm run format:check
```

### 系统状态检查
```bash
node .opencode/status.js
```

### 设置偏好模式
```bash
# 质量优先模式
node .opencode/preference.js set quality

# 平衡模式
node .opencode/preference.js set balanced

# 成本优先模式
node .opencode/preference.js set cost
```

---

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| [AGENTS.md](AGENTS.md) | Agent 知识库 - 完整的 Agent 定义和 Skill 系统 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 贡献指南 - 如何参与项目开发 |
| [CHANGELOG.md](CHANGELOG.md) | 变更日志 - 版本历史记录 |
| [README.md](README.md) | 项目说明 - 快速开始和特性介绍 |
| [docs/user/CONFIGURATION.md](docs/user/CONFIGURATION.md) | 配置指南 - 详细配置说明 |
| [docs/user/TROUBLESHOOTING.md](docs/user/TROUBLESHOOTING.md) | 故障排查 - 常见问题解决 |
| [docs/api/ROUTER_API.md](docs/api/ROUTER_API.md) | Router API - 路由系统接口文档 |
| [INSTALL_OPENCODE.md](INSTALL_OPENCODE.md) | 安装指南 - 详细安装说明 |

---

## 🎭 5 大部门

AgentGV 包含 5 个专业化部门：

### 1. Router (路由器) - 主 Agent
- **职责**: 智能路由、任务协调
- **特点**: 自主执行、最小化人工干预

### 2. Planning (规划局)
- **职责**: 架构设计、技术方案、调研分析
- **Skills**: 仿真建模、市场研究、数据分析

### 3. Operations (执行部)
- **职责**: 功能开发、编码实现、文档编写
- **Skills**: 软件/硬件开发、创意写作

### 4. Quality (质检部)
- **职责**: 代码审查、测试验证、Bug 检测
- **特点**: 独立质量审查

### 5. Administration (行政部)
- **职责**: 复杂任务协调、多步骤工作流
- **特点**: 自主执行、工具编排

---

## 🎨 28 种 Skills

AgentGV 支持 5 大类 28 种专业技能：

### 软件开发 (8 种)
cpp, python, web, mobile, java, go, rust, devops

### 硬件电子 (3 种)
pcb, fpga, embedded

### 仿真建模 (3 种)
matlab, fea, cfd

### 创意写作 (5 种)
fiction, technical, content, script, translation

### 研究分析 (6 种)
academic, market, data, product, competitor, ux

---

## 🐛 遇到问题？

### 快速故障排查

**问题**: 配置验证失败

**解决**:
```bash
npm install
npm run validate
```

**问题**: Agent 未响应

**解决**:
```bash
# 重启 OpenCode
opencode reload

# 或重新打开项目
```

**问题**: 模型不可用

**解决**:
```bash
# 查看可用模型
opencode models

# 切换到推荐模型
node .opencode/preference.js set balanced
```

**更多帮助**: [docs/user/TROUBLESHOOTING.md](docs/user/TROUBLESHOOTING.md)

---

## 📊 版本信息

- **版本**: V5.0.0
- **发布日期**: 2026-02-25
- **状态**: ✅ 生产就绪
- **测试**: 18/18 通过
- **文档**: 95% 完整度

---

## 🎉 开始使用！

现在就可以在 OpenCode 中输入任何任务，体验 AgentGV V5.0.0 的强大功能！

**示例开场白**:
```
你好！帮我调研一下当前 AI 助手的市场情况
```

---

**祝您使用愉快！** 🚀
