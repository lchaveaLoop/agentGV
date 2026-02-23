Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  AgentGV Agents Installer" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$target = "$env:USERPROFILE\.opencode\agents"
$source = "$PSScriptRoot\agents"
$configSource = "$PSScriptRoot\.opencode\agents"

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

Write-Host "Installing agent configurations..." -ForegroundColor Cyan
if (Test-Path $configSource) {
    Get-ChildItem -Path $configSource -Filter "*.md" | ForEach-Object {
        $dest = Join-Path $target $_.Name
        Copy-Item -Path $_.FullName -Destination $target -Force
        Write-Host "  [OK] $($_.Name)" -ForegroundColor Green
    }
} else {
    Write-Host "  [SKIP] No .opencode/agents folder found" -ForegroundColor Yellow
}

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
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "All requests will now be routed automatically" -ForegroundColor Gray
Write-Host ""
