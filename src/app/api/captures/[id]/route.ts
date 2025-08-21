import { NextRequest, NextResponse } from 'next/server';
import { mockCaptures } from '@/data/mockCaptures';
import { Capture } from '@/types/capture';

// Simulate database
let captures = [...mockCaptures];

// GET /api/captures/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const capture = captures.find(c => c.id === params.id);
    
    if (!capture) {
      return NextResponse.json(
        { success: false, error: 'Capture not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: capture });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching capture' },
      { status: 500 }
    );
  }
}

// PUT /api/captures/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const captureIndex = captures.findIndex(c => c.id === params.id);
    
    if (captureIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Capture not found' },
        { status: 404 }
      );
    }

    const updatedCapture = {
      ...captures[captureIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    captures[captureIndex] = updatedCapture;

    return NextResponse.json({ success: true, data: updatedCapture });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error updating capture' },
      { status: 500 }
    );
  }
}

// DELETE /api/captures/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const captureIndex = captures.findIndex(c => c.id === params.id);
    
    if (captureIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Capture not found' },
        { status: 404 }
      );
    }

    captures.splice(captureIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error deleting capture' },
      { status: 500 }
    );
  }
}