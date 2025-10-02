@echo off
echo.
echo 🔍 VERIFICANDO PUERTO 3000...
echo ================================

echo.
echo 1. Procesos usando puerto 3000:
netstat -ano | findstr :3000
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ❌ Puerto 3000 OCUPADO
    echo.
    echo 💡 SOLUCIONES:
    echo 1. Terminar proceso con: taskkill /PID [numero] /F
    echo 2. O usar puerto alternativo: npm run dev
) else (
    echo ✅ Puerto 3000 libre
)

echo.
echo 2. Procesos Node.js activos:
tasklist | findstr node.exe
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ⚠️  Hay procesos Node.js activos
    echo 💡 Para terminar todos: taskkill /f /im node.exe
) else (
    echo ✅ No hay procesos Node.js
)

echo.
echo 3. Puertos alternativos disponibles:
for %%p in (3001 3002 8080 8000) do (
    netstat -ano | findstr :%%p > nul
    if errorlevel 1 (
        echo ✅ Puerto %%p disponible
    ) else (
        echo ❌ Puerto %%p ocupado
    )
)

echo.
echo ================================
echo 🚀 COMANDOS PARA EJECUTAR:
echo ================================
echo npm run dev          ^(usa puerto 3001^)
echo npm run dev:3000     ^(forzar puerto 3000^)
echo npm run dev:8080     ^(usar puerto 8080^)
echo.
pause
