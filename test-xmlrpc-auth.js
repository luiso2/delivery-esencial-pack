/**
 * Test directo de autenticación XML-RPC con Odoo
 */

const xmlrpc = require('xmlrpc');

// Configuración correcta
const ODOO_URL = 'http://localhost:8069';
const ODOO_DB = 'odoo';
const ODOO_USER = 'lbencomo94@gmail.com';
const ODOO_PASSWORD = 'admin';

console.log('🔧 TEST DE AUTENTICACIÓN XML-RPC CON ODOO');
console.log('=' .repeat(60));
console.log('📍 URL:', ODOO_URL);
console.log('📍 Database:', ODOO_DB);
console.log('📍 Usuario:', ODOO_USER);
console.log('=' .repeat(60));

// Test 1: Autenticación admin
console.log('\n📡 Test 1: Autenticación como admin...');

const client = xmlrpc.createClient({
    url: `${ODOO_URL}/xmlrpc/2/common`,
    path: '/xmlrpc/2/common'
});

client.methodCall('authenticate', [
    ODOO_DB,
    ODOO_USER,
    ODOO_PASSWORD,
    {}
], (err, uid) => {
    if (err) {
        console.log('   ❌ Error de autenticación:', err.message);
        console.log('\n💡 Verificar:');
        console.log('   1. Odoo está corriendo en puerto 8069');
        console.log('   2. Las credenciales son correctas');
        console.log('   3. La base de datos "odoo" existe');
        return;
    }
    
    console.log('   ✅ Autenticación exitosa!');
    console.log('   UID:', uid);
    
    // Test 2: Buscar transportista
    console.log('\n📡 Test 2: Buscando transportista...');
    
    const objectClient = xmlrpc.createClient({
        url: `${ODOO_URL}/xmlrpc/2/object`,
        path: '/xmlrpc/2/object'
    });
    
    objectClient.methodCall('execute_kw', [
        ODOO_DB,
        uid,
        ODOO_PASSWORD,
        'res.partner',
        'search',
        [[['phone', '=', '53512345678']]],
        { limit: 1 }
    ], (err2, carrierIds) => {
        if (err2) {
            console.log('   ❌ Error buscando transportista:', err2.message);
            return;
        }
        
        if (!carrierIds || carrierIds.length === 0) {
            console.log('   ❌ No se encontró transportista con teléfono 53512345678');
            return;
        }
        
        console.log('   ✅ Transportista encontrado!');
        console.log('   ID:', carrierIds[0]);
        
        // Test 3: Leer datos del transportista
        console.log('\n📡 Test 3: Leyendo datos del transportista...');
        
        objectClient.methodCall('execute_kw', [
            ODOO_DB,
            uid,
            ODOO_PASSWORD,
            'res.partner',
            'read',
            [[carrierIds[0]]],
            {
                fields: [
                    'id', 'name', 'carrier_code', 'carrier_phone',
                    'carrier_pin', 'carrier_vehicle_type', 'phone',
                    'is_delivery_carrier'
                ]
            }
        ], (err3, carriers) => {
            if (err3) {
                console.log('   ❌ Error leyendo datos:', err3.message);
                return;
            }
            
            if (!carriers || carriers.length === 0) {
                console.log('   ❌ No se pudieron leer los datos');
                return;
            }
            
            const carrier = carriers[0];
            console.log('   ✅ Datos obtenidos:');
            console.log('   - ID:', carrier.id);
            console.log('   - Nombre:', carrier.name);
            console.log('   - Teléfono:', carrier.carrier_phone || carrier.phone);
            console.log('   - PIN:', carrier.carrier_pin);
            console.log('   - Código:', carrier.carrier_code);
            console.log('   - Vehículo:', carrier.carrier_vehicle_type);
            console.log('   - Es transportista:', carrier.is_delivery_carrier);
            
            // Test 4: Verificar PIN
            console.log('\n📡 Test 4: Verificando PIN...');
            const testPin = '1234';
            
            if (String(carrier.carrier_pin) === testPin) {
                console.log('   ✅ PIN correcto!');
                console.log('\n🎉 TODOS LOS TESTS PASARON');
                console.log('   El sistema de autenticación funciona correctamente');
            } else {
                console.log('   ❌ PIN incorrecto');
                console.log('   PIN en BD:', carrier.carrier_pin);
                console.log('   PIN esperado:', testPin);
            }
            
            console.log('\n' + '=' .repeat(60));
            console.log('🏁 FIN DEL TEST');
            console.log('=' .repeat(60));
        });
    });
});
