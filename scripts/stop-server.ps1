# stop-server.ps1
$conns = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($conns) {
    foreach ($c in $conns) {
        $p = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
        if ($p) {
            Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
            Write-Host "مۇلازىمېتىر توختىتىلدى (PID: $($p.Id))" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "مۇلازىمېتىر ئىشلىمەيۋاتىدۇ (Server is not running)." -ForegroundColor Gray
}
