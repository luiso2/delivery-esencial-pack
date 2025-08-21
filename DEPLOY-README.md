# 🚀 Scripts de Deploy Automático

Este proyecto incluye scripts para hacer deploy directo a master sin pull requests, dándote control absoluto sobre el proceso.

## 📁 Archivos Incluidos

### 1. `push-master.ps1` - Push Directo
Script para hacer commit y push directo a master.

**Uso:**
```powershell
# Push con mensaje automático (timestamp)
.\push-master.ps1

# Push con mensaje personalizado
.\push-master.ps1 "Mi mensaje de commit"
```

### 2. `deploy.ps1` - Deploy Completo
Script que hace build completo y deploy automático.

**Uso:**
```powershell
.\deploy.ps1
```

**Qué hace:**
- Cambia a rama master
- Hace pull de últimos cambios
- Instala dependencias si es necesario
- Ejecuta `npm run build`
- Hace commit y push automático

### 3. `.github/workflows/auto-deploy.yml` - GitHub Actions
Automatización completa que se ejecuta en cada push a master.

**Qué hace:**
- Build automático en cada push
- Deploy a GitHub Pages
- Actualiza rama `out-static-files`

## 🔧 Configuración Inicial

### 1. Habilitar GitHub Pages
1. Ve a Settings > Pages en tu repositorio
2. Selecciona "GitHub Actions" como source

### 2. Configurar Permisos
1. Ve a Settings > Actions > General
2. En "Workflow permissions" selecciona "Read and write permissions"

### 3. Desactivar Protección de Ramas (Opcional)
Para push directo sin restricciones:
1. Ve a Settings > Branches
2. Elimina las reglas de protección de master

## 🚀 Flujos de Trabajo

### Desarrollo Rápido
```powershell
# Hacer cambios en el código
# Luego:
.\push-master.ps1 "Descripción de cambios"
```

### Deploy de Producción
```powershell
# Para deploy completo con build:
.\deploy.ps1
```

### Automatización Total
Simplemente haz push a master y GitHub Actions se encarga del resto:
```bash
git add .
git commit -m "Mis cambios"
git push origin master
```

## ⚡ Comandos Rápidos

```powershell
# Solo código fuente
git push origin master

# Build y deploy manual
npm run build && .\push-master.ps1 "Update build"

# Deploy completo automatizado
.\deploy.ps1
```

## 📋 Notas Importantes

- ✅ **Control total**: No hay pull requests ni revisiones
- ✅ **Deploy inmediato**: Los cambios van directo a producción
- ⚠️ **Sin red de seguridad**: Asegúrate de probar antes de hacer push
- 🔄 **Automatización**: GitHub Actions maneja el build y deploy

## 🛠️ Solución de Problemas

### Error de archivo bloqueado
```powershell
# Si Git se bloquea:
taskkill /F /IM git.exe
del ".git\index.lock"
```

### Forzar push
```powershell
git push origin master --force
```

---

**¡Listo!** Ahora tienes control absoluto sobre tu deploy sin pull requests. 🎉