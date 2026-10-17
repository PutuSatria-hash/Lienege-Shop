@echo off
title HENTIKAN STORAGE SERVICE
color 0C
cls
echo =========================================================================
echo    MENGHENTIKAN PIXEL LINEAGE STORAGE SERVICE
echo =========================================================================
echo.

powershell -Command "$p = (Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue).OwningProcess; if ($p) { Stop-Process -Id $p -Force; Write-Host '[SUKSES] Process PID ' $p ' berhasil dihentikan.' -ForegroundColor Green; } else { Write-Host '[INFO] Service tidak sedang berjalan pada port 8080.' -ForegroundColor Yellow; }"

echo.
echo Selesai.
pause
