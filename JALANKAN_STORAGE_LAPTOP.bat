@echo off
title PIXEL LINEAGE - LOCAL LAPTOP STORAGE SERVER
color 0A
cls
echo =========================================================================
echo    PIXEL LINEAGE * LOCAL LAPTOP DATABASE SERVER
echo    Penyimpanan Fisik: data\store_database.json
echo =========================================================================
echo.
echo Sedang memulai server penyimpanan laptop pada port 8080...
echo.
node server/local_db.js
pause
