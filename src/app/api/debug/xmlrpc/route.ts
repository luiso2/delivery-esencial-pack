import { NextRequest, NextResponse } from 'next/server';

// Configuración de Odoo desde variables de entorno
const ODOO_URL = process.env.ODOO_URL || 'http://localhost:30017';
const ODOO_DB = process.env.ODOO_DB || 'odoo17_db';
const ODOO_USER = process.env.ODOO_USER || 'admin';
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || 'admin123';

export async function GET(request: NextRequest) {
  console.log('=== TEST XML-RPC ===');
  console.log('URL:', ODOO_URL);
  console.log('DB:', ODOO_DB);
  console.log('User:', ODOO_USER);
  console.log('Pass:', ODOO_PASSWORD ? 'SET' : 'NOT SET');
  
  // Crear XML request manualmente
  const xmlRequest = `<?xml version="1.0"?>
<methodCall>
  <methodName>authenticate</methodName>
  <params>
    <param><value><string>${ODOO_DB}</string></value></param>
    <param><value><string>${ODOO_USER}</string></value></param>
    <param><value><string>${ODOO_PASSWORD}</string></value></param>
    <param><value><struct></struct></value></param>
  </params>
</methodCall>`;

  console.log('XML Request:', xmlRequest);
  
  try {
    console.log('Enviando request a:', `${ODOO_URL}/xmlrpc/2/common`);
    
    const response = await fetch(`${ODOO_URL}/xmlrpc/2/common`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'Accept': 'text/xml',
      },
      body: xmlRequest,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const xmlResponse = await response.text();
    console.log('XML Response:', xmlResponse);
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      xmlRequest,
      xmlResponse,
      config: {
        ODOO_URL,
        ODOO_DB,
        ODOO_USER,
        hasPassword: !!ODOO_PASSWORD
      }
    });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      config: {
        ODOO_URL,
        ODOO_DB,
        ODOO_USER,
        hasPassword: !!ODOO_PASSWORD
      }
    });
  }
}
