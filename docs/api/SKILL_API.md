# Skill API Documentation

Skill API 文档，描述 Skill 匹配和管理相关的接口。

---

## 📋 目录

- [API 概览](#api-概览)
- [Skill 匹配](#skill-匹配)
- [Skill 管理](#skill-管理)
- [Skill 配置](#skill-配置)
- [使用示例](#使用示例)
- [错误处理](#错误处理)

---

## 🎯 API 概览

Skill API 负责任务与 Skill 领域的匹配，包括：
- 关键词匹配
- 类别识别
- 模型分配
- Skill 管理

### 基本信息

| 项目 | 说明 |
|------|------|
| **配置文件** | `.opencode/config/skills.json` |
| **Skill 数量** | 28 个 |
| **类别数量** | 5 大类 |
| **匹配算法** | 关键词 + TF-IDF |

### Skill 分类

```
┌─────────────────────────────────────────┐
│         Skill System (5 大类 28 个)        │
├─────────────────────────────────────────┤
│ Software  (8 skills)   │ Hardware  (3)  │
│ Creative  (5 skills)   │ Simulation (3) │
│ Research  (6 skills)   │ Review   (all) │
└─────────────────────────────────────────┘
```

---

## 🎯 Skill 匹配

### 1. match() - 匹配 Skill

匹配查询到最合适的 Skill。

**签名**:
```javascript
async function match(query: string): Promise<SkillMatchResult>
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `query` | string | ✅ | 用户查询文本 |

**返回值**:
```typescript
interface SkillMatchResult {
  skill_id: string;           // Skill ID
  skill_name: string;         // Skill 名称
  category: string;           // 所属类别
  model: string;              // 推荐模型
  temperature: number;        // 推荐温度
  confidence: Confidence;     // 置信度
  matched_keywords: string[]; // 匹配的关键词
  score: number;              // 匹配分数
}

type Confidence = 'high' | 'medium' | 'low';
```

**使用示例**:
```javascript
const skillMatcher = new SkillMatcher();

// 匹配 C++ 开发任务
const result1 = await skillMatcher.match('用 C++ 开发一个 Qt 程序');
console.log(result1);
// {
//   skill_id: 'cpp',
//   skill_name: 'C++ Development',
//   category: 'software',
//   model: 'bailian-coding-plan/qwen3-coder-plus',
//   temperature: 0.3,
//   confidence: 'high',
//   matched_keywords: ['C++', 'Qt', '开发'],
//   score: 0.95
// }

// 匹配创意写作任务
const result2 = await skillMatcher.match('写一篇科幻小说');
console.log(result2);
// {
//   skill_id: 'fiction',
//   skill_name: 'Fiction Writing',
//   category: 'creative',
//   model: 'bailian-coding-plan/qwen3.5-plus',
//   temperature: 0.7,
//   confidence: 'high',
//   matched_keywords: ['小说', '科幻'],
//   score: 0.92
// }
```

### 2. matchBatch() - 批量匹配

批量匹配多个查询。

**签名**:
```javascript
async function matchBatch(queries: string[]): Promise<SkillMatchResult[]>
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `queries` | string[] | ✅ | 查询列表 |

**返回值**: SkillMatchResult 数组

**使用示例**:
```javascript
const queries = [
  '开发一个 Python Web 应用',
  '设计一个 PCB 电路板',
  '写一篇技术文档',
  '调研 AI 市场'
];

const results = await skillMatcher.matchBatch(queries);

results.forEach((result, index) => {
  console.log(`${queries[index]} → ${result.skill_name} (${result.confidence})`);
});
```

### 3. analyzeQuery() - 分析查询

分析查询文本，提取关键信息。

**签名**:
```javascript
function analyzeQuery(query: string): QueryAnalysis
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `query` | string | ✅ | 查询文本 |

**返回值**:
```typescript
interface QueryAnalysis {
  tokens: string[];           // 分词结果
  taskType: TaskType;         // 任务类型
  category: string;           // 识别的类别
  keywords: string[];         // 提取的关键词
  complexity: Complexity;     // 预估复杂度
  intent: string;             // 识别的意图
}
```

**使用示例**:
```javascript
const analysis = skillMatcher.analyzeQuery('开发一个完整的电商系统，需要高并发支持');

console.log('分词:', analysis.tokens);
// ['开发', '完整', '电商系统', '高并发']

console.log('任务类型:', analysis.taskType);
// 'complex_coding'

console.log('类别:', analysis.category);
// 'software'

console.log('复杂度:', analysis.complexity);
// 'high'

console.log('意图:', analysis.intent);
// 'develop_system'
```

---

## 📁 Skill 管理

### 4. listSkills() - 列出 Skill

获取所有可用的 Skill。

**签名**:
```javascript
function listSkills(options?: ListOptions): SkillInfo[]
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `options` | ListOptions | ❌ | 列表选项 |

**返回值**:
```typescript
interface SkillInfo {
  skill_id: string;
  skill_name: string;
  category: string;
  keywords: string[];
  model: string;
  temperature: number;
  responsible_agent: string;
  enabled: boolean;
}
```

**使用示例**:
```javascript
// 获取所有 Skill
const allSkills = skillMatcher.listSkills();

// 只获取 software 类别
const softwareSkills = skillMatcher.listSkills({ category: 'software' });

// 只获取启用的
const enabledSkills = skillMatcher.listSkills({ enabledOnly: true });

softwareSkills.forEach(skill => {
  console.log(`${skill.skill_id}: ${skill.skill_name}`);
  console.log(`  关键词：${skill.keywords.join(', ')}`);
  console.log(`  模型：${skill.model}`);
});
```

### 5. getSkill() - 获取 Skill

获取指定 Skill 的详细信息。

**签名**:
```javascript
function getSkill(skillId: string): SkillInfo | null
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `skillId` | string | ✅ | Skill ID |

**返回值**: SkillInfo 或 null

**使用示例**:
```javascript
const cppSkill = skillMatcher.getSkill('cpp');

if (cppSkill) {
  console.log('C++ Skill 详情:');
  console.log(`名称：${cppSkill.skill_name}`);
  console.log(`类别：${cppSkill.category}`);
  console.log(`关键词：${cppSkill.keywords.join(', ')}`);
  console.log(`模型：${cppSkill.model}`);
  console.log(`温度：${cppSkill.temperature}`);
  console.log(`负责部门：${cppSkill.responsible_agent}`);
}
```

### 6. addSkill() - 添加 Skill

添加新的 Skill。

**签名**:
```javascript
function addSkill(skill: SkillConfig): boolean
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `skill` | SkillConfig | ✅ | Skill 配置 |

**SkillConfig**:
```typescript
interface SkillConfig {
  skill_id: string;
  skill_name: string;
  category: string;
  keywords: string[];
  model: string;
  temperature: number;
  responsible_agent: string;
  enabled?: boolean;
}
```

**返回值**: 是否成功

**使用示例**:
```javascript
const newSkill = {
  skill_id: 'typescript',
  skill_name: 'TypeScript Development',
  category: 'software',
  keywords: ['TypeScript', 'TS', 'typescript', '类型安全'],
  model: 'bailian-coding-plan/qwen3-coder-plus',
  temperature: 0.3,
  responsible_agent: 'operations',
  enabled: true
};

const success = skillMatcher.addSkill(newSkill);
console.log(`添加 Skill: ${success ? '成功' : '失败'}`);
```

### 7. updateSkill() - 更新 Skill

更新现有 Skill。

**签名**:
```javascript
function updateSkill(skillId: string, updates: SkillUpdates): boolean
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `skillId` | string | ✅ | Skill ID |
| `updates` | SkillUpdates | ✅ | 更新内容 |

**使用示例**:
```javascript
// 添加关键词
skillMatcher.updateSkill('cpp', {
  keywords: ['C++', 'cpp', 'qt', 'stl', 'cmake', 'mfc', 'win32']
});

// 更新模型
skillMatcher.updateSkill('python', {
  model: 'bailian-coding-plan/qwen3-coder-plus'
});

// 禁用 Skill
skillMatcher.updateSkill('deprecated-skill', {
  enabled: false
});
```

### 8. removeSkill() - 删除 Skill

删除指定的 Skill。

**签名**:
```javascript
function removeSkill(skillId: string): boolean
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `skillId` | string | ✅ | Skill ID |

**返回值**: 是否成功

**使用示例**:
```javascript
const removed = skillMatcher.removeSkill('deprecated-skill');
console.log(`删除 Skill: ${removed ? '成功' : '失败'}`);
```

---

## ⚙️ Skill 配置

### 9. getCategorySkills() - 获取类别 Skill

获取指定类别的所有 Skill。

**签名**:
```javascript
function getCategorySkills(category: string): SkillInfo[]
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `category` | string | ✅ | 类别名称 |

**返回值**: SkillInfo 数组

**类别列表**:
| Category | 说明 | Skill 数 |
|----------|------|----------|
| `software` | 软件开发 | 8 |
| `hardware` | 硬件电子 | 3 |
| `simulation` | 仿真建模 | 3 |
| `creative` | 创意写作 | 5 |
| `research` | 研究分析 | 6 |

**使用示例**:
```javascript
// 获取所有软件类 Skill
const softwareSkills = skillMatcher.getCategorySkills('software');
softwareSkills.forEach(skill => {
  console.log(`- ${skill.skill_name}`);
});

// 输出:
// - C++ Development
// - Python Development
// - Web Development
// - Mobile Development
// - Java Development
// - Go Development
// - Rust Development
// - DevOps & Cloud
```

### 10. getResponsibleAgent() - 获取负责部门

根据 Skill 类别获取负责部门。

**签名**:
```javascript
function getResponsibleAgent(category: string): string
```

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `category` | string | ✅ | Skill 类别 |

**返回值**: 部门名称

**类别 - 部门映射**:
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
console.log(skillMatcher.getResponsibleAgent('software'));  // 'operations'
console.log(skillMatcher.getResponsibleAgent('research'));  // 'planning'
console.log(skillMatcher.getResponsibleAgent('review'));    // 'quality'
```

---

## 💡 使用示例

### 示例 1: CLI 工具

```javascript
#!/usr/bin/env node

const { SkillMatcher } = require('./skill-matcher');

async function main() {
  const matcher = new SkillMatcher();
  const query = process.argv.slice(2).join(' ');
  
  if (!query) {
    console.error('用法：skill-matcher.js <查询文本>');
    process.exit(1);
  }
  
  console.log(`匹配查询：${query}\n`);
  
  const result = await matcher.match(query);
  
  console.log('匹配结果:');
  console.log(`  Skill: ${result.skill_name} (${result.skill_id})`);
  console.log(`  类别：${result.category}`);
  console.log(`  模型：${result.model}`);
  console.log(`  温度：${result.temperature}`);
  console.log(`  置信度：${result.confidence}`);
  console.log(`  关键词：${result.matched_keywords.join(', ')}`);
  console.log(`  分数：${result.score.toFixed(2)}`);
  
  process.exit(result.confidence === 'low' ? 2 : 0);
}

main();
```

### 示例 2: Skill 匹配测试

```javascript
const { SkillMatcher } = require('./skill-matcher');

async function testSkillMatcher() {
  const matcher = new SkillMatcher();
  
  const testCases = [
    { query: '开发一个 C++ Qt 程序', expected: 'cpp' },
    { query: '用 Python 写数据分析', expected: 'python' },
    { query: '设计 PCB 电路板', expected: 'pcb' },
    { query: '写一篇科幻小说', expected: 'fiction' },
    { query: '调研 AI 市场', expected: 'market' },
    { query: '进行有限元分析', expected: 'fea' }
  ];
  
  console.log('=== Skill 匹配测试 ===\n');
  
  let passed = 0;
  
  for (const testCase of testCases) {
    const result = await matcher.match(testCase.query);
    const success = result.skill_id === testCase.expected;
    
    console.log(`查询：${testCase.query}`);
    console.log(`期望：${testCase.expected}, 实际：${result.skill_id}`);
    console.log(`结果：${success ? '✅ 通过' : '❌ 失败'}\n`);
    
    if (success) passed++;
  }
  
  console.log(`=== 测试结果：${passed}/${testCases.length} 通过 ===`);
}

testSkillMatcher();
```

### 示例 3: Skill 统计

```javascript
function printSkillStatistics() {
  const matcher = new SkillMatcher();
  const allSkills = matcher.listSkills({ enabledOnly: true });
  
  // 按类别分组
  const byCategory = {};
  allSkills.forEach(skill => {
    if (!byCategory[skill.category]) {
      byCategory[skill.category] = [];
    }
    byCategory[skill.category].push(skill);
  });
  
  console.log('=== Skill 统计 ===\n');
  console.log(`总 Skill 数：${allSkills.length}\n`);
  
  for (const [category, skills] of Object.entries(byCategory)) {
    console.log(`${category}: ${skills.length} 个`);
    skills.forEach(skill => {
      console.log(`  - ${skill.skill_name}`);
    });
    console.log();
  }
  
  // 按部门分组
  const byAgent = {};
  allSkills.forEach(skill => {
    if (!byAgent[skill.responsible_agent]) {
      byAgent[skill.responsible_agent] = [];
    }
    byAgent[skill.responsible_agent].push(skill);
  });
  
  console.log('=== 按部门分布 ===\n');
  for (const [agent, skills] of Object.entries(byAgent)) {
    console.log(`${agent}: ${skills.length} 个 Skill`);
  }
}
```

### 示例 4: 自定义匹配规则

```javascript
class CustomSkillMatcher extends SkillMatcher {
  // 添加自定义匹配规则
  addCustomRule(pattern: RegExp, skillId: string) {
    this.customRules.push({ pattern, skillId });
  }
  
  // 重写匹配方法
  async match(query: string): Promise<SkillMatchResult> {
    // 先检查自定义规则
    for (const rule of this.customRules) {
      if (rule.pattern.test(query)) {
        const skill = this.getSkill(rule.skillId);
        if (skill) {
          return {
            ...this.createMatchResult(skill),
            confidence: 'high' as const,
            matched_keywords: ['custom_rule']
          };
        }
      }
    }
    
    // 使用默认匹配
    return super.match(query);
  }
}

// 使用示例
const matcher = new CustomSkillMatcher();

// 添加自定义规则
matcher.addCustomRule(/内部项目/, 'internal-skill');
matcher.addCustomRule(/机密/, 'security-review');

// 匹配时会优先使用自定义规则
const result = await matcher.match('这是内部项目的开发任务');
console.log(result.skill_id);  // 'internal-skill'
```

---

## ❌ 错误处理

### 错误类型

```typescript
enum SkillErrorType {
  SKILL_NOT_FOUND = 'SKILL_NOT_FOUND',
  NO_MATCH = 'NO_MATCH',
  LOW_CONFIDENCE = 'LOW_CONFIDENCE',
  INVALID_CATEGORY = 'INVALID_CATEGORY',
  DUPLICATE_SKILL = 'DUPLICATE_SKILL',
  INVALID_CONFIG = 'INVALID_CONFIG'
}
```

### 错误处理示例

```javascript
try {
  const result = await skillMatcher.match('模糊的查询');
  
  if (result.confidence === 'low') {
    console.warn('匹配置信度较低，建议提供更详细的描述');
    console.log(`当前匹配：${result.skill_name}`);
    console.log(`关键词：${result.matched_keywords.join(', ')}`);
  }
} catch (error) {
  if (error instanceof SkillError) {
    switch (error.code) {
      case SkillErrorType.NO_MATCH:
        console.log('未找到匹配的 Skill，请尝试其他描述');
        break;
      case SkillErrorType.INVALID_CATEGORY:
        console.log('无效的 Skill 类别');
        break;
      case SkillErrorType.DUPLICATE_SKILL:
        console.log('Skill ID 已存在');
        break;
      default:
        console.error(`错误：${error.message}`);
    }
  } else {
    console.error(`系统错误：${error.message}`);
  }
}
```

---

## 📚 相关文档

- [ROUTER_API.md](ROUTER_API.md) - Router API 文档
- [MODEL_API.md](MODEL_API.md) - Model API 文档
- [CONFIGURATION.md](../user/CONFIGURATION.md) - 配置指南

---

**最后更新**: 2026-02-25  
**版本**: V5.0.0  
**维护**: AgentGV Operations
