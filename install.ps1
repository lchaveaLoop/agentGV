Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  AgentGV Agents Installer" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$target = "$env:USERPROFILE\.opencode\agents"
$source = "$PSScriptRoot\agents"

if (-not (Test-Path $target)) {
    New-Item -ItemType Directory -Path $target -Force | Out-Null
}

Write-Host "Installing agents..." -ForegroundColor Cyan
Get-ChildItem -Path $source -Directory -Filter "agentgv-*" | ForEach-Object {
    $dest = Join-Path $target $_.Name
    if (Test-Path $dest) { Remove-Item -Path $dest -Recurse -Force }
    Copy-Item -Path $_.FullName -Destination $target -Recurse
    Write-Host "  ✓ $($_.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Edit ~/.opencode/config.json to enable agents" -ForegroundColor Gray
Write-Host ""
