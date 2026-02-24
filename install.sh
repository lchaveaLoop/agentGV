#!/usr/bin/env bash
# AgentGV 安装脚本 (Linux/macOS)
# 用途：一键安装和配置 AgentGV 系统
# 用法：./install.sh [-q|--quick] [-v|--verbose]

set -e

# 配置
AGENTGV_VERSION="4.3.2"
REQUIRED_NODE_VERSION="20.0.0"
INSTALL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

function write_info() { echo -e "${CYAN}ℹ️  $*${NC}"; }
function write_success() { echo -e "${GREEN}✅  $*${NC}"; }
function write_warning() { echo -e "${YELLOW}⚠️  $*${NC}"; }
function write_error() { echo -e "${RED}❌  $*${NC}"; }

# 日志
LOG_FILE="$INSTALL_DIR/install.log"
function write_log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "$timestamp - $*" >> "$LOG_FILE"
}

# 解析参数
QUICK=false
VERBOSE=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -q|--quick) QUICK=true; shift ;;
        -v|--verbose) VERBOSE=true; shift ;;
        *) write_warning "未知参数：$1"; shift ;;
    esac
done

write_info "AgentGV 安装程序 v$AGENTGV_VERSION (Linux/macOS)"
write_log "开始安装"

# 检测系统信息
write_info "检测系统环境..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS_NAME="macOS $(sw_vers -productVersion)"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS_NAME="$NAME $VERSION_ID"
    else
        OS_NAME="Linux"
    fi
else
    OS_NAME="$(uname -s)"
fi
write_info "  操作系统：$OS_NAME"
write_log "操作系统：$OS_NAME"

# 检测 Node.js
write_info "检测 Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/^v//')
    write_success "  Node.js: $NODE_VERSION"
    write_log "Node.js: $NODE_VERSION"
    
    # 版本检查
    REQUIRED_MAJOR=$(echo $REQUIRED_NODE_VERSION | cut -d. -f1)
    ACTUAL_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    if [ "$ACTUAL_MAJOR" -lt "$REQUIRED_MAJOR" ]; then
        write_warning "  Node.js 版本过低 (需要 >= $REQUIRED_NODE_VERSION)"
        write_warning "  请升级 Node.js: https://nodejs.org/"
        if [ "$QUICK" = false ]; then
            read -p "  继续安装？(y/n): " continue
            if [ "$continue" != "y" ]; then exit 1; fi
        fi
    fi
else
    write_error "未检测到 Node.js"
    write_error "请先安装 Node.js (>= $REQUIRED_NODE_VERSION): https://nodejs.org/"
    write_log "错误：Node.js 未安装"
    exit 1
fi

# 检测 npm
write_info "检测 npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    write_success "  npm: $NPM_VERSION"
    write_log "npm: $NPM_VERSION"
else
    write_warning "npm 未检测到"
fi

# 检测 yarn/pnpm
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    write_info "  yarn: $YARN_VERSION (可选)"
fi

if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    write_info "  pnpm: $PNPM_VERSION (可选)"
fi

# 创建必要目录
write_info "创建目录结构..."
DIRECTORIES=(
    "logs"
    ".opencode/skills"
    "docs"
    "scripts"
)

for dir in "${DIRECTORIES[@]}"; do
    path="$INSTALL_DIR/$dir"
    if [ ! -d "$path" ]; then
        mkdir -p "$path"
        write_info "  创建：$dir"
        write_log "创建目录：$dir"
    fi
done
write_success "目录结构创建完成"

# 设置权限
write_info "设置脚本权限..."
chmod +x "$INSTALL_DIR/.opencode"/*.js 2>/dev/null || true
write_success "权限设置完成"

# 检查配置文件
write_info "检查配置文件..."
CONFIG_FILES=(
    ".opencode/models.json"
    ".opencode/skills.json"
    "opencode.json"
)

for file in "${CONFIG_FILES[@]}"; do
    path="$INSTALL_DIR/$file"
    if [ -f "$path" ]; then
        write_success "  ✓ $file"
    else
        write_warning "  ✗ $file (缺失)"
    fi
done

# 安装依赖（如果有 package.json）
PACKAGE_JSON="$INSTALL_DIR/package.json"
if [ -f "$PACKAGE_JSON" ]; then
    write_info "安装依赖..."
    if [ "$VERBOSE" = true ]; then
        npm install --prefix "$INSTALL_DIR"
    else
        npm install --prefix "$INSTALL_DIR" > /dev/null 2>&1 || true
    fi
    write_success "依赖安装完成"
    write_log "依赖安装完成"
fi

# 测试关键脚本
write_info "测试关键脚本..."
SCRIPTS=(
    ".opencode/status.js"
    ".opencode/skill-matcher.js"
    ".opencode/test.js"
)

PASS=0
FAIL=0
for script in "${SCRIPTS[@]}"; do
    path="$INSTALL_DIR/$script"
    script_name=$(basename "$script")
    if [ -f "$path" ]; then
        if node "$path" --help &> /dev/null; then
            write_success "  ✓ $script_name"
            ((PASS++))
        else
            write_warning "  ✗ $script_name"
            ((FAIL++))
        fi
    else
        write_warning "  ✗ $script_name (文件不存在)"
        ((FAIL++))
    fi
done
write_log "脚本测试：通过 $PASS, 失败 $FAIL"

# 创建别名/快捷方式
write_info "创建命令别名..."
if [ -w "$HOME/.bashrc" ] || [ -w "$HOME/.zshrc" ]; then
    ALIAS_CMD="alias agentgv-status='node $INSTALL_DIR/.opencode/status.js'"
    
    # 添加到 bashrc
    if [ -w "$HOME/.bashrc" ] && ! grep -q "agentgv-status" "$HOME/.bashrc" 2>/dev/null; then
        echo "" >> "$HOME/.bashrc"
        echo "# AgentGV Aliases" >> "$HOME/.bashrc"
        echo "$ALIAS_CMD" >> "$HOME/.bashrc"
        echo "alias agentgv-test='node $INSTALL_DIR/.opencode/test.js'" >> "$HOME/.bashrc"
        write_success "  已添加到 ~/.bashrc"
    fi
    
    # 添加到 zshrc
    if [ -w "$HOME/.zshrc" ] && ! grep -q "agentgv-status" "$HOME/.zshrc" 2>/dev/null; then
        echo "" >> "$HOME/.zshrc"
        echo "# AgentGV Aliases" >> "$HOME/.zshrc"
        echo "$ALIAS_CMD" >> "$HOME/.zshrc"
        echo "alias agentgv-test='node $INSTALL_DIR/.opencode/test.js'" >> "$HOME/.zshrc"
        write_success "  已添加到 ~/.zshrc"
    fi
    
    write_info "重新加载 shell 配置：source ~/.bashrc (或 ~/.zshrc)"
fi

# 运行系统检查
write_info "运行系统检查..."
if node "$INSTALL_DIR/.opencode/status.js"; then
    write_log "系统检查完成"
else
    write_warning "系统检查失败"
fi

# 创建 systemd 服务（仅 Linux）
if [[ "$OSTYPE" == "linux-gnu"* ]] && [ -d "/etc/systemd/system" ]; then
    write_info "创建 systemd 服务（可选）..."
    SERVICE_FILE="/etc/systemd/system/agentgv-monitor.service"
    
    cat > /tmp/agentgv-monitor.service << EOF
[Unit]
Description=AgentGV Monitor Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node $INSTALL_DIR/.opencode/status.js --watch
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    if sudo mv /tmp/agentgv-monitor.service "$SERVICE_FILE" 2>/dev/null; then
        sudo systemctl daemon-reload
        write_success "  systemd 服务已创建"
        write_info "  启用服务：sudo systemctl enable agentgv-monitor"
        write_info "  启动服务：sudo systemctl start agentgv-monitor"
    fi
fi

# 安装完成总结
echo ""
echo "═══════════════════════════════════════════════"
write_success "AgentGV v$AGENTGV_VERSION 安装完成！"
echo "═══════════════════════════════════════════════"
echo ""
write_info "快速开始："
echo "  1. 状态检查：node .opencode/status.js"
echo "  2. 运行测试：node .opencode/test.js"
echo "  3. 查看文档：docs/QUICKSTART.md"
echo ""
write_info "命令别名（重新加载 shell 后）："
echo "  • agentgv-status - 状态检查"
echo "  • agentgv-test   - 运行测试"
echo ""
write_info "后续步骤："
echo "  • 配置模型：.opencode/models.json"
echo "  • 添加 Skills：.opencode/skills/"
echo "  • 查看文档：docs/README.md"
echo ""
write_info "如遇问题："
echo "  • 查看日志：install.log"
echo "  • 运行诊断：node .opencode/status.js --verbose"
echo ""

write_log "安装完成"
exit 0
