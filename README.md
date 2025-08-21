# 📦 Entregas Esencial Pack - Next.js Version

Sistema de gestión de entregas construido con Next.js 14, TypeScript y Tailwind CSS. Aplicación web responsive y mobile-first con API REST integrada.

🚀 **Sistema de deploy automático configurado** - Los cambios se despliegan automáticamente a la rama `out-static-files`.

## 🚀 Características

- ✅ **Aplicación Full-Stack** con Next.js 14 App Router
- ✅ **API REST** completa con endpoints para CRUD operations
- ✅ **Diseño Responsive** - Mobile-first con Tailwind CSS
- ✅ **TypeScript** - Type safety completo
- ✅ **Estado Global** con Zustand
- ✅ **Datos Mock** - Misma lógica de negocio que la app Ionic
- ✅ **Navegación Adaptativa** - Tab bar móvil, sidebar desktop
- ✅ **Optimizado para Performance** - Code splitting, lazy loading

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Git

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd nextjs-entregas
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
nextjs-entregas/
├── src/
│   ├── app/                    # App Router pages y API routes
│   │   ├── api/                # REST API endpoints
│   │   │   ├── orders/         # CRUD de pedidos
│   │   │   └── metrics/        # Métricas y estadísticas
│   │   ├── pedidos/            # Página de pedidos
│   │   ├── capturas/           # Página de capturas
│   │   ├── pagos/              # Página de pagos
│   │   ├── cuenta/             # Página de cuenta
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Homepage/Dashboard
│   ├── components/             # Componentes React
│   │   ├── layout/             # Navegación y layout
│   │   └── orders/             # Componentes de pedidos
│   ├── store/                  # Estado global (Zustand)
│   ├── types/                  # TypeScript types
│   ├── data/                   # Mock data
│   └── lib/                    # Utilidades
├── public/                     # Assets estáticos
└── package.json
```

## 🔌 API REST Endpoints

### Pedidos

- `GET /api/orders` - Listar pedidos con filtros
  - Query params: `status`, `type`, `search`, `delayed`, `page`, `limit`
- `GET /api/orders/:id` - Obtener pedido por ID
- `POST /api/orders` - Crear nuevo pedido
- `PUT /api/orders/:id` - Actualizar pedido
- `DELETE /api/orders/:id` - Eliminar pedido

### Métricas

- `GET /api/metrics` - Obtener métricas y estadísticas

## 📱 Páginas

### Dashboard (/)
- Resumen general con métricas
- Accesos rápidos a todas las secciones
- Alertas de pedidos urgentes

### Pedidos (/pedidos)
- Lista de todos los pedidos
- Filtros por estado, tipo, búsqueda
- Vista de métricas
- Cards con priorización visual

### Capturas (/capturas)
- Gestión de evidencias fotográficas
- Estados de captura
- Sincronización de imágenes

### Pagos (/pagos)
- Control de pagos pendientes y completados
- Resumen financiero

### Mi Cuenta (/cuenta)
- Perfil del conductor
- Configuración

## 🎨 Diseño y UX

### Responsive Design
- **Mobile (<768px)**: Tab bar inferior, cards verticales
- **Tablet (768-1024px)**: Grid de 2 columnas
- **Desktop (>1024px)**: Sidebar lateral, grid de 3 columnas

### Sistema de Colores
```css
- Primary: Purple (#7c3aed)
- Success: Green (#22c55e)
- Warning: Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Info: Blue (#3b82f6)
```

### Priorización Visual
- 🔴 **Urgent**: Pedidos fallidos o muy atrasados
- 🟡 **Warning**: Pedidos atrasados o incompletos
- 🟢 **Success**: Pedidos completados
- 🔵 **Normal**: Pedidos en tiempo

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## 📦 Build para Producción

```bash
# Build optimizado
npm run build

# Preview del build
npm run start

# Analizar bundle size
npm run analyze
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "entregas-app" -- start

# Save config
pm2 save
pm2 startup
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📊 Lógica de Negocio

### Estados de Pedido
- `pending` → `in_transit` → `delivered`
- `pending` → `failed`
- `in_transit` → `incomplete`

### Cálculo de Pagos
- Normal: 200-400 CUP
- Express: 350-500 CUP
- Penalización por fallo: 50%

### Priorización de Pedidos
1. Fallidos o >24h atrasados (Urgente)
2. Atrasados o incompletos (Advertencia)
3. En tiempo (Normal)
4. Completados (Éxito)

## 🔐 Seguridad

- Validación de inputs con TypeScript
- Sanitización de datos en API
- Headers de seguridad configurados
- CORS habilitado para producción

## 🎯 Optimizaciones

- **Code Splitting** automático con Next.js
- **Image Optimization** con next/image
- **API Routes** con edge runtime cuando es posible
- **Static Generation** para páginas estáticas
- **Incremental Static Regeneration** para datos dinámicos
- **Client-side caching** con React Query/SWR
- **Bundle optimization** con tree shaking

## 📝 Scripts Disponibles

```json
{
  "dev": "Iniciar servidor de desarrollo",
  "build": "Build para producción",
  "start": "Iniciar servidor de producción",
  "lint": "Ejecutar ESLint",
  "type-check": "Verificar tipos TypeScript"
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver archivo `LICENSE` para detalles

## 🆘 Soporte

Para reportar bugs o solicitar features, abrir un issue en GitHub.

---

Desarrollado con ❤️ para Entregas Esencial Pack