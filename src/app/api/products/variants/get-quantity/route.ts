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

    const { productColorId, size } = await request.json();

    if (!productColorId || !size) {
      return NextResponse.json(
        { error: 'Missing required fields: productColorId and size' },
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

    return NextResponse.json({
      success: true,
      quantity: variant.quantity,
    });
  } catch (error) {
    console.error('Error getting variant quantity:', error);
    return NextResponse.json(
      { error: 'Failed to get quantity' },
      { status: 500 }
    );
  }
}

