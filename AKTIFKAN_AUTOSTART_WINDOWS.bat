@echo off
title AKTIFKAN AUTOSTART STORAGE SERVICE WINDOWS
color 0A
cls
echo =========================================================================
echo    MENDAFTARKAN PIXEL LINEAGE STORAGE SERVICE KE WINDOWS STARTUP
echo =========================================================================
echo.

set SCRIPT_DIR=%~dp0
set STARTUP_FILE=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\PixelLineageStorage.vbs

echo [1/3] Membuat script startup otomatis...
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.CurrentDirectory = "%SCRIPT_DIR%"
echo WshShell.Run "node server/local_db.js", 0, False
) > "%STARTUP_FILE%"

echo [2/3] Script berhasil didaftarkan di:
echo       "%STARTUP_FILE%"
echo.

echo [3/3] Memulai service di background sekarang...
wscript.exe "%STARTUP_FILE%"

ping -n 3 127.0.0.1 >nul

echo.
echo =========================================================================
echo [SUKSES] SERVICE SEKARANG BERJALAN OTOMATIS DI LATAR BELAKANG!
echo =========================================================================
echo - Setiap kali laptop boss menyala/login, server otomatis aktif tanpa pop-up.
echo - File Database : data\store_database.json
echo - File Log      : logs\storage_service.log
echo - Port Lokal    : http://localhost:8080
echo =========================================================================
echo.
pause
