import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

// PUT - Update color quantity (for products without sizes)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid color ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { quantity, operation } = body; // operation: 'set', 'add', 'subtract'

    if (quantity === undefined && !operation) {
      return NextResponse.json(
        { error: 'Quantity or operation is required' },
        { status: 400 }
      );
    }

    const color = await prisma.productColor.findUnique({
      where: { id },
    });

    if (!color) {
      return NextResponse.json(
        { error: 'Color not found' },
        { status: 404 }
      );
    }

    let newQuantity = color.quantity;

    if (operation === 'add') {
      newQuantity = color.quantity + (quantity || 0);
    } else if (operation === 'subtract') {
      newQuantity = Math.max(0, color.quantity - (quantity || 0));
    } else {
      newQuantity = quantity;
    }

    const updated = await prisma.productColor.update({
      where: { id },
      data: { quantity: newQuantity },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      data: updated,
    });
  } catch (error) {
    console.error('Error updating color quantity:', error);
    return NextResponse.json(
      { error: 'Failed to update color quantity' },
      { status: 500 }
    );
  }
}

