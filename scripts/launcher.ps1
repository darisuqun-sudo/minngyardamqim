# launcher.ps1 - MinngYardamqim Smart Launcher & Server Controller
param(
    [switch]$NoBrowser = $false
)

$ErrorActionPreference = "SilentlyContinue"
$projectDir = "C:\Users\Administrator\OneDrive\Desktop\minngyardamqim"
Set-Location $projectDir

# Check if port 3000 is active
$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if (-not $conn) {
    if (-not (Test-Path "dist\server.cjs")) {
        Write-Host "سىستېما قۇرۇلما تەييارلاۋاتىدۇ (Building system)..." -ForegroundColor Yellow
        cmd.exe /c npm run build
    }

    Write-Host "مىڭ ياردەمچىم مۇلازىمېتىرى قوزغىتىلىۋاتىدۇ (Starting server)..." -ForegroundColor Cyan
    $nodePath = "C:\Program Files\nodejs\node.exe"
    if (-not (Test-Path $nodePath)) {
        $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
        if ($nodeCmd) { $nodePath = $nodeCmd.Source }
    }
    
    Start-Process -FilePath $nodePath -ArgumentList "dist\server.cjs" -WorkingDirectory $projectDir -WindowStyle Hidden

    $ready = $false
    for ($i = 0; $i -lt 20; $i++) {
        Start-Sleep -Milliseconds 500
        $checkConn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
        if ($checkConn) {
            $ready = $true
            break
        }
    }

    if ($ready) {
        Write-Host "مۇلازىمېتىر مۇۋەپپەقىيەتلىك قوزغالدى! (Server started successfully!)" -ForegroundColor Green
    } else {
        Write-Host "ئاگاھلاندۇرۇش: مۇلازىمېتىر قوزغىلىشقا ئازراق ۋاقىت كېتىۋاتىدۇ..." -ForegroundColor Yellow
    }
} else {
    Write-Host "مۇلازىمېتىر ئاللىقاچان نورمال ئىشلەۋاتىدۇ (Server is already running)." -ForegroundColor Green
}

if (-not $NoBrowser) {
    Write-Host "تور كۆرگۈچ ئېچىلىۋاتىدۇ: http://localhost:3000" -ForegroundColor Cyan
    Start-Process "http://localhost:3000"
}
