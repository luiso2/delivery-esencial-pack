/**
 * Test del endpoint de login con curl simulado
 */

const http = require('http');

// Configuración
const NEXTJS_PORT = 3001;
const TEST_DATA = {
  phone: '53512345678',  // Sin espacios
  pin: '1234'
};

console.log('🚀 TEST DE LOGIN - NEXT.JS API');
console.log('=' .repeat(60));
console.log(`📍 URL: http://localhost:${NEXTJS_PORT}/api/auth/carrier-login`);
console.log(`📱 Teléfono: ${TEST_DATA.phone}`);
console.log(`🔑 PIN: ${TEST_DATA.pin}`);
console.log('=' .repeat(60));

// Función para hacer la petición
function testLogin() {
  const data = JSON.stringify(TEST_DATA);
  
  const options = {
    hostname: 'localhost',
    port: NEXTJS_PORT,
    path: '/api/auth/carrier-login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Accept': '*/*'
    }
  };
  
  console.log('\n📡 Enviando petición de login...');
  console.log('   Body:', data);
  
  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log('\n📨 Respuesta recibida:');
      console.log('   Status:', res.statusCode);
      
      try {
        const response = JSON.parse(responseData);
        console.log('   Response:', JSON.stringify(response, null, 2));
        
        if (response.success) {
          console.log('\n✅ LOGIN EXITOSO!');
          console.log('   Token:', response.token ? response.token.substring(0, 30) + '...' : 'N/A');
          if (response.carrier) {
            console.log('   Carrier ID:', response.carrier.id);
            console.log('   Carrier Name:', response.carrier.name);
            console.log('   Carrier Code:', response.carrier.code);
            console.log('   Vehicle Type:', response.carrier.vehicle_type);
          }
        } else {
          console.log('\n❌ LOGIN FALLIDO');
          console.log('   Error:', response.error);
          if (response.details) {
            console.log('   Detalles:', response.details);
          }
          
          console.log('\n💡 Soluciones posibles:');
          console.log('   1. Reiniciar Next.js para cargar los nuevos valores');
          console.log('   2. Verificar que .env.local tiene las credenciales correctas');
          console.log('   3. Verificar que Odoo está corriendo en puerto 8069');
          console.log('   4. Ejecutar: npm install xmlrpc');
        }
      } catch (e) {
        console.log('   ❌ Error parseando respuesta:', e.message);
        console.log('   Respuesta raw:', responseData);
      }
      
      console.log('\n' + '=' .repeat(60));
      console.log('🏁 FIN DEL TEST');
      console.log('=' .repeat(60));
    });
  });
  
  req.on('error', (error) => {
    console.log('\n❌ Error de conexión:', error.message);
    console.log('\n💡 Verificar:');
    console.log('   1. Next.js está corriendo en puerto', NEXTJS_PORT);
    console.log('   2. Ejecutar: npm run dev');
  });
  
  req.write(data);
  req.end();
}

// Ejecutar test
testLogin();
