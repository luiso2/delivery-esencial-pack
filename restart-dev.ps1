# Script para reiniciar el servidor de desarrollo de Next.js con limpieza de caché
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Reiniciando Entregas App" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Detener cualquier proceso de Node.js en el puerto 3001
Write-Host "`nDeteniendo procesos en puerto 3001..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
if ($processes) {
    $processes | ForEach-Object {
        $pid = $_.OwningProcess
        if ($pid -ne 0) {
            Write-Host "Deteniendo proceso PID: $pid" -ForegroundColor Red
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

# Cambiar al directorio del proyecto
Set-Location "C:\odoo17\addons\entregas-esencialpack"

# Limpiar caché de Next.js
Write-Host "`nLimpiando caché de Next.js..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "Caché .next eliminado" -ForegroundColor Green
}

# Verificar instalación de dependencias
Write-Host "`nVerificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Iniciar el servidor de desarrollo
Write-Host "`n==================================" -ForegroundColor Green
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host "`nLa aplicación estará disponible en:" -ForegroundColor Cyan
Write-Host "http://localhost:3001" -ForegroundColor White
Write-Host "`nPágina de login:" -ForegroundColor Cyan
Write-Host "http://localhost:3001/login" -ForegroundColor White
Write-Host "`nPresiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Green

# Iniciar el servidor
npm run dev
