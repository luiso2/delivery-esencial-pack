import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/data/mockOrders';
import { Order } from '@/types/order';
import { ApiResponse, PaginatedResponse } from '@/types/api';

// Simulate database
let orders = [...mockOrders];

// GET /api/orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const delayed = searchParams.get('delayed') === 'true';

    let filteredOrders = [...orders];

    // Apply filters
    if (status) {
      const statuses = status.split(',');
      filteredOrders = filteredOrders.filter(order => 
        statuses.includes(order.status)
      );
    }

    if (type) {
      filteredOrders = filteredOrders.filter(order => order.type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.clientName.toLowerCase().includes(searchLower) ||
        order.address.toLowerCase().includes(searchLower) ||
        order.municipality.toLowerCase().includes(searchLower)
      );
    }

    if (delayed) {
      const now = new Date();
      filteredOrders = filteredOrders.filter(order => {
        const estimatedDelivery = new Date(order.estimatedDelivery);
        return now > estimatedDelivery && !['delivered', 'failed'].includes(order.status);
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    const response: PaginatedResponse<Order> = {
      items: paginatedOrders,
      total: filteredOrders.length,
      page,
      pageSize: limit,
      hasMore: endIndex < filteredOrders.length
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOrder: Order = {
      ...body,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error creating order' },
      { status: 500 }
    );
  }
}