@echo off
echo ============================================================
echo   SOLUCION RAPIDA - LOGIN NEXT.JS
echo ============================================================
echo.

echo [1] Instalando dependencia xmlrpc...
cd /d "C:\Esencial Pack\addons\addons\entregas-esencialpack"
call npm install xmlrpc --save

echo.
echo [2] Verificando instalacion...
if exist node_modules\xmlrpc (
    echo [OK] xmlrpc instalado correctamente
) else (
    echo [ERROR] No se pudo instalar xmlrpc
    pause
    exit /b 1
)

echo.
echo [3] Reiniciando servidor Next.js...
echo.
echo IMPORTANTE: Cierra el servidor actual (Ctrl+C) y ejecuta:
echo.
echo   npm run dev
echo.
echo ============================================================
echo   CREDENCIALES DE PRUEBA
echo ============================================================
echo Telefono: 53512345678
echo PIN: 1234
echo ============================================================
echo.
echo Una vez reiniciado, abre: http://localhost:3001
echo.
pause
