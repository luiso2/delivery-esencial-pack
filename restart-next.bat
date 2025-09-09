@echo off
echo Deteniendo procesos Node.js...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Iniciando servidor Next.js en puerto 3001...
cd /d "C:\Esencial Pack\addons\addons\entregas-esencialpack"
npm run dev