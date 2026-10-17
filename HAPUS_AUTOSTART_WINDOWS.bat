@echo off
title HAPUS AUTOSTART WINDOWS
color 0E
cls
echo =========================================================================
echo    MENGHAPUS AUTOSTART STORAGE SERVICE DARI WINDOWS
echo =========================================================================
echo.

set STARTUP_FILE=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\PixelLineageStorage.vbs

if exist "%STARTUP_FILE%" (
    del "%STARTUP_FILE%"
    echo [SUKSES] Script startup "%STARTUP_FILE%" berhasil dihapus.
    echo Service tidak akan lagi berjalan otomatis saat Windows menyala.
) else (
    echo [INFO] Script startup tidak ditemukan di folder Startup Windows.
)

echo.
call HENTIKAN_STORAGE_SERVICE.bat
