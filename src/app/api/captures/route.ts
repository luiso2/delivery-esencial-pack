import { NextRequest, NextResponse } from 'next/server';
import { mockCaptures, captureStats } from '@/data/mockCaptures';
import { mockOrders } from '@/data/mockOrders';
import { Capture } from '@/types/capture';

// Simulate database
let captures = [...mockCaptures];

// GET /api/captures
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const orderId = searchParams.get('orderId');
    const includeOrders = searchParams.get('includeOrders') === 'true';

    let filteredCaptures = [...captures];

    // Apply filters
    if (status) {
      filteredCaptures = filteredCaptures.filter(capture => capture.status === status);
    }

    if (type) {
      filteredCaptures = filteredCaptures.filter(capture => capture.type === type);
    }

    if (orderId) {
      filteredCaptures = filteredCaptures.filter(capture => capture.orderId === orderId);
    }

    // Include order details if requested
    if (includeOrders) {
      filteredCaptures = filteredCaptures.map(capture => {
        const order = mockOrders.find(o => o.id === capture.orderId);
        return {
          ...capture,
          order
        };
      });
    }

    // Sort by capturedAt desc
    filteredCaptures.sort((a, b) => 
      new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
    );

    return NextResponse.json({ 
      success: true, 
      data: {
        captures: filteredCaptures,
        stats: captureStats
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching captures' },
      { status: 500 }
    );
  }
}

// POST /api/captures
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newCapture: Capture = {
      id: `CAP-${Date.now()}`,
      orderId: body.orderId,
      type: body.type || 'document',
      imageUrl: body.imageUrl || '/api/placeholder/400/300',
      thumbnailUrl: body.thumbnailUrl || '/api/placeholder/100/75',
      status: 'pending',
      location: body.location,
      metadata: body.metadata,
      notes: body.notes,
      capturedBy: body.capturedBy || 'Juan Pérez',
      capturedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    captures.unshift(newCapture);

    // Update order capture status
    const order = mockOrders.find(o => o.id === body.orderId);
    if (order) {
      order.captureStatus = 'success';
    }

    return NextResponse.json(
      { success: true, data: newCapture },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error creating capture' },
      { status: 500 }
    );
  }
}