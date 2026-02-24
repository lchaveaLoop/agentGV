# AgentGV - Government-Style Agent Teams

多 Agent 协作系统，模拟政府部门架构。支持动态模型路由、Skill 模板系统、质量优先模式、视觉理解。

## 🎯 核心特性

- **智能路由**: Router Agent 自动分发任务到对应部门
- **Skill 模板系统**: 基于 C++ 模板理念的部门模板化，支持多领域任务
- **动态模型分配**: 根据任务类型和复杂度自动选择最优模型
- **质量优先模式**: 复杂任务自动使用最强模型 (Qwen3 Max)
- **用户偏好**: 支持质量优先/平衡/成本优先 3 种模式
- **视觉理解**: 支持图像分析、OCR 识别、截图转代码、文档解析（qwen3.5-plus）

---

## 🚀 快速开始

### 1. 安装

双击运行 `install.ps1`

### 2. 模型配置

安装时会自动检测可用模型并配置。

**指定模型安装：**
```powershell
$env:AGENTGV_MODEL = "bailian-coding-plan/qwen3.5-plus"
.\install.ps1
```

### 3. 使用

```
帮我调研 AI 市场  ← 自动路由到对应 Agent
用 C++ 开发一个 Qt 程序  ← 自动匹配 cpp skill
设计一个 PCB 电路板  ← 自动匹配 pcb skill
```

无需 `@` 前缀，所有请求自动经过 Router 分发！

### 4. 设置偏好模式

直接告诉 Router 你的需求：

```
切换到质量优先模式    # 复杂任务使用 Qwen3 Max
切换到平衡模式        # 自动选择
切换到成本优先模式    # 优先使用经济模型
```

或使用 CLI 脚本：
```bash
node .opencode/preference.js set quality
node .opencode/preference.js set balanced
node .opencode/preference.js set cost
```

### 5. 测试 Skill 匹配

```bash
node .opencode/skill-matcher.js "开发一个 C++ Qt 程序"
node .opencode/skill-matcher.js "设计一个 PCB 电路板"
node .opencode/skill-matcher.js "写一篇技术文档"
```

### 6. 视觉理解（新功能）

**直接上传图片并提问**（OpenCode Desktop）:
```
[上传图片] 分析这个架构图
[上传截图] 把这个网页转换成 HTML/CSS 代码
[上传发票] 提取这张发票的信息，JSON 格式输出
[上传文档] 将这个 PDF 扫描件转成 Markdown
```

**支持的视觉任务**:
- ✅ 图像理解与问答
- ✅ OCR 文字识别
- ✅ 截图转代码（Image to Code）
- ✅ 文档解析（PDF/扫描件）
- ✅ 多图像对比分析
- ✅ 图表/流程图分析

**⚠️ 注意**: 使用视觉功能需要切换到支持视觉的模型（如 qwen3.5-plus）

### 7. 模型同步（新功能）

**在 OpenCode Desktop 切换模型后同步 Agent 模型**:

```powershell
# 交互式模式
.\.opencode\sync-agent-model.ps1

# 直接设置模型（切换到视觉模型）
.\.opencode\sync-agent-model.ps1 -Model "bailian-coding-plan/qwen3.5-plus"

# 查看当前配置
.\.opencode\sync-agent-model.ps1 -Show
```

**可用模型**:
| 编号 | 模型 | 说明 |
|------|------|------|
| 1 | qwen3.5-plus | **推荐** - 支持视觉、平衡性能 |
| 2 | qwen3-max | 最强 - 复杂任务 |
| 3 | qwen3-coder-plus | 代码优化 |
| 4 | qwen3-coder-next | 快速 |
| 5 | minimax/m2.5 | MiniMax |
| 6 | glm-5-free | 免费 |

---

## 🏗️ 架构演进

| 版本 | 架构 | Agent 数 | 支持领域 |
|------|------|---------|---------|
| V1 | 7 Agent | 7 | 固定 |
| V2 | 4 Agent | 4 | 固定 |
| **V3** | **4+N 模板** | **4+15** | **可扩展** |

**当前架构**: 4 个模板部门 + 15 个 Skill = 支持 5 大领域

---

## 🤖 模板部门

### Router (路由器)
- **职责**: 智能路由，Skill 匹配，项目协调
- **模型**: bailian-coding-plan/qwen3.5-plus
- **模式**: primary
- **特性**: Skill-based template matching

### Planning (规划局) - 模板部门
- **职责**: 架构设计，技术方案，系统规划
- **模板**: `Planning<Skill>`
- **支持 Skill**: 15 个 (software/hardware/simulation/creative/research)
- **模型**: 根据 Skill 动态分配

### Operations (执行部) - 模板部门
- **职责**: 功能开发，编码实现，文档编写
- **模板**: `Operations<Skill>`
- **支持 Skill**: 15 个
- **模型**: 根据 Skill 动态分配

### Quality (质检部) - 模板部门
- **职责**: 代码审查，测试，质量验证
- **模板**: `Quality<Skill>`
- **支持 Skill**: 15 个
- **模型**: 根据 Skill 动态分配

---

## 💡 Skill 模板系统

### 设计理念

受 C++ 模板函数/模板类启发：

```cpp
// C++ 模板类比
template<typename Skill>
void Planning::design();

template<typename Skill>
void Operations::implement();

template<typename Skill>
void Quality::review();

// AgentGV 实现
Planning<cpp>       // C++ 规划设计
Planning<pcb>       // PCB 规划设计
Operations<python>  // Python 实现
Operations<fiction> // 小说创作
Quality<web>        // Web 项目审查
```

### Skill 分类 (5 大类 15 个)

#### 1. 软件开发 (Software)
| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| cpp | C++, Qt, STL | 系统编程、桌面应用 |
| python | Python, Django, Flask | Web 开发、数据分析 |
| web | JavaScript, React, Node.js | 前后端开发 |
| mobile | iOS, Android, Flutter | 移动应用开发 |

#### 2. 硬件电子 (Hardware)
| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| pcb | PCB, Altium, KiCad | 电路板设计 |
| fpga | FPGA, Verilog, VHDL | 逻辑设计 |
| embedded | 嵌入式，ARM, STM32 | 嵌入式开发 |

#### 3. 仿真建模 (Simulation)
| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| matlab | MATLAB, Simulink | 系统仿真 |
| fea | ANSYS, Abaqus, FEA | 结构分析 |
| cfd | Fluent, OpenFOAM, CFD | 流体仿真 |

#### 4. 文学创作 (Creative)
| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| fiction | 小说，故事，fiction | 小说创作 |
| technical | 技术文档，documentation | 技术写作 |
| content | 内容创作，blog, article | 内容创作 |

#### 5. 研究分析 (Research)
| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| academic | 学术，research paper | 学术研究 |
| market | 市场，industry analysis | 市场调研 |
| data | 数据，statistics | 数据分析 |

### 使用示例

**示例 1: 软件开发**
```
用户：用 C++ Qt 开发一个串口调试助手
Router:
- Skill: cpp (C++ Development)
- Department: Operations
- Model: qwen3-coder-plus
路由：@agentgv-operations<cpp>
```

**示例 2: 硬件设计**
```
用户：设计一个 ESP32 WiFi 模块的 PCB
Router:
- Skill: pcb (PCB Design)
- Department: Planning
- Model: qwen3.5-plus
路由：@agentgv-planning<pcb>
```

**示例 3: 文学创作**
```
用户：写一篇关于 AI 的科幻小说
Router:
- Skill: fiction (Fiction Writing)
- Department: Operations
- Model: qwen3.5-plus (temperature: 0.7)
路由：@agentgv-operations<fiction>
```

---

## 📊 动态模型路由

### 任务类型与模型映射

| 任务类型 | 关键词 | 默认模型 | 温度 |
|----------|--------|----------|------|
| architecture | 架构，设计，系统，技术方案 | qwen3-max-2026-01-23 | 0.2 |
| complex_research | 深度分析，复杂调研，全面研究 | qwen3-max-2026-01-23 | 0.2 |
| research | 调研，研究，分析，市场 | qwen3.5-plus | 0.2 |
| complex_coding | 复杂功能，核心模块，关键代码 | qwen3.5-plus | 0.3 |
| coding | 开发，实现，编码，功能 | qwen3-coder-plus | 0.3 |
| review | 测试，审查，检查，质量，bug | qwen3.5-plus | 0.1 |
| documentation | 文档，报告，说明，写作 | qwen3.5-plus | 0.4 |
| coordination | 协调，管理，统筹，多部门 | qwen3.5-plus | 0.3 |
| simple | 简单，快速，小，修改 | qwen3-coder-next | 0.3 |

### 复杂度规则

**高复杂度** → 升级到 `qwen3-max-2026-01-23`
- 关键词：复杂，大型，完整，从零开始，核心，关键，全面，深度

**低复杂度** → 可降级到 `qwen3-coder-next`
- 关键词：简单，快速，小，修改，微调

### 用户偏好模式

| 模式 | 说明 | 默认模型 | 复杂升级 | 降级 |
|------|------|----------|----------|------|
| **quality_priority** | 质量优先 - 复杂任务用最强模型 | qwen3.5-plus | qwen3-max | ❌ |
| **balanced** | 平衡模式 - 自动选择 | qwen3.5-plus | qwen3-max | ✅ |
| **cost_saving** | 成本优先 - 优先经济模型 | qwen3-coder-plus | qwen3.5-plus | ✅ |

---

## 🛠️ 工程规范

### 代码提交

每个功能开发完成后自动执行：
1. 自测 + 集成测试
2. 路由到 @quality 审查
3. 修复问题
4. 提交代码并推送
5. **更新文档（自主执行）**

提交格式遵循 Conventional Commits：
- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `refactor:` 重构
- `test:` 测试

### 测试流程

```
开发完成 → 自测 → 集成测试 → Quality 审查 → 修复 → 验证 → 提交 → 文档更新 → ✅
```

### 文档闭环

**重要**: 任何功能更新后，必须自主更新以下文档：
- README.md（项目主文档）
- 相关技术文档
- CHANGELOG（如有必要）

---

## 📖 文档

- `README.md` - 项目说明（本文档）
- `.opencode/SKILL_TEMPLATE_SYSTEM.md` - Skill 模板系统详细说明
- `.opencode/MODEL_ROUTING.md` - 模型路由详细规则
- `.opencode/README_COMMANDS.md` - 命令使用说明
- `.opencode/ARCHITECTURE_OPTIMIZATION_COMPLETE.md` - 架构优化报告
- `.opencode/VISION_CAPABILITIES.md` - 视觉理解能力指南 ⭐ NEW
- `.opencode/AGENT_MODEL_SYNC.md` - 模型同步指南 ⭐ NEW
- `agents/*/AGENT.md` - Agent 详细角色定义
- `.opencode/agents/*.md` - OpenCode Agent 配置

---

**版本**: 3.3 | **日期**: 2026-02-24  
**License**: MIT | **Repository**: github.com/lchaveaLoop/agentGV  
**架构**: 模板化 (Template-Based) | **Skill**: 5 大类 15 个  
**视觉**: ✅ 图像理解 | OCR | 截图转代码 | 文档解析  
**同步**: ✅ 模型实时同步 | 6 种模型可选
