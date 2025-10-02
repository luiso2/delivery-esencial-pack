/**
 * Script de prueba rápida para verificar compatibilidad
 * del proyecto Next.js con la API de distribuidores Odoo 17
 * 
 * Ejecutar: node scripts/test-compatibility.js
 */

const API_BASE = 'http://localhost:30017';
const CARRIER_ID = '73'; // Transportista de prueba confirmado

async function testApiCompatibility() {
    console.log('🚀 VERIFICANDO COMPATIBILIDAD API DISTRIBUIDORES\n');
    console.log('=' .repeat(60));
    
    const headers = {
        'X-Carrier-Id': CARRIER_ID,
        'Content-Type': 'application/json'
    };
    
    let successCount = 0;
    const totalTests = 6;
    
    try {
        // 1. Test Login
        console.log('\n1. 🔐 PROBANDO LOGIN');
        const loginResponse = await fetch(`${API_BASE}/api/v1/carrier/login`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "call",
                params: { phone: "555-1234", pin: "1234" }
            })
        });
        const loginData = await loginResponse.json();
        
        if (loginData.result && loginData.result.success) {
            console.log('   ✅ Login exitoso:', loginData.result.carrier?.name);
            successCount++;
        } else {
            console.log('   ❌ Login fallido:', loginData.error?.message);
        }
        
        // 2. Test Verificar Token
        console.log('\n2. 🔑 PROBANDO VERIFICAR TOKEN');
        const verifyResponse = await fetch(`${API_BASE}/api/v1/carrier/verify`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                jsonrpc: "2.0", id: 1, method: "call", params: {}
            })
        });
        const verifyData = await verifyResponse.json();
        
        if (verifyData.result) {
            console.log('   ✅ Verificación de token operativa');
            successCount++;
        } else {
            console.log('   ❌ Verificación fallida');
        }
        
        // 3. Test Pedidos
        console.log('\n3. 📦 PROBANDO PEDIDOS ASIGNADOS');
        const ordersResponse = await fetch(`${API_BASE}/api/v1/carrier/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                jsonrpc: "2.0", id: 1, method: "call", params: {}
            })
        });
        const ordersData = await ordersResponse.json();
        
        if (ordersData.result) {
            const orders = ordersData.result.orders || [];
            console.log(`   ✅ Endpoint pedidos operativo: ${orders.length} pedidos`);
            successCount++;
        } else {
            console.log('   ❌ Endpoint pedidos fallido');
        }
        
        // 4. Test Actualizar Ubicación
        console.log('\n4. 📍 PROBANDO ACTUALIZAR UBICACIÓN');
        const locationResponse = await fetch(`${API_BASE}/api/v1/carrier/location`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                jsonrpc: "2.0", id: 1, method: "call",
                params: { 
                    latitude: 23.1136,  // La Habana
                    longitude: -82.3666 
                }
            })
        });
        const locationData = await locationResponse.json();
        
        if (locationData.result && locationData.result.success) {
            console.log('   ✅ Actualización de ubicación GPS operativa');
            successCount++;
        } else {
            console.log('   ❌ Actualización de ubicación fallida');
        }
        
        // 5. Test Estadísticas
        console.log('\n5. 📊 PROBANDO ESTADÍSTICAS');
        const statsResponse = await fetch(`${API_BASE}/api/v1/carrier/stats`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                jsonrpc: "2.0", id: 1, method: "call", params: {}
            })
        });
        const statsData = await statsResponse.json();
        
        if (statsData.result) {
            const stats = statsData.result;
            console.log(`   ✅ Estadísticas operativas: ${stats.total_orders || 0} pedidos, ${stats.delivered_orders || 0} entregados`);
            successCount++;
        } else {
            console.log('   ❌ Estadísticas fallidas');
        }
        
        // 6. Test Conexión Odoo
        console.log('\n6. 🔗 PROBANDO CONEXIÓN ODOO');
        const odooResponse = await fetch(`${API_BASE}/web/database/list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        
        if (odooResponse.ok) {
            console.log('   ✅ Conexión a Odoo operativa');
            successCount++;
        } else {
            console.log('   ❌ Conexión a Odoo fallida');
        }
        
    } catch (error) {
        console.log('\n❌ ERROR GENERAL:', error.message);
    }
    
    // Resultado final
    console.log('\n' + '='.repeat(60));
    console.log('📋 RESUMEN DE COMPATIBILIDAD');
    console.log('='.repeat(60));
    
    const compatibility = (successCount / totalTests) * 100;
    
    console.log(`✅ Tests exitosos: ${successCount}/${totalTests}`);
    console.log(`📊 Compatibilidad: ${compatibility.toFixed(1)}%`);
    
    if (compatibility >= 90) {
        console.log('🎉 ESTADO: TOTALMENTE COMPATIBLE');
        console.log('🚀 ACCIÓN: Listo para usar');
    } else if (compatibility >= 70) {
        console.log('⚠️  ESTADO: MAYORMENTE COMPATIBLE');  
        console.log('🔧 ACCIÓN: Actualizaciones menores necesarias');
    } else {
        console.log('❌ ESTADO: REQUIERE ACTUALIZACIONES');
        console.log('🛠️  ACCIÓN: Revisión y correcciones necesarias');
    }
    
    console.log('\n📁 Para detalles completos, ver: COMPATIBILITY_ANALYSIS.md');
    console.log('⏰ Generado:', new Date().toLocaleString());
}

// Ejecutar test
testApiCompatibility()
    .then(() => {
        console.log('\n✅ Test de compatibilidad completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error en test de compatibilidad:', error);
        process.exit(1);
    });