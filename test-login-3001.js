/**
 * Test de login en Next.js - Puerto 3001
 * Fecha: 01/09/2025
 */

const http = require('http');

// Configuración
const CONFIG = {
  nextjs: {
    host: 'localhost',
    port: 3001
  },
  odoo: {
    host: 'localhost',
    port: 8069
  },
  carrier: {
    phone: '53512345678',
    pin: '1234'
  }
};

console.log('🚀 TEST DE LOGIN - NEXT.JS APP (PUERTO 3001)');
console.log('=' .repeat(60));
console.log(`📍 Next.js: http://${CONFIG.nextjs.host}:${CONFIG.nextjs.port}`);
console.log(`📍 Odoo: http://${CONFIG.odoo.host}:${CONFIG.odoo.port}`);
console.log(`📱 Transportista: ${CONFIG.carrier.phone}`);
console.log('=' .repeat(60));

// Función para hacer petición HTTP
function makeRequest(options, data, callback) {
  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      callback(null, res.statusCode, responseData);
    });
  });
  
  req.on('error', (error) => {
    callback(error, null, null);
  });
  
  if (data) {
    req.write(data);
  }
  
  req.end();
}

// Test 1: Verificar que Next.js está corriendo
console.log('\n📡 Test 1: Verificando Next.js en puerto 3001...');

const checkOptions = {
  hostname: CONFIG.nextjs.host,
  port: CONFIG.nextjs.port,
  path: '/',
  method: 'GET'
};

makeRequest(checkOptions, null, (error, statusCode, data) => {
  if (error) {
    console.log('   ❌ Next.js no está disponible:', error.message);
    console.log('   💡 Ejecutar en la carpeta del proyecto:');
    console.log('      npm install');
    console.log('      npm run dev');
    return;
  }
  
  console.log(`   Status: ${statusCode}`);
  if (statusCode === 200 || statusCode === 307 || statusCode === 308) {
    console.log('   ✅ Next.js está corriendo en puerto 3001');
    
    // Test 2: Probar login a través de Next.js
    console.log('\n📡 Test 2: Probando login via Next.js API...');
    
    const loginData = JSON.stringify(CONFIG.carrier);
    
    const loginOptions = {
      hostname: CONFIG.nextjs.host,
      port: CONFIG.nextjs.port,
      path: '/api/auth/carrier-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };
    
    makeRequest(loginOptions, loginData, (error, statusCode, responseData) => {
      if (error) {
        console.log('   ❌ Error en login:', error.message);
        return;
      }
      
      console.log(`   Status: ${statusCode}`);
      
      try {
        const response = JSON.parse(responseData);
        console.log('\n📋 Respuesta del servidor:');
        console.log(JSON.stringify(response, null, 2));
        
        if (response.success) {
          console.log('\n✅ LOGIN EXITOSO!');
          console.log(`   Token: ${response.token ? response.token.substring(0, 20) + '...' : 'N/A'}`);
          if (response.carrier) {
            console.log(`   Carrier ID: ${response.carrier.id}`);
            console.log(`   Carrier Name: ${response.carrier.name}`);
            console.log(`   Carrier Code: ${response.carrier.code}`);
            console.log(`   Vehicle Type: ${response.carrier.vehicle_type}`);
          }
          
          console.log('\n🎯 PRÓXIMOS PASOS:');
          console.log('   1. Abrir navegador en: http://localhost:3001');
          console.log('   2. Usar las credenciales:');
          console.log(`      - Teléfono: ${CONFIG.carrier.phone}`);
          console.log(`      - PIN: ${CONFIG.carrier.pin}`);
          
          // Test 3: Verificar otros endpoints
          console.log('\n📡 Test 3: Verificando otros endpoints...');
          testOtherEndpoints();
          
        } else {
          console.log('\n❌ LOGIN FALLIDO');
          console.log(`   Error: ${response.error || 'Error desconocido'}`);
          if (response.details) {
            console.log(`   Detalles: ${response.details}`);
          }
          
          console.log('\n💡 Posibles soluciones:');
          console.log('   1. Verificar que Odoo esté corriendo en puerto 8069');
          console.log('   2. Verificar que el módulo woocommerce_delivery_cuba esté instalado');
          console.log('   3. Verificar el archivo .env.local tiene las credenciales correctas');
          console.log('   4. Reiniciar Next.js después de cambiar .env.local');
        }
        
      } catch (e) {
        console.log('   ❌ Error parseando respuesta:', e.message);
        console.log('   Respuesta raw:', responseData.substring(0, 200));
      }
    });
    
  } else {
    console.log('   ⚠️ Next.js responde pero con status inesperado');
  }
});

// Función para testear otros endpoints
function testOtherEndpoints() {
  const endpoints = [
    '/api/proxy/delivery/orders',
    '/api/proxy/delivery/routes',
    '/api/proxy/delivery/metrics'
  ];
  
  let tested = 0;
  
  endpoints.forEach(endpoint => {
    const options = {
      hostname: CONFIG.nextjs.host,
      port: CONFIG.nextjs.port,
      path: endpoint,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    makeRequest(options, null, (error, statusCode, data) => {
      tested++;
      if (error) {
        console.log(`   ${endpoint}: ❌ Error`);
      } else {
        console.log(`   ${endpoint}: ${statusCode === 200 ? '✅' : '⚠️'} (${statusCode})`);
      }
      
      if (tested === endpoints.length) {
        console.log('\n' + '=' .repeat(60));
        console.log('🏁 TEST COMPLETADO');
        console.log('=' .repeat(60));
      }
    });
  });
}

// Mensaje inicial
console.log('\n⏳ Iniciando tests...\n');
