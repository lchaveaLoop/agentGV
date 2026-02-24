# AgentGV 错误代码参考

本文档列出所有 AgentGV 错误代码及其含义和解决方案。

## 错误层次结构

```
AgentGVError (基类)
├── SkillError
│   ├── SkillNotFoundError
│   └── SkillLoadError
├── ConfigError
│   ├── ConfigNotFoundError
│   └── ConfigParseError
├── RouterError
│   ├── DepartmentNotFoundError
│   └── ModelSyncError
├── AgentError
│   ├── AgentTimeoutError
│   └── AgentExecutionError
└── APIError
    ├── RateLimitError
    └── AuthenticationError
```

## 错误代码参考

### Skill 错误 (SKILL_*)

#### SKILL_NOT_FOUND
- **错误**: SkillNotFoundError
- **消息**: `Skill not found: {skillId}`
- **原因**: 请求的 Skill 不存在
- **解决**: 
  1. 检查 Skill ID 拼写
  2. 运行 `node .opencode/skill-scanner.js` 验证
  3. 确保 Skill 文件存在
- **可恢复**: ✅

#### SKILL_LOAD_ERROR
- **错误**: SkillLoadError
- **消息**: `Failed to load skill: {skillId}`
- **原因**: Skill 文件格式错误
- **解决**:
  1. 验证 YAML 前缀格式正确
  2. 检查 Markdown 语法
  3. 确认文件编码为 UTF-8
- **可恢复**: ✅

### 配置错误 (CONFIG_*)

#### CONFIG_NOT_FOUND
- **错误**: ConfigNotFoundError
- **消息**: `Configuration file not found: {configFile}`
- **原因**: 配置文件不存在
- **解决**:
  1. 创建配置文件
  2. 检查文件路径
  3. 从模板复制（如 `.env.example`）
- **可恢复**: ❌

#### CONFIG_PARSE_ERROR
- **错误**: ConfigParseError
- **消息**: `Failed to parse configuration: {configFile}`
- **原因**: 配置文件语法错误
- **解决**:
  1. 使用 JSON 验证器检查语法
  2. 修复 YAML/JSON 格式
  3. 检查特殊字符转义
- **可恢复**: ❌

### Router 错误 (ROUTER_*)

#### DEPARTMENT_NOT_FOUND
- **错误**: DepartmentNotFoundError
- **消息**: `No department found for task type: {taskType}`
- **原因**: 任务类型无法映射到部门
- **解决**:
  1. 检查 Router 配置
  2. 添加任务类型映射
  3. 使用明确的任务描述
- **可恢复**: ✅

#### MODEL_SYNC_ERROR
- **错误**: ModelSyncError
- **消息**: `Model synchronization failed`
- **原因**: 模型同步失败
- **解决**:
  1. 检查网络连接
  2. 验证模型配置
  3. 手动同步：`node .opencode/auto-sync-model.js`
- **可恢复**: ✅

### Agent 错误 (AGENT_*)

#### AGENT_TIMEOUT
- **错误**: AgentTimeoutError
- **消息**: `Agent timeout: {agentId}`
- **原因**: Agent 执行超时
- **解决**:
  1. 增加超时时间
  2. 简化任务
  3. 检查 Agent 性能
- **可恢复**: ✅

#### AGENT_EXECUTION_ERROR
- **错误**: AgentExecutionError
- **消息**: `Agent execution failed: {agentId}`
- **原因**: Agent 执行失败
- **解决**:
  1. 查看 Agent 日志
  2. 检查错误详情
  3. 重试或调整任务
- **可恢复**: ✅

### API 错误 (API_*)

#### RATE_LIMIT_EXCEEDED
- **错误**: RateLimitError
- **HTTP 状态码**: 429
- **消息**: `Rate limit exceeded`
- **原因**: 超过 API 速率限制
- **解决**:
  1. 等待重置时间
  2. 减少请求频率
  3. 升级计划
- **可恢复**: ✅

#### AUTHENTICATION_FAILED
- **错误**: AuthenticationError
- **HTTP 状态码**: 401
- **消息**: `Authentication failed`
- **原因**: 认证失败
- **解决**:
  1. 检查 API 密钥
  2. 验证认证凭据
  3. 重新登录
- **可恢复**: ❌

## 错误处理最佳实践

### 1. 使用分层捕获

```javascript
try {
  await task();
} catch (error) {
  if (error instanceof SkillNotFoundError) {
    // 处理 Skill 未找到
  } else if (error instanceof AgentGVError) {
    // 处理其他 AgentGV 错误
  } else {
    // 处理未知错误
  }
}
```

### 2. 提供用户友好消息

```javascript
const { handleError } = require('./error-hierarchy.js');

try {
  // 可能出错的操作
} catch (error) {
  handleError(error, { context: 'task execution' });
}
```

### 3. 记录错误上下文

```javascript
error.details = {
  ...error.details,
  timestamp: new Date().toISOString(),
  userId: getCurrentUserId(),
  taskId: task.id
};
```

### 4. 实现重试逻辑

```javascript
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (!error.recoverable || i === maxRetries - 1) {
        throw error;
      }
      await sleep(1000 * (i + 1)); // 指数退避
    }
  }
}
```

## 错误统计

运行以下命令查看错误统计：

```bash
# 查看日志中的错误
grep "ERROR" logs/*.log | cut -d':' -f2 | sort | uniq -c | sort -rn

# 查看错误类型分布
node -e "
const fs = require('fs');
const logs = fs.readdirSync('logs').map(f => fs.readFileSync('logs/' + f, 'utf8')).join('');
const errors = logs.match(/code: '\w+'/g);
const counts = {};
errors.forEach(e => { counts[e] = (counts[e] || 0) + 1; });
console.log(JSON.stringify(counts, null, 2));
"
```

---

**版本**: V4.2.0 | **更新时间**: 2026-02-24  
**维护**: AgentGV Team
