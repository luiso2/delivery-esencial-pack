# Script de Deploy Automático
# Este script hace build y push directo a master sin pull requests

Write-Host "🚀 Iniciando deploy automático..." -ForegroundColor Green

# Verificar que estamos en master
$currentBranch = git branch --show-current
if ($currentBranch -ne "master") {
    Write-Host "⚠️  Cambiando a rama master..." -ForegroundColor Yellow
    git checkout master
}

# Hacer pull de los últimos cambios
Write-Host "📥 Obteniendo últimos cambios..." -ForegroundColor Cyan
git pull origin master

# Instalar dependencias si es necesario
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
    npm install
}

# Hacer build del proyecto
Write-Host "🔨 Construyendo proyecto..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso" -ForegroundColor Green
    
    # Agregar todos los cambios
    git add .
    
    # Hacer commit con timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Auto deploy: $timestamp"
    
    # Push directo a master
    Write-Host "🚀 Subiendo cambios a master..." -ForegroundColor Green
    git push origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deploy completado exitosamente!" -ForegroundColor Green
    } else {
        Write-Host "❌ Error al hacer push" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Error en el build" -ForegroundColor Red
}

Write-Host "\n📊 Estado final del repositorio:" -ForegroundColor Cyan
git status