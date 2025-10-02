const xmlrpc = require('xmlrpc');

// Configuración
const ODOO_URL = 'http://localhost:30017';
const ODOO_DB = 'odoo17_db';
const ODOO_USER = 'admin';
const ODOO_PASSWORD = 'admin123';

async function testConnection() {
  console.log('🔄 Probando conectividad con Odoo...');
  console.log(`URL: ${ODOO_URL}`);
  console.log(`DB: ${ODOO_DB}`);
  console.log(`Usuario: ${ODOO_USER}`);
  
  const common = xmlrpc.createClient({ 
    url: `${ODOO_URL}/xmlrpc/2/common`,
    path: '/xmlrpc/2/common'
  });

  return new Promise((resolve, reject) => {
    common.methodCall('authenticate', [ODOO_DB, ODOO_USER, ODOO_PASSWORD, {}], (err, uid) => {
      if (err) {
        console.error('❌ Error de autenticación:', err);
        reject(err);
      } else if (!uid) {
        console.error('❌ Credenciales inválidas');
        reject(new Error('Credenciales inválidas'));
      } else {
        console.log('✅ Autenticación exitosa, UID:', uid);
        resolve(uid);
      }
    });
  });
}

async function testCarrierSearch(uid) {
  console.log('\n🔍 Buscando transportista...');
  
  const object = xmlrpc.createClient({ 
    url: `${ODOO_URL}/xmlrpc/2/object`,
    path: '/xmlrpc/2/object'
  });

  return new Promise((resolve, reject) => {
    object.methodCall('execute_kw', [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      'res.partner',
      'search',
      [[['phone', '=', '53512345678']]],
      { limit: 1 }
    ], (err, result) => {
      if (err) {
        console.error('❌ Error buscando transportista:', err);
        reject(err);
      } else {
        console.log('✅ Búsqueda exitosa, IDs:', result);
        resolve(result);
      }
    });
  });
}

async function main() {
  try {
    const uid = await testConnection();
    const carrierIds = await testCarrierSearch(uid);
    
    if (carrierIds && carrierIds.length > 0) {
      console.log('🎉 Test completo exitoso!');
      console.log(`Transportista encontrado con ID: ${carrierIds[0]}`);
    } else {
      console.log('⚠️ No se encontró transportista con teléfono 53512345678');
    }
    
  } catch (error) {
    console.error('💥 Error en el test:', error.message);
  }
}

main();
