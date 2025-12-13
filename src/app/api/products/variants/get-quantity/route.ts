import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

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
        { error: 'Missing required fields: productColorId and sizeId' },
        { status: 400 }
      );
    }

    // Find the variant
    const variant = await prisma.productVariant.findFirst({
      where: {
        productColorId,
        sizeId,
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

