// Script para probar el endpoint alternativo de autenticacion que SI funciona
// Ejecutar con: node scripts/test-working-auth.js

const ODOO_URL = 'http://localhost:30017';

async function testWorkingAuth() {
  console.log('PROBANDO ENDPOINT DE AUTENTICACION ALTERNATIVO');
  console.log('=============================================\n');
  
  // 1. Probar endpoint /api/delivery/auth (el que SI funciona)
  console.log('1. Probando /api/delivery/auth (sin tokens)...');
  try {
    const authResponse = await fetch(`${ODOO_URL}/api/delivery/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '53512345678',
        pin: '1234'
      })
    });
    
    const authData = await authResponse.json();
    
    if (authData.success) {
      console.log('[OK] Autenticacion exitosa!');
      console.log('   Carrier ID:', authData.data?.carrier_id);
      console.log('   Carrier Name:', authData.data?.carrier_name);
      console.log('   Carrier Phone:', authData.data?.carrier_phone);
      console.log('   Carrier State:', authData.data?.carrier_state);
      
      // 2. Probar verificacion
      console.log('\n2. Probando /api/delivery/verify...');
      const verifyResponse = await fetch(`${ODOO_URL}/api/delivery/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {
            carrier_id: authData.data?.carrier_id
          },
          id: 1
        })
      });
      
      const verifyData = await verifyResponse.json();
      if (verifyData.result?.success) {
        console.log('[OK] Verificacion exitosa!');
        console.log('   Carrier:', verifyData.result.carrier);
      } else {
        console.log('[ERROR] Verificacion fallo:', verifyData.result?.error);
      }
      
    } else {
      console.log('[ERROR] Autenticacion fallo:', authData.error);
    }
    
  } catch (error) {
    console.error('[ERROR] Error en auth:', error.message);
  }
  
  console.log('\n=============================================');
  console.log('RECOMENDACION:');
  console.log('Usar el endpoint /api/delivery/auth en lugar de /api/v1/carrier/login');
  console.log('Este endpoint SI funciona y no requiere campos x_auth_token');
  console.log('\nActualizar Next.js para usar:');
  console.log('- POST http://localhost:30017/api/delivery/auth');
  console.log('- Body: { phone: "53512345678", pin: "1234" }');
}

// Ejecutar prueba
testWorkingAuth();
