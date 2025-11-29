import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const body = await request.json();
    const { status } = body;

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = Object.values(OrderStatus);
    if (!validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update order
    const order = await prisma.order.update({
      where: {
        orderNumber: orderNumber,
      },
      data: {
        status: status as OrderStatus,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        updatedAt: order.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update order',
      },
      { status: 500 }
    );
  }
}

