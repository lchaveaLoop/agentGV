# AgentGV 安装指南

本文档提供详细的安装说明，支持 Windows、Linux 和 macOS 系统。

## 📋 系统要求

| 组件 | 要求 | 说明 |
|------|------|------|
| **Node.js** | >= 16.0.0 | 必需 |
| **npm** | >= 7.0.0 | 推荐 |
| **Git** | 任意版本 | 可选（用于版本控制） |
| **磁盘空间** | >= 100MB | 基础安装 |

## 🚀 快速安装

### Windows

1. **下载项目**
   ```powershell
   git clone https://github.com/lchaveaLoop/agentGV.git
   cd agentGV
   ```

2. **运行安装脚本**
   ```powershell
   .\install.ps1
   ```

3. **验证安装**
   ```powershell
   node .opencode\status.js
   ```

### Linux/macOS

1. **下载项目**
   ```bash
   git clone https://github.com/lchaveaLoop/agentGV.git
   cd agentGV
   ```

2. **运行安装脚本**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **验证安装**
   ```bash
   node .opencode/status.js
   ```

## 📝 详细安装步骤

### 步骤 1: 安装 Node.js

#### Windows
1. 访问 https://nodejs.org/
2. 下载 LTS 版本
3. 运行安装程序
4. 验证：`node --version`

#### Linux (Ubuntu/Debian)
```bash
# 使用 NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node --version
npm --version
```

#### Linux (CentOS/RHEL)
```bash
# 使用 NodeSource
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs

# 验证
node --version
```

#### macOS
```bash
# 使用 Homebrew
brew install node

# 验证
node --version
```

### 步骤 2: 克隆项目

```bash
git clone https://github.com/lchaveaLoop/agentGV.git
cd agentGV
```

### 步骤 3: 运行安装脚本

#### Windows (PowerShell)
```powershell
# 以管理员身份运行 PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 运行安装脚本
.\install.ps1

# 快速安装（跳过确认）
.\install.ps1 -Quick
```

#### Linux/macOS (Bash)
```bash
# 添加执行权限
chmod +x install.sh

# 运行安装脚本
./install.sh

# 快速安装（跳过确认）
./install.sh --quick
```

### 步骤 4: 验证安装

```bash
# 运行环境检测
node .opencode/check-env.js

# 运行状态检查
node .opencode/status.js

# 运行测试
node .opencode/test.js
```

## 🔧 手动安装

如果自动安装脚本失败，可以手动安装：

### 1. 创建目录结构
```bash
# Windows
mkdir logs
mkdir .opencode\skills
mkdir docs

# Linux/macOS
mkdir -p logs .opencode/skills docs
```

### 2. 安装依赖
```bash
npm install
```

### 3. 设置权限 (Linux/macOS)
```bash
chmod +x .opencode/*.js
chmod +x install.sh
```

### 4. 验证
```bash
node .opencode/status.js
```

## 🎯 配置

### 环境变量（可选）

创建 `.env` 文件（在项目根目录）：

```bash
# 模型配置
AGENTGV_MODEL=bailian-coding-plan/qwen3.5-plus

# 日志级别
LOG_LEVEL=info

# API 密钥（如需要）
OPENAI_API_KEY=your_api_key
```

### 配置文件

**models.json** - 模型配置
```json
{
  "models": [
    {
      "id": "qwen3.5-plus",
      "name": "Qwen3.5 Plus",
      "status": "active"
    }
  ]
}
```

**skills.json** - Skills 配置
```json
{
  "skill_categories": {
    "creative": {
      "skills": [
        {
          "id": "fiction",
          "name": "Fiction Writing"
        }
      ]
    }
  }
}
```

## 🔍 故障排查

### 问题 1: Node.js 版本过低

**错误**: `Node.js 版本过低 (需要 >= 16.0.0)`

**解决**:
```bash
# 使用 nvm 升级 (推荐)
nvm install 18
nvm use 18

# 或者从官网下载安装
# https://nodejs.org/
```

### 问题 2: 权限错误 (Linux/macOS)

**错误**: `EACCES: permission denied`

**解决**:
```bash
# 设置正确权限
chmod -R u+w .

# 或者使用 sudo（不推荐）
sudo ./install.sh
```

### 问题 3: PowerShell 执行策略 (Windows)

**错误**: `无法加载文件，因为在此系统上禁止运行脚本`

**解决**:
```powershell
# 临时允许
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# 或永久允许（需要管理员权限）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 问题 4: 模块未找到

**错误**: `Cannot find module 'xxx'`

**解决**:
```bash
# 重新安装依赖
npm install

# 清除缓存
npm cache clean --force
npm install
```

### 问题 5: 配置文件缺失

**错误**: `Configuration file not found`

**解决**:
```bash
# 检查文件是否存在
ls -la .opencode/*.json

# 从示例复制（如果有）
cp .opencode/models.json.example .opencode/models.json
```

## 📊 安装后检查清单

- [ ] Node.js >= 16.0.0 已安装
- [ ] npm 可正常运行
- [ ] 项目目录结构完整
- [ ] 配置文件存在且有效
- [ ] 核心脚本可正常运行
- [ ] 状态检查通过
- [ ] 测试套件运行成功

## 🆘 获取帮助

如果遇到问题：

1. **查看日志**
   ```bash
   cat install.log
   ```

2. **运行诊断**
   ```bash
   node .opencode/check-env.js --verbose
   ```

3. **检查状态**
   ```bash
   node .opencode/status.js --verbose
   ```

4. **查看文档**
   - `docs/QUICKSTART.md` - 快速开始
   - `docs/ERROR_CODES.md` - 错误代码
   - `README.md` - 项目说明

## 📚 参考资源

- [Node.js 官方文档](https://nodejs.org/docs/)
- [npm 官方文档](https://docs.npmjs.com/)
- [Git 官方文档](https://git-scm.com/doc)
- [AgentGV 快速开始](docs/QUICKSTART.md)

---

**版本**: V4.3.2 | **更新时间**: 2026-02-25

---

## 重要：Workspace 隔离说明

### 问题描述

OpenCode 使用 workspace 概念来管理项目配置。默认情况下，同一父目录下的所有项目共享同一个 workspace。

例如：
- 如果你把 agentGV 放在 E:\Projects\agentGV
- 同时你在 E:\Projects\driverWifi 也有项目
- 这两个项目会共享同一个 workspace (E:\Projects)
- agentGV 的 agent 配置可能会影响其他项目

### 解决方案

**方案 1：将 agentGV 放在独立目录（推荐）**

将 agentGV 项目克隆到一个与其他项目不同父目录下：

```powershell
# 例如放在用户主目录下
git clone https://github.com/lchaveaLoop/agentGV.git C:\Users\lc\agentGV
```

**方案 2：清除 workspace 缓存**

如果必须将 agentGV 放在共享目录下，可以在使用其他项目前清除缓存：

```powershell
# 关闭所有 OpenCode 窗口，然后删除缓存文件
Remove-Item -Path "$env:APPDATA\ai.opencode.desktop\opencode.workspace.*.dat" -Force
Remove-Item -Path "$env:APPDATA\ai.opencode.desktop\opencode.global.dat" -Force

# 重新打开 OpenCode Desktop
```

### 在其他项目中使用 agentGV

如果想在其他项目中使用 agentGV 的配置，可以复制 opencode.json：

```powershell
# 在目标项目中
Copy-Item C:\path\to\agentGV\opencode.json -Destination .\opencode.json
```
