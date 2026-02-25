# Troubleshooting Guide

故障排查指南，帮助您解决 AgentGV 使用中遇到的问题。

---

## 📋 目录

- [快速诊断](#快速诊断)
- [安装问题](#安装问题)
- [配置问题](#配置问题)
- [运行问题](#运行问题)
- [性能问题](#性能问题)
- [常见问题 FAQ](#常见问题-faq)
- [获取帮助](#获取帮助)

---

## 🔍 快速诊断

### 运行系统检查

```bash
# 完整状态检查
node .opencode/status.js

# JSON 格式输出
node .opencode/status.js --json

# 最小化输出
node .opencode/status.js --quiet
```

### 检查清单

- [ ] Node.js 版本 >= 18.0.0
- [ ] 配置文件存在且格式正确
- [ ] 模型配置正确
- [ ] Skill 配置正确
- [ ] 网络连接正常

---

## 📦 安装问题

### 问题 1: install.ps1 无法运行

**症状**:
```
无法加载文件，因为在此系统上禁止运行脚本
```

**原因**: PowerShell 执行策略限制

**解决方案**:

**方法 1: 临时绕过（推荐）**
```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

**方法 2: 修改执行策略**
```powershell
# 管理员身份运行 PowerShell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**方法 3: 使用 Linux/Mac 安装**
```bash
chmod +x install.sh
./install.sh
```

### 问题 2: npm install 失败

**症状**:
```
npm ERR! network timeout
npm ERR! errno ETIMEDOUT
```

**原因**: 网络连接问题或 npm 源问题

**解决方案**:

**方法 1: 使用淘宝镜像**
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

**方法 2: 清除 npm 缓存**
```bash
npm cache clean --force
npm install
```

**方法 3: 检查 Node.js 版本**
```bash
node --version
# 确保版本 >= 18.0.0
```

### 问题 3: 依赖冲突

**症状**:
```
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决方案**:

```bash
# 方法 1: 使用 legacy-peer-deps
npm install --legacy-peer-deps

# 方法 2: 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

---

## ⚙️ 配置问题

### 问题 1: 配置验证失败

**症状**:
```
❌ models.json 验证失败
Error: Missing required field: default_model
```

**解决方案**:

1. 检查 JSON 语法
```bash
node -e "JSON.parse(require('fs').readFileSync('.opencode/config/models.json'))"
```

2. 使用在线验证器
https://jsonlint.com/

3. 修复缺失字段
```json
{
  "models": [...],
  "default_model": "bailian-coding-plan/qwen3.5-plus"  // 确保此字段存在
}
```

### 问题 2: Skill 匹配不正确

**症状**: 任务被路由到错误的部门

**诊断**:
```bash
# 测试 Skill 匹配
node .opencode/skill-matcher.js "开发一个 C++ 程序"
```

**解决方案**:

1. 检查关键词配置
```json
{
  "skill_id": "cpp",
  "keywords": ["C++", "cpp", "qt", "stl"]  // 添加更多关键词
}
```

2. 检查类别映射
```json
{
  "category": "software",  // 确保类别正确
  "responsible_agent": "operations"
}
```

3. 重新运行验证
```bash
node .opencode/scripts/validators/config-validator.js
```

### 问题 3: 模型不可用

**症状**:
```
Error: Model 'xxx' is not available
```

**解决方案**:

1. 检查模型配置
```bash
node -e "console.log(JSON.stringify(require('./.opencode/config/models.json'), null, 2))"
```

2. 确保模型已启用
```json
{
  "id": "bailian-coding-plan/qwen3.5-plus",
  "enabled": true  // 确保为 true
}
```

3. 检查默认模型是否存在
```json
{
  "default_model": "bailian-coding-plan/qwen3.5-plus"  // 确保此模型在 models 数组中
}
```

---

## 🚀 运行问题

### 问题 1: Router 不响应

**症状**: 发送请求后无响应

**诊断**:
```bash
# 检查 Agent 配置
node .opencode/status.js

# 检查模型同步
node .opencode/auto-sync-model.js --show
```

**解决方案**:

1. 检查模型配置是否正确
2. 确保至少一个模型可用
3. 检查网络连接
4. 重启 OpenCode Desktop

### 问题 2: 任务执行超时

**症状**:
```
Error: Task execution timeout
```

**解决方案**:

1. 增加超时时间
```json
{
  "timeout": {
    "default": 300000  // 5 分钟
  }
}
```

2. 简化任务描述
3. 使用更强的模型
4. 分解为多个小任务

### 问题 3: 视觉功能不可用

**症状**:
```
Error: Vision capabilities not available
```

**原因**: 当前模型不支持视觉功能

**解决方案**:

1. 切换到支持视觉的模型
```powershell
.\.opencode\sync-agent-model.ps1 -Model "bailian-coding-plan/qwen3.5-plus"
```

2. 检查模型能力
```json
{
  "id": "bailian-coding-plan/qwen3.5-plus",
  "capabilities": ["vision", "reasoning", "coding"]
}
```

### 问题 4: 多部门协作失败

**症状**: 任务在多部门间传递时失败

**诊断**:
```bash
# 启用详细日志
$env:DEBUG = "agentgv:*"
```

**解决方案**:

1. 检查部门配置是否正确
2. 确保 Router 可以访问所有部门
3. 检查任务描述是否清晰
4. 简化协作流程

---

## ⚡ 性能问题

### 问题 1: 响应缓慢

**症状**: 任务执行时间过长

**诊断**:
```bash
# 检查当前模型
node .opencode/preference.js get

# 检查模型负载
node .opencode/status.js
```

**解决方案**:

1. 切换到更快的模型
```bash
node .opencode/preference.js set cost
```

2. 启用降级策略
```json
{
  "fallback": {
    "enabled": true,
    "allow_downgrade": true
  }
}
```

3. 优化任务描述
4. 使用适当的温度参数

### 问题 2: 内存占用高

**症状**: 系统内存使用率过高

**解决方案**:

1. 减少并发任务数量
2. 清理缓存
```bash
rm -rf node_modules/.cache
```

3. 重启进程
4. 增加系统内存

---

## ❓ 常见问题 FAQ

### Q1: 如何查看当前配置？

```bash
# 查看系统状态
node .opencode/status.js --json

# 查看当前偏好
node .opencode/preference.js get

# 查看模型配置
cat .opencode/config/models.json
```

### Q2: 如何重置配置？

```bash
# 备份当前配置
cp .opencode/config/models.json models.json.bak

# 使用默认配置
git checkout .opencode/config/models.json
```

### Q3: 如何更新 AgentGV？

```bash
# 拉取最新代码
git pull origin main

# 重新安装依赖
npm install

# 验证配置
node .opencode/scripts/validators/config-validator.js
```

### Q4: 如何提交 Bug 报告？

1. 访问 https://github.com/lchaveaLoop/agentGV/issues
2. 点击 "New Issue"
3. 选择 "Bug Report" 模板
4. 填写详细信息

### Q5: 支持哪些操作系统？

- ✅ Windows 10/11 (PowerShell)
- ✅ Linux (Ubuntu, Debian, CentOS)
- ✅ macOS (10.15+)

### Q6: 如何贡献代码？

参见 [CONTRIBUTING.md](../../CONTRIBUTING.md)

---

## 🛠️ 调试工具

### 1. 状态检查

```bash
# 完整报告
node .opencode/status.js

# JSON 输出（适合脚本处理）
node .opencode/status.js --json

# 静默模式（只输出错误）
node .opencode/status.js --quiet
```

### 2. 测试套件

```bash
# 运行所有测试
node .opencode/test.js

# 详细输出
node .opencode/test.js --verbose

# 单个测试文件
node .opencode/test.js --file skill-matcher.test.js
```

### 3. 配置验证

```bash
# 验证所有配置
node .opencode/scripts/validators/config-validator.js

# 只验证 models.json
node .opencode/scripts/validators/config-validator.js --file models.json
```

### 4. Skill 匹配测试

```bash
# 测试单个查询
node .opencode/skill-matcher.js "开发一个 C++ 程序"

# 批量测试
node .opencode/skill-matcher.js --batch tests/skill-queries.txt
```

---

## 🆘 获取帮助

### 自助资源

1. **文档**: [docs/](../)
2. **FAQ**: 本节常见问题
3. **Issue 搜索**: https://github.com/lchaveaLoop/agentGV/issues

### 社区支持

1. **GitHub Issues**: 提交新问题
2. **Discussions**: 参与讨论
3. **邮件列表**: [待添加]

### 联系维护者

- **GitHub**: @lchaveaLoop
- **Email**: [项目邮箱]

### 提交 Issue 模板

```markdown
## 问题描述
[清晰描述遇到的问题]

## 复现步骤
1. 
2. 
3. 

## 期望行为
[说明应该发生什么]

## 实际行为
[说明实际发生了什么]

## 环境信息
- OS: Windows 11
- Node.js: v18.17.0
- AgentGV: V5.0.0

## 日志输出
[附上相关日志]

## 尝试过的解决方案
[列出已尝试的方法]
```

---

**最后更新**: 2026-02-25  
**版本**: V5.0.0  
**维护**: AgentGV Operations
