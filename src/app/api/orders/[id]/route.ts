import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/data/mockOrders';
import { Order, canTransitionToStatus } from '@/types/order';

// Simulate database
let orders = [...mockOrders];

// GET /api/orders/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = orders.find(o => o.id === params.id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const orderIndex = orders.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const currentOrder = orders[orderIndex];
    
    // Validate status transition if status is being changed
    if (body.status && body.status !== currentOrder.status) {
      if (!canTransitionToStatus(currentOrder.status, body.status)) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Cannot transition from ${currentOrder.status} to ${body.status}` 
          },
          { status: 400 }
        );
      }
    }

    const updatedOrder = {
      ...currentOrder,
      ...body,
      updatedAt: new Date().toISOString()
    };

    orders[orderIndex] = updatedOrder;

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error updating order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderIndex = orders.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    orders.splice(orderIndex, 1);

    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error deleting order' },
      { status: 500 }
    );
  }
}