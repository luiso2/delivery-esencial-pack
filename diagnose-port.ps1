# Script para diagnosticar problemas de puerto
# Ejecutar en PowerShell: .\diagnose-port.ps1

Write-Host "🔍 DIAGNOSTICANDO PUERTO 3000..." -ForegroundColor Cyan
Write-Host "=" * 50

# Verificar qué proceso usa el puerto 3000
Write-Host "`n1. Verificando procesos en puerto 3000:"
try {
    $processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($processes) {
        foreach ($proc in $processes) {
            $processInfo = Get-Process -Id $proc.OwningProcess -ErrorAction SilentlyContinue
            Write-Host "   ❌ Puerto 3000 ocupado por: $($processInfo.ProcessName) (PID: $($proc.OwningProcess))" -ForegroundColor Red
        }
    } else {
        Write-Host "   ✅ Puerto 3000 libre" -ForegroundColor Green
    }
} catch {
    Write-Host "   ℹ️  No se puede verificar el puerto (puede estar libre)" -ForegroundColor Yellow
}

# Verificar otros puertos comunes
Write-Host "`n2. Verificando puertos alternativos:"
$alternativePorts = @(3001, 3002, 3003, 8080, 8000)
foreach ($port in $alternativePorts) {
    try {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            Write-Host "   ❌ Puerto $port ocupado" -ForegroundColor Red
        } else {
            Write-Host "   ✅ Puerto $port disponible" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ✅ Puerto $port disponible" -ForegroundColor Green
    }
}

# Verificar procesos Node.js
Write-Host "`n3. Verificando procesos Node.js activos:"
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    foreach ($proc in $nodeProcesses) {
        Write-Host "   🔄 Proceso Node.js activo: PID $($proc.Id)" -ForegroundColor Yellow
    }
    Write-Host "   ⚠️  Considera terminar procesos Node.js antiguos" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ No hay procesos Node.js activos" -ForegroundColor Green
}

# Verificar Next.js específicamente
Write-Host "`n4. Verificando procesos Next.js:"
$nextProcesses = Get-Process | Where-Object { $_.ProcessName -like "*next*" -or $_.MainWindowTitle -like "*Next.js*" }
if ($nextProcesses) {
    foreach ($proc in $nextProcesses) {
        Write-Host "   🔄 Proceso Next.js detectado: $($proc.ProcessName) (PID: $($proc.Id))" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ No hay procesos Next.js activos" -ForegroundColor Green
}

Write-Host "`n" + "=" * 50
Write-Host "📋 SOLUCIONES RECOMENDADAS:" -ForegroundColor Cyan

Write-Host "`n1. Si el puerto 3000 está ocupado:"
Write-Host "   - Terminar proceso: taskkill /PID [número] /F"
Write-Host "   - O usar puerto alternativo: npm run dev -- -p 3001"

Write-Host "`n2. Si hay procesos Node.js zombi:"
Write-Host "   - Terminar todos: taskkill /f /im node.exe"

Write-Host "`n3. Si persiste el problema:"
Write-Host "   - Reiniciar terminal como administrador"
Write-Host "   - Verificar antivirus/firewall"
Write-Host "   - Usar puerto diferente en package.json"

Write-Host "`n🚀 Script completado. Presiona Enter para continuar..."
Read-Host
