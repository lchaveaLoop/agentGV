# AgentGV - 政府式 Agent 团队

多 Agent 协作系统，模拟政府部门架构。支持动态模型路由、Skill 模板系统、质量优先模式、视觉理解。

[![Version](https://img.shields.io/badge/version-V6.0.0-blue.svg)](https://github.com/lchaveaLoop/agentGV/releases)

---

## 🎯 核心特性

- **纯路由架构**: Router 只负责任务解析，路由到 Administration（V6.0.0 新特性）
- **自主执行**: Administration 接管所有执行细节，实现 >95% 自主闭环
- **Skill 模板系统**: 基于 C++ 模板理念的部门模板化，支持多领域任务（5 大类 28 个 Skills）
- **动态模型分配**: 根据任务类型和复杂度自动选择最优模型
- **质量优先模式**: 复杂任务自动使用最强模型 (Qwen3 Max)
- **用户偏好**: 支持质量优先/平衡/成本优先 3 种模式
- **2 层架构**: Router（路由层）+ Administration（执行协调层）+ 3 个执行部门
- **部门化架构**: 5 个精简高效部门（Router/Administration/Planning/Operations/Quality）

---

## 🚀 快速开始

### 1. 安装

一键安装命令：

```bash
npm run install:oneclick
```

安装脚本将自动：

- ✅ 检查 Node.js 版本（>=18.0.0）
- ✅ 安装所有依赖
- ✅ 验证配置文件
- ✅ 运行测试套件
- ✅ 生成使用指南

**手动安装：**

```bash
npm install
npm run validate
npm test
```

详细安装指南请参阅 [INSTALL.md](INSTALL.md)。

### 3. 使用

```
帮我调研 AI 市场      ← 自动路由到 Planning
用 C++ 开发一个 Qt 程序  ← 自动匹配 cpp skill
设计一个 PCB 电路板    ← 自动匹配 pcb skill
```

无需 `@` 前缀，所有请求自动经过 Router 分发！

### 4. 设置偏好模式

直接告诉 Router 你的需求：

```
切换到质量优先模式    # 复杂任务使用 Qwen3 Max
切换到平衡模式        # 自动选择
切换到成本优先模式    # 优先使用经济模型
切换到 MiniMax 优化模式  # 优先使用 MiniMax M2.5/M1
```

或使用 CLI 脚本：

```bash
node .opencode/preference.js set quality
node .opencode/preference.js set balanced
node .opencode/preference.js set cost
node .opencode/preference.js set minimax
```

### 🆕 MiniMax 模型支持

现在支持 **MiniMax 系列模型**！🎉

**支持的模型**：

- **MiniMax M2.5** - 经济高效，适合日常开发
- **MiniMax M1** - 均衡性能，适合文档和调研

**了解更多**: [MiniMax 使用指南](docs/user/MINIMAX_GUIDE.md)

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    AgentGV Router                           │
│              (任务路由器 - 只解析，只路由)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                AgentGV Administration                       │
│        (执行协调中心 - Skill 匹配 | 模型分配 | 部门协调)     │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Planning      │ │   Operations    │ │    Quality      │
│   规划局        │ │   执行部        │ │    质检部       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 🤖 Agent 团队（5 部门）

| 部门               | 职责                            | 模型                          | 模式       |
| ------------------ | ------------------------------- | ----------------------------- | ---------- |
| **Router**         | 任务解析、路由到 Administration | qwen3.5-plus                  | primary    |
| **Administration** | Skill 匹配、模型分配、部门协调  | qwen3.5-plus                  | autonomous |
| **Planning**       | 架构设计、技术方案、调研分析    | qwen3.5-plus/qwen3-max        | subagent   |
| **Operations**     | 功能开发、编码实现、文档编写    | qwen3.5-plus/qwen3-coder-plus | subagent   |
| **Quality**        | 代码审查、测试验证、质量保障    | qwen3.5-plus                  | subagent   |

---

## 🎯 Skill 系统 (5 大类 28 个)

Router 内置 Skill 匹配能力，自动识别任务领域：

### 1. 软件开发 (Software) - 8 个 Skills

| Skill  | 关键词                     | 适用场景           |
| ------ | -------------------------- | ------------------ |
| cpp    | C++, Qt, STL               | 系统编程、桌面应用 |
| python | Python, Django, Flask      | Web 开发、数据分析 |
| web    | JavaScript, React, Node.js | 前后端开发         |
| mobile | iOS, Android, Flutter      | 移动应用开发       |
| java   | Java, Spring Boot          | 企业应用           |
| go     | Go, Golang, 微服务         | 后端服务           |
| rust   | Rust, 系统编程             | 系统开发           |
| devops | Docker, K8s, CI/CD         | 运维部署           |

### 2. 硬件电子 (Hardware) - 3 个 Skills

| Skill    | 关键词              | 适用场景   |
| -------- | ------------------- | ---------- |
| pcb      | PCB, Altium, KiCad  | 电路板设计 |
| fpga     | FPGA, Verilog, VHDL | 逻辑设计   |
| embedded | 嵌入式，ARM, STM32  | 嵌入式开发 |

### 3. 仿真建模 (Simulation) - 3 个 Skills

| Skill  | 关键词                | 适用场景 |
| ------ | --------------------- | -------- |
| matlab | MATLAB, Simulink      | 系统仿真 |
| fea    | ANSYS, Abaqus, FEA    | 结构分析 |
| cfd    | Fluent, OpenFOAM, CFD | 流体仿真 |

### 4. 创意写作 (Creative) - 5 个 Skills

| Skill       | 关键词         | 适用场景   |
| ----------- | -------------- | ---------- |
| fiction     | 小说，故事     | 小说创作   |
| technical   | 技术文档       | 技术写作   |
| content     | 内容创作，blog | 内容创作   |
| script      | 剧本，短视频   | 剧本写作   |
| translation | 翻译           | 多语言翻译 |

### 5. 研究分析 (Research) - 6 个 Skills

| Skill      | 关键词                  | 适用场景     |
| ---------- | ----------------------- | ------------ |
| academic   | 学术，research paper    | 学术研究     |
| market     | 市场，industry analysis | 市场调研     |
| data       | 数据，statistics        | 数据分析     |
| product    | 产品，用户研究          | 产品分析     |
| competitor | 竞品，SWOT              | 竞品分析     |
| ux         | UX, 用户体验            | 用户体验设计 |

---

## 🔄 工作流程示例

### 示例 1: 简单任务（Router → Administration → 部门）

```
用户：用 C++ Qt 开发一个串口调试助手

Router 分析:
- 类型：coding
- Skill: cpp

路由：@agentgv-administration

Administration 执行:
1. Skill 匹配：cpp
2. 模型分配：qwen3-coder-plus
3. 部门调用：@agentgv-operations<cpp>
4. 自主闭环执行

✅ 开发完成
```

### 示例 2: 复杂项目（多阶段协作）

```
用户：开发一个完整的用户管理系统，需要测试和文档

Router 分析:
- 类型：complex_coding
- 多阶段：是

路由：@agentgv-administration

Administration 执行计划:
1️⃣ @agentgv-planning - 系统架构设计
2️⃣ @agentgv-operations - 前后端开发
3️⃣ @agentgv-quality - 测试验证
4️⃣ @agentgv-operations - 用户文档

[Administration 自主协调各阶段，无需用户干预]

✅ 项目完成
```

### 示例 3: 创意写作

```
用户：写一篇科幻小说，关于 AI 觉醒的故事

Router 分析:
- 类型：creative
- Skill: fiction

路由：@agentgv-administration

Administration 执行:
1. Skill 匹配：fiction
2. 模型分配：qwen3.5-plus
3. 温度设置：0.7
4. 部门调用：@agentgv-operations<fiction>

✅ 小说创作完成
```

---

## 📊 动态模型路由

### 任务类型与模型映射

| 任务类型       | 关键词             | 默认模型         | 温度 |
| -------------- | ------------------ | ---------------- | ---- |
| architecture   | 架构，设计，系统   | qwen3-max        | 0.2  |
| complex_coding | 复杂功能，核心模块 | qwen3.5-plus     | 0.3  |
| coding         | 开发，实现，编码   | qwen3-coder-plus | 0.3  |
| research       | 调研，研究，分析   | qwen3.5-plus     | 0.2  |
| review         | 测试，审查，检查   | qwen3.5-plus     | 0.1  |
| documentation  | 文档，报告，说明   | qwen3.5-plus     | 0.4  |
| vision         | 图片，图像，截图   | qwen3.5-plus     | 0.2  |
| simple         | 简单，快速，小     | qwen3-coder-next | 0.3  |

### 用户偏好模式

| 模式                 | 说明     | 默认模型         | 复杂升级     | 降级 |
| -------------------- | -------- | ---------------- | ------------ | ---- |
| **quality_priority** | 质量优先 | qwen3.5-plus     | qwen3-max    | ❌   |
| **balanced**         | 平衡模式 | qwen3.5-plus     | qwen3-max    | ✅   |
| **cost_saving**      | 成本优先 | qwen3-coder-plus | qwen3.5-plus | ✅   |

---

## 🛠️ 常用命令

### 系统状态

```bash
# 完整状态检查
node .opencode/status.js

# JSON 输出
node .opencode/status.js --json

# 运行测试
node .opencode/test.js
```

### Skill 匹配

```bash
# 测试 Skill 匹配
node .opencode/skill-matcher.js "开发一个 C++ 程序"
node .opencode/skill-matcher.js "设计 PCB 电路板"
node .opencode/skill-matcher.js "写一篇技术文档"
```

### 模型同步

```bash
# 交互式同步
.\.opencode\sync-agent-model.ps1

# 指定模型
.\.opencode\sync-agent-model.ps1 -Model "bailian-coding-plan/qwen3.5-plus"

# 查看当前配置
.\.opencode\sync-agent-model.ps1 -Show
```

---

## 📚 文档

### 开发者文档

- [快速开始](docs/dev/GETTING_STARTED.md) - 开发者快速上手
- [架构设计](docs/dev/ARCHITECTURE.md) - 系统架构说明

### 用户文档

- [配置指南](docs/user/CONFIGURATION.md) - 系统配置说明
- [故障排查](docs/user/TROUBLESHOOTING.md) - 常见问题解决

### API 文档

- [Router API](docs/api/ROUTER_API.md) - Router 接口文档
- [Model API](docs/api/MODEL_API.md) - Model 管理文档
- [Skill API](docs/api/SKILL_API.md) - Skill 匹配文档

### 社区文档

- [贡献指南](CONTRIBUTING.md) - 如何贡献代码
- [行为准则](CODE_OF_CONDUCT.md) - 社区规范
- [变更日志](CHANGELOG.md) - 版本历史
- [许可协议](CLA.md) - 贡献者协议

---

## 🔧 开发状态

| 组件           | 状态    | 说明         |
| -------------- | ------- | ------------ |
| Router         | ✅ 稳定 | 智能路由核心 |
| Planning       | ✅ 稳定 | 规划与设计   |
| Operations     | ✅ 稳定 | 功能开发     |
| Quality        | ✅ 稳定 | 质量保障     |
| Administration | ✅ 新增 | 自主执行     |
| Skill 系统     | ✅ 完善 | 28 个 Skills |
| 视觉功能       | ✅ 支持 | 图像理解     |
| 模型同步       | ✅ 支持 | 实时同步     |

---

## 🤝 参与贡献

我们欢迎各种形式的贡献！

1. **Fork 项目**: https://github.com/lchaveaLoop/agentGV/fork
2. **创建分支**: `git checkout -b feature/your-feature`
3. **提交变更**: `git commit -m 'feat: add new feature'`
4. **推送到远程**: `git push origin feature/your-feature`
5. **创建 Pull Request**: 在 GitHub 上提交

详见 [贡献指南](CONTRIBUTING.md)

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)

---

## 🔗 相关链接

- **GitHub**: https://github.com/lchaveaLoop/agentGV
- **Issue 追踪**: https://github.com/lchaveaLoop/agentGV/issues
- **文档**: https://github.com/lchaveaLoop/agentGV/tree/main/docs

---

**版本**: V6.0.0 | **日期**: 2026-03-03  
**架构**: 2 层纯路由架构 | **Agents**: Router + Administration + Planning + Operations + Quality  
**Skills**: 5 大类 28 个 | **自主性**: >95% | **Router 职责**: 只解析，只路由
