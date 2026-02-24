#!/usr/bin/env pwsh

<#
.SYNOPSIS
    OpenCode Model Detector for PowerShell
    Detects the current model configured in OpenCode Desktop/CLI

.DESCRIPTION
    This script detects the currently configured model in OpenCode
    and can watch for model changes in real-time.

.EXAMPLE
    .\detect-model.ps1                    - Detect current model
    .\detect-model.ps1 -Watch             - Watch for changes
    .\detect-model.ps1 -Json              - Output as JSON
    .\detect-model.ps1 -Check "model" "time"
#>

param(
    [switch]$Watch,
    [switch]$Json,
    [switch]$Help,
    [string]$Check,
    [string]$LastTime
)

$CONFIG_PATH = "$env:USERPROFILE\.opencode\config.json"
if (-not $CONFIG_PATH) {
    $CONFIG_PATH = "$env:HOME\.opencode\config.json"
}

$VISION_MODELS = @(
    'qwen3.5-plus',
    'bailian-coding-plan/qwen3.5-plus'
)

function Get-CurrentModel {
    try {
        if (-not (Test-Path $CONFIG_PATH)) {
            return @{
                detected = $false
                model = $null
                reason = 'Config file not found'
                path = $CONFIG_PATH
            }
        }

        $config = Get-Content $CONFIG_PATH -Raw | ConvertFrom-Json
        $detectedModel = $null
        $modelSource = 'unknown'

        # Priority 1: Global default
        if ($config.model) {
            $detectedModel = $config.model
            $modelSource = 'global default'
        }

        # Priority 2: Current agent
        $currentAgent = $env:OPENCODE_AGENT
        if ($currentAgent -and $config.$currentAgent?.model) {
            $detectedModel = $config.$currentAgent.model
            $modelSource = "agent config ($currentAgent)"
        }

        # Priority 3: Router model
        if ($config.'agentgv-router'?.model) {
            $detectedModel = $config.'agentgv-router'.model
            $modelSource = 'router config'
        }

        if (-not $detectedModel) {
            return @{
                detected = $false
                model = $null
                reason = 'No model configured'
                path = $CONFIG_PATH
                availableAgents = ($config.PSObject.Properties.Name | Where-Object { $_ -like 'agentgv-*' })
            }
        }

        $normalizedModel = $detectedModel
        $isVisionCapable = $VISION_MODELS -contains $detectedModel
        $lastModified = (Get-Item $CONFIG_PATH).LastWriteTimeUtc.ToString('o')

        return @{
            detected = $true
            model = $detectedModel
            normalizedModel = $normalizedModel
            source = $modelSource
            path = $CONFIG_PATH
            isVisionCapable = $isVisionCapable
            lastModified = $lastModified
        }

    } catch {
        return @{
            detected = $false
            model = $null
            reason = "Error: $($_.Exception.Message)"
            path = $CONFIG_PATH
        }
    }
}

function Show-ModelInfo($result) {
    if ($result.detected) {
        Write-Host ""
        Write-Host "✅ Model detected:" -ForegroundColor Green
        Write-Host "   Model:       $($result.model)" -ForegroundColor Cyan
        Write-Host "   Normalized:  $($result.normalizedModel)" -ForegroundColor Gray
        Write-Host "   Source:      $($result.source)" -ForegroundColor Gray
        Write-Host "   Vision:      $(if ($result.isVisionCapable) { '✅ Yes' } else { '❌ No' })" -ForegroundColor $(if ($result.isVisionCapable) { 'Green' } else { 'Yellow' })
        Write-Host "   Last Update: $($result.lastModified)" -ForegroundColor Gray
        Write-Host "   Config Path: $($result.path)" -ForegroundColor DarkGray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Model detection failed:" -ForegroundColor Red
        Write-Host "   Reason: $($result.reason)" -ForegroundColor Yellow
        Write-Host "   Path:   $($result.path)" -ForegroundColor DarkGray
        Write-Host ""
    }
}

# Help
if ($Help) {
    Get-Help $PSCommandPath
    exit 0
}

# Watch mode
if ($Watch) {
    Write-Host "👁️  Watching for model changes... (Ctrl+C to stop)" -ForegroundColor Cyan
    Write-Host ""
    
    $lastModel = $null
    $lastTime = $null
    
    while ($true) {
        $result = Get-CurrentModel
        
        $changed = $false
        if ($result.detected) {
            $changed = ($result.model -ne $lastModel) -or 
                       ($lastTime -and $result.lastModified -gt $lastTime)
        }
        
        if ($changed -and $lastModel) {
            Write-Host ""
            Write-Host "🔄 Model changed detected!" -ForegroundColor Yellow
            Write-Host "   Previous: $lastModel" -ForegroundColor Gray
            Write-Host "   Current:  $($result.model)" -ForegroundColor Cyan
            Write-Host "   Source:   $($result.source)" -ForegroundColor Gray
            Write-Host "   Time:     $(Get-Date -Format 'o')" -ForegroundColor DarkGray
            Write-Host ""
        } elseif ($result.detected) {
            Write-Host "📊 Current: $($result.model) ($($result.source))" -ForegroundColor DarkGray
        }
        
        $lastModel = $result.model
        $lastTime = $result.lastModified
        
        Start-Sleep -Seconds 2
    }
}

# JSON output
if ($Json) {
    $result = Get-CurrentModel
    $result | ConvertTo-Json -Depth 10
    exit $(if ($result.detected) { 0 } else { 1 })
}

# Check mode
if ($Check) {
    $result = Get-CurrentModel
    $changed = $result.model -ne $Check
    
    [PSCustomObject]@{
        changed = $changed
        reason = if ($changed) { 'Model changed' } else { 'No change' }
        current = $result
        previous = $Check
    } | ConvertTo-Json
    
    exit $(if ($changed) { 0 } else { 1 })
}

# Default mode
$result = Get-CurrentModel
Show-ModelInfo $result
exit $(if ($result.detected) { 0 } else { 1 })
