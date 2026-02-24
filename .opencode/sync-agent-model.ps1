# AgentGV Model Sync for OpenCode Desktop
# 
# This script syncs AgentGV agent models with the current OpenCode Desktop model.
# Run this after switching models in OpenCode Desktop UI.
#
# Usage:
#   .\sync-agent-model.ps1
#   .\sync-agent-model.ps1 -Model "bailian-coding-plan/qwen3.5-plus"
#   .\sync-agent-model.ps1 -Show

param(
    [string]$Model,
    [switch]$Show,
    [switch]$Help
)

$CONFIG_PATH = "$env:USERPROFILE\.opencode\config.json"
$AGENTS = @(
    "agentgv-router",
    "agentgv-planning",
    "agentgv-operations",
    "agentgv-quality",
    "agentgv-communications",
    "agentgv-administration"
)

$MODELS = @{
    "1" = "bailian-coding-plan/qwen3.5-plus"
    "2" = "bailian-coding-plan/qwen3-max-2026-01-23"
    "3" = "bailian-coding-plan/qwen3-coder-plus"
    "4" = "bailian-coding-plan/qwen3-coder-next"
    "5" = "minimax/m2.5"
    "6" = "opencode/glm-5-free"
}

function Get-Config {
    if (Test-Path $CONFIG_PATH) {
        return Get-Content $CONFIG_PATH -Raw | ConvertFrom-Json
    }
    return @{ agent = @{}; agents = @{} }
}

function Save-Config($config) {
    $config | ConvertTo-Json -Depth 10 | Set-Content $CONFIG_PATH
}

function Show-Models {
    Write-Host ""
    Write-Host "📋 Current Agent Models:" -ForegroundColor Cyan
    Write-Host ""
    
    $config = Get-Config
    
    foreach ($agent in $AGENTS) {
        $model = if ($config.$agent.model) { $config.$agent.model } else { "(default)" }
        Write-Host "  $($agent.PadRight(30)) $model" -ForegroundColor Gray
    }
    Write-Host ""
}

function Set-Model($modelId, $agentName = $null) {
    $config = Get-Config
    
    if ($agentName) {
        if (-not $config.$agentName) {
            $config.$agentName = [PSCustomObject]@{}
        }
        $config.$agentName.model = $modelId
        Write-Host "✅ $agentName -> $modelId" -ForegroundColor Green
    } else {
        $count = 0
        foreach ($agent in $AGENTS) {
            if ($config.$agent) {
                $config.$agent.model = $modelId
                $count++
            }
        }
        Write-Host "✅ Updated $count agents to: $modelId" -ForegroundColor Green
    }
    
    Save-Config $config
}

function Show-Menu {
    Write-Host ""
    Write-Host "🎯 AgentGV Model Switcher" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available models:" -ForegroundColor White
    Write-Host "  1. bailian-coding-plan/qwen3.5-plus (推荐，支持视觉)" -ForegroundColor White
    Write-Host "  2. bailian-coding-plan/qwen3-max-2026-01-23 (最强)" -ForegroundColor White
    Write-Host "  3. bailian-coding-plan/qwen3-coder-plus (代码)" -ForegroundColor White
    Write-Host "  4. bailian-coding-plan/qwen3-coder-next (快速)" -ForegroundColor White
    Write-Host "  5. minimax/m2.5" -ForegroundColor White
    Write-Host "  6. opencode/glm-5-free (免费)" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  <1-6>     - Set all agents" -ForegroundColor Gray
    Write-Host "  show      - Show current models" -ForegroundColor Gray
    Write-Host "  q         - Quit" -ForegroundColor Gray
    Write-Host ""
}

# Help
if ($Help) {
    Write-Host "Usage:"
    Write-Host "  .\sync-agent-model.ps1              - Interactive mode"
    Write-Host "  .\sync-agent-model.ps1 -Model <id>  - Set all agents"
    Write-Host "  .\sync-agent-model.ps1 -Show        - Show current models"
    Write-Host ""
    exit 0
}

# Show
if ($Show) {
    Show-Models
    exit 0
}

# Set specific model
if ($Model) {
    Set-Model $Model
    exit 0
}

# Interactive mode
Show-Menu
Show-Models

while ($true) {
    $choice = Read-Host ">"
    
    if ($choice -eq "q" -or $choice -eq "quit" -or $choice -eq "exit") {
        break
    }
    
    if ($choice -eq "show") {
        Show-Models
        continue
    }
    
    if ($MODELS.ContainsKey($choice)) {
        Set-Model $MODELS[$choice]
    } else {
        Write-Host "❌ Invalid command" -ForegroundColor Red
    }
}
