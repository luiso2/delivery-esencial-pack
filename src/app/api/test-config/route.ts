import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Devolver las variables de configuración (sin mostrar la contraseña completa)
  return NextResponse.json({
    ODOO_URL: process.env.ODOO_URL,
    ODOO_DB: process.env.ODOO_DB,
    ODOO_USER: process.env.ODOO_USER,
    ODOO_PASSWORD: process.env.ODOO_PASSWORD ? '***' + process.env.ODOO_PASSWORD.slice(-3) : 'NO_SET',
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
  });
}
