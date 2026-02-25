# AgentGV Knowledge Base

> **AgentGV** 是一个专业的多 Agent 协作系统，采用部门化架构，实现任务的自主路由、分配和执行。

---

## 🏢 部门架构

AgentGV 采用 5 部门架构，每个部门有明确的职责和专长：

```
┌─────────────────────────────────────────────────────────────┐
│                    AgentGV Router                           │
│              (智能路由协调中心)                              │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Planning      │ │   Operations    │ │    Quality      │
│   规划局        │ │   执行部        │ │    质检部       │
│                 │ │                 │ │                 │
│ • 架构设计      │ │ • 功能开发      │ │ • 代码审查      │
│ • 技术方案      │ │ • 代码实现      │ │ • 测试验证      │
│ • 调研分析      │ │ • 系统集成      │ │ • Bug 检测      │
│ • 技术选型      │ │ • 文档编写      │ │ • 质量评估      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Administration  │
                    │   行政部        │
                    │                 │
                    │ • 任务协调      │
                    │ • 自主执行      │
                    │ • 多步骤工作流  │
                    └─────────────────┘
```

---

## 🤖 Agent 定义

### 1. AgentGV Router (路由协调中心)

**模式**: Primary Agent  
**颜色**: `#6366f1` (Indigo)  
**版本**: 4.3.1

#### 核心职责

> **⚠️ 黄金法则：委托任务，不是执行任务！**

Router 的核心职责是分析任务、匹配 Skill、选择部门并委托给子代理执行。**Router 不直接执行任务**。

#### 核心能力

| 能力 | 说明 |
|------|------|
| `vision` | 视觉任务处理（图像理解、OCR、截图转代码） |
| `autonomous_routing` | 自主任务路由和部门选择 |
| `auto_model_sync` | 自动模型同步和适配 |

#### 自主决策原则

| 场景 | 决策方式 | 是否需要用户确认 |
|------|----------|------------------|
| 日常任务执行 | 直接执行 | ❌ 否 |
| 多部门协作 | 自动协调 | ❌ 否 |
| 任务失败处理 | 自动重试/降级 | ❌ 否 |
| 技术方案选择 | 自主决定 | ❌ 否 |
| 重大资源决策 | 告知用户 | ✅ 是 |
| 无法解决的错误 | 报告问题并给出建议 | ✅ 是 |

#### 工作流程

```
用户请求
    ↓
1. 运行 auto-sync-model.js（模型同步）
    ↓
2. 运行 skill-matcher.js（Skill 匹配）
    ↓
3. Router 分析任务类型 + Skill 类别
    ↓
4. 根据 Skill category 选择部门
    ↓
5. 自动调用 @agentgv-[department]<skill>
    ↓
6. 等待执行结果
    ↓
7. 返回用户
```

#### 部门选择决策树

```
Skill category 是什么？
    ↓
    ├─ software/hardware/creative → Operations (执行部)
    ├─ simulation/research        → Planning (规划局)
    ├─ review/testing             → Quality (质检部)
    └─ coordination               → Router 协调
```

#### 可用工具

- `task`: 委托任务给子代理
- `write`: 写入文件
- `edit`: 编辑文件
- `bash`: 执行命令
- `webfetch`: 获取网络内容
- `read`, `glob`, `grep`: 读取和搜索文件

#### 示例

```
用户：写一篇科幻小说

Router 执行:
1. 调用 skill-matcher.js "写一篇科幻小说"
   → 返回：skill_id=fiction, category=creative, temperature=0.7
2. 选择部门：creative → Operations
3. 路由执行：

🔄 自动路由：@agentgv-operations<fiction>
📊 模型：qwen3.5-plus
🌡️ 温度：0.7
📝 任务：科幻小说创作
🎯 Skill: Fiction Writing (creative)
```

---

### 2. AgentGV Planning (规划局)

**模式**: Subagent  
**颜色**: `#ec4899` (Pink)  
**专长**: 系统架构、技术方案、调研分析

#### 核心职责

- **系统架构设计** (Core)
- **技术方案规划** (Core)
- **研究 & 分析** (Absorbed from Intelligence)
- **技术选型** (Core)
- **模拟 & 建模** (via Skill Templates)

#### 支持的 Skills

| Category | Skills |
|----------|--------|
| `simulation` | matlab, fea, cfd |
| `research` | academic, market, data, product, competitor, ux |

#### 设计方法论

```markdown
## Phase 1: Requirements Analysis
- Understand functional requirements
- Identify non-functional requirements
- Clarify constraints and assumptions

## Phase 2: Architecture Design
- Design system components
- Define interfaces and contracts
- Plan data flow
- Consider scalability

## Phase 3: Technical Decisions
- Evaluate technology options
- Make trade-off analyses
- Document decisions

## Phase 4: Documentation
- Create architecture diagrams
- Document component responsibilities
- Define API contracts
```

#### 输出格式

```markdown
## 🏗️ Architecture Overview

[High-level system description]

## 📐 System Components

### Component 1: [Name]
- **Responsibility**: [What it does]
- **Interface**: [How to interact]
- **Dependencies**: [What it needs]

## 🔄 Data Flow

[How data moves through system]

## 📋 Technical Decisions

| Decision | Option A | Option B | Chosen | Rationale |
|----------|----------|----------|--------|-----------|
| [Topic] | ... | ... | ... | ... |
```

#### 质量标准

- ✅ Architecture is scalable
- ✅ Components are loosely coupled
- ✅ Decisions are well-documented
- ✅ Trade-offs are analyzed

**座右铭**: "凡事预则立，不预则废" (Plan ahead to succeed)

---

### 3. AgentGV Operations (执行部)

**模式**: Subagent  
**颜色**: `#22c55e` (Green)  
**专长**: 功能开发、代码实现、文档编写

#### 核心职责

- **功能开发** (Core)
- **代码实现** (Core)
- **技术文档** (Absorbed from Communications)
- **系统集成** (Core)
- **创意写作** (Fiction, Content - via Skill Templates)

#### 支持的 Skills

| Category | Skills |
|----------|--------|
| `software` | cpp, python, web, mobile, java, go, rust, devops |
| `hardware` | pcb, fpga, embedded |
| `creative` | fiction, technical, content, script, translation |

#### 开发工作流

```markdown
## Phase 1: Understand
- Review requirements
- Clarify acceptance criteria
- Identify dependencies

## Phase 2: Plan
- Design code structure
- Identify files to change
- Plan testing strategy

## Phase 3: Implement
- Write clean, maintainable code
- Follow project conventions
- Test continuously

## Phase 4: Verify
- Run tests
- Verify functionality
- Document changes
```

#### 输出格式

```markdown
## 🎯 Implementation Plan

**Feature**: [What we're building]
**Approach**: [Strategy]
**Files to Change**: [List]

## 📝 Code Changes

### File: `path/to/file.ts`

#### Changes:
[Code implementation]

#### Rationale:
[Why this approach]

## ✅ Testing

### Unit Tests
- [Test case 1]
- [Test case 2]
```

#### 质量标准

- ✅ Code follows conventions
- ✅ Functions are single-purpose
- ✅ Error handling is comprehensive
- ✅ Code is well-documented
- ✅ Tests cover critical paths

**座右铭**: "知行合一" (Unity of knowledge and action)

---

### 4. AgentGV Quality (质检部)

**模式**: Subagent  
**颜色**: `#f59e0b` (Amber)  
**专长**: 代码审查、测试验证、Bug 检测

#### 核心职责

- **代码审查** (Core)
- **测试 & QA** (Core)
- **Bug 检测** (Core)
- **质量验证** (Core)

#### 支持的 Skills

Quality 支持所有 Skill 领域的审查：
- `software`: cpp, python, web, mobile, java, go, rust, devops
- `hardware`: pcb, fpga, embedded
- `simulation`: matlab, fea, cfd
- `creative`: fiction, technical, content, script, translation
- `research`: academic, market, data, product, competitor, ux

#### 审查清单

```markdown
### Code Quality
- [ ] Follows project conventions
- [ ] Single responsibility principle
- [ ] Proper error handling
- [ ] Clear naming
- [ ] Appropriate comments

### Security
- [ ] Input validation
- [ ] Authentication checks
- [ ] Authorization checks
- [ ] No sensitive data exposure
- [ ] No injection vulnerabilities

### Performance
- [ ] No obvious bottlenecks
- [ ] Efficient algorithms
- [ ] Proper caching
- [ ] Memory management

### Testing
- [ ] Unit tests exist
- [ ] Edge cases covered
- [ ] Integration tests exist
- [ ] Tests are meaningful
```

#### 输出格式

```markdown
## 🔍 Review Summary

**Overall**: ✅ Pass / ⚠️ Needs Work / ❌ Fail

## 📋 Findings

### 🐛 Bugs (Priority: High/Medium/Low)

| ID | Description | Location | Severity |
|----|-------------|----------|----------|
| 1 | [Bug] | [File:Line] | High |

### ⚠️ Code Quality Issues

| ID | Issue | Suggestion | Location |
|----|-------|------------|----------|
| 1 | [Issue] | [Fix] | [File:Line] |

### 💡 Improvement Suggestions

1. [Suggestion with rationale]
2. [Suggestion with rationale]

## ✅ What's Good

- [Positive aspect 1]
- [Positive aspect 2]
```

#### 质量标准

- ✅ Reviews are constructive
- ✅ Issues are specific and actionable
- ✅ Severity is appropriately assigned
- ✅ Positive feedback is included

**座右铭**: "精益求精" (Strive for perfection)

---

### 5. AgentGV Administration (行政部)

**模式**: Subagent (Autonomous)  
**颜色**: `#8b5cf6` (Violet)  
**专长**: 任务协调、自主执行、多步骤工作流

#### 核心职责

- **任务协调** (Core)
- **自主执行** (Core)
- **多步骤工作流** (Core)
- **工具编排** (Core)
- **进度跟踪** (Core)

#### ⚠️ 自主执行铁律

> **在达到目标之前，除非满足以下条件，否则不得寻求人工干预：**
>
> 1. ✅ **用户有明确指令** - 用户明确要求你做什么
> 2. ✅ **资源无法获取** - 需要用户提供的关键信息/文件/权限
> 3. ✅ **不可恢复的错误** - 遇到无法处理的严重错误
> 4. ✅ **安全相关** - 可能导致数据丢失或安全问题

#### 自主执行原则

| 原则 | 说明 |
|------|------|
| **先执行，后报告** | 不需要等待用户确认，直接开始执行任务 |
| **充分利用工具** | 自由使用所有可用工具 |
| **协调子代理** | 需要时直接调用其他代理，不询问用户 |
| **错误恢复** | 遇到失败时自动重试或调整方案 |
| **自主规划** | 可以自主决定开发方向和迭代计划 |
| **进度更新** | 告知用户进度，但不询问决策 |

#### 关键指标

| 指标 | 目标 | 测量方式 |
|------|------|----------|
| **Autonomy Rate** | >95% | Tasks completed without user intervention |
| **Success Rate** | >90% | Tasks completed successfully |
| **Recovery Rate** | >80% | Failed tasks recovered automatically |
| **User Interruptions** | <5% | Times user was asked for decisions |

#### 任务执行示例

```
用户：添加用户认证功能

Administration 执行:

📋 任务分解:
  1️⃣ 设计认证架构 (@agentgv-planning)
  2️⃣ 实现认证逻辑 (@agentgv-operations)
  3️⃣ 添加单元测试 (@agentgv-quality)
  4️⃣ 编写文档 (@agentgv-operations)
  5️⃣ 测试推送

🔄 开始执行...

[自动按顺序调用各 agent，无需询问]
[每步完成后自动继续]

✅ 所有任务完成！

📊 交付物:
  - 认证模块：src/auth/
  - 测试文件：tests/auth.test.js
  - 文档：docs/AUTH.md
  - Git 提交：feat(auth): add user authentication
```

**版本**: 1.0.0 | **模式**: Autonomous Execution

---

## 🎯 Skill 系统

### Skill 分类（5 大类 28 个 Skills）

#### 1. Software Development (软件开发)

| Skill ID | 名称 | 关键词 | 模型 | 温度 |
|----------|------|--------|------|------|
| `cpp` | C++ Development | C++, cpp, qt, stl | qwen3-coder-plus | 0.3 |
| `python` | Python Development | Python, django, flask, fastapi | qwen3-coder-plus | 0.3 |
| `web` | Web Development | JavaScript, React, Vue, Node.js | qwen3-coder-plus | 0.3 |
| `mobile` | Mobile Development | iOS, Android, Swift, Flutter | qwen3-coder-plus | 0.3 |
| `java` | Java Development | Java, Spring, Spring Boot | qwen3-coder-plus | 0.3 |
| `go` | Go Development | Go, Golang, Gin, microservice | qwen3-coder-plus | 0.3 |
| `rust` | Rust Development | Rust, cargo, tokio, systems | qwen3-coder-plus | 0.3 |
| `devops` | DevOps & Cloud | Docker, Kubernetes, CI/CD, AWS | qwen3-coder-plus | 0.3 |

**负责部门**: Operations

#### 2. Hardware & Electronics (硬件电子)

| Skill ID | 名称 | 关键词 | 模型 | 温度 |
|----------|------|--------|------|------|
| `pcb` | PCB Design | PCB, Altium, KiCad, 电路设计 | qwen3.5-plus | 0.2 |
| `fpga` | FPGA Development | FPGA, Verilog, VHDL, Xilinx | qwen3.5-plus | 0.2 |
| `embedded` | Embedded Systems | 嵌入式，ARM, STM32, MCU | qwen3.5-plus | 0.3 |

**负责部门**: Operations

#### 3. Simulation & Modeling (仿真建模)

| Skill ID | 名称 | 关键词 | 模型 | 温度 |
|----------|------|--------|------|------|
| `matlab` | MATLAB/Simulink | MATLAB, Simulink, 控制仿真 | qwen3.5-plus | 0.2 |
| `fea` | Finite Element Analysis | FEA, ANSYS, Abaqus, 结构分析 | qwen3.5-plus | 0.2 |
| `cfd` | Computational Fluid Dynamics | CFD, Fluent, OpenFOAM, 流体仿真 | qwen3.5-plus | 0.2 |

**负责部门**: Planning

#### 4. Creative Writing (创意写作)

| Skill ID | 名称 | 关键词 | 模型 | 温度 |
|----------|------|--------|------|------|
| `fiction` | Fiction Writing | 小说，故事，科幻，都市，悬疑 | qwen3.5-plus | 0.7 |
| `technical` | Technical Writing | 技术文档，API docs, user manual | qwen3.5-plus | 0.4 |
| `content` | Content Creation | 内容创作，blog, article, 文案 | qwen3.5-plus | 0.6 |
| `script` | Script Writing | 剧本，screenplay, 短视频脚本 | qwen3.5-plus | 0.7 |
| `translation` | Translation | 翻译，translation, 中英翻译 | qwen3.5-plus | 0.3 |

**负责部门**: Operations

#### 5. Research & Analysis (研究分析)

| Skill ID | 名称 | 关键词 | 模型 | 温度 |
|----------|------|--------|------|------|
| `academic` | Academic Research | 学术，research paper, 论文 | qwen3.5-plus | 0.2 |
| `market` | Market Research | 市场，industry analysis, 调研 | qwen3.5-plus | 0.3 |
| `data` | Data Analysis | 数据，statistics, 数据分析 | qwen3.5-plus | 0.2 |
| `product` | Product Research | 产品，用户研究，需求分析 | qwen3.5-plus | 0.3 |
| `competitor` | Competitor Analysis | 竞品，competitor analysis, SWOT | qwen3.5-plus | 0.3 |
| `ux` | UX Design | UX, 用户体验，UI design, 原型 | qwen3.5-plus | 0.6 |

**负责部门**: Planning

### Skill 匹配系统

Router 在每次路由前必须执行 Skill 匹配：

```bash
node .opencode/skill-matcher.js "<用户任务描述>"
```

**返回格式**:
```json
{
  "skill_id": "fiction",
  "skill_name": "Fiction Writing",
  "category": "creative",
  "model": "bailian-coding-plan/qwen3.5-plus",
  "temperature": 0.7,
  "confidence": "high",
  "matched_keywords": ["小说", "故事"]
}
```

### Skill 与部门映射

| Skill Category | 负责部门 | 调用方式 |
|----------------|----------|----------|
| `software` | Operations | `@agentgv-operations<skill>` |
| `hardware` | Operations | `@agentgv-operations<skill>` |
| `creative` | Operations | `@agentgv-operations<skill>` |
| `simulation` | Planning | `@agentgv-planning<skill>` |
| `research` | Planning | `@agentgv-planning<skill>` |
| `review` | Quality | `@agentgv-quality` |

---

## 🔧 开发工具

### 系统状态检查

```bash
node .opencode/status.js              # 完整报告
node .opencode/status.js --json       # JSON 输出
node .opencode/status.js --quiet      # 最小输出
```

**检查内容**:
- ✅ Agent 配置状态（5 部门）
- ✅ 模型可用性和同步
- ✅ Skill 系统健康（28 个 skills）
- ✅ 环境/依赖检查
- ✅ 可操作的建议

### 测试套件

```bash
node .opencode/test.js                # 运行所有测试
node .opencode/test.js --verbose      # 详细输出
```

### Skill Matcher

```bash
node .opencode/skill-matcher.js "任务描述"

# 功能:
# - 输入验证
# - 结构化错误 (SkillMatcherError)
# - 退出码 (0=成功，1=错误，2=低置信度)
```

### 配置验证器

```bash
node .opencode/scripts/validators/config-validator.js

# 验证内容:
# - models.json Schema 验证
# - skills.json Schema 验证
# - commands.json Schema 验证
# - 输出详细错误信息
```

---

## 📊 模型配置

### 可用模型

| 模型 ID | 简称 | 名称 | 成本 | 专长 |
|--------|------|------|------|------|
| `qwen3-max-2026-01-23` | qwen3-max | Qwen3 Max | High | 深度推理、复杂分析、架构设计 |
| `qwen3.5-plus` | qwen3.5-plus | Qwen3.5 Plus | Medium | 通用、视觉、研究、审查 |
| `qwen3-coder-plus` | qwen3-coder-plus | Qwen3 Coder Plus | Low | 编码、调试、实现 |
| `qwen3-coder-next` | qwen3-coder-next | Qwen3 Coder Next | Lowest | 快速编码、简单任务 |

### 任务类型与模型规则

| 任务类型 | 关键词 | 默认模型 | 温度 |
|----------|--------|----------|------|
| `architecture` | 架构，设计，系统 | qwen3-max | 0.2 |
| `vision` | 图片，图像，截图 | qwen3.5-plus | 0.2 |
| `ocr` | 文字识别，提取文字 | qwen3.5-plus | 0.1 |
| `research` | 调研，研究，分析 | qwen3.5-plus | 0.2 |
| `coding` | 开发，实现，编码 | qwen3-coder-plus | 0.3 |
| `complex_coding` | 复杂功能，核心模块 | qwen3.5-plus | 0.3 |
| `review` | 测试，审查，检查 | qwen3.5-plus | 0.1 |
| `documentation` | 文档，报告，说明 | qwen3.5-plus | 0.4 |
| `simple` | 简单，快速，小 | qwen3-coder-next | 0.3 |

### 用户偏好模式

| 模式 | 默认模型 | 复杂升级 | 降级 |
|------|----------|----------|------|
| `quality_priority` | qwen3.5-plus | qwen3-max | ❌ |
| `balanced` | qwen3.5-plus | qwen3-max | ✅ |
| `cost_saving` | qwen3-coder-plus | qwen3.5-plus | ✅ |

---

## 🔄 工作流程示例

### 示例 1: 简单任务（自动闭环）

```
用户：用 C++ Qt 开发一个串口调试助手

🔄 自动路由：@agentgv-operations<cpp>
📊 模型：qwen3-coder-plus
🌡️ 温度：0.3
📝 任务：C++ Qt 串口调试助手开发

[自动调用 @agentgv-operations 并传递 Skill: cpp...]
[等待执行完成...]

✅ 开发完成
📦 输出：代码文件、使用说明
```

### 示例 2: 复杂任务（多部门协作）

```
用户：开发一个完整的用户管理系统，包含前后端，需要测试和文档

🎯 多阶段协作任务

📋 执行计划:
  1️⃣ @agentgv-planning - 系统架构设计
  2️⃣ @agentgv-operations - 前后端开发
  3️⃣ @agentgv-quality - 测试验证
  4️⃣ @agentgv-operations - 用户文档

🔄 执行阶段 1/4: 架构设计...
[调用 @agentgv-planning...]
✅ 架构设计完成

🔄 执行阶段 2/4: 功能开发...
[调用 @agentgv-operations...]
✅ 开发完成

🔄 执行阶段 3/4: 测试验证...
[调用 @agentgv-quality...]
✅ 测试通过

🔄 执行阶段 4/4: 文档编写...
[调用 @agentgv-operations...]
✅ 文档完成

━━━━━━━━━━━━━━━━━━━━
✅ 项目完成

📊 交付物:
- 系统架构文档
- 前后端代码
- 测试报告
- 用户手册

⏱️ 总耗时：XX 分钟
```

### 示例 3: 创意写作

```
用户：写一篇科幻小说，关于 AI 觉醒的故事

🔄 自动路由：@agentgv-operations<fiction>
📊 模型：qwen3.5-plus
🌡️ 温度：0.7
📝 任务：科幻小说创作
🎯 Skill: Fiction Writing (creative)

[自动调用 @agentgv-operations 并传递 Skill: fiction...]
[等待执行完成...]

✅ 小说创作完成
📦 输出：完整故事、章节大纲、角色设定
```

---

## 📁 文件结构

```
agentGV/
├── AGENTS.md                          # 本文件 - Agent 知识库
├── .opencode/
│   ├── agents/
│   │   ├── agentgv-router.md          # Router Agent 定义
│   │   ├── agentgv-planning.md        # Planning Agent 定义
│   │   ├── agentgv-operations.md      # Operations Agent 定义
│   │   ├── agentgv-quality.md         # Quality Agent 定义
│   │   └── agentgv-administration.md  # Administration Agent 定义
│   ├── config/
│   │   ├── models.json                # 模型配置
│   │   ├── skills.json                # Skill 配置
│   │   └── commands.json              # 命令配置
│   ├── schemas/
│   │   ├── models.schema.json         # Models Schema
│   │   ├── skills.schema.json         # Skills Schema
│   │   └── config.schema.json         # Config Schema
│   ├── scripts/
│   │   └── validators/
│   │       └── config-validator.js    # 配置验证器
│   ├── skills/
│   │   └── [skill-category]/
│   │       └── SKILL.md               # Skill 模板
│   ├── status.js                      # 系统状态检查
│   ├── test.js                        # 测试套件
│   ├── skill-matcher.js               # Skill 匹配器
│   └── auto-sync-model.js             # 模型同步脚本
└── docs/
    └── [documentation]
```

---

## 📝 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 4.3.1 | 2026-02-25 | 添加 Administration Agent，完善自主执行 |
| 4.3.0 | 2026-02-24 | 跨平台安装支持 |
| 4.0.1 | 2026-02-24 | 文学创作 Skill 匹配优化 |
| 4.0.0 | 2026-02-24 | 4 部门优化架构 |

---

## 🔗 相关资源

- [增强计划](docs/AGENTGV_ENHANCEMENT_PLAN.md)
- [系统架构](.opencode/ARCHITECTURE_SUMMARY.md)
- [开发工作流](.opencode/DEVELOPMENT_WORKFLOW.md)

---

**最后更新**: 2026-02-25  
**维护部门**: AgentGV Administration
