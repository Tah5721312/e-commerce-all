import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

/**
 * POST /api/products/variants/get-quantity
 * جلب الكمية المتاحة لـ variant محدد
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { productColorId, sizeId } = await request.json();

    if (!productColorId || !sizeId) {
      return NextResponse.json(
        { error: 'productColorId and sizeId are required' },
        { status: 400 }
      );
    }

    // Find the variant
    const variant = await prisma.productVariant.findFirst({
      where: {
        productColorId: parseInt(productColorId),
        sizeId: parseInt(sizeId),
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found', quantity: 0 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      quantity: variant.quantity,
      variantId: variant.id,
    });
  } catch (error) {
    console.error('Error fetching variant quantity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variant quantity', quantity: 0 },
      { status: 500 }
    );
  }
}

