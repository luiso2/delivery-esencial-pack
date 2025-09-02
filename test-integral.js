/**
 * Test integral de la app Next.js con Odoo
 * Módulo: woocommerce_delivery_cuba
 */

const http = require('http');
const https = require('https');

// Configuración
const CONFIG = {
  odoo: {
    url: 'http://localhost:8069',
    db: 'odoo',
    admin: 'lbencomo94@gmail.com',
    password: 'admin'
  },
  nextjs: {
    url: 'http://localhost:3000'
  },
  carrier: {
    phone: '53512345678',
    pin: '1234'
  }
};

console.log('🚀 TEST INTEGRAL - ENTREGAS ESENCIAL PACK');
console.log('=' .repeat(60));

// Test 1: Verificar que Odoo está corriendo
function testOdooConnection(callback) {
  console.log('\n📡 Test 1: Verificando conexión con Odoo...');
  
  const options = {
    hostname: 'localhost',
    port: 8069,
    path: '/web/database/list',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('   ✅ Odoo está corriendo');
    } else {
      console.log('   ⚠️ Odoo responde pero con status inesperado');
    }
    callback(true);
  });
  
  req.on('error', (error) => {
    console.log('   ❌ Odoo no está disponible:', error.message);
    callback(false);
  });
  
  req.write(JSON.stringify({}));
  req.end();
}

// Test 2: Probar endpoint de login directo en Odoo
function testOdooLogin(callback) {
  console.log('\n📡 Test 2: Probando login directo en Odoo...');
  
  const data = JSON.stringify(CONFIG.carrier);
  
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
  
  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log(`   Status: ${res.statusCode}`);
      try {
        const response = JSON.parse(responseData);
        if (response.success || response.result) {
          console.log('   ✅ Login exitoso en Odoo');
          console.log(`   Token: ${(response.token || response.result?.token || '').substring(0, 20)}...`);
          callback(true);
        } else {
          console.log('   ❌ Login fallido:', response.error || 'Error desconocido');
          callback(false);
        }
      } catch (e) {
        console.log('   ❌ Error parseando respuesta');
        callback(false);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('   ❌ Error de conexión:', error.message);
    callback(false);
  });
  
  req.write(data);
  req.end();
}

// Test 3: Verificar que Next.js está corriendo
function testNextJsConnection(callback) {
  console.log('\n📡 Test 3: Verificando conexión con Next.js...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    if (res.statusCode === 200 || res.statusCode === 307) {
      console.log('   ✅ Next.js está corriendo');
      callback(true);
    } else {
      console.log('   ⚠️ Next.js responde pero con status inesperado');
      callback(true);
    }
  });
  
  req.on('error', (error) => {
    console.log('   ❌ Next.js no está disponible:', error.message);
    console.log('   💡 Ejecutar: npm run dev');
    callback(false);
  });
  
  req.end();
}

// Test 4: Probar login a través de Next.js
function testNextJsLogin(callback) {
  console.log('\n📡 Test 4: Probando login a través de Next.js API...');
  
  const data = JSON.stringify(CONFIG.carrier);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/carrier-login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  
  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log(`   Status: ${res.statusCode}`);
      try {
        const response = JSON.parse(responseData);
        if (response.success) {
          console.log('   ✅ Login exitoso a través de Next.js');
          console.log(`   Carrier: ${response.carrier?.name}`);
          callback(true);
        } else {
          console.log('   ❌ Login fallido:', response.error || 'Error desconocido');
          if (response.details) {
            console.log(`   Detalles: ${response.details}`);
          }
          callback(false);
        }
      } catch (e) {
        console.log('   ❌ Error parseando respuesta');
        callback(false);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log('   ❌ Error de conexión:', error.message);
    callback(false);
  });
  
  req.write(data);
  req.end();
}

// Ejecutar todos los tests
let testResults = {
  odooConnection: false,
  odooLogin: false,
  nextjsConnection: false,
  nextjsLogin: false
};

testOdooConnection((result) => {
  testResults.odooConnection = result;
  
  if (result) {
    testOdooLogin((loginResult) => {
      testResults.odooLogin = loginResult;
      
      testNextJsConnection((nextResult) => {
        testResults.nextjsConnection = nextResult;
        
        if (nextResult) {
          testNextJsLogin((nextLoginResult) => {
            testResults.nextjsLogin = nextLoginResult;
            showResults();
          });
        } else {
          showResults();
        }
      });
    });
  } else {
    showResults();
  }
});

function showResults() {
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESUMEN DE RESULTADOS');
  console.log('=' .repeat(60));
  
  console.log(`Odoo Conexión:     ${testResults.odooConnection ? '✅' : '❌'}`);
  console.log(`Odoo Login:        ${testResults.odooLogin ? '✅' : '❌'}`);
  console.log(`Next.js Conexión:  ${testResults.nextjsConnection ? '✅' : '❌'}`);
  console.log(`Next.js Login:     ${testResults.nextjsLogin ? '✅' : '❌'}`);
  
  console.log('\n' + '=' .repeat(60));
  
  if (testResults.odooConnection && testResults.odooLogin && 
      testResults.nextjsConnection && testResults.nextjsLogin) {
    console.log('🎉 TODOS LOS TESTS PASARON - SISTEMA LISTO');
  } else {
    console.log('⚠️ ALGUNOS TESTS FALLARON');
    console.log('\n📌 Pasos para solucionar:');
    
    if (!testResults.odooConnection) {
      console.log('1. Iniciar Odoo en el puerto 8069');
    }
    if (!testResults.odooLogin) {
      console.log('2. Verificar que el módulo woocommerce_delivery_cuba esté instalado');
      console.log('3. Verificar que el transportista de prueba existe (phone: 53512345678, pin: 1234)');
    }
    if (!testResults.nextjsConnection) {
      console.log('4. Iniciar Next.js: npm run dev');
    }
    if (!testResults.nextjsLogin) {
      console.log('5. Verificar archivo .env.local con las credenciales correctas');
      console.log('6. Reiniciar Next.js después de cambiar .env.local');
    }
  }
  
  console.log('=' .repeat(60));
}
