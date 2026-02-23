# AgentGV 自定义命令使用说明

## 📋 当前限制

OpenCode Desktop 的自定义命令功能需要通过配置文件加载。目前有两种使用方式：

---

## 方式 1：直接对话（推荐）

直接告诉 Router Agent 你的需求：

```
设置质量优先模式
查看使用统计
列出可用模型
```

Router 会自动处理并更新配置。

---

## 方式 2：使用 CLI 脚本

在项目根目录运行：

```bash
# 设置偏好
node .opencode/preference.js set quality
node .opencode/preference.js set balanced
node .opencode/preference.js set cost

# 查看统计
node .opencode/preference.js stats
node .opencode/preference.js stats reset

# 列出模型
node .opencode/preference.js list
```

---

## 方式 3：手动编辑配置

编辑 `.opencode/models.json`，修改 `current_preference` 字段：

```json
{
  "current_preference": "quality_priority"  // 或 balanced, cost_saving
}
```

---

## 🔧 未来支持

等待 OpenCode 官方支持 custom commands 后，可以使用 `/preference` 等 slash commands。

目前请使用上述三种方式之一。
