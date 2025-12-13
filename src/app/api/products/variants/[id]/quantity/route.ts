import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// PUT - Update variant quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid variant ID' },
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

    const variant = await prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    let newQuantity = variant.quantity;

    if (operation === 'add') {
      newQuantity = variant.quantity + (quantity || 0);
    } else if (operation === 'subtract') {
      newQuantity = Math.max(0, variant.quantity - (quantity || 0));
    } else {
      newQuantity = quantity;
    }

    const updated = await prisma.productVariant.update({
      where: { id },
      data: { quantity: newQuantity },
      include: {
        productColor: {
          include: {
            product: true,
          },
        },
        size: true,
      },
    });

    return NextResponse.json({
      data: updated,
    });
  } catch (error) {
    console.error('Error updating variant quantity:', error);
    return NextResponse.json(
      { error: 'Failed to update variant quantity' },
      { status: 500 }
    );
  }
}

