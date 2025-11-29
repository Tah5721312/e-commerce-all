import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: { status?: OrderStatus } | {} =
      status && status !== 'all'
        ? { status: status as OrderStatus }
        : {};

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            orderBy: {
              id: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders.map((order) => ({
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
        stripePaymentIntentId: order.stripePaymentIntentId,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productTitle: item.productTitle,
          productPrice: Number(item.productPrice),
          quantity: item.quantity,
          subtotal: Number(item.subtotal),
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}

