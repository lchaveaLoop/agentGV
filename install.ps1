Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  AgentGV Agents Installer" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$target = "$env:USERPROFILE\.opencode\agents"
$source = "$PSScriptRoot\agents"
$configSource = "$PSScriptRoot\.opencode\agents"

# ============================================
# Model Detection Logic
# ============================================
$defaultModel = "opencode/glm-5-free"

# Priority 1: Environment variable AGENTGV_MODEL
$envModel = $env:AGENTGV_MODEL
if ($envModel) {
    $selectedModel = $envModel
    Write-Host "[ENV] Using model from environment: $selectedModel" -ForegroundColor Cyan
}
# Priority 2: User config model
else {
    $configPath = "$env:USERPROFILE\.opencode\config.json"
    if (Test-Path $configPath) {
        $userConfig = Get-Content $configPath -Raw | ConvertFrom-Json
        if ($userConfig.PSObject.Properties.Name -contains "model" -and $userConfig.model) {
            $selectedModel = $userConfig.model
            Write-Host "[CONFIG] Using model from config: $selectedModel" -ForegroundColor Cyan
        }
    }
}

# Priority 3: Default free model
if (-not $selectedModel) {
    $selectedModel = $defaultModel
    Write-Host "[DEFAULT] Using free model: $selectedModel" -ForegroundColor Cyan
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
# Install and Update Agent Configs (replace model)
# ============================================
Write-Host "Installing agent configurations..." -ForegroundColor Cyan
if (Test-Path $configSource) {
    Get-ChildItem -Path $configSource -Filter "*.md" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw -Encoding UTF8
        $newContent = $content -replace 'model: .*', "model: $selectedModel"
        $dest = Join-Path $target $_.Name
        [System.IO.File]::WriteAllText($dest, $newContent, [System.Text.UTF8Encoding]::new($false))
        Write-Host "  [OK] $($_.Name) -> $selectedModel" -ForegroundColor Green
    }
} else {
    Write-Host "  [SKIP] No .opencode/agents folder found" -ForegroundColor Yellow
}

# ============================================
# Update OpenCode Config
# ============================================
$configPath = "$env:USERPROFILE\.opencode\config.json"
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
Write-Host "Config updated: agentgv-router set as default" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Model: $selectedModel" -ForegroundColor White
Write-Host "All requests will be routed automatically" -ForegroundColor Gray
Write-Host ""
Write-Host "To change model, run:" -ForegroundColor Yellow
Write-Host '  $env:AGENTGV_MODEL = "minimax/m2.5"' -ForegroundColor White
Write-Host "  .\install.ps1" -ForegroundColor White
Write-Host ""
