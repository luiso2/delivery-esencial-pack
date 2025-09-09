'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Next.js está funcionando correctamente!
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-800 mb-2">Información del Sistema:</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>📍 Puerto: 3001</li>
              <li>📂 Ubicación: C:\Esencial Pack\addons\addons\entregas-esencialpack</li>
              <li>🚀 Framework: Next.js 14.0.4</li>
              <li>⚛️ React: Con TypeScript</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="font-semibold text-yellow-800 mb-2">Endpoints de Odoo:</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🔐 Login: POST /api/delivery/login/fixed</li>
              <li>📦 Órdenes: GET /api/delivery/orders</li>
              <li>👤 Perfil: GET /api/delivery/profile</li>
              <li>📊 Métricas: GET /api/delivery/metrics</li>
            </ul>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Credenciales de Prueba:</h2>
            <code className="text-sm bg-gray-200 p-2 rounded block">
              Phone: 53512345678<br/>
              PIN: 1234
            </code>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Ir a Login
            </button>
            <button 
              onClick={async () => {
                try {
                  const res = await fetch('http://localhost:8069/api/delivery/login/fixed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      jsonrpc: '2.0',
                      method: 'call',
                      params: { phone: '53512345678', pin: '1234' },
                      id: 1
                    })
                  });
                  const data = await res.json();
                  alert(JSON.stringify(data, null, 2));
                } catch (error) {
                  alert('Error: ' + error);
                }
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Test API Odoo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}