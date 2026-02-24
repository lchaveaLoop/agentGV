# 平台兼容性说明

**版本**: 1.0.0  
**日期**: 2026-02-24  

---

## 📱 支持的平台

### ✅ OpenCode CLI

**完全支持** - 所有功能可用

```bash
# 实时统计
node .opencode/realtime-stats.js
node .opencode/realtime-stats.js --live

# Skill 匹配
node .opencode/skill-matcher.js "任务描述"

# 偏好设置
node .opencode/preference.js set quality
```

**优势**:
- ✅ 完整命令行支持
- ✅ 彩色终端输出
- ✅ 实时刷新模式
- ✅ JSON 导出

---

### ✅ OpenCode Desktop

**支持** - 通过对话方式使用

**使用方式**:

1. **直接对话** - 告诉 Router 查看统计
   ```
   查看实时统计
   显示今天的请求分布
   哪个 Skill 用得最多
   ```

2. **自动记录** - 所有请求自动统计
   - 无需手动操作
   - 每次对话自动记录
   - 数据与 CLI 共享

**限制**:
- ⚠️ 无法直接运行 Node.js 脚本
- ⚠️ 无法使用 `--live` 实时刷新
- ⚠️ 无法使用 JSON 导出

**解决方案**: 创建 Desktop 专用命令

---

## 🔄 数据共享

### 统计数据文件

**位置**: `.opencode/usage-stats.json`

**共享机制**:
```
CLI 请求 → 写入 usage-stats.json
                ↓
Desktop 请求 → 读取/写入 同一文件
                ↓
CLI 查看 → 读取统计（包含 Desktop 数据）
```

**优势**:
- ✅ 数据完全同步
- ✅ 跨平台统计
- ✅ 统一分析

---

## 🛠️ Desktop 集成方案

### 方案 1: Router 命令（已实现）

直接告诉 Router：

```
用户：查看实时统计
Router: 读取 usage-stats.json 并格式化显示
```

**实现**: Router 已有 `bash` 权限，可以读取并展示统计

---

### 方案 2: 自定义命令（推荐）

在 `opencode.json` 中配置：

```json
{
  "commands": {
    "stats": {
      "description": "View real-time statistics",
      "prompt": "Read .opencode/usage-stats.json and display formatted statistics"
    },
    "skills": {
      "description": "Show skill usage statistics",
      "prompt": "Read .opencode/usage-stats.json and show top skills"
    }
  }
}
```

---

### 方案 3: 内置集成（未来）

等待 OpenCode 官方支持自定义命令后：

```
/stats          # 查看统计
/skills         # Skill 排名
/models         # 模型使用
```

---

## 📊 平台对比

| 功能 | CLI | Desktop |
|------|-----|---------|
| 自动记录 | ✅ | ✅ |
| 查看统计 | ✅ (完整) | ✅ (对话式) |
| 实时刷新 | ✅ (`--live`) | ❌ |
| JSON 导出 | ✅ | ❌ |
| 彩色输出 | ✅ | ✅ (通过格式化) |
| Skill 匹配 | ✅ (CLI) | ✅ (自动) |
| 数据共享 | ✅ | ✅ |

---

## 🎯 推荐使用方式

### CLI 用户

```bash
# 完整功能
node .opencode/realtime-stats.js --live  # 实时监控
node .opencode/skill-matcher.js "任务"    # 匹配 + 记录
```

### Desktop 用户

```
# 对话方式
"查看实时统计"
"显示 Skill 排名"
"哪个模型用得最多"
"今天的请求有多少"
```

---

## ✅ 当前状态

| 平台 | 自动记录 | 查看统计 | 实时刷新 | 状态 |
|------|---------|---------|---------|------|
| **CLI** | ✅ | ✅ | ✅ | 🟢 完整 |
| **Desktop** | ✅ | ✅ | ⚠️ | 🟡 基本 |

---

## 🚀 后续改进

### Desktop 增强（短期）

1. **Router 统计命令** - 通过对话查看统计
2. **格式化输出** - 美化统计展示
3. **快捷命令** - 简化查看流程

### 完全集成（中期）

1. **等待官方支持** - OpenCode custom commands
2. **GUI 界面** - 如果官方支持插件
3. **图表展示** - 可视化统计

---

**状态**: ✅ CLI 完整支持 | Desktop 基本支持  
**数据**: ✅ 跨平台共享  
**下一步**: 增强 Desktop 对话式统计查看
