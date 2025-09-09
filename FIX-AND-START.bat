@echo off
cls
echo ================================================
echo   SOLUCION COMPLETA NEXT.JS - ESENCIAL PACK
echo ================================================
echo.

echo [PASO 1] Deteniendo procesos anteriores...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [PASO 2] Limpiando cache de Next.js...
cd /d "C:\Esencial Pack\addons\addons\entregas-esencialpack"
if exist ".next" (
    rmdir /s /q .next
    echo    - Cache limpiado
)

echo.
echo [PASO 3] Ejecutando test de conectividad...
node test-connectivity.js

echo.
echo [PASO 4] Iniciando Next.js...
echo.
echo ================================================
echo   INICIANDO SERVIDOR EN http://localhost:3001
echo ================================================
echo.
echo URLs disponibles cuando este listo:
echo.
echo   1. TEST (sin auth):  http://localhost:3001/test
echo   2. LOGIN:           http://localhost:3001/login
echo   3. HOME (con auth): http://localhost:3001/
echo.
echo Credenciales de prueba:
echo   Phone: 53512345678
echo   PIN:   1234
echo.
echo Presiona Ctrl+C para detener el servidor
echo ================================================
echo.
npm run dev