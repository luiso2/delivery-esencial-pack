/**
 * Script para testear el login del transportista
 * Módulo: woocommerce_delivery_cuba
 * Fecha: 01/09/2025
 */

const http = require('http');

// Configuración
const ODOO_URL = 'http://localhost:8069';
const ODOO_DB = 'odoo';

// Datos del transportista de prueba
const TEST_CARRIER = {
  phone: '53512345678',
  pin: '1234'
};

console.log('🚀 Test de Login - Módulo woocommerce_delivery_cuba');
console.log('=' .repeat(60));
console.log('📍 Odoo URL:', ODOO_URL);
console.log('📍 Database:', ODOO_DB);
console.log('📍 Transportista:', TEST_CARRIER.phone);
console.log('=' .repeat(60));

// Función para hacer la llamada al endpoint de login
function testLogin() {
  const data = JSON.stringify(TEST_CARRIER);

  const options = {
    hostname: 'localhost',
    port: 8069,
    path: '/api/delivery/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('\n📡 Enviando petición de login...');

  const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('\n📨 Respuesta recibida:');
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      
      try {
        const response = JSON.parse(responseData);
        console.log('\n📋 Datos de respuesta:');
        console.log(JSON.stringify(response, null, 2));
        
        if (response.success) {
          console.log('\n✅ LOGIN EXITOSO!');
          console.log('Token:', response.token);
          console.log('Carrier ID:', response.carrier?.id);
          console.log('Carrier Name:', response.carrier?.name);
        } else {
          console.log('\n❌ LOGIN FALLIDO');
          console.log('Error:', response.error);
        }
      } catch (e) {
        console.log('\n❌ Error parseando respuesta:');
        console.log(responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ Error en la conexión:', error.message);
    console.log('\n💡 Verificar que:');
    console.log('1. Odoo esté corriendo en el puerto 8069');
    console.log('2. El módulo woocommerce_delivery_cuba esté instalado');
    console.log('3. Los endpoints de la API estén activos');
  });

  req.write(data);
  req.end();
}

// Ejecutar test
testLogin();
