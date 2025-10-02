@echo off
echo ============================================================
echo   REINICIANDO APP NEXT.JS - ENTREGAS ESENCIAL PACK
echo ============================================================
echo.
echo Los cambios realizados:
echo - El sidebar NO se muestra en la pagina de login
echo - Solo usuarios autenticados ven el sidebar
echo - Middleware protege las rutas privadas
echo.
echo Presiona Ctrl+C para detener el servidor actual
echo Luego presiona cualquier tecla para reiniciar...
echo.
pause

cd /d "C:\Esencial Pack\addons\addons\entregas-esencialpack"

echo.
echo Iniciando servidor de desarrollo...
call npm run dev

pause
