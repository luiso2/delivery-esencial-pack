import { NextRequest, NextResponse } from 'next/server';
import { mockRoutes } from '@/data/mockRoutes';
import { Route } from '@/types/route';

// GET /api/routes/[id] - Get a single route
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const route = mockRoutes.find(r => r.id === params.id);
    
    if (!route) {
      return NextResponse.json(
        { success: false, error: 'Route not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/routes/[id] - Update a route
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const routeIndex = mockRoutes.findIndex(r => r.id === params.id);
    
    if (routeIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Route not found' },
        { status: 404 }
      );
    }

    // Update route
    const updatedRoute: Route = {
      ...mockRoutes[routeIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    // Update in mock data (in a real app, this would be saved to database)
    mockRoutes[routeIndex] = updatedRoute;

    return NextResponse.json({
      success: true,
      data: updatedRoute
    });
  } catch (error) {
    console.error('Error updating route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/routes/[id] - Delete a route
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const routeIndex = mockRoutes.findIndex(r => r.id === params.id);
    
    if (routeIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Route not found' },
        { status: 404 }
      );
    }

    // Remove from mock data (in a real app, this would be deleted from database)
    const deletedRoute = mockRoutes.splice(routeIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedRoute
    });
  } catch (error) {
    console.error('Error deleting route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/routes/[id] - Partially update a route (e.g., add/remove orders)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const routeIndex = mockRoutes.findIndex(r => r.id === params.id);
    
    if (routeIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Route not found' },
        { status: 404 }
      );
    }

    const currentRoute = mockRoutes[routeIndex];

    // Handle specific operations
    if (body.operation === 'add_order') {
      const newOrder = {
        orderId: body.orderId,
        position: currentRoute.orders.length + 1,
        estimatedTime: body.estimatedTime || '10 min',
        distance: body.distance || '2 km'
      };
      
      currentRoute.orders.push(newOrder);
      currentRoute.updatedAt = new Date().toISOString();
      
      // Recalculate totals
      updateRouteTotals(currentRoute);
      
    } else if (body.operation === 'remove_order') {
      currentRoute.orders = currentRoute.orders.filter(o => o.orderId !== body.orderId);
      
      // Reposition remaining orders
      currentRoute.orders.forEach((order, index) => {
        order.position = index + 1;
      });
      
      currentRoute.updatedAt = new Date().toISOString();
      
      // Recalculate totals
      updateRouteTotals(currentRoute);
      
    } else if (body.operation === 'reorder') {
      currentRoute.orders = body.orders;
      currentRoute.updatedAt = new Date().toISOString();
      
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid operation' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: currentRoute
    });
  } catch (error) {
    console.error('Error patching route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update route totals
function updateRouteTotals(route: Route) {
  // Calculate total distance
  const totalKm = route.orders.reduce((sum, order) => {
    const km = parseFloat(order.distance?.replace(' km', '') || '0');
    return sum + km;
  }, 0);
  route.totalDistance = `${totalKm.toFixed(1)} km`;

  // Calculate total time
  const totalMinutes = route.orders.reduce((sum, order) => {
    const time = order.estimatedTime || '0 min';
    const minutes = parseTimeToMinutes(time);
    return sum + minutes;
  }, 0);
  route.estimatedTime = formatMinutesToTime(totalMinutes);
}

function parseTimeToMinutes(time: string): number {
  const hourMatch = time.match(/(\d+)h/);
  const minuteMatch = time.match(/(\d+)min/);
  
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  
  return hours * 60 + minutes;
}

function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins} min`;
}