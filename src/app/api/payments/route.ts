import { NextRequest, NextResponse } from 'next/server';
import { mockPayments, weeklyPaymentHistory, paymentMethodSummary } from '@/data/mockPayments';
import { mockOrders } from '@/data/mockOrders';
import { Payment } from '@/types/payment';

// Simulate database
let payments = [...mockPayments];

// GET /api/payments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const includeOrders = searchParams.get('includeOrders') === 'true';

    let filteredPayments = [...payments];

    // Apply filters
    if (status) {
      filteredPayments = filteredPayments.filter(payment => payment.status === status);
    }

    if (method) {
      filteredPayments = filteredPayments.filter(payment => payment.method === method);
    }

    // Include order details if requested
    if (includeOrders) {
      filteredPayments = filteredPayments.map(payment => {
        const order = mockOrders.find(o => o.id === payment.orderId);
        return {
          ...payment,
          order
        };
      });
    }

    // Calculate summary
    const totalPending = filteredPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalCompleted = filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalCancelled = filteredPayments
      .filter(p => p.status === 'cancelled')
      .reduce((sum, p) => sum + p.amount, 0);

    const response = {
      payments: filteredPayments,
      summary: {
        totalPending,
        totalCompleted,
        totalCancelled,
        totalAmount: totalPending + totalCompleted,
        pendingCount: filteredPayments.filter(p => p.status === 'pending').length,
        completedCount: filteredPayments.filter(p => p.status === 'completed').length,
        cancelledCount: filteredPayments.filter(p => p.status === 'cancelled').length
      },
      weeklyHistory: weeklyPaymentHistory,
      methodSummary: paymentMethodSummary
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching payments' },
      { status: 500 }
    );
  }
}

// POST /api/payments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPayment: Payment = {
      ...body,
      id: `PAY-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    payments.push(newPayment);

    return NextResponse.json(
      { success: true, data: newPayment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error creating payment' },
      { status: 500 }
    );
  }
}