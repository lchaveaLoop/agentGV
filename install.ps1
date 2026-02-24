#!/usr/bin/env pwsh
# AgentGV Cross-Platform Installation Script (Windows PowerShell)
# Usage: .\install.ps1 [-Quick] [-Verbose]

param(
    [switch]$Quick,
    [switch]$VerboseMode
)

# Configuration
$AGENTGV_VERSION = "4.3.2"
$REQUIRED_NODE_VERSION = "20.0.0"
$INSTALL_DIR = $PSScriptRoot

# Output functions
function Write-Info { Write-Host "INFO: $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "OK: $args" -ForegroundColor Green }
function Write-Warning { Write-Host "WARN: $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "ERROR: $args" -ForegroundColor Red }

# Logging
$LogFile = Join-Path $INSTALL_DIR "install.log"
function Write-Log {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $args" | Out-File -Append -FilePath $LogFile
}

Write-Info "AgentGV Installer v$AGENTGV_VERSION (Windows)"

# Detect Node.js
Write-Info "Checking Node.js..."
try {
    $NodeVersion = node --version
    if ($NodeVersion) {
        $NodeVersion = $NodeVersion.TrimStart("v")
        Write-Success "Node.js: $NodeVersion"
        
        $RequiredVersion = [version]$REQUIRED_NODE_VERSION
        $ActualVersion = [version]$NodeVersion
        if ($ActualVersion -lt $RequiredVersion) {
            Write-Warning "Node.js version too low (need >= $REQUIRED_NODE_VERSION)"
            if (-not $Quick) {
                $continue = Read-Host "Continue? (y/n)"
                if ($continue -ne "y") { exit 1 }
            }
        }
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Error "Node.js not found"
    Write-Error "Please install Node.js (>= $REQUIRED_NODE_VERSION): https://nodejs.org/"
    exit 1
}

# Check npm
Write-Info "Checking npm..."
try {
    $NpmVersion = npm --version
    Write-Success "npm: $NpmVersion"
} catch {
    Write-Warning "npm not found"
}

# Create directories
Write-Info "Creating directory structure..."
$Directories = @("logs", ".opencode/skills", "docs", "scripts")

foreach ($Dir in $Directories) {
    $Path = Join-Path $INSTALL_DIR $Dir
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Info "Created: $Dir"
    }
}
Write-Success "Directory structure ready"

# Check config files
Write-Info "Checking config files..."
$ConfigFiles = @(
    ".opencode/models.json",
    ".opencode/skills.json",
    "opencode.json"
)

foreach ($File in $ConfigFiles) {
    $Path = Join-Path $INSTALL_DIR $File
    if (Test-Path $Path) {
        Write-Success "Found: $File"
    } else {
        Write-Warning "Missing: $File"
    }
}

# Install dependencies
$PackageJson = Join-Path $INSTALL_DIR "package.json"
if (Test-Path $PackageJson) {
    Write-Info "Installing dependencies..."
    try {
        npm install --prefix $INSTALL_DIR
        Write-Success "Dependencies installed"
    } catch {
        Write-Warning "Dependency installation failed"
    }
}

# Test key scripts
Write-Info "Testing key scripts..."
$Scripts = @(
    ".opencode/status.js",
    ".opencode/skill-matcher.js",
    ".opencode/test.js"
)

$TestResults = @{ Pass = 0; Fail = 0 }
foreach ($Script in $Scripts) {
    $Path = Join-Path $INSTALL_DIR $Script
    if (Test-Path $Path) {
        try {
            node $Path --help 2>$null
            Write-Success "OK: $(Split-Path $Script -Leaf)"
            $TestResults.Pass++
        } catch {
            Write-Warning "Fail: $(Split-Path $Script -Leaf)"
            $TestResults.Fail++
        }
    } else {
        Write-Warning "Missing: $(Split-Path $Script -Leaf)"
        $TestResults.Fail++
    }
}

# Create shortcut (Windows only)
Write-Info "Creating desktop shortcut..."
try {
    $Desktop = [Environment]::GetFolderPath("Desktop")
    $WScript = New-Object -ComScripting WScript.Shell
    
    $ShortcutPath = Join-Path $Desktop "AgentGV Status.lnk"
    $Shortcut = $WScript.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = "node.exe"
    $Shortcut.Arguments = "$INSTALL_DIR\.opencode\status.js"
    $Shortcut.WorkingDirectory = $INSTALL_DIR
    $Shortcut.Description = "AgentGV System Status"
    $Shortcut.Save()
    Write-Success "Desktop shortcut created"
} catch {
    Write-Warning "Could not create shortcut"
}

# Run system check
Write-Info "Running system check..."
try {
    $StatusOutput = node (Join-Path $INSTALL_DIR ".opencode\status.js")
    Write-Host $StatusOutput
} catch {
    Write-Warning "System check failed"
}

# Summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Success "AgentGV v$AGENTGV_VERSION installed!"
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Info "Quick start:"
Write-Host "  1. Check status: node .opencode\status.js"
Write-Host "  2. Run tests: node .opencode\test.js"
Write-Host "  3. Read docs: docs\QUICKSTART.md"
Write-Host ""

exit 0
