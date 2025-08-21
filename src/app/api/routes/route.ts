import { NextRequest, NextResponse } from 'next/server';
import { mockRoutes } from '@/data/mockRoutes';
import { Route } from '@/types/route';

// GET /api/routes - Get all routes with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredRoutes = [...mockRoutes];

    // Apply status filter
    if (status && status !== 'all') {
      filteredRoutes = filteredRoutes.filter(route => route.status === status);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRoutes = filteredRoutes.filter(route =>
        route.name.toLowerCase().includes(searchLower) ||
        route.description?.toLowerCase().includes(searchLower) ||
        route.orders.some(order => order.orderId.toLowerCase().includes(searchLower))
      );
    }

    // Sort by updatedAt (most recent first)
    filteredRoutes.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Calculate metrics
    const metrics = {
      total: mockRoutes.length,
      active: mockRoutes.filter(r => r.status === 'active').length,
      draft: mockRoutes.filter(r => r.status === 'draft').length,
      completed: mockRoutes.filter(r => r.status === 'completed').length,
      totalOrders: mockRoutes.reduce((sum, r) => sum + r.orders.length, 0),
      totalDistance: calculateTotalDistance(mockRoutes),
      averageTime: calculateAverageTime(mockRoutes)
    };

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRoutes = filteredRoutes.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        routes: paginatedRoutes,
        metrics,
        pagination: {
          page,
          limit,
          total: filteredRoutes.length,
          totalPages: Math.ceil(filteredRoutes.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/routes - Create a new route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Route name is required' },
        { status: 400 }
      );
    }

    // Create new route
    const newRoute: Route = {
      id: `route-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      color: body.color || 'bg-blue-500',
      orders: body.orders || [],
      totalDistance: body.totalDistance || '0 km',
      estimatedTime: body.estimatedTime || '0 min',
      status: body.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock data (in a real app, this would be saved to database)
    mockRoutes.push(newRoute);

    return NextResponse.json({
      success: true,
      data: newRoute
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateTotalDistance(routes: Route[]): string {
  const totalKm = routes.reduce((sum, route) => {
    const km = parseFloat(route.totalDistance?.replace(' km', '') || '0');
    return sum + km;
  }, 0);
  return `${totalKm.toFixed(1)} km`;
}

function calculateAverageTime(routes: Route[]): string {
  const activeRoutes = routes.filter(r => r.status === 'active');
  if (activeRoutes.length === 0) return '0 min';
  
  const totalMinutes = activeRoutes.reduce((sum, route) => {
    const time = route.estimatedTime || '0 min';
    const minutes = parseTimeToMinutes(time);
    return sum + minutes;
  }, 0);
  
  const avgMinutes = Math.round(totalMinutes / activeRoutes.length);
  return formatMinutesToTime(avgMinutes);
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