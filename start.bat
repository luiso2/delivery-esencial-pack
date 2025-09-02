@echo off
title Entregas Esencial Pack - Launcher
color 0A

echo ========================================
echo    ENTREGAS ESENCIAL PACK - LAUNCHER
echo ========================================
echo.
echo Configuracion actual:
echo - Odoo URL: http://localhost:8069
echo - Database: odoo
echo - App URL: http://localhost:3000
echo.
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Node.js no esta instalado
    echo     Por favor instalar Node.js desde https://nodejs.org
    pause
    exit /b 1
) else (
    echo [OK] Node.js instalado
)

echo.
echo [2/4] Instalando dependencias...
call npm install --silent
if %errorlevel% neq 0 (
    echo [X] Error instalando dependencias
    pause
    exit /b 1
) else (
    echo [OK] Dependencias instaladas
)

echo.
echo [3/4] Verificando conexion con Odoo...
echo      Esperando respuesta...
timeout /t 2 /nobreak >nul

echo.
echo [4/4] Iniciando aplicacion Next.js...
echo.
echo ========================================
echo    CREDENCIALES DE PRUEBA
echo ========================================
echo Telefono: 53512345678
echo PIN: 1234
echo ========================================
echo.
echo La aplicacion se abrira en: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

call npm run dev
