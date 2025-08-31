// Script de prueba para verificar la conexion con Odoo y el transportista
// Ejecutar con: node scripts/test-odoo-connection.js

const ODOO_URL = 'http://localhost:30017';  // ACTUALIZADO AL PUERTO CORRECTO
const ODOO_DB = 'odoo17_db';                // ACTUALIZADO A LA BD CORRECTA  
const ODOO_USER = 'admin';
const ODOO_PASSWORD = 'admin123';           // ACTUALIZADO AL PASSWORD CORRECTO

// Parser XML simple para las pruebas
function buildXmlRpcRequest(method, params) {
  const paramElements = params.map(param => {
    if (typeof param === 'string') {
      return `<param><value><string>${param}</string></value></param>`;
    } else if (typeof param === 'number') {
      return `<param><value><int>${param}</int></value></param>`;
    } else if (typeof param === 'boolean') {
      return `<param><value><boolean>${param ? 1 : 0}</boolean></value></param>`;
    } else if (Array.isArray(param)) {
      const arrayValues = param.map(p => {
        if (typeof p === 'string') return `<value><string>${p}</string></value>`;
        if (typeof p === 'number') return `<value><int>${p}</int></value>`;
        if (typeof p === 'boolean') return `<value><boolean>${p ? 1 : 0}</boolean></value>`;
        if (Array.isArray(p)) {
          return `<value><array><data>${p.map(v => 
            typeof v === 'string' ? `<value><string>${v}</string></value>` : 
            typeof v === 'number' ? `<value><int>${v}</int></value>` :
            typeof v === 'boolean' ? `<value><boolean>${v ? 1 : 0}</boolean></value>` :
            `<value><string>${v}</string></value>`
          ).join('')}</data></array></value>`;
        }
        return `<value><string>${p}</string></value>`;
      }).join('');
      return `<param><value><array><data>${arrayValues}</data></array></value></param>`;
    } else if (param === null) {
      return `<param><value><nil/></value></param>`;
    } else if (typeof param === 'object') {
      const members = Object.entries(param).map(([key, value]) => {
        let valueStr = '';
        if (typeof value === 'string') valueStr = `<value><string>${value}</string></value>`;
        else if (typeof value === 'number') valueStr = `<value><int>${value}</int></value>`;
        else if (typeof value === 'boolean') valueStr = `<value><boolean>${value ? 1 : 0}</boolean></value>`;
        else valueStr = `<value><string>${value}</string></value>`;
        return `<member><n>${key}</n>${valueStr}</member>`;
      }).join('');
      return `<param><value><struct>${members}</struct></value></param>`;
    }
    return `<param><value><string>${param}</string></value></param>`;
  }).join('\n');

  return `<?xml version="1.0"?>
<methodCall>
  <methodName>${method}</methodName>
  <params>
${paramElements}
  </params>
</methodCall>`;
}

function parseXmlValue(xml) {
  // Extraer valor de int
  const intMatch = xml.match(/<int>(\d+)<\/int>/);
  if (intMatch) return parseInt(intMatch[1]);
  
  // Extraer valor de string
  const stringMatch = xml.match(/<string>(.*?)<\/string>/s);
  if (stringMatch) return stringMatch[1];
  
  // Extraer valor de boolean
  const boolMatch = xml.match(/<boolean>([01])<\/boolean>/);
  if (boolMatch) return boolMatch[1] === '1';
  
  // Extraer array de IDs
  const arrayMatch = xml.match(/<array>.*?<\/array>/s);
  if (arrayMatch) {
    const ids = [];
    const valueMatches = xml.matchAll(/<value><int>(\d+)<\/int><\/value>/g);
    for (const match of valueMatches) {
      ids.push(parseInt(match[1]));
    }
    return ids;
  }
  
  return null;
}

async function xmlRpcCall(endpoint, method, params) {
  const xmlRequest = buildXmlRpcRequest(method, params);
  
  console.log(`\nLlamando a ${endpoint} - metodo: ${method}`);
  
  try {
    const response = await fetch(`${ODOO_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      body: xmlRequest,
    });

    const xmlResponse = await response.text();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Verificar si hay error
    if (xmlResponse.includes('<fault>')) {
      const errorMatch = xmlResponse.match(/<string>(.*?)<\/string>/s);
      throw new Error(errorMatch ? errorMatch[1] : 'Error desconocido');
    }
    
    return parseXmlValue(xmlResponse);
  } catch (error) {
    console.error('[ERROR] Error:', error.message);
    throw error;
  }
}

async function testOdooConnection() {
  console.log('========================================');
  console.log('TEST DE CONEXION CON ODOO');
  console.log('========================================');
  console.log('URL:', ODOO_URL);
  console.log('Database:', ODOO_DB);
  console.log('Usuario:', ODOO_USER);
  
  try {
    // 1. Verificar version de Odoo
    console.log('\n1. Verificando version de Odoo...');
    const version = await xmlRpcCall('/xmlrpc/2/common', 'version', []);
    console.log('[OK] Version:', version);
    
    // 2. Autenticar como admin
    console.log('\n2. Autenticando como admin...');
    const uid = await xmlRpcCall('/xmlrpc/2/common', 'authenticate', [
      ODOO_DB,
      ODOO_USER,
      ODOO_PASSWORD,
      {}
    ]);
    
    if (!uid) {
      throw new Error('No se pudo autenticar como admin');
    }
    console.log('[OK] Autenticado exitosamente, UID:', uid);
    
    // 3. Buscar transportistas
    console.log('\n3. Buscando transportistas con is_delivery_carrier=true...');
    const carrierIds = await xmlRpcCall('/xmlrpc/2/object', 'execute_kw', [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      'res.partner',
      'search',
      [[['is_delivery_carrier', '=', true]]],
      { limit: 5 }
    ]);
    
    console.log('[OK] IDs de transportistas encontrados:', carrierIds);
    
    if (carrierIds && carrierIds.length > 0) {
      // 4. Leer datos de los transportistas
      console.log('\n4. Leyendo datos de transportistas...');
      
      for (const id of carrierIds) {
        const carrierData = await xmlRpcCall('/xmlrpc/2/object', 'execute_kw', [
          ODOO_DB,
          uid,
          ODOO_PASSWORD,
          'res.partner',
          'read',
          [[id]],
          { fields: ['id', 'name', 'carrier_phone', 'carrier_pin', 'phone', 'carrier_code'] }
        ]);
        
        console.log(`  - Transportista ID ${id} encontrado`);
      }
    }
    
    // 5. Buscar especificamente a Pedro Delivery
    console.log('\n5. Buscando a Pedro Delivery Test (53512345678)...');
    const pedroIds = await xmlRpcCall('/xmlrpc/2/object', 'execute_kw', [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      'res.partner',
      'search',
      [[
        ['is_delivery_carrier', '=', true],
        '|',
        ['carrier_phone', '=', '53512345678'],
        ['phone', '=', '53512345678']
      ]],
      { limit: 1 }
    ]);
    
    if (pedroIds && pedroIds.length > 0) {
      console.log('[OK] Pedro Delivery Test encontrado! ID:', pedroIds[0]);
      console.log('     Puedes usar estos datos para login:');
      console.log('     Telefono: 53512345678');
      console.log('     PIN: 1234');
    } else {
      console.log('[WARN] Pedro Delivery Test no encontrado con el telefono 53512345678');
    }
    
    console.log('\n========================================');
    console.log('PRUEBA COMPLETADA EXITOSAMENTE');
    console.log('========================================');
    
  } catch (error) {
    console.error('\n========================================');
    console.error('ERROR EN LA PRUEBA');
    console.error('========================================');
    console.error(error.message);
    console.error('\nVerifica que:');
    console.error('1. Odoo este corriendo en', ODOO_URL);
    console.error('2. La base de datos', ODOO_DB, 'exista');
    console.error('3. Las credenciales admin/admin123 sean correctas');
    console.error('4. El modulo woocommerce_delivery_cuba este instalado');
  }
}

// Ejecutar la prueba
testOdooConnection();
