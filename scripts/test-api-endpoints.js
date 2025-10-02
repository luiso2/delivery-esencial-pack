// Script para probar los endpoints de la API de Odoo
// Ejecutar con: node scripts/test-api-endpoints.js

const ODOO_URL = 'http://localhost:30017';

async function testEndpoints() {
  console.log('PROBANDO ENDPOINTS DE ODOO');
  console.log('================================\n');
  
  // 1. Probar que Odoo responde
  console.log('1. Verificando conexion con Odoo...');
  try {
    const response = await fetch(`${ODOO_URL}/web/database/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    console.log('[OK] Odoo responde. Bases de datos:', data.result);
  } catch (error) {
    console.error('[ERROR] Error conectando con Odoo:', error.message);
    return;
  }
  
  // 2. Probar endpoint de login
  console.log('\n2. Probando endpoint de login...');
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
      console.log('[OK] Login exitoso!');
      console.log('   Token:', loginData.data?.token?.substring(0, 20) + '...');
      console.log('   Carrier:', loginData.data?.carrier?.name);
      
      // Guardar token para siguiente prueba
      const token = loginData.data?.token;
      
      // 3. Probar verificacion de token
      console.log('\n3. Probando verificacion de token...');
      const verifyResponse = await fetch(`${ODOO_URL}/api/v1/carrier/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const verifyData = await verifyResponse.json();
      console.log('   Verificacion:', verifyData.success ? '[OK] Token valido' : '[ERROR] Token invalido');
      
    } else {
      console.log('[ERROR] Login fallo:', loginData.error);
      console.log('   Debug info:', loginData.debug);
    }
    
  } catch (error) {
    console.error('[ERROR] Error en login:', error.message);
  }
  
  // 4. Probar endpoint de orders (legacy)
  console.log('\n4. Probando endpoint de orders...');
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
    console.log('   Respuesta recibida:', ordersData.result ? '[OK]' : '[ERROR]');
    
  } catch (error) {
    console.error('[ERROR] Error en orders:', error.message);
  }
  
  console.log('\n================================');
  console.log('PRUEBA COMPLETADA');
  console.log('\nNOTA: Si el login falla, verificar que existe el transportista:');
  console.log('- Nombre: Pedro Delivery Test');
  console.log('- Telefono: 53512345678');
  console.log('- PIN: 1234');
  console.log('- Campo is_delivery_carrier: true');
  console.log('\nEl transportista ya fue creado con ID: 94');
}

// Ejecutar pruebas
testEndpoints();
