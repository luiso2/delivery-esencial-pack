import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/data/mockOrders';
import { mockRoutes } from '@/data/mockRoutes';
import { isOrderDelayed } from '@/types/order';

export async function GET(request: NextRequest) {
  try {
    const orders = [...mockOrders];
    
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const inTransit = orders.filter(o => o.status === 'in_transit').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const failed = orders.filter(o => o.status === 'failed').length;
    const incomplete = orders.filter(o => o.status === 'incomplete').length;
    
    const delayed = orders.filter(o => isOrderDelayed(o)).length;
    
    const todayDeliveries = orders.filter(o => {
      const today = new Date();
      const deliveryDate = new Date(o.estimatedDelivery);
      return (
        deliveryDate.getDate() === today.getDate() &&
        deliveryDate.getMonth() === today.getMonth() &&
        deliveryDate.getFullYear() === today.getFullYear()
      );
    }).length;
    
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.driverPayment, 0);
    
    const pendingCaptures = orders.filter(o => o.captureStatus === 'pending').length;
    const failedCaptures = orders.filter(o => o.captureStatus === 'failed').length;
    const successCaptures = orders.filter(o => o.captureStatus === 'success').length;
    const partialCaptures = orders.filter(o => o.captureStatus === 'partial').length;

    // Calculate route metrics
    const routeMetrics = {
      total: mockRoutes.length,
      active: mockRoutes.filter(r => r.status === 'active').length,
      draft: mockRoutes.filter(r => r.status === 'draft').length,
      completed: mockRoutes.filter(r => r.status === 'completed').length,
      totalOrders: mockRoutes.reduce((sum, r) => sum + r.orders.length, 0)
    };

    const metrics = {
      orders: {
        total,
        pending,
        inTransit,
        delivered,
        failed,
        incomplete,
        delayed,
        todayDeliveries
      },
      captures: {
        pending: pendingCaptures,
        failed: failedCaptures,
        success: successCaptures,
        partial: partialCaptures
      },
      revenue: {
        total: totalRevenue,
        pending: orders
          .filter(o => ['pending', 'in_transit'].includes(o.status))
          .reduce((sum, o) => sum + o.driverPayment, 0),
        average: total > 0 ? Math.round(totalRevenue / delivered) : 0
      },
      routes: routeMetrics
    };

    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error calculating metrics' },
      { status: 500 }
    );
  }
}