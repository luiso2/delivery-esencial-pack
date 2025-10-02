// Test para verificar variables de entorno
console.log('=== VARIABLES DE ENTORNO ===');
console.log('ODOO_URL:', process.env.ODOO_URL);
console.log('ODOO_DB:', process.env.ODOO_DB);
console.log('ODOO_USER:', process.env.ODOO_USER);
console.log('ODOO_PASSWORD:', process.env.ODOO_PASSWORD);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('==============================');

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    env: {
      ODOO_URL: process.env.ODOO_URL,
      ODOO_DB: process.env.ODOO_DB,
      ODOO_USER: process.env.ODOO_USER,
      ODOO_PASSWORD: process.env.ODOO_PASSWORD ? '***HIDDEN***' : 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV
    }
  });
}
