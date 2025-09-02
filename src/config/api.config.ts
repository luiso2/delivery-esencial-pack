/**
 * Configuración de la API de Odoo
 * Módulo: woocommerce_delivery_cuba
 * Actualizado: 01/09/2025
 */

// Configuración de desarrollo y producción
const config = {
  development: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:8069',
    database: process.env.NEXT_PUBLIC_ODOO_DB || 'odoo',
    timeout: 30000,
  },
  production: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:8069',
    database: process.env.NEXT_PUBLIC_ODOO_DB || 'odoo',
    timeout: 30000,
  }
};

// Seleccionar configuración según el entorno
const environment = process.env.NODE_ENV || 'development';
export const apiConfig = config[environment as keyof typeof config];

// Endpoints disponibles en el módulo woocommerce_delivery_cuba
export const API_ENDPOINTS = {
  // Autenticación - Múltiples endpoints disponibles
  LOGIN: '/api/delivery/login',           // Principal
  LOGIN_V1: '/api/v1/carrier/login',     // Para Next.js
  LOGIN_V2: '/api/v2/delivery/login',    // Versión 2
  LOGIN_SIMPLE: '/api/delivery/login_simple', // Debug
  LOGOUT: '/api/delivery/logout',
  
  // Órdenes/Pedidos
  ORDERS: '/api/delivery/orders',
  ORDER_DETAIL: (id: string) => `/api/delivery/orders/${id}`,
  UPDATE_ORDER: (id: string) => `/api/delivery/orders/${id}/update`,
  UPDATE_STATUS: '/api/delivery/status/update',
  
  // Capturas/Evidencias - Confirmación de entregas
  CAPTURES: '/api/delivery/captures',
  CAPTURE_UPLOAD: '/api/delivery/capture/upload',
  GET_CAPTURES: '/api/delivery/captures',
  
  // Rutas
  ROUTES: '/api/delivery/routes',
  ROUTE_OPTIMIZE: '/api/delivery/route/optimize',
  
  // Métricas
  METRICS: '/api/delivery/metrics',
  
  // Ubicación
  UPDATE_LOCATION: '/api/delivery/location/update',
  
  // Incidencias
  REPORT_INCIDENT: '/api/delivery/incident/report',
  GET_INCIDENTS: '/api/delivery/incidents',
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Estados de pedidos en Odoo
export const ODOO_ORDER_STATES = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  DELIVERED: 'delivered',
  PARTIAL: 'partial',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Estados de captura
export const CAPTURE_STATES = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

// Tipos de evidencia para confirmación de entrega
export const EVIDENCE_TYPES = {
  SIGNATURE: 'signature',           // Firma digital
  DELIVERY: 'delivery',             // Foto de entrega
  DOCUMENT: 'document',             // Foto del albarán
  INCIDENT: 'incident',             // Foto de incidencia
} as const;

// Configuración de transportista de prueba
export const TEST_CARRIER = {
  phone: '53512345678',
  pin: '1234',
  name: 'Transportista Test Automático',
  code: 'TEST001',
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  CONNECTION_ERROR: 'No se pudo conectar con el servidor',
  INVALID_CREDENTIALS: 'Teléfono o PIN incorrecto',
  SERVER_ERROR: 'Error del servidor',
  TIMEOUT: 'La petición tardó demasiado',
  UNAUTHORIZED: 'No autorizado',
};
