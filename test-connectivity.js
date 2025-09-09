const http = require('http');
const { exec } = require('child_process');

console.log('🔍 Test de Conectividad Next.js y Odoo\n');
console.log('=====================================\n');

// Test 1: Verificar si Next.js está respondiendo
function testNextJS() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/test',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        console.log('✅ Next.js está respondiendo en puerto 3001');
        console.log(`   Status: ${res.statusCode}`);
        resolve(true);
      } else {
        console.log('⚠️ Next.js responde pero con error:', res.statusCode);
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log('❌ Next.js NO está respondiendo en puerto 3001');
      console.log('   Error:', error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Timeout al conectar con Next.js');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test 2: Verificar si Odoo está respondiendo
function testOdoo() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8069,
      path: '/web/login',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      console.log('✅ Odoo está respondiendo en puerto 8069');
      console.log(`   Status: ${res.statusCode}`);
      resolve(true);
    });

    req.on('error', (error) => {
      console.log('❌ Odoo NO está respondiendo en puerto 8069');
      console.log('   Error:', error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Timeout al conectar con Odoo');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test 3: Verificar endpoint de login
function testOdooAPI() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: { phone: '53512345678', pin: '1234' },
      id: 1
    });

    const options = {
      hostname: 'localhost',
      port: 8069,
      path: '/api/delivery/login/fixed',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.result && json.result.success) {
            console.log('✅ API de Odoo funciona correctamente');
            console.log('   Token:', json.result.token ? 'Generado' : 'No generado');
            console.log('   Carrier ID:', json.result.carrier?.id || 'No encontrado');
          } else {
            console.log('⚠️ API responde pero con error:');
            console.log('  ', json.result?.error || 'Error desconocido');
          }
          resolve(true);
        } catch (e) {
          console.log('❌ Error al parsear respuesta de API:', e.message);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Error al conectar con API de Odoo:', error.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('❌ Timeout al conectar con API de Odoo');
      req.destroy();
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Ejecutar tests
async function runTests() {
  console.log('1️⃣ Verificando Next.js...\n');
  const nextOK = await testNextJS();
  
  console.log('\n2️⃣ Verificando Odoo...\n');
  const odooOK = await testOdoo();
  
  if (odooOK) {
    console.log('\n3️⃣ Verificando API de Login...\n');
    await testOdooAPI();
  }
  
  console.log('\n=====================================\n');
  console.log('📊 RESUMEN:\n');
  
  if (!nextOK) {
    console.log('⚠️ ACCIÓN REQUERIDA: Next.js no está funcionando');
    console.log('   Ejecuta: npm run dev');
    console.log('   O ejecuta: diagnose-and-fix.bat');
  }
  
  if (!odooOK) {
    console.log('⚠️ ACCIÓN REQUERIDA: Odoo no está funcionando');
    console.log('   Verifica que Docker esté corriendo');
    console.log('   Ejecuta: docker start esencialpack_odoo_1');
  }
  
  if (nextOK && odooOK) {
    console.log('✅ Todo está funcionando correctamente!');
    console.log('\n🌐 URLs disponibles:');
    console.log('   Next.js: http://localhost:3001/test');
    console.log('   Login:   http://localhost:3001/login');
    console.log('   Odoo:    http://localhost:8069');
  }
  
  console.log('\n=====================================');
}

runTests();