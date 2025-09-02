/**
 * Script de prueba manual para navegación de la aplicación
 * Entregas Esencial Pack - Sistema de Delivery
 */

const axios = require('axios');
const fs = require('fs');

// Configuración base
const BASE_URL = 'http://localhost:8080';
const API_BASE = 'http://localhost:8080/api';

// Credenciales de prueba
const TEST_CREDENTIALS = {
  email: 'admin@test.com',
  password: 'admin123',
  pin: '1234'
};

// Páginas a probar
const PAGES_TO_TEST = [
  { name: 'Login', path: '/login', requiresAuth: false },
  { name: 'Dashboard', path: '/', requiresAuth: true },
  { name: 'Pedidos', path: '/pedidos', requiresAuth: true },
  { name: 'Rutas', path: '/rutas', requiresAuth: true },
  { name: 'Capturas', path: '/capturas', requiresAuth: true },
  { name: 'Pagos', path: '/pagos', requiresAuth: true },
  { name: 'Perfil', path: '/perfil', requiresAuth: true }
];

// APIs a probar
const APIS_TO_TEST = [
  { name: 'Login API', endpoint: '/api/auth/login', method: 'POST' },
  { name: 'Orders API', endpoint: '/api/delivery/orders', method: 'GET' },
  { name: 'Routes API', endpoint: '/api/delivery/routes', method: 'GET' },
  { name: 'Captures API', endpoint: '/api/delivery/captures', method: 'GET' },
  { name: 'Payments API', endpoint: '/api/delivery/payments', method: 'GET' },
  { name: 'Profile API', endpoint: '/api/delivery/profile', method: 'GET' }
];

class NavigationTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      pages: [],
      apis: [],
      summary: {
        total_pages: PAGES_TO_TEST.length,
        pages_working: 0,
        pages_failing: 0,
        total_apis: APIS_TO_TEST.length,
        apis_working: 0,
        apis_failing: 0
      }
    };
    this.authToken = null;
  }

  async testLogin() {
    console.log('🔐 Probando login...');
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: TEST_CREDENTIALS.email,
        password: TEST_CREDENTIALS.password
      });
      
      if (response.data.token) {
        this.authToken = response.data.token;
        console.log('✅ Login exitoso');
        return true;
      } else {
        console.log('❌ Login falló - No se recibió token');
        return false;
      }
    } catch (error) {
      console.log('❌ Login falló:', error.message);
      return false;
    }
  }

  async testPage(page) {
    console.log(`📄 Probando página: ${page.name} (${page.path})`);
    
    const result = {
      name: page.name,
      path: page.path,
      status: 'unknown',
      response_time: 0,
      error: null,
      requires_auth: page.requiresAuth
    };

    const startTime = Date.now();
    
    try {
      const headers = {};
      if (page.requiresAuth && this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`;
      }

      const response = await axios.get(`${BASE_URL}${page.path}`, {
        headers,
        timeout: 10000,
        validateStatus: (status) => status < 500 // Aceptar redirects
      });

      result.response_time = Date.now() - startTime;
      
      if (response.status === 200) {
        result.status = 'working';
        console.log(`✅ ${page.name} - OK (${result.response_time}ms)`);
        this.results.summary.pages_working++;
      } else if (response.status === 302 || response.status === 401) {
        result.status = 'redirect';
        result.error = `Redirect/Auth required (${response.status})`;
        console.log(`🔄 ${page.name} - Redirect (${response.status})`);
        this.results.summary.pages_working++; // Redirect es normal para auth
      } else {
        result.status = 'error';
        result.error = `HTTP ${response.status}`;
        console.log(`⚠️ ${page.name} - Error ${response.status}`);
        this.results.summary.pages_failing++;
      }
    } catch (error) {
      result.response_time = Date.now() - startTime;
      result.status = 'error';
      result.error = error.message;
      console.log(`❌ ${page.name} - Error: ${error.message}`);
      this.results.summary.pages_failing++;
    }

    this.results.pages.push(result);
    return result;
  }

  async testAPI(api) {
    console.log(`🔌 Probando API: ${api.name} (${api.endpoint})`);
    
    const result = {
      name: api.name,
      endpoint: api.endpoint,
      method: api.method,
      status: 'unknown',
      response_time: 0,
      error: null
    };

    const startTime = Date.now();
    
    try {
      const headers = {};
      if (this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`;
      }

      let response;
      if (api.method === 'POST' && api.endpoint.includes('login')) {
        response = await axios.post(`${BASE_URL}${api.endpoint}`, {
          email: TEST_CREDENTIALS.email,
          password: TEST_CREDENTIALS.password
        });
      } else {
        response = await axios[api.method.toLowerCase()](`${BASE_URL}${api.endpoint}`, {
          headers,
          timeout: 10000
        });
      }

      result.response_time = Date.now() - startTime;
      
      if (response.status === 200) {
        result.status = 'working';
        console.log(`✅ ${api.name} - OK (${result.response_time}ms)`);
        this.results.summary.apis_working++;
      } else {
        result.status = 'error';
        result.error = `HTTP ${response.status}`;
        console.log(`⚠️ ${api.name} - Error ${response.status}`);
        this.results.summary.apis_failing++;
      }
    } catch (error) {
      result.response_time = Date.now() - startTime;
      result.status = 'error';
      result.error = error.message;
      console.log(`❌ ${api.name} - Error: ${error.message}`);
      this.results.summary.apis_failing++;
    }

    this.results.apis.push(result);
    return result;
  }

  async runAllTests() {
    console.log('🚀 Iniciando pruebas de navegación...');
    console.log('='.repeat(50));

    // Probar login primero
    const loginSuccess = await this.testLogin();
    
    console.log('\n📄 PROBANDO PÁGINAS...');
    console.log('-'.repeat(30));
    
    // Probar todas las páginas
    for (const page of PAGES_TO_TEST) {
      await this.testPage(page);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre requests
    }

    console.log('\n🔌 PROBANDO APIs...');
    console.log('-'.repeat(30));
    
    // Probar todas las APIs
    for (const api of APIS_TO_TEST) {
      await this.testAPI(api);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre requests
    }

    // Generar reporte
    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 GENERANDO REPORTE...');
    console.log('=' .repeat(50));

    const report = {
      ...this.results,
      generated_at: new Date().toISOString()
    };

    // Guardar reporte en archivo
    const reportPath = './navigation-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Mostrar resumen en consola
    console.log('\n📈 RESUMEN DE RESULTADOS:');
    console.log(`📄 Páginas: ${this.results.summary.pages_working}/${this.results.summary.total_pages} funcionando`);
    console.log(`🔌 APIs: ${this.results.summary.apis_working}/${this.results.summary.total_apis} funcionando`);
    
    console.log('\n📄 ESTADO DE PÁGINAS:');
    this.results.pages.forEach(page => {
      const icon = page.status === 'working' ? '✅' : page.status === 'redirect' ? '🔄' : '❌';
      console.log(`${icon} ${page.name} (${page.path}) - ${page.status} ${page.response_time}ms`);
      if (page.error) console.log(`   Error: ${page.error}`);
    });

    console.log('\n🔌 ESTADO DE APIs:');
    this.results.apis.forEach(api => {
      const icon = api.status === 'working' ? '✅' : '❌';
      console.log(`${icon} ${api.name} (${api.endpoint}) - ${api.status} ${api.response_time}ms`);
      if (api.error) console.log(`   Error: ${api.error}`);
    });

    console.log(`\n📁 Reporte completo guardado en: ${reportPath}`);
    
    return report;
  }
}

// Ejecutar pruebas
if (require.main === module) {
  const tester = new NavigationTester();
  tester.runAllTests().catch(console.error);
}

module.exports = NavigationTester;