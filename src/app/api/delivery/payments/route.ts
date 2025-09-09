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

    // Por ahora usar el ID 43 de Luis para testing
    const carrierId = '43';
    
    // Preparar el body para Odoo
    const body = {
      jsonrpc: "2.0",
      method: "call",
      params: {},
      id: Date.now()
    };

    // Hacer la petición a Odoo
    const odooResponse = await fetch(`${ODOO_URL}/api/delivery/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Carrier-Id': carrierId
      },
      body: JSON.stringify(body)
    });

    const odooData = await odooResponse.json();
    
    // Si la respuesta tiene formato JSON-RPC, extraer el resultado
    if (odooData.jsonrpc && odooData.result) {
      const result = odooData.result;
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Error obteniendo pagos' },
          { status: 500 }
        );
      }
      
      // Devolver los datos de Odoo
      return NextResponse.json({
        success: true,
        payments: result.payments || [],
        totals: result.totals || {
          pending: 0,
          completed: 0,
          total: 0
        },
        message: result.message || 'Datos de pagos obtenidos correctamente'
      });
    } else if (odooData.jsonrpc && odooData.error) {
      // Si hay un error JSON-RPC
      return NextResponse.json(
        { 
          error: odooData.error.message || 'Error de Odoo',
          details: odooData.error.data 
        },
        { status: 500 }
      );
    }

    // Si no hay datos, devolver estructura vacía
    return NextResponse.json({
      success: true,
      payments: [],
      totals: {
        pending: 0,
        completed: 0,
        total: 0
      },
      message: 'No hay pagos registrados'
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

    // Por ahora usar el ID 43 de Luis para testing
    const carrierId = '43';

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
