@echo off
title CEK STATUS PIXEL LINEAGE STORAGE SERVICE
color 0B
cls
echo =========================================================================
echo    STATUS PIXEL LINEAGE STORAGE SERVICE (PORT 8080)
echo =========================================================================
echo.

powershell -Command "$conn = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue; if ($conn) { $proc = Get-Process -Id $conn.OwningProcess; Write-Host 'STATUS   : [ONLINE - AKTIF]' -ForegroundColor Green; Write-Host ('PID      : ' + $proc.Id); Write-Host ('RAM Usage: ' + [math]::Round($proc.WorkingSet64 / 1MB, 2) + ' MB'); } else { Write-Host 'STATUS   : [OFFLINE]' -ForegroundColor Red; }"

echo.
echo =========================================================================
echo    10 LOG AKTIVITAS TERAKHIR (logs\storage_service.log)
echo =========================================================================
if exist "logs\storage_service.log" (
    powershell -Command "Get-Content -Path 'logs\storage_service.log' -Tail 10"
) else (
    echo Belum ada catatan log.
)
echo =========================================================================
echo.
pause
