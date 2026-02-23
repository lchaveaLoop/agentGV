Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  AgentGV Agents Installer" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$target = "$env:USERPROFILE\.opencode\agents"
$source = "$PSScriptRoot\agents"
$configSource = "$PSScriptRoot\.opencode\agents"

# ============================================
# Model Detection - Find user's configured model
# ============================================
$configPath = "$env:USERPROFILE\.opencode\config.json"
$userModel = $null

# Check environment variable first
$envModel = $env:AGENTGV_MODEL
if ($envModel) {
    $userModel = $envModel
    Write-Host "[ENV] Model from environment: $userModel" -ForegroundColor Cyan
}
# Check user's config for model
elseif (Test-Path $configPath) {
    $userConfig = Get-Content $configPath -Raw | ConvertFrom-Json
    if ($userConfig.PSObject.Properties.Name -contains "model" -and $userConfig.model) {
        $userModel = $userConfig.model
        Write-Host "[CONFIG] Model from config: $userModel" -ForegroundColor Cyan
    }
}

# If no model found, prompt user
if (-not $userModel) {
    Write-Host ""
    Write-Host "No model configured. Available options:" -ForegroundColor Yellow
    Write-Host "  1. minimax/m2.5        - MiniMax M2.5 (Recommended)" -ForegroundColor White
    Write-Host "  2. minimax/m2.5-free  - MiniMax M2.5 Free" -ForegroundColor White
    Write-Host "  3. opencode/glm-5-free - GLM-5 Free (No API key needed)" -ForegroundColor White
    Write-Host "  4. opencode/qwen3-coder - Qwen3 Coder" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Select model (1-4) or press Enter for option 3 (free)"
    
    $modelMap = @{
        "1" = "minimax/m2.5"
        "2" = "minimax/m2.5-free"
        "3" = "opencode/glm-5-free"
        "4" = "opencode/qwen3-coder"
    }
    
    if ($modelMap.ContainsKey($choice)) {
        $userModel = $modelMap[$choice]
    } else {
        $userModel = "opencode/glm-5-free"  # Default to free
    }
    Write-Host "Selected: $userModel" -ForegroundColor Green
}

Write-Host ""

# ============================================
# Install Agent Definitions
# ============================================
if (-not (Test-Path $target)) {
    New-Item -ItemType Directory -Path $target -Force | Out-Null
}

Write-Host "Installing agent definitions..." -ForegroundColor Cyan
Get-ChildItem -Path $source -Directory -Filter "agentgv-*" | ForEach-Object {
    $dest = Join-Path $target $_.Name
    if (Test-Path $dest) { Remove-Item -Path $dest -Recurse -Force }
    Copy-Item -Path $_.FullName -Destination $target -Recurse
    Write-Host "  [OK] $($_.Name)" -ForegroundColor Green
}

# ============================================
# Update Agent Configs with selected model
# ============================================
Write-Host "Installing agent configurations..." -ForegroundColor Cyan
if (Test-Path $configSource) {
    Get-ChildItem -Path $configSource -Filter "*.md" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw -Encoding UTF8
        $newContent = $content -replace 'model: .*', "model: $userModel"
        $dest = Join-Path $target $_.Name
        [System.IO.File]::WriteAllText($dest, $newContent, [System.Text.UTF8Encoding]::new($false))
        Write-Host "  [OK] $($_.Name) -> $userModel" -ForegroundColor Green
    }
}

# ============================================
# Update OpenCode Config
# ============================================
$config = @{}
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
}

$config.agents.enabled = @(
    "agentgv-router",
    "agentgv-intelligence",
    "agentgv-planning",
    "agentgv-operations",
    "agentgv-quality",
    "agentgv-communications",
    "agentgv-administration"
)
$config.agent.default = "agentgv-router"

$config | ConvertTo-Json -Depth 10 | Set-Content $configPath

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Model: $userModel" -ForegroundColor White
Write-Host "All requests will be routed automatically" -ForegroundColor Gray
Write-Host ""
