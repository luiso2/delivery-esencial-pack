// Proxy API para evitar problemas de CORS con Odoo
import { NextRequest, NextResponse } from 'next/server';

// Puerto correcto de Odoo local en Docker
const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:8069';

// Mapeo de endpoints que necesitan formato JSON-RPC
const JSON_RPC_ENDPOINTS = [
  'delivery/login',
  'delivery/login_simple',
  'delivery/debug',
  'delivery/debug_pickings',
  'delivery/pickings/today',
  'delivery/location/update',
  'delivery/status/update',
  'delivery/orders',
  'delivery/captures',
  'delivery/routes',
  'delivery/metrics',
  'delivery/incident/create',
  'delivery/incident/list',
];

function needsJsonRpc(path: string): boolean {
  return JSON_RPC_ENDPOINTS.some(endpoint => path.includes(endpoint));
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    let body = await request.json();
    
    console.log(`[Proxy] Processing request to: /api/${path}`);
    console.log('[Proxy] Original body:', body);
    
    // Construir headers para Odoo
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Obtener carrier ID del token (Authorization header)
    const authHeader = request.headers.get('authorization');
    let carrierId: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Por ahora usar el ID 43 de Luis para testing
      // En producción esto debería venir de una sesión o JWT
      carrierId = '43';
    }
    
    // Pasar headers personalizados si existen
    const xCarrierId = request.headers.get('x-carrier-id') || carrierId;
    const xToken = request.headers.get('x-token');
    
    if (xCarrierId) headers['X-Carrier-Id'] = xCarrierId;
    if (xToken) headers['X-Token'] = xToken;
    
    // Envolver en formato JSON-RPC si es necesario
    if (needsJsonRpc(path)) {
      // Si ya viene en formato JSON-RPC, no modificar
      if (!body.jsonrpc) {
        body = {
          jsonrpc: "2.0",
          method: "call",
          params: body,
          id: Date.now()
        };
      }
    }
    
    console.log('[Proxy] Final body to Odoo:', body);
    console.log('[Proxy] Headers:', headers);
    
    // Hacer la petición a Odoo
    const odooUrl = `${ODOO_URL}/api/${path}`;
    console.log('[Proxy] Calling Odoo URL:', odooUrl);
    
    const odooResponse = await fetch(odooUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    const responseText = await odooResponse.text();
    console.log('[Proxy] Odoo response status:', odooResponse.status);
    console.log('[Proxy] Odoo response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('[Proxy] Failed to parse JSON:', e);
      data = { error: 'Invalid JSON response', raw: responseText };
    }
    
    // Si la respuesta tiene formato JSON-RPC, extraer el resultado
    if (data.jsonrpc && data.result) {
      data = data.result;
    } else if (data.jsonrpc && data.error) {
      // Si hay un error JSON-RPC, devolverlo como error
      return NextResponse.json(
        { 
          error: data.error.message || 'Odoo error',
          details: data.error.data 
        },
        { status: 500 }
      );
    }
    
    // Devolver la respuesta con headers CORS correctos
    return NextResponse.json(data, {
      status: odooResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Carrier-Id, X-Token',
      },
    });
  } catch (error: any) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    
    console.log(`[Proxy] GET request to: /api/${path}`);
    
    // Construir headers para Odoo
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    // Obtener carrier ID del token
    const authHeader = request.headers.get('authorization');
    let carrierId: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      carrierId = '43'; // Luis para testing
    }
    
    if (carrierId) headers['X-Carrier-Id'] = carrierId;
    
    // Hacer la petición a Odoo
    const odooUrl = `${ODOO_URL}/api/${path}`;
    console.log('[Proxy] Calling Odoo URL:', odooUrl);
    
    const odooResponse = await fetch(odooUrl, {
      method: 'GET',
      headers,
    });
    
    const responseText = await odooResponse.text();
    console.log('[Proxy] Odoo GET response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // Si no es JSON, devolver como texto
      data = { message: responseText };
    }
    
    return NextResponse.json(data, {
      status: odooResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Carrier-Id, X-Token',
      },
    });
  } catch (error: any) {
    console.error('[Proxy] GET Error:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Carrier-Id, X-Token',
    },
  });
}
