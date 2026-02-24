# 实时统计系统

**版本**: 1.0.0  
**日期**: 2026-02-24  
**状态**: ✅ 已实施

---

## 🎯 功能特性

### 实时追踪

- ✅ 每次请求自动记录
- ✅ 按 Agent/Skill/Category/Model 分类统计
- ✅ 小时分布和日趋势分析
- ✅ Token 使用量追踪
- ✅ 成功率统计

### 可视化展示

- ✅ 彩色终端输出
- ✅ 进度条可视化
- ✅ 实时更新（2 秒刷新）
- ✅ JSON 格式导出

---

## 📊 统计维度

### 1. 按 Agent 统计
- Router: 请求总数/成功/失败
- Planning: 请求总数/成功/失败
- Operations: 请求总数/成功/失败
- Quality: 请求总数/成功/失败

### 2. 按 Skill 统计
- 所有使用过的 Skill
- 每个 Skill 的使用次数
- Skill 所属 Category

### 3. 按 Category 统计
- software
- hardware
- simulation
- creative
- research

### 4. 按 Model 统计
- 各模型使用次数
- Token 使用量（输出/输入）

### 5. 时间分布
- 24 小时分布
- 最近 30 天日趋势

---

## 🔧 使用方式

### 查看统计

```bash
# 查看当前统计
node .opencode/realtime-stats.js

# 实时刷新查看（每 2 秒）
node .opencode/realtime-stats.js --live

# JSON 格式导出
node .opencode/realtime-stats.js --json
```

### Skill 匹配 + 统计

```bash
# 匹配 Skill 并记录统计
node .opencode/skill-matcher.js "开发一个 C++ 程序"

# 查看统计
node .opencode/skill-matcher.js --stats
```

### 重置统计

```bash
# 重置所有统计
node .opencode/realtime-stats.js --reset
```

---

## 📈 输出示例

```
╔══════════════════════════════════════════════════════════╗
║       AgentGV Real-time Usage Statistics             ║
╚══════════════════════════════════════════════════════════╝
Period: 2026-02 | Last updated: 2026/2/24 10:35:19

📊 Total Requests: 1

🤖 By Agent:
  router       █ 1 ✓1 ✗0
  planning       0 ✓0 ✗0
  operations   0 ✓0 ✗0
  quality      0 ✓0 ✗0

💡 Top Skills:
  1. cpp                  1 (software)

📁 By Category:
  software     1
  hardware     0
  simulation   0
  creative     0
  research     0

🧠 By Model:
  qwen3-coder-plus               1 (tokens: 0)

🕐 Hourly Distribution (today):
  10:00 ████████████████████ 1

📈 Daily Trend (last 7 days):
  2/24  ██████████████████████████████ 1
```

---

## 🔍 数据文件

**位置**: `.opencode/usage-stats.json`

**结构**:
```json
{
  "period": "2026-02",
  "last_updated": "2026-02-24T10:35:19.350Z",
  "total_requests": 1,
  "by_agent": {...},
  "by_skill": {...},
  "by_category": {...},
  "by_model": {...},
  "hourly_distribution": [...],
  "daily_requests": [...]
}
```

---

## 🎯 自动集成

### Router 自动记录

Router 在路由时自动调用 `trackRequest()`:

```javascript
const { trackRequest } = require('./realtime-stats');

// 路由后记录
trackRequest({
  agent: 'planning',
  skill: 'cpp',
  category: 'software',
  model: 'qwen3-coder-plus',
  task_type: 'coding',
  preference: 'quality_priority',
  success: true
});
```

### Skill 匹配器自动记录

`skill-matcher.js` 自动记录每次匹配：

```javascript
const match = getBestSkill("开发 C++ 程序");
// 自动记录统计
```

---

## 📊 数据分析

### 使用高峰分析

通过小时分布识别使用高峰时段，优化资源分配。

### Skill 热度分析

通过 Skill 统计了解最常用的技能，优先优化。

### 模型成本分析

通过 Model 统计和 Token 使用量，优化成本。

### Agent 负载分析

通过 Agent 统计识别负载，必要时调整。

---

## 🔧 API

### 初始化统计

```javascript
const { initStats } = require('./realtime-stats');
initStats(); // 初始化统计文件
```

### 加载统计

```javascript
const { loadStats } = require('./realtime-stats');
const stats = loadStats();
```

### 记录请求

```javascript
const { trackRequest } = require('./realtime-stats');
trackRequest({
  agent: 'operations',
  skill: 'python',
  category: 'software',
  task_type: 'coding',
  success: true
});
```

### 显示统计

```javascript
const { displayStats } = require('./realtime-stats');
displayStats(true); // true = 实时更新
```

---

## ✅ 完成状态

| 功能 | 状态 |
|------|------|
| 实时统计追踪 | ✅ 完成 |
| 可视化展示 | ✅ 完成 |
| 实时更新（2 秒） | ✅ 完成 |
| JSON 导出 | ✅ 完成 |
| Skill 集成 | ✅ 完成 |
| 自动记录 | ✅ 完成 |

---

**状态**: ✅ 生产就绪  
**版本**: 1.0.0
