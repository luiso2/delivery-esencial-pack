@echo off
echo ========================================
echo  DIAGNOSTICO Y REPARACION DE NEXT.JS
echo ========================================
echo.

echo [1] Deteniendo todos los procesos Node.js...
taskkill /F /IM node.exe 2>nul
if %errorlevel%==0 (
    echo    - Procesos Node.js detenidos
) else (
    echo    - No habia procesos Node.js activos
)
timeout /t 2 /nobreak >nul

echo.
echo [2] Verificando estructura del proyecto...
if exist "src\app\test\page.tsx" (
    echo    - Pagina /test encontrada: OK
) else (
    echo    - ERROR: Pagina /test no encontrada
)

echo.
echo [3] Limpiando cache de Next.js...
if exist ".next" (
    rmdir /s /q .next 2>nul
    echo    - Cache .next eliminado
) else (
    echo    - No habia cache que limpiar
)

echo.
echo [4] Verificando package.json...
findstr /C:"next dev" package.json >nul
if %errorlevel%==0 (
    echo    - package.json configurado correctamente
) else (
    echo    - ERROR: package.json no tiene script dev
)

echo.
echo [5] Instalando dependencias por si acaso...
echo    - Ejecutando npm install...
call npm install --silent

echo.
echo [6] Iniciando servidor Next.js...
echo.
echo ========================================
echo  SERVIDOR INICIANDO EN PUERTO 3001
echo  Espera a ver "Ready in" antes de abrir
echo  
echo  URLs disponibles:
echo  - http://localhost:3001/test (sin auth)
echo  - http://localhost:3001/login
echo ========================================
echo.
npm run dev