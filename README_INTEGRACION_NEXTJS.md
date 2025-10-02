# Sistema de Entregas - Next.js + Odoo 17

## 📋 Descripción
Aplicación web para transportistas que se integra con Odoo 17 usando XML-RPC. Permite a los transportistas autenticarse y gestionar sus entregas.

## 🚀 Características Implementadas

### ✅ Autenticación con XML-RPC
- Login con teléfono y PIN
- Autenticación a través de API Route de Next.js
- Bypass de limitaciones de permisos de Odoo usando admin
- Generación y gestión de tokens
- Persistencia de sesión con localStorage y cookies

### 🔒 Seguridad
- Middleware para protección de rutas
- Verificación de tokens
- Manejo seguro de credenciales

### 📱 Interfaz de Usuario
- Diseño responsive con Tailwind CSS
- Página de login con datos de prueba precargados
- Dashboard de pedidos
- Navegación protegida

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Odoo 17 con módulo `woocommerce_delivery_cuba`
- **Comunicación**: XML-RPC a través de API Routes
- **Autenticación**: Tokens personalizados

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- Odoo 17 corriendo en Docker
- Módulo `woocommerce_delivery_cuba` instalado y actualizado

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
cd "D:\Claude projects2\entregas-esencial-pack\nextjs-entregas"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
El archivo `.env.local` ya está configurado:
```env
ODOO_URL=http://localhost:8069
ODOO_DB=odoo17
ODOO_USER=admin
ODOO_PASSWORD=admin
```

4. **Verificar conexión con Odoo**
```bash
node scripts/test-odoo-connection.js
```

5. **Iniciar la aplicación**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🧪 Datos de Prueba

### Transportista de Prueba Principal
- **Nombre**: Pedro Delivery
- **ID**: 50
- **Teléfono**: `53512345678`
- **PIN**: `1234`
- **Tipo de vehículo**: car
- **Campo `is_delivery_carrier`**: true

### Opciones de Login en la Interfaz
1. **Login Manual**: Ingresar teléfono y PIN manualmente
2. **Cargar Datos**: Botón para precargar los datos de Pedro
3. **Login Automático**: Login directo con datos de Pedro
4. **Datos Legacy**: Para compatibilidad con versión anterior

## 🏗️ Arquitectura

### Flujo de Autenticación
1. Usuario ingresa teléfono y PIN en el frontend
2. Frontend envía datos al API Route `/api/auth/carrier-login`
3. API Route se autentica como admin en Odoo vía XML-RPC
4. Busca transportista por teléfono con `is_delivery_carrier=true`
5. Verifica el PIN
6. Genera token y lo guarda en Odoo (campos `x_auth_token` y `x_token_expiry`)
7. Retorna token y datos del transportista al frontend
8. Frontend guarda token en localStorage y cookies
9. Middleware protege rutas verificando el token

### Estructura del Proyecto
```
src/
├── app/                    # App Router de Next.js
│   ├── api/               
│   │   └── auth/
│   │       └── carrier-login/   # API Route para autenticación XML-RPC
│   ├── login/             # Página de login
│   ├── pedidos/           # Dashboard de pedidos
│   └── ...
├── services/
│   ├── authService.ts     # Servicio de autenticación
│   └── odooApiClient.ts   # Cliente para comunicación con Odoo
├── hooks/
│   └── useAuth.ts         # Hook para gestión de autenticación
└── middleware.ts          # Middleware de protección de rutas
```

## 🔍 Debugging y Troubleshooting

### Verificar que Odoo esté corriendo
```bash
docker ps
# Debe mostrar el contenedor de Odoo en puerto 8069
```

### Verificar el transportista en Odoo
1. Acceder a Odoo: http://localhost:8069
2. Login: admin/admin
3. Ir a Contactos
4. Buscar "Pedro Delivery"
5. Verificar campos:
   - `is_delivery_carrier`: ✓
   - `carrier_phone`: 53512345678
   - `carrier_pin`: 1234

### Logs de la aplicación
Los logs están disponibles en:
- **Consola del navegador**: Para errores del frontend
- **Terminal de Next.js**: Para logs del servidor y API Routes
- **Network tab**: Para ver las llamadas a la API

### Errores Comunes

#### "ECONNREFUSED" al hacer login
- **Causa**: Odoo no está corriendo o está en otro puerto
- **Solución**: Verificar que Odoo esté en http://localhost:8069

#### "Teléfono no registrado"
- **Causa**: El transportista no existe o no tiene `is_delivery_carrier=true`
- **Solución**: Verificar en Odoo que el transportista existe y tiene el campo activado

#### "PIN incorrecto"
- **Causa**: El PIN no coincide con el guardado en Odoo
- **Solución**: Verificar el campo `carrier_pin` en Odoo

#### Token no persiste al recargar
- **Causa**: Problemas con cookies o localStorage
- **Solución**: Verificar que las cookies no estén bloqueadas en el navegador

## 🔄 Modo de Desarrollo con Fallback

Si Odoo no está disponible, la aplicación tiene un modo fallback que permite:
- Login simulado con datos de Pedro Delivery
- Navegación básica por la interfaz
- Útil para desarrollo de UI sin Odoo

## 📚 Recursos Adicionales

### Documentación Relevante
- [Next.js App Router](https://nextjs.org/docs/app)
- [Odoo XML-RPC](https://www.odoo.com/documentation/17.0/developer/reference/external_api.html)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Scripts Útiles
- `npm run dev` - Iniciar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Iniciar servidor de producción
- `node scripts/test-odoo-connection.js` - Probar conexión con Odoo

## 🚦 Estado del Proyecto

### ✅ Completado
- [x] Autenticación XML-RPC funcional
- [x] API Route para carrier-login
- [x] Página de login con UI moderna
- [x] Middleware de protección de rutas
- [x] Persistencia de sesión
- [x] Manejo de errores
- [x] Modo fallback para desarrollo

### 🔄 En Progreso
- [ ] Gestión completa de pedidos
- [ ] Sistema de capturas/evidencias
- [ ] Optimización de rutas
- [ ] Métricas y reportes

### 📅 Pendiente
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Documentación de API
- [ ] Deploy a producción

## 📞 Soporte

Para problemas o preguntas:
1. Revisar esta documentación
2. Verificar los logs de la aplicación
3. Ejecutar el script de prueba de conexión
4. Revisar la configuración de Odoo

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Módulo Odoo**: woocommerce_delivery_cuba v17.0.1.2.0
