// API Route para manejar pagos del transportista - Conecta con Odoo
import { NextRequest, NextResponse } from 'next/server';

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'http://localhost:8069';

export async function GET(request: NextRequest) {
  try {
    // Obtener el token del header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener carrier ID del header de autenticación
    const carrierId = request.headers.get('x-carrier-id');

    if (!carrierId) {
      return NextResponse.json(
        { error: 'Carrier ID requerido para obtener pagos' },
        { status: 401 }
      );
    }

    // Hacer la petición al nuevo endpoint V2 de pagos
    const odooResponse = await fetch(`${ODOO_URL}/api/v2/delivery/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        carrier_id: carrierId,
        period: 'month'
      })
    });

    const odooData = await odooResponse.json();

    if (!odooData.success) {
      return NextResponse.json(
        { error: odooData.error || 'Error obteniendo pagos' },
        { status: 500 }
      );
    }

    // Devolver los datos de pagos con comisiones reales
    return NextResponse.json({
      success: true,
      payments: odooData.payments || [],
      totals: odooData.totals || {
        pending_amount: 0,
        total_delivered: 0,
        total_earnings: 0,
        payment_count: 0
      },
      carrier: odooData.carrier || {},
      period: odooData.period || 'month',
      message: 'Datos de pagos obtenidos correctamente'
    });

  } catch (error: any) {
    console.error('[Payments API] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}

// Endpoint para obtener detalles de un pago específico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, action } = body;

    // Obtener carrier ID del header de autenticación
    const authHeader = request.headers.get('authorization');
    const carrierId = request.headers.get('x-carrier-id');

    if (!carrierId) {
      return NextResponse.json(
        { error: 'Carrier ID requerido para esta operación' },
        { status: 401 }
      );
    }

    if (action === 'summary') {
      // Obtener resumen de pagos
      const odooBody = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          period: body.period || 'month'
        },
        id: Date.now()
      };

      const odooResponse = await fetch(`${ODOO_URL}/api/delivery/payment/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Carrier-Id': carrierId
        },
        body: JSON.stringify(odooBody)
      });

      const odooData = await odooResponse.json();
      
      if (odooData.jsonrpc && odooData.result) {
        return NextResponse.json(odooData.result);
      }
      
      return NextResponse.json({
        success: false,
        error: 'Error obteniendo resumen'
      });
      
    } else if (action === 'pending-deliveries') {
      // Obtener entregas pendientes de pago
      const odooBody = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          date_from: body.date_from,
          date_to: body.date_to
        },
        id: Date.now()
      };

      const odooResponse = await fetch(`${ODOO_URL}/api/delivery/payment/pending-deliveries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Carrier-Id': carrierId
        },
        body: JSON.stringify(odooBody)
      });

      const odooData = await odooResponse.json();
      
      if (odooData.jsonrpc && odooData.result) {
        return NextResponse.json(odooData.result);
      }
      
      return NextResponse.json({
        success: false,
        error: 'Error obteniendo entregas pendientes'
      });
      
    } else if (paymentId) {
      // Obtener detalles de un pago específico
      const odooBody = {
        jsonrpc: "2.0",
        method: "call",
        params: {},
        id: Date.now()
      };

      const odooResponse = await fetch(`${ODOO_URL}/api/delivery/payment/${paymentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Carrier-Id': carrierId
        },
        body: JSON.stringify(odooBody)
      });

      const odooData = await odooResponse.json();
      
      if (odooData.jsonrpc && odooData.result) {
        return NextResponse.json(odooData.result);
      }
      
      return NextResponse.json({
        success: false,
        error: 'Pago no encontrado'
      });
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('[Payment Details API] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
