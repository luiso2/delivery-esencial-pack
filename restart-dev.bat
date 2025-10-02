@echo off
echo ==================================
echo Reiniciando Entregas App
echo ==================================

REM Cambiar al directorio del proyecto
cd /d "C:\odoo17\addons\entregas-esencialpack"

REM Limpiar cache de Next.js
echo.
echo Limpiando cache de Next.js...
if exist ".next" (
    rmdir /s /q ".next"
    echo Cache .next eliminado
)

REM Verificar instalacion de dependencias
echo.
echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

REM Iniciar el servidor de desarrollo
echo.
echo ==================================
echo Iniciando servidor de desarrollo...
echo ==================================
echo.
echo La aplicacion estara disponible en:
echo http://localhost:3001
echo.
echo Pagina de login:
echo http://localhost:3001/login
echo.
echo Presiona Ctrl+C para detener el servidor
echo ==================================
echo.

REM Iniciar el servidor
call npm run dev
