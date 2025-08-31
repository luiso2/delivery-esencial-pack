// Proxy API para evitar problemas de CORS con Odoo
import { NextRequest, NextResponse } from 'next/server';

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:30017';

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    const body = await request.json();
    
    // Construir headers para Odoo
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Pasar headers personalizados si existen
    const xCarrierId = request.headers.get('x-carrier-id');
    const xToken = request.headers.get('x-token');
    
    if (xCarrierId) headers['X-Carrier-Id'] = xCarrierId;
    if (xToken) headers['X-Token'] = xToken;
    
    // Hacer la petición a Odoo
    const odooResponse = await fetch(`${ODOO_URL}/api/${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    const data = await odooResponse.json();
    
    // Devolver la respuesta con headers CORS correctos
    return NextResponse.json(data, {
      status: odooResponse.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Carrier-Id, X-Token',
      },
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Carrier-Id, X-Token',
    },
  });
}
