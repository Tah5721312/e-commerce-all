import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import type { ProductSize } from '@/types/product';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { productColorId, size, quantityChange } = await request.json();

    if (!productColorId || !size || quantityChange === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the variant
    const variant = await prisma.productVariant.findFirst({
      where: {
        productColorId,
        size: size as ProductSize,
      },
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Calculate new quantity
    const newQuantity = variant.quantity + quantityChange;

    if (newQuantity < 0) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Update the quantity
    const updatedVariant = await prisma.productVariant.update({
      where: {
        id: variant.id,
      },
      data: {
        quantity: newQuantity,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedVariant,
    });
  } catch (error) {
    console.error('Error updating variant quantity:', error);
    return NextResponse.json(
      { error: 'Failed to update quantity' },
      { status: 500 }
    );
  }
}

