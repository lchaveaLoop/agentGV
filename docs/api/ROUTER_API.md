# Router API Documentation

Router API 文档，描述 Router Agent 的接口和使用方法。

---

## 📋 目录

- [API 概览](#api-概览)
- [核心接口](#核心接口)
- [路由接口](#路由接口)
- [配置接口](#配置接口)
- [状态接口](#状态接口)
- [使用示例](#使用示例)
- [错误处理](#错误处理)

---

## 🎯 API 概览

Router 是 AgentGV 系统的入口和协调中心，负责：
- 接收用户请求
- Skill 匹配
- 部门路由
- 任务协调
- 结果返回

### 基本信息

| 项目 | 说明 |
|------|------|
| **Agent 类型** | Primary Agent |
| **默认模型** | bailian-coding-plan/qwen3.5-plus |
| **主要职责** | 路由协调、Skill 匹配 |
| **支持模式** | 自主执行、多部门协作 |

---

## 🔌 核心接口

### 1. route() - 路由任务

将用户请求路由到合适的部门。

**签名**:
```javascript
async function route(userRequest: string): Promise<RouteResult>
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userRequest` | string | ✅ | 用户请求文本 |

**返回值**:
```typescript
interface RouteResult {
  success: boolean;
  targetAgent: string;        // 目标部门
  skill: SkillInfo;           // 匹配的 Skill
  model: string;              // 分配的模型
  temperature: number;        // 温度参数
  executionResult?: any;      // 执行结果
  error?: string;             // 错误信息
}
```

**使用示例**:
```javascript
const router = new AgentGVRouter();

const result = await router.route('用 C++ 开发一个串口调试助手');

console.log(result);
// {
//   success: true,
//   targetAgent: 'operations',
//   skill: { skill_id: 'cpp', category: 'software' },
//   model: 'bailian-coding-plan/qwen3-coder-plus',
//   temperature: 0.3
// }
```

### 2. analyzeTask() - 分析任务

分析任务类型和复杂度。

**签名**:
```javascript
async function analyzeTask(userRequest: string): Promise<TaskAnalysis>
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userRequest` | string | ✅ | 用户请求文本 |

**返回值**:
```typescript
interface TaskAnalysis {
  type: TaskType;              // 任务类型
  complexity: Complexity;       // 复杂度
  category: string;             // 类别
  keywords: string[];           // 关键词
  estimatedDuration: number;    // 预估时长 (ms)
  recommendedModel: string;     // 推荐模型
}
```

**使用示例**:
```javascript
const analysis = await router.analyzeTask('开发一个完整的用户管理系统');

console.log(analysis);
// {
//   type: 'complex_coding',
//   complexity: 'high',
//   category: 'software',
//   keywords: ['开发', '用户管理', '系统'],
//   estimatedDuration: 300000,
//   recommendedModel: 'bailian-coding-plan/qwen3.5-plus'
// }
```

---

## 🎯 路由接口

### 3. matchSkill() - Skill 匹配

匹配请求到最合适的 Skill。

**签名**:
```javascript
function matchSkill(query: string): Promise<SkillMatchResult>
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `query` | string | ✅ | 查询文本 |

**返回值**:
```typescript
interface SkillMatchResult {
  skill_id: string;
  skill_name: string;
  category: string;
  model: string;
  temperature: number;
  confidence: 'high' | 'medium' | 'low';
  matched_keywords: string[];
}
```

**使用示例**:
```javascript
const match = await router.matchSkill('写一篇科幻小说');

console.log(match);
// {
//   skill_id: 'fiction',
//   skill_name: 'Fiction Writing',
//   category: 'creative',
//   model: 'bailian-coding-plan/qwen3.5-plus',
//   temperature: 0.7,
//   confidence: 'high',
//   matched_keywords: ['小说', '科幻']
// }
```

### 4. selectAgent() - 选择部门

根据 Skill 类别选择负责部门。

**签名**:
```javascript
function selectAgent(skillCategory: string): string
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `skillCategory` | string | ✅ | Skill 类别 |

**返回值**: 部门名称

**部门映射**:
| Category | Agent |
|----------|-------|
| `software` | operations |
| `hardware` | operations |
| `creative` | operations |
| `simulation` | planning |
| `research` | planning |
| `review` | quality |

**使用示例**:
```javascript
const agent = router.selectAgent('software');
console.log(agent);  // 'operations'

const agent2 = router.selectAgent('research');
console.log(agent2);  // 'planning'
```

### 5. coordinate() - 协调多部门

协调多个部门协作完成复杂任务。

**签名**:
```javascript
async function coordinate(task: string, agents: string[]): Promise<CoordinationResult>
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `task` | string | ✅ | 任务描述 |
| `agents` | string[] | ✅ | 参与部门列表 |

**返回值**:
```typescript
interface CoordinationResult {
  success: boolean;
  results: AgentResult[];
  timeline: TimelineEntry[];
  totalDuration: number;
}
```

**使用示例**:
```javascript
const result = await router.coordinate(
  '开发一个完整的用户管理系统，需要测试和文档',
  ['operations', 'quality']
);

console.log(result);
// {
//   success: true,
//   results: [...],
//   timeline: [...],
//   totalDuration: 450000
// }
```

---

## ⚙️ 配置接口

### 6. setPreference() - 设置偏好

设置用户偏好模式。

**签名**:
```javascript
function setPreference(mode: PreferenceMode): void
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | PreferenceMode | ✅ | 偏好模式 |

**PreferenceMode**:
```typescript
type PreferenceMode = 'quality_priority' | 'balanced' | 'cost_saving';
```

**使用示例**:
```javascript
router.setPreference('quality_priority');
```

### 7. getPreference() - 获取偏好

获取当前用户偏好设置。

**签名**:
```javascript
function getPreference(): PreferenceConfig
```

**返回值**:
```typescript
interface PreferenceConfig {
  mode: PreferenceMode;
  autoUpgrade: boolean;
  allowDowngrade: boolean;
  maxCostTier: string;
}
```

**使用示例**:
```javascript
const config = router.getPreference();
console.log(config.mode);  // 'balanced'
```

### 8. syncModel() - 同步模型

与 OpenCode Desktop 同步模型配置。

**签名**:
```javascript
async function syncModel(targetModel?: string): Promise<SyncResult>
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `targetModel` | string | ❌ | 目标模型 ID |

**返回值**:
```typescript
interface SyncResult {
  success: boolean;
  previousModel: string;
  currentModel: string;
  timestamp: number;
}
```

**使用示例**:
```javascript
// 交互式同步
const result = await router.syncModel();

// 指定模型同步
const result2 = await router.syncModel('bailian-coding-plan/qwen3.5-plus');
```

---

## 📊 状态接口

### 9. getStatus() - 获取状态

获取 Router 当前状态。

**签名**:
```javascript
function getStatus(): RouterStatus
```

**返回值**:
```typescript
interface RouterStatus {
  healthy: boolean;
  currentModel: string;
  availableAgents: string[];
  pendingTasks: number;
  completedTasks: number;
  uptime: number;
  version: string;
}
```

**使用示例**:
```javascript
const status = router.getStatus();
console.log(`Router 健康状态：${status.healthy}`);
console.log(`当前模型：${status.currentModel}`);
console.log(`可用部门：${status.availableAgents.join(', ')}`);
```

### 10. getMetrics() - 获取指标

获取 Router 性能指标。

**签名**:
```javascript
function getMetrics(): RouterMetrics
```

**返回值**:
```typescript
interface RouterMetrics {
  totalRequests: number;
  averageResponseTime: number;
  successRate: number;
  skillMatchAccuracy: number;
  routingDistribution: Record<string, number>;
}
```

**使用示例**:
```javascript
const metrics = router.getMetrics();
console.log(`平均响应时间：${metrics.averageResponseTime}ms`);
console.log(`成功率：${metrics.successRate * 100}%`);
```

---

## 💡 使用示例

### 示例 1: 简单路由

```javascript
const router = new AgentGVRouter();

// 用户请求
const request = '用 Python 写一个数据分析脚本';

// 路由任务
const result = await router.route(request);

if (result.success) {
  console.log(`路由到：${result.targetAgent}`);
  console.log(`使用模型：${result.model}`);
  console.log(`Skill: ${result.skill.skill_name}`);
} else {
  console.error(`路由失败：${result.error}`);
}
```

### 示例 2: 多部门协作

```javascript
const router = new AgentGVRouter();

// 复杂任务需要多部门协作
const request = '开发一个完整的电商系统，包含前后端，需要测试和文档';

// 分析任务
const analysis = await router.analyzeTask(request);
console.log(`任务类型：${analysis.type}`);
console.log(`复杂度：${analysis.complexity}`);

// 协调多部门
const result = await router.coordinate(request, [
  'planning',    // 架构设计
  'operations',  // 功能开发
  'quality'      // 测试验证
]);

console.log(`协作完成，总耗时：${result.totalDuration}ms`);
```

### 示例 3: Skill 匹配测试

```javascript
const testCases = [
  '开发一个 C++ Qt 程序',
  '设计一个 PCB 电路板',
  '写一篇技术文档',
  '调研 AI 市场趋势',
  '进行有限元分析'
];

for (const testCase of testCases) {
  const match = await router.matchSkill(testCase);
  console.log(`\n查询：${testCase}`);
  console.log(`Skill: ${match.skill_name}`);
  console.log(`类别：${match.category}`);
  console.log(`置信度：${match.confidence}`);
}
```

### 示例 4: 模型同步

```javascript
const router = new AgentGVRouter();

// 查看当前模型
const status = router.getStatus();
console.log(`当前模型：${status.currentModel}`);

// 同步到指定模型
const syncResult = await router.syncModel('bailian-coding-plan/qwen3.5-plus');
console.log(`同步${syncResult.success ? '成功' : '失败'}`);
console.log(`新模型：${syncResult.currentModel}`);
```

---

## ❌ 错误处理

### 错误类型

```typescript
enum RouterErrorType {
  SKILL_NOT_FOUND = 'SKILL_NOT_FOUND',
  AGENT_UNAVAILABLE = 'AGENT_UNAVAILABLE',
  MODEL_ERROR = 'MODEL_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_REQUEST = 'INVALID_REQUEST',
  COORDINATION_FAILED = 'COORDINATION_FAILED'
}
```

### 错误处理示例

```javascript
try {
  const result = await router.route('invalid request');
} catch (error) {
  if (error instanceof RouterError) {
    switch (error.code) {
      case RouterErrorType.SKILL_NOT_FOUND:
        console.log('未找到匹配的 Skill，请提供更详细的描述');
        break;
      case RouterErrorType.AGENT_UNAVAILABLE:
        console.log('目标部门暂时不可用');
        break;
      case RouterErrorType.TIMEOUT:
        console.log('请求超时，请重试');
        break;
      default:
        console.error(`未知错误：${error.message}`);
    }
  } else {
    console.error(`系统错误：${error.message}`);
  }
}
```

### 错误码说明

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| `SKILL_NOT_FOUND` | 未找到匹配的 Skill | 检查 Skill 配置，提供更详细描述 |
| `AGENT_UNAVAILABLE` | 部门不可用 | 检查部门配置，稍后重试 |
| `MODEL_ERROR` | 模型错误 | 检查模型配置，切换模型 |
| `TIMEOUT` | 请求超时 | 增加超时时间，简化任务 |
| `INVALID_REQUEST` | 无效请求 | 检查请求格式 |
| `COORDINATION_FAILED` | 协调失败 | 检查部门间通信 |

---

## 📚 相关文档

- [MODEL_API.md](MODEL_API.md) - Model API 文档
- [SKILL_API.md](SKILL_API.md) - Skill API 文档
- [GETTING_STARTED.md](../dev/GETTING_STARTED.md) - 开发者快速开始

---

**最后更新**: 2026-02-25  
**版本**: V5.0.0  
**维护**: AgentGV Operations
