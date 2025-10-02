import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Configuración de Odoo
const ODOO_URL = process.env.ODOO_URL || 'http://localhost:8069';
const ODOO_DB = process.env.ODOO_DB || 'odoo';

// Generar token único
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, pin } = body;
    
    console.log('[carrier-login] ========================================');
    console.log('[carrier-login] Iniciando autenticación SIMPLIFICADA');
    console.log('[carrier-login] Teléfono:', phone);
    console.log('[carrier-login] Odoo URL:', ODOO_URL);
    console.log('[carrier-login] Database:', ODOO_DB);
    
    // Validar entrada
    if (!phone || !pin) {
      return NextResponse.json(
        { success: false, error: 'Teléfono y PIN son requeridos' },
        { status: 400 }
      );
    }

    // Limpiar el número de teléfono
    const cleanPhone = phone.trim().replace(/[\s\-+]/g, '');
    console.log('[carrier-login] Teléfono limpio:', cleanPhone);

    try {
      // Hacer llamada directa al endpoint de Odoo
      console.log('[carrier-login] Llamando a Odoo directamente...');

      const odooResponse = await fetch(`${ODOO_URL}/api/v2/delivery/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            phone: cleanPhone,
            pin: pin
          },
          id: 1
        })
      });

      // Log response details
      console.log('[carrier-login] Response status:', odooResponse.status);
      console.log('[carrier-login] Response headers:', odooResponse.headers);

      const responseText = await odooResponse.text();
      console.log('[carrier-login] Raw response (first 500 chars):', responseText.substring(0, 500));

      // Check if response is HTML
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        console.error('[carrier-login] Received HTML response instead of JSON');
        return NextResponse.json(
          {
            success: false,
            error: 'Error de configuración del servidor',
            details: 'El servidor devolvió HTML en lugar de JSON'
          },
          { status: 500 }
        );
      }

      let odooData;
      try {
        odooData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[carrier-login] Error parsing JSON:', parseError);
        return NextResponse.json(
          {
            success: false,
            error: 'Error procesando respuesta del servidor',
            details: 'Respuesta inválida del servidor'
          },
          { status: 500 }
        );
      }

      console.log('[carrier-login] Parsed response:', odooData);

      // Verificar si hubo error en Odoo
      if (odooData.error) {
        console.error('[carrier-login] Error de Odoo:', odooData.error);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Error al autenticar con Odoo',
            details: odooData.error.message || odooData.error.data?.message
          },
          { status: 401 }
        );
      }

      // Verificar si la respuesta fue exitosa
      if (odooData.result && odooData.result.success) {
        const result = odooData.result;
        console.log('[carrier-login] Login exitoso!');
        
        // Preparar respuesta para Next.js
        const response = {
          success: true,
          token: result.token || generateToken(),
          carrier: {
            id: result.carrier.id,
            name: result.carrier.name,
            code: result.carrier.code || 'N/A',
            vehicle_type: result.carrier.vehicle_type || 'car',
            zones: result.carrier.zones || [],
            phone: cleanPhone
          }
        };

        console.log('[carrier-login] Enviando respuesta exitosa');
        return NextResponse.json(response);
        
      } else if (odooData.result && !odooData.result.success) {
        // Login falló
        console.log('[carrier-login] Login falló:', odooData.result.error);
        return NextResponse.json(
          { 
            success: false, 
            error: odooData.result.error || 'Credenciales incorrectas'
          },
          { status: 401 }
        );
      } else {
        // Respuesta inesperada
        console.error('[carrier-login] Respuesta inesperada de Odoo');
        return NextResponse.json(
          { 
            success: false, 
            error: 'Respuesta inesperada del servidor'
          },
          { status: 500 }
        );
      }

    } catch (fetchError: any) {
      console.error('[carrier-login] Error al conectar con Odoo:', fetchError);
      
      // Si Odoo no está disponible, usar datos de prueba solo para desarrollo
      if (process.env.NODE_ENV === 'development' && cleanPhone === '53512345678' && pin === '1234') {
        console.warn('[carrier-login] Usando datos simulados para desarrollo');
        
        const token = generateToken();
        return NextResponse.json({
          success: true,
          token: token,
          carrier: {
            id: 10,
            name: 'Transportista Test Automático',
            code: 'TEST001',
            vehicle_type: 'motorcycle',
            zones: [],
            phone: cleanPhone
          }
        });
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se pudo conectar con Odoo',
          details: fetchError.message 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('[carrier-login] Error general:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error del servidor',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Endpoint para verificar el estado del token  
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    valid: true, 
    message: 'Endpoint de verificación disponible',
    odooUrl: ODOO_URL,
    database: ODOO_DB
  });
}
