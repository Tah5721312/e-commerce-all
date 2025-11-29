import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Find order by order number
    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber,
      },
      include: {
        items: {
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerAddress: order.customerAddress,
        customerCity: order.customerCity,
        customerPostalCode: order.customerPostalCode,
        customerCountry: order.customerCountry,
        totalAmount: Number(order.totalAmount),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productTitle: item.productTitle,
          productPrice: Number(item.productPrice),
          quantity: item.quantity,
          subtotal: Number(item.subtotal),
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch order',
      },
      { status: 500 }
    );
  }
}

