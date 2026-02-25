# Model API Documentation

Model API 文档，描述模型管理和配置相关的接口。

---

## 📋 目录

- [API 概览](#api-概览)
- [模型配置](#模型配置)
- [模型选择](#模型选择)
- [模型同步](#模型同步)
- [模型监控](#模型监控)
- [使用示例](#使用示例)
- [错误处理](#错误处理)

---

## 🎯 API 概览

Model API 负责管理 AgentGV 系统中所有可用的 AI 模型，包括：
- 模型配置管理
- 动态模型分配
- 模型同步
- 性能监控

### 基本信息

| 项目 | 说明 |
|------|------|
| **配置文件** | `.opencode/config/models.json` |
| **默认模型** | bailian-coding-plan/qwen3.5-plus |
| **支持模型数** | 6+ |
| **模型类型** | 通义千问系列、MiniMax、GLM 等 |

---

## ⚙️ 模型配置

### 1. listModels() - 列出模型

获取所有可用模型列表。

**签名**:
```javascript
function listModels(options?: ListOptions): ModelInfo[]
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `options` | ListOptions | ❌ | 列表选项 |

**ListOptions**:
```typescript
interface ListOptions {
  enabledOnly?: boolean;      // 只返回启用的模型
  sortBy?: 'priority' | 'name' | 'cost';  // 排序方式
  category?: string;          // 按类别过滤
}
```

**返回值**:
```typescript
interface ModelInfo {
  id: string;                 // 模型 ID
  name: string;               // 显示名称
  enabled: boolean;           // 是否启用
  priority: number;           // 优先级
  capabilities: string[];     // 能力列表
  costTier: string;           // 成本等级
  temperature: number;        // 默认温度
}
```

**使用示例**:
```javascript
const modelManager = new ModelManager();

// 获取所有模型
const allModels = modelManager.listModels();

// 只获取启用的模型
const enabledModels = modelManager.listModels({ enabledOnly: true });

// 按优先级排序
const sortedModels = modelManager.listModels({ sortBy: 'priority' });
```

### 2. getModel() - 获取模型

获取指定模型的详细信息。

**签名**:
```javascript
function getModel(modelId: string): ModelInfo | null
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `modelId` | string | ✅ | 模型 ID |

**返回值**: ModelInfo 或 null

**使用示例**:
```javascript
const model = modelManager.getModel('bailian-coding-plan/qwen3.5-plus');

if (model) {
  console.log(`模型名称：${model.name}`);
  console.log(`能力：${model.capabilities.join(', ')}`);
  console.log(`成本等级：${model.costTier}`);
} else {
  console.log('模型不存在');
}
```

### 3. updateModel() - 更新模型

更新模型配置。

**签名**:
```javascript
function updateModel(modelId: string, updates: ModelUpdates): boolean
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `modelId` | string | ✅ | 模型 ID |
| `updates` | ModelUpdates | ✅ | 更新内容 |

**ModelUpdates**:
```typescript
interface ModelUpdates {
  enabled?: boolean;
  priority?: number;
  temperature?: number;
  capabilities?: string[];
}
```

**返回值**: 是否成功

**使用示例**:
```javascript
// 禁用模型
modelManager.updateModel('bailian-coding-plan/qwen3-max', {
  enabled: false
});

// 调整优先级
modelManager.updateModel('bailian-coding-plan/qwen3-coder-plus', {
  priority: 1
});

// 更新温度参数
modelManager.updateModel('fiction-skill-model', {
  temperature: 0.8
});
```

---

## 🎯 模型选择

### 4. selectModel() - 选择模型

根据任务类型自动选择最合适的模型。

**签名**:
```javascript
function selectModel(taskType: TaskType, complexity?: Complexity): string
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `taskType` | TaskType | ✅ | 任务类型 |
| `complexity` | Complexity | ❌ | 复杂度 |

**TaskType**:
```typescript
enum TaskType {
  ARCHITECTURE = 'architecture',
  RESEARCH = 'research',
  CODING = 'coding',
  COMPLEX_CODING = 'complex_coding',
  REVIEW = 'review',
  DOCUMENTATION = 'documentation',
  SIMPLE = 'simple',
  VISION = 'vision'
}
```

**返回值**: 模型 ID

**使用示例**:
```javascript
// 架构设计任务 → qwen3-max
const model1 = modelManager.selectModel('architecture');

// 复杂编码任务 → qwen3.5-plus
const model2 = modelManager.selectModel('complex_coding', 'high');

// 简单编码任务 → qwen3-coder-next
const model3 = modelManager.selectModel('simple', 'low');

// 视觉任务 → qwen3.5-plus
const model4 = modelManager.selectModel('vision');
```

### 5. getModelForSkill() - 获取 Skill 对应模型

根据 Skill 获取配置的默认模型。

**签名**:
```javascript
function getModelForSkill(skillId: string): string
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `skillId` | string | ✅ | Skill ID |

**返回值**: 模型 ID

**使用示例**:
```javascript
const cppModel = modelManager.getModelForSkill('cpp');
console.log(cppModel);  // 'bailian-coding-plan/qwen3-coder-plus'

const fictionModel = modelManager.getModelForSkill('fiction');
console.log(fictionModel);  // 'bailian-coding-plan/qwen3.5-plus'
```

### 6. upgradeModel() - 升级模型

根据复杂度升级模型选择。

**签名**:
```javascript
function upgradeModel(currentModel: string, complexity: Complexity): string
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `currentModel` | string | ✅ | 当前模型 |
| `complexity` | Complexity | ✅ | 复杂度 |

**返回值**: 升级后的模型 ID

**使用示例**:
```javascript
// 高复杂度 → 升级到 qwen3-max
const upgraded = modelManager.upgradeModel(
  'bailian-coding-plan/qwen3.5-plus',
  'high'
);
console.log(upgraded);  // 'bailian-coding-plan/qwen3-max'

// 低复杂度 → 可能降级
const downgraded = modelManager.upgradeModel(
  'bailian-coding-plan/qwen3.5-plus',
  'low'
);
console.log(downgraded);  // 'bailian-coding-plan/qwen3-coder-next'
```

---

## 🔄 模型同步

### 7. syncWithOpenCode() - 与 OpenCode 同步

与 OpenCode Desktop 同步模型配置。

**签名**:
```javascript
async function syncWithOpenCode(targetModel?: string): Promise<SyncResult>
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `targetModel` | string | ❌ | 目标模型 |

**返回值**:
```typescript
interface SyncResult {
  success: boolean;
  previousModel: string;
  currentModel: string;
  timestamp: number;
  message: string;
}
```

**使用示例**:
```javascript
// 交互式同步（显示选择菜单）
const result1 = await modelManager.syncWithOpenCode();

// 指定模型同步
const result2 = await modelManager.syncWithOpenCode(
  'bailian-coding-plan/qwen3.5-plus'
);

console.log(`同步${result2.success ? '成功' : '失败'}`);
console.log(`当前模型：${result2.currentModel}`);
```

### 8. getAvailableModels() - 获取可用模型

获取 OpenCode Desktop 中可用的模型列表。

**签名**:
```javascript
async function getAvailableModels(): Promise<OpenCodeModel[]>
```

**返回值**:
```typescript
interface OpenCodeModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
}
```

**使用示例**:
```javascript
const models = await modelManager.getAvailableModels();

console.log('可用模型:');
models.forEach(model => {
  console.log(`- ${model.name} (${model.id})`);
  console.log(`  能力：${model.capabilities.join(', ')}`);
});
```

---

## 📊 模型监控

### 9. getModelMetrics() - 获取模型指标

获取模型使用指标。

**签名**:
```javascript
function getModelMetrics(modelId: string): ModelMetrics | null
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `modelId` | string | ✅ | 模型 ID |

**返回值**:
```typescript
interface ModelMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalTokens: number;
  estimatedCost: number;
  lastUsed: number;
}
```

**使用示例**:
```javascript
const metrics = modelManager.getModelMetrics('bailian-coding-plan/qwen3.5-plus');

if (metrics) {
  console.log(`总请求数：${metrics.totalRequests}`);
  console.log(`成功率：${metrics.successfulRequests / metrics.totalRequests * 100}%`);
  console.log(`平均响应时间：${metrics.averageResponseTime}ms`);
  console.log(`预估成本：¥${metrics.estimatedCost}`);
}
```

### 10. resetMetrics() - 重置指标

重置模型使用指标。

**签名**:
```javascript
function resetMetrics(modelId?: string): void
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `modelId` | string | ❌ | 模型 ID（不传则重置所有） |

**使用示例**:
```javascript
// 重置单个模型指标
modelManager.resetMetrics('bailian-coding-plan/qwen3-max');

// 重置所有模型指标
modelManager.resetMetrics();
```

---

## 💡 使用示例

### 示例 1: 模型配置管理

```javascript
const modelManager = new ModelManager();

// 列出所有启用的模型
const models = modelManager.listModels({ enabledOnly: true, sortBy: 'priority' });

console.log('启用的模型:');
models.forEach(model => {
  console.log(`${model.priority}. ${model.name} (${model.id})`);
});

// 更新模型配置
modelManager.updateModel('bailian-coding-plan/qwen3-coder-plus', {
  priority: 1,
  temperature: 0.3
});
```

### 示例 2: 智能模型选择

```javascript
// 根据任务类型选择模型
function selectModelForTask(task: string, analysis: TaskAnalysis) {
  const modelManager = new ModelManager();
  
  // 基础选择
  let model = modelManager.selectModel(analysis.type);
  
  // 根据复杂度调整
  if (analysis.complexity === 'high') {
    model = modelManager.upgradeModel(model, 'high');
  } else if (analysis.complexity === 'low') {
    model = modelManager.upgradeModel(model, 'low');
  }
  
  return model;
}
```

### 示例 3: 模型监控面板

```javascript
function printModelDashboard() {
  const modelManager = new ModelManager();
  const models = modelManager.listModels({ enabledOnly: true });
  
  console.log('=== 模型监控面板 ===\n');
  
  models.forEach(model => {
    const metrics = modelManager.getModelMetrics(model.id);
    
    console.log(`📊 ${model.name}`);
    console.log(`   ID: ${model.id}`);
    console.log(`   优先级：${model.priority}`);
    console.log(`   请求数：${metrics?.totalRequests || 0}`);
    console.log(`   成功率：${metrics ? (metrics.successfulRequests / metrics.totalRequests * 100).toFixed(1) : 0}%`);
    console.log(`   平均响应：${metrics?.averageResponseTime || 0}ms`);
    console.log();
  });
}
```

### 示例 4: 模型同步脚本

```javascript
async function syncModelScript() {
  const modelManager = new ModelManager();
  
  console.log('=== 模型同步 ===\n');
  
  // 获取可用模型
  const availableModels = await modelManager.getAvailableModels();
  
  console.log('可用模型:');
  availableModels.forEach((model, index) => {
    console.log(`${index + 1}. ${model.name}`);
  });
  
  // 交互式选择
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\n请选择模型 (编号): ', async (answer) => {
    const selectedIndex = parseInt(answer) - 1;
    const selectedModel = availableModels[selectedIndex];
    
    if (selectedModel) {
      const result = await modelManager.syncWithOpenCode(selectedModel.id);
      console.log(`\n同步${result.success ? '成功' : '失败'}`);
      console.log(`当前模型：${result.currentModel}`);
    } else {
      console.log('无效选择');
    }
    
    rl.close();
  });
}
```

---

## ❌ 错误处理

### 错误类型

```typescript
enum ModelErrorType {
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
  MODEL_DISABLED = 'MODEL_DISABLED',
  SYNC_FAILED = 'SYNC_FAILED',
  INVALID_CONFIG = 'INVALID_CONFIG',
  CAPABILITY_MISMATCH = 'CAPABILITY_MISMATCH'
}
```

### 错误处理示例

```javascript
try {
  const model = modelManager.getModel('invalid-model-id');
  if (!model) {
    throw new ModelError(ModelErrorType.MODEL_NOT_FOUND, 'Model not found');
  }
} catch (error) {
  if (error instanceof ModelError) {
    switch (error.code) {
      case ModelErrorType.MODEL_NOT_FOUND:
        console.log('模型不存在，请检查模型 ID');
        break;
      case ModelErrorType.MODEL_DISABLED:
        console.log('模型已禁用');
        break;
      case ModelErrorType.SYNC_FAILED:
        console.log('同步失败，请检查网络连接');
        break;
      default:
        console.error(`错误：${error.message}`);
    }
  }
}
```

---

## 📚 相关文档

- [ROUTER_API.md](ROUTER_API.md) - Router API 文档
- [SKILL_API.md](SKILL_API.md) - Skill API 文档
- [CONFIGURATION.md](../user/CONFIGURATION.md) - 配置指南

---

**最后更新**: 2026-02-25  
**版本**: V5.0.0  
**维护**: AgentGV Operations
