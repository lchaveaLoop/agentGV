#!/usr/bin/env pwsh
# AgentGV 跨平台安装脚本 (Windows PowerShell)
# 用途：一键安装和配置 AgentGV 系统
# 用法：.\install.ps1 [-Quick] [-Verbose]

param(
    [switch]$Quick,      # 快速安装（跳过确认）
    [switch]$VerboseMode # 详细输出
)

# 配置
$AGENTGV_VERSION = "4.2.0"
$REQUIRED_NODE_VERSION = "16.0.0"
$INSTALL_DIR = "$PSScriptRoot"

# 颜色输出
function Write-Info { Write-Host "ℹ️  $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "✅  $args" -ForegroundColor Green }
function Write-Warning { Write-Host "⚠️  $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "❌  $args" -ForegroundColor Red }

# 日志
$LogFile = Join-Path $INSTALL_DIR "install.log"
function Write-Log {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $args" | Out-File -Append -FilePath $LogFile
}

Write-Info "AgentGV 安装程序 v$AGENTGV_VERSION (Windows)"
Write-Log "开始安装"

# 检测系统信息
Write-Info "检测系统环境..."
$OSInfo = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion"
Write-Info "  操作系统：Windows $($OSInfo.CurrentBuild)"
Write-Log "操作系统：Windows $($OSInfo.CurrentBuild)"

# 检测 Node.js
Write-Info "检测 Node.js..."
try {
    $NodeVersion = node --version
    if ($NodeVersion) {
        $NodeVersion = $NodeVersion.TrimStart('v')
        Write-Success "  Node.js: $NodeVersion"
        Write-Log "Node.js: $NodeVersion"
        
        # 版本检查
        $RequiredVersion = [version]$REQUIRED_NODE_VERSION
        $ActualVersion = [version]$NodeVersion
        if ($ActualVersion -lt $RequiredVersion) {
            Write-Warning "  Node.js 版本过低 (需要 >= $REQUIRED_NODE_VERSION)"
            Write-Warning "  请升级 Node.js: https://nodejs.org/"
            if (-not $Quick) {
                $continue = Read-Host "  继续安装？(y/n)"
                if ($continue -ne 'y') { exit 1 }
            }
        }
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Error "未检测到 Node.js"
    Write-Error "请先安装 Node.js (>= $REQUIRED_NODE_VERSION): https://nodejs.org/"
    Write-Log "错误：Node.js 未安装"
    exit 1
}

# 检测 npm
Write-Info "检测 npm..."
try {
    $NpmVersion = npm --version
    Write-Success "  npm: $NpmVersion"
    Write-Log "npm: $NpmVersion"
} catch {
    Write-Warning "npm 未检测到"
}

# 创建必要目录
Write-Info "创建目录结构..."
$Directories = @(
    "logs",
    ".opencode/skills",
    "docs",
    "scripts"
)

foreach ($Dir in $Directories) {
    $Path = Join-Path $INSTALL_DIR $Dir
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Info "  创建：$Dir"
        Write-Log "创建目录：$Dir"
    }
}
Write-Success "目录结构创建完成"

# 检查配置文件
Write-Info "检查配置文件..."
$ConfigFiles = @(
    ".opencode/models.json",
    ".opencode/skills.json",
    "opencode.json"
)

foreach ($File in $ConfigFiles) {
    $Path = Join-Path $INSTALL_DIR $File
    if (Test-Path $Path) {
        Write-Success "  ✓ $File"
    } else {
        Write-Warning "  ✗ $File (缺失)"
    }
}

# 安装依赖（如果有 package.json）
$PackageJson = Join-Path $INSTALL_DIR "package.json"
if (Test-Path $PackageJson) {
    Write-Info "安装依赖..."
    try {
        npm install --prefix $INSTALL_DIR
        Write-Success "依赖安装完成"
        Write-Log "依赖安装完成"
    } catch {
        Write-Warning "依赖安装失败，但可继续使用"
    }
}

# 测试关键脚本
Write-Info "测试关键脚本..."
$Scripts = @(
    ".opencode/status.js",
    ".opencode/skill-scanner.js",
    ".opencode/test.js"
)

$TestResults = @{ Pass = 0; Fail = 0 }
foreach ($Script in $Scripts) {
    $Path = Join-Path $INSTALL_DIR $Script
    if (Test-Path $Path) {
        try {
            node $Path --help 2>$null
            Write-Success "  ✓ $(Split-Path $Script -Leaf)"
            $TestResults.Pass++
        } catch {
            Write-Warning "  ✗ $(Split-Path $Script -Leaf)"
            $TestResults.Fail++
        }
    } else {
        Write-Warning "  ✗ $(Split-Path $Script -Leaf) (文件不存在)"
        $TestResults.Fail++
    }
}
Write-Log "脚本测试：通过 $($TestResults.Pass), 失败 $($TestResults.Fail)"

# 创建快捷方式（仅 Windows）
Write-Info "创建快捷方式..."
try {
    $Desktop = [Environment]::GetFolderPath("Desktop")
    $WScript = New-Object -ComScripting WScript.Shell
    
    # 状态检查快捷方式
    $ShortcutPath = Join-Path $Desktop "AgentGV Status.lnk"
    $Shortcut = $WScript.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = "node.exe"
    $Shortcut.Arguments = "$INSTALL_DIR\.opencode\status.js"
    $Shortcut.WorkingDirectory = $INSTALL_DIR
    $Shortcut.Description = "AgentGV 系统状态检查"
    $Shortcut.Save()
    Write-Success "  创建桌面快捷方式：状态检查"
} catch {
    Write-Warning "创建快捷方式失败"
    Write-Log "快捷方式创建失败：$_"
}

# 运行系统检查
Write-Info "运行系统检查..."
try {
    $StatusOutput = node (Join-Path $INSTALL_DIR ".opencode\status.js")
    Write-Host $StatusOutput
    Write-Log "系统检查完成"
} catch {
    Write-Warning "系统检查失败"
}

# 安装完成总结
Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
Write-Success "AgentGV v$AGENTGV_VERSION 安装完成！"
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Info "快速开始："
Write-Host "  1. 状态检查：node .opencode\status.js"
Write-Host "  2. 运行测试：node .opencode\test.js"
Write-Host "  3. 查看文档：docs\QUICKSTART.md"
Write-Host ""
Write-Info "后续步骤："
Write-Host "  • 配置模型：.opencode\models.json"
Write-Host "  • 添加 Skills：.opencode\skills\"
Write-Host "  • 查看文档：docs\README.md"
Write-Host ""
Write-Info "如遇问题："
Write-Host "  • 查看日志：install.log"
Write-Host "  • 运行诊断：node .opencode\status.js --verbose"
Write-Host ""

Write-Log "安装完成"
exit 0
