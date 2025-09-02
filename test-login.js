// Test del endpoint de login
async function testLogin() {
  try {
    console.log('🔄 Probando login endpoint...');
    
    const response = await fetch('http://localhost:8080/api/auth/carrier-login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '53512345678',
        pin: '1234'
      })
    });
    
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📱 Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Login exitoso!');
      console.log('👤 Transportista:', data.carrier.name);
      console.log('🔑 Token:', data.token.substring(0, 10) + '...');
    } else {
      console.log('❌ Login fallido:', data.error);
      if (data.details) {
        console.log('📝 Detalles:', data.details);
      }
    }
    
  } catch (error) {
    console.error('💥 Error en la prueba:', error.message);
  }
}

testLogin();
