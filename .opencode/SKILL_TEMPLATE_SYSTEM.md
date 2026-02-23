# AgentGV Skill 模板系统

**版本**: 1.0.0  
**日期**: 2026-02-23  
**状态**: ✅ 已实施

---

## 🎯 设计理念

受 C++ 模板函数/模板类启发，将各部门变为**模板化部门**，通过动态分配 Skill 来适应多领域任务。

### 核心思想

```cpp
// C++ 模板类比
template<typename Skill>
void Planning::design() {
  // 使用 Skill 的专业知识进行设计
}

template<typename Skill>
void Operations::implement() {
  // 使用 Skill 的最佳实践进行实现
}

template<typename Skill>
void Quality::review() {
  // 使用 Skill 的标准进行审查
}
```

---

## 🏗️ 系统架构

### 架构对比

**传统架构**:
```
每个领域需要专门的 Agent
- 软件开发 Agent
- 硬件设计 Agent
- 仿真分析 Agent
- 文学创作 Agent
...
→ Agent 数量爆炸，维护困难
```

**模板架构**:
```
模板部门 + Skill 库
- Planning<Skill>
- Operations<Skill>
- Quality<Skill>
→ 4 个模板部门，N 个 Skill，灵活组合
```

---

## 📦 系统组成

### 1. Skill 定义 (skills.json)

```json
{
  "skill_categories": {
    "software": {
      "skills": [
        {"id": "cpp", "name": "C++ Development", ...},
        {"id": "python", "name": "Python Development", ...},
        {"id": "web", "name": "Web Development", ...}
      ]
    },
    "hardware": {
      "skills": [
        {"id": "pcb", "name": "PCB Design", ...},
        {"id": "fpga", "name": "FPGA Development", ...},
        {"id": "embedded", "name": "Embedded Systems", ...}
      ]
    },
    "simulation": {...},
    "creative": {...},
    "research": {...}
  }
}
```

### 2. Skill 匹配器 (skill-matcher.js)

```javascript
// 根据任务描述自动匹配 Skill
const match = getBestSkill("开发一个 C++ Qt 程序");
// 返回：{skill: "cpp", category: "software", model: "qwen3-coder-plus"}
```

### 3. 模板部门配置

```json
{
  "template_departments": {
    "planning": {
      "base_prompt": "You are the Planning Department with {skill_name} expertise.",
      "applicable_skills": ["all"],
      "output_format": "Design document with {skill_name} considerations"
    },
    "operations": {
      "base_prompt": "You are the Operations Department with {skill_name} expertise.",
      "applicable_skills": ["all"],
      "output_format": "Implementation with {skill_name} best practices"
    },
    "quality": {
      "base_prompt": "You are the Quality Department with {skill_name} expertise.",
      "applicable_skills": ["all"],
      "output_format": "Quality review with {skill_name} standards"
    }
  }
}
```

---

## 🎯 Skill 分类

### 1. 软件开发 (Software)

| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| cpp | C++, Qt, STL | 系统编程、桌面应用 |
| python | Python, Django, Flask | Web 开发、数据分析 |
| web | JavaScript, React, Node.js | 前后端开发 |
| mobile | iOS, Android, Flutter | 移动应用开发 |

### 2. 硬件电子 (Hardware)

| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| pcb | PCB, Altium, KiCad | 电路板设计 |
| fpga | FPGA, Verilog, VHDL | 逻辑设计 |
| embedded | 嵌入式，ARM, STM32 | 嵌入式开发 |

### 3. 仿真建模 (Simulation)

| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| matlab | MATLAB, Simulink | 系统仿真 |
| fea | ANSYS, Abaqus, FEA | 结构分析 |
| cfd | Fluent, OpenFOAM, CFD | 流体仿真 |

### 4. 文学创作 (Creative)

| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| fiction | 小说，故事，fiction | 小说创作 |
| technical | 技术文档，documentation | 技术写作 |
| content | 内容创作，blog, article | 内容创作 |

### 5. 研究分析 (Research)

| Skill | 关键词 | 适用场景 |
|-------|--------|----------|
| academic | 学术，research paper | 学术研究 |
| market | 市场，industry analysis | 市场调研 |
| data | 数据，statistics | 数据分析 |

---

## 🔄 工作流程

### 完整流程

```
用户任务
   ↓
┌─────────────────┐
│ Router 分析     │
│ - 识别领域      │
│ - 匹配 Skill    │
└───────┬─────────┘
        ↓
┌─────────────────┐
│ 选择部门        │
│ - Planning?     │
│ - Operations?   │
│ - Quality?      │
└───────┬─────────┘
        ↓
┌─────────────────┐
│ 激活模板        │
│ Planning<Skill> │
│ 或              │
│ Operations<Skill│
│ 或              │
│ Quality<Skill>  │
└───────┬─────────┘
        ↓
   执行任务
```

### 示例

**任务**: "开发一个 C++ Qt 界面程序"

1. **Router 分析**:
   - 领域：software
   - Skill: cpp (C++ Development)
   - 部门：Operations

2. **激活模板**:
   ```
   Operations<cpp>
   - Model: qwen3-coder-plus
   - Temperature: 0.3
   - System Prompt: C++ expert specializing in Qt
   ```

3. **执行**:
   - 使用 C++ 最佳实践
   - 遵循 Qt 框架规范
   - 输出高质量代码

---

## 📊 路由示例

### 示例 1: 软件开发

**用户**: "用 Python Flask 开发一个 REST API"

**Router 分析**:
```json
{
  "skill_id": "python",
  "skill_name": "Python Development",
  "category": "software",
  "department": "operations",
  "model": "qwen3-coder-plus",
  "temperature": 0.3
}
```

**路由**: `@agentgv-operations<python>`

---

### 示例 2: 硬件设计

**用户**: "设计一个 STM32 最小系统 PCB"

**Router 分析**:
```json
{
  "skill_id": "pcb",
  "skill_name": "PCB Design",
  "category": "hardware",
  "department": "planning",
  "model": "qwen3.5-plus",
  "temperature": 0.2
}
```

**路由**: `@agentgv-planning<pcb>` (设计阶段)

---

### 示例 3: 仿真分析

**用户**: "MATLAB 仿真一个 PID 控制器"

**Router 分析**:
```json
{
  "skill_id": "matlab",
  "skill_name": "MATLAB/Simulink",
  "category": "simulation",
  "department": "operations",
  "model": "qwen3.5-plus",
  "temperature": 0.2
}
```

**路由**: `@agentgv-operations<matlab>`

---

### 示例 4: 文学创作

**用户**: "写一篇关于 AI 的科幻小说"

**Router 分析**:
```json
{
  "skill_id": "fiction",
  "skill_name": "Fiction Writing",
  "category": "creative",
  "department": "operations",
  "model": "qwen3.5-plus",
  "temperature": 0.7
}
```

**路由**: `@agentgv-operations<fiction>` (高温度以增强创造性)

---

## 🎯 优势

### 1. 灵活性

- ✅ 一个部门处理 N 个领域
- ✅ 动态组合 Skill
- ✅ 易于扩展新领域

### 2. 可维护性

- ✅ 4 个模板部门 vs N 个专用 Agent
- ✅ Skill 集中管理
- ✅ 配置驱动，无需修改代码

### 3. 专业性

- ✅ 每个 Skill 有专属 model 和 temperature
- ✅ 领域特定的 system prompt
- ✅ 遵循行业最佳实践

### 4. 成本效益

- ✅ 根据任务选择合适模型
- ✅ 简单任务用经济模型
- ✅ 复杂任务用高级模型

---

## 📋 使用方式

### 命令行测试

```bash
# 测试 Skill 匹配
node .opencode/skill-matcher.js "开发一个 C++ 程序"
node .opencode/skill-matcher.js "设计 PCB 电路板"
node .opencode/skill-matcher.js "写一篇技术文档"
```

### Router 自动匹配

用户直接描述任务，Router 自动：
1. 匹配 Skill
2. 选择部门
3. 激活模板
4. 执行任务

---

## 🔧 扩展 Skill

添加新 Skill 只需修改 `skills.json`:

```json
{
  "skill_categories": {
    "new_category": {
      "name": "新领域",
      "skills": [
        {
          "id": "new_skill",
          "name": "新技能名称",
          "keywords": ["关键词 1", "关键词 2"],
          "model": "bailian-coding-plan/qwen3.5-plus",
          "temperature": 0.3,
          "system_prompt": "领域专家的 system prompt"
        }
      ]
    }
  }
}
```

---

## 📊 当前状态

| 指标 | 数值 |
|------|------|
| Skill 分类 | 5 个 |
| 定义 Skill | 15 个 |
| 模板部门 | 3 个 (Planning, Operations, Quality) |
| 支持领域 | software/hardware/simulation/creative/research |

---

## 🚀 后续扩展

### 短期 (1-2 周)

- [ ] 添加更多 Skill (游戏开发、3D 建模等)
- [ ] 优化 Skill 匹配算法
- [ ] 添加 Skill 组合支持

### 中期 (1 个月)

- [ ] Skill 效果评估系统
- [ ] 自动优化 Skill 配置
- [ ] 用户自定义 Skill

### 长期 (3 个月)

- [ ] Skill 学习进化机制
- [ ] 跨 Skill 知识融合
- [ ] 领域自适应能力

---

**架构**: 模板化 | **状态**: 生产就绪 | **版本**: 1.0.0
