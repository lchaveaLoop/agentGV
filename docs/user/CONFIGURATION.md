# Configuration Guide

用户配置指南，帮助您配置和优化 AgentGV 系统。

---

## 📋 目录

- [配置概览](#配置概览)
- [模型配置](#模型配置)
- [Skill 配置](#skill-配置)
- [用户偏好](#用户偏好)
- [环境变量](#环境变量)
- [高级配置](#高级配置)
- [故障排查](#故障排查)

---

## 📊 配置概览

### 配置文件位置

```
agentGV/
└── .opencode/
    ├── config/
    │   ├── models.json      # 模型配置
    │   ├── skills.json      # Skill 配置
    │   └── commands.json    # 命令配置
    └── agents/              # Agent 定义
```

### 配置优先级

```
环境变量 > 用户偏好 > 配置文件 > 默认值
```

---

## 🔧 模型配置

### 编辑 models.json

位置：`.opencode/config/models.json`

```json
{
  "models": [
    {
      "id": "bailian-coding-plan/qwen3.5-plus",
      "name": "Qwen3.5 Plus",
      "enabled": true,
      "priority": 1,
      "capabilities": ["vision", "reasoning", "coding"],
      "cost_tier": "medium"
    },
    {
      "id": "bailian-coding-plan/qwen3-max",
      "name": "Qwen3 Max",
      "enabled": true,
      "priority": 2,
      "capabilities": ["deep-reasoning", "complex-analysis"],
      "cost_tier": "high"
    },
    {
      "id": "bailian-coding-plan/qwen3-coder-plus",
      "name": "Qwen3 Coder Plus",
      "enabled": true,
      "priority": 3,
      "capabilities": ["coding", "debugging"],
      "cost_tier": "low"
    },
    {
      "id": "bailian-coding-plan/qwen3-coder-next",
      "name": "Qwen3 Coder Next",
      "enabled": true,
      "priority": 4,
      "capabilities": ["fast-coding", "simple-tasks"],
      "cost_tier": "lowest"
    }
  ],
  "default_model": "bailian-coding-plan/qwen3.5-plus",
  "fallback_enabled": true
}
```

### 配置字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 模型唯一标识 |
| `name` | string | ✅ | 模型显示名称 |
| `enabled` | boolean | ✅ | 是否启用 |
| `priority` | number | ✅ | 优先级（数字越小优先级越高） |
| `capabilities` | array | ❌ | 支持的能力列表 |
| `cost_tier` | string | ❌ | 成本等级 |
| `default_model` | string | ✅ | 默认使用的模型 |
| `fallback_enabled` | boolean | ❌ | 是否启用降级 |

### 验证配置

```bash
node .opencode/scripts/validators/config-validator.js
```

---

## 🎯 Skill 配置

### 编辑 skills.json

位置：`.opencode/config/skills.json`

```json
{
  "skills": [
    {
      "skill_id": "cpp",
      "skill_name": "C++ Development",
      "category": "software",
      "keywords": ["C++", "cpp", "qt", "stl", "cmake", "mfc"],
      "model": "bailian-coding-plan/qwen3-coder-plus",
      "temperature": 0.3,
      "responsible_agent": "operations",
      "enabled": true
    },
    {
      "skill_id": "python",
      "skill_name": "Python Development",
      "category": "software",
      "keywords": ["Python", "django", "flask", "fastapi", "pandas"],
      "model": "bailian-coding-plan/qwen3-coder-plus",
      "temperature": 0.3,
      "responsible_agent": "operations",
      "enabled": true
    },
    {
      "skill_id": "fiction",
      "skill_name": "Fiction Writing",
      "category": "creative",
      "keywords": ["小说", "故事", "fiction", "creative writing"],
      "model": "bailian-coding-plan/qwen3.5-plus",
      "temperature": 0.7,
      "responsible_agent": "operations",
      "enabled": true
    }
  ]
}
```

### 配置字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `skill_id` | string | ✅ | Skill 唯一标识 |
| `skill_name` | string | ✅ | Skill 名称 |
| `category` | string | ✅ | 所属类别 |
| `keywords` | array | ✅ | 匹配关键词 |
| `model` | string | ✅ | 默认模型 |
| `temperature` | number | ✅ | 温度参数 (0-1) |
| `responsible_agent` | string | ✅ | 负责部门 |
| `enabled` | boolean | ❌ | 是否启用 |

### 类别与部门映射

| Category | Responsible Agent |
|----------|-------------------|
| `software` | operations |
| `hardware` | operations |
| `creative` | operations |
| `simulation` | planning |
| `research` | planning |
| `review` | quality |

---

## ⚙️ 用户偏好

### 偏好模式

| 模式 | 说明 | 默认模型 | 复杂升级 | 降级 |
|------|------|----------|----------|------|
| `quality_priority` | 质量优先 | qwen3.5-plus | qwen3-max | ❌ |
| `balanced` | 平衡模式 | qwen3.5-plus | qwen3-max | ✅ |
| `cost_saving` | 成本优先 | qwen3-coder-plus | qwen3.5-plus | ✅ |

### 设置偏好模式

**方法 1: 直接告诉 Router**

```
切换到质量优先模式
切换到平衡模式
切换到成本优先模式
```

**方法 2: 使用脚本**

```bash
# 设置质量优先
node .opencode/preference.js set quality

# 设置平衡模式
node .opencode/preference.js set balanced

# 设置成本优先
node .opencode/preference.js set cost

# 查看当前偏好
node .opencode/preference.js get
```

### 偏好配置文件

位置：`.opencode/config/preference.json`

```json
{
  "mode": "balanced",
  "auto_upgrade": true,
  "allow_downgrade": true,
  "max_cost_tier": "high"
}
```

---

## 🌍 环境变量

### 可用环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `AGENTGV_MODEL` | 指定默认模型 | `bailian-coding-plan/qwen3.5-plus` |
| `AGENTGV_PREFERENCE` | 指定偏好模式 | `quality_priority` |
| `AGENTGV_DEBUG` | 启用调试模式 | `true` |
| `AGENTGV_TIMEOUT` | 设置超时时间 (ms) | `120000` |

### 设置环境变量

**PowerShell (Windows)**:
```powershell
$env:AGENTGV_MODEL = "bailian-coding-plan/qwen3.5-plus"
$env:AGENTGV_PREFERENCE = "quality_priority"
```

**Bash (Linux/Mac)**:
```bash
export AGENTGV_MODEL="bailian-coding-plan/qwen3.5-plus"
export AGENTGV_PREFERENCE="quality_priority"
```

**永久设置**:
添加到系统环境变量或 `.bashrc`/`.zshrc`

---

## 🔧 高级配置

### 1. 自定义路由规则

编辑 `.opencode/config/commands.json`:

```json
{
  "routing_rules": [
    {
      "pattern": ".*架构.*",
      "target_agent": "planning",
      "model": "bailian-coding-plan/qwen3-max"
    },
    {
      "pattern": ".*测试.*",
      "target_agent": "quality",
      "model": "bailian-coding-plan/qwen3.5-plus"
    }
  ]
}
```

### 2. 温度参数调整

不同任务类型的推荐温度：

| 任务类型 | 推荐温度 | 说明 |
|----------|----------|------|
| 架构设计 | 0.2 | 需要严谨思考 |
| 代码开发 | 0.3 | 平衡创造性与准确性 |
| 创意写作 | 0.7 | 需要高创造性 |
| 技术研究 | 0.2 | 需要准确性 |
| 内容创作 | 0.6 | 需要一定创造性 |

### 3. 超时配置

```json
{
  "timeout": {
    "default": 120000,
    "simple": 30000,
    "complex": 300000,
    "vision": 180000
  }
}
```

### 4. 降级策略

```json
{
  "fallback": {
    "enabled": true,
    "max_retries": 3,
    "fallback_chain": [
      "bailian-coding-plan/qwen3.5-plus",
      "bailian-coding-plan/qwen3-coder-plus",
      "bailian-coding-plan/qwen3-coder-next"
    ]
  }
}
```

---

## 🐛 故障排查

### 常见问题

#### 1. 配置验证失败

**症状**: `config-validator.js` 报错

**解决**:
```bash
# 检查 JSON 语法
node -e "JSON.parse(require('fs').readFileSync('.opencode/config/models.json'))"

# 使用在线 JSON 验证器
# https://jsonlint.com/
```

#### 2. Skill 匹配不正确

**症状**: 任务被路由到错误的部门

**解决**:
1. 检查 `skills.json` 中的关键词
2. 添加更多相关关键词
3. 测试匹配：`node .opencode/skill-matcher.js "你的任务"`

#### 3. 模型不可用

**症状**: 提示模型不存在或不可用

**解决**:
1. 检查 `models.json` 中模型 ID 是否正确
2. 确认模型已启用 (`enabled: true`)
3. 检查网络连接

#### 4. 偏好设置不生效

**症状**: 设置的偏好模式没有效果

**解决**:
```bash
# 清除缓存的配置
rm .opencode/config/preference.json

# 重新设置
node .opencode/preference.js set balanced
```

### 调试技巧

```bash
# 启用详细日志
$env:DEBUG = "agentgv:*"

# 运行状态检查
node .opencode/status.js --verbose

# 查看当前配置
node .opencode/status.js --json
```

---

## ✅ 配置检查清单

配置完成后，检查以下项目：

- [ ] models.json 格式正确
- [ ] skills.json 格式正确
- [ ] 至少一个模型启用
- [ ] 至少一个 Skill 配置
- [ ] 默认模型存在且启用
- [ ] 运行验证器无错误
- [ ] 运行测试套件通过

---

## 📚 相关文档

- [GETTING_STARTED.md](GETTING_STARTED.md) - 开发者快速开始
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 故障排查指南
- [ROUTER_API.md](../api/ROUTER_API.md) - Router API 文档

---

**最后更新**: 2026-02-25  
**版本**: V5.0.0  
**维护**: AgentGV Operations
