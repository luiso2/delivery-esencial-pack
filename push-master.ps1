# Script para Push Directo a Master
# Uso: .\push-master.ps1 "mensaje del commit"

param(
    [string]$mensaje = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "Push directo a master..." -ForegroundColor Green

# Verificar que estamos en master
$currentBranch = git branch --show-current
if ($currentBranch -ne "master") {
    Write-Host "Cambiando a rama master..." -ForegroundColor Yellow
    git checkout master
}

# Agregar todos los cambios
Write-Host "Agregando cambios..." -ForegroundColor Cyan
git add .

# Verificar si hay cambios para commit
$status = git status --porcelain
if ($status) {
    # Hacer commit
    Write-Host "Haciendo commit: $mensaje" -ForegroundColor Cyan
    git commit -m "$mensaje"
    
    # Push directo a master
    Write-Host "Subiendo a master..." -ForegroundColor Green
    git push origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push completado exitosamente!" -ForegroundColor Green
    } else {
        Write-Host "Error al hacer push" -ForegroundColor Red
    }
} else {
    Write-Host "No hay cambios para commit" -ForegroundColor Yellow
}

Write-Host "Estado del repositorio:" -ForegroundColor Cyan
git status