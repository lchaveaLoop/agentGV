# AgentGV V5.0.0 OpenCode 安装指南

## 🚀 快速安装（推荐）

### 方法 1：使用 OpenCode Desktop

1. **打开 OpenCode Desktop**

2. **添加 AgentGV 配置**
   
   在 OpenCode 中打开此项目：
   ```
   File → Open Folder → 选择 E:\Projects\agentGV
   ```

3. **验证配置**
   
   在 OpenCode 聊天窗口中输入：
   ```
   /validate
   ```
   
   或者运行验证命令：
   ```bash
   npm run validate
   ```

4. **开始使用**
   
   直接输入任务即可，例如：
   ```
   帮我调研 AI 市场
   用 Python 开发一个 Web 应用
   写一篇科幻小说
   ```

---

### 方法 2：使用 OpenCode CLI

1. **确保已安装 OpenCode**
   
   ```bash
   # 检查 OpenCode 是否安装
   opencode --version
   
   # 如果未安装，使用以下命令安装
   npm install -g opencode-ai
   ```

2. **配置 AgentGV**
   
   在项目根目录运行：
   ```bash
   # 验证配置
   npm run validate
   
   # 运行测试
   npm test
   
   # 启动 OpenCode
   opencode
   ```

3. **设置默认模型**
   
   ```bash
   # 查看当前模型
   opencode models
   
   # 切换到推荐模型
   opencode models set bailian-coding-plan/qwen3.5-plus
   ```

---

### 方法 3：复制配置到全局（可选）

如果您想在所有项目中使用 AgentGV：

1. **复制配置到全局**
   
   **Windows PowerShell**:
   ```powershell
   # 备份现有配置
   Copy-Item $env:USERPROFILE\.opencode\opencode.json $env:USERPROFILE\.opencode\opencode.json.backup
   
   # 复制 AgentGV 配置
   Copy-Item .\opencode.json $env:USERPROFILE\.opencode\opencode.json
   ```
   
   **macOS/Linux**:
   ```bash
   # 备份现有配置
   cp ~/.opencode/opencode.json ~/.opencode/opencode.json.backup
   
   # 复制 AgentGV 配置
   cp ./opencode.json ~/.opencode/opencode.json
   ```

2. **验证全局配置**
   
   ```bash
   opencode validate
   ```

---

## ✅ 安装验证

运行以下命令验证安装：

```bash
# 1. 验证配置
npm run validate

# 2. 运行测试
npm test

# 3. 检查代码质量
npm run lint

# 4. 查看系统状态
node .opencode/status.js
```

**预期输出**：
```
✓ models is valid
✓ skills is valid
✓ commands is valid
✓ All configurations are valid! ✅

Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total

ESLint: 0 errors
```

---

## 🎯 使用示例

### 简单任务
```
用 Python 写一个爬虫
```

### 复杂任务
```
开发一个用户管理系统，需要前后端和测试
```

### 创意写作
```
写一篇科幻小说，关于 AI 觉醒的故事
```

### 市场调研
```
调研新能源汽车市场，包括主要玩家和技术趋势
```

### 视觉任务（上传图片）
```
[上传架构图] 分析这个系统架构
[上传截图] 把这个网页转成 HTML/CSS 代码
```

---

## 🔧 故障排查

### 问题 1: 配置验证失败

**解决方案**：
```bash
# 重新安装依赖
npm install

# 重新验证
npm run validate
```

### 问题 2: Agent 未加载

**解决方案**：
```bash
# 检查 opencode.json 语法
node -e "console.log(JSON.parse(require('fs').readFileSync('opencode.json')))"

# 重启 OpenCode
opencode reload
```

### 问题 3: 模型不可用

**解决方案**：
```bash
# 查看可用模型
opencode models

# 切换到可用模型
node .opencode/preference.js set balanced
```

---

## 📚 更多资源

- **Agent 知识库**: [AGENTS.md](AGENTS.md)
- **贡献指南**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **配置指南**: [docs/user/CONFIGURATION.md](docs/user/CONFIGURATION.md)
- **故障排查**: [docs/user/TROUBLESHOOTING.md](docs/user/TROUBLESHOOTING.md)
- **API 文档**: [docs/api/](docs/api/)

---

## 🎉 安装完成！

AgentGV V5.0.0 已经成功安装到 OpenCode！

**开始使用**：
```
在 OpenCode 中输入任何任务，系统将自动路由到对应的 Agent 执行！
```

**版本**: V5.0.0  
**更新日期**: 2026-02-25  
**状态**: ✅ 生产就绪
