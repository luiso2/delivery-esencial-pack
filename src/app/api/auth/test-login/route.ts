import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[test-login] Test endpoint called');
  
  try {
    const { phone, pin } = await request.json();
    
    console.log('[test-login] Phone:', phone, 'PIN:', pin);
    
    // Test simple sin XML-RPC
    if (phone === '53512345678' && pin === '1234') {
      console.log('[test-login] Credentials match, returning success');
      
      return NextResponse.json({
        success: true,
        token: 'test-token-123',
        carrier: {
          id: 94,
          name: 'Pedro Delivery Test',
          code: 'PDT001',
          vehicle_type: 'car',
          zones: [],
          phone: phone
        }
      });
    } else {
      console.log('[test-login] Invalid credentials');
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('[test-login] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
}
