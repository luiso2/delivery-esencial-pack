#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de actualización para hacer compatible el proyecto Next.js con Odoo 17
Actualiza archivos de configuración para usar el puerto correcto (30017)
"""

import os
import json
import re

def update_env_file():
    """Actualizar archivo .env.local"""
    env_path = r"D:\Claude projects2\entregas-esencial-pack\nextjs-entregas\.env.local"
    
    new_content = """# Configuración de Odoo - ACTUALIZADO PARA COMPATIBILIDAD
NEXT_PUBLIC_ODOO_URL=http://localhost:30017
NEXT_PUBLIC_ODOO_DB=odoo17_db
ODOO_URL=http://localhost:30017
ODOO_DB=odoo17_db
ODOO_USER=admin
ODOO_PASSWORD=admin123

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=Entregas Esencial Pack
NEXT_PUBLIC_APP_VERSION=1.0.0

# Entorno (development | production)
NODE_ENV=development

# Puerto de la aplicación
PORT=3000
"""
    
    # Backup del archivo original
    if os.path.exists(env_path):
        with open(env_path + '.backup', 'w') as f:
            with open(env_path, 'r') as original:
                f.write(original.read())
        print(f"[OK] Backup creado: {env_path}.backup")
    
    # Escribir nuevo contenido
    with open(env_path, 'w') as f:
        f.write(new_content)
    print(f"[OK] Actualizado: {env_path}")

def update_api_config():
    """Actualizar src/config/api.config.ts"""
    config_path = r"D:\Claude projects2\entregas-esencial-pack\nextjs-entregas\src\config\api.config.ts"
    
    new_content = """/**
 * Configuración de la API de Odoo
 * Módulo: woocommerce_delivery_cuba
 * ACTUALIZADO PARA COMPATIBILIDAD CON ODOO EN PUERTO 30017
 */

// Configuración de desarrollo y producción
const config = {
  development: {
    baseUrl: 'http://localhost:30017',  // ACTUALIZADO AL PUERTO CORRECTO
    database: 'odoo17_db',               // ACTUALIZADO A LA BD CORRECTA
    timeout: 30000,
  },
  production: {
    baseUrl: process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:30017',
    database: process.env.NEXT_PUBLIC_ODOO_DB || 'odoo17_db',
    timeout: 30000,
  }
};

// Seleccionar configuración según el entorno
const environment = process.env.NODE_ENV || 'development';
export const apiConfig = config[environment as keyof typeof config];

// Endpoints disponibles en el módulo (VERIFICADOS)
export const API_ENDPOINTS = {
  // Autenticación - ACTUALIZADOS A LOS ENDPOINTS REALES
  LOGIN: '/api/v1/carrier/login',        // Endpoint nuevo para Next.js
  VERIFY: '/api/v1/carrier/verify',      // Verificación de token
  LOGIN_LEGACY: '/api/delivery/login',   // Endpoint legacy (mantener por compatibilidad)
  
  // Órdenes/Pedidos - VERIFICADO QUE EXISTE
  ORDERS: '/api/delivery/orders',
  
  // ENDPOINTS PENDIENTES DE IMPLEMENTACIÓN EN ODOO:
  // Los siguientes endpoints aún no existen en el módulo de Odoo
  // Se mantienen comentados para futura implementación
  
  ORDER_DETAIL: (id: string) => `/api/delivery/orders/${id}`,
  UPDATE_ORDER: (id: string) => `/api/delivery/orders/${id}/update`,
  
  /* FUTURA IMPLEMENTACIÓN:
  LOGOUT: '/api/delivery/logout',
  CAPTURES: '/api/delivery/captures',
  CAPTURE_UPLOAD: '/api/delivery/capture/upload',
  ROUTES: '/api/delivery/routes',
  ROUTE_OPTIMIZE: '/api/delivery/route/optimize',
  METRICS: '/api/delivery/metrics',
  UPDATE_LOCATION: '/api/delivery/location/update',
  */
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Estados de pedidos en Odoo
export const ODOO_ORDER_STATES = {
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Tipos de evidencia
export const EVIDENCE_TYPES = {
  SIGNATURE: 'signature',
  PHOTO: 'photo',
  DOCUMENT: 'document_photo',
  INCIDENT: 'incident_photo',
} as const;
"""
    
    # Backup
    if os.path.exists(config_path):
        with open(config_path + '.backup', 'w') as f:
            with open(config_path, 'r') as original:
                f.write(original.read())
        print(f"[OK] Backup creado: {config_path}.backup")
    
    # Escribir nuevo contenido
    with open(config_path, 'w') as f:
        f.write(new_content)
    print(f"[OK] Actualizado: {config_path}")

def update_test_script():
    """Actualizar scripts/test-odoo-connection.js"""
    script_path = r"D:\Claude projects2\entregas-esencial-pack\nextjs-entregas\scripts\test-odoo-connection.js"
    
    # Leer el archivo actual
    with open(script_path, 'r') as f:
        content = f.read()
    
    # Backup
    with open(script_path + '.backup', 'w') as f:
        f.write(content)
    print(f"[OK] Backup creado: {script_path}.backup")
    
    # Reemplazar valores
    content = re.sub(r"const ODOO_URL = '[^']*'", "const ODOO_URL = 'http://localhost:30017'", content)
    content = re.sub(r"const ODOO_DB = '[^']*'", "const ODOO_DB = 'odoo17_db'", content)
    content = re.sub(r"const ODOO_PASSWORD = '[^']*'", "const ODOO_PASSWORD = 'admin123'", content)
    
    # Escribir contenido actualizado
    with open(script_path, 'w') as f:
        f.write(content)
    print(f"[OK] Actualizado: {script_path}")

def create_test_api_script():
    """Crear script de prueba de API"""
    test_path = r"D:\Claude projects2\entregas-esencial-pack\nextjs-entregas\scripts\test-api-endpoints.js"
    
    content = """// Script para probar los endpoints de la API de Odoo
// Ejecutar con: node scripts/test-api-endpoints.js

const ODOO_URL = 'http://localhost:30017';

async function testEndpoints() {
  console.log('🔧 PROBANDO ENDPOINTS DE ODOO');
  console.log('================================\\n');
  
  // 1. Probar que Odoo responde
  console.log('1️⃣ Verificando conexión con Odoo...');
  try {
    const response = await fetch(`${ODOO_URL}/web/database/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    console.log('✅ Odoo responde. Bases de datos:', data.result);
  } catch (error) {
    console.error('❌ Error conectando con Odoo:', error.message);
    return;
  }
  
  // 2. Probar endpoint de login
  console.log('\\n2️⃣ Probando endpoint de login...');
  try {
    const loginResponse = await fetch(`${ODOO_URL}/api/v1/carrier/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '53512345678',
        pin: '1234'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginData.success) {
      console.log('✅ Login exitoso!');
      console.log('   Token:', loginData.data?.token?.substring(0, 20) + '...');
      console.log('   Carrier:', loginData.data?.carrier?.name);
      
      // Guardar token para siguiente prueba
      const token = loginData.data?.token;
      
      // 3. Probar verificación de token
      console.log('\\n3️⃣ Probando verificación de token...');
      const verifyResponse = await fetch(`${ODOO_URL}/api/v1/carrier/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const verifyData = await verifyResponse.json();
      console.log('   Verificación:', verifyData.success ? '✅ Token válido' : '❌ Token inválido');
      
    } else {
      console.log('❌ Login falló:', loginData.error);
      console.log('   Debug info:', loginData.debug);
    }
    
  } catch (error) {
    console.error('❌ Error en login:', error.message);
  }
  
  // 4. Probar endpoint de orders (legacy)
  console.log('\\n4️⃣ Probando endpoint de orders...');
  try {
    const ordersResponse = await fetch(`${ODOO_URL}/api/delivery/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: { page: 1, limit: 5 },
        id: 1
      })
    });
    
    const ordersData = await ordersResponse.json();
    console.log('   Respuesta recibida:', ordersData.result ? '✅' : '❌');
    
  } catch (error) {
    console.error('❌ Error en orders:', error.message);
  }
  
  console.log('\\n================================');
  console.log('✅ PRUEBA COMPLETADA');
  console.log('\\nNOTA: Si el login falla, crear el transportista en Odoo:');
  console.log('- Nombre: Pedro Delivery Test');
  console.log('- Teléfono: 53512345678');
  console.log('- PIN: 1234');
  console.log('- Campo is_delivery_carrier: true');
}

// Ejecutar pruebas
testEndpoints();
"""
    
    with open(test_path, 'w') as f:
        f.write(content)
    print(f"[OK] Creado script de prueba: {test_path}")

def main():
    print("=" * 60)
    print("ACTUALIZANDO PROYECTO NEXT.JS PARA COMPATIBILIDAD")
    print("=" * 60)
    print()
    
    print("Actualizando archivos de configuracion...")
    
    try:
        # 1. Actualizar .env.local
        update_env_file()
        
        # 2. Actualizar api.config.ts
        update_api_config()
        
        # 3. Actualizar test script
        update_test_script()
        
        # 4. Crear script de prueba de API
        create_test_api_script()
        
        print()
        print("=" * 60)
        print("ACTUALIZACION COMPLETADA")
        print("=" * 60)
        print()
        print("PROXIMOS PASOS:")
        print()
        print("1. Verificar que Odoo esté corriendo:")
        print("   docker ps | grep odoo17_server")
        print()
        print("2. Probar conexión:")
        print("   cd 'D:\\Claude projects2\\entregas-esencial-pack\\nextjs-entregas'")
        print("   node scripts/test-odoo-connection.js")
        print()
        print("3. Probar endpoints de API:")
        print("   node scripts/test-api-endpoints.js")
        print()
        print("4. Iniciar aplicación Next.js:")
        print("   npm run dev")
        print()
        print("5. Abrir en navegador:")
        print("   http://localhost:3000")
        print()
        print("IMPORTANTE:")
        print("Si el login falla, crear transportista de prueba en Odoo:")
        print("- Acceder a http://localhost:30017")
        print("- Login: admin / admin123")
        print("- Crear contacto con:")
        print("  - is_delivery_carrier: true")
        print("  - carrier_phone: 53512345678")
        print("  - carrier_pin: 1234")
        
    except Exception as e:
        print(f"[ERROR] Error durante la actualizacion: {e}")
        print("Por favor, verifica los permisos de archivo y rutas")

if __name__ == "__main__":
    main()
